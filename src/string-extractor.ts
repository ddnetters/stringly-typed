import { StringMatch } from './types';

export class StringExtractor {
  extractStrings(files: { path: string; content: string }[]): StringMatch[] {
    const results: StringMatch[] = [];
    
    for (const file of files) {
      const matches = this.extractFromFile(file.path, file.content);
      results.push(...matches);
    }
    
    return results;
  }
  
  private extractFromFile(filePath: string, content: string): StringMatch[] {
    const matches: StringMatch[] = [];
    const lines = content.split('\n');
    
    for (let lineIndex = 0; lineIndex < lines.length; lineIndex++) {
      const line = lines[lineIndex];
      const lineNumber = lineIndex + 1;
      
      if (this.isMarkdownFile(filePath)) {
        matches.push(...this.extractMarkdownContent(filePath, line, lineNumber));
      }
      
      matches.push(...this.extractStringLiterals(filePath, line, lineNumber));
    }
    
    return matches;
  }
  
  private isMarkdownFile(filePath: string): boolean {
    return /\.(md|mdx)$/i.test(filePath) || /README/i.test(filePath);
  }
  
  private extractMarkdownContent(filePath: string, line: string, lineNumber: number): StringMatch[] {
    const matches: StringMatch[] = [];
    
    if (line.trim() && !line.startsWith('#') && !line.startsWith('```')) {
      matches.push({
        file: filePath,
        line: lineNumber,
        start: 0,
        end: line.length,
        content: line.trim()
      });
    }
    
    return matches;
  }
  
  private extractStringLiterals(filePath: string, line: string, lineNumber: number): StringMatch[] {
    const matches: StringMatch[] = [];
    
    const patterns = [
      { regex: /"([^"\\]|\\.)*"/g, type: 'double' },
      { regex: /'([^'\\]|\\.)*'/g, type: 'single' },
      { regex: /`([^`\\]|\\.)*`/g, type: 'backtick' }
    ];
    
    for (const pattern of patterns) {
      let match;
      while ((match = pattern.regex.exec(line)) !== null) {
        const content = match[0].slice(1, -1);
        if (content.length > 0) {
          matches.push({
            file: filePath,
            line: lineNumber,
            start: match.index,
            end: match.index + match[0].length,
            content: content
          });
        }
      }
    }
    
    return matches;
  }
}