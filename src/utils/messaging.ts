import { Language } from '../types';

export function getCleanPhoneNumber(phone: string): string {
  // Strip non-digits
  const digits = phone.replace(/\D/g, '');
  if (digits.length === 10) {
    return `91${digits}`;
  }
  if (digits.length > 10 && digits.startsWith('91')) {
    return digits;
  }
  return digits.length > 0 ? digits : '919826144520';
}

export function buildWaterRequestMessage(params: {
  borewellName: string;
  ownerName: string;
  requesterName: string;
  requestMessage: string;
  lang: Language;
}): string {
  const { borewellName, ownerName, requesterName, requestMessage, lang } = params;

  if (lang === 'ta') {
    return (
      `வணக்கம் ${ownerName},\n` +
      `நான் ${requesterName}. உங்கள் போர்வெல்லான "${borewellName}"லிருந்து தண்ணீர் பகிரும்படி கேட்டுக்கொள்கிறேன்.\n\n` +
      `கோரிக்கை: "${requestMessage}"\n\n` +
      `— போர்ஷேர் (கிராம நீர் பகிர்வு வலைத்தளம்)`
    );
  }

  return (
    `Hello ${ownerName},\n` +
    `This is ${requesterName}. I would like to request water sharing from your borewell: "${borewellName}".\n\n` +
    `Request: "${requestMessage}"\n\n` +
    `— Sent via BoreShare (Village Water Sharing)`
  );
}

export function buildWhatsAppUrl(phone: string, text: string): string {
  const cleanPhone = getCleanPhoneNumber(phone);
  return `https://wa.me/${cleanPhone}?text=${encodeURIComponent(text)}`;
}

export function buildSmsUrl(phone: string, text: string): string {
  const cleanPhone = getCleanPhoneNumber(phone);
  // SMS standard URI with recipient & prefilled body
  return `sms:+${cleanPhone}?body=${encodeURIComponent(text)}`;
}
