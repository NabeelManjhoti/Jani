import { neon } from "@neondatabase/serverless";

let _sql: ReturnType<typeof neon> | null = null;

function getSql() {
  if (!_sql) {
    const url = process.env.NEON_DATABASE_URL;
    if (!url || url.startsWith("your_")) {
      throw new Error("NEON_DATABASE_URL not configured. Set it in .env.local");
    }
    _sql = neon(url);
  }
  return _sql;
}

export async function sql(
  strings: TemplateStringsArray,
  ...values: unknown[]
): Promise<Record<string, unknown>[]> {
  return getSql()(strings, ...values) as Promise<Record<string, unknown>[]>;
}
