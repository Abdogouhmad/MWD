import { Context } from "../deps.ts";

/**
 * Sends a standardized JSON response.
 * @param {Context} ctx - The Oak context object.
 * @param {number} status - The HTTP status code to send.
 * @param {string} msg - The message to include in the response.
 * @param {object} [data] - Optional additional data to include in the response.
 */
export function NewResponse(
  ctx: Context,
  status: number,
  msg: string,
  data?: object,
) {
  ctx.response.status = status;

  // Construct the response body
  ctx.response.body = {
    msg,
    ...(data && { data }), // Include data only if it is provided
  };
}

export async function ErrorHandler(ctx: Context, next: () => Promise<void>) {
  try {
    await next();
  } catch (err) {
    ctx.response.status = 500;
    if (err instanceof Error) {
      ctx.response.body = { msg: err.message };
    } else {
      ctx.response.body = { msg: "An unknown error occurred" };
    }
  }
}

export async function CheckVersion(
  ArrayVersion: string[],
  Version: string,
  ctx: Context,
  next: (ctx: Context) => Promise<void>,
) {
  if (!ArrayVersion.includes(Version)) {
    NewResponse(ctx, 400, "Version is outdated or not released");
    return;
  }

  // Proceed to the next function if the version is valid
  await next(ctx);
}
