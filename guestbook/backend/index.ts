import { serve } from "@hono/node-server";
import type { ServerType } from "@hono/node-server";
import { Hono } from "hono";
import { serveStatic } from "@hono/node-server/serve-static";

import { setupDb, client } from "./setupDb";

const app = new Hono();
const PORT = process.env.PORT ? Number(process.env.PORT) : 3000;

let server: ServerType;

const initServer = async () => {
  try {
    await setupDb();

    // serve static frontend files (requires /dist to be populated)
    app.get("/", serveStatic({ path: "./dist/frontend/index.html" })); // index.html
    app.use("/*", serveStatic({ root: "./dist/frontend" })); // the JS...

    // GET all messages (limit to 5 eventually)
    app.get("/api/messages", async (c) => {
      const res = await client.query(
        "SELECT message, timestamp FROM messages ORDER BY timestamp DESC LIMIT 5"
      );
      return c.json({ messages: res.rows });
    });

    // POST a message
    app.post("/api/message", async (c) => {
      const { message } = await c.req.json();
      await client.query("INSERT INTO messages (message) VALUES ($1)", [
        message,
      ]);
      return c.json({ status: "success 111" });
    });

    // App setup
    console.log(`Server is running on port ${PORT}`);

    server = serve({
      fetch: app.fetch,
      port: PORT,
    });
  } catch (error) {
    console.error("Server Error", error);
    if (client) await client.end();
    if (server) server.close();
    process.exit(1);
  }
};

await initServer();
