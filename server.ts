import "@std/dotenv/load";
import { Application, Context } from "./deps.ts";
import { NewResponse } from "./utils/responseHandler.ts";
import router from "./routes.ts";
import { Println } from "./utils/print.ts";

const env = Deno.env.toObject();
const PORT = Number(env.PORT) || 3000;
const HOST = env.HOST || "0.0.0.0"; // Using "0.0.0.0" to allow external access

const app = new Application();

// main end point
if (import.meta.main) {
  // Middleware for routing
  app.use(router.routes());
  app.use(router.allowedMethods());

  // routes not found
  app.use((ctx: Context) => NewResponse(ctx, 404, "Route not Found"));

  Println(`<g>Server running on: </>http://${HOST}:${PORT}`);

  // Listen on host and port separately
  await app.listen({ hostname: HOST, port: PORT });
}
