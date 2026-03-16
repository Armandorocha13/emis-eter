'use client';

import React from 'react';
import { cn } from '@/lib/utils';
import { Filter, Calendar, MapPin, Activity, X } from 'lucide-react';

interface Filters {
  date: string;
  status: string;
  base: string;
}

interface SidebarFiltersProps {
  filters: Filters;
  setFilters: React.Dispatch<React.SetStateAction<Filters>>;
  availableStatuses: string[];
  availableBases: string[];
  onReset: () => void;
  source: 'EMIS' | 'ETER';
}

export function SidebarFilters({
  filters,
  setFilters,
  availableStatuses,
  availableBases,
  onReset,
  source
}: SidebarFiltersProps) {
  return (
    <aside className="w-80 flex-shrink-0 flex flex-col gap-6">
      <div className="bg-zinc-900/50 backdrop-blur-xl border border-zinc-800 rounded-[2.5rem] p-6 shadow-2xl">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className={cn(
              "p-2 rounded-lg",
              source === 'EMIS' ? "bg-indigo-500/10 text-indigo-400" : "bg-emerald-600/10 text-emerald-500"
            )}>
              <Filter size={20} />
            </div>
            <h2 className="text-lg font-black text-white uppercase tracking-tighter">Filtros</h2>
          </div>
          <button 
            onClick={onReset}
            className="p-2 hover:bg-white/5 rounded-lg text-zinc-500 hover:text-white transition-colors"
            title="Limpar filtros"
          >
            <X size={18} />
          </button>
        </div>

        <div className="space-y-6">
          {/* Base Filter */}
          <div className="space-y-3">
            <div className="flex items-center gap-2 text-zinc-400 mb-1">
              <MapPin size={14} className={source === 'EMIS' ? "text-indigo-500" : "text-emerald-500"} />
              <label className="text-xs font-bold uppercase tracking-widest text-zinc-400">Base Operacional</label>
            </div>
            <select
              value={filters.base}
              onChange={(e) => setFilters(prev => ({ ...prev, base: e.target.value }))}
              className="w-full bg-black/40 border border-zinc-800 rounded-2xl px-4 py-3 text-sm text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500/50 transition-all appearance-none cursor-pointer"
            >
              <option value="">Todas as Bases</option>
              {availableBases.map(base => (
                <option key={base} value={base}>{base}</option>
              ))}
            </select>
          </div>

          {/* Status Filter */}
          <div className="space-y-4">
            <div className="flex items-center gap-2 text-zinc-400 mb-1">
              <Activity size={14} className={source === 'EMIS' ? "text-indigo-500" : "text-emerald-500"} />
              <label className="text-xs font-bold uppercase tracking-widest text-zinc-400">Status Atual</label>
            </div>

            {/* Slicer for PENDENTE (Highlighted) */}
            {availableStatuses.includes('PENDENTE') && (
              <button
                onClick={() => setFilters(prev => ({ ...prev, status: filters.status === 'PENDENTE' ? '' : 'PENDENTE' }))}
                className={cn(
                  "w-full p-4 rounded-2xl border transition-all duration-500 flex items-center justify-between group/slicer",
                  filters.status === 'PENDENTE'
                    ? "bg-amber-500/20 border-amber-500/50 shadow-lg shadow-amber-500/10"
                    : "bg-black/40 border-zinc-800 hover:border-amber-500/30"
                )}
              >
                <div className="flex items-center gap-3">
                  <div className={cn(
                    "w-2 h-2 rounded-full animate-pulse",
                    filters.status === 'PENDENTE' ? "bg-amber-500" : "bg-zinc-600 group-hover/slicer:bg-amber-500/50"
                  )} />
                  <span className={cn(
                    "text-[10px] font-bold uppercase tracking-widest text-zinc-400",
                    filters.status === 'PENDENTE' ? "text-amber-400" : "text-zinc-500 group-hover/slicer:text-zinc-300"
                  )}>
                    Isolar Pendentes
                  </span>
                </div>
                {filters.status === 'PENDENTE' && <X size={12} className="text-amber-500" />}
              </button>
            )}

            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => setFilters(prev => ({ ...prev, status: '' }))}
                className={cn(
                  "px-4 py-2 rounded-xl text-xs font-bold transition-all",
                  filters.status === '' 
                    ? (source === 'EMIS' ? "bg-indigo-900 text-indigo-100" : "bg-emerald-900 text-emerald-100")
                    : "bg-zinc-800/50 text-zinc-500 hover:text-zinc-300"
                )}
              >
                TUDO
              </button>
              {availableStatuses.map(status => (
                <button
                  key={status}
                  onClick={() => setFilters(prev => ({ ...prev, status }))}
                  className={cn(
                    "px-4 py-2 rounded-xl text-xs font-bold transition-all border",
                    filters.status === status
                      ? (source === 'EMIS' ? "bg-indigo-600/20 border-indigo-500/50 text-indigo-400" : "bg-emerald-600/20 border-emerald-500/50 text-emerald-400")
                      : "bg-transparent border-zinc-800 text-zinc-500 hover:border-zinc-700 hover:text-zinc-300"
                  )}
                >
                  {status.toUpperCase()}
                </button>
              ))}
            </div>
          </div>

          {/* Date Filter */}
          <div className="space-y-3">
            <div className="flex items-center gap-2 text-zinc-400 mb-1">
              <Calendar size={14} className={source === 'EMIS' ? "text-indigo-500" : "text-emerald-500"} />
              <label className="text-xs font-bold uppercase tracking-widest text-zinc-400">Base de Dados (A partir de)</label>
            </div>
            <input
              type="date"
              value={filters.date}
              onChange={(e) => setFilters(prev => ({ ...prev, date: e.target.value }))}
              className={cn(
                "w-full bg-black/40 border border-zinc-800 rounded-2xl px-4 py-3 text-sm text-white focus:outline-none focus:ring-2 transition-all [color-scheme:dark]",
                source === 'EMIS' ? "focus:ring-indigo-500/20" : "focus:ring-emerald-500/20"
              )}
            />
            <p className="text-[9px] text-zinc-600 font-bold uppercase tracking-tighter">
              * Exibe registros da data selecionada em diante
            </p>
          </div>
        </div>

        <div className="mt-8 p-3 rounded-xl bg-zinc-800/20 border border-zinc-800/50">
          <p className="text-[9px] text-zinc-600 font-bold uppercase tracking-widest leading-relaxed">
            Filtros reativos via <span className={source === 'EMIS' ? "text-indigo-500" : "text-emerald-500"}>{source} Metadata</span>
          </p>
        </div>
      </div>
    </aside>
  );
}
