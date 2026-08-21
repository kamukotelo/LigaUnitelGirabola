'use client';

import React, { useMemo } from 'react';
import { CalendarDays, HelpCircle } from 'lucide-react';
import AnimatedCard from '@/components/ui/AnimatedCard';
import { isMatchDateOfficial, type Match } from '@/lib/data';

type EventType = 'girabola' | 'supertaca' | 'ta' | 'cl' | 'cc' | 'supercup' | 'can' | 'holiday';

interface CalendarEvent {
  label: string;
  type: EventType;
}

const MONTHS = [
  { year: 2026, month: 6, label: 'jul-26', name: 'Julho' },
  { year: 2026, month: 7, label: 'ago-26', name: 'Agosto' },
  { year: 2026, month: 8, label: 'set-26', name: 'Setembro' },
  { year: 2026, month: 9, label: 'out-26', name: 'Outubro' },
  { year: 2026, month: 10, label: 'nov-26', name: 'Novembro' },
  { year: 2026, month: 11, label: 'dez-26', name: 'Dezembro' },
  { year: 2027, month: 0, label: 'jan-27', name: 'Janeiro' },
  { year: 2027, month: 1, label: 'fev-27', name: 'Fevereiro' },
  { year: 2027, month: 2, label: 'mar-27', name: 'Março' },
  { year: 2027, month: 3, label: 'abr-27', name: 'Abril' },
  { year: 2027, month: 4, label: 'mai-27', name: 'Maio' },
  { year: 2027, month: 5, label: 'jun-27', name: 'Junho' },
];

const WEEKDAYS = ['Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb', 'Dom'];

