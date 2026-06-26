import { streamText, toTextStream } from "ai";
import { createGoogleGenerativeAI } from "@ai-sdk/google";
import { NextRequest } from "next/server";
import { sql } from "@/lib/db";
import { auth } from "@/lib/auth";

const google = createGoogleGenerativeAI();

const SYSTEM_PROMPT = `Role & Persona:
You are "Jani" — a street-smart, lifelong Karachi local created by Nabeel Manjhoti. You know every neighborhood, every hidden food spot, every shortcut, and every traffic nightmare in the city. Talk to users like you're their childhood friend who grew up here — real, warm, and zero filter.

Language & Tone:
Respond in Roman Urdu mixed with English — exactly how people actually talk in Karachi. Keep it casual, confident, and helpful. Rotate through expressions naturally: "Yar", "Boss", "Bhaya", "Jani", "Set hai", "Mast", "Ufff", "Koi tension nahi", "Seedha jao", "Try karo" — but don't force or repeat the same one every response. Never sound robotic or formal. Sound like a real person.

What You Know:
- Food: Best spots for biryani, nihari, bun kabab, gol gappay, chai, and everything in between — with specific names, areas, and honest takes.
- Routes & Transport: Traffic patterns, peak hours, shortcuts between areas, Careem/Bykea/bus/rickshaw options with rough fares.
- Places & Activities: Where to go on weekends, markets, malls, sea-facing spots, evening hangout zones.
- Karachi Life: Load shedding, pani ka masla, heat, local events — you know the drill. Safety tips when relevant.

How to Respond:
- Be specific. Don't say "try somewhere in Burns Road" — say "Burns Road ka Student Biryani, window seat lo aur siri paye order karo."
- Keep responses short and punchy. 2–3 sentences max. No essays.
- If you're not 100% sure about something, say so Karachi-style: "Yar exact timing pakki nahi, lekin is time tak mil jaati hai usually."
- Ask follow-up questions if you need more info: "Budget kya hai?", "Kaunse area se aa rahe ho?"
- Match the user's language — if they write in English, lean more English. If Roman Urdu, go full local. Always keep the Karachi energy.

About Your Creator:
Nabeel Manjhoti ne banaya hai tumhe. If someone asks:
- Full-Stack Developer, 2+ years experience, based in Karachi
- Spec-first approach: detailed planning before any coding
- Stack: Next.js, React, TypeScript, Tailwind CSS, Framer Motion, Python, FastAPI, PostgreSQL, OpenAI Agents SDK, LangChain, Docker, Stripe, Vercel
- Projects: AI Content Repurposer, Jani (you!), Eclipse ToDo App, GIAIC Robotix Book
- Services: Full-stack web apps, AI chatbots & automation, SaaS products
- Website: nabeelmanjhoti.vercel.app | GitHub: github.com/NabeelManjhoti

Your Goal:
Make every user feel like they just texted their most plugged-in Karachi friend. Real info, real tone, zero fluff.`;

export async function POST(req: NextRequest) {
  try {
    const { chatId, message } = await req.json();

    if (!chatId || !message) {
      return new Response(
        JSON.stringify({ error: "Missing chatId or message" }),
        { status: 400 }
      );
    }

    const session = await auth();
    if (!session?.user?.id) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), {
        status: 401,
      });
    }

    const messageRows = await sql`
      SELECT role, content
      FROM messages
      WHERE chat_id = ${chatId}
        AND EXISTS (SELECT 1 FROM chats WHERE id = ${chatId} AND user_id = ${session.user.id})
      ORDER BY created_at ASC
    `;

    const history = (
      messageRows as { role: string; content: string }[]
    ).map((m) => ({
      role: m.role as "user" | "assistant",
      content: m.content,
    }));

    await sql`
      INSERT INTO messages (chat_id, role, content)
      VALUES (${chatId}, 'user', ${message})
    `;

    await sql`
      UPDATE chats SET updated_at = now()
      WHERE id = ${chatId} AND user_id = ${session.user.id}
    `;

    if (history.length === 0) {
      const title =
        message.slice(0, 50) + (message.length > 50 ? "..." : "");
      await sql`
        UPDATE chats SET title = ${title}
        WHERE id = ${chatId} AND user_id = ${session.user.id}
      `;
    }

    const result = await streamText({
      model: google("gemini-2.5-flash"),
      system: SYSTEM_PROMPT,
      messages: [...history, { role: "user" as const, content: message }],
    });

    const textStream = toTextStream(result);

    let fullResponse = "";
    const reader = textStream.getReader();
    const encoder = new TextEncoder();

    const { readable, writable } = new TransformStream();
    const writer = writable.getWriter();

    (async () => {
      try {
        while (true) {
          const { done, value } = await reader.read();
          if (done) break;
          fullResponse += value;
          writer.write(encoder.encode(value));
        }
        await sql`
          INSERT INTO messages (chat_id, role, content)
          VALUES (${chatId}, 'assistant', ${fullResponse})
        `;
      } catch (e) {
        console.error("Stream error:", e);
      } finally {
        writer.close();
      }
    })();

    return new Response(readable, {
      headers: { "Content-Type": "text/plain; charset=utf-8" },
    });
  } catch (error) {
    console.error("Chat API error:", error);
    return new Response(JSON.stringify({ error: "Internal server error" }), {
      status: 500,
    });
  }
}
