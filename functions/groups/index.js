
export async function onRequest({ request, env }) {

  // ===== GET ALL GROUPS =====
  if (request.method === "GET") {
    const { results } = await env.DB.prepare(
      "SELECT * FROM groups ORDER BY created_at DESC"
    ).all();

    return new Response(JSON.stringify(results), {
      headers: { "Content-Type": "application/json" }
    });
  }

  // ===== CREATE GROUP =====
  if (request.method === "POST") {
    const { name, description, creator_id } = await request.json();

    if (!name || !creator_id) {
      return new Response("Missing fields", { status: 400 });
    }

    const result = await env.DB.prepare(
      "INSERT INTO groups (name, description, creator_id) VALUES (?, ?, ?)"
    ).bind(name, description || null, creator_id).run();

    // Auto-add creator as admin
    await env.DB.prepare(
      "INSERT INTO group_members (group_id, user_id, role) VALUES (?, ?, 'admin')"
    ).bind(result.meta.last_row_id, creator_id).run();

    return new Response(JSON.stringify({
      success: true,
      group_id: result.meta.last_row_id
    }), { headers: { "Content-Type": "application/json" } });
  }

  return new Response("Method Not Allowed", { status: 405 });
}
