import { useEffect, useState } from 'react'
import { carregarMidia, type Foto } from './nuvem-admin'

export const FRASES = [
  'Disciplina é escolher o que você quer mais, em vez do que você quer agora.',
  'Pequenos passos todos os dias vencem grandes planos que nunca começam.',
  'Você não precisa ser perfeito. Precisa ser constante.',
  'Quem cuida do corpo, da mente e do dinheiro constrói liberdade.',
  'O resultado de hoje é a soma das decisões pequenas de ontem.',
  'Comece onde você está. Use o que você tem. Faça o que você pode.',
  'Motivação te faz começar. Hábito te faz continuar.',
  'Foco no processo: o placar cuida de si mesmo.',
  'Um negócio forte nasce de um dia bem executado, repetido.',
  'Descanse se precisar, mas não desista.',
  'Sua versão de daqui a um ano agradece o que você fizer hoje.',
  'Cada venda começa com um "sim" a si mesmo: eu vou tentar de novo.',
]

const U = (id: string) => `https://images.unsplash.com/photo-${id}?auto=format&fit=crop&w=900&q=60`
export const FOTOS: Foto[] = [
  { url: U('1476480862126-209bfaa8edc8'), texto: 'Um passo de cada vez' },
  { url: U('1454496522488-7a8e488e8606'), texto: 'Suba mais um degrau' },
  { url: U('1517836357463-d25dfeac3438'), texto: 'Treino feito, mente limpa' },
  { url: U('1552664730-d307ca884978'), texto: 'Negócios crescem com gente' },
  { url: U('1506126613408-eca07ce68773'), texto: 'Respire. Foque. Siga.' },
  { url: U('1486406146926-c627a92ad1ab'), texto: 'Construa o seu império' },
]

export type Motivo = { frase: string; foto: Foto }

/** Frase + foto do dia (estáveis no dia), misturando as embutidas com as cadastradas no painel de administração. */
export function useMotivacao(): Motivo {
  const dia = Math.floor(Date.now() / 864e5)
  const [extra, setExtra] = useState<{ frases: string[]; fotos: Foto[] }>({ frases: [], fotos: [] })
  useEffect(() => { void carregarMidia().then(setExtra).catch(() => {}) }, [])
  const frases = [...FRASES, ...extra.frases]
  const fotos = [...FOTOS, ...extra.fotos]
  return { frase: frases[dia % frases.length], foto: fotos[dia % fotos.length] }
}
