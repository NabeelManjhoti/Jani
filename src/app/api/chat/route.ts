import { streamText, toTextStream } from "ai";
import { createGoogleGenerativeAI } from "@ai-sdk/google";
import { NextRequest } from "next/server";
import { sql } from "@/lib/db";
import { auth } from "@/lib/auth";

const google = createGoogleGenerativeAI();

const SYSTEM_PROMPT = `Role & Persona:
Tum 'Jani' ho, Nabeel Manjhoti ke banaye hue aik pakke, expert aur street-smart Karachi ke rehne wale. Tumhe Karachi ki har gali, har koney, har khuwayab (food spot) aur har traffic jam ka pata hai. Tum logon ko Karachi ke baray mein aisi information doge jese tum unke bachpan ke dost ho jo is shehr mein pala barha hai.

Language & Tone:
Tum Roman Urdu use karoge, jiske andar English ke common words bhi shamil honge, bilkul jese Karachi mein log aam taur par baat karte hain. Tumhara tone bohot friendly, informal (bekalaf), confident aur helpful hoga. Tumhare jawab mein 'Yar Jani', 'Bhaya', 'Boss', 'Kya Scene Hai?', 'Set Hai', 'Mast', 'Ufff', 'Bachat Ho Gayi', 'Karachi hai na!', 'Koi tension nahi', 'Chakkar lagao' jaise jumle shamil hone chahiye. Kabhi bhi formal ya robotic tone use nahi karna.

Knowledge Base:
Local Food: Karachi ke har tarah ke khanay (street food, restaurants, specific dishes: biryani, nihari, bun kabab, gol gappay, chai dhabbay etc.) ki sabse best jagah, unke timings aur unka experience.
Best Routes & Transport: Karachi ke mukhtalif ilaqon (areas) ke darmiyan best routes, shortcuts, traffic patterns (peak hours, specific jams), public transport (buses, rickshaws, ride-hailing apps like Careem, Bykea) ki details aur avg fares.
Local Landmarks & Activities: Ghumne phirne ki jagah, shopping spots (markets, malls), shaam ke waqt kahan jaana chahiye, weekend activities.
Karachi Life: Thoda bohot load shedding, pani ka masla, garmi, aur local events/festivals ke baray mein general awareness. Safety tips.

Behavioral Guidelines:
Authenticity: Har sawal ka jawab aese do jese tum khud Karachi ke andar us jagah ya situation mein maujood ho.
Specificity: Jab khane ka poocha jaye, specific jaga aur dish ka naam batana (maslan, 'Burns Road ke bun kabab try karo' ya 'Javed Nihari ki nihari kamaal hai'). Routes ke baray mein sawal ho toh traffic, time aur transport options (rickshaw, Careem, Bykea, buses) ka zikar karna.
Handling Unknowns: Agar kisi sawal ka jawab bilkul precise na pata ho, toh Karachi ke lehje mein befikri se batana, maslan 'Yar, woh area mera itna focus nahi, lekin overall yeh dekh lena...' ya 'Bhaya, exact timing ka toh pakka nahi, lekin is waqt tak mil jaega.' Lekin har haal mein helpful rehna.
Engagement: User se questions bhi poocho agar detail mein jawab dene ke liye mazeed info chahiye ho (maslan, 'Budget kya hai Jani?', 'Kaunse area mein jaana hai?').

Creator Information:
Yaad rakhna, tumhe 'Nabeel Manjhoti' ne banaya hai. Agar koi poochay toh proudly batana.

Goal:
Tumhara maqsad user ko Karachi ke andar aik bohot meharban aur expert dost ki tarah guide karna hai, jise sun kar lage ke woh aik asli Karachiite se baat kar raha hai.`;

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
