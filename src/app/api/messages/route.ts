import { NextResponse } from "next/server";
import { sql } from "@/lib/db";
import { auth } from "@/lib/auth";

export async function POST(req: Request) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { chatId } = await req.json();

  if (!chatId) {
    return NextResponse.json({ error: "chatId required" }, { status: 400 });
  }

  const rows = await sql`
    SELECT id, role, content
    FROM messages
    WHERE chat_id = ${chatId}
      AND EXISTS (SELECT 1 FROM chats WHERE id = ${chatId} AND user_id = ${session.user.id})
    ORDER BY created_at ASC
  `;

  return NextResponse.json({ data: rows });
}
