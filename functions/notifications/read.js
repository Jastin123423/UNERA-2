
export async function onRequest({ request, env }) {
  // Allow POST (standard) or PATCH (often used for updates)
  if (request.method !== "POST" && request.method !== "PATCH") {
    return new Response("Method Not Allowed", { status: 405 });
  }

  try {
    const { user_id, notification_id } = await request.json();

    if (!user_id && !notification_id) {
        return new Response(JSON.stringify({ error: "Missing user_id or notification_id" }), { status: 400 });
    }

    // 1. Mark ALL notifications as read for a specific user
    if (user_id) {
        // We use 'read' column based on previous schema definitions
        await env.DB.prepare(
            "UPDATE notifications SET read = 1 WHERE user_id = ?"
        ).bind(user_id).run();
    } 
    // 2. Mark a SINGLE notification as read
    else if (notification_id) {
        await env.DB.prepare(
            "UPDATE notifications SET read = 1 WHERE id = ?"
        ).bind(notification_id).run();
    }

    return new Response(JSON.stringify({ success: true }), {
      headers: { "Content-Type": "application/json" }
    });

  } catch (e) {
    return new Response(JSON.stringify({ error: e.message }), { status: 500 });
  }
}
