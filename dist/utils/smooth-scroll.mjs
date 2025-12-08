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

export { handleSmoothScroll, scrollToTop };
//# sourceMappingURL=smooth-scroll.mjs.map
//# sourceMappingURL=smooth-scroll.mjs.map