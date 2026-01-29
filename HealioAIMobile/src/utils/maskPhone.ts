export function maskPhone(phone: string): string {
  const digits = phone.replace(/\D/g, '').slice(-10);
  if (digits.length <= 4) return phone;
  return `+91 XXXXXX${digits.slice(-4)}`;
}
