import 'server-only';

import { createHash } from 'crypto';
import {
  SEASONS,
  getMatchesForSeason,
  getTeamFullName,
  type Match,
  type NewsArticle,
} from '@/lib/data';
import { getSupabaseAdmin } from '@/lib/supabase-admin';

type MatchPatch = Partial<Match>;
type CalendarStore = Record<string, MatchPatch>;

const AUTOMATION_STATUS_KEY = 'automation_match_update_status';
const DEFAULT_RECIPIENTS = [
  'kamukotelo@ancaf.co.ao',
  'emanuel.valodia@ancaf.co.ao',
  'rivaldo.domingues@ancaf.co.ao',
  'derby.candido@ancaf.co.ao',
];

interface AutomationStatus {
  completedAt: string;
  changedMatchIds: string[];
  articleId?: string;
  email: 'sent' | 'not_configured' | 'failed';
  recipients: string[];
  message?: string;
}

function parseCalendar(value: string | null | undefined): CalendarStore {
  try {
    const parsed = JSON.parse(value || '{}');
    return parsed && typeof parsed === 'object' && !Array.isArray(parsed) ? parsed as CalendarStore : {};
  } catch {
    return {};
  }
}

function changedMatchIds(previous: CalendarStore, current: CalendarStore): string[] {
  const ids = new Set([...Object.keys(previous), ...Object.keys(current)]);
  return [...ids].filter((id) => JSON.stringify(previous[id] ?? null) !== JSON.stringify(current[id] ?? null));
}

function matchIndex(): Map<string, Match> {
  const index = new Map<string, Match>();
  for (const season of SEASONS) {
    for (const match of getMatchesForSeason(season.id)) index.set(match.id, match);
  }
  return index;
}

function describeMatch(match: Match, patch: MatchPatch): string {
  const home = getTeamFullName(match.homeTeamId, match.homeTeam);
  const away = getTeamFullName(match.awayTeamId, match.awayTeam);
  const score = `${match.homeScore ?? 0}-${match.awayScore ?? 0}`;
  const details: string[] = [];

  if (match.status === 'finished') details.push(`terminou ${home} ${score} ${away}`);
  else if (match.status === 'live') details.push(`está em direto: ${home} ${score} ${away}`);
  else details.push(`${home}–${away} permanece agendado`);

  if ('date' in patch && match.date) {
    details.push(`data ${new Date(match.date).toLocaleString('pt-AO', { timeZone: 'Africa/Luanda', dateStyle: 'medium', timeStyle: 'short' })}`);
  }
  if ('stadium' in patch && match.stadium) details.push(`estádio ${match.stadium}`);
  if ('referee' in patch && match.referee) details.push(`árbitro ${match.referee}`);
  if ('attendance' in patch && typeof match.attendance === 'number') details.push(`assistência ${match.attendance.toLocaleString('pt-AO')}`);
  return `Jornada ${match.round}: ${details.join('; ')}.`;
}

async function rewriteMatchUpdateWithAi(facts: string[]): Promise<{ title: string; summary: string; content: string } | null> {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) return null;

  const response = await fetch('https://api.openai.com/v1/responses', {
    method: 'POST',
    headers: { Authorization: `Bearer ${apiKey}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({
      model: process.env.NEWS_AI_MODEL || 'gpt-5-mini',
      instructions: 'És editor da Liga Unitel Girabola. Cria um rascunho factual em português de Angola usando exclusivamente os factos fornecidos. Não inventes nomes, golos, autores, citações, contexto ou estatísticas. Explica que jogos e classificação foram atualizados. Responde apenas em JSON válido com title, summary e content. O resumo deve ter 25-45 palavras e o conteúdo 2-4 parágrafos curtos.',
      input: JSON.stringify({ facts }),
      text: {
        format: {
          type: 'json_schema',
          name: 'match_update_article',
          strict: true,
          schema: {
            type: 'object',
            additionalProperties: false,
            properties: {
              title: { type: 'string' },
              summary: { type: 'string' },
              content: { type: 'string' },
            },
            required: ['title', 'summary', 'content'],
          },
        },
      },
    }),
  });
  if (!response.ok) return null;
  const data = await response.json();
  const output = data.output_text
    ?? data.output?.flatMap((entry: { content?: { text?: string }[] }) => entry.content ?? [])
      .map((entry: { text?: string }) => entry.text ?? '').join('');
  try { return JSON.parse(output); } catch { return null; }
}

function recipients(): string[] {
  const configured = process.env.EDITORIAL_NOTIFICATION_EMAILS
    ?.split(',')
    .map((email) => email.trim().toLocaleLowerCase())
    .filter(Boolean);
  return [...new Set(configured?.length ? configured : DEFAULT_RECIPIENTS)];
}

function escapeHtml(value: string): string {
  return value.replace(/[&<>'"]/g, (character) => ({
    '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#39;', '"': '&quot;',
  })[character] ?? character);
}

async function notifyEditors(article: NewsArticle, facts: string[]): Promise<Pick<AutomationStatus, 'email' | 'recipients' | 'message'>> {
  const apiKey = process.env.RESEND_API_KEY;
  const from = process.env.NEWS_NOTIFICATION_FROM;
  const to = recipients();
  if (!apiKey || !from) {
    return { email: 'not_configured', recipients: to, message: 'RESEND_API_KEY ou NEWS_NOTIFICATION_FROM não configurado.' };
  }

  const adminUrl = `${process.env.NEXT_PUBLIC_SITE_URL || 'https://ligaunitelgirabola.com'}/adminancaf2026`;
  const response = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: { Authorization: `Bearer ${apiKey}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({
      from,
      to,
      subject: `[Revisão editorial] ${article.title}`,
      html: `<h2>${escapeHtml(article.title)}</h2><p>${escapeHtml(article.summary)}</p><ul>${facts.map((fact) => `<li>${escapeHtml(fact)}</li>`).join('')}</ul><p><a href="${adminUrl}">Abrir o painel e rever a notícia</a></p><p>O conteúdo está em “A validar” e não foi publicado automaticamente.</p>`,
    }),
  });
  if (!response.ok) {
    const message = await response.text();
    return { email: 'failed', recipients: to, message: `Serviço de e-mail respondeu ${response.status}: ${message.slice(0, 300)}` };
  }
  return { email: 'sent', recipients: to };
}

