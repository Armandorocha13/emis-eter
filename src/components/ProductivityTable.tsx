'use client';

import React, { useState } from 'react';
import { cn } from '@/lib/utils';
import { BaseProductivity } from '@/lib/engine';
import { MapPin, User, BarChart3, ChevronDown, ChevronRight } from 'lucide-react';

interface ProductivityTableProps {
  data: BaseProductivity[];
  source: 'EMIS' | 'ETER';
  loading?: boolean;
}

export function ProductivityTable({ data, source, loading }: ProductivityTableProps) {
  const [expandedBases, setExpandedBases] = useState<Record<string, boolean>>({});
  const metricLabel = source === 'EMIS' ? 'Dias' : 'Seriais';

  const toggleBase = (base: string) => {
    setExpandedBases(prev => ({ ...prev, [base]: !prev[base] }));
  };

  if (loading) {
    return (
      <div className="w-full space-y-4 animate-pulse">
        <div className="h-12 bg-zinc-800/50 rounded-2xl w-full" />
        <div className="h-40 bg-zinc-900/40 rounded-3xl w-full" />
      </div>
    );
  }

  return (
    <div className="w-full space-y-6">
      <div className="flex items-center gap-3 px-2">
        <div className={cn(
          "p-2 rounded-lg",
          source === 'EMIS' ? "bg-indigo-500/10 text-indigo-400" : "bg-emerald-600/10 text-emerald-500"
        )}>
          <BarChart3 size={20} />
        </div>
        <h2 className="text-xl font-black text-white uppercase tracking-tighter">
          Consolidado de {source === 'EMIS' ? 'Dias' : 'Seriais'} por Base
        </h2>
      </div>

      <div className="overflow-hidden bg-white border border-zinc-200 rounded-3xl md:rounded-[2.5rem] shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[600px] md:min-w-0">
            <thead>
              <tr className="border-b border-zinc-100 bg-zinc-50/50">
                <th className="px-4 md:px-8 py-4 md:py-5 text-[10px] font-bold text-zinc-400 uppercase tracking-[0.2em]">Unidade / Técnico</th>
                <th className="px-4 md:px-8 py-4 md:py-5 text-[10px] font-bold text-zinc-400 uppercase tracking-[0.2em] text-right">Produtividade ({metricLabel})</th>
              </tr>
            </thead>
            <tbody>
            {data.length === 0 ? (
              <tr>
                <td colSpan={2} className="px-8 py-12 text-center text-zinc-400 font-medium">
                  Nenhum dado consolidado disponível.
                </td>
              </tr>
            ) : (
              data.map((baseGroup) => {
                const isExpanded = expandedBases[baseGroup.base];
                return (
                  <React.Fragment key={baseGroup.base}>
                    {/* Base Header Row */}
                    <tr 
                      onClick={() => toggleBase(baseGroup.base)}
                      className={cn(
                        "border-t border-zinc-100 cursor-pointer transition-colors group/base",
                        source === 'EMIS' ? "bg-indigo-50/30 hover:bg-indigo-50/60" : "bg-emerald-50/30 hover:bg-emerald-50/60"
                      )}
                    >
                      <td className="px-8 py-4">
                        <div className="flex items-center gap-3">
                          <div className="transition-transform duration-300">
                            {isExpanded ? <ChevronDown size={14} className="text-zinc-400" /> : <ChevronRight size={14} className="text-zinc-400" />}
                          </div>
                          <MapPin size={16} className={source === 'EMIS' ? "text-indigo-600" : "text-emerald-600"} />
                          <span className="text-sm font-bold text-zinc-900 uppercase tracking-wider">
                            {baseGroup.base}
                          </span>
                        </div>
                      </td>
                      <td className="px-8 py-4 text-right">
                        <span className={cn(
                          "text-sm font-black px-3 py-1 rounded-full",
                          source === 'EMIS' ? "bg-indigo-50 text-indigo-700" : "bg-emerald-50 text-emerald-700"
                        )}>
                          {baseGroup.totalBase} {metricLabel}
                        </span>
                      </td>
                    </tr>

                    {/* Technician Rows (Accordion Content) */}
                    {isExpanded && baseGroup.tecnicos.map((t, idx) => (
                      <tr 
                        key={`${baseGroup.base}-${t.nome}`} 
                        className={cn(
                          "group hover:bg-zinc-50 transition-all animate-in fade-in slide-in-from-top-1 duration-300",
                          idx % 2 === 0 ? "bg-white" : "bg-zinc-50/30"
                        )}
                      >
                        <td className="px-16 py-3">
                          <div className="flex items-center gap-3">
                            <User size={14} className="text-zinc-300 group-hover:text-zinc-500 transition-colors" />
                            <span className="text-sm font-bold text-zinc-600 group-hover:text-zinc-900 transition-colors uppercase truncate">
                              {t.nome}
                            </span>
                          </div>
                        </td>
                        <td className="px-8 py-3 text-right">
                          <span className="text-xs font-mono font-bold text-zinc-400 group-hover:text-zinc-600 transition-colors">
                            {t.valor}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </React.Fragment>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  </div>
  );
}
