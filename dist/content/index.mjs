import Link from 'next/link';
import Image from 'next/image';
import { useMDXComponent } from 'next-contentlayer2/hooks';
import { jsx, jsxs } from 'react/jsx-runtime';
import { useRef, useState, useEffect } from 'react';

// src/content/mdx.tsx
var defaultMdxComponents = {
  // Typography
  h1: (props) => /* @__PURE__ */ jsx("h1", { className: "text-3xl font-bold text-white mb-6 mt-8", ...props }),
  h2: (props) => /* @__PURE__ */ jsx("h2", { className: "text-2xl font-bold text-white mb-4 mt-6", ...props }),
  h3: (props) => /* @__PURE__ */ jsx("h3", { className: "text-xl font-semibold text-white mb-3 mt-4", ...props }),
  p: (props) => /* @__PURE__ */ jsx("p", { className: "text-slate-300 leading-relaxed mb-4", ...props }),
  // Lists
  ul: (props) => /* @__PURE__ */ jsx("ul", { className: "space-y-2 text-slate-300 mb-4 list-disc pl-6", ...props }),
  ol: (props) => /* @__PURE__ */ jsx(
    "ol",
    {
      className: "space-y-2 text-slate-300 mb-4 list-decimal pl-6",
      ...props
    }
  ),
  li: (props) => /* @__PURE__ */ jsx("li", { className: "leading-relaxed", ...props }),
  // Links
  a: (props) => /* @__PURE__ */ jsx(
    Link,
    {
      ...props,
      href: props.href || "#",
      className: "text-[#00E0FF] underline decoration-dotted hover:opacity-80 transition-opacity"
    }
  ),
  // Images
  img: (props) => {
    const { src } = props;
    if (!src || typeof src !== "string") return null;
    const isAbsolute = src.startsWith("http");
    if (isAbsolute) {
      return /* @__PURE__ */ jsx("img", { ...props, className: "rounded-lg my-6 w-full", loading: "lazy" });
    }
    return /* @__PURE__ */ jsx(
      Image,
      {
        src,
        alt: props.alt || "",
        width: 800,
        height: 400,
        className: "rounded-lg my-6 w-full h-auto",
        loading: "lazy"
      }
    );
  },
  // Blockquote
  blockquote: (props) => /* @__PURE__ */ jsx(
    "blockquote",
    {
      className: "border-l-4 border-[#00E0FF] pl-6 my-6 text-slate-400 italic",
      ...props
    }
  ),
  // Code blocks
  pre: (props) => /* @__PURE__ */ jsx(
    "pre",
    {
      className: "bg-slate-800/50 rounded-lg p-4 overflow-x-auto mb-4",
      ...props
    }
  ),
  code: (props) => /* @__PURE__ */ jsx(
    "code",
    {
      className: "bg-slate-800/50 px-1.5 py-0.5 rounded text-sm",
      ...props
    }
  ),
  // Tables
  table: (props) => /* @__PURE__ */ jsx("div", { className: "overflow-x-auto mb-6", children: /* @__PURE__ */ jsx("table", { className: "min-w-full divide-y divide-slate-700", ...props }) }),
  thead: (props) => /* @__PURE__ */ jsx("thead", { className: "bg-slate-800/30", ...props }),
  th: (props) => /* @__PURE__ */ jsx("th", { className: "px-4 py-2 text-left text-white font-semibold", ...props }),
  td: (props) => /* @__PURE__ */ jsx("td", { className: "px-4 py-2 text-slate-300", ...props }),
  // Divider
  hr: () => /* @__PURE__ */ jsx("hr", { className: "border-slate-700 my-8" })
};
function Mdx({
  code,
  components = {}
}) {
  const MDXComponent = useMDXComponent(code);
  return /* @__PURE__ */ jsx(MDXComponent, { components: { ...defaultMdxComponents, ...components } });
}
var mdx_default = Mdx;
function XEmbed({
  id,
  theme = "dark",
  conversation = "none",
  align = "center"
}) {
  const embedContainerRef = useRef(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [hasError, setHasError] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const observerRef = useRef(null);
  const getTweetId = (input) => {
    if (input.includes("twitter.com") || input.includes("x.com")) {
      const match = input.match(/status\/(\d+)/);
      return match ? match[1] : input;
    }
    return input;
  };
  const tweetId = getTweetId(id);
  const tweetUrl = `https://twitter.com/x/status/${tweetId}`;
  useEffect(() => {
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
  useEffect(() => {
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
    return /* @__PURE__ */ jsx("div", { className: `my-6 flex ${alignmentClass}`, children: /* @__PURE__ */ jsx("div", { className: "w-full max-w-[550px] bg-slate-800/30 border border-red-500/30 rounded-2xl p-6", children: /* @__PURE__ */ jsxs("div", { className: "flex items-start gap-3", children: [
      /* @__PURE__ */ jsx("div", { className: "text-red-500 mt-1", children: /* @__PURE__ */ jsxs(
        "svg",
        {
          width: "20",
          height: "20",
          viewBox: "0 0 24 24",
          fill: "none",
          stroke: "currentColor",
          strokeWidth: "2",
          children: [
            /* @__PURE__ */ jsx("circle", { cx: "12", cy: "12", r: "10" }),
            /* @__PURE__ */ jsx("line", { x1: "12", y1: "8", x2: "12", y2: "12" }),
            /* @__PURE__ */ jsx("line", { x1: "12", y1: "16", x2: "12.01", y2: "16" })
          ]
        }
      ) }),
      /* @__PURE__ */ jsxs("div", { className: "flex-1", children: [
        /* @__PURE__ */ jsx("p", { className: "text-slate-300 mb-2", children: "This post is no longer available or couldn't be loaded." }),
        /* @__PURE__ */ jsx(
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
  return /* @__PURE__ */ jsxs("div", { className: `my-6 flex ${alignmentClass}`, ref: observerRef, children: [
    !isLoaded && /* @__PURE__ */ jsx("div", { className: "w-full max-w-[550px] bg-slate-800/30 border border-slate-700 rounded-2xl p-6 animate-pulse", children: /* @__PURE__ */ jsxs("div", { className: "flex items-start gap-3", children: [
      /* @__PURE__ */ jsx("div", { className: "w-10 h-10 bg-slate-700 rounded-full" }),
      /* @__PURE__ */ jsxs("div", { className: "flex-1 space-y-3", children: [
        /* @__PURE__ */ jsx("div", { className: "h-4 bg-slate-700 rounded w-1/3" }),
        /* @__PURE__ */ jsx("div", { className: "h-4 bg-slate-700 rounded w-full" }),
        /* @__PURE__ */ jsx("div", { className: "h-4 bg-slate-700 rounded w-2/3" })
      ] })
    ] }) }),
    /* @__PURE__ */ jsx(
      "div",
      {
        ref: embedContainerRef,
        className: `w-full max-w-[550px] ${!isLoaded ? "hidden" : ""}`
      }
    )
  ] });
}
function YouTubeEmbed({
  videoId,
  title = "YouTube video",
  startTime,
  aspectRatio = "16:9"
}) {
  const containerRef = useRef(null);
  const [isVisible, setIsVisible] = useState(false);
  useEffect(() => {
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
  return /* @__PURE__ */ jsx("div", { className: "my-8", ref: containerRef, children: /* @__PURE__ */ jsxs("div", { className: "max-w-4xl mx-auto", children: [
    /* @__PURE__ */ jsx(
      "div",
      {
        className: `relative ${paddingClass} bg-slate-800/30 border border-[#00E0FF]/20 rounded-xl overflow-hidden`,
        children: !isVisible ? /* @__PURE__ */ jsx("div", { className: "absolute inset-0 flex items-center justify-center", children: /* @__PURE__ */ jsxs("div", { className: "text-center", children: [
          /* @__PURE__ */ jsx("div", { className: "w-16 h-16 mx-auto mb-4 bg-slate-700 rounded-full flex items-center justify-center", children: /* @__PURE__ */ jsx(
            "svg",
            {
              className: "w-8 h-8 text-white",
              fill: "currentColor",
              viewBox: "0 0 24 24",
              children: /* @__PURE__ */ jsx("path", { d: "M8 5v14l11-7z" })
            }
          ) }),
          /* @__PURE__ */ jsx("p", { className: "text-slate-400 text-sm", children: title })
        ] }) }) : /* @__PURE__ */ jsx(
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
    title && title !== "YouTube video" && /* @__PURE__ */ jsx("p", { className: "text-sm text-slate-400 text-center mt-3", children: title })
  ] }) });
}
function ContentBlock({ title, children }) {
  return /* @__PURE__ */ jsxs("div", { className: "my-8 p-6 bg-slate-800/30 border border-slate-700 rounded-xl", children: [
    /* @__PURE__ */ jsx("h3", { className: "text-xl font-bold text-white mb-4", children: title }),
    /* @__PURE__ */ jsx("div", { className: "text-slate-300", children })
  ] });
}
function KeyPoints({ children }) {
  return /* @__PURE__ */ jsxs("div", { className: "my-6 p-5 bg-[#00E0FF]/10 border border-[#00E0FF]/30 rounded-lg", children: [
    /* @__PURE__ */ jsx("h4", { className: "text-lg font-semibold text-[#00E0FF] mb-3", children: "Key Points" }),
    /* @__PURE__ */ jsx("div", { className: "text-slate-200", children })
  ] });
}
function InContentAd({ children }) {
  if (!children) {
    return null;
  }
  return /* @__PURE__ */ jsx("div", { className: "my-8 flex justify-center", children });
}

export { ContentBlock, InContentAd, KeyPoints, Mdx, XEmbed, YouTubeEmbed, mdx_default as default, defaultMdxComponents };
//# sourceMappingURL=index.mjs.map
//# sourceMappingURL=index.mjs.map