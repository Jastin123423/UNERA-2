
export async function onRequest({ request, env }) {
  if (request.method === "POST") {
    try {
      const d = await request.json();
      // Check if already liked to toggle? For now, we assume simple insert as per prompt
      // In a real app, you'd likely DELETE if it exists or INSERT if not.
      await env.DB.prepare(
        "INSERT INTO likes (user_id, target_id, target_type) VALUES (?, ?, ?)"
      ).bind(d.user_id, d.target_id, d.target_type).run();

      return new Response(JSON.stringify({ success: true }), { headers: { "Content-Type": "application/json" } });
    } catch (e) {
      return new Response(JSON.stringify({ error: e.message }), { status: 500 });
    }
  }
  return new Response("Method not allowed", { status: 405 });
}
