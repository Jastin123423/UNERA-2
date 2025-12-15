
export async function onRequest({ request, env }) {
  if (request.method !== "POST") {
    return new Response("Method Not Allowed", { status: 405 });
  }

  try {
    const { notification_id, user_id, all } = await request.json();

    if (all && user_id) {
      // Mark all as read for user
      await env.DB.prepare("UPDATE notifications SET read = 1 WHERE user_id = ?").bind(user_id).run();
    } else if (notification_id) {
      // Mark specific notification
      await env.DB.prepare("UPDATE notifications SET read = 1 WHERE id = ?").bind(notification_id).run();
    } else {
        return new Response(JSON.stringify({ error: "Missing parameters" }), { status: 400 });
    }

    return new Response(JSON.stringify({ success: true }), {
      headers: { "Content-Type": "application/json" }
    });

  } catch (e) {
    return new Response(JSON.stringify({ error: e.message }), { status: 500 });
  }
}
