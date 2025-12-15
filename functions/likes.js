
export async function onRequest({ request, env }) {
  const url = new URL(request.url);

  // Helper: Try to add the missing column if it doesn't exist
  async function ensureLikeTypeColumn() {
    try {
      await env.DB.prepare("ALTER TABLE likes ADD COLUMN like_type TEXT DEFAULT 'like'").run();
    } catch (e) {
      // Ignore error if column already exists or other non-critical issue
      // Some SQLite versions might throw if it exists, others are silent
    }
  }

  // ======================
  // GET: fetch reactions for a target
  // ======================
  if (request.method === "GET") {
    const target_id = url.searchParams.get("target_id");
    const target_type = url.searchParams.get("target_type"); // "post" or "comment"

    if (!target_id || !target_type) {
      return new Response(JSON.stringify({ error: "Missing target_id or target_type" }), { status: 400 });
    }

    const fetchReactions = async () => {
        const { results } = await env.DB.prepare(
            "SELECT like_type, COUNT(*) as count FROM likes WHERE target_id = ? AND target_type = ? GROUP BY like_type"
        ).bind(target_id, target_type).all();

        // Build a map: { "like": 10, "love": 5, ... }
        const reactions = {};
        results.forEach(r => { reactions[r.like_type || "like"] = r.count; });
        return reactions;
    };

    try {
      const reactions = await fetchReactions();
      return new Response(JSON.stringify({ reactions }), {
        headers: { "Content-Type": "application/json" }
      });
    } catch (e) {
      // Self-heal: If column missing, add it and retry
      if (e.message && e.message.includes("no such column: like_type")) {
          try {
              await ensureLikeTypeColumn();
              const reactions = await fetchReactions();
              return new Response(JSON.stringify({ reactions }), {
                headers: { "Content-Type": "application/json" }
              });
          } catch (retryError) {
              return new Response(JSON.stringify({ error: retryError.message }), { status: 500 });
          }
      }
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

      const executeLogic = async () => {
          // Check if user already reacted (any type)
          const { results } = await env.DB.prepare(
            "SELECT id, like_type FROM likes WHERE user_id = ? AND target_id = ? AND target_type = ?"
          ).bind(user_id, target_id, target_type).all();

          if (results.length > 0) {
            const existing = results[0];
            
            if (existing.like_type === like_type) {
              // Same reaction -> Toggle OFF (Remove)
              await env.DB.prepare("DELETE FROM likes WHERE id = ?").bind(existing.id).run();
              return { success: true, reacted: false, type: like_type };
            } else {
              // Different reaction -> Switch (Update)
              await env.DB.prepare("UPDATE likes SET like_type = ? WHERE id = ?").bind(like_type, existing.id).run();
              return { success: true, reacted: true, type: like_type };
            }
          }

          // Not reacted yet -> Insert
          await env.DB.prepare(
            "INSERT INTO likes (user_id, target_id, target_type, like_type) VALUES (?, ?, ?, ?)"
          ).bind(user_id, target_id, target_type, like_type).run();

          return { success: true, reacted: true, type: like_type };
      };

      try {
        const responseData = await executeLogic();
        return new Response(JSON.stringify(responseData), {
            headers: { "Content-Type": "application/json" }
        });
      } catch (err) {
        // Self-heal: If column missing, add it and retry
        if (err.message && err.message.includes("no such column: like_type")) {
            await ensureLikeTypeColumn();
            const responseData = await executeLogic();
            return new Response(JSON.stringify(responseData), {
                headers: { "Content-Type": "application/json" }
            });
        }
        throw err;
      }

    } catch (e) {
      return new Response(JSON.stringify({ error: e.message }), { status: 500 });
    }
  }

  return new Response("Method Not Allowed", { status: 405 });
}
