interface ShortDefType {
  hw: string; // headword
  fl: string; // functional label (part of speech)
  def: string[]; // definitions
}

interface MetaType {
  stems?: string[];
  "app-shortdef": ShortDefType;
}

// APA type data
interface ApaType {
  hw: string;
  prs?: { ipa: string; sound?: { audio?: string } }[]; // sound is an object with audio
  altprs?: { ipa: string }[]; // alternative pronunciation, optional
}

// main interface
interface MWDTYPE {
  meta: MetaType;
  hwi: ApaType;
}

// Define the structure for combined result
type CombinedResult = {
  definition?: MetaType;
  apa?: ApaType;
};

// Meta type
export interface Meta {
  stems: string[];
  "app-shortdef": {
    hw: string;
    fl: string;
    def: string[];
  };
}

// Def entery

// InflectionsObject
export interface InflectionsObject {
  if?: string; // Fully spelled-out inflection (optional)
  ifc?: string; // Inflection cutback (optional)
  il?: string; // Inflection label (optional)
  prs?: string; // Present tense form (optional)
  spl?: string; // Split tense form (optional)
}

// PronunciationsObject
export interface PronunciationsObject {
  mw?: string; // Written pronunciation in Merriam-Webster format (optional)
  l?: string; // Pronunciation label before pronunciation (optional)
  l2?: string; // Pronunciation label after pronunciation (optional)
  pun?: string; // Punctuation to separate pronunciation objects (optional)
  sound?: {
    audio: string; // Base filename for audio playback
    ref?: string; // Can be ignored
    stat?: string; // Can be ignored
  }; // Audio playback information (optional)
}

// DiSense
export interface DiSenseObject {
  sd?: string;
  dt?: string[];
}
// Define the structure for verbal illustrations
interface VerbalIllustration {
  t: string; // Text of the illustration
}

// Define the structure for usage notes
interface UsageNote {
  t: string; // Text of the usage note
}

// Define possible types for definitions
export type DefinitionType =
  | { dt: [string, string][] } // Text definitions
  | { dt: [string, VerbalIllustration[]] } // Visual illustrations
  | { dt: [string, UsageNote[][]] }; // Usage notes with structure

// SenseEntery
export interface SenseEntry {
  // Etymology
  et?: string[];
  // Inflections
  ins?: InflectionsObject;
  // Pronunciations
  prs?: PronunciationsObject;
  // Divided Sense
  sdsense?: DiSenseObject;
  // Sense-Specific Grammatical Label
  sgram?: string;
  // Subject/Status Labels
  sls?: string[];
  // define text
  dt: DefinitionType[];
}

// // Define the structure for the definition entries
// interface DefinitionEntry {
//   sseq: Array<Array<[string, { sn: string; dt: DefinitionType[]; ins?: InflectionsObject[] }]>>;
// }

// // Define the overall structure for the "def" property
// interface Definition {
//   def: DefinitionEntry[];
// }
