export async function onRequest({ request, env }) {

  // ===== LIST PAGES =====
  if (request.method === "GET") {
    try {
      const { results } = await env.DB.prepare(
        "SELECT * FROM pages ORDER BY created_at DESC"
      ).all();

      return new Response(JSON.stringify(results), {
        headers: { "Content-Type": "application/json" }
      });
    } catch (e) {
      return new Response(JSON.stringify({ error: e.message }), { status: 500 });
    }
  }

  // ===== CREATE PAGE =====
  if (request.method === "POST") {
    try {
      const { name, description, owner_id } = await request.json();

      if (!name || !owner_id) {
        return new Response("Missing fields", { status: 400 });
      }

      const result = await env.DB.prepare(
        "INSERT INTO pages (name, description, owner_id) VALUES (?, ?, ?)"
      ).bind(name, description || null, owner_id).run();

      return new Response(JSON.stringify({
        success: true,
        page_id: result.meta.last_row_id
      }), { headers: { "Content-Type": "application/json" } });
    } catch (e) {
      return new Response(JSON.stringify({ error: e.message }), { status: 500 });
    }
  }

  return new Response("Method Not Allowed", { status: 405 });
}