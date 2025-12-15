
export async function onRequest({ request, env }) {
  if (request.method !== "POST") {
    return new Response("Method Not Allowed", { status: 405 });
  }

  const { email, password } = await request.json();

  const { results } = await env.DB.prepare(
    "SELECT id, username, email FROM users WHERE email = ? AND password = ?"
  ).bind(email, password).all();

  if (!results.length) {
    return new Response(JSON.stringify({ error: "Invalid credentials" }), {
      status: 401
    });
  }

  return new Response(JSON.stringify({ user: results[0] }), {
    headers: { "Content-Type": "application/json" }
  });
}
