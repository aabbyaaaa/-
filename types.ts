export enum Tone {
  CONCISE = 'concise',
  STANDARD = 'standard',
  FORMAL = 'formal',
}

export interface PolishRequest {
  sourceText: string;
  customerName?: string;
  customerTitle?: string;
}

export interface PolishedVariant {
  tone: Tone;
  subject?: string; // Optional email subject suggestion
  content: string;
}

export interface PolishResponse {
  variants: PolishedVariant[];
}

export interface LoadingState {
  isLoading: boolean;
  step: string; // e.g., "Analyzing terms...", "Polishing...", "Finalizing"
}