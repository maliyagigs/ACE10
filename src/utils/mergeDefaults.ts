import { AppContent } from '../types';

export function mergeContentWithDefaults(content: any, defaults: AppContent): AppContent {
  if (!content || typeof content !== 'object') return defaults;
  
  const merged: any = { ...defaults, ...content };
  
  // Merge deep objects carefully
  if (content.theme && typeof content.theme === 'object') {
    merged.theme = { ...defaults.theme, ...content.theme };
  } else {
    merged.theme = defaults.theme;
  }
  
  if (content.hero && typeof content.hero === 'object') {
    merged.hero = { ...defaults.hero, ...content.hero };
    if (!Array.isArray(merged.hero.subImages)) {
      merged.hero.subImages = defaults.hero.subImages || [];
    }
  } else {
    merged.hero = defaults.hero;
  }
  
  if (content.servicesHeader && typeof content.servicesHeader === 'object') {
    merged.servicesHeader = { ...defaults.servicesHeader, ...content.servicesHeader };
  } else {
    merged.servicesHeader = defaults.servicesHeader;
  }
  
  if (content.whyChooseUs && typeof content.whyChooseUs === 'object') {
    merged.whyChooseUs = { ...defaults.whyChooseUs, ...content.whyChooseUs };
    if (!Array.isArray(merged.whyChooseUs.benefits)) {
      merged.whyChooseUs.benefits = defaults.whyChooseUs?.benefits || [];
    }
  } else {
    merged.whyChooseUs = defaults.whyChooseUs;
  }

  if (content.portfolioHeader && typeof content.portfolioHeader === 'object') {
    merged.portfolioHeader = { ...defaults.portfolioHeader, ...content.portfolioHeader };
  } else {
    merged.portfolioHeader = defaults.portfolioHeader;
  }

  if (content.testimonialsHeader && typeof content.testimonialsHeader === 'object') {
    merged.testimonialsHeader = { ...defaults.testimonialsHeader, ...content.testimonialsHeader };
  } else {
    merged.testimonialsHeader = defaults.testimonialsHeader;
  }

  if (content.countriesHeader && typeof content.countriesHeader === 'object') {
    merged.countriesHeader = { ...defaults.countriesHeader, ...content.countriesHeader };
  } else {
    merged.countriesHeader = defaults.countriesHeader;
  }

  if (content.contactHeader && typeof content.contactHeader === 'object') {
    merged.contactHeader = { ...defaults.contactHeader, ...content.contactHeader };
  } else {
    merged.contactHeader = defaults.contactHeader;
  }

  if (content.footer && typeof content.footer === 'object') {
    merged.footer = { ...defaults.footer, ...content.footer };
    if (!Array.isArray(merged.footer.socials)) {
      merged.footer.socials = defaults.footer.socials || [];
    }
    if (!Array.isArray(merged.footer.sections)) {
      merged.footer.sections = defaults.footer.sections || [];
    }
  } else {
    merged.footer = defaults.footer;
  }

  // Ensure arrays are arrays
  const arrayFields = ['services', 'portfolio', 'testimonials', 'stats', 'countries', 'quoteInquiries'];
  arrayFields.forEach(field => {
    if (!Array.isArray(content[field])) {
      merged[field] = (defaults as any)[field] || [];
    } else {
      merged[field] = content[field];
    }
  });

  return merged as AppContent;
}
