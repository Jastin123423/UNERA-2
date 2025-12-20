export async function onRequest({ request, env }) {
  if (request.method !== "POST") {
    return new Response("Method Not Allowed", { status: 405 });
  }

  try {
    const { music_id, user_id, emoji } = await request.json();

    if (!music_id || !user_id || !emoji) {
      return new Response("Missing fields", { status: 400 });
    }

    // Insert or update reaction
    // Requires a UNIQUE constraint on (music_id, user_id) in the music_reactions table
    await env.DB.prepare(`
      INSERT INTO music_reactions (music_id, user_id, emoji)
      VALUES (?, ?, ?)
      ON CONFLICT(music_id, user_id)
      DO UPDATE SET emoji = excluded.emoji
    `).bind(music_id, user_id, emoji).run();

    return new Response(JSON.stringify({ 
      success: true,
      reacted: true, 
      emoji 
    }), {
      headers: { "Content-Type": "application/json" }
    });
  } catch (e) {
    return new Response(JSON.stringify({ error: e.message }), { status: 500 });
  }
}