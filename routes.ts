import { Context, Router } from "./deps.ts";
import { define } from "./controller/userController.ts";
// import { Println } from "./utils/print.ts";

const router = new Router();


router
  .get(`/define/:word`, async (ctx: Context) => {
    try {
      const word: string = ctx.params.word!;
      await define(ctx, word);
      // Println("<g>you api works: </>", word)
      // console.log("")
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
