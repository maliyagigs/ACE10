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

export interface GoogleUser {
  name: string;
  email: string;
  picture: string;
  uid?: string;
  sub?: string;
  type: 'google' | 'email' | 'firebase';
}

export interface FooterSection {
  id: string;
  title: string;
  links: { label: string; url: string; id: string }[];
}

export interface Benefit {
  id: string;
  title: string;
  description: string;
  icon: string;
}

export interface QuoteInquiry {
  id: string;
  name: string;
  email: string;
  message: string;
  date: string;
}

// ... existing interfaces ...

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
    animationType: 'particles' | 'gradient' | 'none'; // ADDED
  };
  servicesHeader?: {
    subTitle: string;
    title: string;
    description: string;
  };
  services: Service[];
  whyChooseUs?: {
    headline: string;
    description: string;
    benefits: Benefit[];
  };
  portfolioHeader?: {
    title: string;
    description: string;
  };
  portfolio: PortfolioItem[];
  testimonialsHeader?: {
    title: string;
    description: string;
  };
  testimonials: Testimonial[];
  stats: Stat[];
  countriesHeader?: {
    subTitle: string;
    title: string;
    description: string;
  };
  countries: Country[];
  contactHeader?: {
    title: string;
    description: string;
    submitSuccessTitle: string;
    submitSuccessDescription: string;
  };
  quoteInquiries: QuoteInquiry[]; // ADDED
  footer: {
    aboutText: string;
    address: string;
    phone: string;
    email: string;
    contactsTitle?: string;
    sections: FooterSection[];
    socials: { provider: string; url: string; id: string }[];
    copyrightText: string;
    legalCookiesLabel?: string;
    securityAuditLabel?: string;
  };
}
