export type Gravidade = 'critica' | 'media' | 'baixa';

export type TipoBusca =
  | 'descoberta'
  | 'bairro'
  | 'atributo'
  | 'item'
  | 'ocasiao'
  | 'urgencia'
  | 'perfil'
  | 'comparacao'
  | 'alternativa'
  | 'marca'
  | 'conversacional'
  | 'preco';

export interface Negocio {
  id: string;
  nome: string;
  cidade: string;
  uf: string;
  bairro?: string;
  nicho: string;
  placeId?: string;
  endereco?: string;
  telefone?: string;
  horario?: string;
  site?: string;
  instagram?: string;
  mapsUrl?: string;
  concorrentes: string[];
}

export interface ScoreInfo {
  valor: number;
  faixaMin: number;
  faixaMax: number;
}

export interface Metricas {
  taxaCitacao: number; // 0 a 100
  posicaoMedia: number | null; // 0 a 100
  dadosCorretos: number; // 0 a 100
  controleFontes: number; // 0 a 100
  qualidadeRecomendacao: number; // 0 a 100
}

export interface Diagnostico {
  id: string;
  negocioId: string;
  criadoEm: string;
  modo: 'previa' | 'completo';
  modelos: string[];
  totalBuscas: number;
  totalRespostas: number;
  score: ScoreInfo;
  metricas: Metricas;
  variacaoDesdeAnterior?: number;
  veredito: string;
}

export interface RespostaIA {
  id: string;
  diagnosticoId: string;
  pergunta: string;
  tipoBusca: TipoBusca;
  modelo: string;
  modoBusca: 'com_web' | 'sem_web';
  repeticao: number;
  texto: string;
  criadoEm: string;
  citouNegocio: boolean;
  posicao?: number;
  qualidadeRecomendacao?: 0 | 30 | 60 | 100;
  dadosExibidos?: {
    nome?: string;
    endereco?: string;
    telefone?: string;
    horario?: string;
  };
  dadosCorretos?: boolean;
  fontes: {
    url: string;
    tipo: 'google_maps' | 'site' | 'instagram' | 'diretorio' | 'blog' | 'noticia' | 'outro';
    propria: boolean;
  }[];
  negociosCitados: {
    nome: string;
    posicao: number;
    ehOCliente: boolean;
    atributos: string[];
  }[];
}

export interface Concorrente {
  nome: string;
  participacao: number;
  atributos: string[];
  fontes: string[];
  diferenciais: string[];
}

export interface FonteLocal {
  nome: string;
  tipo: string;
  citacoes: number;
  negocioPresente: boolean;
  urlCadastro?: string;
}

export interface ItemPresenca {
  id: string;
  categoria: 'google' | 'site' | 'avaliacoes' | 'redes' | 'consistencia';
  titulo: string;
  evidencia: string;
  gravidade: Gravidade;
  impacto: 1 | 2 | 3;
  esforcoMin: number;
  concluido: boolean;
}

export interface AcaoPlano {
  id: string;
  itemPresencaId?: string;
  titulo: string;
  janela: 'semana' | '30dias' | 'continuo';
  passos: string[];
  conteudoPronto?: string;
  concluida: boolean;
  concluidaEm?: string;
}

export interface PontoSerie {
  data: string;
  valor: number;
  min: number;
  max: number;
  acaoId?: string;
  acaoTitulo?: string;
}

export interface ResumoPrevia {
  scanId: string;
  citacoes: number;
  totalBuscas: number;
  concorrenteExemplo?: string;
  achado?: string;
  score: ScoreInfo;
  modelos: string[];
  criadoEm: string;
}

export type Progresso = {
  feitas: number;
  total: number;
  buscaAtual?: string;
  etapa: 'resolvendo' | 'buscando' | 'analisando' | 'concluido';
};

export interface DiagnosticProvider {
  resolverNegocio(entrada: { nome: string; cidade: string; nicho: string; mapsUrl?: string }): Promise<{ candidatos: Negocio[] }>;
  iniciarPrevia(entrada: { negocio: Negocio; captcha: string }): Promise<{ scanId: string }>;
  acompanhar(scanId: string, onUpdate?: (progresso: Progresso) => void): AsyncIterable<Progresso>;
  obterPrevia(scanId: string): Promise<ResumoPrevia>;
  vincularPrevia(scanId: string, negocioId: string): Promise<void>;
  iniciarCompleto(negocioId: string): Promise<{ scanId: string }>;
  obterDiagnostico(id: string): Promise<Diagnostico>;
  listarDiagnosticos(negocioId: string): Promise<Diagnostico[]>;
  listarRespostas(diagnosticoId: string, filtros?: Record<string, string>): Promise<RespostaIA[]>;
  concorrentes(diagnosticoId: string): Promise<Concorrente[]>;
  fontes(diagnosticoId: string): Promise<FonteLocal[]>;
  presenca(negocioId: string): Promise<ItemPresenca[]>;
  plano(negocioId: string): Promise<AcaoPlano[]>;
  concluirAcao(id: string, concluida: boolean): Promise<void>;
  serieTemporal(negocioId: string, dias: number): Promise<PontoSerie[]>;
  gerarRelatorio(diagnosticoId: string): Promise<{ id: string; url: string }>;
}
