import { describe, it, expect } from 'vitest';
import {
  calcularScore,
  calcularIntervaloWilson,
  calcularPontuacaoPrioridade,
  obterInfoFaixa,
} from './score';

describe('score.ts - Testes Unitários de Regras de Negócio', () => {
  it('deve calcular os pesos do score corretamente (40%, 15%, 15%, 15%, 15%)', () => {
    // Caso com 100 em tudo
    const resMax = calcularScore({
      taxaCitacao: 100,
      posicaoMedia: 100,
      dadosCorretos: 100,
      controleFontes: 100,
      qualidadeRecomendacao: 100,
      totalRespostas: 48,
      citacoes: 48,
    });
    expect(resMax.valor).toBe(100);

    // Caso com 0 em tudo
    const resMin = calcularScore({
      taxaCitacao: 0,
      posicaoMedia: 0,
      dadosCorretos: 0,
      controleFontes: 0,
      qualidadeRecomendacao: 0,
      totalRespostas: 48,
      citacoes: 0,
    });
    expect(resMin.valor).toBe(0);
  });

  it('deve lidar com caso extremo: 0 respostas totais sem quebrar', () => {
    const res = calcularScore({
      taxaCitacao: 0,
      posicaoMedia: null,
      dadosCorretos: 0,
      controleFontes: 0,
      qualidadeRecomendacao: 0,
      totalRespostas: 0,
      citacoes: 0,
    });
    expect(res.valor).toBe(0);
    expect(res.faixaMin).toBe(0);
    expect(res.faixaMax).toBe(0);
  });

  it('deve calcular intervalo de Wilson consistente', () => {
    const wilson = calcularIntervaloWilson(8, 48);
    expect(wilson.min).toBeGreaterThan(0.05);
    expect(wilson.max).toBeLessThan(0.35);
    expect(wilson.min).toBeLessThan(wilson.max);
  });

  it('deve atribuir as faixas corretas de score (0 a 39 coral, 40 a 69 ambar, 70 a 100 aurora)', () => {
    expect(obterInfoFaixa(35).chave).toBe('invisivel');
    expect(obterInfoFaixa(35).corHex).toBe('#FF6B4A');

    expect(obterInfoFaixa(41).chave).toBe('pouco');
    expect(obterInfoFaixa(41).corHex).toBe('#F5B544');

    expect(obterInfoFaixa(85).chave).toBe('visivel');
    expect(obterInfoFaixa(85).corHex).toBe('#19B8A5');
  });

  it('deve ordenar prioridades pela fórmula gravidade * impacto / esforço', () => {
    // Crítica (3) * Impacto (3) / Esforço <=15 (1) = 9
    const p1 = calcularPontuacaoPrioridade('critica', 3, 10);
    expect(p1).toBe(9);

    // Média (2) * Impacto (2) / Esforço <=60 (2) = 2
    const p2 = calcularPontuacaoPrioridade('media', 2, 30);
    expect(p2).toBe(2);

    expect(p1).toBeGreaterThan(p2);
  });
});
