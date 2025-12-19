export async function onRequest({ request, env }) {
  const url = new URL(request.url);

  /* ================= SEND MESSAGE ================= */
  if (url.pathname === "/messages" && request.method === "POST") {
    const data = await request.json();

    await env.DB.prepare(`
      INSERT INTO messages
      (sender_id, receiver_id, message_type, content, media_url, metadata)
      VALUES (?, ?, ?, ?, ?, ?)
    `).bind(
      data.sender_id,
      data.receiver_id,
      data.message_type || "text",
      data.content || null,
      data.media_url || null,
      data.metadata ? JSON.stringify(data.metadata) : null
    ).run();

    return new Response(JSON.stringify({ success: true }), {
      headers: { "Content-Type": "application/json" }
    });
  }

  /* ================= FETCH CHAT ================= */
  if (url.pathname === "/messages" && request.method === "GET") {
    const u1 = url.searchParams.get("user1");
    const u2 = url.searchParams.get("user2");

    const { results } = await env.DB.prepare(`
      SELECT * FROM messages
      WHERE
        (sender_id = ? AND receiver_id = ?)
        OR
        (sender_id = ? AND receiver_id = ?)
      ORDER BY created_at ASC
    `).bind(u1, u2, u2, u1).all();

    return new Response(JSON.stringify(results), {
      headers: { "Content-Type": "application/json" }
    });
  }

  /* ================= MARK AS READ ================= */
  if (url.pathname === "/messages/read" && request.method === "POST") {
    const { sender_id, receiver_id } = await request.json();

    await env.DB.prepare(`
      UPDATE messages
      SET is_read = 1,
          read_at = CURRENT_TIMESTAMP
      WHERE sender_id = ?
        AND receiver_id = ?
        AND is_read = 0
    `).bind(sender_id, receiver_id).run();

    return new Response(JSON.stringify({ success: true }), {
      headers: { "Content-Type": "application/json" }
    });
  }

  return new Response("Not Found", { status: 404 });
}
