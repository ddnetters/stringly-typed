import {
  validateCodebaseStrings,
  validateCodebaseStringsAsync,
  StringExtractor,
  CheckerFactory,
  DeciderFactory,
  CharCountChecker,
  CustomChecker,
  BrandStyleChecker,
  isAsyncChecker,
  ThresholdDecider,
  NoCriticalDecider,
  CustomDecider
} from '../index';

describe('Index exports', () => {
  it('should export main validation function', () => {
    expect(typeof validateCodebaseStrings).toBe('function');
  });

  it('should export async validation function', () => {
    expect(typeof validateCodebaseStringsAsync).toBe('function');
  });

  it('should export StringExtractor class', () => {
    expect(StringExtractor).toBeDefined();
    expect(new StringExtractor()).toBeInstanceOf(StringExtractor);
  });

  it('should export CheckerFactory', () => {
    expect(CheckerFactory).toBeDefined();
    expect(CheckerFactory.createChecker).toBeDefined();
  });

  it('should export DeciderFactory', () => {
    expect(DeciderFactory).toBeDefined();
    expect(DeciderFactory.createDecider).toBeDefined();
  });

  it('should export checker classes', () => {
    expect(CharCountChecker).toBeDefined();
    expect(CustomChecker).toBeDefined();
    expect(BrandStyleChecker).toBeDefined();

    expect(new CharCountChecker()).toBeInstanceOf(CharCountChecker);
    expect(new CustomChecker()).toBeInstanceOf(CustomChecker);
    expect(new BrandStyleChecker()).toBeInstanceOf(BrandStyleChecker);
  });

  it('should export async checker utilities', () => {
    expect(typeof isAsyncChecker).toBe('function');

    const syncChecker = new CharCountChecker();
    const asyncChecker = new BrandStyleChecker();

    expect(isAsyncChecker(syncChecker)).toBe(false);
    expect(isAsyncChecker(asyncChecker)).toBe(true);
  });

  it('should export decider classes', () => {
    expect(ThresholdDecider).toBeDefined();
    expect(NoCriticalDecider).toBeDefined();
    expect(CustomDecider).toBeDefined();
    
    expect(new ThresholdDecider()).toBeInstanceOf(ThresholdDecider);
    expect(new NoCriticalDecider()).toBeInstanceOf(NoCriticalDecider);
    expect(new CustomDecider()).toBeInstanceOf(CustomDecider);
  });
});