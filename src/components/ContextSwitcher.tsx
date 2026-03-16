'use client';

import React from 'react';
import { cn } from '@/lib/utils';
import { Database, Download } from 'lucide-react';

type DataSource = 'EMIS' | 'ETER';

interface ContextSwitcherProps {
  currentSource: DataSource;
  onSourceChange: (source: DataSource) => void;
}

export function ContextSwitcher({ currentSource, onSourceChange }: ContextSwitcherProps) {
  return (
    <div className="flex flex-col lg:flex-row items-center justify-between w-full p-4 md:p-6 mb-4 md:mb-8 bg-white border border-zinc-200 rounded-3xl shadow-sm gap-6">
      <div className="flex flex-col md:flex-row items-center gap-4 text-center md:text-left">
        <img src="/logo-ffa.png" alt="FFA Logo" className="h-10 md:h-14 w-auto object-contain" />
        <div className="hidden md:block w-[1px] h-10 bg-zinc-200 mx-2" />
        <div>
          <h1 className="text-lg md:text-xl font-black text-black tracking-tighter uppercase">Painel de controle: Emis x Eter</h1>
          <p className="text-[10px] md:text-xs text-zinc-400 font-bold uppercase">
            RELATÓRIO: <span className={cn(
              "tracking-widest",
              currentSource === 'EMIS' ? "text-indigo-600" : "text-emerald-600"
            )}>{currentSource}  </span>
          </p>
        </div>
      </div>

      <div className="flex items-center gap-3 w-full lg:w-auto justify-center">
        <div className="flex p-1 bg-zinc-100 rounded-2xl border border-zinc-200 w-full sm:w-auto">
          <button
            onClick={() => onSourceChange('EMIS')}
            className={cn(
              "flex-1 sm:flex-none flex items-center justify-center gap-2 px-4 md:px-8 py-2 md:py-2.5 rounded-xl text-[10px] md:text-xs font-bold transition-all duration-300",
              currentSource === 'EMIS'
                ? "bg-zinc-900 text-white shadow-lg shadow-zinc-200"
                : "text-zinc-500 hover:text-zinc-900 hover:bg-white"
            )}
          >
            <Database size={14} className="md:w-4 md:h-4" />
            EMIS
          </button>
          <button
            onClick={() => onSourceChange('ETER')}
            className={cn(
              "flex-1 sm:flex-none flex items-center justify-center gap-2 px-4 md:px-8 py-2 md:py-2.5 rounded-xl text-[10px] md:text-xs font-bold transition-all duration-300",
              currentSource === 'ETER'
                ? "bg-zinc-900 text-white shadow-lg shadow-zinc-200"
                : "text-zinc-500 hover:text-zinc-900 hover:bg-white"
            )}
          >
            <Database size={14} className="md:w-4 md:h-4" />
            ETER
          </button>
        </div>
      </div>
    </div>
  );
}
