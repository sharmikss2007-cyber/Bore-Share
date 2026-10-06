import { Borewell, WaterRequest } from '../types';
import { DEFAULT_OWNER_WHATSAPP, DISPLAY_PHONE_NUMBER } from '../config/whatsapp';

export const VILLAGE_INFO = {
  name: 'Rampur Khurd',
  district: 'Dhar District',
  state: 'Madhya Pradesh',
  subdistrict: 'Badnawar Tehsil',
  totalBorewells: 7,
};

export const INITIAL_BOREWELLS: Borewell[] = [
  {
    id: 'bw-1',
    borewellName: 'Badi Khet Main Borewell',
    farmerName: 'Ramesh Patel',
    phone: DISPLAY_PHONE_NUMBER,
    ownerWhatsApp: DEFAULT_OWNER_WHATSAPP,
    location: 'North Field (Plot #12)',
    status: 'AVAILABLE',
    lastUpdated: new Date(Date.now() - 25 * 60 * 1000).toISOString(), // 25 mins ago
    notes: 'Good 2.5-inch water discharge. Available for sharing for 3 to 4 hours today.',
  },
  {
    id: 'bw-2',
    borewellName: 'Canal Road Tubewell',
    farmerName: 'Suresh Yadav',
    phone: DISPLAY_PHONE_NUMBER,
    ownerWhatsApp: DEFAULT_OWNER_WHATSAPP,
    location: 'Near Old Canal Bridge',
    status: 'AVAILABLE',
    lastUpdated: new Date(Date.now() - 55 * 60 * 1000).toISOString(), // 55 mins ago
    notes: 'Electricity on 3-phase till 4 PM. Can share water for wheat / gram crops.',
  },
  {
    id: 'bw-3',
    borewellName: 'East Meadow Submersible',
    farmerName: 'Jagdish Verma',
    phone: DISPLAY_PHONE_NUMBER,
    ownerWhatsApp: DEFAULT_OWNER_WHATSAPP,
    location: 'East Meadow (Plot #29)',
    status: 'LIMITED',
    lastUpdated: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(), // 2 hours ago
    notes: 'Water level dropping after 45 minutes of continuous pumping. Intermittent supply only.',
  },
  {
    id: 'bw-4',
    borewellName: 'Well #4 Old Orchard',
    farmerName: 'Balram Singh Thakur',
    phone: DISPLAY_PHONE_NUMBER,
    ownerWhatsApp: DEFAULT_OWNER_WHATSAPP,
    location: 'Mango Orchard Sector',
    status: 'NO_WATER',
    lastUpdated: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString(), // 4 hours ago
    notes: 'Completely dried up since yesterday. Silt coming out. Motor switched off.',
  },
  {
    id: 'bw-5',
    borewellName: 'South Slope Solar Pump',
    farmerName: 'Sunita Devi',
    phone: DISPLAY_PHONE_NUMBER,
    ownerWhatsApp: DEFAULT_OWNER_WHATSAPP,
    location: 'South Terraced Field',
    status: 'AVAILABLE',
    lastUpdated: new Date(Date.now() - 80 * 60 * 1000).toISOString(), // 1 hr 20 mins ago
    notes: 'Solar pump running well with sunshine. Happy to share 2 hours for vegetable plots.',
  },
  {
    id: 'bw-6',
    borewellName: 'Panchayat Boundary Borewell',
    farmerName: 'Kamal Kishore Sharma',
    phone: DISPLAY_PHONE_NUMBER,
    ownerWhatsApp: DEFAULT_OWNER_WHATSAPP,
    location: 'West Road Border',
    status: 'LIMITED',
    lastUpdated: new Date(Date.now() - 3 * 60 * 60 * 1000).toISOString(), // 3 hours ago
    notes: 'Yield has dropped to 1 inch. Can only support small urgent needs.',
  },
  {
    id: 'bw-7',
    borewellName: 'Deep Rock Borewell #2',
    farmerName: 'Mukesh Choudhary',
    phone: DISPLAY_PHONE_NUMBER,
    ownerWhatsApp: DEFAULT_OWNER_WHATSAPP,
    location: 'Rocky Ridge Zone',
    status: 'NO_WATER',
    lastUpdated: new Date(Date.now() - 6 * 60 * 60 * 1000).toISOString(), // 6 hours ago
    notes: 'Dry borewell. Water table dropped below 600 ft.',
  },
];

export const INITIAL_REQUESTS: WaterRequest[] = [
  {
    id: 'req-1',
    borewellId: 'bw-1',
    borewellName: 'Badi Khet Main Borewell',
    ownerName: 'Ramesh Patel',
    requesterName: 'Balram Singh Thakur',
    requesterPhone: '98930 11244',
    message: 'My borewell went dry. Need water for 2 hours for drying cotton seedlings urgently.',
    timestamp: new Date(Date.now() - 35 * 60 * 1000).toISOString(),
    status: 'ACCEPTED',
  },
];
