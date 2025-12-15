export async function onRequest({ request, env }) {
  if (request.method !== "POST") {
    return new Response("Method Not Allowed", { status: 405 });
  }

  const data = await request.json();

  if (!data.email || !data.password) {
    return new Response(
      JSON.stringify({ error: "Email and password required" }),
      { status: 400 }
    );
  }

  const email = String(data.email).trim().toLowerCase();
  const password = String(data.password).trim();

  const { results } = await env.DB.prepare(
    "SELECT id, username, email FROM users WHERE email = ? AND password = ?"
  ).bind(email, password).all();

  if (!results.length) {
    return new Response(
      JSON.stringify({ error: "Invalid credentials" }),
      { status: 401 }
    );
  }

  return new Response(
    JSON.stringify({ success: true, user: results[0] }),
    { headers: { "Content-Type": "application/json" } }
  );
}
