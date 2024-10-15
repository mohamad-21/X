export function optimizedText(text: string): string {
  const chars = text.split(' ');
  const converted = chars.map(char => {
    if (char.startsWith('https://')) {
      char = `<a href='${char}' class="text-primary">${char}</a>`;
    }
    return char;
  })
  return converted.join(' ');
}