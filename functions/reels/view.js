export async function onRequest({ request, env }) {
  if (request.method !== "POST") {
    return new Response("Method Not Allowed", { status: 405 });
  }

  try {
    const { reel_id } = await request.json();

    if (!reel_id) {
      return new Response("Missing reel_id", { status: 400 });
    }

    await env.DB.prepare(
      "UPDATE reels SET views = views + 1 WHERE id = ?"
    ).bind(reel_id).run();

    return new Response(JSON.stringify({ viewed: true }), {
      headers: { "Content-Type": "application/json" }
    });
  } catch (e) {
    return new Response(JSON.stringify({ error: e.message }), { status: 500 });
  }
}