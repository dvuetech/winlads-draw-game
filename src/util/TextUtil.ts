class TextUtil {
  static splitText(text: string) {
    // Regex for Sinhala modifiers/signs and ZWJ
    const modifierPattern = /^[\u0DCA-\u0DFF\u200D]/; // includes all Sinhala signs and ZWJ

    const result: string[] = [];
    let currentChar = "";

    for (const char of text) {
      // If it's a modifier or ZWJ, combine with previous character
      if (modifierPattern.test(char) || char === "\u200D") {
        currentChar += char;
      } else {
        // If we have a stored character, push it and start new
        if (currentChar) {
          result.push(currentChar);
        }
        currentChar = char;
      }
    }

    // Push the last character group
    if (currentChar) {
      result.push(currentChar);
    }

    return result;
  }
}

export default TextUtil;
