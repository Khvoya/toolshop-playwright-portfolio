const countryCodes: Record<string, string> = { NL: "NL", Netherlands: "NL" };

export function countryCode(country: string): string {
  const code = countryCodes[country];
  if (!code) throw new Error(`Unsupported test-data country: ${country}`);
  return code;
}
