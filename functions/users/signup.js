
export async function onRequest({ request, env }) {
  if (request.method !== "POST") {
    return new Response("Method Not Allowed", { status: 405 });
  }

  const { username, email, password } = await request.json();

  const result = await env.DB.prepare(
    "INSERT INTO users (username, email, password, joined_date) VALUES (?, ?, ?, ?)"
  ).bind(
    username,
    email,
    password,
    new Date().toISOString()
  ).run();

  return new Response(JSON.stringify({
    success: true,
    user_id: result.meta.last_row_id
  }), {
    headers: { "Content-Type": "application/json" }
  });
}
