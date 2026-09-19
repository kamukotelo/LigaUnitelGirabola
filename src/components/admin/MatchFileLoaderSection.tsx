'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import {
  UploadCloud, FileText, CheckCircle2, AlertTriangle, Loader2, Save,
  Users, Flag, Trophy, ShieldCheck, ArrowRight, Download, ExternalLink, RefreshCw
} from 'lucide-react';
import { getMatchesForSeason, UPCOMING_SEASON_ID, type Match } from '@/lib/data';
import TeamCrest from '@/components/ui/TeamCrest';
import {
  validateMatchFile,
  type MatchFilePayload,
  type MatchFileValidationResult,
} from '@/lib/match-file-parser';

export default function MatchFileLoaderSection() {
  const [file, setFile] = useState<File | null>(null);
  const [reading, setReading] = useState(false);
  const [publishing, setPublishing] = useState(false);

  const [validationResult, setValidationResult] = useState<MatchFileValidationResult | null>(null);
  const [selectedMatchId, setSelectedMatchId] = useState<string>('');

  const [feedback, setFeedback] = useState<{ ok: boolean; message: string; matchId?: string } | null>(null);

  const seasonMatches = useMemo(() => getMatchesForSeason(UPCOMING_SEASON_ID), []);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selected = e.target.files?.[0] || null;
    setFile(selected);
    setValidationResult(null);
    setFeedback(null);
  };

  const processFile = async () => {
    if (!file) return;
    setReading(true);
    setFeedback(null);
    try {
      if (file.name.toLowerCase().endsWith('.json') || file.type === 'application/json') {
        const text = await file.text();
        const json = JSON.parse(text);
        const result = validateMatchFile(json);
        setValidationResult(result);
        setSelectedMatchId(result.matchId || '');
      } else if (file.name.toLowerCase().endsWith('.pdf') || file.type === 'application/pdf') {
        // Enviar para a rota do servidor para extração completa
        const formData = new FormData();
        formData.append('file', file);
        const res = await fetch('/api/admin/match-file/load', {
          method: 'POST',
          body: formData,
        });
        const data = await res.json();
        if (!res.ok) {
          throw new Error(data.message || 'Erro ao processar o relatório PDF.');
        }
        setFeedback({
          ok: true,
          message: data.message || 'Relatório PDF processado e jogo atualizado com sucesso!',
          matchId: data.matchId,
        });
      } else {
        throw new Error('Formato de ficheiro não suportado. Utilize .json ou .pdf.');
      }
    } catch (err) {
      setFeedback({
        ok: false,
        message: (err as Error).message || 'Erro ao processar ficheiro.',
      });
    } finally {
      setReading(false);
    }
  };

  const publishToSite = async () => {
    if (!validationResult?.payloadNormalizado) return;
    const matchIdToUse = selectedMatchId || validationResult.matchId;
    if (!matchIdToUse) {
      setFeedback({ ok: false, message: 'Selecione um jogo de destino na lista.' });
      return;
    }

    setPublishing(true);
    setFeedback(null);
    try {
      const res = await fetch('/api/admin/match-file/load', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          payload: validationResult.payloadNormalizado,
          targetMatchId: matchIdToUse,
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.message || 'Erro ao atualizar o jogo no site.');
      }

      setFeedback({
        ok: true,
        message: data.message || `Jogo ${matchIdToUse} publicado com sucesso!`,
        matchId: data.matchId,
      });
    } catch (err) {
      setFeedback({
        ok: false,
        message: (err as Error).message || 'Erro na publicação do jogo.',
      });
    } finally {
      setPublishing(false);
    }
  };

  const payload = validationResult?.payloadNormalizado;

  return (
    <div className="space-y-6">
      {/* Cabeçalho */}
      <div>
        <div className="flex items-center gap-2 mb-1">
          <UploadCloud size={14} className="text-accent" />
          <span className="text-[10px] font-mono uppercase tracking-widest text-accent font-semibold">
            ARQUIVO_DE_JOGO_FCMS
          </span>
        </div>
        <h2 className="text-2xl md:text-3xl font-display text-foreground uppercase leading-none">
          Carregador de Jogo
        </h2>
        <p className="text-sm text-zinc-500 mt-2 max-w-2xl leading-relaxed">
          Carregue o ficheiro oficial de jogo (JSON estruturado ou Relatório do Árbitro FCMS em PDF).
          Ao carregar, o jogo escolhido é atualizado no site em tempo real com golos, cronologia, equipas de arbitragem, onzes titulares, equipa técnica e classificação.
        </p>
      </div>

      {/* Cartão de Templates e Modelos */}
      <div className="bg-zinc-100/40 dark:bg-zinc-950/40 border border-zinc-200 dark:border-zinc-900 rounded-2xl p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <p className="font-display text-foreground uppercase tracking-wider text-sm flex items-center gap-2">
            <FileText size={16} className="text-accent" />
            Modelos de Arquivo de Jogo
          </p>
          <p className="text-[11px] font-mono text-zinc-500">
            Descarregue o modelo padrão em branco para preenchimento ou o exemplo real preenchido com dados FCMS.
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <a
            href="/templates/modelo_arquivo_jogo_em_branco.json"
            download
            className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 text-zinc-700 dark:text-zinc-300 font-mono text-[11px] uppercase tracking-wider hover:text-foreground transition-colors shadow-sm"
          >
            <Download size={13} />
            Modelo em branco (.json)
          </a>
          <a
            href="/templates/exemplo_arquivo_jogo_fcms.json"
            download
            className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-accent/10 border border-accent/30 text-accent font-mono text-[11px] uppercase tracking-wider hover:bg-accent/20 transition-colors"
          >
            <Download size={13} />
            Exemplo FCMS (São Salvador × Petro)
          </a>
        </div>
      </div>

      {/* Área de Seleção de Ficheiro */}
      <div className="bg-zinc-100/40 dark:bg-zinc-950/40 border border-zinc-200 dark:border-zinc-900 rounded-2xl p-6 space-y-4">
        <div className="border border-dashed border-zinc-300 dark:border-zinc-700 rounded-2xl p-8 text-center bg-white/40 dark:bg-zinc-900/40">
          <UploadCloud className="mx-auto mb-3 text-accent" size={36} />
          <h3 className="text-sm font-semibold text-foreground uppercase tracking-wider">
            Selecione o Arquivo de Jogo ou Relatório do Árbitro
          </h3>
          <p className="mt-1 text-xs text-zinc-500 font-mono">
            Aceita ficheiros <strong className="text-foreground">.json</strong> (formato padrão de jogo) ou <strong className="text-foreground">.pdf</strong> (relatório oficial do FCMS) até 10 MB.
          </p>

          <input
            type="file"
            accept=".json,.pdf,application/json,application/pdf"
            onChange={handleFileChange}
            className="mt-5 block w-full max-w-sm mx-auto text-xs text-zinc-500 file:mr-3 file:rounded-xl file:border-0 file:bg-accent file:px-4 file:py-2.5 file:text-white file:font-semibold cursor-pointer"
          />

          {file && (
            <p className="mt-3 text-xs font-mono text-zinc-600 dark:text-zinc-400">
              Ficheiro selecionado: <strong className="text-foreground">{file.name}</strong> ({(file.size / 1024).toFixed(1)} KB)
            </p>
          )}
        </div>

        <button
          disabled={!file || reading || publishing}
          onClick={processFile}
          className="w-full py-3 rounded-xl bg-accent hover:bg-accent/90 text-white font-mono text-xs font-bold uppercase tracking-widest transition-opacity disabled:opacity-40 flex items-center justify-center gap-2 shadow-sm"
        >
          {reading ? <Loader2 size={15} className="animate-spin" /> : <RefreshCw size={15} />}
          {reading ? 'A processar e ler dados…' : 'Processar e Pré-visualizar'}
        </button>
      </div>

      {/* Feedback / Mensagens */}
      {feedback && (
        <div
          className={`p-4 rounded-2xl border text-sm font-mono flex items-start justify-between gap-3 ${
            feedback.ok
              ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-600 dark:text-emerald-400'
              : 'bg-red-500/10 border-red-500/30 text-red-500'
          }`}
        >
          <div className="flex items-center gap-2">
            {feedback.ok ? <CheckCircle2 size={16} className="flex-shrink-0" /> : <AlertTriangle size={16} className="flex-shrink-0" />}
            <span>{feedback.message}</span>
          </div>
          {feedback.ok && feedback.matchId && (
            <Link
              href={`/matches/${feedback.matchId}`}
              target="_blank"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-500 text-white text-xs font-bold uppercase tracking-wider hover:bg-emerald-600 transition-colors flex-shrink-0"
            >
              Ver no site <ExternalLink size={12} />
            </Link>
          )}
        </div>
      )}

      {/* Pré-visualização do Jogo e Indicadores de Sanidade */}
      {payload && validationResult && (
        <div className="space-y-6">
          {/* Seletor de Jogo Alvo */}
          <div className="bg-zinc-100/40 dark:bg-zinc-950/40 border border-zinc-200 dark:border-zinc-900 rounded-2xl p-5 space-y-3">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <label className="text-[10px] font-mono uppercase tracking-widest text-zinc-500 block">
                  Jogo de destino no calendário oficial
                </label>
                <select
                  value={selectedMatchId}
                  onChange={(e) => setSelectedMatchId(e.target.value)}
                  className="mt-1 w-full sm:w-96 px-3 py-2 rounded-xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 text-sm font-semibold text-foreground focus:outline-none focus:border-accent"
                >
                  <option value="">— Selecione o jogo —</option>
                  {seasonMatches.map((m) => (
                    <option key={m.id} value={m.id}>
                      J{m.round} · {m.homeTeam} × {m.awayTeam} ({m.id})
                    </option>
                  ))}
                </select>
              </div>

              <div className="text-right">
                <span className="text-[10px] font-mono text-zinc-500 uppercase tracking-widest block">
                  Estado de Validação
                </span>
                <span className={`inline-flex items-center gap-1.5 text-xs font-mono font-bold uppercase tracking-wider ${validationResult.valido ? 'text-emerald-500' : 'text-amber-500'}`}>
                  {validationResult.valido ? <CheckCircle2 size={13} /> : <AlertTriangle size={13} />}
                  {validationResult.valido ? 'Ficheiro validado' : 'Contém avisos'}
                </span>
              </div>
            </div>

            {/* Problemas / Avisos */}
            {validationResult.problemas.length > 0 && (
              <div className="space-y-1.5 pt-2 border-t border-zinc-200 dark:border-zinc-800">
                {validationResult.problemas.map((prob, idx) => (
                  <p
                    key={idx}
                    className={`text-xs font-mono flex items-center gap-1.5 ${prob.nivel === 'erro' ? 'text-red-500' : 'text-amber-500'}`}
                  >
                    <AlertTriangle size={12} className="flex-shrink-0" />
                    <span><b>[{prob.campo}]</b> {prob.mensagem}</span>
                  </p>
                ))}
              </div>
            )}
          </div>

          {/* Cartão de Placar e Informações Gerais */}
          <div className="bg-zinc-100/40 dark:bg-zinc-950/40 border border-zinc-200 dark:border-zinc-900 rounded-2xl p-6 relative overflow-hidden">
            <div className="flex flex-wrap items-center justify-between gap-3 mb-6 pb-4 border-b border-zinc-200 dark:border-zinc-800">
              <span className="px-3 py-1 rounded-full bg-accent/10 border border-accent/30 text-accent font-mono text-xs font-bold uppercase tracking-widest">
                Partida #{payload.detalhes.numeroPartida || '—'} · Jornada {payload.detalhes.jornada || '—'}
              </span>
              <span className="font-mono text-xs text-zinc-500">
                {payload.kickoff.data} às {payload.kickoff.hora} · {payload.localizacao.estadio}
              </span>
            </div>

            {/* Confronto */}
            <div className="grid grid-cols-3 items-center text-center gap-4 py-2">
              <div className="space-y-2">
                <TeamCrest teamId={payload.equipas.casa.id} size={64} className="mx-auto" />
                <p className="font-display uppercase text-sm sm:text-base font-bold text-foreground">
                  {payload.equipas.casa.nome}
                </p>
              </div>

              <div className="space-y-1">
                <div className="inline-block px-5 py-2 rounded-2xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 font-display text-3xl sm:text-4xl font-black text-foreground shadow-sm">
                  {payload.resultado.casa} : {payload.resultado.fora}
                </div>
                <p className="text-[10px] font-mono text-zinc-500 uppercase tracking-widest">
                  1.º Período: {payload.resultado.periodos?.primeiroPeriodo ? `${payload.resultado.periodos.primeiroPeriodo.casa}-${payload.resultado.periodos.primeiroPeriodo.fora}` : '—'}
                </p>
              </div>

              <div className="space-y-2">
                <TeamCrest teamId={payload.equipas.fora.id} size={64} className="mx-auto" />
                <p className="font-display uppercase text-sm sm:text-base font-bold text-foreground">
                  {payload.equipas.fora.nome}
                </p>
              </div>
            </div>
          </div>

          {/* Arbitragem e Oficiais */}
          <div className="bg-zinc-100/40 dark:bg-zinc-950/40 border border-zinc-200 dark:border-zinc-900 rounded-2xl p-5 space-y-2">
            <h4 className="text-xs font-mono uppercase tracking-widest text-zinc-500 flex items-center gap-2">
              <Flag size={14} className="text-accent" /> Equipa de Arbitragem Oficial
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3 text-xs font-mono pt-1 text-foreground">
              <div><span className="text-zinc-500 block text-[10px]">Árbitro Principal:</span> <b>{payload.oficiais.arbitro || '—'}</b></div>
              <div><span className="text-zinc-500 block text-[10px]">1.º Assistente:</span> {payload.oficiais.assistente1 || '—'}</div>
              <div><span className="text-zinc-500 block text-[10px]">2.º Assistente:</span> {payload.oficiais.assistente2 || '—'}</div>
              <div><span className="text-zinc-500 block text-[10px]">4.º Árbitro:</span> {payload.oficiais.quartoArbitro || '—'}</div>
            </div>
          </div>

          {/* Plantéis / Onzes Titulares */}
          {payload.escalacoes && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {/* Casa */}
              <div className="bg-zinc-100/40 dark:bg-zinc-950/40 border border-zinc-200 dark:border-zinc-900 rounded-2xl p-5 space-y-3">
                <div className="flex items-center justify-between pb-2 border-b border-zinc-200 dark:border-zinc-800">
                  <h4 className="font-display uppercase text-sm font-bold text-foreground">
                    {payload.equipas.casa.nome}
                  </h4>
                  <span className="text-xs font-mono text-emerald-500 font-bold">
                    {payload.escalacoes.casa.titulares?.length || 0} Titulares
                  </span>
                </div>
                <div className="space-y-1 max-h-56 overflow-y-auto pr-1 text-xs font-mono">
                  {(payload.escalacoes.casa.titulares || []).map((p, i) => (
                    <div key={i} className="flex items-center justify-between py-1 border-b border-zinc-200/50 dark:border-zinc-900/50">
                      <span className="text-zinc-500 w-6">#{p.numero}</span>
                      <span className="flex-1 font-medium">{p.nome}</span>
                      <span className="text-[10px] text-zinc-400">
                        {p.isGuardaRedes ? 'GK' : ''} {p.isCapitao ? '(C)' : ''}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Fora */}
              <div className="bg-zinc-100/40 dark:bg-zinc-950/40 border border-zinc-200 dark:border-zinc-900 rounded-2xl p-5 space-y-3">
                <div className="flex items-center justify-between pb-2 border-b border-zinc-200 dark:border-zinc-800">
                  <h4 className="font-display uppercase text-sm font-bold text-foreground">
                    {payload.equipas.fora.nome}
                  </h4>
                  <span className="text-xs font-mono text-emerald-500 font-bold">
                    {payload.escalacoes.fora.titulares?.length || 0} Titulares
                  </span>
                </div>
                <div className="space-y-1 max-h-56 overflow-y-auto pr-1 text-xs font-mono">
                  {(payload.escalacoes.fora.titulares || []).map((p, i) => (
                    <div key={i} className="flex items-center justify-between py-1 border-b border-zinc-200/50 dark:border-zinc-900/50">
                      <span className="text-zinc-500 w-6">#{p.numero}</span>
                      <span className="flex-1 font-medium">{p.nome}</span>
                      <span className="text-[10px] text-zinc-400">
                        {p.isGuardaRedes ? 'GK' : ''} {p.isCapitao ? '(C)' : ''}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Cronologia de Eventos */}
          <div className="bg-zinc-100/40 dark:bg-zinc-950/40 border border-zinc-200 dark:border-zinc-900 rounded-2xl p-5 space-y-3">
            <h4 className="text-xs font-mono uppercase tracking-widest text-zinc-500">
              Eventos da Partida ({payload.eventos.length} registados)
            </h4>
            <div className="space-y-1.5 text-xs font-mono">
              {payload.eventos.map((ev, i) => (
                <div
                  key={i}
                  className="flex items-center gap-3 p-2 rounded-xl bg-white/60 dark:bg-zinc-900/60 border border-zinc-200/60 dark:border-zinc-800/60"
                >
                  <span className="w-12 text-zinc-500 font-bold">
                    {ev.minuto}&apos;{ev.acrescimo ? `+${ev.acrescimo}'` : ''}
                  </span>
                  <span className={`px-2 py-0.5 rounded text-[10px] uppercase font-bold ${
                    ev.tipo === 'golo'
                      ? 'bg-green-500/10 text-green-500'
                      : ev.tipo === 'amarelo'
                      ? 'bg-yellow-500/10 text-yellow-600'
                      : ev.tipo === 'vermelho'
                      ? 'bg-red-500/10 text-red-500'
                      : 'bg-blue-500/10 text-blue-500'
                  }`}>
                    {ev.tipo}
                  </span>
                  <span className="text-zinc-500 uppercase text-[10px]">[{ev.equipa}]</span>
                  <span className="flex-1 font-medium text-foreground">
                    {ev.jogador || (ev.tipo === 'substituicao' ? `Sai: ${ev.jogadorSai} ➔ Entra: ${ev.jogadorEntra}` : '—')}
                  </span>
                  {ev.motivo && <span className="text-[11px] text-zinc-500 truncate max-w-xs">{ev.motivo}</span>}
                </div>
              ))}
            </div>
          </div>

          {/* Botão de Gravação Definitiva no Site */}
          <div className="p-6 rounded-2xl bg-gradient-to-r from-emerald-500/10 via-accent/10 to-primary/10 border border-emerald-500/30 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div>
              <p className="font-display uppercase text-sm font-bold text-foreground">
                Tudo pronto para atualizar o site?
              </p>
              <p className="text-xs font-mono text-zinc-500 mt-0.5">
                Atualiza resultados, marcadores, ficha de jogo, nomeação de árbitros e classificação instantaneamente.
              </p>
            </div>
            <button
              onClick={publishToSite}
              disabled={publishing}
              className="w-full sm:w-auto px-6 py-3.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-mono text-xs font-bold uppercase tracking-widest transition-all shadow-md flex items-center justify-center gap-2 disabled:opacity-50 flex-shrink-0"
            >
              {publishing ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />}
              {publishing ? 'A atualizar o site…' : 'Carregar e Atualizar no Site'}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
