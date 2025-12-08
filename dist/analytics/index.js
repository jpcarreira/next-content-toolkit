'use strict';

require('react');

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
//# sourceMappingURL=index.js.map
//# sourceMappingURL=index.js.map