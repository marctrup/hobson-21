// Analytics tracking utilities for Google Analytics via GTM

export const trackEvent = (eventName: string, eventParams?: Record<string, any>) => {
  if (typeof window !== 'undefined' && window.dataLayer) {
    window.dataLayer.push({
      event: eventName,
      ...eventParams,
    });
  }
};

// Track CTA button clicks
export const trackCTAClick = (ctaLocation: string, ctaText: string, variant?: string) => {
  trackEvent('cta_click', {
    cta_location: ctaLocation,
    cta_text: ctaText,
    variant: variant || 'unknown',
  });
};

// Track form submissions
export const trackFormSubmit = (formName: string, variant?: string) => {
  trackEvent('form_submit', {
    form_name: formName,
    variant: variant || 'unknown',
  });
};

// Track pilot application submissions
export const trackPilotApplication = (variant?: string) => {
  trackEvent('pilot_application_submit', {
    variant: variant || 'unknown',
  });
};
