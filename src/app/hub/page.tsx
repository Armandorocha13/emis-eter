'use client';

import Link from "next/link";
import Image from "next/image";
import { useHubRelatorios } from "@/hooks/useHubRelatorios";
import { EstatisticasKpi } from "@/componentes/central/EstatisticasKpi";
import { CartaoRelatorio } from "@/componentes/central/CartaoRelatorio";
import { EsqueletoRelatorio } from "@/componentes/central/EsqueletoRelatorio";
import { ModalCadastroRelatorio } from "@/componentes/central/ModalCadastroRelatorio";
import { Search, X } from "lucide-react";

export default function HubPage() {
  const {
    pesquisa,
    setPesquisa,
    categoriaAtiva,
    setCategoriaAtiva,
    carregando,
    totalRelatorios,
    categorias,
    relatoriosFiltrados,
    recarregarRelatorios
  } = useHubRelatorios();

  return (
    <main className="min-h-screen bg-zinc-50/80 p-4 md:p-8 animate-in fade-in duration-1000">
      <div className="max-w-7xl mx-auto space-y-8">
        
        {/* Navbar Superior */}
        <header className="flex justify-end items-center px-2">
          <ModalCadastroRelatorio onSucesso={recarregarRelatorios} />
        </header>

        {/* Cabeçalho Centrado */}
        <section className="flex flex-col items-center justify-center space-y-4 pt-2 pb-6 text-center">
          <div className="relative w-64 h-16 mb-2">
            <Image 
              src="/logo-ffa.png" 
              alt="FFA Logo" 
              fill 
              className="object-contain" 
              priority
            />
          </div>
          <div className="space-y-2">
            <h1 className="text-2xl md:text-4xl font-black text-black tracking-tighter uppercase leading-[0.8]">
              HUB de Relatórios <span className="text-zinc-300">FFA</span>
            </h1>
            <p className="text-zinc-500 font-medium max-w-lg mx-auto text-sm md:text-base leading-relaxed">
              Estrutura corporativa de análise e tomada de decisão através de dashboards dinâmicos e precisos.
            </p>
          </div>
        </section>

        {/* KPIs e Controles */}
        <section className="flex flex-col lg:flex-row gap-6 items-start lg:items-center justify-between px-2">
           <EstatisticasKpi total={totalRelatorios} />
           
           <div className="flex flex-col sm:flex-row gap-3 w-full lg:max-w-3xl items-center">
              <div className="relative flex-grow group w-full sm:w-auto">
                <Search className="absolute left-5 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400 group-focus-within:text-black transition-colors" />
                <input 
                  type="text" 
                  placeholder="Buscar relatório..." 
                  value={pesquisa}
                  onChange={(e) => setPesquisa(e.target.value)}
                  className="w-full h-[64px] pl-14 pr-4 bg-white border border-zinc-100 rounded-2xl text-[11px] font-bold uppercase tracking-widest focus:outline-none focus:border-black shadow-sm focus:shadow-xl transition-all"
                />
                {pesquisa && (
                  <button 
                    onClick={() => setPesquisa("")}
                    className="absolute right-5 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-black"
                  >
                    <X className="w-4 h-4" />
                  </button>
                )}
              </div>


              
              <div className="flex gap-2 overflow-x-auto pb-2 sm:pb-0 no-scrollbar w-full sm:w-auto">
                {categorias.map(cat => (
                  <button
                    key={cat}
                    onClick={() => setCategoriaAtiva(cat)}
                    className={`h-[64px] px-8 text-[10px] font-black uppercase tracking-widest border transition-all whitespace-nowrap rounded-2xl flex items-center justify-center shadow-sm ${
                      categoriaAtiva === cat 
                      ? "bg-black text-white border-black shadow-xl" 
                      : "bg-white text-zinc-400 border-zinc-100 hover:border-black hover:text-black hover:shadow-md"
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
           </div>
        </section>


        {/* Grid de Relatórios */}
        <section className="space-y-6 pt-4 px-2">
          <div className="flex items-center gap-2 border-b border-zinc-200 pb-4">
            <div className="w-1 h-6 bg-black rounded-full" />
            <h2 className="text-lg font-black uppercase tracking-widest text-zinc-400">
              {categoriaAtiva === "Todos" ? "Relatórios Disponíveis" : `Filtrando: ${categoriaAtiva}`}
            </h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {carregando ? (
              Array.from({ length: 2 }).map((_, i) => (
                <EsqueletoRelatorio key={i} />
              ))
            ) : (
              relatoriosFiltrados.map((relatorio) => (
                <CartaoRelatorio 
                  key={relatorio.id}
                  id={relatorio.id}
                  titulo={relatorio.titulo}
                  descricao={relatorio.descricao}
                  urlExterna={relatorio.urlExterna}
                  categoria={relatorio.categoria}
                  operadora={relatorio.operadora}
                />
              ))
            )}
            
            {!carregando && relatoriosFiltrados.length === 0 && (
                <div className="col-span-full py-20 text-center border-2 border-dashed border-zinc-100 rounded-2xl">
                    <p className="text-zinc-400 font-bold uppercase tracking-widest text-sm">Nenhum relatório encontrado</p>
                    <button 
                      onClick={() => {setPesquisa(""); setCategoriaAtiva("Todos");}}
                      className="mt-4 text-[10px] font-black uppercase tracking-widest text-black underline underline-offset-4"
                    >
                      Limpar Filtros
                    </button>
                </div>
            )}
          </div>
        </section>

        <footer className="pt-12 pb-6 text-center border-t border-zinc-100">
             <span className="text-[10px] font-bold uppercase tracking-widest text-zinc-300">
                Hub de Gestão Integrada © {new Date().getFullYear()} — Feito por AEROCODE
             </span>
        </footer>
      </div>
    </main>
  );
}
