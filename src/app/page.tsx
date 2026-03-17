import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

export default function WelcomePage() {
  return (
    <main className="min-h-screen bg-white flex flex-col items-center justify-center p-6 relative">

      {/* Subtle Grid Pattern Background */}
      <div className="absolute inset-0 z-0 opacity-[0.03]"
        style={{ backgroundImage: 'radial-gradient(#000 1px, transparent 1px)', backgroundSize: '40px 40px' }} />

      <div className="relative z-10 flex flex-col items-center text-center space-y-8 max-w-4xl animate-in fade-in duration-1000">

        {/* Large Logo Container - Clean & Corporate */}
        <div className="relative group p-0">
          <div className="relative w-40 h-40 md:w-56 md:h-56 flex items-center justify-center">
            <Image
              src="/logo-ffa.png"
              alt="FFA Logo"
              width={280}
              height={280}
              className="object-contain"
              priority
            />
          </div>
        </div>

        {/* Text Section - Minimalist & High Contrast */}
        <div className="space-y-4 px-4">
          <div className="space-y-1">
            <span className="text-[10px] font-black uppercase tracking-[0.6em] text-zinc-400">FFA Gestão Integrada</span>
            <h1 className="text-2xl sm:text-3xl md:text-5xl font-black text-black tracking-tighter leading-[0.9] uppercase">
              Portal de Inteligência <br className="hidden md:block" /> <span className="text-zinc-300">Corporativa</span>
            </h1>
          </div>

          <p className="text-zinc-500 font-medium text-base md:text-lg tracking-tight leading-relaxed max-w-xl mx-auto">
            Plataforma dedicada à consolidação de dados,
            análise de produtividade e monitoramento de KPIs operacionais.
          </p>
        </div>

        {/* Action Button - Contrast Style */}
        <Link href="/hub">
          <button className="group relative px-10 py-4 bg-black text-white font-black uppercase tracking-widest rounded-[20px] transition-all hover:bg-zinc-800 active:scale-95 shadow-2xl flex items-center gap-4">
            Acessar Plataforma <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </button>
        </Link>
      </div>

      {/* Corporate Info Header */}
      <div className="absolute top-0 left-0 right-0 text-center p-5 z-20">
        <span className="text-[10px] font-bold uppercase tracking-[0.4em] text-zinc-300">
          Feito por AeroCode - 2026
        </span>
      </div>
    </main>
  );
}
