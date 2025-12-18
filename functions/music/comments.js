export async function onRequest({ request, env }) {
  const url = new URL(request.url);

  // ===== GET COMMENTS =====
  if (request.method === "GET") {
    const music_id = url.searchParams.get("music_id");
    if (!music_id) {
      return new Response("Missing music_id", { status: 400 });
    }

    try {
      const { results } = await env.DB.prepare(`
        SELECT mc.*, u.username, u.profile_url
        FROM music_comments mc
        JOIN users u ON u.id = mc.user_id
        WHERE mc.music_id = ?
        ORDER BY mc.created_at ASC
      `).bind(music_id).all();

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
      const { music_id, user_id, content } = await request.json();

      if (!music_id || !user_id || !content) {
        return new Response("Missing fields", { status: 400 });
      }

      await env.DB.prepare(
        "INSERT INTO music_comments (music_id, user_id, content, created_at) VALUES (?, ?, ?, ?)"
      ).bind(music_id, user_id, content, new Date().toISOString()).run();

      return new Response(JSON.stringify({ success: true }), {
        headers: { "Content-Type": "application/json" }
      });
    } catch (e) {
      return new Response(JSON.stringify({ error: e.message }), { status: 500 });
    }
  }

  return new Response("Method Not Allowed", { status: 405 });
}