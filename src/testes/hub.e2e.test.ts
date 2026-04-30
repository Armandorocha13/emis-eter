import { test, expect } from '@playwright/test';

test.describe('Hub de Relatórios FFA - Testes E2E', () => {
  test.beforeEach(async ({ page }) => {
    // Ajuste a URL conforme o seu ambiente de desenvolvimento
    await page.goto('http://localhost:3000/hub');
  });

  test('deve carregar a página inicial e exibir os KPIs', async ({ page }) => {
    await expect(page.locator('h1')).toContainText('HUB de Relatórios');
    await expect(page.getByText('Relatórios Ativos')).toBeVisible();
  });

  test('deve filtrar relatórios pela barra de busca', async ({ page }) => {
    const buscaInput = page.getByPlaceholder('Buscar relatório...');
    await buscaInput.fill('Giro');
    
    // Verifica se apenas o relatório de Giro aparece
    await expect(page.getByText('GIRO DE MAQUINARIOS')).toBeVisible();
    await expect(page.getByText('PROJEÇÃO DE REPOSIÇÃO')).not.toBeVisible();
  });

  test('deve abrir o modal de histórico ao clicar no ícone de relógio', async ({ page }) => {
    // Primeiro acessamos um relatório para gerar histórico
    await page.click('text=Acessar Relatório');
    await page.goBack();
    
    // Clicamos no botão de histórico
    await page.locator('button[title="Histórico de Acesso"]').click();
    
    // Verificamos se o modal abriu
    await expect(page.getByText('Acessados Recentemente')).toBeVisible();
  });

  test('deve exibir mensagem amigável quando nenhum relatório é encontrado', async ({ page }) => {
    const buscaInput = page.getByPlaceholder('Buscar relatório...');
    await buscaInput.fill('RelatorioQueNaoExiste');
    
    await expect(page.getByText('Nenhum relatório encontrado')).toBeVisible();
  });
});
