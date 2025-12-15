
export async function onRequest({ request, env }) {
  if (request.method !== "POST") {
    return new Response("Method Not Allowed", { status: 405 });
  }

  try {
    const { follower_id, following_id } = await request.json();

    if (!follower_id || !following_id) {
      return new Response(JSON.stringify({ error: "Missing IDs" }), { status: 400 });
    }

    // 1. Ensure Schema
    try {
      await env.DB.prepare("CREATE TABLE IF NOT EXISTS followers (id INTEGER PRIMARY KEY, follower_id INTEGER, following_id INTEGER)").run();
    } catch (e) {}

    // 2. Check existence
    const existing = await env.DB.prepare("SELECT id FROM followers WHERE follower_id = ? AND following_id = ?")
      .bind(follower_id, following_id).first();

    let isFollowing = false;

    if (existing) {
      // Unfollow
      await env.DB.prepare("DELETE FROM followers WHERE id = ?").bind(existing.id).run();
      isFollowing = false;
    } else {
      // Follow
      await env.DB.prepare("INSERT INTO followers (follower_id, following_id) VALUES (?, ?)").bind(follower_id, following_id).run();
      isFollowing = true;

      // 3. Create Notification
      const now = Date.now();
      await env.DB.prepare(
        "INSERT INTO notifications (user_id, sender_id, type, content, created_at, read) VALUES (?, ?, 'follow', 'started following you.', ?, 0)"
      ).bind(following_id, follower_id, now).run();

      // 4. Real-time Broadcast
      try {
        const doId = env.LIVE_FEED_DO.idFromName("global");
        const stub = env.LIVE_FEED_DO.get(doId);
        await stub.fetch("https://dummy.url/broadcast", {
          method: "POST",
          body: JSON.stringify({
            type: "notification",
            toUserId: following_id,
            data: {
              id: Date.now(), // temp id
              userId: following_id,
              senderId: follower_id,
              type: 'follow',
              content: 'started following you.',
              timestamp: now,
              read: false
            }
          })
        });
      } catch (err) {
        console.error("Broadcast failed", err);
      }
    }

    return new Response(JSON.stringify({ success: true, isFollowing }), {
      headers: { "Content-Type": "application/json" }
    });

  } catch (e) {
    return new Response(JSON.stringify({ error: e.message }), { status: 500 });
  }
}
