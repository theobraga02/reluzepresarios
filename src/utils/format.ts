export function formatarNumeroPtBr(valor: number, casasDecimais: number = 0): string {
  return new Intl.NumberFormat('pt-BR', {
    minimumFractionDigits: casasDecimais,
    maximumFractionDigits: casasDecimais,
  }).format(valor);
}

export function formatarPorcentagem(valor: number): string {
  return `${Math.round(valor)}%`;
}

export function formatarDataPtBr(dataStr: string | Date): string {
  const d = typeof dataStr === 'string' ? new Date(dataStr) : dataStr;
  return new Intl.DateTimeFormat('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  }).format(d);
}

export function formatarDiaMesPtBr(dataStr: string | Date): string {
  const d = typeof dataStr === 'string' ? new Date(dataStr) : dataStr;
  return new Intl.DateTimeFormat('pt-BR', {
    day: '2-digit',
    month: '2-digit',
  }).format(d);
}

export function formatarTelefone(tel: string): string {
  const digits = tel.replace(/\D/g, '');
  if (digits.length === 11) {
    return `(${digits.slice(0, 2)}) ${digits.slice(2, 7)}-${digits.slice(7)}`;
  }
  if (digits.length === 10) {
    return `(${digits.slice(0, 2)}) ${digits.slice(2, 6)}-${digits.slice(6)}`;
  }
  return tel;
}
