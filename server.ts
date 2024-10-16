import "@std/dotenv/load";
import { Application, Context } from "./deps.ts";
import { NewResponse } from "./utils/responseHandler.ts";
import router from "./routes.ts";
import { Println } from "./utils/print.ts";

const env = Deno.env.toObject();
const PORT = env.PORT || 3000;
const HOST = env.HOST || "localhost";

const app = new Application();

// main end point
if (import.meta.main) {
  // Middleware that catch error within you restapi
  // app.use(ErrorHandler);

  // Middleware for routing
  app.use(router.routes());
  app.use(router.allowedMethods());

  // routes not found
  app.use((ctx: Context) => NewResponse(ctx, 404, "Route not Found"));

  Println(`<g>Server running on: </>http://${HOST}:${PORT}`);
  await app.listen(`${HOST}:${PORT}`);
}
