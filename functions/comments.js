
export async function onRequest({ request, env }) {
  if (request.method === "POST") {
    try {
      const d = await request.json();
      const timestamp = Date.now(); 
      await env.DB.prepare(
        "INSERT INTO comments (post_id, user_id, content, created_at) VALUES (?, ?, ?, ?)"
      ).bind(d.post_id, d.user_id, d.content, timestamp).run();

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
