import { compare } from "bcryptjs";

export async function onRequest({ request, env }) {
  try {
    const { email, password } = await request.json();

    // 1. Validate input
    if (!email || !password) {
      return new Response(JSON.stringify({
        error: "Email and password are required"
      }), { status: 400 });
    }

    // 2. Find user
    const user = await env.DB.prepare(`
      SELECT id, username, email, password
      FROM users
      WHERE email = ?
    `).bind(email).first();

    if (!user) {
      return new Response(JSON.stringify({
        error: "Invalid email or password"
      }), { status: 401 });
    }

    // 3. Compare password
    const isValid = await compare(password, user.password);

    if (!isValid) {
      return new Response(JSON.stringify({
        error: "Invalid email or password"
      }), { status: 401 });
    }

    // 4. Success
    return new Response(JSON.stringify({
      success: true,
      user: {
        id: user.id,
        username: user.username,
        email: user.email
      }
    }), {
      headers: { "Content-Type": "application/json" }
    });

  } catch (err) {
    return new Response(JSON.stringify({
      error: "Login failed",
      message: err.message
    }), { status: 500 });
  }
}
