export interface TextProcessorResult {
  items: string[];
  detectedFormat: 'bullets' | 'numbered' | 'lines' | 'sentences';
}

export class TextProcessor {
  private static readonly PATTERNS = {
    bulletPoints: /^[•\-\*\+]\s*(.+)$/gm,
    numberedList: /^\d+\.\s*(.+)$/gm,
    newLines: /^(.+)$/gm,
    sentences: /([^.!?]+[.!?])/g
  };

  static processText(rawText: string): TextProcessorResult {
    if (!rawText.trim()) {
      return { items: [], detectedFormat: 'lines' };
    }

    const cleanText = rawText.trim();
    
    // Try bullet points first
    const bulletMatches = Array.from(cleanText.matchAll(this.PATTERNS.bulletPoints));
    if (bulletMatches.length > 0) {
      return {
        items: bulletMatches.map(match => match[1].trim()).filter(item => item.length > 0),
        detectedFormat: 'bullets'
      };
    }

    // Try numbered list
    const numberedMatches = Array.from(cleanText.matchAll(this.PATTERNS.numberedList));
    if (numberedMatches.length > 0) {
      return {
        items: numberedMatches.map(match => match[1].trim()).filter(item => item.length > 0),
        detectedFormat: 'numbered'
      };
    }

    // Try line-by-line (most common for PDF copy-paste)
    const lines = cleanText.split('\n')
      .map(line => line.trim())
      .filter(line => line.length > 0 && !line.match(/^\s*$/));
    
    if (lines.length > 1) {
      return {
        items: lines,
        detectedFormat: 'lines'
      };
    }

    // Fallback to sentences
    const sentenceMatches = Array.from(cleanText.matchAll(this.PATTERNS.sentences));
    if (sentenceMatches.length > 0) {
      return {
        items: sentenceMatches.map(match => match[1].trim()).filter(item => item.length > 0),
        detectedFormat: 'sentences'
      };
    }

    // Single item
    return {
      items: [cleanText],
      detectedFormat: 'lines'
    };
  }
}
