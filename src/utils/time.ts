import { Language } from '../types';

export function formatTimeAgo(isoString: string, lang: Language = 'en'): string {
  try {
    const date = new Date(isoString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();

    if (diffMs < 0) return lang === 'ta' ? 'சற்று முன்பு' : 'Just now';

    const diffMins = Math.floor(diffMs / (60 * 1000));
    const diffHours = Math.floor(diffMins / 60);
    const diffDays = Math.floor(diffHours / 24);

    if (diffMins < 1) {
      return lang === 'ta' ? 'சற்று முன்பு' : 'Just now';
    }
    if (diffMins === 1) {
      return lang === 'ta' ? '1 நிமிடத்திற்கு முன்' : '1 min ago';
    }
    if (diffMins < 60) {
      return lang === 'ta' ? `${diffMins} நிமிடங்களுக்கு முன்` : `${diffMins} mins ago`;
    }
    if (diffHours === 1) {
      return lang === 'ta' ? '1 மணி நேரத்திற்கு முன்' : '1 hour ago';
    }
    if (diffHours < 24) {
      return lang === 'ta' ? `${diffHours} மணி நேரங்களுக்கு முன்` : `${diffHours} hours ago`;
    }
    if (diffDays === 1) {
      return lang === 'ta' ? 'நேற்று' : 'Yesterday';
    }
    return lang === 'ta' ? `${diffDays} நாட்களுக்கு முன்` : `${diffDays} days ago`;
  } catch {
    return lang === 'ta' ? 'சமீபத்தில்' : 'Recently';
  }
}

export function formatExactTime(isoString: string): string {
  try {
    const date = new Date(isoString);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: true });
  } catch {
    return '';
  }
}
