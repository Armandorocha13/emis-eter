import fs from 'fs/promises';
import path from 'path';
import { NextResponse } from 'next/server';

export async function GET() {
  const logos = [
    { 
      nome: 'tim.png', 
      fonte: path.join('C:', 'Users', 'user', '.gemini', 'antigravity', 'brain', 'db1b595f-143c-43be-adff-569c2556400a', 'tim_logo_1777861309582.png')
    },
    { 
      nome: 'ihs.png', 
      fonte: path.join('C:', 'Users', 'user', '.gemini', 'antigravity', 'brain', 'db1b595f-143c-43be-adff-569c2556400a', 'ihs_logo_1777861321579.png')
    }
  ];

  const resultados: string[] = [];

  try {
    for (const logo of logos) {
      const destino = path.join(process.cwd(), 'public', logo.nome);
      await fs.copyFile(logo.fonte, destino);
      resultados.push(`${logo.nome} copiado com sucesso`);
    }
    return NextResponse.json({ sucesso: true, resultados });
  } catch (err) {
    return NextResponse.json({ erro: String(err) }, { status: 500 });
  }
}
