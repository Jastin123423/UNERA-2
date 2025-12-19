export async function onRequest({ request, env }) {
  // ===== GET COMMENTS =====
  if (request.method === "GET") {
    const url = new URL(request.url);
    const reel_id = url.searchParams.get("reel_id");

    if (!reel_id) {
      return new Response(
        JSON.stringify({ error: "Missing reel_id" }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }

    try {
      const { results } = await env.DB.prepare(`
        SELECT rc.*, u.username, u.avatar_url
        FROM reel_comments rc
        JOIN users u ON u.id = rc.user_id
        WHERE rc.reel_id = ?
        ORDER BY rc.created_at ASC
      `).bind(reel_id).all();

      return new Response(JSON.stringify(results), {
        headers: { "Content-Type": "application/json" }
      });
    } catch (err) {
      return new Response(
        JSON.stringify({ error: "Database error", details: err.message }),
        { status: 500, headers: { "Content-Type": "application/json" } }
      );
    }
  }

  // ===== CREATE COMMENT =====
  if (request.method === "POST") {
    try {
      const data = await request.json();
      const { reel_id, user_id, content } = data;

      if (!reel_id || !user_id || !content) {
        return new Response(
          JSON.stringify({ error: "Missing fields: reel_id, user_id, content are required" }),
          { status: 400, headers: { "Content-Type": "application/json" } }
        );
      }

      await env.DB.prepare(`
        INSERT INTO reel_comments (reel_id, user_id, content)
        VALUES (?, ?, ?)
      `).bind(reel_id, user_id, content).run();

      return new Response(
        JSON.stringify({ success: true }),
        { headers: { "Content-Type": "application/json" } }
      );
    } catch (err) {
      return new Response(
        JSON.stringify({ error: "Database error", details: err.message }),
        { status: 500, headers: { "Content-Type": "application/json" } }
      );
    }
  }

  // ===== METHOD NOT ALLOWED =====
  return new Response(
    JSON.stringify({ error: "Method Not Allowed" }),
    { status: 405, headers: { "Content-Type": "application/json" } }
  );
}
