
export async function onRequest({ request, env }) {
  if (request.method !== "POST") {
    return new Response("Method Not Allowed", { status: 405 });
  }

  const { group_id, user_id } = await request.json();

  await env.DB.prepare(
    "INSERT OR IGNORE INTO group_members (group_id, user_id) VALUES (?, ?)"
  ).bind(group_id, user_id).run();

  return new Response(JSON.stringify({ joined: true }), {
    headers: { "Content-Type": "application/json" }
  });
}
