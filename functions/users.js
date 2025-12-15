
export async function onRequest({ request, env }) {
  const url = new URL(request.url);
  
  if (request.method === "GET") {
    try {
      const { results } = await env.DB.prepare("SELECT * FROM users").all();
      return new Response(JSON.stringify(results), { headers: { "Content-Type": "application/json" } });
    } catch (e) {
      return new Response(JSON.stringify({ error: e.message }), { status: 500 });
    }
  }

  if (request.method === "POST") {
    const data = await request.json();

    try {
        // SIGNUP
        if (url.pathname.endsWith("/signup")) {
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
        if (url.pathname.endsWith("/login")) {
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

        // FIND USER (FORGOT PASSWORD)
        if (url.pathname.endsWith("/find")) {
            const { results } = await env.DB.prepare(
                "SELECT id, username, email, profile_url FROM users WHERE email = ?"
            ).bind(data.email).all();

            const user = results[0];
            if (!user) {
                return new Response(JSON.stringify({ error: "User not found" }), { status: 404 });
            }
            return new Response(JSON.stringify({ success: true, user }), {
                headers: { "Content-Type": "application/json" }
            });
        }

        // RESET PASSWORD
        if (url.pathname.endsWith("/reset-password")) {
            const { success } = await env.DB.prepare(
                "UPDATE users SET password = ? WHERE email = ?"
            ).bind(data.newPassword, data.email).run();

            if (!success) throw new Error("Failed to update password");

            return new Response(JSON.stringify({ success: true }), {
                headers: { "Content-Type": "application/json" }
            });
        }

    } catch (e) {
        return new Response(JSON.stringify({ error: e.message }), { status: 500 });
    }
  }

  return new Response("Not allowed", { status: 405 });
}
