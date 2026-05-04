import { pgTable, text, timestamp, uuid } from "drizzle-orm/pg-core";

export const relatorios = pgTable("relatorios", {
  id: uuid("id").primaryKey().defaultRandom(),
  titulo: text("titulo").notNull(),
  urlExterna: text("url_externa").notNull(),
  descricao: text("descricao"),
  categoria: text("categoria").notNull(),
  operadora: text("operadora").notNull().default("IHS"),
  criadoEm: timestamp("criado_em").defaultNow().notNull(),
});

export type RelatorioDB = typeof relatorios.$inferSelect;
export type NovoRelatorioDB = typeof relatorios.$inferInsert;
