// ===== Pages Function: Route requests safely to Durable Object =====
export async function onRequest({ request, env }) {
  // 🔒 SAFETY CHECK (prevents crashes)
  if (!env.LIVE_FEED_DO) {
    return new Response(
      JSON.stringify({ error: "Live feed not available" }),
      { status: 503, headers: { "Content-Type": "application/json" } }
    );
  }

  const id = env.LIVE_FEED_DO.idFromName("global");
  const stub = env.LIVE_FEED_DO.get(id);

  // Forward request to DO
  return stub.fetch(request);
}

// ===== Durable Object Class =====
export class LiveFeed {
  constructor(state) {
    this.state = state;
    this.clients = new Set();
  }

  async fetch(request) {
    const upgrade = request.headers.get("Upgrade");

    // ===== WebSocket connection =====
    if (upgrade && upgrade.toLowerCase() === "websocket") {
      const pair = new WebSocketPair();
      const client = pair[0];
      const server = pair[1];

      this.acceptWebSocket(server);

      return new Response(null, {
        status: 101,
        webSocket: client
      });
    }

    const url = new URL(request.url);

    // ===== Internal broadcast (from Pages Functions) =====
    if (request.method === "POST" && url.pathname === "/broadcast") {
      const msg = await request.text();

      for (const ws of this.clients) {
        try {
          ws.send(msg);
        } catch {
          this.clients.delete(ws);
        }
      }

      return new Response("Broadcasted", { status: 200 });
    }

    return new Response("Not found", { status: 404 });
  }

  acceptWebSocket(ws) {
    ws.accept();
    this.clients.add(ws);

    ws.addEventListener("close", () => {
      this.clients.delete(ws);
    });

    ws.addEventListener("error", () => {
      this.clients.delete(ws);
    });
  }
}