// Definir os eventos fixos do calendário de planeamento de forma precisa
const SCHEDULE_EVENTS: Record<string, Record<number, CalendarEvent[]>> = {
  'jul-26': {
    25: [{ label: '1ª Jornada', type: 'girabola' }],
    26: [{ label: '1ª Jornada', type: 'girabola' }],
  },
  'ago-26': {
    15: [{ label: 'SUPER TAÇA', type: 'supertaca' }],
    28: [{ label: '2ª Jornada', type: 'girabola' }],
    29: [{ label: '2ª Jornada', type: 'girabola' }],
    30: [{ label: '2ª Jornada', type: 'girabola' }],
  },
  'set-26': {
    4: [{ label: '3ª Jornada', type: 'girabola' }, { label: 'CL Q1', type: 'cl' }, { label: 'CC Q1', type: 'cc' }],
    5: [{ label: '3ª Jornada', type: 'girabola' }, { label: 'CL Q1', type: 'cl' }, { label: 'CC Q1', type: 'cc' }],
    6: [{ label: '3ª Jornada', type: 'girabola' }, { label: 'CC Q1', type: 'cc' }],
    11: [{ label: '4ª Jornada', type: 'girabola' }, { label: 'CL Q1', type: 'cl' }],
    12: [{ label: '4ª Jornada', type: 'girabola' }, { label: 'CL Q1', type: 'cl' }],
    13: [{ label: '4ª Jornada', type: 'girabola' }, { label: 'CC Q1', type: 'cc' }],
    17: [{ label: 'Heroi Nac.', type: 'holiday' }],
    18: [{ label: '5ª Jornada', type: 'girabola' }],
    19: [{ label: '5ª Jornada', type: 'girabola' }],
    20: [{ label: '5ª Jornada', type: 'girabola' }],
  },
  'out-26': {
    7: [{ label: 'CL Q2', type: 'cl' }, { label: 'CC Q2', type: 'cc' }],
    8: [{ label: 'CL Q2', type: 'cl' }, { label: 'CC Q2', type: 'cc' }],
    9: [{ label: '6ª Jornada', type: 'girabola' }],
    10: [{ label: '6ª Jornada', type: 'girabola' }],
    11: [{ label: '6ª Jornada', type: 'girabola' }],
    14: [{ label: 'CL Q2', type: 'cl' }, { label: 'CC Q2', type: 'cc' }],
    16: [{ label: '7ª Jornada', type: 'girabola' }, { label: 'CL Q2', type: 'cl' }, { label: 'CC Q2', type: 'cc' }],
    17: [{ label: '7ª Jornada', type: 'girabola' }, { label: 'CL Q2', type: 'cl' }, { label: 'CC Q2', type: 'cc' }],
    18: [{ label: '7ª Jornada', type: 'girabola' }, { label: 'CC Q2', type: 'cc' }],
    23: [{ label: '8ª Jornada', type: 'girabola' }],
    24: [{ label: '8ª Jornada', type: 'girabola' }],
    25: [{ label: '8ª Jornada', type: 'girabola' }],
    30: [{ label: '9ª Jornada', type: 'girabola' }],
    31: [{ label: '9ª Jornada', type: 'girabola' }, { label: 'CAF SuperCup', type: 'supercup' }],
  },
  'nov-26': {
    1: [{ label: '9ª Jornada', type: 'girabola' }],
    2: [{ label: 'Finados', type: 'holiday' }],
    6: [{ label: '10ª Jornada', type: 'girabola' }],
    7: [{ label: '10ª Jornada', type: 'girabola' }],
    8: [{ label: '10ª Jornada', type: 'girabola' }],
    11: [{ label: 'Independência', type: 'holiday' }],
    20: [{ label: '11ª Jornada', type: 'girabola' }],
    21: [{ label: '11ª Jornada', type: 'girabola' }],
    22: [{ label: '11ª Jornada', type: 'girabola' }],
    27: [{ label: '12ª Jornada', type: 'girabola' }, { label: 'CL M1', type: 'cl' }],
    28: [{ label: '12ª Jornada', type: 'girabola' }, { label: 'CL M1', type: 'cl' }],
    29: [{ label: '12ª Jornada', type: 'girabola' }, { label: 'CC M1', type: 'cc' }],
  },
  'dez-26': {
    4: [{ label: '13ª Jornada', type: 'girabola' }, { label: 'CL M2', type: 'cl' }],
    5: [{ label: '13ª Jornada', type: 'girabola' }, { label: 'CL M2', type: 'cl' }],
    6: [{ label: '13ª Jornada', type: 'girabola' }, { label: 'CC M2', type: 'cc' }],
    11: [{ label: '14ª Jornada', type: 'girabola' }, { label: 'CL M3', type: 'cl' }],
    12: [{ label: '14ª Jornada', type: 'girabola' }, { label: 'CL M3', type: 'cl' }],
    13: [{ label: '14ª Jornada', type: 'girabola' }, { label: 'CC M3', type: 'cc' }],
    18: [{ label: '15ª Jornada', type: 'girabola' }, { label: 'CL M4', type: 'cl' }],
    19: [{ label: '15ª Jornada', type: 'girabola' }, { label: 'CL M4', type: 'cl' }],
    20: [{ label: '15ª Jornada', type: 'girabola' }, { label: 'CC M4', type: 'cc' }],
    25: [{ label: 'Natal', type: 'holiday' }],
  },
  'jan-27': {
    1: [{ label: 'Ano Novo', type: 'holiday' }],
    6: [{ label: 'TA 1/32', type: 'ta' }],
    13: [{ label: 'TA 1/16', type: 'ta' }],
    15: [{ label: 'CL M5', type: 'cl' }],
    16: [{ label: 'CL M5', type: 'cl' }],
    17: [{ label: 'CC M5', type: 'cc' }],
    20: [{ label: 'TA 1/8', type: 'ta' }],
    22: [{ label: 'CL M6', type: 'cl' }],
    23: [{ label: 'CL M6', type: 'cl' }],
    24: [{ label: 'CC M6', type: 'cc' }],
    27: [{ label: 'TA 1/4', type: 'ta' }],
    30: [{ label: '16ª Jornada', type: 'girabola' }],
    31: [{ label: '16ª Jornada', type: 'girabola' }],
  },
  'fev-27': {
    4: [{ label: 'Luta Armada', type: 'holiday' }],
    12: [{ label: '17ª Jornada', type: 'girabola' }],
    13: [{ label: '17ª Jornada', type: 'girabola' }],
    14: [{ label: '17ª Jornada', type: 'girabola' }],
    19: [{ label: '18ª Jornada', type: 'girabola' }],
    20: [{ label: '18ª Jornada', type: 'girabola' }],
    21: [{ label: '18ª Jornada', type: 'girabola' }],
    26: [{ label: '19ª Jornada', type: 'girabola' }],
    27: [{ label: '19ª Jornada', type: 'girabola' }],
    28: [{ label: '19ª Jornada', type: 'girabola' }],
  },
  'mar-27': {
    5: [{ label: '20ª Jornada', type: 'girabola' }, { label: 'CL 1/4', type: 'cl' }],
    6: [{ label: '20ª Jornada', type: 'girabola' }, { label: 'CL 1/4', type: 'cl' }],
    7: [{ label: '20ª Jornada', type: 'girabola' }, { label: 'CC 1/4', type: 'cc' }],
    8: [{ label: 'Dia Mulher', type: 'holiday' }],
    12: [{ label: '21ª Jornada', type: 'girabola' }, { label: 'CL 1/4', type: 'cl' }],
    13: [{ label: '21ª Jornada', type: 'girabola' }, { label: 'CL 1/4', type: 'cl' }],
    14: [{ label: '21ª Jornada', type: 'girabola' }, { label: 'CC 1/4', type: 'cc' }],
    19: [{ label: '22ª Jornada', type: 'girabola' }],
    20: [{ label: '22ª Jornada', type: 'girabola' }],
    21: [{ label: '22ª Jornada', type: 'girabola' }],
    23: [{ label: 'Lib. Austr.', type: 'holiday' }],
    26: [{ label: 'Sexta Santa', type: 'holiday' }],
  },
  'abr-27': {
    2: [{ label: '23ª Jornada', type: 'girabola' }],
    3: [{ label: '23ª Jornada', type: 'girabola' }],
    4: [{ label: 'Dia Paz', type: 'holiday' }],
    9: [{ label: '24ª Jornada', type: 'girabola' }, { label: 'CL 1/2', type: 'cl' }],
    10: [{ label: '24ª Jornada', type: 'girabola' }, { label: 'CL 1/2', type: 'cl' }],
    11: [{ label: '24ª Jornada', type: 'girabola' }, { label: 'CC 1/2', type: 'cc' }],
    16: [{ label: '25ª Jornada', type: 'girabola' }, { label: 'CL 1/2', type: 'cl' }],
    17: [{ label: '25ª Jornada', type: 'girabola' }, { label: 'CL 1/2', type: 'cl' }],
    18: [{ label: '25ª Jornada', type: 'girabola' }, { label: 'CC 1/2', type: 'cc' }],
    23: [{ label: '26ª Jornada', type: 'girabola' }],
    24: [{ label: '26ª Jornada', type: 'girabola' }],
    25: [{ label: '26ª Jornada', type: 'girabola' }],
    30: [{ label: '27ª Jornada', type: 'girabola' }],
  },
  'mai-27': {
    1: [{ label: 'Dia Trab.', type: 'holiday' }],
    2: [{ label: '27ª Jornada', type: 'girabola' }],
    7: [{ label: '28ª Jornada', type: 'girabola' }, { label: 'CL Final', type: 'cl' }],
    8: [{ label: '28ª Jornada', type: 'girabola' }, { label: 'CL Final', type: 'cl' }],
    9: [{ label: '28ª Jornada', type: 'girabola' }, { label: 'CC Final', type: 'cc' }],
    14: [{ label: '29ª Jornada', type: 'girabola' }],
    15: [{ label: '29ª Jornada', type: 'girabola' }],
    16: [{ label: '29ª Jornada', type: 'girabola' }],
    19: [{ label: 'TA 1/2', type: 'ta' }],
    21: [{ label: 'TA Final', type: 'ta' }, { label: 'CL Final', type: 'cl' }],
    23: [{ label: 'TA Final', type: 'ta' }, { label: 'CL Final', type: 'cl' }],
    28: [{ label: '30ª Jornada', type: 'girabola' }],
    29: [{ label: '30ª Jornada', type: 'girabola' }],
    30: [{ label: '30ª Jornada', type: 'girabola' }],
  },
  'jun-27': {
    19: [{ label: 'CAN 2027', type: 'can' }],
    20: [{ label: 'CAN 2027', type: 'can' }],
    21: [{ label: 'CAN 2027', type: 'can' }],
    22: [{ label: 'CAN 2027', type: 'can' }],
    23: [{ label: 'CAN 2027', type: 'can' }],
    24: [{ label: 'CAN 2027', type: 'can' }],
    25: [{ label: 'CAN 2027', type: 'can' }],
    26: [{ label: 'CAN 2027', type: 'can' }],
    27: [{ label: 'CAN 2027', type: 'can' }],
    28: [{ label: 'CAN 2027', type: 'can' }],
    29: [{ label: 'CAN 2027', type: 'can' }],
    30: [{ label: 'CAN 2027', type: 'can' }],
  },
};

