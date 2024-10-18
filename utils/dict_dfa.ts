import { DefineMeta } from "../type";

export class DFA {
  private startState: string;
  private acceptState: string;

  constructor() {
    this.startState = 'start';
    this.acceptState = 'accept';
  }

  public accepts(input: string[]): boolean {
    let currentState = this.startState;

    for (const symbol of input) {
      switch (currentState) {
        case 'start':
          if (symbol === 'hw') {
            currentState = 'hwappShort';
          } else {
            console.log('Failed at start: invalid symbol', symbol);
            return false; // Invalid input
          }
          break;

        case 'hwappShort':
          // Skip 'src', directly go to 'fl'
          if (symbol === 'fl') {
            currentState = 'flappShort';
          } else {
            console.log('Failed at hwappShort: invalid symbol', symbol);
            return false; // Invalid input
          }
          break;

        case 'flappShort':
          if (symbol === 'def') {
            currentState = this.acceptState;
          } else {
            console.log('Failed at flappShort: invalid symbol', symbol);
            return false;
          }
          break;

        case this.acceptState:
          return false; // Already in accept state

        default:
          console.log('Failed: reached default case');
          return false; // Invalid state
      }
    }

    return currentState === this.acceptState; // Accept if in accept state
  }

  public contains(entry: DefineMeta, input: string[], word: string): boolean {
    // Check if the 'id' contains the word (e.g., 'kill') and if app-shortdef exists
    if (!entry.meta || !entry.meta["app-shortdef"]) {
      console.log(`Skipping entry without app-shortdef.`);
      return false;
    }

    if (!entry.meta["app-shortdef"].hw.includes(word)) {
      console.log(`Skipping entry with hw: ${entry.meta["app-shortdef"].hw}, does not contain word: ${word}`);
      return false;
    }

    console.log(`Processing entry with hw: ${entry.meta["app-shortdef"].hw}`);
    return this.accepts(input); // Run the DFA
  }
}
