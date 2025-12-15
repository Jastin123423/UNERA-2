
export async function onRequest({ request, env }) {
  const url = new URL(request.url);
  const user_id = url.searchParams.get("user_id");

  if (!user_id) {
    return new Response(JSON.stringify({ error: "user_id required" }), { status: 400 });
  }

  try {
    // Note: Using 'read' column based on existing schema
    const { results } = await env.DB.prepare(
      "SELECT COUNT(*) as count FROM notifications WHERE user_id = ? AND read = 0"
    ).bind(user_id).all();

    return new Response(JSON.stringify({
      unread: results[0].count
    }), {
      headers: { "Content-Type": "application/json" }
    });
  } catch (e) {
    return new Response(JSON.stringify({ error: e.message }), { status: 500 });
  }
}
