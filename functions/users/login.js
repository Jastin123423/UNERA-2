const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type",
};

export async function onRequest({ request, env }) {
  if (request.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  if (request.method !== "POST") {
    return new Response("Method Not Allowed", {
      status: 405,
      headers: corsHeaders,
    });
  }

  const data = await request.json();

  const email = String(data.email).trim().toLowerCase();
  const password = String(data.password).trim();

  const { results } = await env.DB.prepare(
    "SELECT id, username, email FROM users WHERE email = ? AND password = ?"
  ).bind(email, password).all();

  if (!results.length) {
    return new Response(
      JSON.stringify({ error: "Invalid credentials" }),
      { status: 401, headers: corsHeaders }
    );
  }

  return new Response(
    JSON.stringify({ success: true, user: results[0] }),
    { headers: { ...corsHeaders, "Content-Type": "application/json" } }
  );
}
