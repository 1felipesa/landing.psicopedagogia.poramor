export const trackConversion = (eventName: string, label?: string) => {
  try {
    // Meta Pixel
    if (typeof window !== "undefined" && (window as any).fbq) {
      if (eventName === 'Lead' || eventName === 'Contact' || eventName === 'InitiateCheckout') {
        (window as any).fbq('track', eventName, { content_name: label });
      } else {
        (window as any).fbq('trackCustom', eventName, { content_name: label });
      }
    }
    
    // Google Analytics (GA4)
    if (typeof window !== "undefined" && typeof (window as any).gtag === 'function') {
      (window as any).gtag('event', 'generate_lead', {
        event_category: 'contact',
        event_label: label,
      });
    }
  } catch (error) {
    console.error("Analytics tracking error:", error);
  }
};
