'use server';

import { db } from "@/servicos/banco/cliente";
import { relatorios } from "@/servicos/banco/esquema";
import { desc } from "drizzle-orm";
import { revalidatePath } from "next/cache";

export async function obterRelatorios() {
  try {
    const resultados = await db.query.relatorios.findMany({
      orderBy: [desc(relatorios.criadoEm)],
    });

    return resultados.map((r) => ({
      id: r.id,
      titulo: r.titulo,
      urlExterna: r.urlExterna,
      descricao: r.descricao || "",
      categoria: r.categoria,
    }));
  } catch (erro) {
    console.error("Erro ao buscar relatórios no Neon:", erro);
    return [];
  }
}

/**
 * Ação de servidor para cadastrar um novo relatório no Neon DB.
 */
export async function cadastrarRelatorio(formData: FormData) {
  const titulo = formData.get('titulo') as string;
  const urlExterna = formData.get('urlExterna') as string;
  const descricao = formData.get('descricao') as string;
  const categoria = formData.get('categoria') as string;

  if (!titulo || !urlExterna || !categoria) {
    throw new Error("Campos obrigatórios ausentes");
  }

  try {
    await db.insert(relatorios).values({
      titulo,
      urlExterna,
      descricao,
      categoria,
    });

    // Revalidar o cache da página do hub
    revalidatePath('/hub');
    
    return { sucesso: true };
  } catch (erro) {
    console.error("Erro ao cadastrar relatório:", erro);
    return { sucesso: false, erro: "Falha ao salvar no banco de dados" };
  }
}
