export interface StringMatch {
  file: string;
  line: number;
  start: number;
  end: number;
  content: string;
}

export interface CheckResult {
  valid: boolean;
  message: string;
}

export interface ValidationResult {
  file: string;
  line: number;
  start: number;
  end: number;
  content: string;
  valid: boolean;
  message: string;
}

export interface ValidationSummary {
  pass: boolean;
  reason: string;
}

export interface ValidatorInput {
  files: { path: string; content: string }[];
  checker: "grammar" | "char_count" | "custom";
  checkerOptions?: Record<string, any>;
  decider: "threshold" | "noCritical" | "custom";
  deciderOptions?: Record<string, any>;
}

export interface ValidatorOutput {
  results: ValidationResult[];
  summary: ValidationSummary;
}