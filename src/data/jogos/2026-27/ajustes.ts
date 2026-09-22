// Ajustes manuais aos totais calculados a partir dos registos de jogo.
// Cada entrada é uma exceção explícita: só existe porque nenhuma ficha
// publicada a comprova. Remover a entrada assim que o jogo em causa tiver
// escalação publicada no seu registo.

/**
 * Presenças confirmadas em jogos cuja ficha não publicou escalação (por isso
 * não podem ser contadas a partir do registo). Somam às presenças calculadas.
 */
export const APPEARANCES_WITHOUT_LINEUP_2026_27: Readonly<Record<string, number>> = {
  'fifa-1jrku39': 1, // Mankoka Afonso (Kabuscorp SC)
};
