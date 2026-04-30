import Link from "next/link";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowRight, FileText, Settings, TrendingUp, Package, Database } from "lucide-react";

interface ReportCardProps {
  title: string;
  slug: string;
  description?: string;
  externalUrl?: string;
  category?: string;
}

const getReportIcon = (slug: string) => {
  switch (slug) {
    case 'giro-maquinarios': return <Settings className="w-5 h-5" />;
    case 'projecao-reposicao': return <TrendingUp className="w-5 h-5" />;
    default: return <Package className="w-5 h-5" />;
  }
};

export function ReportCard({ title, slug, description, externalUrl, category }: ReportCardProps) {
  const href = externalUrl || `/${slug}`;
  const isExternal = !!externalUrl;

  const handleAccess = () => {
    try {
        const recent = JSON.parse(localStorage.getItem('recent_reports') || '[]');
        const newItem = { id: slug, title, category, externalUrl, description };
        
        // Remove duplicate if exists
        const filtered = recent.filter((r: any) => r.id !== slug);
        
        // Add to front and limit to 3
        const updated = [newItem, ...filtered].slice(0, 3);
        localStorage.setItem('recent_reports', JSON.stringify(updated));
    } catch (e) {
        console.error("Error saving recent report", e);
    }
  };

  return (
    <Link 
      href={href} 
      onClick={handleAccess}
      className="block group transition-all"
    >
      <Card className="h-full min-h-[220px] border-zinc-100 shadow-sm transition-all duration-500 group-hover:border-black group-hover:shadow-2xl rounded-2xl bg-white flex flex-col relative">
        
        {/* Header: Label and Icon (KPI Style) */}
        <CardHeader className="flex flex-row items-center justify-between space-y-0 px-6 pt-6 pb-2">
          <div className="flex flex-col gap-1">
             <span className="text-[9px] font-black uppercase tracking-[0.2em] text-zinc-400">
               Relatório {category ? `· ${category}` : ''}
             </span>
          </div>
          <div className="p-2 bg-zinc-50 rounded-lg border border-zinc-100 shadow-sm group-hover:bg-black group-hover:text-white group-hover:shadow-lg transition-all duration-500 text-black">
            {getReportIcon(slug)}
          </div>
        </CardHeader>

        {/* Content: Large Title (KPI Style) */}
        <CardContent className="px-6 flex-grow flex flex-col justify-center">
          <div className="flex items-center gap-2 mb-2">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
            </span>
            <span className="text-[8px] font-bold text-emerald-600 uppercase tracking-tighter">Online</span>
          </div>
          
          <CardTitle className="text-2xl font-black text-black tracking-tighter uppercase leading-[0.9] group-hover:translate-x-1 transition-transform duration-500">
            {title}
          </CardTitle>
          
          <p className="text-[10px] text-zinc-400 mt-4 font-bold uppercase tracking-wider leading-tight">
            {description || "Gestão Integrada para acompanhamento corporativo FFA."}
          </p>
        </CardContent>
        
        {/* Footer: Action Label */}
        <CardFooter className="px-6 pb-6 pt-2 border-t border-zinc-50 mx-6 mt-2">
          <div className="flex items-center gap-1 text-[9px] font-black uppercase tracking-widest text-zinc-300 group-hover:text-black transition-colors">
            {isExternal && externalUrl?.includes('powerbi.com') ? "Ver PowerBI" : "Acessar Relatório"} <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
          </div>
        </CardFooter>
      </Card>
    </Link>
  );
}
