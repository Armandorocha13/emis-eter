import Image from "next/image";
import { getTotalReportsCount, getAvailableReportsMetada } from "@/core/utils/report-stats";
import { KpiStats } from "@/components/hub/KpiStats";
import { ReportCard } from "@/components/hub/ReportCard";

export const dynamic = 'force-dynamic';

export default function HubPage() {
  const total = getTotalReportsCount();
  const reports = getAvailableReportsMetada();

  return (
    <main className="min-h-screen bg-white p-4 md:p-8 animate-in fade-in duration-1000">
      <div className="max-w-7xl mx-auto space-y-8">
        
        {/* Header Section */}
        <section className="flex flex-col items-center justify-center space-y-4 pt-6 text-center">
          <div className="relative w-40 h-10 mb-2">
            <Image 
              src="/logo-ffa.png" 
              alt="FFA Logo" 
              fill 
              className="object-contain" 
              priority
            />
          </div>
          <div className="space-y-2">
            <h1 className="text-2xl md:text-4xl font-black text-black tracking-tighter uppercase">
              HUB de Relatórios <span className="text-zinc-300">FFA</span>
            </h1>
            <p className="text-zinc-500 font-medium max-w-lg mx-auto text-sm md:text-base leading-relaxed">
              Estrutura corporativa de análise e tomada de decisão através de dashboards dinâmicos e precisos.
            </p>
          </div>
        </section>

        {/* KPI Stats Section */}
        <section className="flex justify-center md:justify-start px-2">
           <KpiStats total={total} />
        </section>

        {/* Grid Section */}
        <section className="space-y-6 pt-4 px-2">
          <div className="flex items-center gap-2 border-b border-zinc-200 pb-4">
            <div className="w-1 h-6 bg-indigo-600 rounded-full" />
            <h2 className="text-lg font-black uppercase tracking-widest text-zinc-400">
              Relatórios Disponíveis
            </h2>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {reports.map((report) => (
              <ReportCard 
                key={report.id}
                title={report.title}
                slug={report.id}
                description={report.description}
                externalUrl={report.externalUrl}
              />
            ))}
            
            {/* Fallback empty message */}
            {reports.length === 0 && (
                <div className="col-span-full py-12 text-center">
                    <p className="text-zinc-400 font-medium italic">Nenhum relatório encontrado na pasta /data.</p>
                </div>
            )}
          </div>
        </section>

        {/* Footer info */}
        <footer className="pt-12 pb-6 text-center border-t border-zinc-100">
             <span className="text-[10px] font-bold uppercase tracking-widest text-zinc-300">
                Hub de Gestão Integrada © {new Date().getFullYear()} — Todos os direitos reservados
             </span>
        </footer>
      </div>
    </main>
  );
}
