import { Context, Router } from "./deps.ts"; // Importing Context and Router
import { define, exampledef } from "./controller/userController.ts";

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
  .get("/example", async (ctx: Context) => {
    try {
      exampledef(ctx);
    } catch (e) {
      ctx.response.status = 500;
      ctx.response.body = { message: "Internal Server Error" };
    }
  });

export default router;
