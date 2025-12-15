
export async function onRequest({ request, env }) {
  if (request.method === "POST") {
    try {
      const d = await request.json();
      const timestamp = Date.now();
      await env.DB.prepare(
        "INSERT INTO messages (sender_id, receiver_id, content, timestamp) VALUES (?, ?, ?, ?)"
      ).bind(d.sender_id, d.receiver_id, d.content, timestamp).run();

      return new Response(JSON.stringify({ success: true, timestamp }), { headers: { "Content-Type": "application/json" } });
    } catch (e) {
      return new Response(JSON.stringify({ error: e.message }), { status: 500 });
    }
  }

  if (request.method === "GET") {
    try {
      const u = new URL(request.url).searchParams;
      const user1 = u.get("user1");
      const user2 = u.get("user2");

      if (!user1 || !user2) {
        return new Response(JSON.stringify({ error: "Missing parameters" }), { status: 400 });
      }

      const { results } = await env.DB.prepare(
        "SELECT * FROM messages WHERE (sender_id=? AND receiver_id=?) OR (sender_id=? AND receiver_id=?) ORDER BY timestamp ASC"
      ).bind(user1, user2, user2, user1).all();

      return new Response(JSON.stringify(results), { headers: { "Content-Type": "application/json" } });
    } catch (e) {
      return new Response(JSON.stringify({ error: e.message }), { status: 500 });
    }
  }

  return new Response("Method not allowed", { status: 405 });
}
