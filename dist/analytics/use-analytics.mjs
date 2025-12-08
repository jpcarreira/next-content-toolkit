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
//# sourceMappingURL=use-analytics.mjs.map
//# sourceMappingURL=use-analytics.mjs.map