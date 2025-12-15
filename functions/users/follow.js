export async function onRequest({ request, env }) {
  if (request.method !== "POST") {
    return new Response("Method Not Allowed", { status: 405 });
  }

  try {
    const { follower_id, following_id, action } = await request.json();

    if (!follower_id || !following_id || !action) {
      return new Response(JSON.stringify({ error: "Missing fields" }), { status: 400 });
    }

    // ===================== FOLLOW =====================
    if (action === "follow") {
      // 1. Create follow relation (safe)
      const res = await env.DB.prepare(
        "INSERT OR IGNORE INTO follows (follower_id, following_id) VALUES (?, ?)"
      ).bind(follower_id, following_id).run();

      // If already following, do nothing
      if (res.meta.changes === 0) {
        return new Response(JSON.stringify({ followed: false, reason: "Already following" }));
      }

      // 2. Increment followers count
      await env.DB.prepare(
  "UPDATE users SET followers = followers + 1 WHERE id IN (?, ?)"
).bind(follower_id, following_id).run();

      // 3. Store notification
      await env.DB.prepare(
        "INSERT INTO notifications (user_id, type, message, is_read) VALUES (?, ?, ?, 0)"
      ).bind(
        following_id,
        "follow",
        "started following you"
      ).run();

      // 4. 🔴 REAL-TIME PUSH (Durable Object)
      const doId = env.LIVE_FEED_DO.idFromName(`user-${following_id}`);
      const stub = env.LIVE_FEED_DO.get(doId);

      await stub.fetch("https://live/push", {
        method: "POST",
        body: JSON.stringify({
          type: "follow",
          actor_id: follower_id,
          message: "started following you"
        })
      });

      return new Response(JSON.stringify({ followed: true }), {
        headers: { "Content-Type": "application/json" }
      });
    }

    // ===================== UNFOLLOW =====================
    if (action === "unfollow") {
      const res = await env.DB.prepare(
        "DELETE FROM follows WHERE follower_id = ? AND following_id = ?"
      ).bind(follower_id, following_id).run();

      if (res.meta.changes === 0) {
        return new Response(JSON.stringify({ unfollowed: false, reason: "Not following" }));
      }

      await env.DB.prepare(
        "UPDATE users SET followers = CASE WHEN followers > 0 THEN followers - 1 ELSE 0 END WHERE id = ?"
      ).bind(following_id).run();

      return new Response(JSON.stringify({ unfollowed: true }), {
        headers: { "Content-Type": "application/json" }
      });
    }

    return new Response(JSON.stringify({ error: "Invalid action" }), { status: 400 });

  } catch (e) {
    return new Response(JSON.stringify({ error: "Internal error", message: e.message }), {
      status: 500
    });
  }
}
