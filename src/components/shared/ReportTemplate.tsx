'use client';

import { useState, useEffect, useMemo, Suspense } from 'react';
import { useSearchParams, useRouter, usePathname } from 'next/navigation';
import { TopFilters } from '@/components/TopFilters';
import { GroupedTable } from '@/components/GroupedTable';
import { ProductivityChart } from '@/components/ProductivityChart';
import { ProductivityTable } from '@/components/ProductivityTable';
import { cn } from '@/lib/utils';
import { Loader2, AlertCircle, Database, ArrowLeft } from 'lucide-react';
import { StandardizedData } from '@/lib/excel';
import { processDashboardData } from '@/lib/engine';
import Link from 'next/link';

interface ReportTemplateProps {
  source: string;
}

function ReportContent({ source }: ReportTemplateProps) {
  const [data, setData] = useState<StandardizedData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Filter States
  const [filters, setFilters] = useState({
    date: '',
    status: '',
    base: ''
  });

  // Calculate dynamic options
  const availableBases = useMemo(() => {
    return Array.from(new Set(data.map(item => item.base).filter(Boolean))).sort();
  }, [data]);

  const availableStatuses = useMemo(() => {
    return Array.from(new Set(data.map(item => item.status).filter(Boolean))).sort();
  }, [data]);

  // Apply Filters
  const filteredData = useMemo(() => {
    return data.filter(item => {
      const matchStatus = !filters.status || item.status === filters.status;
      const matchBase = !filters.base || item.base === filters.base;
      let matchDate = true;
      if (filters.date) {
        const filterDate = new Date(filters.date);
        filterDate.setHours(0, 0, 0, 0);
        const itemDate = new Date(item.data);
        itemDate.setHours(0, 0, 0, 0);
        matchDate = !isNaN(itemDate.getTime()) && itemDate >= filterDate;
      }
      return matchStatus && matchBase && matchDate;
    });
  }, [data, filters]);

  const baseProductivity = useMemo(() => {
    // @ts-ignore
    return processDashboardData(source, filteredData);
  }, [filteredData, source]);

  const fetchData = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`/api/data?source=${source}`);
      const result = await response.json();
      if (result.success) {
        setData(result.data);
      } else {
        throw new Error(result.error || 'Erro ao carregar dados');
      }
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [source]);

  const colorClass = source.toUpperCase() === 'EMIS' ? 'indigo' : 'emerald';

  return (
    <main className={cn(
      "min-h-screen p-4 md:p-8 transition-colors duration-1000 bg-zinc-50 overflow-x-hidden",
      source.toUpperCase() === 'EMIS' ? "selection:bg-indigo-100" : "selection:bg-emerald-100"
    )}>
      <div className="relative z-10 max-w-7xl mx-auto space-y-6 md:space-y-8">

        {/* Navigation & Header */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <Link
            href="/hub"
            className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-zinc-400 hover:text-zinc-600 transition-colors bg-white px-4 py-2 rounded-full border border-zinc-200 shadow-sm self-start md:self-auto"
          >
            <ArrowLeft size={14} /> Voltar
          </Link>
          <div className="flex items-center gap-3">
            <div className={cn(
              "w-3 h-3 rounded-full animate-pulse",
              source.toUpperCase() === 'EMIS' ? "bg-indigo-500" : "bg-emerald-500"
            )} />
            <h1 className="text-2xl font-black text-zinc-900 tracking-tighter uppercase">{source} <span className="text-zinc-400">Dashboard</span></h1>
          </div>
        </div>

        {/* Global Filters */}
        <TopFilters
          filters={filters}
          setFilters={setFilters}
          availableStatuses={availableStatuses}
          availableBases={availableBases}
          onReset={() => setFilters({ date: '', status: '', base: '' })}
          // @ts-ignore
          source={source.toUpperCase()}
        />

        {error && (
          <div className="bg-red-50 border border-red-200 rounded-3xl p-6 flex items-center gap-4 text-red-600">
            <AlertCircle size={24} />
            <p className="font-bold tracking-tight">{error}</p>
          </div>
        )}

        {/* Volumetria */}
        <div className={cn(
          "p-4 md:p-4 rounded-3xl border bg-white flex flex-col md:flex-row items-center justify-between shadow-sm px-6 md:px-10 border-zinc-200 transition-all duration-700 gap-4 md:gap-0",
          source.toUpperCase() === 'EMIS' ? "hover:border-indigo-200" : "hover:border-emerald-200"
        )}>
          <div className="flex items-center gap-4 w-full md:w-auto justify-center md:justify-start">
            <div className={cn(
              "p-2 rounded-xl",
              source.toUpperCase() === 'EMIS' ? "bg-indigo-50 text-indigo-600" : "bg-emerald-50 text-emerald-600"
            )}>
              <Database size={18} className={loading ? "animate-spin" : ""} />
            </div>
            <span className="text-[10px] font-bold uppercase tracking-[0.3em] text-zinc-400">Volume Total</span>
          </div>

          <div className="flex-1 flex flex-col md:flex-row justify-center items-center md:items-baseline gap-1 md:gap-2">
            <span className="text-3xl md:text-4xl font-black text-black tracking-tighter">
              {loading ? "..." : filteredData.length.toLocaleString()}
            </span>
            <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest text-center md:text-left">
              Registros no Período
            </span>
          </div>

          <div className="flex items-center gap-3 text-[9px] font-bold uppercase tracking-widest opacity-60 w-full md:w-auto justify-center md:justify-end">
            <span className="text-zinc-600 font-bold">{source}</span>
            <div className={cn("w-1 h-1 rounded-full", source.toUpperCase() === 'EMIS' ? "bg-indigo-500" : "bg-emerald-500")} />
            <span className="text-zinc-400">Live Data</span>
          </div>
        </div>

        {/* Main Sections */}
        <div className="space-y-8">
          <ProductivityChart
            data={baseProductivity}
            // @ts-ignore
            source={source.toUpperCase()}
            loading={loading}
            activeFilter={filters.status || filters.base}
          />
          <ProductivityTable
            data={baseProductivity}
            // @ts-ignore
            source={source.toUpperCase()}
            loading={loading}
          />
        </div>

        <div className="pb-20">
          <GroupedTable
            data={filteredData}
            // @ts-ignore
            source={source.toUpperCase()}
            loading={loading}
          />
        </div>
      </div>
    </main>
  );
}

export default function ReportTemplate({ source }: ReportTemplateProps) {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-zinc-50 flex items-center justify-center">
        <Loader2 className="animate-spin text-zinc-900" size={48} />
      </div>
    }>
      <ReportContent source={source} />
    </Suspense>
  );
}