const LEGEND_ITEMS = [
  { label: 'Liga Angolana de Futebol', color: 'bg-blue-600 border-blue-500 text-blue-100 dark:bg-blue-950/70 dark:border-blue-700 dark:text-blue-300' },
  { label: 'SuperTaça', color: 'bg-purple-600 border-purple-500 text-purple-100 dark:bg-purple-950/70 dark:border-purple-700 dark:text-purple-300' },
  { label: 'Taça de Angola', color: 'bg-orange-600 border-orange-500 text-orange-100 dark:bg-orange-950/70 dark:border-orange-700 dark:text-orange-300' },
  { label: 'CAF Champions League', color: 'bg-yellow-600 border-yellow-500 text-yellow-900 dark:bg-yellow-950/60 dark:border-yellow-700 dark:text-yellow-300' },
  { label: 'CAF Confederation Cup', color: 'bg-indigo-600 border-indigo-500 text-indigo-100 dark:bg-indigo-950/70 dark:border-indigo-700 dark:text-indigo-300' },
  { label: 'CAF Super Cup', color: 'bg-green-700 border-green-600 text-green-100 dark:bg-green-950/70 dark:border-green-700 dark:text-green-300' },
  { label: 'CAN 2027', color: 'bg-amber-800 border-amber-700 text-amber-100 dark:bg-amber-950/70 dark:border-amber-700 dark:text-amber-300' },
  { label: 'Feriados', color: 'bg-pink-600 border-pink-500 text-pink-100 dark:bg-pink-950/70 dark:border-pink-700 dark:text-pink-300' },
];

