
export async function onRequest({ request, env }) {
  if (request.method === "GET") {
    try {
      const { results } = await env.DB.prepare("SELECT * FROM users").all();
      return new Response(JSON.stringify(results), { headers: { "Content-Type": "application/json" } });
    } catch (e) {
      return new Response(JSON.stringify({ error: e.message }), { status: 500 });
    }
  }

  if (request.method === "POST") {
    const { pathname } = new URL(request.url);
    const data = await request.json();

    try {
        // SIGNUP
        if (pathname.endsWith("/signup")) {
          const joinedDate = new Date().toISOString();
          const { success } = await env.DB.prepare(
            "INSERT INTO users (username, email, password, joined_date) VALUES (?, ?, ?, ?)"
          ).bind(data.username, data.email, data.password, joinedDate).run();

          if (!success) throw new Error("Failed to create user");

          return new Response(JSON.stringify({ success: true }), {
            headers: { "Content-Type": "application/json" }
          });
        }

        // LOGIN
        if (pathname.endsWith("/login")) {
          const { results } = await env.DB.prepare(
            "SELECT * FROM users WHERE email = ? AND password = ?"
          ).bind(data.email, data.password).all();

          const user = results[0];
          if (!user) {
             return new Response(JSON.stringify({ error: "Invalid credentials" }), { status: 401 });
          }

          return new Response(JSON.stringify({ user }), {
            headers: { "Content-Type": "application/json" }
          });
        }
    } catch (e) {
        return new Response(JSON.stringify({ error: e.message }), { status: 500 });
    }
  }

  return new Response("Not allowed", { status: 405 });
}
