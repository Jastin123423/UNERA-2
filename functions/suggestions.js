export async function onRequest({ request, env }) {
  if (request.method !== "GET") {
    return new Response("Method Not Allowed", { status: 405 });
  }

  const userId = new URL(request.url).searchParams.get("user_id");
  if (!userId) {
    return new Response(JSON.stringify({ error: "Missing user_id" }), { status: 400 });
  }

  try {
    const { results } = await env.DB.prepare(`
      SELECT 
        u.id,
        u.username,
        u.avatar_url,
        COUNT(*) AS mutuals
      FROM follows f1
      JOIN follows f2 ON f1.following_id = f2.follower_id
      JOIN users u ON u.id = f2.following_id
      WHERE f1.follower_id = ?
        AND u.id != ?
        AND u.id NOT IN (
          SELECT following_id FROM follows WHERE follower_id = ?
        )
      GROUP BY u.id
      ORDER BY mutuals DESC
      LIMIT 10
    `).bind(userId, userId, userId).all();

    return new Response(JSON.stringify(results), {
      headers: { "Content-Type": "application/json" }
    });
  } catch (e) {
    return new Response(
      JSON.stringify({ error: e.message }),
      { status: 500 }
    );
  }
}
