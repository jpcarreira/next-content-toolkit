'use strict';

var react = require('react');
var jsxRuntime = require('react/jsx-runtime');

// src/content/youtube-embed.tsx
function YouTubeEmbed({
  videoId,
  title = "YouTube video",
  startTime,
  aspectRatio = "16:9"
}) {
  const containerRef = react.useRef(null);
  const [isVisible, setIsVisible] = react.useState(false);
  react.useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsVisible(true);
            observer.disconnect();
          }
        });
      },
      { rootMargin: "100px" }
    );
    if (containerRef.current) {
      observer.observe(containerRef.current);
    }
    return () => observer.disconnect();
  }, []);
  const buildYouTubeUrl = () => {
    const baseUrl = `https://www.youtube-nocookie.com/embed/${videoId}`;
    const params = new URLSearchParams({
      rel: "0",
      modestbranding: "1",
      ...startTime && { start: startTime.toString() }
    });
    return `${baseUrl}?${params.toString()}`;
  };
  const paddingClass = aspectRatio === "16:9" ? "pb-[56.25%]" : "pb-[75%]";
  return /* @__PURE__ */ jsxRuntime.jsx("div", { className: "my-8", ref: containerRef, children: /* @__PURE__ */ jsxRuntime.jsxs("div", { className: "max-w-4xl mx-auto", children: [
    /* @__PURE__ */ jsxRuntime.jsx(
      "div",
      {
        className: `relative ${paddingClass} bg-slate-800/30 border border-[#00E0FF]/20 rounded-xl overflow-hidden`,
        children: !isVisible ? /* @__PURE__ */ jsxRuntime.jsx("div", { className: "absolute inset-0 flex items-center justify-center", children: /* @__PURE__ */ jsxRuntime.jsxs("div", { className: "text-center", children: [
          /* @__PURE__ */ jsxRuntime.jsx("div", { className: "w-16 h-16 mx-auto mb-4 bg-slate-700 rounded-full flex items-center justify-center", children: /* @__PURE__ */ jsxRuntime.jsx(
            "svg",
            {
              className: "w-8 h-8 text-white",
              fill: "currentColor",
              viewBox: "0 0 24 24",
              children: /* @__PURE__ */ jsxRuntime.jsx("path", { d: "M8 5v14l11-7z" })
            }
          ) }),
          /* @__PURE__ */ jsxRuntime.jsx("p", { className: "text-slate-400 text-sm", children: title })
        ] }) }) : /* @__PURE__ */ jsxRuntime.jsx(
          "iframe",
          {
            className: "absolute inset-0 w-full h-full",
            src: buildYouTubeUrl(),
            title,
            allow: "accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture",
            allowFullScreen: true,
            loading: "lazy",
            style: { border: 0 }
          }
        )
      }
    ),
    title && title !== "YouTube video" && /* @__PURE__ */ jsxRuntime.jsx("p", { className: "text-sm text-slate-400 text-center mt-3", children: title })
  ] }) });
}
function XEmbed({
  id,
  theme = "dark",
  conversation = "none",
  align = "center"
}) {
  const embedContainerRef = react.useRef(null);
  const [isLoaded, setIsLoaded] = react.useState(false);
  const [hasError, setHasError] = react.useState(false);
  const [isVisible, setIsVisible] = react.useState(false);
  const observerRef = react.useRef(null);
  const getTweetId = (input) => {
    if (input.includes("twitter.com") || input.includes("x.com")) {
      const match = input.match(/status\/(\d+)/);
      return match ? match[1] : input;
    }
    return input;
  };
  const tweetId = getTweetId(id);
  const tweetUrl = `https://twitter.com/x/status/${tweetId}`;
  react.useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsVisible(true);
            observer.disconnect();
          }
        });
      },
      { rootMargin: "100px" }
    );
    if (observerRef.current) {
      observer.observe(observerRef.current);
    }
    return () => observer.disconnect();
  }, []);
  react.useEffect(() => {
    if (!isVisible) return;
    const fetchTweet = async () => {
      try {
        const params = new URLSearchParams({
          url: tweetUrl,
          theme,
          align,
          dnt: "true"
        });
        if (conversation === "none") {
          params.append("conversation", "none");
        }
        const response = await fetch(
          `https://publish.twitter.com/oembed?${params.toString()}`
        );
        if (!response.ok) {
          throw new Error("Tweet not found");
        }
        const data = await response.json();
        if (data.html) {
          setTimeout(() => {
            if (embedContainerRef.current) {
              embedContainerRef.current.innerHTML = data.html;
              if (!window.twttr) {
                const script = document.createElement("script");
                script.src = "https://platform.twitter.com/widgets.js";
                script.async = true;
                script.onload = () => {
                  if (window.twttr?.widgets && embedContainerRef.current) {
                    window.twttr.widgets.load(embedContainerRef.current);
                  }
                };
                document.body.appendChild(script);
              } else if (window.twttr.widgets && embedContainerRef.current) {
                window.twttr.widgets.load(embedContainerRef.current);
              }
              setIsLoaded(true);
            }
          }, 0);
        } else {
          throw new Error("No HTML returned");
        }
      } catch (error) {
        console.error("Failed to load tweet:", error);
        setHasError(true);
      }
    };
    fetchTweet();
  }, [isVisible, tweetUrl, theme, conversation, align]);
  const alignmentClass = {
    left: "justify-start",
    center: "justify-center",
    right: "justify-end"
  }[align];
  if (hasError) {
    return /* @__PURE__ */ jsxRuntime.jsx("div", { className: `my-6 flex ${alignmentClass}`, children: /* @__PURE__ */ jsxRuntime.jsx("div", { className: "w-full max-w-[550px] bg-slate-800/30 border border-red-500/30 rounded-2xl p-6", children: /* @__PURE__ */ jsxRuntime.jsxs("div", { className: "flex items-start gap-3", children: [
      /* @__PURE__ */ jsxRuntime.jsx("div", { className: "text-red-500 mt-1", children: /* @__PURE__ */ jsxRuntime.jsxs(
        "svg",
        {
          width: "20",
          height: "20",
          viewBox: "0 0 24 24",
          fill: "none",
          stroke: "currentColor",
          strokeWidth: "2",
          children: [
            /* @__PURE__ */ jsxRuntime.jsx("circle", { cx: "12", cy: "12", r: "10" }),
            /* @__PURE__ */ jsxRuntime.jsx("line", { x1: "12", y1: "8", x2: "12", y2: "12" }),
            /* @__PURE__ */ jsxRuntime.jsx("line", { x1: "12", y1: "16", x2: "12.01", y2: "16" })
          ]
        }
      ) }),
      /* @__PURE__ */ jsxRuntime.jsxs("div", { className: "flex-1", children: [
        /* @__PURE__ */ jsxRuntime.jsx("p", { className: "text-slate-300 mb-2", children: "This post is no longer available or couldn't be loaded." }),
        /* @__PURE__ */ jsxRuntime.jsx(
          "a",
          {
            href: tweetUrl,
            target: "_blank",
            rel: "noopener noreferrer",
            className: "text-[#00E0FF] text-sm hover:underline",
            children: "View on X \u2192"
          }
        )
      ] })
    ] }) }) });
  }
  return /* @__PURE__ */ jsxRuntime.jsxs("div", { className: `my-6 flex ${alignmentClass}`, ref: observerRef, children: [
    !isLoaded && /* @__PURE__ */ jsxRuntime.jsx("div", { className: "w-full max-w-[550px] bg-slate-800/30 border border-slate-700 rounded-2xl p-6 animate-pulse", children: /* @__PURE__ */ jsxRuntime.jsxs("div", { className: "flex items-start gap-3", children: [
      /* @__PURE__ */ jsxRuntime.jsx("div", { className: "w-10 h-10 bg-slate-700 rounded-full" }),
      /* @__PURE__ */ jsxRuntime.jsxs("div", { className: "flex-1 space-y-3", children: [
        /* @__PURE__ */ jsxRuntime.jsx("div", { className: "h-4 bg-slate-700 rounded w-1/3" }),
        /* @__PURE__ */ jsxRuntime.jsx("div", { className: "h-4 bg-slate-700 rounded w-full" }),
        /* @__PURE__ */ jsxRuntime.jsx("div", { className: "h-4 bg-slate-700 rounded w-2/3" })
      ] })
    ] }) }),
    /* @__PURE__ */ jsxRuntime.jsx(
      "div",
      {
        ref: embedContainerRef,
        className: `w-full max-w-[550px] ${!isLoaded ? "hidden" : ""}`
      }
    )
  ] });
}

exports.XEmbed = XEmbed;
exports.YouTubeEmbed = YouTubeEmbed;
//# sourceMappingURL=index.js.map
//# sourceMappingURL=index.js.map