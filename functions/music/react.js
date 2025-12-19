export async function onRequest({ request, env }) {
  if (request.method !== "POST") {
    return new Response(
      JSON.stringify({ error: "Method Not Allowed" }),
      { status: 405, headers: { "Content-Type": "application/json" } }
    );
  }

  try {
    const { music_id, user_id } = await request.json();

    if (!music_id || !user_id) {
      return new Response(
        JSON.stringify({ error: "Missing fields: music_id and user_id are required" }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }

    // Check if user already liked this music
    const { results } = await env.DB.prepare(`
      SELECT * FROM music_reactions WHERE music_id = ? AND user_id = ?
    `).bind(music_id, user_id).all();

    if (results.length > 0) {
      // Already liked → remove like (toggle off)
      await env.DB.prepare(`
        DELETE FROM music_reactions WHERE music_id = ? AND user_id = ?
      `).bind(music_id, user_id).run();

      return new Response(
        JSON.stringify({ success: true, liked: false }),
        { headers: { "Content-Type": "application/json" } }
      );
    } else {
      // Not liked → add like (toggle on)
      await env.DB.prepare(`
        INSERT INTO music_reactions (music_id, user_id, emoji)
        VALUES (?, ?, '❤️')
      `).bind(music_id, user_id).run();

      return new Response(
        JSON.stringify({ success: true, liked: true, emoji: "❤️" }),
        { headers: { "Content-Type": "application/json" } }
      );
    }
  } catch (err) {
    return new Response(
      JSON.stringify({ error: "Database error", details: err.message }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
}
