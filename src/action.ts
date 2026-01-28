import * as core from '@actions/core';
import * as fs from 'fs';
import * as path from 'path';
import { glob } from 'glob';
import { validateCodebaseStrings, validateCodebaseStringsAsync } from './validator';
import { ValidatorInput, ValidatorOutput } from './types';

async function run(): Promise<void> {
  try {
    const filesPattern = core.getInput('files') || '**/*.{js,ts,md,json}';
    const checker = core.getInput('checker') as 'char_count' | 'custom' | 'brand_style';
    const styleGuideFile = core.getInput('style-guide-file');
    const decider = core.getInput('decider') as 'threshold' | 'noCritical' | 'custom';

    let checkerOptions: Record<string, unknown>;
    try {
      checkerOptions = JSON.parse(core.getInput('checker-options') || '{}');
    } catch (error) {
      throw new Error(`Invalid JSON in checker-options: ${error instanceof Error ? error.message : 'unknown error'}`);
    }

    let deciderOptions: Record<string, unknown>;
    try {
      deciderOptions = JSON.parse(core.getInput('decider-options') || '{}');
    } catch (error) {
      throw new Error(`Invalid JSON in decider-options: ${error instanceof Error ? error.message : 'unknown error'}`);
    }

    // Load style guide from file if provided
    if (styleGuideFile) {
      if (checker === 'brand_style') {
        const styleGuidePath = path.resolve(styleGuideFile);
        if (fs.existsSync(styleGuidePath)) {
          const styleGuideContent = fs.readFileSync(styleGuidePath, 'utf8');
          checkerOptions.styleGuide = styleGuideContent;
          core.info(`📖 Loaded style guide from ${styleGuideFile}`);
        } else {
          throw new Error(`Style guide file not found: ${styleGuideFile}`);
        }
      } else {
        core.warning(`style-guide-file provided but checker is '${checker}', not 'brand_style'. File will be ignored.`);
      }
    }

    const filePaths = await glob(filesPattern);
    const files = filePaths.map((filePath: string) => ({
      path: filePath,
      content: fs.readFileSync(path.resolve(filePath), 'utf8')
    }));

    const input: ValidatorInput = {
      files,
      checker,
      checkerOptions,
      decider,
      deciderOptions
    };

    // Use async validator for brand_style checker
    let result: ValidatorOutput;
    if (checker === 'brand_style') {
      result = await validateCodebaseStringsAsync(input);
    } else {
      result = validateCodebaseStrings(input);
    }

    core.setOutput('results', JSON.stringify(result.results));
    core.setOutput('summary', JSON.stringify(result.summary));
    core.setOutput('pass', result.summary.pass.toString());

    if (result.summary.pass) {
      core.info(`✅ Validation passed: ${result.summary.reason}`);
    } else {
      core.setFailed(`❌ Validation failed: ${result.summary.reason}`);
    }

    if (result.results.length > 0) {
      core.info(`📊 Processed ${result.results.length} strings`);
      const validCount = result.results.filter(r => r.valid).length;
      core.info(`✅ ${validCount} valid, ❌ ${result.results.length - validCount} invalid`);
    }

  } catch (error) {
    core.setFailed(`Action failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}

export { run };