// Normalize a phone number to E.164. French numbers (10 digits starting
// with 0) become +33XXXXXXXXX. Anything we can't confidently normalize
// returns null so callers can surface a validation error.
export function normalizePhoneE164(phone: string): string | null {
  const digits = phone.replace(/\D/g, "");
  if (digits.startsWith("33") && digits.length === 11) return `+${digits}`;
  if (digits.startsWith("0") && digits.length === 10) return `+33${digits.slice(1)}`;
  if (phone.startsWith("+") && digits.length >= 8) return `+${digits}`;
  return null;
}
