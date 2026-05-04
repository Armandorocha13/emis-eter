'use client';

import { useState } from "react";
import { X, Plus, Loader2 } from "lucide-react";
import { cadastrarRelatorio } from "@/acoes/relatorios";

interface ModalCadastroRelatorioProps {
  onSucesso: () => void;
}

export function ModalCadastroRelatorio({ onSucesso }: ModalCadastroRelatorioProps) {
  const [aberto, setAberto] = useState(false);
  const [enviando, setEnviando] = useState(false);
  const [erro, setErro] = useState("");
  const [titulo, setTitulo] = useState("");
  const [urlExterna, setUrlExterna] = useState("");
  const [descricao, setDescricao] = useState("");

  const formularioValido = titulo.trim() !== "" && urlExterna.trim() !== "" && descricao.trim() !== "";

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setEnviando(true);
    setErro("");

    const formData = new FormData(e.currentTarget);
    
    try {
      const resultado = await cadastrarRelatorio(formData);
      if (resultado.sucesso) {
        setAberto(false);
        onSucesso();
      } else {
        setErro(resultado.erro || "Erro desconhecido");
      }
    } catch (err) {
      setErro("Falha ao processar requisição");
    } finally {
      setEnviando(false);
    }
  };

  if (!aberto) {
    return (
      <button 
        onClick={() => setAberto(true)}
        className="h-10 px-5 bg-black text-white rounded-full font-bold text-xs uppercase tracking-widest flex items-center gap-2 hover:bg-zinc-800 transition-all shadow-md hover:shadow-lg hover:scale-[1.02] active:scale-95"
      >
        <Plus className="w-4 h-4" />
        Novo Relatório
      </button>
    );
  }

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-300">
      <div className="bg-white w-full max-w-xl rounded-3xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-300">
        <div className="p-8 border-b border-zinc-100 flex items-center justify-between">
          <div>
            <h3 className="text-xl font-black uppercase tracking-widest text-black">Cadastrar Dashboard</h3>
            <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest mt-1">Adicione uma nova fonte de dados ao Hub</p>
          </div>
          <button 
            onClick={() => setAberto(false)}
            className="p-3 hover:bg-zinc-50 rounded-full transition-colors"
          >
            <X className="w-6 h-6 text-zinc-400" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-8 space-y-6">
          <div className="space-y-4">
            <div className="space-y-1.5">
              <label className="text-[10px] font-black uppercase tracking-widest text-zinc-400 ml-1">Título do Relatório</label>
              <input 
                name="titulo" 
                required 
                value={titulo}
                onChange={(e) => setTitulo(e.target.value)}
                placeholder="Ex: Gestão de Estoque 2024"
                className="w-full px-5 py-4 bg-zinc-50 border border-zinc-100 rounded-2xl text-sm font-bold focus:outline-none focus:border-black focus:bg-white transition-all"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
               <div className="space-y-1.5">
                <label className="text-[10px] font-black uppercase tracking-widest text-zinc-400 ml-1">Categoria</label>
                <select 
                  name="categoria" 
                  required
                  className="w-full px-5 py-4 bg-zinc-50 border border-zinc-100 rounded-2xl text-sm font-bold focus:outline-none focus:border-black focus:bg-white transition-all appearance-none"
                >
                  <option value="Operacional">Operacional</option>
                  <option value="Estratégico">Estratégico</option>
                  <option value="Financeiro">Financeiro</option>
                  <option value="Comercial">Comercial</option>
                </select>
              </div>
              
              <div className="space-y-1.5">
                <label className="text-[10px] font-black uppercase tracking-widest text-zinc-400 ml-1">Operadora</label>
                <select 
                  name="operadora" 
                  required
                  className="w-full px-5 py-4 bg-zinc-50 border border-zinc-100 rounded-2xl text-sm font-bold focus:outline-none focus:border-black focus:bg-white transition-all appearance-none"
                >
                  <option value="FFA">Nenhuma (Padrão)</option>
                  <option value="IHS">IHS Towers</option>
                  <option value="Claro">Claro</option>
                  <option value="Vivo">Vivo</option>
                  <option value="TIM">TIM</option>
                  <option value="TIM IHS">TIM + IHS</option>
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] font-black uppercase tracking-widest text-zinc-400 ml-1">Link do Dashboard</label>
                <input 
                  name="urlExterna" 
                  type="url" 
                  required 
                  value={urlExterna}
                  onChange={(e) => setUrlExterna(e.target.value)}
                  placeholder="https://app.powerbi.com/..."
                  className="w-full px-5 py-4 bg-zinc-50 border border-zinc-100 rounded-2xl text-sm font-bold focus:outline-none focus:border-black focus:bg-white transition-all"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-[10px] font-black uppercase tracking-widest text-zinc-400 ml-1">Descrição Curta</label>
              <textarea 
               name="descricao" 
                rows={3}
                value={descricao}
                onChange={(e) => setDescricao(e.target.value)}
                placeholder="Descreva brevemente o objetivo deste relatório..."
                className="w-full px-5 py-4 bg-zinc-50 border border-zinc-100 rounded-2xl text-sm font-bold focus:outline-none focus:border-black focus:bg-white transition-all resize-none"
              />
            </div>
          </div>

          {erro && (
            <div className="p-4 bg-red-50 border border-red-100 rounded-2xl">
              <p className="text-[10px] font-black uppercase tracking-widest text-red-500">{erro}</p>
            </div>
          )}

          <div className="flex gap-4 pt-4">
             <button 
                type="button"
                onClick={() => setAberto(false)}
                className="flex-1 py-5 text-[10px] font-black uppercase tracking-widest text-zinc-400 border border-zinc-100 rounded-2xl hover:bg-zinc-50 transition-all"
             >
               Cancelar
             </button>
             <button 
                type="submit"
                disabled={enviando || !formularioValido}
                className="flex-[2] py-5 bg-black text-white text-[10px] font-black uppercase tracking-widest rounded-2xl hover:bg-zinc-800 disabled:opacity-30 disabled:cursor-not-allowed transition-all flex items-center justify-center gap-2"
             >
               {enviando ? <Loader2 className="w-4 h-4 animate-spin" /> : "Salvar Relatório"}
             </button>
          </div>
        </form>
      </div>
    </div>
  );
}
