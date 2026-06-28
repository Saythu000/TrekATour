// Utility function to convert text to bullet points
export const convertToPoints = (text: string): string => {
  if (!text || text.trim() === '') return text;
  
  return text
    .split('.')
    .map(sentence => sentence.trim())
    .filter(sentence => sentence.length > 0)
    .map(sentence => `• ${sentence}`)
    .join('\n');
};
