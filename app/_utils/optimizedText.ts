export function optimizedText(text: string): string {
  const chars = text.split(/(\s+)/);
  const converted = chars.map(char => {
    if (char.startsWith('https://')) {
      char = `<a href='${char}' class="text-primary">${char}</a>`;
    }
    if (char.startsWith('#')) {
      char = `<a href='/hashtag/${char.slice(1)}' class="text-primary">${char}</a>`;
    }
    return char;
  })
  return converted.join('');
}
