'use strict';

// src/utils/smooth-scroll.ts
var handleSmoothScroll = (e, targetId) => {
  e.preventDefault();
  const element = document.getElementById(targetId);
  if (element) {
    element.scrollIntoView({ behavior: "smooth" });
  }
};
var scrollToTop = () => {
  window.scrollTo({ top: 0, behavior: "smooth" });
};

exports.handleSmoothScroll = handleSmoothScroll;
exports.scrollToTop = scrollToTop;
//# sourceMappingURL=smooth-scroll.js.map
//# sourceMappingURL=smooth-scroll.js.map