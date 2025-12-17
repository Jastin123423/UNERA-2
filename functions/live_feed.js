
// Request Handler: Routes requests to the Durable Object
export async function onRequest({ request, env }) {
  const id = env.LIVE_FEED_DO.idFromName("global");
  const stub = env.LIVE_FEED_DO.get(id);
  return stub.fetch(request);
}

// Durable Object Class
export class LiveFeed {
  constructor(state, env) {
    this.state = state;
    this.clients = new Set();
  }

  async fetch(request) {
    // Handle WebSocket Upgrade
    if (request.headers.get("Upgrade") === "websocket") {
      const pair = new WebSocketPair();
      const [client, server] = Object.values(pair);
      
      await this.acceptWebSocket(server);
      return new Response(null, { status: 101, webSocket: client });
    }

    // Handle Broadcast Requests (internal from Worker/Function)
    if (request.method === "POST") {
      const msg = await request.text();
      
      // Broadcast to all connected clients
      for (const client of this.clients) {
        try {
          client.send(msg);
        } catch (err) {
          this.clients.delete(client);
        }
      }
      return new Response("Broadcasted");
    }

    return new Response("Invalid request", { status: 400 });
  }

  async acceptWebSocket(ws) {
    ws.accept();
    this.clients.add(ws);

    // Ping/Pong or basic message handling if needed
    ws.addEventListener("message", evt => {
      // Echo or handle client messages if necessary
    });

    ws.addEventListener("close", () => {
      this.clients.delete(ws);
    });
    
    ws.addEventListener("error", () => {
      this.clients.delete(ws);
    });
  }
}
