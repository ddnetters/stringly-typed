import * as core from '@actions/core';
import * as fs from 'fs';
import * as path from 'path';
import { glob } from 'glob';
import { validateCodebaseStrings } from './validator';
import { ValidatorInput } from './types';

async function run(): Promise<void> {
  try {
    const filesPattern = core.getInput('files') || '**/*.{js,ts,md,json}';
    const checker = core.getInput('checker') as 'grammar' | 'char_count' | 'custom';
    const checkerOptions = JSON.parse(core.getInput('checker-options') || '{}');
    const decider = core.getInput('decider') as 'threshold' | 'noCritical' | 'custom';
    const deciderOptions = JSON.parse(core.getInput('decider-options') || '{}');

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

    const result = validateCodebaseStrings(input);

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