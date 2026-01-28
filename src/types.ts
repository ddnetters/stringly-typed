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
  details?: StyleViolation[];
  confidence?: number;
}

export interface StyleViolation {
  type: 'tone' | 'terminology' | 'formatting' | 'grammar' | 'other';
  severity: 'error' | 'warning' | 'suggestion';
  original: string;
  suggestion?: string;
  explanation: string;
}

export interface StyleGuideConfig {
  rules: StyleRule[];
  terminology?: TerminologyRule[];
}

export interface StyleRule {
  name: string;
  description: string;
  severity: 'error' | 'warning' | 'suggestion';
}

export interface TerminologyRule {
  incorrect: string;
  correct: string;
  context?: string;
}

export interface BrandStyleOptions {
  styleGuide: string | StyleGuideConfig;
  model?: string;
  severityThreshold?: 'error' | 'warning' | 'suggestion';
  temperature?: number;
  timeout?: number;
  enableCache?: boolean;
}

export interface ValidationResult {
  file: string;
  line: number;
  start: number;
  end: number;
  content: string;
  valid: boolean;
  message: string;
  details?: StyleViolation[];
  confidence?: number;
}

export interface ValidationSummary {
  pass: boolean;
  reason: string;
}

export interface ValidatorInput {
  files: { path: string; content: string }[];
  checker: "char_count" | "custom" | "brand_style";
  checkerOptions?: Record<string, any>;
  decider: "threshold" | "noCritical" | "custom";
  deciderOptions?: Record<string, any>;
}

export interface ValidatorOutput {
  results: ValidationResult[];
  summary: ValidationSummary;
}