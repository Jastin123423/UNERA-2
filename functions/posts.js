export async function onRequest({ request, env }) {

  const SYSTEM_USER_ID = 1; // 👈 default author

  /* ================= GET POSTS ================= */
  if (request.method === "GET") {
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
      headers: { "Content-Type": "application/json" }
    });
  }

  /* ================= CREATE POST ================= */
  if (request.method === "POST") {
    const {
      user_id,
      content,
      media_url,
      media_type,
      visibility
    } = await request.json();

    const finalUserId = Number(user_id) || SYSTEM_USER_ID;

    await env.DB.prepare(`
      INSERT INTO posts
        (user_id, content, media_url, media_type, visibility)
      VALUES (?, ?, ?, ?, ?)
    `).bind(
      finalUserId,          // ✅ NEVER NULL
      content || null,
      media_url || null,
      media_type || null,
      visibility || "public"
    ).run();

    return new Response(JSON.stringify({ success: true }), {
      headers: { "Content-Type": "application/json" }
    });
  }

  return new Response("Method Not Allowed", { status: 405 });
}
