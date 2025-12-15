export async function onRequest({ request, env }) {
  if (request.method !== "POST") {
    return new Response("Method Not Allowed", { status: 405 });
  }

  const { user_id } = await request.json();

  if (!user_id) {
    return new Response(JSON.stringify({ error: "Missing user_id" }), { status: 400 });
  }

  await env.DB.prepare(
    "UPDATE notifications SET is_read = 1 WHERE user_id = ?"
  ).bind(user_id).run();

  return new Response(JSON.stringify({ success: true }), {
    headers: { "Content-Type": "application/json" }
  });
}
