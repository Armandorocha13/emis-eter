export interface Relatorio {
  id: string;
  titulo: string;
  urlExterna: string;
  descricao: string;
  categoria: string;
}

export interface EstatisticasGerais {
  totalRelatorios: number;
}
