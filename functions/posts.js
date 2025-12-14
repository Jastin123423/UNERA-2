
export async function onRequest({ request, env }) {
  // GET: Fetch posts
  if (request.method === "GET") {
    try {
      const { results } = await env.DB.prepare(
        "SELECT * FROM posts ORDER BY created_at DESC LIMIT 50"
      ).all();
      return new Response(JSON.stringify(results), { headers: { "Content-Type": "application/json" } });
    } catch (e) {
      return new Response(JSON.stringify({ error: e.message }), { status: 500 });
    }
  }

  // POST: Create post and broadcast
  if (request.method === "POST") {
    try {
      const data = await request.json();
      
      // 1. Insert into D1
      const { success } = await env.DB.prepare(
        "INSERT INTO posts (user_id, content, media_url, created_at) VALUES (?, ?, ?, ?)"
      ).bind(data.user_id, data.content, data.media_url, Date.now()).run();

      if (!success) throw new Error("Failed to insert post");

      // Construct the post object to broadcast (simulating what the DB would return or what frontend needs)
      const newPost = {
        id: Date.now(), // In a real app, get ID from DB insert result
        user_id: data.user_id,
        content: data.content,
        media_url: data.media_url,
        created_at: Date.now(),
        // Add default fields expected by frontend
        reactions: [],
        comments: [],
        shares: 0
      };

      // 2. Broadcast via Durable Object
      const id = env.LIVE_FEED_DO.idFromName("global"); // Singleton DO
      const stub = env.LIVE_FEED_DO.get(id);

      // Fire and forget fetch to DO to broadcast
      stub.fetch("https://dummy.url/broadcast", { 
        method: "POST", 
        body: JSON.stringify({ type: "new_post", data: newPost }) 
      });

      return new Response(JSON.stringify({ success: true, post: newPost }), { headers: { "Content-Type": "application/json" } });
    } catch (e) {
      return new Response(JSON.stringify({ error: e.message }), { status: 500 });
    }
  }

  return new Response("Method not allowed", { status: 405 });
}
