
export async function onRequest({ request, env }) {
  if (request.method !== "POST") {
    return new Response("Method Not Allowed", { status: 405 });
  }

  const data = await request.json();
  const email = data.email.trim().toLowerCase();
  const password = data.password.trim();

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
