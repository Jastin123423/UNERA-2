export async function onRequest({ request, env }) {
  const url = new URL(request.url);
  const page_id = url.searchParams.get("page_id");

  if (!page_id) {
    return new Response("Missing page_id", { status: 400 });
  }

  // ===== GET PAGE POSTS =====
  if (request.method === "GET") {
    try {
      const { results } = await env.DB.prepare(
        "SELECT * FROM posts WHERE page_id = ? ORDER BY created_at DESC"
      ).bind(page_id).all();

      return new Response(JSON.stringify(results), {
        headers: { "Content-Type": "application/json" }
      });
    } catch (e) {
      return new Response(JSON.stringify({ error: e.message }), { status: 500 });
    }
  }

  return new Response("Method Not Allowed", { status: 405 });
}