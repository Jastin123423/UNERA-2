export async function onRequest({ request, env }) {
  if (request.method !== "GET") {
    return new Response("Method Not Allowed", { status: 405 });
  }

  const url = new URL(request.url);
  const reel_id = url.searchParams.get("reel_id");

  if (!reel_id) {
    return new Response("Missing reel_id", { status: 400 });
  }

  try {
    // Views
    const views = await env.DB.prepare(
      "SELECT views FROM reels WHERE id = ?"
    ).bind(reel_id).first();

    // Reaction counts
    const reactions = await env.DB.prepare(`
      SELECT emoji, COUNT(*) as count
      FROM reel_reactions
      WHERE reel_id = ?
      GROUP BY emoji
    `).bind(reel_id).all();

    // Total reactions count
    const totalReactions = await env.DB.prepare(
      "SELECT COUNT(*) as count FROM reel_reactions WHERE reel_id = ?"
    ).bind(reel_id).first();

    // Comments count
    const commentsCount = await env.DB.prepare(
      "SELECT COUNT(*) as count FROM reel_comments WHERE reel_id = ?"
    ).bind(reel_id).first();

    // Engagement score (simple but effective weighting)
    const engagement =
      (views?.views || 0) +
      (totalReactions?.count || 0) * 2 +
      (commentsCount?.count || 0) * 3;

    return new Response(JSON.stringify({
      reel_id,
      views: views?.views || 0,
      reactions: reactions.results,
      comments: commentsCount?.count || 0,
      engagement_score: engagement
    }), {
      headers: { "Content-Type": "application/json" }
    });
  } catch (e) {
    return new Response(JSON.stringify({ error: e.message }), { status: 500 });
  }
}