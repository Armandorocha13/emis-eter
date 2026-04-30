import { Relatorio } from "@/tipos/relatorio";

/**
 * Repositório responsável por fornecer os dados dos relatórios.
 * Implementa o padrão Repository para isolar a fonte de dados da interface.
 */
export const repositorioRelatorios = {
  /**
   * Retorna a lista completa de relatórios disponíveis.
   */
  obterTodosRelatorios: (): Relatorio[] => {
    return [
      {
        id: 'giro-maquinarios',
        titulo: 'GIRO DE MAQUINARIOS',
        urlExterna: 'https://giromaquinarioestoqueffa.vercel.app/',
        descricao: 'Monitoramento em tempo real de estoque e giro de maquinários.',
        categoria: 'Operacional'
      },
      {
        id: 'projecao-reposicao',
        titulo: 'PROJEÇÃO DE REPOSIÇÃO DE MATERIAL',
        urlExterna: 'https://nextjsspace-iota-one.vercel.app/',
        descricao: 'Análise preditiva para reposição estratégica de materiais.',
        categoria: 'Estratégico'
      }
    ];
  },

  /**
   * Retorna o total de relatórios ativos.
   */
  obterContagemTotal: (): number => {
    return repositorioRelatorios.obterTodosRelatorios().length;
  }
};
