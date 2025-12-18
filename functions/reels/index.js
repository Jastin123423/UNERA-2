export async function onRequest({ request, env }) {
  // ===== GET REELS =====
  if (request.method === "GET") {
    try {
      const { results } = await env.DB.prepare(
        "SELECT * FROM reels ORDER BY created_at DESC LIMIT 50"
      ).all();

      return new Response(JSON.stringify(results), {
        headers: { "Content-Type": "application/json" }
      });
    } catch (e) {
      return new Response(JSON.stringify({ error: e.message }), { status: 500 });
    }
  }

  // ===== CREATE REEL =====
  if (request.method === "POST") {
    try {
      const { user_id, video_url, caption } = await request.json();

      if (!user_id || !video_url) {
        return new Response("Missing fields", { status: 400 });
      }

      const result = await env.DB.prepare(
        "INSERT INTO reels (user_id, video_url, caption, created_at) VALUES (?, ?, ?, ?)"
      ).bind(user_id, video_url, caption || null, new Date().toISOString()).run();

      return new Response(JSON.stringify({
        success: true,
        reel_id: result.meta.last_row_id
      }), { 
        headers: { "Content-Type": "application/json" } 
      });
    } catch (e) {
      return new Response(JSON.stringify({ error: e.message }), { status: 500 });
    }
  }

  return new Response("Method Not Allowed", { status: 405 });
}