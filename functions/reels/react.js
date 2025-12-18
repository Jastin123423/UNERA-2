export async function onRequest({ request, env }) {
  if (request.method !== "POST") {
    return new Response("Method Not Allowed", { status: 405 });
  }

  try {
    const { reel_id, user_id, emoji } = await request.json();

    if (!reel_id || !user_id || !emoji) {
      return new Response("Missing fields", { status: 400 });
    }

    // Insert or update reaction
    // Note: requires a UNIQUE constraint on (reel_id, user_id) in the reel_reactions table
    await env.DB.prepare(`
      INSERT INTO reel_reactions (reel_id, user_id, emoji)
      VALUES (?, ?, ?)
      ON CONFLICT(reel_id, user_id)
      DO UPDATE SET emoji = excluded.emoji
    `).bind(reel_id, user_id, emoji).run();

    return new Response(JSON.stringify({
      success: true,
      reacted: true,
      emoji
    }), { headers: { "Content-Type": "application/json" } });
  } catch (e) {
    return new Response(JSON.stringify({ error: e.message }), { status: 500 });
  }
}