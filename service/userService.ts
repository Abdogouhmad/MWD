import { NewResponse } from "../utils/responseHandler.ts";
import { Println } from "../utils/print.ts";
import { Context } from "../deps.ts";
import { WordDictionary } from "../utils/dict_pattern.ts";
import { CleanFuncReturn } from "../type.d.ts";

/**
 * Function that cleans the dictionary definition by extracting relevant APA and fast definitions for a word.
 *
 * @param {Context} ctx - The Oak context object.
 * @param {string} word - The word to be searched for within the online dictionary.
 * @returns {Promise<CleanFuncReturn | undefined>}
 * - An object containing both the fast definitions and the APA pronunciations or `undefined` if an error occurs.
 */
export async function CleanDefinition(
  ctx: Context,
  word: string,
): Promise<CleanFuncReturn | undefined> {
  // Prepare the variables for the API URL and token
  const URL = Deno.env.get("MW_L_URL");
  const TOKEN = Deno.env.get("MW_L_KEY");

  if (!URL || !TOKEN) {
    NewResponse(ctx, 500, "API URL or TOKEN not configured.");
    return;
  }

  const api = `${URL}/${word}?key=${TOKEN}`;

  try {
    // Fetch the API
    const response = await fetch(api);
    Println(
      `<y>Fetched API:</> <g>${api}</>, <y>Status:</> <g>${response.status}</>`,
    );

    // Handle non-successful response status
    if (!response.ok) {
      NewResponse(
        ctx,
        response.status,
        `Error fetching API: ${response.statusText}`,
      );
      return undefined;
    }

    // Parse the response data into JSON
    const data = await response.json();

    // Call the class for cleaning the dataset
    const CData = new WordDictionary(data);

    // Extract fast definitions and APA (pronunciation)
    const DEFINE = CData.GetFastDefinitions(word);
    const APA = CData.GetAPA(word);

    // Return both DEFINE and APA as an object
    return {
      DEFINE,
      APA,
    };
  } catch (e) {
    console.error("API fetch error:", e);
    NewResponse(ctx, 500, `Couldn't fetch the API: ${e.message}`);
  }
}
