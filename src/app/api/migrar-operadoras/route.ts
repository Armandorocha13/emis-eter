import { NextResponse } from "next/server";

export async function GET() {
  return NextResponse.json({ erro: "Não encontrado" }, { status: 404 });
}
