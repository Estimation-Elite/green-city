// Normalize a phone number to E.164. French numbers (10 digits starting
// with 0) become +33XXXXXXXXX. Anything we can't confidently normalize
// returns null so callers can surface a validation error.
//
// Intentionally loose (lead capture must never lose a lead over a borderline
// number). The SMS OTP path uses the stricter libphonenumber-based
// parsePhoneToE164 in otp.ts instead — an SMS send costs money.
export function normalizePhoneE164(phone: string): string | null {
  let digits = phone.replace(/\D/g, "");
  // Prefixe international compose : 0033XXXXXXXXX -> 33XXXXXXXXX.
  if (digits.startsWith("00")) digits = digits.slice(2);
  // Les formulaires Facebook prefixent "+33" puis le prospect saisit son
  // numero avec son 0 initial : +330612345678. Sans ce rattrapage le numero
  // ressort tel quel (12 chiffres) et part casse vers GreenCity/Brevo.
  if (digits.startsWith("330") && digits.length === 12) return `+33${digits.slice(3)}`;
  if (digits.startsWith("33") && digits.length === 11) return `+${digits}`;
  if (digits.startsWith("0") && digits.length === 10) return `+33${digits.slice(1)}`;
  if (phone.startsWith("+") && digits.length >= 8) return `+${digits}`;
  return null;
}
