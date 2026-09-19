// Valores de preenchimento ("por confirmar", "A definir", "—") nunca aparecem
// no site público: quando a informação falta, o campo fica em branco.
export function shown(value?: string | null): string {
  const text = value?.trim() ?? '';
  return !text || text === '—' || /por confirmar|^a definir$/i.test(text) ? '' : text;
}