async function saveStatus(status: AutomationStatus): Promise<void> {
  const admin = getSupabaseAdmin();
  await admin.from('ancaf_configs').upsert({ key: AUTOMATION_STATUS_KEY, value: JSON.stringify(status) }, { onConflict: 'key' });
}

export async function processCalendarUpdate(previousValue: string | null | undefined, currentValue: unknown): Promise<void> {
  const previous = parseCalendar(previousValue);
  const current = parseCalendar(JSON.stringify(currentValue ?? {}));
  const ids = changedMatchIds(previous, current);
  if (!ids.length) return;

  const matches = matchIndex();
  const updated = ids
    .map((id) => {
      const base = matches.get(id);
      return base ? { match: { ...base, ...(current[id] ?? {}) }, patch: current[id] ?? {}, id } : null;
    })
    .filter((entry): entry is { match: Match; patch: MatchPatch; id: string } => Boolean(entry));
  if (!updated.length) return;

  const facts = updated.map(({ match, patch }) => describeMatch(match, patch));
  const ai = await rewriteMatchUpdateWithAi(facts);
  const now = new Date();
  const signature = createHash('sha1').update(JSON.stringify(updated.map(({ id, patch }) => [id, patch]))).digest('hex').slice(0, 16);
  const article: NewsArticle = {
    id: `news-match-update-${signature}`,
    title: ai?.title || (updated.length === 1 ? 'Jogo e classificação atualizados na plataforma' : `${updated.length} jogos e classificação atualizados`),
    category: 'Girabola',
    date: now.toLocaleDateString('pt-AO', { day: '2-digit', month: 'short', year: 'numeric', timeZone: 'Africa/Luanda' }),
    isoDate: now.toLocaleDateString('en-CA', { timeZone: 'Africa/Luanda' }),
    summary: ai?.summary || `A plataforma registou novas informações em ${updated.length} jogo(s). Os resultados e a tabela classificativa foram recalculados e o conteúdo aguarda validação da equipa editorial.`,
    content: ai?.content || `${facts.join('\n\n')}\n\nA classificação é recalculada automaticamente a partir dos jogos terminados. Esta notícia aguarda revisão editorial antes da publicação.`,
    status: 'pending_review',
    author: 'Automação Liga Unitel Girabola',
    sourceName: 'Plataforma Liga Unitel Girabola',
    sourceUrl: `${process.env.NEXT_PUBLIC_SITE_URL || 'https://ligaunitelgirabola.com'}/matches/${updated[0].id}`,
    verifiedBy: '',
    aiAssisted: Boolean(ai),
  };

  const admin = getSupabaseAdmin();
  // Rascunhos automáticos são conteúdo editorial próprio; não devem viver em
  // JSON de configuração. O painel consegue revê-los e publicá-los a partir
  // da mesma tabela que serve as restantes notícias.
  const { error: newsError } = await admin.from('ancaf_news').upsert({
    id: article.id,
    title: article.title,
    category: article.category,
    date: new Date().toISOString(),
    iso_date: article.isoDate,
    summary: article.summary,
    content: article.content,
    status: article.status,
    author: article.author,
    source_name: article.sourceName,
    source_url: article.sourceUrl,
    published_at: null,
    document_images: [],
    document_url: null,
    ai_assisted: article.aiAssisted === true,
  }, { onConflict: 'id' });
  if (newsError) throw newsError;

  const notification = await notifyEditors(article, facts);
  await saveStatus({
    completedAt: new Date().toISOString(),
    changedMatchIds: ids,
    articleId: article.id,
    ...notification,
  });
}
