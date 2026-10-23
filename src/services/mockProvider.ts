import React from 'react';
import {
  DiagnosticProvider,
  Negocio,
  ResumoPrevia,
  Diagnostico,
  RespostaIA,
  Concorrente,
  FonteLocal,
  ItemPresenca,
  AcaoPlano,
  PontoSerie,
  Progresso,
} from './types';
import { SeededRandom } from '../utils/seed';
import { calcularScore, gerarFraseVeredito } from '../utils/score';

export class MockProvider implements DiagnosticProvider {
  private seed: SeededRandom;

  constructor(seedNumber: number = 42) {
    this.seed = new SeededRandom(seedNumber);
  }

  private sleep(ms: number): Promise<void> {
    return new Promise((res) => setTimeout(res, ms));
  }

  async resolverNegocio(entrada: {
    nome: string;
    cidade: string;
    nicho: string;
    mapsUrl?: string;
  }): Promise<{ candidatos: Negocio[] }> {
    await this.sleep(400);

    const cidadeNorm = entrada.cidade.trim() || 'Fortaleza, CE';
    const partes = cidadeNorm.split(',');
    const cidade = partes[0].trim();
    const uf = partes[1]?.trim() || 'CE';

    // Se o usuário digitou "ambiguo" ou "pizzaria" puro, simulamos candidatos múltiplos
    if (entrada.nome.toLowerCase().includes('centro') || entrada.nome.toLowerCase().includes('matriz')) {
      return {
        candidatos: [
          {
            id: 'neg-1',
            nome: `${entrada.nome} - Aldeota`,
            cidade,
            uf,
            bairro: 'Aldeota',
            nicho: entrada.nicho,
            endereco: `Av. Dom Luís, 1200 - ${cidade}, ${uf}`,
            telefone: '(85) 3244-5000',
            horario: '18:00 às 23:30',
            site: 'https://exemplo.com.br',
            instagram: '@exemplo_oficial',
            mapsUrl: 'https://maps.google.com/?cid=123',
            concorrentes: ['Concorrente A', 'Concorrente B'],
          },
          {
            id: 'neg-2',
            nome: `${entrada.nome} - Meireles`,
            cidade,
            uf,
            bairro: 'Meireles',
            nicho: entrada.nicho,
            endereco: `Rua Silva Jatahy, 350 - ${cidade}, ${uf}`,
            telefone: '(85) 3244-5001',
            horario: '18:00 às 00:00',
            mapsUrl: 'https://maps.google.com/?cid=456',
            concorrentes: ['Concorrente C'],
          },
        ],
      };
    }

    return {
      candidatos: [
        {
          id: 'neg-padrao',
          nome: entrada.nome || 'Pizzaria Exemplo',
          cidade,
          uf,
          bairro: 'Aldeota',
          nicho: entrada.nicho || 'Pizzaria',
          endereco: `Rua Desembargador Moreira, 700 - ${cidade}, ${uf}`,
          telefone: '(85) 3244-1234',
          horario: 'Ter a Dom: 18:00 às 23:00',
          site: 'https://pizzariaexemplo.com.br',
          instagram: '@pizzariaexemplo',
          mapsUrl: entrada.mapsUrl || 'https://maps.google.com/?cid=789',
          concorrentes: ['Concorrente A', 'Concorrente B', 'Concorrente C'],
        },
      ],
    };
  }

  async iniciarPrevia(entrada: { negocio: Negocio; captcha: string }): Promise<{ scanId: string }> {
    await this.sleep(300);
    return { scanId: `scan-${Date.now()}` };
  }

  async *acompanhar(
    scanId: string,
    onUpdate?: (progresso: Progresso) => void
  ): AsyncIterable<Progresso> {
    const passos: Progresso[] = [
      {
        feitas: 0,
        total: 3,
        etapa: 'resolvendo',
        buscaAtual: 'Localizando dados do negócio...',
      },
      {
        feitas: 1,
        total: 3,
        etapa: 'buscando',
        buscaAtual: 'Perguntando: qual a melhor pizzaria em Fortaleza?',
      },
      {
        feitas: 2,
        total: 3,
        etapa: 'buscando',
        buscaAtual: 'Perguntando: pizzaria forno a lenha na Aldeota?',
      },
      {
        feitas: 3,
        total: 3,
        etapa: 'analisando',
        buscaAtual: 'Perguntando: Pizzaria Exemplo em Fortaleza é boa?',
      },
      {
        feitas: 3,
        total: 3,
        etapa: 'concluido',
        buscaAtual: 'Análise parcial finalizada com sucesso.',
      },
    ];

    for (const passo of passos) {
      await this.sleep(900);
      if (onUpdate) onUpdate(passo);
      yield passo;
    }
  }

