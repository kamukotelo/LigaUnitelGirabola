'use client';

import React, { useState, useEffect } from 'react';
import { X, Calendar, Clock, AlertTriangle, ShieldCheck, Trash2, CheckCircle2, Loader2, Save } from 'lucide-react';
import { TEAMS, type Match } from '@/lib/data';

interface EditMatchModalProps {
  isOpen: boolean;
  match: Match | null;
  matchNumber?: number;
  matchDay?: number;
  onClose: () => void;
  onSave: (matchId: string, patch: Partial<Match> & { matchNumber?: number; matchDay?: number }) => Promise<void>;
  onDelete?: (matchId: string) => Promise<void>;
}

const OFFICIAL_STADIUMS = [
  'Estádio França Ndalu',
  'Estádio 11 de Novembro',
  'Estádio Municipal de Benguela',
  'Estádio Álvaro Buta',
  'Estádio da Tundavala',
  'Estádio dos Coqueiros',
  'Estádio do Santos',
  'Estádio do Buraco',
  'Estádio Mártires da Canhala',
  'Estádio do Tafe',
  'Estádio 1.º de Maio',
  'Estádio Comandante Jones Kufuna Yembe',
  'Estádio 4 de Janeiro',
];

export default function EditMatchModal({
  isOpen,
  match,
  matchNumber,
  matchDay,
  onClose,
  onSave,
  onDelete,
}: EditMatchModalProps) {
  const [partidaNum, setPartidaNum] = useState<number>(matchNumber || 1);
  const [jornadaNum, setJornadaNum] = useState<number>(match?.round || 1);
  const [diaJogoNum, setDiaJogoNum] = useState<number>(matchDay || 1);

  const [dateStr, setDateStr] = useState<string>('');
  const [timeStr, setTimeStr] = useState<string>('15:30');
  const [timeZone, setTimeZone] = useState<string>('(UTC+1) Africa/Luanda');

  const [homeTeamId, setHomeTeamId] = useState<string>('');
  const [awayTeamId, setAwayTeamId] = useState<string>('');
  const [stadium, setStadium] = useState<string>('');

  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  useEffect(() => {
    if (match) {
      setPartidaNum(matchNumber || 1);
      setJornadaNum(match.round);
      setDiaJogoNum(matchDay || match.round * 4);

      if (match.date) {
        const d = new Date(match.date);
        if (!isNaN(d.getTime())) {
          const yyyy = d.getFullYear();
          const mm = String(d.getMonth() + 1).padStart(2, '0');
          const dd = String(d.getDate()).padStart(2, '0');
          setDateStr(`${yyyy}-${mm}-${dd}`);

          const hh = String(d.getHours()).padStart(2, '0');
          const min = String(d.getMinutes()).padStart(2, '0');
          setTimeStr(`${hh}:${min}`);
        }
      }

      setHomeTeamId(match.homeTeamId);
      setAwayTeamId(match.awayTeamId);
      setStadium(match.stadium || OFFICIAL_STADIUMS[0]);
      setTimeZone('(UTC+1) Africa/Luanda');
      setError(null);
      setShowDeleteConfirm(false);
    }
  }, [match, matchNumber, matchDay, isOpen]);

  if (!isOpen || !match) return null;

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!homeTeamId || !awayTeamId) {
      setError('Por favor selecione ambas as equipas.');
      return;
    }

    if (homeTeamId === awayTeamId) {
      setError('A equipa local e visitante não podem ser a mesma.');
      return;
    }

    if (!dateStr || !timeStr) {
      setError('A data e a hora do jogo são obrigatórias.');
      return;
    }

    setSaving(true);
    try {
      const combinedIso = `${dateStr}T${timeStr}:00+01:00`;
      const selectedHome = TEAMS.find((t) => t.id === homeTeamId);
      const selectedAway = TEAMS.find((t) => t.id === awayTeamId);

      await onSave(match.id, {
        homeTeamId,
        awayTeamId,
        homeTeam: selectedHome?.name || match.homeTeam,
        awayTeam: selectedAway?.name || match.awayTeam,
        stadium,
        date: combinedIso,
        round: jornadaNum,
        matchNumber: partidaNum,
        matchDay: diaJogoNum,
        scheduleStatus: 'official',
      });
      onClose();
    } catch (err) {
      setError((err as Error).message || 'Erro ao guardar as alterações.');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!onDelete) return;
    setSaving(true);
    try {
      await onDelete(match.id);
      onClose();
    } catch (err) {
      setError((err as Error).message || 'Erro ao eliminar a partida.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fadeIn">
      <div className="relative w-full max-w-2xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-3xl shadow-2xl overflow-hidden text-zinc-800 dark:text-zinc-200">
        
        {/* Cabeçalho */}
        <div className="flex items-center justify-between px-6 pt-6 pb-4 border-b border-zinc-100 dark:border-zinc-800">
          <div>
            <h2 className="text-xl font-bold font-display uppercase tracking-tight text-foreground">
              Editar partida
            </h2>
            <p className="text-[11px] font-mono text-zinc-400">
              ID Operacional: <span className="text-primary font-bold">{match.id}</span>
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-full text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
          >
            <X size={18} />
          </button>
        </div>

        {/* Formulário */}
        <form onSubmit={handleSave} className="p-6 space-y-6 max-h-[75vh] overflow-y-auto">
          
          {error && (
            <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/30 text-red-500 text-xs font-mono flex items-center gap-2">
              <AlertTriangle size={15} className="flex-shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {/* Secção DETALHES */}
          <div className="grid grid-cols-1 md:grid-cols-[110px_1fr] gap-4 items-start">
            <span className="text-xs font-mono font-bold uppercase tracking-wider text-zinc-500 pt-2">
              DETALHES
            </span>
            <div className="grid grid-cols-3 gap-3">
              <div className="relative">
                <label className="absolute -top-2 left-3 bg-white dark:bg-zinc-900 px-1 text-[10px] font-mono text-zinc-500">
                  N.º da partida
                </label>
                <input
                  type="number"
                  value={partidaNum}
                  onChange={(e) => setPartidaNum(parseInt(e.target.value, 10) || 1)}
                  className="w-full h-11 px-3 bg-transparent border border-zinc-300 dark:border-zinc-700 rounded-lg text-sm font-medium focus:border-blue-600 focus:outline-none"
                />
              </div>

              <div className="relative">
                <label className="absolute -top-2 left-3 bg-white dark:bg-zinc-900 px-1 text-[10px] font-mono text-zinc-500">
                  Jornada
                </label>
                <input
                  type="number"
                  value={jornadaNum}
                  onChange={(e) => setJornadaNum(parseInt(e.target.value, 10) || 1)}
                  className="w-full h-11 px-3 bg-transparent border border-zinc-300 dark:border-zinc-700 rounded-lg text-sm font-medium focus:border-blue-600 focus:outline-none"
                />
              </div>

              <div className="relative">
                <label className="absolute -top-2 left-3 bg-white dark:bg-zinc-900 px-1 text-[10px] font-mono text-zinc-500">
                  Dia de jogo
                </label>
                <input
                  type="number"
                  value={diaJogoNum}
                  onChange={(e) => setDiaJogoNum(parseInt(e.target.value, 10) || 1)}
                  className="w-full h-11 px-3 bg-transparent border border-zinc-300 dark:border-zinc-700 rounded-lg text-sm font-medium focus:border-blue-600 focus:outline-none"
                />
              </div>
            </div>
          </div>

          {/* Secção KICK OFF */}
          <div className="grid grid-cols-1 md:grid-cols-[110px_1fr] gap-4 items-start">
            <span className="text-xs font-mono font-bold uppercase tracking-wider text-zinc-500 pt-2">
              KICK OFF
            </span>
            <div className="space-y-3">
              <div className="grid grid-cols-2 gap-3">
                <div className="relative">
                  <label className="absolute -top-2 left-3 bg-white dark:bg-zinc-900 px-1 text-[10px] font-mono text-zinc-500">
                    Data *
                  </label>
                  <input
                    type="date"
                    required
                    value={dateStr}
                    onChange={(e) => setDateStr(e.target.value)}
                    className="w-full h-11 px-3 bg-transparent border border-zinc-300 dark:border-zinc-700 rounded-lg text-sm font-medium focus:border-blue-600 focus:outline-none"
                  />
                </div>

                <div className="relative">
                  <label className="absolute -top-2 left-3 bg-white dark:bg-zinc-900 px-1 text-[10px] font-mono text-zinc-500">
                    Tempo *
                  </label>
                  <input
                    type="time"
                    required
                    value={timeStr}
                    onChange={(e) => setTimeStr(e.target.value)}
                    className="w-full h-11 px-3 bg-transparent border border-zinc-300 dark:border-zinc-700 rounded-lg text-sm font-medium focus:border-blue-600 focus:outline-none"
                  />
                </div>
              </div>

              <div className="relative">
                <label className="absolute -top-2 left-3 bg-white dark:bg-zinc-900 px-1 text-[10px] font-mono text-zinc-500">
                  Default time zone *
                </label>
                <select
                  value={timeZone}
                  onChange={(e) => setTimeZone(e.target.value)}
                  className="w-full h-11 px-3 bg-transparent border border-zinc-300 dark:border-zinc-700 rounded-lg text-sm font-medium focus:border-blue-600 focus:outline-none appearance-none"
                >
                  <option value="(UTC+1) Africa/Luanda">(UTC+1) Africa/Luanda</option>
                  <option value="(UTC+0) GMT">(UTC+0) GMT</option>
                </select>
                <button
                  type="button"
                  onClick={() => setTimeZone('(UTC+1) Africa/Luanda')}
                  className="mt-1 text-right block w-full text-[10px] font-mono text-zinc-500 hover:text-blue-600 dark:hover:text-blue-400"
                >
                  Reset time zone to competition default
                </button>
              </div>
            </div>
          </div>

          {/* Secção EQUIPAS */}
          <div className="grid grid-cols-1 md:grid-cols-[110px_1fr] gap-4 items-start">
            <span className="text-xs font-mono font-bold uppercase tracking-wider text-zinc-500 pt-2">
              EQUIPAS
            </span>
            <div className="space-y-3">
              <div className="relative">
                <label className="absolute -top-2 left-3 bg-white dark:bg-zinc-900 px-1 text-[10px] font-mono text-zinc-500">
                  Equipa local
                </label>
                <select
                  value={homeTeamId}
                  onChange={(e) => setHomeTeamId(e.target.value)}
                  className="w-full h-11 px-3 bg-transparent border border-zinc-300 dark:border-zinc-700 rounded-lg text-sm font-medium focus:border-blue-600 focus:outline-none"
                >
                  {TEAMS.map((team, idx) => (
                    <option key={team.id} value={team.id} className="dark:bg-zinc-900">
                      Equipa {idx + 1} - {team.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="relative">
                <label className="absolute -top-2 left-3 bg-white dark:bg-zinc-900 px-1 text-[10px] font-mono text-zinc-500">
                  Equipa visitante
                </label>
                <select
                  value={awayTeamId}
                  onChange={(e) => setAwayTeamId(e.target.value)}
                  className="w-full h-11 px-3 bg-transparent border border-zinc-300 dark:border-zinc-700 rounded-lg text-sm font-medium focus:border-blue-600 focus:outline-none"
                >
                  {TEAMS.map((team, idx) => (
                    <option key={team.id} value={team.id} className="dark:bg-zinc-900">
                      Equipa {idx + 1} - {team.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Secção LOCALIZAÇÃO */}
          <div className="grid grid-cols-1 md:grid-cols-[110px_1fr] gap-4 items-start">
            <span className="text-xs font-mono font-bold uppercase tracking-wider text-zinc-500 pt-2">
              LOCALIZAÇÃO
            </span>
            <div className="relative">
              <label className="absolute -top-2 left-3 bg-white dark:bg-zinc-900 px-1 text-[10px] font-mono text-zinc-500">
                Instalações
              </label>
              <select
                value={stadium}
                onChange={(e) => setStadium(e.target.value)}
                className="w-full h-11 px-3 bg-transparent border border-zinc-300 dark:border-zinc-700 rounded-lg text-sm font-medium focus:border-blue-600 focus:outline-none"
              >
                {OFFICIAL_STADIUMS.map((st) => (
                  <option key={st} value={st} className="dark:bg-zinc-900">
                    {st}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Aviso de Segurança de Dados */}
          <div className="p-3.5 rounded-2xl bg-blue-500/5 border border-blue-500/20 text-xs font-mono text-zinc-500 flex items-start gap-2.5">
            <ShieldCheck size={16} className="text-blue-500 mt-0.5 flex-shrink-0" />
            <div>
              <span className="font-bold text-blue-500">Proteção de integridade da competição:</span>
              <p className="mt-0.5 text-[11px] leading-relaxed">
                As datas e recintos alterados aqui atualizam a folha operacional e o site instantaneamente. A classificação ajusta-se automaticamente aos resultados.
              </p>
            </div>
          </div>

          {/* Confirmação de Eliminação */}
          {showDeleteConfirm && (
            <div className="p-4 rounded-2xl bg-red-500/10 border border-red-500/30 space-y-2">
              <p className="text-xs font-bold text-red-500 flex items-center gap-1.5">
                <AlertTriangle size={15} /> Confirmar eliminação da partida?
              </p>
              <p className="text-[11px] font-mono text-zinc-500">
                Esta ação remove o agendamento da grelha de jogos. Esta operação é registada para auditoria.
              </p>
              <div className="flex items-center gap-2 pt-1">
                <button
                  type="button"
                  onClick={handleDelete}
                  disabled={saving}
                  className="px-3 py-1.5 rounded-lg bg-red-600 text-white font-mono text-xs font-bold uppercase tracking-wider hover:bg-red-700 transition-colors"
                >
                  {saving ? 'A eliminar…' : 'Sim, eliminar partida'}
                </button>
                <button
                  type="button"
                  onClick={() => setShowDeleteConfirm(false)}
                  className="px-3 py-1.5 rounded-lg bg-zinc-200 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 font-mono text-xs transition-colors"
                >
                  Cancelar
                </button>
              </div>
            </div>
          )}

          {/* Barra de Ações Inferior */}
          <div className="pt-4 border-t border-zinc-100 dark:border-zinc-800 flex items-center justify-between gap-3">
            {onDelete ? (
              <button
                type="button"
                onClick={() => setShowDeleteConfirm(true)}
                className="text-xs font-bold font-mono text-red-500 hover:text-red-700 uppercase tracking-widest transition-colors"
              >
                ELIMINAR
              </button>
            ) : <div />}

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={onClose}
                disabled={saving}
                className="px-5 py-2.5 rounded-xl border border-zinc-300 dark:border-zinc-700 font-mono text-xs font-bold uppercase tracking-widest text-zinc-600 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
              >
                CANCELAR
              </button>

              <button
                type="submit"
                disabled={saving}
                className="px-6 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-mono text-xs font-bold uppercase tracking-widest transition-all shadow-md flex items-center gap-2 disabled:opacity-50"
              >
                {saving ? <Loader2 size={14} className="animate-spin" /> : <Save size={14} />}
                GUARDAR
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
