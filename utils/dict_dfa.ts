import { ApaType, MWDTYPE, ShortDefType } from "../types.d.ts";
// import { killData } from "./kill.ts";
// import { DummyData } from "./data.ts";

export class mwdDFA {
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
      const prsValid = hwi.prs.every(
        (p) =>
          typeof p.ipa === "string" &&
          (!p.sound || typeof p.sound.audio === "string"),
      );
      if (prsValid) return true;
    }

    // Validate altprs if it exists
    if (hwi.altprs) {
      return hwi.altprs.every((p) => typeof p.ipa === "string");
    }

    return false;
  }

  public processEntry(entry: MWDTYPE, searchWord: string): boolean {
    this.word = searchWord.toLowerCase();
    this.resetState();

    while (this.currentState !== this.ACCEPT) {
      switch (this.currentState) {
        case this.START: {
          if (!entry.meta) {
            return false;
          }
          this.currentState = this.CHECK_META;
          break;
        }

        case this.CHECK_META: {
          // Stems are optional, so we only check if they exist
          if (entry.meta.stems && !Array.isArray(entry.meta.stems)) {
            return false;
          }
          this.currentState = this.CHECK_APP_SHORTDEF;
          break;
        }

        case this.CHECK_APP_SHORTDEF: {
          if (
            !entry.meta["app-shortdef"] ||
            !this.validateShortDef(entry.meta["app-shortdef"])
          ) {
            return false;
          }

          // Check if the word matches
          const hw = entry.meta["app-shortdef"].hw.toLowerCase();
          const baseWord = hw.split(":")[0]; // Handle cases like "mock:1"
          if (baseWord !== this.word) {
            return false;
          }

          this.currentState = this.CHECK_HWI;
          break;
        }

        case this.CHECK_HWI: {
          if (!entry.hwi || typeof entry.hwi.hw !== "string") {
            return false;
          }
          this.currentState = this.CHECK_PRONUNCIATION;
          break;
        }

        case this.CHECK_PRONUNCIATION: {
          if (!this.validatePronunciation(entry.hwi)) {
            return false;
          }
          this.currentState = this.ACCEPT;
          break;
        }

        default: {
          return false;
        }
      }
    }

    return true;
  }

  // contains func
  public contains(entries: MWDTYPE[], word: string): boolean {
    for (const entry of entries) {
      if (
        entry.meta?.["app-shortdef"]?.hw
          .toLowerCase()
          .includes(word.toLowerCase())
      ) {
        if (this.processEntry(entry, word)) {
          return true;
        }
      }
    }
    return false;
  }
}

// Example usage:
// const dfa = new mwdDFA();
// // Process all entries for a specific word
// const word = "mock";
// const data = DummyData.data;

// const r = dfa.contains(data, word)
// console.log(r)