  async obterPrevia(scanId: string): Promise<ResumoPrevia> {
    await this.sleep(300);
    // Dados determinísticos da prévia
    return {
      scanId,
      citacoes: 1,
      totalBuscas: 3,
      concorrenteExemplo: 'Concorrente A',
      achado: 'A IA mostrou seu horário como "fechado aos domingos", divergindo dos dados reais.',
      score: {
        valor: 41,
        faixaMin: 34,
        faixaMax: 49,
      },
      modelos: ['Gemini 2.5 Flash'],
      criadoEm: '2026-10-18T14:30:00Z',
    };
  }

  async vincularPrevia(scanId: string, negocioId: string): Promise<void> {
    await this.sleep(300);
  }

  async iniciarCompleto(negocioId: string): Promise<{ scanId: string }> {
    await this.sleep(400);
    return { scanId: `full-${Date.now()}` };
  }

  async obterDiagnostico(id: string): Promise<Diagnostico> {
    await this.sleep(350);
    const scoreCalc = calcularScore({
      taxaCitacao: 17, // 8 / 48
      posicaoMedia: 72,
      dadosCorretos: 55,
      controleFontes: 40,
      qualidadeRecomendacao: 45,
      totalRespostas: 48,
      citacoes: 8,
    });

    return {
      id: id || 'diag-123',
      negocioId: 'neg-padrao',
      criadoEm: '2026-10-18T10:00:00Z',
      modo: 'completo',
      modelos: ['Gemini 2.5 Flash'],
      totalBuscas: 48,
      totalRespostas: 48,
      score: {
        valor: 41,
        faixaMin: 34,
        faixaMax: 49,
      },
      metricas: {
        taxaCitacao: 17,
        posicaoMedia: 72,
        dadosCorretos: 55,
        controleFontes: 40,
        qualidadeRecomendacao: 45,
      },
      variacaoDesdeAnterior: 6,
      veredito: gerarFraseVeredito(8, 48, 41),
    };
  }

  async listarDiagnosticos(negocioId: string): Promise<Diagnostico[]> {
    await this.sleep(300);
    const atual = await this.obterDiagnostico('diag-1');
    const anterior: Diagnostico = {
      ...atual,
      id: 'diag-0',
      criadoEm: '2026-09-15T10:00:00Z',
      score: { valor: 35, faixaMin: 28, faixaMax: 42 },
      variacaoDesdeAnterior: 0,
      veredito: gerarFraseVeredito(5, 48, 35),
    };
    return [atual, anterior];
  }

