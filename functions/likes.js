
export async function onRequest({ request, env }) {
  const url = new URL(request.url);

  // Helper: Self-heal database schema for both likes and notifications
  async function ensureSchema() {
    // Likes table columns
    try { await env.DB.prepare("ALTER TABLE likes ADD COLUMN like_type TEXT DEFAULT 'like'").run(); } catch (e) {}
    
    // Notifications table columns
    try { await env.DB.prepare("ALTER TABLE notifications ADD COLUMN sender_id INTEGER").run(); } catch (e) {}
    try { await env.DB.prepare("ALTER TABLE notifications ADD COLUMN post_id INTEGER").run(); } catch (e) {}
    try { await env.DB.prepare("ALTER TABLE notifications ADD COLUMN created_at INTEGER").run(); } catch (e) {}
    try { await env.DB.prepare("ALTER TABLE notifications ADD COLUMN read INTEGER DEFAULT 0").run(); } catch (e) {}
  }

  // ======================
  // GET: fetch reactions for a target
  // ======================
  if (request.method === "GET") {
    const target_id = url.searchParams.get("target_id");
    const target_type = url.searchParams.get("target_type");

    if (!target_id || !target_type) {
      return new Response(JSON.stringify({ error: "Missing target_id or target_type" }), { status: 400 });
    }

    const fetchReactions = async () => {
        const { results } = await env.DB.prepare(
            "SELECT like_type, COUNT(*) as count FROM likes WHERE target_id = ? AND target_type = ? GROUP BY like_type"
        ).bind(target_id, target_type).all();

        const reactions = {};
        results.forEach(r => { reactions[r.like_type || "like"] = r.count; });
        return reactions;
    };

    try {
      const reactions = await fetchReactions();
      return new Response(JSON.stringify({ reactions }), { headers: { "Content-Type": "application/json" } });
    } catch (e) {
      if (e.message && e.message.includes("no such column")) {
          await ensureSchema();
          try {
            const reactions = await fetchReactions();
            return new Response(JSON.stringify({ reactions }), { headers: { "Content-Type": "application/json" } });
          } catch(err) {
            return new Response(JSON.stringify({ error: err.message }), { status: 500 });
          }
      }
      return new Response(JSON.stringify({ error: e.message }), { status: 500 });
    }
  }

  // ======================
  // POST: toggle reaction & notify
  // ======================
  if (request.method === "POST") {
    try {
      const data = await request.json();
      const { user_id, target_id, target_type, like_type } = data;

      if (!user_id || !target_id || !target_type || !like_type) {
        return new Response(JSON.stringify({ error: "Missing required fields" }), { status: 400 });
      }

      const executeLogic = async () => {
          // Check existing reaction
          const { results } = await env.DB.prepare(
            "SELECT id, like_type FROM likes WHERE user_id = ? AND target_id = ? AND target_type = ?"
          ).bind(user_id, target_id, target_type).all();

          if (results.length > 0) {
            const existing = results[0];
            if (existing.like_type === like_type) {
              // Toggle OFF (Remove)
              await env.DB.prepare("DELETE FROM likes WHERE id = ?").bind(existing.id).run();
              return { success: true, reacted: false, type: like_type };
            } else {
              // Switch Reaction
              await env.DB.prepare("UPDATE likes SET like_type = ? WHERE id = ?").bind(like_type, existing.id).run();
              return { success: true, reacted: true, type: like_type };
            }
          }

          // Insert New Reaction
          await env.DB.prepare(
            "INSERT INTO likes (user_id, target_id, target_type, like_type) VALUES (?, ?, ?, ?)"
          ).bind(user_id, target_id, target_type, like_type).run();

          return { success: true, reacted: true, type: like_type };
      };

      let responseData;
      try {
        responseData = await executeLogic();
      } catch (err) {
        if (err.message && err.message.includes("no such column")) {
            await ensureSchema();
            responseData = await executeLogic();
        } else {
            throw err;
        }
      }

      // --- NOTIFICATION LOGIC ---
      if (responseData.reacted && target_type === 'post') {
          try {
              // 1. Get Post Author
              const post = await env.DB.prepare("SELECT user_id FROM posts WHERE id = ?").bind(target_id).first();
              
              // 2. Create Notification if author exists and is not the liker
              if (post && post.user_id !== user_id) {
                  const content = `reacted ${like_type} to your post.`;
                  const now = Date.now();
                  
                  const insertNotif = async () => {
                      await env.DB.prepare(
                          "INSERT INTO notifications (user_id, sender_id, type, content, post_id, created_at, read) VALUES (?, ?, 'like', ?, ?, ?, 0)"
                      ).bind(post.user_id, user_id, content, target_id, now).run();
                  };

                  try {
                      await insertNotif();
                  } catch (notifErr) {
                      // Retry once if column missing
                      if (notifErr.message.includes("no such column")) {
                          await ensureSchema();
                          await insertNotif();
                      } else {
                          console.error("Notification insert error:", notifErr);
                      }
                  }
              }
          } catch (e) {
              console.error("Failed to process notification:", e);
          }
      }
      // --------------------------

      return new Response(JSON.stringify(responseData), { headers: { "Content-Type": "application/json" } });

    } catch (e) {
      return new Response(JSON.stringify({ error: e.message }), { status: 500 });
    }
  }

  return new Response("Method Not Allowed", { status: 405 });
}
