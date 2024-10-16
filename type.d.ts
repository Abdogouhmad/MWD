// Define interfaces for FastDefinition and Apa
export interface FastDefinition {
  hw: string;
  fl: string;
  def: string[];
}

export interface Apa {
  hw: string;
  prs?: { ipa: string; sound?: string }[];
  altprs?: string[];
}

// Define the return type for the clean function
export interface CleanFuncReturn {
  DEFINE: FastDefinition[] | undefined;
  APA: Apa[] | undefined;
}

export type PronunciationEntry = {
  hwi?: {
    hw?: string;
    prs?: { ipa: string, sound: string }[];
    altprs?: { ipa: string }[];
  };
};

export type DefineMeta = {
  meta?: {
    "app-shortdef"?: FastDefinition;
  };
};
