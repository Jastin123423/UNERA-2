export async function onRequest({ request, env }) {

  // ===== GET POSTS =====
  if (request.method === "GET") {
    try {
      const { results } = await env.DB.prepare(
        "SELECT * FROM posts ORDER BY created_at DESC LIMIT 50"
      ).all();

      return new Response(JSON.stringify(results), {
        headers: { "Content-Type": "application/json" }
      });
    } catch (e) {
      return new Response(JSON.stringify({ error: e.message }), { status: 500 });
    }
  }

  // ===== CREATE POST =====
  if (request.method === "POST") {
    try {
      const data = await request.json();

      const result = await env.DB.prepare(
        "INSERT INTO posts (user_id, content, media_url) VALUES (?, ?, ?)"
      ).bind(
        data.user_id,
        data.content,
        data.media_url || null
      ).run();

      if (result.meta.changes === 0) {
        throw new Error("Post insert failed");
      }

      const newPost = {
        id: result.meta.last_row_id,
        user_id: data.user_id,
        content: data.content,
        media_url: data.media_url || null,
        created_at: new Date().toISOString(),
        reactions: [],
        comments: [],
        shares: 0
      };

      // ===== SAFE REAL-TIME BROADCAST =====
      if (env.LIVE_FEED_DO) {
        try {
          const doId = env.LIVE_FEED_DO.idFromName("global");
          const stub = env.LIVE_FEED_DO.get(doId);

          await stub.fetch("https://do/broadcast", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              type: "new_post",
              data: newPost
            })
          });
        } catch (err) {
          // ❗ Never break post creation if realtime fails
          console.warn("Live feed broadcast failed:", err.message);
        }
      }

      return new Response(JSON.stringify({
        success: true,
        post: newPost
      }), {
        headers: { "Content-Type": "application/json" }
      });

    } catch (e) {
      return new Response(JSON.stringify({ error: e.message }), { status: 500 });
    }
  }

  return new Response("Method not allowed", { status: 405 });
}
