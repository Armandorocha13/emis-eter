'use client';

import React from 'react';
import { cn } from '@/lib/utils';
import { Calendar, MapPin, Activity, X } from 'lucide-react';

interface Filters {
  date: string;
  status: string;
  base: string;
}

interface TopFiltersProps {
  filters: Filters;
  setFilters: React.Dispatch<React.SetStateAction<Filters>>;
  availableStatuses: string[];
  availableBases: string[];
  onReset: () => void;
  source: 'EMIS' | 'ETER';
}

export function TopFilters({
  filters,
  setFilters,
  availableStatuses,
  availableBases,
  onReset,
  source
}: TopFiltersProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 w-full">
      {/* KPI Style: Base Filter */}
      <div className="bg-white border border-zinc-200 rounded-3xl p-4 flex flex-col items-center justify-between group hover:border-zinc-300 transition-all shadow-sm">
        <div className="flex items-center gap-2 text-zinc-400 mb-2">
          <MapPin size={14} className={source === 'EMIS' ? "text-indigo-600" : "text-emerald-600"} />
          <span className="text-[10px] font-medium uppercase tracking-widest text-center text-zinc-400">Base Operacional</span>
        </div>
        <select
          value={filters.base}
          onChange={(e) => setFilters(prev => ({ ...prev, base: e.target.value }))}
          className="w-full bg-transparent border-none p-0 text-sm font-bold text-zinc-900 focus:ring-0 cursor-pointer appearance-none text-center"
        >
          <option value="" className="bg-white text-center">Todas as Bases</option>
          {availableBases.map(base => (
            <option key={base} value={base} className="bg-white text-center">{base}</option>
          ))}
        </select>
      </div>

      {/* KPI Style: Status Filter */}
      <div className="sm:col-span-2 bg-white border border-zinc-200 rounded-3xl p-4 flex flex-col items-center justify-between group hover:border-zinc-300 transition-all shadow-sm relative">
        <div className="flex items-center justify-center gap-2 text-zinc-400 mb-2 w-full">
          <Activity size={14} className={source === 'EMIS' ? "text-indigo-600" : "text-emerald-600"} />
          <span className="text-[10px] font-medium uppercase tracking-widest text-center text-zinc-400">Status Atual</span>
          {filters.status && (
            <button 
              onClick={() => setFilters(prev => ({ ...prev, status: '' }))} 
              className="absolute right-4 top-4 text-zinc-300 hover:text-zinc-600 transition-colors"
            >
              <X size={12} />
            </button>
          )}
        </div>
        <div className="flex flex-wrap justify-center gap-1.5 md:gap-2">
          {availableStatuses.slice(0, 4).map(status => (
            <button
              key={status}
              onClick={() => setFilters(prev => ({ ...prev, status: filters.status === status ? '' : status }))}
              className={cn(
                "px-2 md:px-3 py-1 rounded-lg text-[9px] md:text-[10px] font-bold transition-all border",
                filters.status === status
                  ? "bg-zinc-900 border-zinc-900 text-white"
                  : "bg-zinc-50 border-zinc-100 text-zinc-400 hover:border-zinc-300 hover:text-zinc-600"
              )}
            >
              {status}
            </button>
          ))}
          {availableStatuses.includes('PENDENTE') && filters.status !== 'PENDENTE' && (
             <button
               onClick={() => setFilters(prev => ({ ...prev, status: 'PENDENTE' }))}
               className="flex items-center gap-1 px-2 md:px-3 py-1 rounded-lg text-[9px] md:text-[10px] font-bold bg-amber-50 border border-amber-200 text-amber-600 animate-pulse"
             >
               PENDENTES
             </button>
          )}
        </div>
      </div>

      {/* KPI Style: Date Filter */}
      <div className="bg-white border border-zinc-200 rounded-3xl p-4 flex flex-col items-center justify-between group hover:border-zinc-300 transition-all shadow-sm">
        <div className="flex items-center gap-2 text-zinc-400 mb-2">
          <Calendar size={14} className={source === 'EMIS' ? "text-indigo-600" : "text-emerald-600"} />
          <span className="text-[10px] font-medium uppercase tracking-widest text-center text-zinc-400">Data Inicial</span>
        </div>
        <input
          type="date"
          value={filters.date}
          onChange={(e) => setFilters(prev => ({ ...prev, date: e.target.value }))}
          className="w-full bg-transparent border-none p-0 text-sm font-bold text-zinc-900 focus:ring-0 cursor-pointer text-center"
        />
      </div>
    </div>
  );
}
