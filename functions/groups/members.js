
export async function onRequest({ request, env }) {
  const url = new URL(request.url);
  const group_id = url.searchParams.get("group_id");

  if (!group_id) {
    return new Response("Missing group_id", { status: 400 });
  }

  const { results } = await env.DB.prepare(`
    SELECT u.id, u.username, gm.role, gm.joined_at
    FROM group_members gm
    JOIN users u ON u.id = gm.user_id
    WHERE gm.group_id = ?
  `).bind(group_id).all();

  return new Response(JSON.stringify(results), {
    headers: { "Content-Type": "application/json" }
  });
}
