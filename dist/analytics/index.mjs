import 'react';

// src/analytics/use-analytics.ts
var useAnalytics = () => {
  const track = (event, data) => {
    if (typeof window !== "undefined" && window.sa_event) {
      window.sa_event(event, data);
    }
  };
  return { track };
};

export { useAnalytics };
//# sourceMappingURL=index.mjs.map
//# sourceMappingURL=index.mjs.map