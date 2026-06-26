import { NextResponse } from "next/server";
import { sql } from "@/lib/db";
import { auth } from "@/lib/auth";

export async function GET() {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const rows = await sql`
    SELECT id, title, created_at
    FROM chats
    WHERE user_id = ${session.user.id}
    ORDER BY updated_at DESC
  `;

  return NextResponse.json({ data: rows });
}

export async function POST() {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const rows = await sql`
    INSERT INTO chats (user_id)
    VALUES (${session.user.id})
    RETURNING id, title, created_at
  `;

  return NextResponse.json({ data: rows[0] });
}
