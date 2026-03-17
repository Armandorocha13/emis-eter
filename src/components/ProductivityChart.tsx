'use client';

import React, { useMemo } from 'react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  ResponsiveContainer, 
  Tooltip, 
  Cell
} from 'recharts';
import { BaseProductivity, ProcessedEntry } from '@/lib/engine';
import { cn } from '@/lib/utils';
import { TrendingUp, Award } from 'lucide-react';

interface ProductivityChartProps {
  data: BaseProductivity[];
  source: string;
  loading?: boolean;
  activeFilter?: string;
}

export function ProductivityChart({ data, source, loading, activeFilter }: ProductivityChartProps) {
  const chartData = useMemo(() => {
    const allTecnicos: ProcessedEntry[] = data.flatMap(b => b.tecnicos);
    
    const consolidatedMap: Record<string, number> = {};
    allTecnicos.forEach(t => {
      consolidatedMap[t.nome] = (consolidatedMap[t.nome] || 0) + t.valor;
    });

    return Object.entries(consolidatedMap)
      .map(([nome, valor]) => ({ 
        name: nome, 
        value: valor
      }))
      .sort((a, b) => b.value - a.value)
      .slice(0, 5);
  }, [data]);

  const metricLabel = source === 'EMIS' ? 'Dias em Aberto' : 'Seriais bipados';

  if (loading) {
    return (
      <div className="w-full h-[250px] bg-zinc-900/40 rounded-[2.5rem] border border-zinc-800 animate-pulse flex items-center justify-center">
        <div className="w-12 h-12 rounded-full border-2 border-zinc-800 border-t-zinc-600 animate-spin" />
      </div>
    );
  }

  return (
    <div className="bg-white border border-zinc-200 rounded-[2.5rem] p-5 shadow-sm flex flex-col transition-all">
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-3">
          <div className="p-1.5 rounded-lg bg-red-50 text-red-600">
            <TrendingUp size={16} />
          </div>
          <h2 className="text-sm font-black text-zinc-900 uppercase tracking-tighter">
            Top 5 Ofensores: {source === 'EMIS' ? 'Dias' : 'Seriais'} {activeFilter && <span className="text-red-600/50 ml-2">({activeFilter})</span>}
          </h2>
        </div>
      </div>

      <div className="w-full h-[250px] md:h-[350px]">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={chartData}
            layout="vertical"
            margin={{ top: 0, right: 30, left: 40, bottom: 0 }}
            barSize={20}
          >
            <CartesianGrid strokeDasharray="3 3" stroke="#f4f4f5" horizontal={false} />
            <XAxis type="number" hide />
            <YAxis 
              dataKey="name" 
              type="category" 
              width={100}
              tick={{ fill: '#71717a', fontSize: 9, fontWeight: 800 }}
              axisLine={false}
              tickLine={false}
              tickFormatter={(value: string) => value.split(' ')[0]} 
            />
            <Tooltip 
              cursor={{ fill: 'rgba(0,0,0,0.02)' }}
              contentStyle={{ 
                backgroundColor: '#ffffff', 
                border: '1px solid #e4e4e7', 
                borderRadius: '12px',
                fontSize: '10px',
                color: '#18181b',
                boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'
              }}
              formatter={(value: any) => [value, metricLabel]}
              itemStyle={{ color: '#ef4444', fontWeight: 'bold' }}
            />
            <Bar 
              dataKey="value" 
              radius={[0, 4, 4, 0]} 
              animationDuration={1500}
            >
              {chartData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill="#991b1b" /> 
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div className="mt-2 flex flex-col gap-1.5">
        {chartData.map((item, idx) => (
          <div key={item.name} className="flex items-center justify-between bg-zinc-50 p-2 rounded-xl border border-zinc-100">
            <div className="flex items-center gap-3">
              <span className="text-[10px] font-black text-red-600/30 w-4">{idx + 1}º</span>
              <span className="text-[10px] font-bold text-zinc-600 uppercase truncate max-w-[150px]">{item.name}</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-black text-zinc-900">{item.value}</span>
              <span className="text-[9px] font-bold text-zinc-400 uppercase tracking-widest">{source === 'EMIS' ? 'Dias' : 'Ser'}</span>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-4 pt-3 border-t border-zinc-100 flex items-center justify-between">
        <p className="text-[9px] text-zinc-400 font-bold uppercase tracking-[0.2em]">
          Ranking de <span className="text-red-600">Ofensores Críticos</span>
        </p>
        <Award size={12} className="text-red-600" />
      </div>
    </div>
  );
}
