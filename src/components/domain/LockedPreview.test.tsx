import { describe, it, expect } from 'vitest';
import React from 'react';
import { render } from '@testing-library/react';
import { LockedPreview } from './LockedPreview';

describe('LockedPreview - Regras Inegociáveis de Honestidade dos Dados', () => {
  it('não deve conter nenhum dado real do negócio no DOM, HTML ou estado', () => {
    const { container } = render(<LockedPreview onCtaClick={() => {}} />);
    const html = container.innerHTML;

    // Regra 2: "Conteúdo bloqueado antes do cadastro é placeholder, nunca dado real escondido só por CSS"
    expect(html).not.toContain('Pizzaria Exemplo');
    expect(html).not.toContain('Aldeota');
    expect(html).not.toContain('3244-1234');
    expect(html).not.toContain('Rua Desembargador');
    expect(html).not.toContain('Concorrente A');

    // Deve conter elementos genéricos de layout
    expect(html).toContain('Relatório completo com mais de 40 buscas');
  });
});
