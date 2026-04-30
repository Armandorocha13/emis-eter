import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Database } from "lucide-react";

interface KpiStatsProps {
  total: number;
}

export function KpiStats({ total }: KpiStatsProps) {
  return (
    <Card className="w-full max-w-sm border-zinc-100 shadow-md transition-all hover:border-black rounded-2xl bg-white">
      <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0 px-6 pt-6">
        <CardTitle className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-400">
          Relatórios Ativos
        </CardTitle>
        <div className="p-2 bg-white rounded-lg border border-zinc-100 shadow-sm">
          <Database className="w-4 h-4 text-black" />
        </div>
      </CardHeader>
      <CardContent className="px-6 pb-6">
        <div className="flex items-baseline gap-2">
          <span className="text-5xl font-black text-black tracking-tighter">
              {total}
          </span>
          <span className="text-[10px] text-zinc-400 font-bold uppercase tracking-widest">
              Unidades
          </span>
        </div>
        <p className="text-[9px] text-zinc-400 mt-2 font-medium uppercase tracking-tight">
            Dashboards disponíveis para consulta imediata
        </p>
      </CardContent>
    </Card>
  );
}
