import { useState, useMemo, useEffect } from "react";
import { obterRelatorios } from "@/acoes/relatorios";
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
  const [relatorios, setRelatorios] = useState<Relatorio[]>([]);
  const [isModalRecentesAberto, setIsModalRecentesAberto] = useState(false);

  useEffect(() => {
    async function inicializar() {
      try {
        const dados = await obterRelatorios();
        setRelatorios(dados);
      } catch (e) {
        console.error("Erro ao inicializar hub", e);
      } finally {
        setCarregando(false);
      }
    }

    // Carregar relatórios recentes do localStorage
    const salvos = localStorage.getItem('recent_reports');
    if (salvos) {
      try {
        setRelatoriosRecentes(JSON.parse(salvos));
      } catch (e) {
        console.error("Erro ao carregar recentes", e);
      }
    }

    inicializar();
  }, []);

  const totalRelatorios = relatorios.length;

  const categorias = useMemo(() => {
    const cats = new Set(relatorios.map(r => r.categoria).filter(Boolean));
    return ["Todos", ...Array.from(cats)];
  }, [relatorios]);

  const relatoriosFiltrados = useMemo(() => {
    return relatorios.filter(relatorio => {
      const matchesPesquisa = relatorio.titulo.toLowerCase().includes(pesquisa.toLowerCase()) || 
                              relatorio.descricao?.toLowerCase().includes(pesquisa.toLowerCase());
      const matchesCategoria = categoriaAtiva === "Todos" || relatorio.categoria === categoriaAtiva;
      return matchesPesquisa && matchesCategoria;
    });
  }, [relatorios, pesquisa, categoriaAtiva]);

  const recarregarRelatorios = async () => {
    try {
      const dados = await obterRelatorios();
      setRelatorios(dados);
    } catch (e) {
      console.error("Erro ao recarregar", e);
    }
  };

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
    relatoriosFiltrados,
    recarregarRelatorios
  };
}
