
export async function onRequestPost({ request, env }) {
  const { follower_id, following_id, action } = await request.json();

  if (!follower_id || !following_id || !action) {
    return new Response(JSON.stringify({ error: "Missing fields" }), { status: 400 });
  }

  if (action === "follow") {
    await env.DB.prepare(
      "INSERT OR IGNORE INTO follows (follower_id, following_id) VALUES (?, ?)"
    ).bind(follower_id, following_id).run();

    await env.DB.prepare(
      "UPDATE users SET followers = followers + 1 WHERE id = ?"
    ).bind(following_id).run();

    await env.DB.prepare(
      "INSERT INTO notifications (user_id, type, content, actor_id) VALUES (?, ?, ?, ?)"
    ).bind(
      following_id,
      "follow",
      "Someone started following you",
      follower_id
    ).run();

    return new Response(JSON.stringify({ followed: true }), {
      headers: { "Content-Type": "application/json" }
    });
  }

  if (action === "unfollow") {
    await env.DB.prepare(
      "DELETE FROM follows WHERE follower_id = ? AND following_id = ?"
    ).bind(follower_id, following_id).run();

    await env.DB.prepare(
      "UPDATE users SET followers = CASE WHEN followers > 0 THEN followers - 1 ELSE 0 END WHERE id = ?"
    ).bind(following_id).run();

    return new Response(JSON.stringify({ unfollowed: true }), {
      headers: { "Content-Type": "application/json" }
    });
  }

  return new Response(JSON.stringify({ error: "Invalid action" }), { status: 400 });
}
