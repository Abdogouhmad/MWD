import type {
  Apa,
  DefineMeta,
  FastDefinition,
  PronunciationEntry,
} from "../type.d.ts";
import { Println } from "./print.ts";

/**
 * Class to extract definitions and pronunciation (APA) data from a dataset.
 *
 * This class provides methods to search and retrieve word-related data, such as definitions and pronunciation (APA),
 * from a dataset. It can handle any word matching within the dataset, and print results as needed.
 */
export class WordDictionary {
  private data: object[];

  /**
   * Creates a new instance of WordExtractor.
   *
   * @param {object[]} data - The dataset from which to extract word data.
   */
  constructor(data: object[]) {
    this.data = data;
  }

  /**
   * Extracts definitions (FastDefinitions) for a specific word.
   *
   * This method searches the dataset for entries containing a `meta["app-shortdef"]` field
   * that includes the specified word. It extracts the headword (`hw`), functional label (`fl`),
   * and definition list (`def`) for each matching entry.
   *
   * @param {string} word - The word to search for in the dataset.
   * @returns {FastDefinition[] | undefined} An array of FastDefinition objects or `undefined` if no matches are found.
   */
  public GetFastDefinitions(word: string): FastDefinition[] | undefined {
    const results: FastDefinition[] = [];

    for (let i = 0; i < this.data.length; i++) {
      const entry = this.data[i] as DefineMeta;

      if (
        entry.meta &&
        entry.meta["app-shortdef"] &&
        entry.meta["app-shortdef"].hw &&
        entry.meta["app-shortdef"].hw.includes(word)
      ) {
        const { hw, fl, def } = entry.meta["app-shortdef"];
        if (hw && fl && def) {
          results.push({ hw, fl, def });
        }
      }
    }

    return results.length > 0 ? results : undefined;
  }

  /**
   * Extracts pronunciation (APA) data for a specific word.
   *
   * This method searches the dataset for entries containing a `hwi` (headword information) field
   * that includes the specified word. It extracts the headword (`hw`), pronunciations (`prs`),
   * and alternative pronunciations (`altprs`) if available.
   *
   * @param {string} word - The word to search for in the dataset.
   * @returns {Apa[] | undefined} An array of Apa objects or `undefined` if no matches are found.
   */
  public GetAPA(word: string): Apa[] | undefined {
    const results: Apa[] = [];

    for (let i = 0; i < this.data.length; i++) {
      const entry = this.data[i] as PronunciationEntry;

      const hwi = entry.hwi;
      if (hwi && hwi.hw && hwi.hw.includes(word)) {
        const { hw, prs, altprs } = hwi;

        results.push({
          hw,
          prs: prs?.map((p) => p.ipa),
          altprs: altprs?.map((p) => p.ipa),
        });
      }
    }

    return results.length > 0 ? results : undefined;
  }

  /**
   * Prints the results of an extracted word-related data (such as definitions or APA).
   *
   * This method checks if the provided data is non-empty and prints the results.
   * If no data is found, it logs an error message.
   *
   * @param {string} title - A descriptive title for the type of data being printed (e.g., "Definition" or "APA").
   * @param {object[] | undefined} data - The extracted data to be printed.
   */
  public PrintResults(title: string, data: object[] | undefined): void {
    if (data && data.length > 0) {
      Println(`<r>${title}:</>`, data);
    } else {
      throw new Error(`No ${title.toLowerCase()} found.`);
    }
  }
}

// Example usage
// const extractor = new WordDictionary(killData.data);

// // Extract definitions and APA for the word "kill"
// const definitions = extractor.GetFastDefinitions("kill");
// const apa = extractor.GetAPA("kill");

// // Print results
// extractor.PrintResults("Definition", definitions);
// extractor.PrintResults("APA", apa);
