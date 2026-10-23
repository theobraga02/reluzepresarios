// Weights defined in section 9.1
export const SCORE_PESOS = {
  taxaCitacao: 0.40,
  posicaoMedia: 0.15,
  dadosCorretos: 0.15,
  controleFontes: 0.15,
  qualidadeRecomendacao: 0.15,
};

export type FaixaScore = 'invisivel' | 'pouco' | 'visivel';

export interface InfoFaixa {
  chave: FaixaScore;
  rotulo: string;
  corCss: string; // CSS var reference
  corHex: string;
  fraseVeredito: string;
}

export function obterInfoFaixa(score: number): InfoFaixa {
  if (score < 40) {
    return {
      chave: 'invisivel',
      rotulo: 'Quase invisível',
      corCss: 'var(--coral)',
      corHex: '#FF6B4A',
      fraseVeredito: 'Hoje, quem pergunta à IA dificilmente chega até você.',
    };
  }
  if (score < 70) {
    return {
      chave: 'pouco',
      rotulo: 'Aparece pouco',
      corCss: 'var(--ambar)',
      corHex: '#F5B544',
      fraseVeredito: 'Você aparece, mas perde para concorrentes em várias buscas.',
    };
  }
  return {
    chave: 'visivel',
    rotulo: 'Bem visível',
    corCss: 'var(--aurora)',
    corHex: '#19B8A5',
    fraseVeredito: 'Você aparece bem. O foco agora é manter e corrigir detalhes.',
  };
}

/**
 * Wilson score interval (95% confidence level, z = 1.96)
 * Returns { min: number, max: number } as rates between 0 and 1
 */
export function calcularIntervaloWilson(citacoes: number, total: number, z: number = 1.96): { min: number; max: number } {
  if (total <= 0) {
    return { min: 0, max: 0 };
  }
  const p = Math.max(0, Math.min(1, citacoes / total));
  const z2 = z * z;
  const denominador = 1 + z2 / total;
  const centro = (p + z2 / (2 * total)) / denominador;
  const spread = (z * Math.sqrt((p * (1 - p) + z2 / (4 * total)) / total)) / denominador;

  const min = Math.max(0, centro - spread);
  const max = Math.min(1, centro + spread);
  return { min, max };
}

/**
 * Calcula o score composto e a faixa estimada recalculando com os limites de Wilson da taxa de citação.
 */
export function calcularScore(params: {
  taxaCitacao: number; // 0 a 100
  posicaoMedia: number | null; // 0 a 100
  dadosCorretos: number; // 0 a 100
  controleFontes: number; // 0 a 100
  qualidadeRecomendacao: number; // 0 a 100
  totalRespostas: number;
  citacoes: number;
}): { valor: number; faixaMin: number; faixaMax: number } {
  const {
    taxaCitacao,
    posicaoMedia,
    dadosCorretos,
    controleFontes,
    qualidadeRecomendacao,
    totalRespostas,
    citacoes,
  } = params;

  // If nunca citado, posicaoMedia é 0
  const posVal = posicaoMedia !== null ? posicaoMedia : 0;

  const scoreBase =
    taxaCitacao * SCORE_PESOS.taxaCitacao +
    posVal * SCORE_PESOS.posicaoMedia +
    dadosCorretos * SCORE_PESOS.dadosCorretos +
    controleFontes * SCORE_PESOS.controleFontes +
    qualidadeRecomendacao * SCORE_PESOS.qualidadeRecomendacao;

  const valor = Math.round(Math.max(0, Math.min(100, scoreBase)));

  // Intervalo de Wilson sobre a taxa de citação
  const wilson = calcularIntervaloWilson(citacoes, totalRespostas);
  const taxaMin = wilson.min * 100;
  const taxaMax = wilson.max * 100;

  const scoreComTaxaMin =
    taxaMin * SCORE_PESOS.taxaCitacao +
    posVal * SCORE_PESOS.posicaoMedia +
    dadosCorretos * SCORE_PESOS.dadosCorretos +
    controleFontes * SCORE_PESOS.controleFontes +
    qualidadeRecomendacao * SCORE_PESOS.qualidadeRecomendacao;

  const scoreComTaxaMax =
    taxaMax * SCORE_PESOS.taxaCitacao +
    posVal * SCORE_PESOS.posicaoMedia +
    dadosCorretos * SCORE_PESOS.dadosCorretos +
    controleFontes * SCORE_PESOS.controleFontes +
    qualidadeRecomendacao * SCORE_PESOS.qualidadeRecomendacao;

  const faixaMin = Math.round(Math.max(0, Math.min(valor, scoreComTaxaMin)));
  const faixaMax = Math.round(Math.min(100, Math.max(valor, scoreComTaxaMax)));

  return { valor, faixaMin, faixaMax };
}

/**
 * Ordenação das prioridades conforme 9.2:
 * prioridade = gravidade (3 crítica, 2 média, 1 baixa) × impacto (1 a 3) ÷ esforço (1 se ≤15 min, 2 se ≤60 min, 3 se >60 min).
 * Empate: menor esforço primeiro.
 */
export function calcularPontuacaoPrioridade(
  gravidade: 'critica' | 'media' | 'baixa',
  impacto: 1 | 2 | 3,
  esforcoMin: number
): number {
  const g = gravidade === 'critica' ? 3 : gravidade === 'media' ? 2 : 1;
  const imp = impacto;
  const esf = esforcoMin <= 15 ? 1 : esforcoMin <= 60 ? 2 : 3;
  return (g * imp) / esf;
}

export function gerarFraseVeredito(citacoes: number, total: number, score: number): string {
  const parte1 = `A IA citou seu negócio em ${citacoes} de ${total} respostas.`;
  const info = obterInfoFaixa(score);
  return `${parte1} ${info.fraseVeredito}`;
}
