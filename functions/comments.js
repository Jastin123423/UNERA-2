
export async function onRequest({ request, env }) {
  // Helper to ensure notification schema
  async function ensureNotifSchema() {
      try { await env.DB.prepare("ALTER TABLE notifications ADD COLUMN sender_id INTEGER").run(); } catch (e) {}
      try { await env.DB.prepare("ALTER TABLE notifications ADD COLUMN post_id INTEGER").run(); } catch (e) {}
      try { await env.DB.prepare("ALTER TABLE notifications ADD COLUMN created_at INTEGER").run(); } catch (e) {}
      try { await env.DB.prepare("ALTER TABLE notifications ADD COLUMN read INTEGER DEFAULT 0").run(); } catch (e) {}
  }

  if (request.method === "POST") {
    try {
      const d = await request.json();
      const timestamp = Date.now(); 
      
      // 1. Insert Comment
      const res = await env.DB.prepare(
        "INSERT INTO comments (post_id, user_id, content, created_at) VALUES (?, ?, ?, ?)"
      ).bind(d.post_id, d.user_id, d.content, timestamp).run();

      // 2. Notification Logic
      try {
          await ensureNotifSchema();
          // Get Post Owner
          const post = await env.DB.prepare("SELECT user_id FROM posts WHERE id = ?").bind(d.post_id).first();
          
          if (post && post.user_id !== d.user_id) {
              const notifContent = `commented: "${d.content.substring(0, 20)}${d.content.length > 20 ? '...' : ''}"`;
              
              await env.DB.prepare(
                  "INSERT INTO notifications (user_id, sender_id, type, content, post_id, created_at, read) VALUES (?, ?, 'comment', ?, ?, ?, 0)"
              ).bind(post.user_id, d.user_id, notifContent, d.post_id, timestamp).run();

              // 3. Broadcast to Real-time Feed
              const doId = env.LIVE_FEED_DO.idFromName("global");
              const stub = env.LIVE_FEED_DO.get(doId);
              await stub.fetch("https://dummy.url/broadcast", {
                method: "POST",
                body: JSON.stringify({
                    type: "notification",
                    toUserId: post.user_id,
                    data: {
                        id: Date.now(), // approximation
                        userId: post.user_id,
                        senderId: d.user_id,
                        type: 'comment',
                        content: notifContent,
                        postId: d.post_id,
                        timestamp: timestamp,
                        read: false
                    }
                })
              });
          }
      } catch (notifErr) {
          console.error("Notification failed", notifErr);
      }

      return new Response(JSON.stringify({ success: true, timestamp }), { headers: { "Content-Type": "application/json" } });
    } catch (e) {
      return new Response(JSON.stringify({ error: e.message }), { status: 500 });
    }
  }

  if (request.method === "GET") {
    try {
      const postId = new URL(request.url).searchParams.get("post_id");
      if (!postId) {
         return new Response(JSON.stringify({ error: "Post ID required" }), { status: 400 });
      }
      
      const { results } = await env.DB.prepare(
        "SELECT * FROM comments WHERE post_id = ? ORDER BY created_at ASC"
      ).bind(postId).all();

      return new Response(JSON.stringify(results), { headers: { "Content-Type": "application/json" } });
    } catch (e) {
      return new Response(JSON.stringify({ error: e.message }), { status: 500 });
    }
  }
  return new Response("Method not allowed", { status: 405 });
}
