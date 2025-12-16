
export async function onRequest({ request, env }) {
  if (request.method !== "POST") {
    return new Response("Method Not Allowed", { status: 405 });
  }

  const { user_id, post_id } = await request.json();

  if (!user_id || !post_id) {
    return new Response(JSON.stringify({ error: "Missing fields" }), { status: 400 });
  }

  try {
    // 1. Fetch original post
    const { results } = await env.DB.prepare(
      "SELECT * FROM posts WHERE id = ?"
    ).bind(post_id).all();

    const original = results[0];
    if (!original) {
      return new Response(JSON.stringify({ error: "Post not found" }), { status: 404 });
    }

    // 2. Prevent duplicate reposts
    await env.DB.prepare(
      "INSERT OR IGNORE INTO post_shares (user_id, post_id) VALUES (?, ?)"
    ).bind(user_id, post_id).run();

    // 3. Create repost (FULL content)
    await env.DB.prepare(`
      INSERT INTO posts (
        user_id,
        content,
        media_url,
        media_type,
        visibility,
        is_repost,
        original_post_id,
        created_at
      ) VALUES (?, ?, ?, ?, ?, 1, ?, ?)
    `).bind(
      user_id,
      original.content,
      original.media_url,
      original.media_type,
      original.visibility,
      original.id,
      new Date().toISOString()
    ).run();

    // 4. Increase share count
    await env.DB.prepare(
      "UPDATE posts SET shares = shares + 1 WHERE id = ?"
    ).bind(original.id).run();

    // 5. Notify original author
    if (original.user_id !== user_id) {
      await env.DB.prepare(
        "INSERT INTO notifications (user_id, type, actor_id, message) VALUES (?, ?, ?, ?)"
      ).bind(
        original.user_id,
        "repost",
        user_id,
        "reposted your post"
      ).run();
    }

    // 6. Broadcast live feed
    const id = env.LIVE_FEED_DO.idFromName("global");
    const stub = env.LIVE_FEED_DO.get(id);
    stub.fetch("https://dummy/repost", {
      method: "POST",
      body: JSON.stringify({
        type: "repost",
        original_post_id: original.id
      })
    });

    return new Response(JSON.stringify({ success: true }));
  } catch (e) {
    return new Response(
      JSON.stringify({ error: "Internal error", message: e.message }),
      { status: 500 }
    );
  }
}