  async listarRespostas(diagnosticoId: string, filtros?: Record<string, string>): Promise<RespostaIA[]> {
    await this.sleep(300);
    return [
      {
        id: 'resp-1',
        diagnosticoId,
        pergunta: 'Qual a melhor pizzaria na Aldeota em Fortaleza?',
        tipoBusca: 'bairro',
        modelo: 'Gemini 2.5 Flash',
        modoBusca: 'com_web',
        repeticao: 1,
        texto:
          'Em Fortaleza, na Aldeota, destacam-se a Concorrente A com forno a lenha tradicional e a Concorrente B. A Pizzaria Exemplo também é citada por suas pizzas artesanais e ambiente familiar na Av. Dom Luís.',
        criadoEm: '2026-10-18T10:05:00Z',
        citouNegocio: true,
        posicao: 3,
        qualidadeRecomendacao: 60,
        dadosExibidos: {
          nome: 'Pizzaria Exemplo',
          endereco: 'Aldeota, Fortaleza - CE',
          telefone: '(85) 3244-1234',
          horario: 'Abre às 18h',
        },
        dadosCorretos: true,
        fontes: [
          { url: 'https://maps.google.com', tipo: 'google_maps', propria: false },
          { url: 'https://instagram.com/pizzariaexemplo', tipo: 'instagram', propria: true },
        ],
        negociosCitados: [
          { nome: 'Concorrente A', posicao: 1, ehOCliente: false, atributos: ['forno a lenha', 'tradicional'] },
          { nome: 'Concorrente B', posicao: 2, ehOCliente: false, atributos: ['delivery rápido'] },
          { nome: 'Pizzaria Exemplo', posicao: 3, ehOCliente: true, atributos: ['artesanal', 'ambiente familiar'] },
        ],
      },
      {
        id: 'resp-2',
        diagnosticoId,
        pergunta: 'Pizzaria com entrega rápida aberta domingo à noite em Fortaleza?',
        tipoBusca: 'urgencia',
        modelo: 'Gemini 2.5 Flash',
        modoBusca: 'com_web',
        repeticao: 1,
        texto:
          'Para domingo à noite, a Concorrente A e a Concorrente C atendem por aplicativo com entrega expressa até às 23h30. Não encontramos confirmação de funcionamento da Pizzaria Exemplo para este horário.',
        criadoEm: '2026-10-18T10:08:00Z',
        citouNegocio: false,
        fontes: [
          { url: 'https://appdelivery.exemplo', tipo: 'diretorio', propria: false },
        ],
        negociosCitados: [
          { nome: 'Concorrente A', posicao: 1, ehOCliente: false, atributos: ['entrega expressa'] },
          { nome: 'Concorrente C', posicao: 2, ehOCliente: false, atributos: ['aberto domingo'] },
        ],
      },
      {
        id: 'resp-3',
        diagnosticoId,
        pergunta: 'Pizzaria Exemplo em Fortaleza é boa? Qual o horário e o endereço?',
        tipoBusca: 'marca',
        modelo: 'Gemini 2.5 Flash',
        modoBusca: 'com_web',
        repeticao: 1,
        texto:
          'A Pizzaria Exemplo possui boas recomendações por massa crocante e recheios generosos. Fica localizada na Rua Desembargador Moreira, 700. Consta no cadastro que o atendimento é de terça a sábado das 18h às 23h.',
        criadoEm: '2026-10-18T10:12:00Z',
        citouNegocio: true,
        posicao: 1,
        qualidadeRecomendacao: 100,
        dadosExibidos: {
          nome: 'Pizzaria Exemplo',
          endereco: 'Rua Desembargador Moreira, 700',
          telefone: '(85) 3244-1234',
          horario: 'Ter a Sáb 18h às 23h', // Errado! O real abre no domingo.
        },
        dadosCorretos: false,
        fontes: [
          { url: 'https://maps.google.com', tipo: 'google_maps', propria: false },
          { url: 'https://portalguialocal.exemplo', tipo: 'diretorio', propria: false },
        ],
        negociosCitados: [
          { nome: 'Pizzaria Exemplo', posicao: 1, ehOCliente: true, atributos: ['massa crocante', 'recheio generoso'] },
        ],
      },
    ];
  }

  async concorrentes(diagnosticoId: string): Promise<Concorrente[]> {
    await this.sleep(300);
    return [
      {
        nome: 'Concorrente A',
        participacao: 42,
        atributos: ['forno a lenha', 'aberto domingo', 'adega de vinhos'],
        fontes: ['Google Maps', 'Instagram', 'Portal Gastronômico Local'],
        diferenciais: ['Perfil no Google 100% completo com fotos semanais', 'Cardápio estruturado'],
      },
      {
        nome: 'Concorrente B',
        participacao: 28,
        atributos: ['delivery rápido', 'promoção de terça', 'borda recheada'],
        fontes: ['App de Delivery', 'Google Maps'],
        diferenciais: ['Horários em tempo real atualizados em apps'],
      },
      {
        nome: 'Concorrente C',
        participacao: 21,
        atributos: ['massa napolitana', 'ambiente instagramável'],
        fontes: ['Instagram', 'Blog de Avaliações'],
        diferenciais: ['Grande volume de avaliações recentes'],
      },
      {
        nome: 'Concorrente D',
        participacao: 15,
        atributos: ['preço acessível', 'combo família'],
        fontes: ['Diretório Local'],
        diferenciais: ['Presença em listas de bairros'],
      },
      {
        nome: 'Concorrente E',
        participacao: 11,
        atributos: ['rodízio variado'],
        fontes: ['Portal de Turismo'],
        diferenciais: ['Menção em guias de viagens'],
      },
    ];
  }

