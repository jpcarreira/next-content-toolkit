'use strict';

var jsxRuntime = require('react/jsx-runtime');
var react = require('react');

// src/ui/theme-provider.tsx
function ThemeProvider({ children }) {
  return /* @__PURE__ */ jsxRuntime.jsx(jsxRuntime.Fragment, { children });
}
function useInView(options = {}) {
  const {
    threshold = 0.1,
    rootMargin = "0px",
    triggerOnce = true
  } = options;
  const ref = react.useRef(null);
  const [isInView, setIsInView] = react.useState(false);
  react.useEffect(() => {
    const element = ref.current;
    if (!element) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        const inView = entry.isIntersecting;
        if (inView) {
          setIsInView(true);
          if (triggerOnce) {
            observer.unobserve(element);
          }
        } else if (!triggerOnce) {
          setIsInView(false);
        }
      },
      { threshold, rootMargin }
    );
    observer.observe(element);
    return () => observer.disconnect();
  }, [threshold, rootMargin, triggerOnce]);
  return { ref, isInView };
}
function FadeIn({
  children,
  delay = 0,
  direction = "up",
  duration = 700,
  className = ""
}) {
  const { ref, isInView } = useInView({ threshold: 0.1, triggerOnce: true });
  const directionClasses = {
    up: "translate-y-8",
    down: "-translate-y-8",
    left: "translate-x-8",
    right: "-translate-x-8",
    none: ""
  };
  const initialTransform = directionClasses[direction];
  return /* @__PURE__ */ jsxRuntime.jsx(
    "div",
    {
      ref,
      className: `transition-all ease-out ${isInView ? "opacity-100 translate-y-0 translate-x-0" : `opacity-0 ${initialTransform}`} ${className}`,
      style: {
        transitionDuration: `${duration}ms`,
        transitionDelay: `${delay}ms`
      },
      children
    }
  );
}
function FloatingStars({ count = 20, className = "" }) {
  const [mounted, setMounted] = react.useState(false);
  react.useEffect(() => {
    setMounted(true);
  }, []);
  const stars = react.useMemo(() => {
    if (!mounted) return [];
    const generatedStars = Array.from({ length: count }, (_, i) => {
      const isGalaxy = i % 15 === 0;
      return {
        id: i,
        left: `${Math.random() * 100}%`,
        top: `${Math.random() * 100}%`,
        delay: Math.random() * 10,
        duration: 10 + Math.random() * 20,
        opacity: isGalaxy ? 0.15 + Math.random() * 0.25 : 0.3 + Math.random() * 0.4,
        // Galaxies dimmer: 0.15-0.4, stars: 0.3-0.7
        size: isGalaxy ? 20 + Math.random() * 30 : 1 + Math.random() * 2,
        // Galaxies large: 20-50px, stars: 1-3px
        isGalaxy,
        rotation: isGalaxy ? Math.random() * 360 : 0
      };
    });
    return generatedStars;
  }, [count, mounted]);
  if (!mounted) {
    return /* @__PURE__ */ jsxRuntime.jsx("div", { className: `absolute inset-0 overflow-hidden pointer-events-none ${className}` });
  }
  return /* @__PURE__ */ jsxRuntime.jsx("div", { className: `absolute inset-0 overflow-hidden pointer-events-none ${className}`, children: stars.map((star) => {
    if (star.isGalaxy) {
      return /* @__PURE__ */ jsxRuntime.jsxs(
        "div",
        {
          className: "absolute",
          style: {
            left: star.left,
            top: star.top,
            width: `${star.size}px`,
            height: `${star.size * 0.6}px`,
            // Make it elliptical
            opacity: star.opacity,
            animation: `floatStar ${star.duration}s ease-in-out infinite`,
            animationDelay: `${star.delay}s`,
            transform: `rotate(${star.rotation}deg)`
          },
          children: [
            /* @__PURE__ */ jsxRuntime.jsx(
              "div",
              {
                className: "absolute",
                style: {
                  left: "50%",
                  top: "50%",
                  transform: "translate(-50%, -50%)",
                  width: "20%",
                  height: "30%",
                  background: "rgba(255, 255, 255, 0.8)",
                  borderRadius: "50%",
                  filter: "blur(2px)"
                }
              }
            ),
            /* @__PURE__ */ jsxRuntime.jsx(
              "div",
              {
                className: "absolute inset-0",
                style: {
                  background: `
                    radial-gradient(ellipse at 50% 50%,
                      transparent 10%,
                      rgba(255, 255, 255, 0.15) 15%,
                      transparent 25%,
                      rgba(255, 255, 255, 0.1) 35%,
                      transparent 50%,
                      rgba(255, 255, 255, 0.05) 60%,
                      transparent 80%
                    )
                  `,
                  filter: "blur(3px)"
                }
              }
            ),
            /* @__PURE__ */ jsxRuntime.jsx(
              "div",
              {
                className: "absolute inset-0",
                style: {
                  background: "radial-gradient(ellipse at 50% 50%, rgba(255, 255, 255, 0.05) 0%, transparent 70%)",
                  filter: "blur(6px)",
                  transform: "scale(1.2)"
                }
              }
            )
          ]
        },
        star.id
      );
    }
    return /* @__PURE__ */ jsxRuntime.jsx(
      "div",
      {
        className: "absolute rounded-full bg-white",
        style: {
          left: star.left,
          top: star.top,
          width: `${star.size}px`,
          height: `${star.size}px`,
          opacity: star.opacity,
          animation: `floatStar ${star.duration}s ease-in-out infinite`,
          animationDelay: `${star.delay}s`,
          boxShadow: `0 0 ${star.size}px rgba(255, 255, 255, 0.5)`
        }
      },
      star.id
    );
  }) });
}
function FlipNumber({ value, className = "" }) {
  const [isFlipping, setIsFlipping] = react.useState(false);
  const [displayValue, setDisplayValue] = react.useState(value);
  react.useEffect(() => {
    if (value !== displayValue) {
      setIsFlipping(true);
      setTimeout(() => {
        setDisplayValue(value);
      }, 300);
      setTimeout(() => {
        setIsFlipping(false);
      }, 600);
    }
  }, [value, displayValue]);
  return /* @__PURE__ */ jsxRuntime.jsx("span", { className: `flip-number ${isFlipping ? "flipping" : ""} ${className}`, children: displayValue.toString().padStart(2, "0") });
}
function ConstellationBackground({ count = 3, className = "" }) {
  const [mounted, setMounted] = react.useState(false);
  const [constellations, setConstellations] = react.useState([]);
  react.useEffect(() => {
    setMounted(true);
    const newConstellations = Array.from({ length: count }, () => {
      const starCount = 4 + Math.floor(Math.random() * 4);
      const stars = [];
      const centerX = 20 + Math.random() * 60;
      const centerY = 20 + Math.random() * 60;
      for (let i = 0; i < starCount; i++) {
        stars.push({
          cx: centerX + (Math.random() - 0.5) * 20,
          // Cluster around center
          cy: centerY + (Math.random() - 0.5) * 20,
          r: 0.3 + Math.random() * 0.4,
          // Smaller stars: 0.3-0.7
          opacity: 0.3 + Math.random() * 0.5,
          delay: Math.random() * 3
        });
      }
      const lines = [];
      for (let i = 0; i < stars.length; i++) {
        for (let j = i + 1; j < stars.length; j++) {
          const dx = stars[j].cx - stars[i].cx;
          const dy = stars[j].cy - stars[i].cy;
          const distance = Math.sqrt(dx * dx + dy * dy);
          if (distance < 12) {
            lines.push([i, j]);
          }
        }
      }
      return { stars, lines };
    });
    setConstellations(newConstellations);
  }, [count]);
  if (!mounted) {
    return /* @__PURE__ */ jsxRuntime.jsx("div", { className: `absolute inset-0 pointer-events-none ${className}` });
  }
  return /* @__PURE__ */ jsxRuntime.jsx(
    "svg",
    {
      className: `absolute inset-0 w-full h-full pointer-events-none ${className}`,
      xmlns: "http://www.w3.org/2000/svg",
      viewBox: "0 0 100 100",
      preserveAspectRatio: "xMidYMid slice",
      children: constellations.map((constellation, constellationIndex) => /* @__PURE__ */ jsxRuntime.jsxs("g", { opacity: "0.6", children: [
        constellation.lines.map(([i, j], lineIndex) => /* @__PURE__ */ jsxRuntime.jsx(
          "line",
          {
            x1: constellation.stars[i].cx,
            y1: constellation.stars[i].cy,
            x2: constellation.stars[j].cx,
            y2: constellation.stars[j].cy,
            stroke: "white",
            strokeWidth: "0.1",
            opacity: "0.2"
          },
          `line-${lineIndex}`
        )),
        constellation.stars.map((star, starIndex) => /* @__PURE__ */ jsxRuntime.jsx(
          "circle",
          {
            cx: star.cx,
            cy: star.cy,
            r: star.r,
            fill: "white",
            opacity: star.opacity,
            style: {
              animation: `twinkle 3s ease-in-out infinite`,
              animationDelay: `${star.delay}s`
            }
          },
          `star-${starIndex}`
        ))
      ] }, constellationIndex))
    }
  );
}

exports.ConstellationBackground = ConstellationBackground;
exports.FadeIn = FadeIn;
exports.FlipNumber = FlipNumber;
exports.FloatingStars = FloatingStars;
exports.ThemeProvider = ThemeProvider;
exports.useInView = useInView;
//# sourceMappingURL=index.js.map
//# sourceMappingURL=index.js.map