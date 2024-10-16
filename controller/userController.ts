import { Context } from "../deps.ts";
import { CleanDefinition } from "../service/userService.ts";
import { NewResponse } from "../utils/responseHandler.ts";

/**
 * Handles the request to fetch and return dictionary definitions and pronunciations for a specified word.
 *
 * This function utilizes the `CleanDefinition` service to retrieve both fast definitions and APA pronunciations
 * for the given word. It then sends a standardized JSON response containing the results.
 *
 * @param {Context} ctx - The Oak context object, which provides information about the request and response.
 * @param {string} word - The word for which definitions and pronunciations are to be fetched.
 * @returns {Promise<void>} - A promise that resolves when the response has been sent.
 *                            If an error occurs, an error message is sent instead.
 *
 * @example
 * // Example of how to use the define function in an Oak router
 * router.get('/define/:word', async (ctx) => {
 *   const word = ctx.params.word;
 *   await define(ctx, word);
 * });
 */
export async function define(ctx: Context, word: string) {
  // Call the CleanDefinition function to get the definition and APA data
  const cleanedData = await CleanDefinition(ctx, word);

  // If no data was returned (error case), handle it
  if (!cleanedData) {
    return NewResponse(ctx, 500, `Error fetching data for the word: ${word}`);
  }

  // Destructure DEFINE and APA from the cleaned data
  const { DEFINE, APA } = cleanedData;

  // Send the response with the fetched definition and APA data
  return NewResponse(
    ctx,
    200,
    `Definitions and pronunciations for the word: ${word}`,
    {
      DEFINE, // Include the fast definitions
      APA, // Include the APA pronunciations
    },
  );
}
