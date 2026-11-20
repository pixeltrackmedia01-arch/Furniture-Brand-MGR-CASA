// Mock enquiry service. Replace submitEnquiry's body with a fetch() to the real API later;
// the payload shape is what a backend should accept.
import { load, save } from './storage';

export interface EnquiryItem {
  productSlug: string;
  variantId: string;
  title: string;
  variantLabel: string;
  qty: number;
  price: number;
  image: string;
}

export interface EnquiryPayload {
  kind: 'product' | 'list' | 'trade' | 'contact' | 'studio-visit';
  name: string;
  email: string;
  phone: string;
  city?: string;
  pincode?: string;
  buyerType?: 'home' | 'business' | 'designer';
  company?: string;
  gstin?: string;
  seats?: string;
  timeline?: string;
  message?: string;
  contactPreference?: 'phone' | 'whatsapp' | 'email';
  items?: EnquiryItem[];
}

export interface EnquiryRecord extends EnquiryPayload {
  reference: string;
  createdAt: string;
}

const KEY = 'mgr.enquiries';

export async function submitEnquiry(payload: EnquiryPayload): Promise<EnquiryRecord> {
  await new Promise((r) => setTimeout(r, 900)); // simulate network
  const record: EnquiryRecord = {
    ...payload,
    reference: 'MGR-' + Date.now().toString(36).toUpperCase().slice(-6),
    createdAt: new Date().toISOString(),
  };
  save(KEY, [record, ...load<EnquiryRecord[]>(KEY, [])].slice(0, 50));
  return record;
}

export const pastEnquiries = () => load<EnquiryRecord[]>(KEY, []);

export function validate(p: Partial<EnquiryPayload>, required: (keyof EnquiryPayload)[]) {
  const errors: Partial<Record<keyof EnquiryPayload, string>> = {};
  for (const k of required) if (!String(p[k] ?? '').trim()) errors[k] = 'Required';
  if (p.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(p.email)) errors.email = 'Enter a valid email';
  if (p.phone && !/^(\+?91[\s-]?)?[6-9]\d{4}[\s-]?\d{5}$/.test(p.phone.trim())) errors.phone = 'Enter a valid Indian mobile number';
  if (p.pincode && !/^\d{6}$/.test(p.pincode)) errors.pincode = '6-digit pincode';
  if (p.gstin && !/^\d{2}[A-Z]{5}\d{4}[A-Z][1-9A-Z]Z[0-9A-Z]$/i.test(p.gstin)) errors.gstin = 'Check the GSTIN format';
  return errors;
}
