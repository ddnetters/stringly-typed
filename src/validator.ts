import { StringExtractor } from './string-extractor';
import { CheckerFactory } from './checkers';
import { DeciderFactory } from './deciders';
import { ValidatorInput, ValidatorOutput, ValidationResult } from './types';

export function validateCodebaseStrings(input: ValidatorInput): ValidatorOutput {
  const extractor = new StringExtractor();
  const checker = CheckerFactory.createChecker(input.checker);
  const decider = DeciderFactory.createDecider(input.decider);
  
  const stringMatches = extractor.extractStrings(input.files);
  
  const results: ValidationResult[] = stringMatches.map(match => {
    const checkResult = checker.check(match.content, input.checkerOptions);
    
    return {
      file: match.file,
      line: match.line,
      start: match.start,
      end: match.end,
      content: match.content,
      valid: checkResult.valid,
      message: checkResult.message
    };
  });
  
  const summary = decider.decide(results, input.deciderOptions);
  
  return {
    results,
    summary
  };
}