function buildOfficialScheduleEvents(matches: Match[]): Record<string, Record<number, CalendarEvent[]>> {
  // Preservar competições CAF, Taça, Supertaça e feriados, removendo todas as
  // datas Girabola escritas manualmente. As jornadas passam a nascer apenas da
  // mesma coleção oficial que alimenta a lista de jogos.
  const events = Object.fromEntries(
    Object.entries(SCHEDULE_EVENTS).map(([month, days]) => [
      month,
      Object.fromEntries(
        Object.entries(days)
          .map(([day, dayEvents]) => [Number(day), dayEvents.filter((event) => event.type !== 'girabola')])
          .filter(([, dayEvents]) => (dayEvents as CalendarEvent[]).length > 0),
      ),
    ]),
  ) as Record<string, Record<number, CalendarEvent[]>>;

  for (const match of matches) {
    const [year, month, day] = match.date.slice(0, 10).split('-').map(Number);
    const monthDefinition = MONTHS.find((item) => item.year === year && item.month === month - 1);
    if (!monthDefinition) continue;

    const monthEvents = events[monthDefinition.label] ?? (events[monthDefinition.label] = {});
    const dayEvents = monthEvents[day] ?? (monthEvents[day] = []);
    const label = `${match.round}ª Jornada${isMatchDateOfficial(match) ? '' : ' (provisória)'}`;
    if (!dayEvents.some((event) => event.type === 'girabola' && event.label === label)) {
      dayEvents.unshift({ label, type: 'girabola' });
    }
  }

  return events;
}

