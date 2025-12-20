export async function onRequest({ request, env }) {
  const url = new URL(request.url);

  // ===== GET COMMENTS =====
  if (request.method === "GET") {
    const reel_id = url.searchParams.get("reel_id");
    if (!reel_id) {
      return new Response("Missing reel_id", { status: 400 });
    }

    try {
      const { results } = await env.DB.prepare(
        "SELECT * FROM reel_comments WHERE reel_id = ? ORDER BY created_at ASC"
      ).bind(reel_id).all();

      return new Response(JSON.stringify(results), {
        headers: { "Content-Type": "application/json" }
      });
    } catch (e) {
      return new Response(JSON.stringify({ error: e.message }), { status: 500 });
    }
  }

  // ===== CREATE COMMENT =====
  if (request.method === "POST") {
    try {
      const { reel_id, user_id, content } = await request.json();

      if (!reel_id || !user_id || !content) {
        return new Response("Missing fields", { status: 400 });
      }

      const result = await env.DB.prepare(
        "INSERT INTO reel_comments (reel_id, user_id, content, created_at) VALUES (?, ?, ?, ?)"
      ).bind(reel_id, user_id, content, new Date().toISOString()).run();

      return new Response(JSON.stringify({
        success: true,
        comment_id: result.meta.last_row_id
      }), { headers: { "Content-Type": "application/json" } });
    } catch (e) {
      return new Response(JSON.stringify({ error: e.message }), { status: 500 });
    }
  }

  return new Response("Method Not Allowed", { status: 405 });
}