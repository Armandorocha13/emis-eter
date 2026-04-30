import Link from "next/link";
import { CartaoBase, ConteudoCartao, RodapeCartao, CabecalhoCartao, TituloCartao } from "@/componentes/comuns/cartaoBase";
import { ArrowRight, Settings, TrendingUp, Package, Clock, Database } from "lucide-react";

interface CartaoRelatorioProps {
  id: string;
  titulo: string;
  descricao?: string;
  urlExterna?: string;
  categoria?: string;
}

const obterIconeRelatorio = (id: string) => {
  switch (id) {
    case 'giro-maquinarios': return <Settings className="w-5 h-5" />;
    case 'projecao-reposicao': return <TrendingUp className="w-5 h-5" />;
    default: return <Package className="w-5 h-5" />;
  }
};

/**
 * Cartão de apresentação de um relatório individual no Hub.
 */
export function CartaoRelatorio({ id, titulo, descricao, urlExterna, categoria }: CartaoRelatorioProps) {
  const linkHref = urlExterna || `/${id}`;
  const ehExterno = !!urlExterna;

  const registrarAcesso = () => {
    try {
        const recentes = JSON.parse(localStorage.getItem('recent_reports') || '[]');
        const novoItem = { id, title: titulo, category: categoria, externalUrl: urlExterna, description: descricao };
        
        const filtrados = recentes.filter((r: any) => r.id !== id);
        const atualizados = [novoItem, ...filtrados].slice(0, 3);
        localStorage.setItem('recent_reports', JSON.stringify(atualizados));
    } catch (erro) {
        console.error("Erro ao salvar relatório recente", erro);
    }
  };

  return (
    <Link 
      href={linkHref} 
      onClick={registrarAcesso}
      className="block group transition-all"
    >
      <CartaoBase className="h-full min-h-[220px] border-zinc-100 shadow-sm transition-all duration-500 group-hover:border-black group-hover:shadow-2xl rounded-2xl bg-white flex flex-col relative">
        
        <CabecalhoCartao className="flex flex-row items-center justify-between space-y-0 px-6 pt-6 pb-2">
          <div className="flex flex-col gap-1">
             <span className="text-[9px] font-black uppercase tracking-[0.2em] text-zinc-400">
               Relatório {categoria ? `· ${categoria}` : ''}
             </span>
          </div>
          <div className="p-2 bg-zinc-50 rounded-lg border border-zinc-100 shadow-sm group-hover:bg-black group-hover:text-white group-hover:shadow-lg transition-all duration-500 text-black">
            {obterIconeRelatorio(id)}
          </div>
        </CabecalhoCartao>

        <ConteudoCartao className="px-6 flex-grow flex flex-col justify-center">
          <div className="flex items-center gap-2 mb-2">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
            </span>
            <span className="text-[8px] font-bold text-emerald-600 uppercase tracking-tighter">Online</span>
          </div>
          
          <TituloCartao className="text-2xl font-black text-black tracking-tighter uppercase leading-[0.9] group-hover:translate-x-1 transition-transform duration-500">
            {titulo}
          </TituloCartao>
          
          <p className="text-[10px] text-zinc-400 mt-4 font-bold uppercase tracking-wider leading-tight">
            {descricao || "Gestão Integrada para acompanhamento corporativo FFA."}
          </p>
        </ConteudoCartao>
        
        <RodapeCartao className="px-6 pb-6 pt-2 border-t border-zinc-50 mx-6 mt-2">
          <div className="flex items-center gap-1 text-[9px] font-black uppercase tracking-widest text-zinc-300 group-hover:text-black transition-colors">
            {ehExterno && urlExterna?.includes('powerbi.com') ? "Ver PowerBI" : "Acessar Relatório"} <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
          </div>
        </RodapeCartao>
      </CartaoBase>
    </Link>
  );
}
