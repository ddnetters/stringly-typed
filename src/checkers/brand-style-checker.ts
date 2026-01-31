import { HumanMessage, SystemMessage } from '@langchain/core/messages';
import { createChatModel } from './create-chat-model';
import { AsyncChecker, IS_ASYNC_CHECKER } from './base-checker';
import {
  CheckResult,
  StyleViolation,
  BrandStyleOptions,
  StyleGuideConfig,
} from '../types';

const DEFAULT_MODEL = 'openai:gpt-4o-mini';
const DEFAULT_TEMPERATURE = 0;
const MAX_RETRIES = 2;
const SEVERITY_ORDER: Record<string, number> = {
  error: 0,
  warning: 1,
  suggestion: 2,
};

export class BrandStyleChecker implements AsyncChecker {
  readonly [IS_ASYNC_CHECKER] = true as const;
  private cache: Map<string, CheckResult> = new Map();

  async check(
    content: string,
    options?: BrandStyleOptions
  ): Promise<CheckResult> {
    if (!options?.styleGuide) {
      return {
        valid: false,
        message: 'styleGuide option is required for brand_style checker',
      };
    }

    const cacheKey = this.getCacheKey(content, options);
    if (options.enableCache !== false && this.cache.has(cacheKey)) {
      return this.cache.get(cacheKey)!;
    }

    try {
      const result = await this.performCheck(content, options);

      if (options.enableCache !== false && result.valid) {
        this.cache.set(cacheKey, result);
      }

      return result;
    } catch (error) {
      return this.handleError(error);
    }
  }

  private async performCheck(
    content: string,
    options: BrandStyleOptions
  ): Promise<CheckResult> {
    const modelString = options.model ?? DEFAULT_MODEL;
    const [provider, modelName] = this.parseModelString(modelString);

    const model = createChatModel(provider, modelName, {
      temperature: options.temperature ?? DEFAULT_TEMPERATURE,
    });

    const styleGuideText = this.formatStyleGuide(options.styleGuide);
    const systemPrompt = this.buildSystemPrompt(styleGuideText);
    const userPrompt = this.buildUserPrompt(content);

    let lastError: CheckResult | null = null;

    for (let attempt = 0; attempt <= MAX_RETRIES; attempt++) {
      const response = await model.invoke([
        new SystemMessage(systemPrompt),
        new HumanMessage(userPrompt),
      ]);

      const responseText =
        typeof response.content === 'string'
          ? response.content
          : JSON.stringify(response.content);

      const result = this.parseResponse(responseText, options.severityThreshold);

      // If parsing succeeded, return the result
      if (!result.message.startsWith('Failed to parse LLM response')) {
        return result;
      }

      // Store the error for potential return after all retries exhausted
      lastError = result;
    }

    // All retries exhausted, return the last error
    return lastError!;
  }

  private parseModelString(modelString: string): [string, string] {
    const parts = modelString.split(':');
    if (parts.length === 2) {
      return [parts[0], parts[1]];
    }
    // Default to OpenAI if no provider specified
    return ['openai', modelString];
  }

  private formatStyleGuide(styleGuide: string | StyleGuideConfig): string {
    if (typeof styleGuide === 'string') {
      return styleGuide;
    }

    const lines: string[] = ['# Style Guide Rules\n'];

    for (const rule of styleGuide.rules) {
      lines.push(`## ${rule.name} [${rule.severity}]`);
      lines.push(rule.description);
      lines.push('');
    }

    if (styleGuide.terminology && styleGuide.terminology.length > 0) {
      lines.push('## Terminology Rules');
      for (const term of styleGuide.terminology) {
        lines.push(`- Use "${term.correct}" instead of "${term.incorrect}"`);
        if (term.context) {
          lines.push(`  Context: ${term.context}`);
        }
      }
    }

    return lines.join('\n');
  }

