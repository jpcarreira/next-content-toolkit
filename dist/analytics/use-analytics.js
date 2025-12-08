'use strict';

// src/analytics/use-analytics.ts
var useAnalytics = () => {
  const track = (event, data) => {
    if (typeof window !== "undefined" && window.sa_event) {
      window.sa_event(event, data);
    }
  };
  return { track };
};

exports.useAnalytics = useAnalytics;
//# sourceMappingURL=use-analytics.js.map
//# sourceMappingURL=use-analytics.js.map