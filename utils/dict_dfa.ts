import { ApaType, MetaType, MWDTYPE, ShortDefType } from "../type.d.ts";
import { killData } from "./kill.ts";

export class DictionaryDFA {
  // DFA States as constants
  private readonly START = "start";
  private readonly CHECK_META = "check_meta";
  private readonly CHECK_APP_SHORTDEF = "check_app_shortdef";
  private readonly CHECK_HWI = "check_hwi";
  private readonly CHECK_PRONUNCIATION = "check_pronunciation";
  private readonly ACCEPT = "accept";

  private currentState: string;
  private word: string;

  constructor() {
    this.currentState = this.START;
    this.word = "";
  }

  private resetState() {
    this.currentState = this.START;
  }

  private validateShortDef(shortDef: ShortDefType): boolean {
    return (
      typeof shortDef.hw === "string" &&
      typeof shortDef.fl === "string" &&
      Array.isArray(shortDef.def)
    );
  }

  private validatePronunciation(hwi: ApaType): boolean {
    // Check if at least one pronunciation type exists
    if (!hwi.prs && !hwi.altprs) {
      return false;
    }

    // Validate prs if it exists
    if (hwi.prs) {
      const prsValid = hwi.prs.every(p =>
        typeof p.ipa === "string" &&
        (!p.sound || typeof p.sound.audio === "string")
      );
      if (prsValid) return true;
    }

    // Validate altprs if it exists
    if (hwi.altprs) {
      return hwi.altprs.every(p => typeof p.ipa === "string");
    }

    return false;
  }

  public processEntry(entry: MWDTYPE, searchWord: string): boolean {
    this.word = searchWord.toLowerCase();
    this.resetState();

    while (this.currentState !== this.ACCEPT) {
      switch (this.currentState) {
        case this.START:
          if (!entry.meta) {
            return false;
          }
          this.currentState = this.CHECK_META;
          break;

        case this.CHECK_META:
          // Stems are optional, so we only check if they exist
          if (entry.meta.stems && !Array.isArray(entry.meta.stems)) {
            return false;
          }
          this.currentState = this.CHECK_APP_SHORTDEF;
          break;

        case this.CHECK_APP_SHORTDEF:
          if (!entry.meta["app-shortdef"] ||
            !this.validateShortDef(entry.meta["app-shortdef"])) {
            return false;
          }

          // Check if the word matches
          const hw = entry.meta["app-shortdef"].hw.toLowerCase();
          const baseWord = hw.split(':')[0]; // Handle cases like "mock:1"
          if (baseWord !== this.word) {
            return false;
          }

          this.currentState = this.CHECK_HWI;
          break;

        case this.CHECK_HWI:
          if (!entry.hwi || typeof entry.hwi.hw !== "string") {
            return false;
          }
          this.currentState = this.CHECK_PRONUNCIATION;
          break;

        case this.CHECK_PRONUNCIATION:
          if (!this.validatePronunciation(entry.hwi)) {
            return false;
          }
          this.currentState = this.ACCEPT;
          break;

        default:
          return false;
      }
    }

    return true;
  }
  private createStrictMWDType(entry: MWDTYPE): MWDTYPE {
    const strictMetaType: MetaType = {
      stems: entry.meta.stems,
      "app-shortdef": {
        hw: entry.meta["app-shortdef"].hw,
        fl: entry.meta["app-shortdef"].fl,
        def: entry.meta["app-shortdef"].def
      }
    };

    const strictApaType: ApaType = {
      hw: entry.hwi.hw
    };

    // Only add prs if it exists
    if (entry.hwi.prs) {
      strictApaType.prs = entry.hwi.prs.map(p => ({
        ipa: p.ipa,
        ...(p.sound ? { sound: { audio: p.sound.audio } } : {})
      }));
    }

    // Only add altprs if it exists
    if (entry.hwi.altprs) {
      strictApaType.altprs = entry.hwi.altprs.map(p => ({
        ipa: p.ipa
      }));
    }

    return {
      meta: strictMetaType,
      hwi: strictApaType,
    };
  }

  public processEntries(entries: MWDTYPE[], word: string): MWDTYPE[] {
    return entries
      .filter(entry => this.processEntry(entry, word))
      .map(entry => this.createStrictMWDType(entry));
  }
}

// Example usage:
const dfa = new DictionaryDFA();

// Process all entries for a specific word
const searchWord = "kill";
const results = dfa.processEntries(killData.data, searchWord);

// Print results
// results.forEach(entry => {
//   console.log(`Found entry: ${entry.meta["app-shortdef"].hw}`);
//   console.log(`Part of speech: ${entry.meta["app-shortdef"].fl}`);
//   console.log(`Definitions: ${entry.meta["app-shortdef"].def.join('\n- ')}\n`);
// });

console.log(results)
// Or process single entries
// killData.data.forEach(entry => {
//   const result = dfa.processEntry(entry, searchWord);
//   console.log(`Entry ${entry.meta["app-shortdef"].hw} matches: ${result}`);
// });
