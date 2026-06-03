export interface Service {
  id: string;
  title: string;
  description: string;
  icon?: string; // Optional lucide icon name
}

export interface PortfolioItem {
  id: string;
  title: string;
  description: string;
  image: string;       // Custom mockup image
  webUrl: string;      // Premium Web URL preview
  category: string;    // Category filtering
}

export interface Testimonial {
  id: string;
  name: string;
  company: string;
  quote: string;
  image: string;
}

export interface Stat {
  id: string;
  value: number;
  suffix: string;
  label: string;
}

export interface HeroImageSub {
  id: string;
  url: string;
  alt: string;
}

export interface Country {
  id: string;
  code: string; // e.g., 'US', 'GB'
  name: string;
}

export interface FooterSection {
  id: string;
  title: string;
  links: { label: string; url: string; id: string }[];
}

export interface AppContent {
  siteName: string;
  theme: {
    primaryColor: string; // Hex code
    secondaryColor: string;
    accentColor: string;
    bgOpacity: number; // For translucent sections (glassmorphism)
    enableDarkGlass: boolean;
  };
  hero: {
    headline: string;
    subheadline: string;
    image: string; // Hero section image (ambient particle effect uses this)
    subImages: HeroImageSub[]; // Images underneath CTA buttons requested by user
  };
  services: Service[];
  portfolio: PortfolioItem[];
  testimonials: Testimonial[];
  stats: Stat[];
  countries: Country[];
  footer: {
    aboutText: string;
    address: string;
    phone: string;
    email: string;
    sections: FooterSection[];
    socials: { provider: string; url: string; id: string }[];
    copyrightText: string;
  };
}
