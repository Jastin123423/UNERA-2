export async function onRequest({ request, env }) {
  if (request.method !== "POST") return new Response("Method Not Allowed", { status: 405 });

  const data = await request.json();
  const username = data.username.trim();
  const email = data.email.trim().toLowerCase();
  const password = data.password.trim();

  // Insert user
  const result = await env.DB.prepare(
    "INSERT INTO users (username, email, password, joined_date) VALUES (?, ?, ?, ?)"
  ).bind(username, email, password, new Date().toISOString()).run();

  // Fetch the inserted user
  const { results } = await env.DB.prepare(
    "SELECT id, username, email FROM users WHERE id = ?"
  ).bind(result.meta.last_row_id).all();

  return new Response(JSON.stringify({
    success: true,
    user: results[0]
  }), { headers: { "Content-Type": "application/json" } });
}
