export interface Testimonial {
  nome: string;
  negocio: string;
  cidade: string;
  texto: string;
  nota: number;
}

// Em conformidade com a seção 2 ("Depoimentos, logos de clientes... não existem ainda. Use componentes de prova social previstos em socialProof.ts que só renderizam quando o array tiver dados reais; vazio = a seção some")
export const PROVAS_SOCIAIS: Testimonial[] = [];
