import { Context, Router } from "./deps.ts"; // Importing Context and Router
import { define } from "./controller/userController.ts";

const router = new Router();

router
  .get(`/define/:word`, async (ctx: Context & { params: { word: string } }) => {
    try {
      const word: string = ctx.params.word!; // Assert that word is present
      await define(ctx, word);
    } catch (err) {
      console.error("Error occurred:", err);
      ctx.response.status = 500;
      ctx.response.body = { message: "Internal Server Error" };
    }
  })
  .get("/api/v1/example", () => {
    throw new Error("Something went wrong"); // This will be caught by the ErrorHandler middleware
  });

export default router;
