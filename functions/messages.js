export async function onRequest({ request, env }) {

  // ===== FETCH CONVERSATION =====
  if (request.method === "GET") {
    try {
      const url = new URL(request.url);
      const u1 = url.searchParams.get("user1");
      const u2 = url.searchParams.get("user2");

      if (!u1 || !u2) {
        return new Response(JSON.stringify({ error: "Missing user1 or user2" }), { status: 400 });
      }

      const { results } = await env.DB.prepare(`
        SELECT * FROM messages
        WHERE (sender_id = ? AND receiver_id = ?)
           OR (sender_id = ? AND receiver_id = ?)
        ORDER BY timestamp ASC
      `).bind(u1, u2, u2, u1).all();

      return new Response(JSON.stringify(results), {
        headers: { "Content-Type": "application/json" }
      });
    } catch (e) {
      return new Response(JSON.stringify({ error: e.message }), { status: 500 });
    }
  }

  // ===== SEND MESSAGE =====
  if (request.method === "POST") {
    try {
      const {
        sender_id,
        receiver_id,
        content,
        media_url,
        message_type,
        metadata
      } = await request.json();

      if (!sender_id || !receiver_id || !message_type) {
        return new Response("Missing fields", { status: 400 });
      }

      const timestamp = Date.now();

      await env.DB.prepare(`
        INSERT INTO messages
        (sender_id, receiver_id, content, media_url, message_type, metadata, timestamp)
        VALUES (?, ?, ?, ?, ?, ?, ?)
      `).bind(
        sender_id,
        receiver_id,
        content || null,
        media_url || null,
        message_type,
        metadata ? JSON.stringify(metadata) : null,
        timestamp
      ).run();

      return new Response(JSON.stringify({ sent: true, timestamp }), {
        headers: { "Content-Type": "application/json" }
      });
    } catch (e) {
      return new Response(JSON.stringify({ error: e.message }), { status: 500 });
    }
  }

  return new Response("Method Not Allowed", { status: 405 });
}