  async fontes(diagnosticoId: string): Promise<FonteLocal[]> {
    await this.sleep(300);
    return [
      {
        nome: 'Perfil da Empresa no Google',
        tipo: 'google_maps',
        citacoes: 44,
        negocioPresente: true,
        urlCadastro: 'https://business.google.com',
      },
      {
        nome: 'Portal Gastronômico da Cidade',
        tipo: 'portal_local',
        citacoes: 36,
        negocioPresente: false,
        urlCadastro: 'https://exemplo.com/cadastre-seu-restaurante',
      },
      {
        nome: 'Instagram Oficial',
        tipo: 'instagram',
        citacoes: 31,
        negocioPresente: true,
      },
      {
        nome: 'Guia de Bairros & Comércio Local',
        tipo: 'diretorio',
        citacoes: 26,
        negocioPresente: false,
        urlCadastro: 'https://exemplo.com/incluir-empresa',
      },
      {
        nome: 'Aplicativo de Delivery Principal',
        tipo: 'delivery',
        citacoes: 22,
        negocioPresente: false,
        urlCadastro: 'https://exemplo.com/parceiros',
      },
      {
        nome: 'Blog Melhores da Cidade',
        tipo: 'blog',
        citacoes: 14,
        negocioPresente: false,
      },
    ];
  }

  async presenca(negocioId: string): Promise<ItemPresenca[]> {
    await this.sleep(300);
    return [
      {
        id: 'pres-1',
        categoria: 'google',
        titulo: 'Horário de domingo desatualizado no Google',
        evidencia: 'A IA mostrou seu horário como fechado aos domingos em 5 de 12 respostas.',
        gravidade: 'critica',
        impacto: 3,
        esforcoMin: 10,
        concluido: false,
      },
      {
        id: 'pres-2',
        categoria: 'avaliacoes',
        titulo: 'Responder avaliações sem resposta recente',
        evidencia: 'Existem 7 avaliações dos últimos 3 meses sem resposta da gerência.',
        gravidade: 'critica',
        impacto: 3,
        esforcoMin: 20,
        concluido: false,
      },
      {
        id: 'pres-3',
        categoria: 'site',
        titulo: 'Criar FAQ com perguntas frequentes dos clientes',
        evidencia: 'A IA não encontrou dados de entrega e opções vegetarianas no site oficial.',
        gravidade: 'media',
        impacto: 2,
        esforcoMin: 25,
        concluido: false,
      },
      {
        id: 'pres-4',
        categoria: 'google',
        titulo: 'Adicionar descrição detalhada dos pratos e serviços',
        evidencia: 'Perfil do Google sem descrição de tipos de massa e forno a lenha.',
        gravidade: 'media',
        impacto: 2,
        esforcoMin: 15,
        concluido: true,
      },
      {
        id: 'pres-5',
        categoria: 'consistencia',
        titulo: 'Harmonizar telefone e endereço no Instagram e diretórios',
        evidencia: 'Divergência de DDD em 1 diretório local.',
        gravidade: 'baixa',
        impacto: 1,
        esforcoMin: 15,
        concluido: false,
      },
    ];
  }

