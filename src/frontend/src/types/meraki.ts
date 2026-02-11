// Local type definitions for Meraki application
// These types should match the backend types once they are implemented

export enum Service {
  consulting = 'consulting',
  coaching = 'coaching',
  workshops = 'workshops',
}

export enum ContactMethod {
  email = 'email',
  phone = 'phone',
}

export interface UserProfile {
  name: string;
}

export interface SiteSettings {
  contactEmail: string;
  contactPhone: string;
  businessName?: string;
  addressLine?: string;
  socialLinks?: string[];
}

export interface Inquiry {
  id: number;
  fullName: string;
  email: string;
  phone: string | null;
  service: Service;
  preferredContactMethod: ContactMethod;
  message: string;
  consent: boolean;
  timestamp: number;
}
