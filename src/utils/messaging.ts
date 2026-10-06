import { Language } from '../types';
import { getSanitizedWhatsAppNumber } from '../config/whatsapp';

export function buildWaterRequestMessage(params: {
  borewellName: string;
  ownerName: string;
  requesterName: string;
  requestMessage?: string;
  lang: Language;
}): string {
  const { borewellName, ownerName, requesterName, requestMessage, lang } = params;

  if (lang === 'ta') {
    const details = requestMessage?.trim() 
      ? requestMessage.trim() 
      : 'தண்ணீர் பகிர முடியுமா என்று தெரியப்படுத்தவும்.';

    return (
      `வணக்கம் ${ownerName},\n` +
      `நான் ${requesterName}, ${borewellName} லிருந்து தண்ணீர் பெற விரும்புகிறேன்.\n` +
      `${details}\n` +
      `நன்றி.`
    );
  }

  // English format
  const details = requestMessage?.trim() 
    ? requestMessage.trim() 
    : 'Please let me know if water can be shared.';

  return (
    `Hello ${ownerName},\n` +
    `I am ${requesterName} and I would like to request water from ${borewellName}.\n` +
    `${details}\n` +
    `Thank you.`
  );
}

/**
 * Builds the official wa.me link:
 * https://wa.me/PHONE_NUMBER?text=ENCODED_MESSAGE
 * Works on Android, iOS, and WhatsApp Web on desktop browsers.
 */
export function buildWhatsAppUrl(rawPhone: string, text: string): string {
  const cleanPhone = getSanitizedWhatsAppNumber(rawPhone);
  return `https://wa.me/${cleanPhone}?text=${encodeURIComponent(text)}`;
}

/**
 * Builds the native mobile SMS link:
 * sms:+PHONE_NUMBER?body=ENCODED_MESSAGE
 */
export function buildSmsUrl(rawPhone: string, text: string): string {
  const cleanPhone = getSanitizedWhatsAppNumber(rawPhone);
  return `sms:+${cleanPhone}?body=${encodeURIComponent(text)}`;
}
