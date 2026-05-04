'use client';

import { useSearchParams, useRouter } from 'next/navigation';
import { useState, Suspense } from 'react';
import { ArrowLeft } from 'lucide-react';

function VisualizadorConteudo() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const url = searchParams.get('url');
  const titulo = searchParams.get('titulo') || 'Dashboard';
  const [carregado, setCarregado] = useState(false);

  if (!url) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <p className="text-zinc-400 font-bold uppercase tracking-widest text-sm">URL não fornecida</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white relative">
      {/* Máscara de Carregamento — some só quando o iframe terminar de carregar */}
      {!carregado && (
        <div className="fixed inset-0 z-[9999] bg-white flex flex-col items-center justify-center">
          <img src="/logo-ffa.png" alt="FFA" className="w-40 h-auto mb-10 animate-pulse" />
          
          <div className="w-72 h-2.5 bg-zinc-100 rounded-full overflow-hidden relative">
            <div 
              className="h-full bg-black rounded-full absolute left-0 top-0"
              style={{ animation: 'barraProgresso 2s ease-in-out infinite' }} 
            />
          </div>

          <span className="mt-6 text-[10px] font-black uppercase tracking-[0.25em] text-zinc-400">
            Carregando {titulo}...
          </span>

          <style>{`
            @keyframes barraProgresso {
              0% { left: 0%; width: 0%; }
              50% { left: 10%; width: 60%; }
              100% { left: 100%; width: 0%; }
            }
          `}</style>
        </div>
      )}

      {/* Barra superior — aparece só depois de carregar */}
      <div className={`fixed top-0 left-0 right-0 z-[100] bg-white/80 backdrop-blur-md border-b border-zinc-100 px-6 py-3 flex items-center gap-4 transition-all duration-700 ${carregado ? 'translate-y-0 opacity-100' : '-translate-y-full opacity-0'}`}>
        <button 
          onClick={() => router.push('/hub')}
          className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-zinc-400 hover:text-black transition-colors group"
        >
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
          Voltar ao Hub
        </button>
        <div className="w-px h-6 bg-zinc-200" />
        <span className="text-[10px] font-black uppercase tracking-widest text-zinc-300 truncate">
          {titulo}
        </span>
      </div>

      {/* Iframe do Dashboard — fica completamente escondido atrás da máscara até estar pronto */}
      <iframe 
        src={url}
        className="w-full border-0"
        style={{ 
          height: '100vh', 
          paddingTop: carregado ? '52px' : '0',
          visibility: carregado ? 'visible' : 'hidden',
          position: carregado ? 'relative' : 'absolute'
        }}
        onLoad={() => {
          // Espera 4 segundos extras após o onLoad para o Power BI terminar seu carregamento interno
          setTimeout(() => setCarregado(true), 4000);
        }}
        allow="fullscreen"
        title={titulo}
      />
    </div>
  );
}

export default function VisualizarPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center bg-white">
        <img src="/logo-ffa.png" alt="FFA" className="w-40 h-auto animate-pulse" />
      </div>
    }>
      <VisualizadorConteudo />
    </Suspense>
  );
}
