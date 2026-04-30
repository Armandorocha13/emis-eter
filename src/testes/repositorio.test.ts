import { describe, it, expect } from 'vitest';
import { repositorioRelatorios } from '../servicos/repositorioRelatorios';

describe('Repositorio de Relatórios', () => {
  it('deve retornar a lista de relatórios corretamente', () => {
    const relatorios = repositorioRelatorios.obterTodosRelatorios();
    expect(relatorios.length).toBeGreaterThan(0);
    expect(relatorios[0]).toHaveProperty('titulo');
  });

  it('deve retornar a contagem correta de relatórios', () => {
    const total = repositorioRelatorios.obterContagemTotal();
    const relatorios = repositorioRelatorios.obterTodosRelatorios();
    expect(total).toBe(relatorios.length);
  });

  // Teste de falha/borda: Verificar se o sistema lida com IDs inexistentes (caso tivéssemos busca por ID)
  it('deve garantir que os IDs sejam únicos para evitar erros de renderização', () => {
    const relatorios = repositorioRelatorios.obterTodosRelatorios();
    const ids = relatorios.map(r => r.id);
    const uniqueIds = new Set(ids);
    expect(uniqueIds.size).toBe(ids.length);
  });
});
