'use client';

import { useRouter } from "next/navigation";
import { useState } from "react";
import { CartaoBase, ConteudoCartao, RodapeCartao, CabecalhoCartao, TituloCartao } from "@/componentes/comuns/cartaoBase";
import { ArrowRight } from "lucide-react";

interface CartaoRelatorioProps {
  id: string;
  titulo: string;
  descricao?: string;
  urlExterna?: string;
  categoria?: string;
  operadora?: string;
}

const obterLogoOperadora = (operadora?: string) => {
  switch (operadora) {
    case 'Claro': return '/claro.png';
    case 'Vivo': return '/vivo.png';
    case 'TIM': return '/tim.png';
    case 'IHS': return '/ihs.png';
    case 'FFA': return '/logo-ffa.png';
    default: return '/logo-ffa.png';
  }
};

/**
 * Cartão de apresentação de um relatório individual no Hub.
 */
export function CartaoRelatorio({ id, titulo, descricao, urlExterna, categoria, operadora }: CartaoRelatorioProps) {
  const router = useRouter();
  const linkHref = urlExterna || `/${id}`;
  const ehExterno = !!urlExterna;
  const [estaCarregando, setEstaCarregando] = useState(false);

  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    
    if (ehExterno) {
      // Abre dentro do nosso visualizador interno (iframe) para manter a máscara de carregamento
      const params = new URLSearchParams({ url: linkHref, titulo });
      router.push(`/hub/visualizar?${params.toString()}`);
    } else {
      setEstaCarregando(true);
      setTimeout(() => router.push(linkHref), 300);
      setTimeout(() => setEstaCarregando(false), 5000);
    }
  };

  // IHS sempre mostra TIM + IHS lado a lado
  const ehIHS = operadora === 'IHS' || operadora === 'TIM IHS';

  const renderLogos = () => {
    if (ehIHS) {
      return (
        <div className="flex items-center -space-x-4 group-hover:scale-105 transition-transform duration-500">
          <img src="/tim.png" alt="TIM" className="w-16 h-16 rounded-full border-[3px] border-white shadow-lg object-contain p-1.5 bg-white relative z-10" />
          <img src="/ihs.png" alt="IHS" className="w-16 h-16 rounded-full border-[3px] border-white shadow-lg object-contain p-1.5 bg-white relative z-0" />
        </div>
      );
    }
    
    if (operadora && operadora !== 'FFA') {
      return (
        <div className="group-hover:scale-105 transition-transform duration-500">
          <img 
            src={obterLogoOperadora(operadora)} 
            alt={`Logo ${operadora}`}
            className="w-16 h-16 rounded-full border-[3px] border-white shadow-lg object-contain p-1.5 bg-white"
          />
        </div>
      );
    }
    
    return (
      <div className="group-hover:scale-105 transition-transform duration-500">
        <img 
          src="/logo-ffa.png" 
          alt="FFA"
          className="w-16 h-16 rounded-full border-[3px] border-white shadow-lg object-contain p-1.5 bg-white"
        />
      </div>
    );
  };

  return (
    <>
      {estaCarregando && (
        <div className="fixed inset-0 z-[9999] bg-white/95 backdrop-blur-sm flex flex-col items-center justify-center animate-in fade-in duration-300">
          <img src="/logo-ffa.png" alt="FFA" className="w-32 h-auto mb-8 animate-pulse" />
          <div className="w-64 h-2 bg-zinc-100 rounded-full overflow-hidden flex">
             <div className="h-full bg-black w-1/2 rounded-full animate-pulse transform -translate-x-full animate-[slideRight_1.5s_infinite_ease-in-out_alternate]" 
                  style={{ animation: 'slideRight 1s infinite alternate ease-in-out' }} />
          </div>
          <span className="mt-4 text-[10px] font-black uppercase tracking-widest text-zinc-400">
             Abrindo Dashboard...
          </span>
          <style>{`
            @keyframes slideRight {
              0% { transform: translateX(0%); width: 20%; }
              100% { transform: translateX(400%); width: 80%; }
            }
          `}</style>
        </div>
      )}
      
      <a 
        href={linkHref} 
        onClick={handleClick}
        className="block group transition-all"
      >
        <CartaoBase className="h-full min-h-[220px] border-zinc-100 shadow-sm transition-all duration-500 group-hover:border-black group-hover:shadow-2xl rounded-2xl bg-white flex flex-col relative">
        
        <CabecalhoCartao className="flex flex-row items-center justify-between space-y-0 px-6 pt-6 pb-2">
          <div className="flex flex-col gap-1">
             <span className="text-[9px] font-black uppercase tracking-[0.2em] text-zinc-400">
               Relatório {categoria ? `· ${categoria}` : ''}
             </span>
          </div>
          <div className="flex items-center">
            {renderLogos()}
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
      </a>
    </>
  );
}
