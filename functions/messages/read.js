export async function onRequestPost({ request, env }) {
  const { sender_id, receiver_id } = await request.json();

  await env.DB.prepare(`
    UPDATE messages
    SET is_read = 1,
        read_at = CURRENT_TIMESTAMP
    WHERE sender_id = ?
      AND receiver_id = ?
      AND is_read = 0
  `).bind(sender_id, receiver_id).run();

  return new Response(
    JSON.stringify({ success: true }),
    { headers: { "Content-Type": "application/json" } }
  );
}