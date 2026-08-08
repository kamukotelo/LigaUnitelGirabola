import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { createHash } from 'crypto';
import { ADMIN_COOKIE, isValidSession } from '@/lib/admin-auth';
import { getSupabaseAdmin } from '@/lib/supabase-admin';
import type { NewsArticle } from '@/lib/data';

export const dynamic = 'force-dynamic';
export const maxDuration = 60;

const TRUSTED_SOURCES = new Set(['ANGOP', 'Jornal de Angola', 'Rádio Nacional de Angola', 'RNA']);
const DEFAULT_FEED = 'https://news.google.com/rss/search?q=%28Girabola+OR+ANCAF%29+%28site%3Aangop.ao+OR+site%3Ajornaldeangola.ao+OR+site%3Arna.ao%29&hl=pt-PT&gl=AO&ceid=AO%3Apt-419';

function decodeXml(value: string): string {
  return value
    .replace(/<!\[CDATA\[([\s\S]*?)\]\]>/g, '$1')
    .replace(/<[^>]+>/g, ' ')
    .replace(/&amp;/g, '&').replace(/&quot;/g, '"').replace(/&#39;|&apos;/g, "'")
    .replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/\s+/g, ' ').trim();
}

function tag(xml: string, name: string): string {
  return decodeXml(xml.match(new RegExp(`<${name}(?:\\s[^>]*)?>([\\s\\S]*?)<\\/${name}>`, 'i'))?.[1] ?? '');
}

function sourceName(item: string): string {
  const source = tag(item, 'source');
  if (/angop/i.test(source)) return 'ANGOP';
  if (/jornal de angola/i.test(source)) return 'Jornal de Angola';
  if (/rádio nacional|radio nacional|\brna\b/i.test(source)) return 'Rádio Nacional de Angola';
  return source;
}

async function rewriteWithAi(title: string, excerpt: string, source: string): Promise<{ title: string; summary: string; content: string } | null> {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) return null;
  const response = await fetch('https://api.openai.com/v1/responses', {
    method: 'POST',
    headers: { Authorization: `Bearer ${apiKey}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({
      model: process.env.NEWS_AI_MODEL || 'gpt-5-mini',
      instructions: 'És editor da Liga Unitel Girabola. Reescreve apenas os factos fornecidos, em português de Angola, sem inventar nomes, números, citações ou contexto. Não copies frases da fonte. Responde exclusivamente em JSON válido com title, summary e content. summary deve ter 25-45 palavras; content, 2-4 parágrafos curtos. Atribui claramente a informação à fonte.',
      input: JSON.stringify({ title, excerpt, source }),
      text: { format: { type: 'json_schema', name: 'news_article', strict: true, schema: { type: 'object', additionalProperties: false, properties: { title: { type: 'string' }, summary: { type: 'string' }, content: { type: 'string' } }, required: ['title', 'summary', 'content'] } } },
    }),
  });
  if (!response.ok) return null;
  const data = await response.json();
  const output = data.output_text ?? data.output?.flatMap((entry: { content?: { text?: string }[] }) => entry.content ?? []).map((entry: { text?: string }) => entry.text ?? '').join('');
  try { return JSON.parse(output); } catch { return null; }
}

async function collectArticles(): Promise<NewsArticle[]> {
  const feedUrl = process.env.NEWS_FEED_URL || DEFAULT_FEED;
  const response = await fetch(feedUrl, { headers: { 'User-Agent': 'LigaUnitelGirabola/1.0' }, next: { revalidate: 0 } });
  if (!response.ok) throw new Error(`Fonte de notícias indisponível (${response.status}).`);
  const xml = await response.text();
  const items = [...xml.matchAll(/<item>([\s\S]*?)<\/item>/gi)].slice(0, 8).map((match) => match[1]);
  const articles: NewsArticle[] = [];

  for (const item of items) {
    const originalTitle = tag(item, 'title').replace(/\s+-\s+[^-]+$/, '').trim();
    const link = tag(item, 'link');
    const excerpt = tag(item, 'description');
    const source = sourceName(item);
    if (!originalTitle || !link || !TRUSTED_SOURCES.has(source)) continue;
    if (!/girabola|ancaf|petro|1.?º?\s*de agosto|kabuscorp|wiliete|sagrada|interclube|lunda|libolo|maquis/i.test(`${originalTitle} ${excerpt}`)) continue;

    const ai = await rewriteWithAi(originalTitle, excerpt, source);
    const isoDate = new Date(tag(item, 'pubDate') || Date.now()).toISOString().slice(0, 10);
    const automaticPublish = process.env.NEWS_AUTO_PUBLISH !== 'false' && Boolean(ai);
    articles.push({
      id: `news-auto-${createHash('sha1').update(link).digest('hex').slice(0, 14)}`,
      title: ai?.title || originalTitle,
      category: 'Girabola',
      date: new Date(`${isoDate}T12:00:00Z`).toLocaleDateString('pt-AO', { day: '2-digit', month: 'short', year: 'numeric' }),
      isoDate,
      summary: ai?.summary || excerpt.slice(0, 240),
      content: ai?.content || `${excerpt}\n\nInformação recolhida automaticamente de ${source}. Aguarda revisão editorial antes da publicação.`,
      status: automaticPublish ? 'published' : 'pending_review',
      author: 'Redação Liga Unitel Girabola', sourceName: source, sourceUrl: link,
      verifiedBy: automaticPublish ? 'Automação editorial verificada' : '',
      reviewedAt: automaticPublish ? new Date().toISOString() : undefined,
      publishedAt: automaticPublish ? new Date().toISOString() : undefined,
      aiAssisted: Boolean(ai),
    });
  }
  return articles;
}

async function persistArticles(incoming: NewsArticle[]) {
  const admin = getSupabaseAdmin();
  const key = 'override_news';
  const { data } = await admin.from('ancaf_configs').select('value').eq('key', key).maybeSingle();
  let store: { overrides: Record<string, Partial<NewsArticle>>; added: NewsArticle[]; deleted: string[] } = { overrides: {}, added: [], deleted: [] };
  try { if (data?.value) store = { ...store, ...JSON.parse(data.value) }; } catch { /* mantém estrutura vazia */ }
  const known = new Set(store.added.map((article) => article.sourceUrl));
  const fresh = incoming.filter((article) => !known.has(article.sourceUrl));
  if (!fresh.length) return 0;
  store.added = [...fresh, ...store.added].slice(0, 250);
  const { error } = await admin.from('ancaf_configs').upsert({ key, value: JSON.stringify(store) }, { onConflict: 'key' });
  if (error) throw error;
  return fresh.length;
}

export async function POST() {
  const session = (await cookies()).get(ADMIN_COOKIE)?.value;
  if (!isValidSession(session)) return NextResponse.json({ message: 'Sessão administrativa inválida.' }, { status: 401 });
  try { return NextResponse.json({ articles: await collectArticles() }); }
  catch (error) { return NextResponse.json({ message: error instanceof Error ? error.message : 'Falha na pesquisa.' }, { status: 502 }); }
}

export async function GET(request: Request) {
  const secret = process.env.CRON_SECRET;
  if (!secret || request.headers.get('authorization') !== `Bearer ${secret}`) return NextResponse.json({ message: 'Não autorizado.' }, { status: 401 });
  try {
    const articles = await collectArticles();
    const published = await persistArticles(articles);
    return NextResponse.json({ ok: true, found: articles.length, published });
  } catch (error) {
    return NextResponse.json({ message: error instanceof Error ? error.message : 'Falha na automação.' }, { status: 502 });
  }
}
