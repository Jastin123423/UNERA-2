export async function onRequest({ request, env }) {

  // ===== GET ALL PODCASTS =====
  if (request.method === "GET") {
    try {
      const { results } = await env.DB.prepare(
        "SELECT * FROM podcasts ORDER BY created_at DESC"
      ).all();
      
      return new Response(JSON.stringify(results), {
        headers: { "Content-Type": "application/json" }
      });
    } catch (e) {
      return new Response(JSON.stringify({ error: e.message }), { status: 500 });
    }
  }

  // ===== CREATE PODCAST =====
  if (request.method === "POST") {
    try {
      const { creator_id, title, description, audio_url, cover_url } = await request.json();

      if (!creator_id || !title || !audio_url) {
        return new Response("Missing fields", { status: 400 });
      }

      const result = await env.DB.prepare(`
        INSERT INTO podcasts (creator_id, title, description, audio_url, cover_url, created_at)
        VALUES (?, ?, ?, ?, ?, ?)
      `).bind(
        creator_id, 
        title, 
        description || null, 
        audio_url, 
        cover_url || null, 
        new Date().toISOString()
      ).run();

      return new Response(JSON.stringify({
        success: true,
        podcast_id: result.meta.last_row_id
      }), {
        headers: { "Content-Type": "application/json" }
      });
    } catch (e) {
      return new Response(JSON.stringify({ error: e.message }), { status: 500 });
    }
  }

  return new Response("Method Not Allowed", { status: 405 });
}