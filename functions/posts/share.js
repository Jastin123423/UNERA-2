
export async function onRequest({ request, env }) {
  if (request.method !== "POST") {
    return new Response("Method Not Allowed", { status: 405 });
  }

  try {
    const data = await request.json();
    const { user_id, original_post_id, caption, group_id } = data;

    // 1. Get Original Post to find author
    const originalPost = await env.DB.prepare("SELECT * FROM posts WHERE id = ?").bind(original_post_id).first();
    
    // 2. Create the Share Post
    // Note: We are reusing the 'posts' table. 
    // You might need a `shared_post_id` column. We will use a JSON structure in `media_url` or a specific column if it existed, 
    // but for compatibility with existing `posts.js` schema, we'll assume we can insert basic data.
    // Ideally: ALTER TABLE posts ADD COLUMN shared_post_id INTEGER;
    try { await env.DB.prepare("ALTER TABLE posts ADD COLUMN shared_post_id INTEGER").run(); } catch (e) {}

    const result = await env.DB.prepare(
      "INSERT INTO posts (user_id, content, shared_post_id, created_at) VALUES (?, ?, ?, ?)"
    ).bind(user_id, caption, original_post_id, new Date().toISOString()).run();

    const newShareId = result.meta.last_row_id;

    // 3. Notification to Original Author
    if (originalPost && originalPost.user_id !== user_id) {
        const now = Date.now();
        await env.DB.prepare(
            "INSERT INTO notifications (user_id, sender_id, type, content, post_id, created_at, read) VALUES (?, ?, 'share', 'shared your post.', ?, ?, 0)"
        ).bind(originalPost.user_id, user_id, original_post_id, now).run();

        // 4. Broadcast
        try {
            const doId = env.LIVE_FEED_DO.idFromName("global");
            const stub = env.LIVE_FEED_DO.get(doId);
            await stub.fetch("https://dummy.url/broadcast", {
                method: "POST",
                body: JSON.stringify({
                    type: "notification",
                    toUserId: originalPost.user_id,
                    data: {
                        id: Date.now(),
                        userId: originalPost.user_id,
                        senderId: user_id,
                        type: 'share',
                        content: 'shared your post.',
                        postId: original_post_id,
                        timestamp: now,
                        read: false
                    }
                })
            });
        } catch(e) {}
    }

    return new Response(JSON.stringify({ success: true, id: newShareId }), {
      headers: { "Content-Type": "application/json" }
    });

  } catch (e) {
    return new Response(JSON.stringify({ error: e.message }), { status: 500 });
  }
}
