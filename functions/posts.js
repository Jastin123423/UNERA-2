export async function onRequest({ request, env }) {

  /* ========== CORS HEADERS (REQUIRED) ========== */
  const corsHeaders = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type",
    "Content-Type": "application/json",
    "Cache-Control": "no-store"
  };

  // Handle browser preflight
  if (request.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  /* ================= GET POSTS ================= */
  if (request.method === "GET") {
    try {
      const { results } = await env.DB.prepare(`
        SELECT
          id,
          user_id,
          content,
          media_url,
          media_type,
          visibility,
          is_repost,
          original_post_id,
          shares,
          created_at
        FROM posts
        ORDER BY datetime(created_at) DESC
        LIMIT 50
      `).all();

      return new Response(JSON.stringify(results), {
        headers: corsHeaders
      });
    } catch (err) {
      return new Response(
        JSON.stringify({ error: err.message }),
        { status: 500, headers: corsHeaders }
      );
    }
  }

  /* ================= CREATE POST ================= */
  if (request.method === "POST") {
    try {
      const { user_id, content, media_url, media_type, visibility } =
        await request.json();

      if (!user_id) {
        return new Response(
          JSON.stringify({ error: "user_id is required" }),
          { status: 400, headers: corsHeaders }
        );
      }

      // Block blob URLs (they disappear on refresh)
      if (media_url && media_url.startsWith("blob:")) {
        return new Response(
          JSON.stringify({ error: "Invalid media_url. Upload media first." }),
          { status: 400, headers: corsHeaders }
        );
      }

      const insert = await env.DB.prepare(`
        INSERT INTO posts
          (user_id, content, media_url, media_type, visibility)
        VALUES (?, ?, ?, ?, ?)
      `).bind(
        user_id,
        content || null,
        media_url || null,
        media_type || null,
        visibility || "public"
      ).run();

      // Fetch real saved row from DB
      const { results } = await env.DB.prepare(`
        SELECT
          id,
          user_id,
          content,
          media_url,
          media_type,
          visibility,
          is_repost,
          original_post_id,
          shares,
          created_at
        FROM posts
        WHERE id = ?
      `).bind(insert.meta.last_row_id).all();

      return new Response(
        JSON.stringify({ success: true, post: results[0] }),
        { headers: corsHeaders }
      );

    } catch (err) {
      return new Response(
        JSON.stringify({ error: err.message }),
        { status: 500, headers: corsHeaders }
      );
    }
  }

  return new Response(
    JSON.stringify({ error: "Method Not Allowed" }),
    { status: 405, headers: corsHeaders }
  );
}
