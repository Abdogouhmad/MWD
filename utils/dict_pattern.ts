import type { ApaType, CombinedResult, MetaType, MWDTYPE } from "../types.d.ts";
import { Println } from "./print.ts";
import { mwdDFA } from "./dict_dfa.ts";
//import { killData } from "./kill.ts"; // dummy data

export class WordDictionary {
  private data: MWDTYPE[];
  private dfa: mwdDFA;

  constructor(data: MWDTYPE[]) {
    this.data = data;
    this.dfa = new mwdDFA();
  }

  /**
   * Extracts both definitions and APA (pronunciation) data for a specific word.
   *
   * @param {string} word - The word to search for in the dataset.
   * @returns {CombinedResult[]} - An array of objects containing both definitions and pronunciations.
   */
  public GetWordData(word: string): CombinedResult[] {
    const results: CombinedResult[] = [];

    // Pass the entire data array to the DFA's contains method
    if (this.dfa.contains(this.data, word)) {
      for (let i = 0; i < this.data.length; i++) {
        const entry = this.data[i];

        if (
          entry.meta?.["app-shortdef"]?.hw
            .toLowerCase()
            .includes(word.toLowerCase())
        ) {
          // Extract definitions
          const definition = this.extractDefinition(entry.meta);

          // Extract APA data
          const apa = this.extractAPA(entry.hwi);

          if (definition || apa) {
            results.push({ definition, apa });
          }
        }
      }
    } else {
      throw new Error(`No data found for the word "${word}".`);
    }

    return results;
  }

  /**
   * Extracts the definition from a specific MetaType entry.
   *
   * @param {MetaType} meta - The dataset entry's meta object.
   * @returns {MetaType | undefined} The extracted definition, or undefined if not found.
   */
  private extractDefinition(meta: MetaType): MetaType | undefined {
    if (meta && meta["app-shortdef"]) {
      const { hw, fl, def } = meta["app-shortdef"]; // Destructuring the ShortDefType
      if (hw && fl && def.length > 0) {
        return {
          "app-shortdef": { hw, fl, def },
          stems: meta.stems,
        };
      }
    }
    return undefined;
  }

  /**
   * Extracts the APA (pronunciation) data from a specific ApaType entry.
   *
   * @param {ApaType} hwi - The dataset entry's hwi object.
   * @returns {ApaType | undefined} The extracted APA data, or undefined if not found.
   */
  private extractAPA(hwi: ApaType): ApaType | undefined {
    if (hwi && hwi.hw) {
      return {
        hw: hwi.hw,
        prs: hwi.prs?.map((p) => ({
          ipa: p.ipa,
          sound: p.sound,
        })),
        altprs: hwi.altprs?.map((p) => ({
          ipa: p.ipa,
        })),
      };
    }
    return undefined;
  }

  /**
   * Prints the combined results of both definitions and APA.
   *
   * @param {string} word - The word being printed.
   * @param {CombinedResult[]} data - The combined result data (definitions and APA).
   */
  public PrintCombinedResults(word: string, data: CombinedResult[]): void {
    if (data.length > 0) {
      Println(`<r>Results for "${word}":</>`, data);
    } else {
      throw new Error(`No results found for the word "${word}".`);
    }
  }
}

// Example usage
// const extractor = new WordDictionary(killData.data);

// // Extract combined definitions and APA for the word "kill"
// const combinedData = extractor.GetWordData("kill");

// // Print combined results
// extractor.PrintCombinedResults("kill", combinedData);
