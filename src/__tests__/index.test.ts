import { 
  validateCodebaseStrings, 
  StringExtractor, 
  CheckerFactory, 
  DeciderFactory,
  GrammarChecker,
  CharCountChecker,
  CustomChecker,
  ThresholdDecider,
  NoCriticalDecider,
  CustomDecider
} from '../index';

describe('Index exports', () => {
  it('should export main validation function', () => {
    expect(typeof validateCodebaseStrings).toBe('function');
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
    expect(GrammarChecker).toBeDefined();
    expect(CharCountChecker).toBeDefined();
    expect(CustomChecker).toBeDefined();
    
    expect(new GrammarChecker()).toBeInstanceOf(GrammarChecker);
    expect(new CharCountChecker()).toBeInstanceOf(CharCountChecker);
    expect(new CustomChecker()).toBeInstanceOf(CustomChecker);
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