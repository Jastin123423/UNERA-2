
export async function onRequest({ request, env }) {
  if (request.method !== "POST") {
    return new Response("Method Not Allowed", { status: 405 });
  }

  const { group_id, user_id } = await request.json();

  await env.DB.prepare(
    "DELETE FROM group_members WHERE group_id = ? AND user_id = ?"
  ).bind(group_id, user_id).run();

  return new Response(JSON.stringify({ left: true }), {
    headers: { "Content-Type": "application/json" }
  });
}
