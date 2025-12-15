
export async function onRequest({ request, env }) {
  const url = new URL(request.url);

  // ======================
  // GET: fetch reactions for a target
  // ======================
  if (request.method === "GET") {
    const target_id = url.searchParams.get("target_id");
    const target_type = url.searchParams.get("target_type"); // "post" or "comment"

    if (!target_id || !target_type) {
      return new Response(JSON.stringify({ error: "Missing target_id or target_type" }), { status: 400 });
    }

    try {
      const { results } = await env.DB.prepare(
        "SELECT like_type, COUNT(*) as count FROM likes WHERE target_id = ? AND target_type = ? GROUP BY like_type"
      ).bind(target_id, target_type).all();

      // Build a map: { "like": 10, "love": 5, ... }
      const reactions = {};
      results.forEach(r => { reactions[r.like_type || "like"] = r.count; });

      return new Response(JSON.stringify({ reactions }), {
        headers: { "Content-Type": "application/json" }
      });
    } catch (e) {
      return new Response(JSON.stringify({ error: e.message }), { status: 500 });
    }
  }

  // ======================
  // POST: toggle or switch reaction
  // ======================
  if (request.method === "POST") {
    try {
      const data = await request.json();
      const { user_id, target_id, target_type, like_type } = data;

      if (!user_id || !target_id || !target_type || !like_type) {
        return new Response(JSON.stringify({ error: "Missing required fields" }), { status: 400 });
      }

      // Check if user already reacted (any type)
      const { results } = await env.DB.prepare(
        "SELECT id, like_type FROM likes WHERE user_id = ? AND target_id = ? AND target_type = ?"
      ).bind(user_id, target_id, target_type).all();

      if (results.length > 0) {
        const existing = results[0];
        
        if (existing.like_type === like_type) {
          // Same reaction -> Toggle OFF (Remove)
          await env.DB.prepare("DELETE FROM likes WHERE id = ?").bind(existing.id).run();
          return new Response(JSON.stringify({ success: true, reacted: false, type: like_type }), {
            headers: { "Content-Type": "application/json" }
          });
        } else {
          // Different reaction -> Switch (Update)
          await env.DB.prepare("UPDATE likes SET like_type = ? WHERE id = ?").bind(like_type, existing.id).run();
          return new Response(JSON.stringify({ success: true, reacted: true, type: like_type }), {
            headers: { "Content-Type": "application/json" }
          });
        }
      }

      // Not reacted yet -> Insert
      await env.DB.prepare(
        "INSERT INTO likes (user_id, target_id, target_type, like_type) VALUES (?, ?, ?, ?)"
      ).bind(user_id, target_id, target_type, like_type).run();

      return new Response(JSON.stringify({ success: true, reacted: true, type: like_type }), {
        headers: { "Content-Type": "application/json" }
      });

    } catch (e) {
      return new Response(JSON.stringify({ error: e.message }), { status: 500 });
    }
  }

  return new Response("Method Not Allowed", { status: 405 });
}