  private buildSystemPrompt(styleGuide: string): string {
    return `You are a brand style checker that validates text against a style guide.

STYLE GUIDE:
${styleGuide}

INSTRUCTIONS:
1. Analyze the provided text for violations of the style guide
2. For each violation found, determine:
   - type: one of "tone", "terminology", "formatting", "grammar", or "other"
   - severity: one of "error", "warning", or "suggestion"
   - original: the problematic text
   - suggestion: how to fix it (if applicable)
   - explanation: why this violates the style guide

CRITICAL: Your response must be ONLY a valid JSON object. Do not include any text before or after the JSON.
Do not include explanations, alternatives, or suggestions outside the JSON structure.
Do not use markdown code blocks. Output raw JSON only.

If no violations are found:
{"violations":[],"confidence":1.0}

If violations are found:
{"violations":[{"type":"terminology","severity":"error","original":"text","suggestion":"fix","explanation":"reason"}],"confidence":0.95}

The confidence score (0-1) indicates how certain you are about your analysis.`;
  }

  private buildUserPrompt(content: string): string {
    return `Please check the following text for style guide violations:

"""
${content}
"""`;
  }

  private parseResponse(
    responseText: string,
    severityThreshold: 'error' | 'warning' | 'suggestion' = 'error'
  ): CheckResult {
    try {
      // Extract JSON from the response (handle markdown code blocks)
      const jsonMatch = responseText.match(/\{[\s\S]*\}/);
      if (!jsonMatch) {
        return {
          valid: false,
          message: 'Failed to parse LLM response: no JSON found',
        };
      }

      const parsed = JSON.parse(jsonMatch[0]);

      if (!parsed || typeof parsed !== 'object' || !Array.isArray(parsed.violations)) {
        return {
          valid: false,
          message: 'Failed to parse LLM response: invalid structure (missing violations array)',
        };
      }

      const violations = parsed.violations as StyleViolation[];
      const confidence = typeof parsed.confidence === 'number' ? parsed.confidence : 0.5;

      const thresholdLevel = SEVERITY_ORDER[severityThreshold];
      const significantViolations = violations.filter(
        (v) => SEVERITY_ORDER[v.severity] <= thresholdLevel
      );

      if (significantViolations.length === 0) {
        return {
          valid: true,
          message: 'Content passes brand style check',
          details: violations,
          confidence,
        };
      }

      const errorCount = significantViolations.filter(
        (v) => v.severity === 'error'
      ).length;
      const warningCount = significantViolations.filter(
        (v) => v.severity === 'warning'
      ).length;

      return {
        valid: false,
        message: `Brand style violations found: ${errorCount} error(s), ${warningCount} warning(s)`,
        details: violations,
        confidence,
      };
    } catch (error) {
      return {
        valid: false,
        message: `Failed to parse LLM response: ${error instanceof Error ? error.message : 'unknown error'}`,
      };
    }
  }

  private getCacheKey(content: string, options: BrandStyleOptions): string {
    const styleGuideKey =
      typeof options.styleGuide === 'string'
        ? options.styleGuide
        : JSON.stringify(options.styleGuide);

    return `${content}::${styleGuideKey}::${options.model ?? DEFAULT_MODEL}::${options.temperature ?? DEFAULT_TEMPERATURE}::${options.severityThreshold ?? 'error'}`;
  }

  private handleError(error: unknown): CheckResult {
    if (error instanceof Error) {
      // Handle common API errors
      if (error.message.includes('401') || error.message.includes('auth')) {
        return {
          valid: false,
          message:
            'Authentication failed. Please check your API key environment variable.',
        };
      }
      if (error.message.includes('429') || error.message.includes('rate')) {
        return {
          valid: false,
          message: 'Rate limit exceeded. Please try again later.',
        };
      }
      if (error.message.includes('timeout')) {
        return {
          valid: false,
          message: 'Request timed out. Please try again.',
        };
      }
      return {
        valid: false,
        message: `Brand style check failed: ${error.message}`,
      };
    }
    return {
      valid: false,
      message: 'Brand style check failed: unknown error',
    };
  }

  clearCache(): void {
    this.cache.clear();
  }
}
