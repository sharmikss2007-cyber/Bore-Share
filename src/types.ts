export type WaterStatus = 'AVAILABLE' | 'LIMITED' | 'NO_WATER';

export interface Borewell {
  id: string;
  borewellName: string;
  farmerName: string;
  phone: string;
  location: string;
  status: WaterStatus;
  lastUpdated: string; // ISO string
  notes?: string;
  ownerWhatsApp?: string;
}

export interface WaterRequest {
  id: string;
  borewellId: string;
  borewellName: string;
  ownerName: string;
  requesterName: string;
  requesterPhone?: string;
  message: string;
  timestamp: string; // ISO string
  status: 'PENDING' | 'ACCEPTED' | 'COMPLETED';
}

export type ScreenId = 'STATUS' | 'REPORT' | 'REQUEST';
export type Language = 'en' | 'ta';
