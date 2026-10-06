/**
 * Centralized WhatsApp Configuration
 * 
 * Configured phone number: 9080707422
 * Stored in official wa.me international format without +, spaces, or hyphens: 919080707422
 */
export const DEFAULT_OWNER_WHATSAPP = "919080707422";
export const DISPLAY_PHONE_NUMBER = "90807 07422";

/**
 * Sanitizes and returns the WhatsApp phone number in the official wa.me format
 * (digits only without +, hyphens, brackets, or spaces).
 */
export function getSanitizedWhatsAppNumber(rawNumber?: string): string {
  if (!rawNumber) {
    return DEFAULT_OWNER_WHATSAPP;
  }
  // Strip all non-digit characters
  const digits = rawNumber.replace(/\D/g, '');
  if (!digits) {
    return DEFAULT_OWNER_WHATSAPP;
  }
  // If 10 digits provided (Indian mobile), prefix country code 91
  if (digits.length === 10) {
    return `91${digits}`;
  }
  return digits;
}
