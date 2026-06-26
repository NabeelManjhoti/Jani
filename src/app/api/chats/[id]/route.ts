import { NextResponse } from "next/server";
import { sql } from "@/lib/db";
import { auth } from "@/lib/auth";

export async function DELETE(
  _req: Request,
  { params }: { params: { id: string } }
) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = params;

  await sql`DELETE FROM messages WHERE chat_id = ${id}`;
  await sql`DELETE FROM chats WHERE id = ${id} AND user_id = ${session.user.id}`;

  return NextResponse.json({ success: true });
}