export default function CalendarioPlaneamento({ matches }: { matches: Match[] }) {
  const scheduleEvents = useMemo(() => buildOfficialScheduleEvents(matches), [matches]);

  const getDaysInMonth = (year: number, month: number) => {
    return new Date(year, month + 1, 0).getDate();
  };

  // Número máximo de linhas necessário para acomodar as 6 semanas de qualquer mês
  const TOTAL_ROWS = 37;

  return (
    <div className="space-y-6">
      {/* Informação Geral / Subtítulo */}
      <div className="bg-zinc-100/50 dark:bg-zinc-950/50 border border-zinc-200 dark:border-zinc-900 rounded-2xl p-4 backdrop-blur-sm flex items-start gap-3">
        <CalendarDays className="text-accent h-5 w-5 mt-0.5 flex-shrink-0" />
        <div className="text-xs font-mono text-zinc-600 dark:text-zinc-400 space-y-1">
          <p className="font-bold text-foreground">CALENDÁRIO COMPLETO DE PLANEAMENTO 2026/27</p>
          <p>Esta vista de grelha permite visualizar o planeamento de todas as jornadas e competições desportivas organizadas pela ANCAF e CAF ao longo da época desportiva, organizadas lado a lado.</p>
          <p className="font-semibold text-amber-700 dark:text-amber-300">Petro de Luanda e Wiliete de Benguela · jogos nas competições africanas com transmissão prevista, canal por confirmar.</p>
        </div>
      </div>

      {/* Grid Container */}
      <AnimatedCard variant="hud" className="bg-zinc-100/30 dark:bg-zinc-950/30 border-zinc-200 dark:border-zinc-900 p-4 sm:p-6 overflow-hidden">
        <div className="overflow-x-auto [scrollbar-width:auto] pb-2">
          <table className="w-full border-collapse border border-zinc-200 dark:border-zinc-900 text-left min-w-[1500px]">
            <thead>
              <tr className="bg-zinc-100/80 dark:bg-zinc-950/80">
                {/* Cabeçalho dos dias da semana */}
                <th className="p-2.5 text-[10px] font-mono uppercase tracking-wider text-zinc-500 border border-zinc-200 dark:border-zinc-900 w-16 text-center">
                  Dia
                </th>
                {/* Cabeçalhos dos meses */}
                {MONTHS.map((m) => (
                  <th
                    key={m.label}
                    className="p-2.5 text-[10px] font-mono uppercase tracking-widest text-foreground font-black border border-zinc-200 dark:border-zinc-900 text-center w-[120px]"
                  >
                    {m.label}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {Array.from({ length: TOTAL_ROWS }).map((_, r) => {
                const weekdayIndex = r % 7;
                const weekdayLabel = WEEKDAYS[weekdayIndex];
                const isWeekend = weekdayIndex === 5 || weekdayIndex === 6; // Sábado ou Domingo

                return (
                  <tr
                    key={r}
                    className={`hover:bg-white/5 transition-colors border-b border-zinc-200 dark:border-zinc-900/50 ${
                      isWeekend ? 'bg-zinc-200/20 dark:bg-zinc-900/10' : ''
                    }`}
                  >
                    {/* Coluna do dia da semana */}
                    <td className="p-2 border-r border-zinc-200 dark:border-zinc-900 font-mono text-[10px] uppercase font-bold text-center text-zinc-500 select-none">
                      {weekdayLabel}
                    </td>

                    {/* Colunas de cada mês */}
                    {MONTHS.map((m) => {
                      // Descobrir o weekday do dia 1 do mês
                      const firstDayDate = new Date(m.year, m.month, 1);
                      // Mapear JS Day (0=Sun, 1=Mon, ..., 6=Sat) para Mon=0, ..., Sun=6
                      const w = (firstDayDate.getDay() + 6) % 7;

                      // O número do dia corresponde ao cálculo
                      const dayNumber = r - w + 1;
                      const daysInThisMonth = getDaysInMonth(m.year, m.month);

                      const isValidDay = dayNumber >= 1 && dayNumber <= daysInThisMonth;

                      // Obter eventos específicos do dia
                      const events = isValidDay ? scheduleEvents[m.label]?.[dayNumber] || [] : [];
                      const hasEvents = events.length > 0;

                      // Determinar cores/estilo baseados no tipo de evento
                      let cellStyle = 'bg-transparent text-zinc-700 dark:text-zinc-300';
                      if (isValidDay) {
                        if (hasEvents) {
                          const primaryEvent = events[0];
                          if (primaryEvent.type === 'girabola') {
                            cellStyle = 'bg-blue-500/15 border border-blue-500/40 text-blue-500 dark:bg-blue-950/40 dark:text-blue-300';
                          } else if (primaryEvent.type === 'supertaca') {
                            cellStyle = 'bg-purple-500/20 border border-purple-500/40 text-purple-500 dark:bg-purple-950/40 dark:text-purple-300';
                          } else if (primaryEvent.type === 'ta') {
                            cellStyle = 'bg-orange-500/15 border border-orange-500/40 text-orange-500 dark:bg-orange-950/40 dark:text-orange-300';
                          } else if (primaryEvent.type === 'cl') {
                            cellStyle = 'bg-yellow-500/10 border border-yellow-500/40 text-yellow-600 dark:bg-yellow-950/30 dark:text-yellow-400';
                          } else if (primaryEvent.type === 'cc') {
                            cellStyle = 'bg-indigo-500/15 border border-indigo-500/40 text-indigo-500 dark:bg-indigo-950/40 dark:text-indigo-300';
                          } else if (primaryEvent.type === 'supercup') {
                            cellStyle = 'bg-green-500/15 border border-green-500/40 text-green-500 dark:bg-green-950/40 dark:text-green-300';
                          } else if (primaryEvent.type === 'can') {
                            cellStyle = 'bg-amber-500/15 border border-amber-500/40 text-amber-500 dark:bg-amber-950/40 dark:text-amber-300';
                          } else if (primaryEvent.type === 'holiday') {
                            cellStyle = 'bg-pink-500/15 border border-pink-500/30 text-pink-500 dark:bg-pink-950/40 dark:text-pink-300';
                          }
                        }
                      } else {
                        cellStyle = 'bg-zinc-200/5 dark:bg-zinc-950/5 text-transparent opacity-20 border-dashed';
                      }

                      return (
                        <td
                          key={m.label}
                          className={`p-1.5 border border-zinc-200 dark:border-zinc-900 align-top ${cellStyle} min-h-[50px] relative transition-all`}
                        >
                          {isValidDay ? (
                            <div className="flex flex-col h-full justify-between min-h-[44px]">
                              {/* Dia do mês */}
                              <span className="font-mono text-[9px] font-extrabold opacity-60">
                                {dayNumber}
                              </span>

                              {/* Lista de eventos no dia */}
                              {hasEvents && (
                                <div className="mt-1 flex flex-col gap-0.5">
                                  {events.map((evt, idx) => (
                                    <div
                                      key={idx}
                                      className="text-[8px] font-mono uppercase tracking-wider font-black px-1.5 py-0.5 rounded leading-none truncate flex items-center justify-center text-center select-none"
                                      title={evt.label}
                                    >
                                      {evt.label}
                                    </div>
                                  ))}
                                </div>
                              )}
                            </div>
                          ) : (
                            <div className="h-10" />
                          )}
                        </td>
                      );
                    })}
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </AnimatedCard>

      {/* Legend Container */}
      <div className="bg-white/40 dark:bg-zinc-900/40 border border-zinc-200 dark:border-zinc-800 rounded-2xl p-6">
        <h4 className="text-xs font-mono uppercase tracking-widest text-zinc-500 mb-4 font-bold flex items-center gap-1.5">
          <HelpCircle size={14} className="text-primary" /> Legenda do Planeamento
        </h4>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {LEGEND_ITEMS.map((item) => (
            <div
              key={item.label}
              className={`p-2.5 rounded-xl border text-[9px] font-mono uppercase tracking-wider font-extrabold text-center ${item.color}`}
            >
              {item.label}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
