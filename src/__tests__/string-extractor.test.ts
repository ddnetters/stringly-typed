import { StringExtractor } from '../string-extractor';

describe('StringExtractor', () => {
  let extractor: StringExtractor;

  beforeEach(() => {
    extractor = new StringExtractor();
  });

  describe('extractStrings', () => {
    it('should extract double-quoted strings', () => {
      const files = [
        { path: 'test.js', content: 'const msg = "Hello world";' }
      ];
      
      const results = extractor.extractStrings(files);
      
      expect(results).toHaveLength(1);
      expect(results[0]).toEqual({
        file: 'test.js',
        line: 1,
        start: 12,
        end: 25,
        content: 'Hello world'
      });
    });

    it('should extract single-quoted strings', () => {
      const files = [
        { path: 'test.js', content: "const msg = 'Hello world';" }
      ];
      
      const results = extractor.extractStrings(files);
      
      expect(results).toHaveLength(1);
      expect(results[0].content).toBe('Hello world');
    });

    it('should extract backtick strings', () => {
      const files = [
        { path: 'test.js', content: 'const msg = `Hello world`;' }
      ];
      
      const results = extractor.extractStrings(files);
      
      expect(results).toHaveLength(1);
      expect(results[0].content).toBe('Hello world');
    });

    it('should handle escaped quotes', () => {
      const files = [
        { path: 'test.js', content: 'const msg = "He said \\"Hello\\"";' }
      ];
      
      const results = extractor.extractStrings(files);
      
      expect(results).toHaveLength(1);
      expect(results[0].content).toBe('He said \\"Hello\\"');
    });

    it('should extract multiple strings from same line', () => {
      const files = [
        { path: 'test.js', content: 'console.log("Hello", "world");' }
      ];
      
      const results = extractor.extractStrings(files);
      
      expect(results).toHaveLength(2);
      expect(results[0].content).toBe('Hello');
      expect(results[1].content).toBe('world');
    });

    it('should extract strings from multiple lines', () => {
      const files = [
        { path: 'test.js', content: 'const a = "first";\nconst b = "second";' }
      ];
      
      const results = extractor.extractStrings(files);
      
      expect(results).toHaveLength(2);
      expect(results[0].line).toBe(1);
      expect(results[1].line).toBe(2);
    });

    it('should skip empty strings', () => {
      const files = [
        { path: 'test.js', content: 'const msg = "";' }
      ];
      
      const results = extractor.extractStrings(files);
      
      expect(results).toHaveLength(0);
    });

    it('should extract markdown content from .md files', () => {
      const files = [
        { path: 'test.md', content: '# Title\n\nThis is content\n\n```code```' }
      ];
      
      const results = extractor.extractStrings(files);
      
      expect(results.length).toBeGreaterThan(0);
      expect(results.some(r => r.content === 'This is content')).toBe(true);
    });

    it('should extract markdown content from README files', () => {
      const files = [
        { path: 'README', content: 'Installation instructions\n\nRun npm install' }
      ];
      
      const results = extractor.extractStrings(files);
      
      expect(results.length).toBeGreaterThan(0);
      expect(results.some(r => r.content === 'Installation instructions')).toBe(true);
    });

    it('should handle multiple files', () => {
      const files = [
        { path: 'file1.js', content: 'const a = "first";' },
        { path: 'file2.js', content: 'const b = "second";' }
      ];
      
      const results = extractor.extractStrings(files);
      
      expect(results).toHaveLength(2);
      expect(results[0].file).toBe('file1.js');
      expect(results[1].file).toBe('file2.js');
    });
  });
});