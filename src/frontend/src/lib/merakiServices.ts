import { Service } from '../backend';

export type MerakiServiceKey = 'numerology' | 'vaastu' | 'aura' | 'reiki';

export interface MerakiService {
  key: MerakiServiceKey;
  label: string;
  shortDescription: string;
  fullDescription: string;
  whatToExpect: string[];
  icon: string;
  backendValue: Service;
}

export const MERAKI_SERVICES: Record<MerakiServiceKey, MerakiService> = {
  numerology: {
    key: 'numerology',
    label: 'Numerology',
    shortDescription: 'Unlock the hidden meanings in numbers and discover your life path, destiny, and soul purpose.',
    fullDescription: 'Numerology is the ancient science of numbers that reveals the deeper patterns and meanings in your life. Through careful analysis of your birth date and name, we uncover insights about your personality, strengths, challenges, and life purpose.',
    whatToExpect: [
      'Detailed analysis of your life path number and destiny number',
      'Insights into your personality traits and natural talents',
      'Guidance on favorable dates and timing for important decisions',
      'Understanding of recurring patterns and cycles in your life',
      'Personalized recommendations for achieving balance and success'
    ],
    icon: '/assets/generated/icon-numerology.dim_256x256.png',
    backendValue: Service.consulting
  },
  vaastu: {
    key: 'vaastu',
    label: 'Vaastu Shastra',
    shortDescription: 'Harmonize your living and working spaces with ancient Vedic principles for prosperity and well-being.',
    fullDescription: 'Vaastu Shastra is the traditional Indian system of architecture and design that creates harmony between your environment and natural forces. By aligning your space with cosmic energies, we help you create an environment that supports health, prosperity, and peace.',
    whatToExpect: [
      'Comprehensive analysis of your home or office layout',
      'Identification of energy imbalances and their effects',
      'Practical remedies and adjustments for optimal energy flow',
      'Guidance on room placement, colors, and directional alignments',
      'Solutions that respect your existing structure and budget'
    ],
    icon: '/assets/generated/icon-vaastu.dim_256x256.png',
    backendValue: Service.coaching
  },
  aura: {
    key: 'aura',
    label: 'Aura Scanning',
    shortDescription: 'Visualize and understand your energy field to identify blockages and enhance your spiritual well-being.',
    fullDescription: 'Aura scanning reveals the subtle energy field that surrounds your body, providing insights into your physical, emotional, mental, and spiritual state. By reading the colors, patterns, and intensity of your aura, we identify areas of strength and imbalance.',
    whatToExpect: [
      'Visual representation and interpretation of your aura colors',
      'Identification of energy blockages and their root causes',
      'Insights into your emotional and spiritual state',
      'Personalized healing recommendations and practices',
      'Guidance on maintaining and strengthening your energy field'
    ],
    icon: '/assets/generated/icon-aura.dim_256x256.png',
    backendValue: Service.workshops
  },
  reiki: {
    key: 'reiki',
    label: 'Reiki Healing',
    shortDescription: 'Experience deep relaxation and healing through the gentle flow of universal life force energy.',
    fullDescription: 'Reiki is a Japanese healing technique that channels universal life force energy to promote physical, emotional, and spiritual healing. Through gentle touch or distance healing, we help restore balance, reduce stress, and activate your body\'s natural healing abilities.',
    whatToExpect: [
      'Deeply relaxing and rejuvenating healing session',
      'Release of physical tension and emotional blockages',
      'Enhanced sense of peace, clarity, and well-being',
      'Support for physical healing and pain management',
      'Guidance on self-healing practices and energy maintenance'
    ],
    icon: '/assets/generated/icon-reiki.dim_256x256.png',
    backendValue: Service.consulting
  }
};

export function getServiceByKey(key: MerakiServiceKey): MerakiService {
  return MERAKI_SERVICES[key];
}

export function getServiceKeyFromUrl(): MerakiServiceKey | null {
  const params = new URLSearchParams(window.location.search);
  const service = params.get('service');
  if (service && service in MERAKI_SERVICES) {
    return service as MerakiServiceKey;
  }
  return null;
}

export function getAllServices(): MerakiService[] {
  return Object.values(MERAKI_SERVICES);
}

