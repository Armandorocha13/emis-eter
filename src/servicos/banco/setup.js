const { neon } = require('@neondatabase/serverless');

async function createTable() {
  const sql = neon("postgresql://neondb_owner:npg_p8RAtwMZuP6b@ep-nameless-cake-anvn8trp-pooler.c-6.us-east-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require");
  
  console.log("Criando tabela 'relatorios' no Neon...");
  
  try {
    await sql`
      CREATE TABLE IF NOT EXISTS relatorios (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        titulo TEXT NOT NULL,
        url_externa TEXT NOT NULL,
        descricao TEXT,
        categoria TEXT NOT NULL,
        criado_em TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL
      );
    `;
    console.log("Tabela criada com sucesso!");
    
    // Seed inicial
    console.log("Inserindo relatórios iniciais...");
    await sql`
      INSERT INTO relatorios (titulo, url_externa, descricao, categoria)
      VALUES 
        ('GIRO DE MAQUINARIOS', 'https://giromaquinarioestoqueffa.vercel.app/', 'Monitoramento em tempo real de estoque e giro de maquinários.', 'Operacional'),
        ('PROJEÇÃO DE REPOSIÇÃO DE MATERIAL', 'https://nextjsspace-iota-one.vercel.app/', 'Análise preditiva para reposição estratégica de materiais.', 'Estratégico')
      ON CONFLICT DO NOTHING;
    `;
    console.log("Seed concluído!");
    
  } catch (error) {
    console.error("Erro ao configurar banco:", error);
  }
}

createTable();
