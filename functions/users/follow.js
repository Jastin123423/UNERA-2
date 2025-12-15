export async function onRequest({ request, env }) {
  if (request.method !== "POST") {
    return new Response("Method Not Allowed", { status: 405 });
  }

  const { follower_id, following_id, action } = await request.json();

  if (!follower_id || !following_id || follower_id === following_id) {
    return new Response(JSON.stringify({ error: "Invalid users" }), { status: 400 });
  }

  try {
    if (action === "follow") {
      // Prevent duplicate connection
      await env.DB.prepare(
        "INSERT OR IGNORE INTO follows (follower_id, following_id) VALUES (?, ?)"
      ).bind(follower_id, following_id).run();

      // Increment BOTH users
      await env.DB.prepare(
        "UPDATE users SET followers = followers + 1 WHERE id IN (?, ?)"
      ).bind(follower_id, following_id).run();

      // Notify target user
      await env.DB.prepare(
        "INSERT INTO notifications (user_id, type, actor_id, message) VALUES (?, ?, ?, ?)"
      ).bind(
        following_id,
        "follow",
        follower_id,
        "started a connection with you"
      ).run();

      return new Response(JSON.stringify({ followed: true }));
    }

    if (action === "unfollow") {
      await env.DB.prepare(
        "DELETE FROM follows WHERE follower_id = ? AND following_id = ?"
      ).bind(follower_id, following_id).run();

      // Decrement BOTH users safely
      await env.DB.prepare(
        `UPDATE users
         SET followers = CASE
           WHEN followers > 0 THEN followers - 1
           ELSE 0
         END
         WHERE id IN (?, ?)`
      ).bind(follower_id, following_id).run();

      return new Response(JSON.stringify({ unfollowed: true }));
    }

    return new Response(JSON.stringify({ error: "Invalid action" }), { status: 400 });
  } catch (e) {
    return new Response(
      JSON.stringify({ error: "Internal error", message: e.message }),
      { status: 500 }
    );
  }
}