  async plano(negocioId: string): Promise<AcaoPlano[]> {
    await this.sleep(300);
    return [
      {
        id: 'act-1',
        itemPresencaId: 'pres-1',
        titulo: 'Corrigir horário de funcionamento no Perfil da Empresa no Google',
        janela: 'semana',
        passos: [
          'Acesse o Google e digite "meu negócio" ou abra o app Google Maps.',
          'Clique em "Editar perfil" e selecione "Horário de funcionamento".',
          'Ative o domingo das 18:00 às 23:30 e salve as alterações.',
        ],
        conteudoPronto:
          'Horário oficial atualizado:\nSegunda: Fechado\nTerça a Domingo: 18:00 às 23:30\nFeriados: 18:00 às 23:30',
        concluida: false,
      },
      {
        id: 'act-2',
        itemPresencaId: 'pres-2',
        titulo: 'Responder avaliações recentes com palavras-chave do nicho',
        janela: 'semana',
        passos: [
          'Abra o painel de avaliações do Google.',
          'Responda às 3 avaliações mais recentes usando os modelos prontos.',
        ],
        conteudoPronto:
          'Olá, [NOME DO CLIENTE]! Muito obrigado pelo carinho e pela preferência. É um prazer preparar nossas pizzas artesanais no forno a lenha aqui na Aldeota para você. Esperamos você em breve!',
        concluida: false,
      },
      {
        id: 'act-3',
        itemPresencaId: 'pres-3',
        titulo: 'Inserir seção de Perguntas Frequentes (FAQ) no site oficial',
        janela: '30dias',
        passos: [
          'Acesse o painel do seu site ou envie para o desenvolvedor.',
          'Copie o bloco de 5 perguntas e respostas abaixo e insira na página inicial.',
        ],
        conteudoPronto:
          '1. Qual o horário de atendimento?\nAtendemos de terça a domingo das 18h às 23h30.\n\n2. Vocês fazem entrega em domicílio?\nSim, entregamos em toda a Aldeota, Meireles e bairros vizinhos via delivery próprio e WhatsApp.\n\n3. Quais as opções vegetarianas?\nOferecemos pizza de Marguerita especial, Quatro Queijos artesanal e Cogumelos frescos.',
        concluida: false,
      },
      {
        id: 'act-4',
        titulo: 'Cadastrar o negócio no Guia Comercial da Cidade',
        janela: '30dias',
        passos: [
          'Acesse a página de cadastro do guia local.',
          'Preencha nome oficial, telefone (85) 3244-1234 e endereço completo.',
        ],
        conteudoPronto:
          'Pizzaria Exemplo - Pizzaria artesanal tradicional em Fortaleza. Forno a lenha, massas de fermentação longa e entrega rápida. Endereço: Rua Desembargador Moreira, 700 - Aldeota.',
        concluida: false,
      },
      {
        id: 'act-5',
        titulo: 'Publicar atualização com fotos semanais de pratos e ambiente',
        janela: 'continuo',
        passos: [
          'Tire 3 fotos com boa iluminação das pizzas saindo do forno.',
          'Publique na aba "Adicionar atualização" do Perfil do Google.',
        ],
        conteudoPronto:
          'Forno a lenha aquecido e massas frescas preparadas para hoje! Venha experimentar nossa pizza especial no coração da Aldeota.',
        concluida: true,
        concluidaEm: '2026-10-14T19:00:00Z',
      },
    ];
  }

  async concluirAcao(id: string, concluida: boolean): Promise<void> {
    await this.sleep(200);
  }

  async serieTemporal(negocioId: string, dias: number): Promise<PontoSerie[]> {
    await this.sleep(300);
    // Série suave de 30 dias de 33 a 41 com 3 ações concluídas
    const pontos: PontoSerie[] = [];
    const hoje = new Date('2026-10-18T12:00:00Z');

    for (let i = dias - 1; i >= 0; i--) {
      const d = new Date(hoje);
      d.setDate(d.getDate() - i);
      const dataIso = d.toISOString().split('T')[0];

      // Curva suave subindo de 33 para 41
      const progress = (dias - 1 - i) / (dias - 1);
      const valor = Math.round(33 + progress * 8);
      const min = Math.max(0, valor - 7);
      const max = Math.min(100, valor + 8);

      let acaoId: string | undefined;
      let acaoTitulo: string | undefined;

      if (i === 20) {
        acaoId = 'act-old-1';
        acaoTitulo = 'Atualizar fotos no Google';
      } else if (i === 12) {
        acaoId = 'act-old-2';
        acaoTitulo = 'Corrigir endereço no site';
      } else if (i === 4) {
        acaoId = 'act-5';
        acaoTitulo = 'Publicar atualização com fotos no Google';
      }

      pontos.push({
        data: dataIso,
        valor,
        min,
        max,
        acaoId,
        acaoTitulo,
      });
    }

    return pontos;
  }

  async gerarRelatorio(diagnosticoId: string): Promise<{ id: string; url: string }> {
    await this.sleep(500);
    const relatorioId = `rel-${diagnosticoId}-${Date.now().toString(36)}`;
    return {
      id: relatorioId,
      url: `/r/${relatorioId}`,
    };
  }
}
