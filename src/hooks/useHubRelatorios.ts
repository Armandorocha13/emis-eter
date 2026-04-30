import { useState, useMemo, useEffect } from "react";
import { repositorioRelatorios } from "@/servicos/repositorioRelatorios";
import { Relatorio } from "@/tipos/relatorio";

/**
 * Hook customizado para gerenciar a lógica de negócio do Hub de Relatórios.
 * Encapsula busca, filtragem, carregamento e histórico.
 */
export function useHubRelatorios() {
  const [pesquisa, setPesquisa] = useState("");
  const [categoriaAtiva, setCategoriaAtiva] = useState("Todos");
  const [carregando, setCarregando] = useState(true);
  const [relatoriosRecentes, setRelatoriosRecentes] = useState<Relatorio[]>([]);
  const [isModalRecentesAberto, setIsModalRecentesAberto] = useState(false);

  const todosRelatorios = repositorioRelatorios.obterTodosRelatorios();
  const totalRelatorios = repositorioRelatorios.obterContagemTotal();

  useEffect(() => {
    // Carregar relatórios recentes do localStorage
    const salvos = localStorage.getItem('recent_reports');
    if (salvos) {
      try {
        setRelatoriosRecentes(JSON.parse(salvos));
      } catch (e) {
        console.error("Erro ao carregar recentes", e);
      }
    }

    // Simular carregamento inicial
    const timer = setTimeout(() => setCarregando(false), 1200);
    return () => clearTimeout(timer);
  }, []);

  const categorias = useMemo(() => {
    const cats = new Set(todosRelatorios.map(r => r.categoria).filter(Boolean));
    return ["Todos", ...Array.from(cats)];
  }, [todosRelatorios]);

  const relatoriosFiltrados = useMemo(() => {
    return todosRelatorios.filter(relatorio => {
      const matchesPesquisa = relatorio.titulo.toLowerCase().includes(pesquisa.toLowerCase()) || 
                              relatorio.descricao?.toLowerCase().includes(pesquisa.toLowerCase());
      const matchesCategoria = categoriaAtiva === "Todos" || relatorio.categoria === categoriaAtiva;
      return matchesPesquisa && matchesCategoria;
    });
  }, [todosRelatorios, pesquisa, categoriaAtiva]);

  return {
    pesquisa,
    setPesquisa,
    categoriaAtiva,
    setCategoriaAtiva,
    carregando,
    relatoriosRecentes,
    isModalRecentesAberto,
    setIsModalRecentesAberto,
    totalRelatorios,
    categorias,
    relatoriosFiltrados
  };
}
