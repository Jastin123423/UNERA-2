
export async function onRequest({ request, env }) {
  // POST: create notification
  if (request.method === "POST") {
    try {
      const { user_id, type, content } = await request.json();
      await env.DB.prepare(
        "INSERT INTO notifications (user_id, type, content) VALUES (?, ?, ?)"
      ).bind(user_id, type, content).run();
      return new Response(JSON.stringify({ success: true }));
    } catch (e) {
      return new Response(JSON.stringify({ error: e.message }), { status: 500 });
    }
  }

  // GET: fetch unread notifications
  if (request.method === "GET") {
    try {
      const url = new URL(request.url);
      const userId = url.searchParams.get("user_id");
      
      if (!userId) {
         return new Response(JSON.stringify({ error: "User ID required" }), { status: 400 });
      }

      const { results } = await env.DB.prepare(
        "SELECT * FROM notifications WHERE user_id = ? AND read = 0 ORDER BY created_at DESC"
      ).bind(userId).all();
      
      return new Response(JSON.stringify(results), { headers: { "Content-Type": "application/json" } });
    } catch (e) {
      return new Response(JSON.stringify({ error: e.message }), { status: 500 });
    }
  }

  return new Response(JSON.stringify({ error: "Invalid request" }), { status: 400 });
}
