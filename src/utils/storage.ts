import { Borewell, WaterRequest, WaterStatus } from '../types';
import { INITIAL_BOREWELLS, INITIAL_REQUESTS } from '../data/initialData';

const BOREWELLS_KEY = 'boreshare_borewells_v1';
const REQUESTS_KEY = 'boreshare_requests_v1';

export function loadBorewells(): Borewell[] {
  try {
    const raw = localStorage.getItem(BOREWELLS_KEY);
    if (!raw) {
      localStorage.setItem(BOREWELLS_KEY, JSON.stringify(INITIAL_BOREWELLS));
      return INITIAL_BOREWELLS;
    }
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed) && parsed.length > 0) {
      return parsed;
    }
    return INITIAL_BOREWELLS;
  } catch (e) {
    console.error('Failed to load borewells from localStorage', e);
    return INITIAL_BOREWELLS;
  }
}

export function saveBorewells(borewells: Borewell[]): void {
  try {
    localStorage.setItem(BOREWELLS_KEY, JSON.stringify(borewells));
  } catch (e) {
    console.error('Failed to save borewells', e);
  }
}

export function updateBorewellStatus(
  id: string,
  newStatus: WaterStatus,
  notes?: string
): Borewell[] {
  const current = loadBorewells();
  const nowIso = new Date().toISOString();
  const updated = current.map((b) => {
    if (b.id === id) {
      return {
        ...b,
        status: newStatus,
        lastUpdated: nowIso,
        notes: notes !== undefined ? notes : b.notes,
      };
    }
    return b;
  });
  saveBorewells(updated);
  return updated;
}

export function loadRequests(): WaterRequest[] {
  try {
    const raw = localStorage.getItem(REQUESTS_KEY);
    if (!raw) {
      localStorage.setItem(REQUESTS_KEY, JSON.stringify(INITIAL_REQUESTS));
      return INITIAL_REQUESTS;
    }
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed)) {
      return parsed;
    }
    return INITIAL_REQUESTS;
  } catch (e) {
    console.error('Failed to load requests from localStorage', e);
    return INITIAL_REQUESTS;
  }
}

export function saveRequests(requests: WaterRequest[]): void {
  try {
    localStorage.setItem(REQUESTS_KEY, JSON.stringify(requests));
  } catch (e) {
    console.error('Failed to save requests', e);
  }
}

export function addRequest(request: Omit<WaterRequest, 'id' | 'timestamp' | 'status'>): WaterRequest {
  const current = loadRequests();
  const newReq: WaterRequest = {
    ...request,
    id: `req-${Date.now()}`,
    timestamp: new Date().toISOString(),
    status: 'PENDING',
  };
  const updated = [newReq, ...current];
  saveRequests(updated);
  return newReq;
}

export function resetToDefaults(): { borewells: Borewell[]; requests: WaterRequest[] } {
  localStorage.setItem(BOREWELLS_KEY, JSON.stringify(INITIAL_BOREWELLS));
  localStorage.setItem(REQUESTS_KEY, JSON.stringify(INITIAL_REQUESTS));
  return { borewells: INITIAL_BOREWELLS, requests: INITIAL_REQUESTS };
}
