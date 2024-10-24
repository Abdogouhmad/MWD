import { NewResponse } from "../utils/responseHandler.ts";
import { Println } from "../utils/print.ts";
import { Context } from "../deps.ts";
import { WordDictionary } from "../utils/dict_pattern.ts";
import { CombinedResult } from "../types.d.ts";

/**
 * Function that cleans the dictionary definition by extracting relevant APA and fast definitions for a word.
 *
 * @param {Context} ctx - The Oak context object.
 * @param {string} word - The word to be searched for within the online dictionary.
 * @returns {Promise<CombinedResult[] | undefined>}
 * - An array containing both the fast definitions and the APA pronunciations or `undefined` if an error occurs.
 */
export async function CleanDefinition(
  ctx: Context,
  word: string,
): Promise<CombinedResult[] | undefined> {
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
    const dictionary = CData.GetWordData(word);
    // Return both DEFINE and APA as an object
    return dictionary;
  } catch (e) {
    NewResponse(ctx, 500, `Couldn't fetch the API: ${(e as Error).message}`);
  }
}



/**
 * Function that returns dummy data for testing purposes.
 *
 * @returns {Promise<CombinedResult[]>} - An array containing both the fast definitions and the APA pronunciations.
 */
export async function ExampleData(): Promise<CombinedResult[]> {
  // Define a small dataset to mock the killData
  const killData = {
    data: [
      {
        meta: {
          stems: ["kill"],
          "app-shortdef": {
            hw: "kill",
            fl: "verb",
            def: ["to cause the death of a living thing"],
          },
        },
        hwi: {
          hw: "kill",
          prs: [{ ipa: "kɪl", sound: { audio: "kill01" } }],
          altprs: [{ ipa: "kɪl" }],
        },
      },
      {
        meta: {
          stems: ["killing"],
          "app-shortdef": {
            hw: "killing",
            fl: "noun",
            def: ["the act of causing death"],
          },
        },
        hwi: {
          hw: "killing",
          prs: [{ ipa: "ˈkɪlɪŋ", sound: { audio: "killing01" } }],
        },
      },
    ],
  };

  // Use the WordDictionary class to extract definitions and pronunciations
  const CData = new WordDictionary(killData.data);
  const dictionary = CData.GetWordData("kill");

  // Optionally, you can print or log the result for debugging purposes
  CData.PrintResults("kill", dictionary);

  // Return the cleaned data
  return dictionary;
}
