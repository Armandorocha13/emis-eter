'use client';

import React, { useState, useMemo } from 'react';
import { cn } from '@/lib/utils';
import { StandardizedData } from '@/lib/excel';
import { User, Calendar, Hash, Box, ChevronDown, ChevronRight, LayoutList } from 'lucide-react';

interface GroupedTableProps {
  data: StandardizedData[];
  source: 'EMIS' | 'ETER';
  loading?: boolean;
}

export function GroupedTable({ data, source, loading }: GroupedTableProps) {
  const [expandedTechs, setExpandedTechs] = useState<Record<string, boolean>>({});

  // Grouping logic by TECHNICIAN (Responsável)
  const groupedData = useMemo(() => {
    return data.reduce((acc, current) => {
      const techKey = current.responsavel || 'NÃO IDENTIFICADO';
      if (!acc[techKey]) {
        acc[techKey] = {
          records: [],
          count: 0
        };
      }
      acc[techKey].records.push(current);
      acc[techKey].count += 1;
      return acc;
    }, {} as Record<string, { records: StandardizedData[], count: number }>);
  }, [data]);

  const sortedTechs = Object.keys(groupedData).sort();

  const toggleTech = (techKey: string) => {
    setExpandedTechs(prev => ({ ...prev, techKey: !prev[techKey] }));
    // Note: React state update with variable key needs brackets
    setExpandedTechs(prev => {
        const newState = { ...prev };
        newState[techKey] = !prev[techKey];
        return newState;
    });
  };

  if (loading) {
    return (
      <div className="w-full space-y-4 animate-pulse">
        {[1, 2, 3].map(i => (
          <div key={i} className="h-20 bg-zinc-800/50 rounded-3xl" />
        ))}
      </div>
    );
  }

  return (
    <div className="w-full space-y-6">
      <div className="flex items-center justify-between px-2">
        <div className="flex items-center gap-3">
          <div className={cn(
            "p-2 rounded-lg",
            source === 'EMIS' ? "bg-indigo-50 text-indigo-600" : "bg-emerald-50 text-emerald-600"
          )}>
            <LayoutList size={22} />
          </div>
          <h2 className="text-xl font-black text-black uppercase tracking-tighter">
            Itens Detalhados por Técnico
          </h2>
        </div>
        <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest bg-zinc-100 px-3 py-1 rounded-full border border-zinc-200 shadow-sm">
          {data.length} Registros Filtrados
        </span>
      </div>
      <div className="overflow-hidden bg-white border border-zinc-200 rounded-3xl md:rounded-[2.5rem] shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[800px] md:min-w-0">
            <thead>
              <tr className="border-b border-zinc-100 bg-zinc-50/50">
                <th className="px-4 md:px-8 py-4 md:py-5 text-[10px] font-bold text-zinc-400 uppercase tracking-[0.2em]">Técnico Responsável</th>
                <th className="px-4 md:px-8 py-4 md:py-5 text-[10px] font-bold text-zinc-400 uppercase tracking-[0.2em] text-right">Qtd. Itens</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-100">
            {sortedTechs.length === 0 ? (
              <tr>
                <td colSpan={2} className="px-8 py-20 text-center text-zinc-400 font-medium">
                  Nenhum registro encontrado.
                </td>
              </tr>
            ) : (
              sortedTechs.map((techKey) => {
                const group = groupedData[techKey];
                const isExpanded = !!expandedTechs[techKey];
                
                return (
                  <React.Fragment key={techKey}>
                    {/* Technician Header Row */}
                    <tr 
                      onClick={() => toggleTech(techKey)}
                      className="cursor-pointer hover:bg-zinc-50 transition-colors group/tech"
                    >
                      <td className="px-8 py-4">
                        <div className="flex items-center gap-4">
                          <div className="transition-transform duration-300">
                             {isExpanded ? <ChevronDown size={14} className="text-zinc-400" /> : <ChevronRight size={14} className="text-zinc-400" />}
                          </div>
                          <div className="p-2 bg-zinc-50 border border-zinc-100 rounded-lg group-hover/tech:bg-white group-hover/tech:border-zinc-200 transition-colors">
                            <User size={16} className="text-zinc-400 group-hover/tech:text-zinc-600" />
                          </div>
                          <span className="text-sm font-black text-zinc-900 uppercase tracking-tight">
                            {techKey}
                          </span>
                        </div>
                      </td>
                      <td className="px-8 py-4 text-right">
                        <span className={cn(
                          "text-xs font-black px-3 py-1 rounded-lg",
                          source === 'EMIS' ? "bg-indigo-50 text-indigo-700" : "bg-emerald-50 text-emerald-700"
                        )}>
                          {group.count} {group.count === 1 ? 'Item' : 'Itens'}
                        </span>
                      </td>
                    </tr>

                    {/* Records (Accordion Content) */}
                    {isExpanded && (
                      <tr>
                        <td colSpan={2} className="px-0 py-0 bg-zinc-50/30">
                          <div className="overflow-hidden animate-in slide-in-from-top-1 duration-500">
                            <table className="w-full border-t border-zinc-100">
                              <thead>
                                <tr className="bg-zinc-50/50">
                                  <th className="px-16 py-3 text-[9px] font-bold text-zinc-400 uppercase tracking-widest text-left">Item / Descrição</th>
                                  <th className="px-8 py-3 text-[9px] font-bold text-zinc-400 uppercase tracking-widest text-left">SAP / Cód</th>
                                  <th className="px-8 py-3 text-[9px] font-bold text-zinc-400 uppercase tracking-widest text-left">Data Ref</th>
                                  <th className="px-8 py-3 text-[9px] font-bold text-zinc-400 uppercase tracking-widest text-right">Status</th>
                                </tr>
                              </thead>
                              <tbody className="divide-y divide-zinc-100">
                                {group.records.map((rec, rIdx) => (
                                  <tr key={`${techKey}-${rec.id}-${rIdx}`} className="hover:bg-white transition-colors">
                                    <td className="px-16 py-3">
                                      <div className="flex items-center gap-2">
                                        <Box size={12} className="text-zinc-300" />
                                        <span className="text-xs font-bold text-zinc-500 uppercase truncate max-w-[300px]">{rec.item}</span>
                                      </div>
                                    </td>
                                    <td className="px-8 py-3">
                                      <div className="flex items-center gap-2">
                                         <Hash size={10} className="text-zinc-300" />
                                         <code className="text-[10px] font-mono text-zinc-400 bg-zinc-100/50 px-1.5 py-0.5 rounded">{rec.sap}</code>
                                      </div>
                                    </td>
                                    <td className="px-8 py-3">
                                      <div className="flex items-center gap-2 text-zinc-400">
                                        <Calendar size={10} />
                                        <span className="text-[10px] font-medium">{String(rec.data)}</span>
                                      </div>
                                    </td>
                                    <td className="px-8 py-3 text-right">
                                      <span className={cn(
                                        "inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[9px] font-black uppercase tracking-wider border",
                                        rec.status.toLowerCase().includes('concluido') || rec.status.toLowerCase().includes('aceito')
                                          ? "bg-emerald-50 text-emerald-700 border-emerald-100"
                                          : rec.status.toLowerCase().includes('pendente')
                                          ? "bg-amber-50 text-amber-700 border-amber-100"
                                          : "bg-zinc-50 text-zinc-600 border-zinc-200"
                                      )}>
                                        {rec.status}
                                      </span>
                                    </td>
                                  </tr>
                                ))}
                              </tbody>
                            </table>
                          </div>
                        </td>
                      </tr>
                    )}
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
