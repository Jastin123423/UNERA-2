export async function onRequest({ request, env }) {

  const SYSTEM_USER_ID = 1; // Default author for unauthenticated posts
  const url = new URL(request.url);

  /* ================= GET POSTS ================= */
  if (request.method === "GET") {
    try {
      const userId = url.searchParams.get("user_id");

      let query = `
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
      `;

      const params = [];

      // Profile feed support
      if (userId) {
        query += " WHERE user_id = ?";
        params.push(userId);
      }

      query += " ORDER BY datetime(created_at) DESC LIMIT 50";

      const { results } = await env.DB
        .prepare(query)
        .bind(...params)
        .all();

      return new Response(JSON.stringify(results), {
        headers: {
          "Content-Type": "application/json",
          "Cache-Control": "no-store"
        }
      });

    } catch (err) {
      return new Response(
        JSON.stringify({ error: err.message }),
        { status: 500 }
      );
    }
  }

  /* ================= CREATE POST ================= */
  if (request.method === "POST") {
    try {
      const {
        user_id,
        content,
        media_url,
        media_type,
        visibility
      } = await request.json();

      // Reject blob URLs (frontend must upload to R2 first)
      if (media_url && media_url.startsWith("blob:")) {
        return new Response(
          JSON.stringify({ error: "Invalid media_url. Upload media first." }),
          { status: 400 }
        );
      }

      const finalUserId = Number(user_id) || SYSTEM_USER_ID;

      const insert = await env.DB.prepare(`
        INSERT INTO posts
          (user_id, content, media_url, media_type, visibility)
        VALUES (?, ?, ?, ?, ?)
      `).bind(
        finalUserId,
        content || null,
        media_url || null,
        media_type || null,
        visibility || "public"
      ).run();

      // Fetch the actual row stored in DB
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
      return new Response(
        JSON.stringify({ error: err.message }),
        { status: 500 }
      );
    }
  }

  return new Response("Method Not Allowed", { status: 405 });
}
