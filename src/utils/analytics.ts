export const trackConversion = (eventName: string, label?: string, customData?: Record<string, any>) => {
  try {
    if (typeof window !== "undefined") {
      const dataLayer = (window as any).dataLayer || [];
      dataLayer.push({
        event: eventName,
        event_label: label,
        ...customData
      });
      (window as any).dataLayer = dataLayer;
    }
  } catch (error) {
    console.error("Analytics tracking error:", error);
  }
};
