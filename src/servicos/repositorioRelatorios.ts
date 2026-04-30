import { db } from "./banco/cliente";
import { Relatorio } from "@/tipos/relatorio";

/**
 * Repositório responsável por fornecer os dados dos relatórios via Neon DB.
 */
export const repositorioRelatorios = {
  /**
   * Retorna a lista completa de relatórios disponíveis no banco.
   */
  obterTodosRelatorios: async (): Promise<Relatorio[]> => {
    try {
      const resultados = await db.query.relatorios.findMany({
        orderBy: (relatorios, { desc }) => [desc(relatorios.criadoEm)],
      });

      // Mapear campos do banco para o padrão da aplicação
      return resultados.map(r => ({
        id: r.id,
        titulo: r.titulo,
        urlExterna: r.urlExterna,
        descricao: r.descricao || "",
        categoria: r.categoria
      }));
    } catch (erro) {
      console.error("Erro ao buscar relatórios no Neon:", erro);
      return []; // Fallback para lista vazia
    }
  },

  /**
   * Retorna o total de relatórios ativos.
   */
  obterContagemTotal: async (): Promise<number> => {
    const relatorios = await repositorioRelatorios.obterTodosRelatorios();
    return relatorios.length;
  }
};
