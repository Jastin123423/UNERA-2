export async function onRequest({ request, env }) {

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
        headers: {
          "Content-Type": "application/json",
          "Cache-Control": "no-store"
        }
      });
    } catch (err) {
      return new Response(JSON.stringify({ error: err.message }), { status: 500 });
    }
  }

  /* ================= CREATE POST ================= */
  if (request.method === "POST") {
    try {
      const { user_id, content, media_url, media_type, visibility } = await request.json();

      if (!user_id) {
        return new Response(
          JSON.stringify({ error: "user_id is required" }),
          { status: 400 }
        );
      }

      // IMPORTANT:
      // - Do NOT send blob: URLs
      // - media_url must be NULL or a real URL (R2 / CDN / https)
      if (media_url && media_url.startsWith("blob:")) {
        return new Response(
          JSON.stringify({ error: "Invalid media_url. Upload media first." }),
          { status: 400 }
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

      // Fetch the ACTUAL row saved in DB
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

      return new Response(JSON.stringify({
        success: true,
        post: results[0]
      }), {
        headers: { "Content-Type": "application/json" }
      });

    } catch (err) {
      return new Response(JSON.stringify({ error: err.message }), { status: 500 });
    }
  }

  return new Response("Method Not Allowed", { status: 405 });
}
