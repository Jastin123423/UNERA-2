export async function onRequest({ request, env }) {
  if (request.method !== "POST") {
    return new Response("Method Not Allowed", { status: 405 });
  }

  try {
    const { page_id, user_id, action } = await request.json();

    if (!page_id || !user_id || !action) {
      return new Response("Missing fields", { status: 400 });
    }

    if (action === "follow") {
      await env.DB.prepare(
        "INSERT OR IGNORE INTO page_followers (page_id, user_id) VALUES (?, ?)"
      ).bind(page_id, user_id).run();

      await env.DB.prepare(
        "UPDATE pages SET followers = followers + 1 WHERE id = ?"
      ).bind(page_id).run();

      return new Response(JSON.stringify({ followed: true }), {
        headers: { "Content-Type": "application/json" }
      });
    }

    if (action === "unfollow") {
      await env.DB.prepare(
        "DELETE FROM page_followers WHERE page_id = ? AND user_id = ?"
      ).bind(page_id, user_id).run();

      await env.DB.prepare(
        "UPDATE pages SET followers = CASE WHEN followers > 0 THEN followers - 1 ELSE 0 END WHERE id = ?"
      ).bind(page_id).run();

      return new Response(JSON.stringify({ unfollowed: true }), {
        headers: { "Content-Type": "application/json" }
      });
    }

    return new Response("Invalid action", { status: 400 });
  } catch (e) {
    return new Response(JSON.stringify({ error: e.message }), { status: 500 });
  }
}