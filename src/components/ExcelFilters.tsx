'use client';

import React from 'react';
import { cn } from '@/lib/utils';
import { MapPin, Activity, RotateCcw, Filter } from 'lucide-react';

interface Filters {
  status: string;
  base: string;
}

interface ExcelFiltersProps {
  filters: Filters;
  setFilters: (filters: Filters) => void;
  availableStatuses: string[];
  availableBases: string[];
  onReset: () => void;
  source: 'EMIS' | 'ETER';
  totalCount: number;
}

export function ExcelFilters({
  filters,
  setFilters,
  availableStatuses,
  availableBases,
  onReset,
  source,
  totalCount
}: ExcelFiltersProps) {
  const isEmis = source === 'EMIS';

  const updateFilter = (key: keyof Filters, value: string) => {
    setFilters({ ...filters, [key]: value });
  };

  return (
    <div className="w-full space-y-4">
      <div className="flex items-center justify-between px-2">
        <div className="flex items-center gap-3">
          <div className={cn(
            "p-2 rounded-xl shadow-inner",
            isEmis ? "bg-indigo-100 text-indigo-700" : "bg-emerald-100 text-emerald-700"
          )}>
            <Filter size={18} />
          </div>
          <div>
            <h3 className="text-sm font-black text-zinc-900 uppercase tracking-tighter">Painel de Auditoria</h3>
            <p className="text-[10px] text-zinc-500 font-bold uppercase tracking-widest leading-none">Filtros por Status e Base</p>
          </div>
        </div>
        
        <button
          onClick={onReset}
          className="flex items-center gap-2 px-4 py-2 text-[10px] font-black uppercase tracking-widest text-zinc-400 hover:text-zinc-600 hover:bg-zinc-100 rounded-full transition-all border border-transparent hover:border-zinc-200"
        >
          <RotateCcw size={14} />
          Limpar Filtros
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Base Filter */}
        <div className="relative group">
          <div className="absolute -top-2 left-4 px-2 bg-white text-[9px] font-black text-zinc-600 uppercase tracking-[0.2em] z-10">
            Localidade / Base
          </div>
          <div className="bg-white border-2 border-zinc-100 rounded-2xl p-4 flex items-center gap-4 transition-all group-hover:border-zinc-200 focus-within:border-zinc-900 focus-within:ring-4 focus-within:ring-zinc-900/5 shadow-sm">
            <div className={cn(
              "p-2.5 rounded-xl",
              isEmis ? "bg-indigo-50 text-indigo-600" : "bg-emerald-50 text-emerald-600"
            )}>
              <MapPin size={20} />
            </div>
            <div className="flex-1">
              <select
                value={filters.base}
                onChange={(e) => updateFilter('base', e.target.value)}
                className="w-full bg-transparent border-none p-0 text-base font-black text-zinc-900 focus:ring-0 cursor-pointer appearance-none uppercase"
              >
                <option value="">TODAS AS BASES</option>
                {availableBases.map(base => (
                  <option key={base} value={base}>{base}</option>
                ))}
              </select>
              <p className="text-[9px] font-bold text-zinc-600 uppercase mt-0.5">Filtrar por Região</p>
            </div>
          </div>
        </div>

        {/* Status Filter */}
        <div className="relative group">
          <div className="absolute -top-2 left-4 px-2 bg-white text-[9px] font-black text-zinc-600 uppercase tracking-[0.2em] z-10">
            Situação / Status
          </div>
          <div className="bg-white border-2 border-zinc-100 rounded-2xl p-4 flex items-center gap-4 transition-all group-hover:border-zinc-200 focus-within:border-zinc-900 focus-within:ring-4 focus-within:ring-zinc-900/5 shadow-sm">
            <div className={cn(
              "p-2.5 rounded-xl",
              isEmis ? "bg-indigo-50 text-indigo-600" : "bg-emerald-50 text-emerald-600"
            )}>
              <Activity size={20} />
            </div>
            <div className="flex-1">
              <select
                value={filters.status}
                onChange={(e) => updateFilter('status', e.target.value)}
                className="w-full bg-transparent border-none p-0 text-base font-black text-zinc-900 focus:ring-0 cursor-pointer appearance-none uppercase"
              >
                <option value="">TODOS OS STATUS</option>
                {availableStatuses.map(status => (
                  <option key={status} value={status}>{status}</option>
                ))}
              </select>
              <p className="text-[9px] font-bold text-zinc-600 uppercase mt-0.5">Estado do Registro</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
