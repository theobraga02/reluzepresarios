export interface AssetDefinition {
  id: string;
  arquivo: string;
  alt: string;
  largura: number;
  altura: number;
  papel: 'fundo' | 'bento' | 'textura' | 'og';
  status: 'real' | 'placeholder';
}

export const ASSET_MANIFEST: Record<string, AssetDefinition> = {
  'hero-aurora-loop': {
    id: 'hero-aurora-loop',
    arquivo: '/assets/hero-aurora-loop.mp4',
    alt: 'Aurora luminosa fluida subindo sobre fundo escuro',
    largura: 1920,
    altura: 1080,
    papel: 'fundo',
    status: 'placeholder',
  },
  'card-citacoes': {
    id: 'card-citacoes',
    arquivo: '/assets/card-citacoes.webp',
    alt: 'Visualização fluida 3D de citações',
    largura: 1200,
    altura: 900,
    papel: 'bento',
    status: 'placeholder',
  },
  'card-posicao': {
    id: 'card-posicao',
    arquivo: '/assets/card-posicao.webp',
    alt: 'Fitas fluidas de vidro em degraus representando posições',
    largura: 1200,
    altura: 900,
    papel: 'bento',
    status: 'placeholder',
  },
  'card-dados': {
    id: 'card-dados',
    arquivo: '/assets/card-dados.webp',
    alt: 'Espiral fluida de vidro para dados corretos',
    largura: 1200,
    altura: 900,
    papel: 'bento',
    status: 'placeholder',
  },
  'card-fontes': {
    id: 'card-fontes',
    arquivo: '/assets/card-fontes.webp',
    alt: 'Rede de nós e conexões luminosas das fontes',
    largura: 1200,
    altura: 900,
    papel: 'bento',
    status: 'placeholder',
  },
  'card-concorrentes': {
    id: 'card-concorrentes',
    arquivo: '/assets/card-concorrentes.webp',
    alt: 'Formas de vidro em contraste para concorrentes',
    largura: 1200,
    altura: 900,
    papel: 'bento',
    status: 'placeholder',
  },
  'card-presenca': {
    id: 'card-presenca',
    arquivo: '/assets/card-presenca.webp',
    alt: 'Anel de vidro 3D para presença digital integrada',
    largura: 1200,
    altura: 900,
    papel: 'bento',
    status: 'placeholder',
  },
  'og': {
    id: 'og',
    arquivo: '/assets/og.png',
    alt: 'Anel luminoso Visibilidade.AI',
    largura: 1200,
    altura: 630,
    papel: 'og',
    status: 'placeholder',
  },
};
