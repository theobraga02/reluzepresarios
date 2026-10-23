import { describe, it, expect } from 'vitest';
import { formatarNumeroPtBr, formatarPorcentagem, formatarDataPtBr, formatarTelefone } from './format';

describe('format.ts - Formatações em Português do Brasil', () => {
  it('deve formatar números com vírgula decimal pt-BR', () => {
    expect(formatarNumeroPtBr(1234.5, 1)).toBe('1.234,5');
    expect(formatarNumeroPtBr(100, 0)).toBe('100');
  });

  it('deve formatar porcentagens arredondadas', () => {
    expect(formatarPorcentagem(17.4)).toBe('17%');
    expect(formatarPorcentagem(99.6)).toBe('100%');
  });

  it('deve formatar datas em dd/mm/aaaa', () => {
    const data = new Date('2026-10-18T12:00:00Z');
    expect(formatarDataPtBr(data)).toContain('18/10/2026');
  });

  it('deve formatar telefones com DDD brasileiro', () => {
    expect(formatarTelefone('85991234567')).toBe('(85) 99123-4567');
    expect(formatarTelefone('8532441234')).toBe('(85) 3244-1234');
  });
});
