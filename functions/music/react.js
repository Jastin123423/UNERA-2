export async function onRequest({ request, env }) {
  const url = new URL(request.url);
  const music_id = url.searchParams.get("music_id");

  if (!music_id) {
    return new Response(
      JSON.stringify({ error: "Missing music_id" }),
      { status: 400, headers: { "Content-Type": "application/json" } }
    );
  }

  try {
    // Count likes (❤️) for this music track
    const { results: likesResult } = await env.DB.prepare(`
      SELECT COUNT(*) AS likes
      FROM music_reactions
      WHERE music_id = ?
    `).bind(music_id).all();

    const likes = likesResult[0]?.likes || 0;

    // Count comments if you have a music_comments table
    let comments = 0;
    try {
      const { results: commentsResult } = await env.DB.prepare(`
        SELECT COUNT(*) AS comments
        FROM music_comments
        WHERE music_id = ?
      `).bind(music_id).all();
      comments = commentsResult[0]?.comments || 0;
    } catch {
      // Table might not exist yet, default to 0
      comments = 0;
    }

    // Simple engagement score
    const engagement_score = likes * 1 + comments * 2;

    return new Response(
      JSON.stringify({
        music_id,
        likes,
        comments,
        engagement_score
      }),
      { headers: { "Content-Type": "application/json" } }
    );
  } catch (err) {
    return new Response(
      JSON.stringify({ error: "Database error", details: err.message }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
}
