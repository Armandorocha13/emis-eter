import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Database } from "lucide-react";

interface KpiStatsProps {
  total: number;
}

export function KpiStats({ total }: KpiStatsProps) {
  return (
    <Card className="w-full max-w-xs border-zinc-200 shadow-sm transition-all hover:border-black rounded-none">
      <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
        <CardTitle className="text-sm font-bold uppercase tracking-widest text-zinc-400">
          Relatórios Ativos
        </CardTitle>
        <Database className="w-4 h-4 text-black" />
      </CardHeader>
      <CardContent>
        <div className="text-4xl font-black text-zinc-900 tracking-tighter">
            {total}
        </div>
        <p className="text-[10px] text-zinc-400 mt-1 font-medium">
            Disponíveis para consulta
        </p>
      </CardContent>
    </Card>
  );
}
