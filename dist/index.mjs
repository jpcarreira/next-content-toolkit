import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { MongoClient } from 'mongodb';
import { useRef, useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useMDXComponent } from 'next-contentlayer2/hooks';
import { jsx, jsxs, Fragment } from 'react/jsx-runtime';

// src/utils/cn.ts
function cn(...inputs) {
  return twMerge(clsx(inputs));
}

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

// src/utils/date.ts
function formatDate(date, options = {
  year: "numeric",
  month: "long",
  day: "numeric"
}) {
  const dateObj = typeof date === "string" ? new Date(date) : date;
  return dateObj.toLocaleDateString("en-US", options);
}
function formatDateShort(date) {
  return formatDate(date, {
    year: "numeric",
    month: "short",
    day: "numeric"
  });
}
function getRelativeTime(date) {
  const dateObj = typeof date === "string" ? new Date(date) : date;
  const now = /* @__PURE__ */ new Date();
  const diffInMs = now.getTime() - dateObj.getTime();
  const diffInDays = Math.floor(diffInMs / (1e3 * 60 * 60 * 24));
  if (diffInDays === 0) return "Today";
  if (diffInDays === 1) return "Yesterday";
  if (diffInDays < 7) return `${diffInDays} days ago`;
  if (diffInDays < 30) return `${Math.floor(diffInDays / 7)} weeks ago`;
  if (diffInDays < 365) return `${Math.floor(diffInDays / 30)} months ago`;
  return `${Math.floor(diffInDays / 365)} years ago`;
}
var cachedClient = null;
var cachedDb = null;
async function connectToDatabase(options = {}) {
  const MONGODB_URI = options.uri || process.env.MONGODB_URI;
  const MONGODB_DB = options.dbName || process.env.MONGODB_DB || "database";
  console.log("[MongoDB] Connection requested with dbName:", options.dbName || "not specified");
  console.log("[MongoDB] MONGODB_DB env:", process.env.MONGODB_DB || "not set");
  console.log("[MongoDB] Using database:", MONGODB_DB);
  if (!MONGODB_URI) {
    throw new Error("Please define the MONGODB_URI environment variable");
  }
  if (cachedClient && cachedDb) {
    console.log("[MongoDB] Using cached connection to database:", cachedDb.databaseName);
    try {
      await cachedClient.db().admin().ping();
      return { client: cachedClient, db: cachedDb };
    } catch (error) {
      console.log("Cached MongoDB connection is dead, reconnecting...");
      cachedClient = null;
      cachedDb = null;
    }
  }
  console.log("[MongoDB] Connecting to MongoDB...");
  const client = new MongoClient(MONGODB_URI, {
    serverSelectionTimeoutMS: options.serverSelectionTimeoutMS || 5e3,
    family: options.family || 4
  });
  try {
    await client.connect();
    const db = client.db(MONGODB_DB);
    cachedClient = client;
    cachedDb = db;
    console.log("[MongoDB] Successfully connected to database:", db.databaseName);
    return { client, db };
  } catch (error) {
    console.error("Failed to connect to MongoDB:", error);
    throw new Error(
      `MongoDB connection failed: ${error instanceof Error ? error.message : "Unknown error"}`
    );
  }
}
async function closeConnection() {
  if (cachedClient) {
    await cachedClient.close();
    cachedClient = null;
    cachedDb = null;
    console.log("MongoDB connection closed");
  }
}
function createMongoDBConnection(config) {
  return () => connectToDatabase(config);
}

// src/database/newsletter.ts
var NewsletterService = class {
  constructor(config = {}) {
    this.collectionName = config.collectionName || "newsletter_subscribers";
    this.dbName = config.dbName;
  }
  /**
   * Subscribe a new email to the newsletter
   */
  async subscribe(email, metadata) {
    if (!email) {
      throw new Error("Email is required");
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      throw new Error("Invalid email format");
    }
    const { db } = await connectToDatabase({ dbName: this.dbName });
    const collection = db.collection(this.collectionName);
    const existingSubscriber = await collection.findOne({ email });
    if (existingSubscriber) {
      if (!existingSubscriber.active) {
        await collection.updateOne(
          { email },
          {
            $set: {
              active: true,
              resubscribedAt: /* @__PURE__ */ new Date()
            }
          }
        );
        return {
          id: existingSubscriber._id?.toString() || "",
          message: "Successfully resubscribed to newsletter"
        };
      }
      throw new Error("Email already subscribed");
    }
    const result = await collection.insertOne({
      email,
      subscribedAt: /* @__PURE__ */ new Date(),
      active: true,
      source: "website",
      metadata
    });
    return {
      id: result.insertedId.toString(),
      message: "Successfully subscribed to newsletter"
    };
  }
  /**
   * Unsubscribe an email from the newsletter (soft delete)
   */
  async unsubscribe(email) {
    if (!email) {
      throw new Error("Email is required");
    }
    const { db } = await connectToDatabase({ dbName: this.dbName });
    const collection = db.collection(this.collectionName);
    const result = await collection.updateOne(
      { email },
      {
        $set: {
          active: false,
          unsubscribedAt: /* @__PURE__ */ new Date()
        }
      }
    );
    if (result.matchedCount === 0) {
      throw new Error("Email not found");
    }
    return { message: "Successfully unsubscribed from newsletter" };
  }
  /**
   * Get all active subscribers
   */
  async getActiveSubscribers() {
    const { db } = await connectToDatabase({ dbName: this.dbName });
    const collection = db.collection(this.collectionName);
    return collection.find({ active: true }).toArray();
  }
  /**
   * Get subscriber count
   */
  async getSubscriberCount() {
    const { db } = await connectToDatabase({ dbName: this.dbName });
    const collection = db.collection(this.collectionName);
    return collection.countDocuments({ active: true });
  }
};
function createNewsletterService(config) {
  return new NewsletterService(config);
}

// src/analytics/use-analytics.ts
var useAnalytics = () => {
  const track = (event, data) => {
    if (typeof window !== "undefined" && window.sa_event) {
      window.sa_event(event, data);
    }
  };
  return { track };
};
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
  endTime,
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
      ...startTime && { start: startTime.toString() },
      ...endTime && { end: endTime.toString() }
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
function SuccessMessage({
  title,
  description,
  icon
}) {
  return /* @__PURE__ */ jsxs("div", { className: "text-center py-8", children: [
    icon ? /* @__PURE__ */ jsx("div", { className: "mx-auto mb-4", children: icon }) : /* @__PURE__ */ jsx(
      "svg",
      {
        className: "h-16 w-16 text-[#00E0FF] mx-auto mb-4",
        fill: "none",
        viewBox: "0 0 24 24",
        stroke: "currentColor",
        children: /* @__PURE__ */ jsx(
          "path",
          {
            strokeLinecap: "round",
            strokeLinejoin: "round",
            strokeWidth: 2,
            d: "M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
          }
        )
      }
    ),
    /* @__PURE__ */ jsx("h3", { className: "text-2xl font-bold text-white mb-2", children: title }),
    /* @__PURE__ */ jsx("p", { className: "text-slate-300", children: description })
  ] });
}
function NewsletterForm({
  apiEndpoint = "/api/newsletter",
  title = "Stay Updated",
  description = "Get the latest updates directly in your inbox",
  buttonText = "Subscribe",
  successTitle = "Successfully Subscribed!",
  successDescription = "Welcome aboard! You'll receive updates in your inbox.",
  className = "",
  onSuccess,
  onError
}) {
  const [email, setEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const response = await fetch(apiEndpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ email })
      });
      const data = await response.json();
      if (!response.ok) {
        if (response.status === 409) {
          alert("This email is already subscribed to our newsletter.");
        } else {
          throw new Error(data.error || "Failed to subscribe");
        }
      } else {
        setShowSuccess(true);
        onSuccess?.(email);
        setTimeout(() => {
          setEmail("");
          setShowSuccess(false);
        }, 5e3);
      }
    } catch (error) {
      console.error("Error subscribing to newsletter:", error);
      const err = error instanceof Error ? error : new Error("Failed to subscribe");
      onError?.(err);
      alert("Failed to subscribe. Please try again later.");
    } finally {
      setIsSubmitting(false);
    }
  };
  return /* @__PURE__ */ jsx(
    "section",
    {
      className: `py-16 bg-gradient-to-r from-[#0B1B3B]/20 to-slate-800/20 ${className}`,
      children: /* @__PURE__ */ jsx("div", { className: "max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center", children: showSuccess ? /* @__PURE__ */ jsx(SuccessMessage, { title: successTitle, description: successDescription }) : /* @__PURE__ */ jsxs(Fragment, { children: [
        /* @__PURE__ */ jsx(
          "svg",
          {
            className: "h-12 w-12 text-[#00E0FF] mx-auto mb-6",
            fill: "none",
            viewBox: "0 0 24 24",
            stroke: "currentColor",
            children: /* @__PURE__ */ jsx(
              "path",
              {
                strokeLinecap: "round",
                strokeLinejoin: "round",
                strokeWidth: 2,
                d: "M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
              }
            )
          }
        ),
        /* @__PURE__ */ jsx("h2", { className: "text-3xl md:text-4xl font-bold text-white mb-4", children: title }),
        /* @__PURE__ */ jsx("p", { className: "text-xl text-slate-300 mb-8", children: description }),
        /* @__PURE__ */ jsxs(
          "form",
          {
            onSubmit: handleSubmit,
            className: "flex flex-col sm:flex-row gap-4 max-w-md mx-auto",
            children: [
              /* @__PURE__ */ jsx(
                "input",
                {
                  type: "email",
                  placeholder: "Enter your email",
                  value: email,
                  onChange: (e) => setEmail(e.target.value),
                  required: true,
                  disabled: isSubmitting,
                  className: "bg-slate-800/50 border-slate-700 text-white placeholder:text-slate-400 rounded-2xl flex-1 disabled:opacity-50 px-4 py-2 border focus:border-[#00E0FF] focus:ring-[#00E0FF] focus:ring-1 outline-none"
                }
              ),
              /* @__PURE__ */ jsx(
                "button",
                {
                  type: "submit",
                  disabled: isSubmitting,
                  className: "bg-[#00E0FF] hover:bg-[#00E0FF]/90 text-slate-950 font-semibold rounded-2xl px-8 py-2 disabled:opacity-50 transition-colors",
                  children: isSubmitting ? "Subscribing..." : buttonText
                }
              )
            ]
          }
        ),
        /* @__PURE__ */ jsx("p", { className: "text-sm text-slate-500 mt-4", children: "No spam, unsubscribe at any time" })
      ] }) })
    }
  );
}
function ContactModal({
  open,
  onOpenChange,
  apiEndpoint = "/api/contact",
  title = "Contact Us",
  description = "Send us a message and we'll get back to you soon.",
  onSuccess,
  onError,
  className,
  overlayClassName,
  buttonClassName,
  inputClassName,
  textareaClassName,
  labelClassName,
  titleClassName,
  descriptionClassName,
  iconColor = "#00E0FF"
}) {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const response = await fetch(apiEndpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ email, message })
      });
      if (!response.ok) {
        throw new Error("Failed to send message");
      }
      setShowSuccess(true);
      onSuccess?.({ email, message });
      setTimeout(() => {
        setEmail("");
        setMessage("");
        setShowSuccess(false);
        onOpenChange(false);
      }, 5e3);
    } catch (error) {
      console.error("Error submitting form:", error);
      const err = error instanceof Error ? error : new Error("Failed to send message");
      onError?.(err);
      alert("Failed to send message. Please try again later.");
    } finally {
      setIsSubmitting(false);
    }
  };
  const handleOpenChange = (newOpen) => {
    onOpenChange(newOpen);
  };
  if (!open) return null;
  return /* @__PURE__ */ jsx(
    "div",
    {
      className: overlayClassName || "fixed inset-0 z-50 flex items-center justify-center p-4",
      onClick: () => handleOpenChange(false),
      style: {
        backgroundColor: overlayClassName ? "rgba(0, 0, 0, 0.8)" : "rgba(0, 0, 0, 0.8)",
        backdropFilter: "blur(8px)"
      },
      children: /* @__PURE__ */ jsx(
        "div",
        {
          className: className || "border border-slate-700 rounded-2xl p-6 max-w-md w-full",
          onClick: (e) => e.stopPropagation(),
          style: {
            backgroundColor: "rgb(9, 9, 11)",
            borderColor: "rgb(63, 63, 70)",
            maxWidth: "28rem",
            width: "100%",
            borderRadius: "1rem",
            padding: "1.5rem"
          },
          children: showSuccess ? /* @__PURE__ */ jsx(
            SuccessMessage,
            {
              title: "Message Received!",
              description: "Thank you for contacting us. We'll get back to you soon."
            }
          ) : /* @__PURE__ */ jsxs(Fragment, { children: [
            /* @__PURE__ */ jsxs("div", { className: "mb-6", children: [
              /* @__PURE__ */ jsxs("h2", { className: titleClassName || "text-2xl font-bold text-white flex items-center gap-2 mb-2", children: [
                /* @__PURE__ */ jsx(
                  "svg",
                  {
                    className: "h-6 w-6",
                    style: { color: iconColor },
                    fill: "none",
                    viewBox: "0 0 24 24",
                    stroke: "currentColor",
                    children: /* @__PURE__ */ jsx(
                      "path",
                      {
                        strokeLinecap: "round",
                        strokeLinejoin: "round",
                        strokeWidth: 2,
                        d: "M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                      }
                    )
                  }
                ),
                title
              ] }),
              /* @__PURE__ */ jsx("p", { className: descriptionClassName || "text-slate-300", children: description })
            ] }),
            /* @__PURE__ */ jsxs("form", { onSubmit: handleSubmit, className: "space-y-6", children: [
              /* @__PURE__ */ jsxs("div", { className: "space-y-2", children: [
                /* @__PURE__ */ jsx("label", { htmlFor: "email", className: labelClassName || "text-slate-200 block text-sm font-medium", children: "Email Address" }),
                /* @__PURE__ */ jsx(
                  "input",
                  {
                    id: "email",
                    type: "email",
                    placeholder: "your.email@example.com",
                    value: email,
                    onChange: (e) => setEmail(e.target.value),
                    required: true,
                    className: inputClassName || "w-full bg-slate-800/50 border border-slate-700 text-white placeholder:text-slate-400 focus:border-[#00E0FF] focus:ring-[#00E0FF]/20 focus:ring-2 outline-none rounded-lg px-4 py-2",
                    style: {
                      width: "100%",
                      backgroundColor: "rgb(24, 24, 27)",
                      borderColor: "rgb(63, 63, 70)",
                      color: "white",
                      borderRadius: "0.5rem",
                      padding: "0.5rem 1rem",
                      outline: "none",
                      border: "1px solid rgb(63, 63, 70)"
                    }
                  }
                )
              ] }),
              /* @__PURE__ */ jsxs("div", { className: "space-y-2", children: [
                /* @__PURE__ */ jsx("label", { htmlFor: "message", className: labelClassName || "text-slate-200 block text-sm font-medium", children: "Message" }),
                /* @__PURE__ */ jsx(
                  "textarea",
                  {
                    id: "message",
                    placeholder: "Tell us what's on your mind...",
                    value: message,
                    onChange: (e) => setMessage(e.target.value),
                    required: true,
                    rows: 5,
                    className: textareaClassName || "w-full bg-slate-800/50 border border-slate-700 text-white placeholder:text-slate-400 focus:border-[#00E0FF] focus:ring-[#00E0FF]/20 focus:ring-2 outline-none resize-none rounded-lg px-4 py-2",
                    style: {
                      width: "100%",
                      backgroundColor: "rgb(24, 24, 27)",
                      borderColor: "rgb(63, 63, 70)",
                      color: "white",
                      borderRadius: "0.5rem",
                      padding: "0.5rem 1rem",
                      outline: "none",
                      border: "1px solid rgb(63, 63, 70)",
                      resize: "none"
                    }
                  }
                )
              ] }),
              /* @__PURE__ */ jsxs("div", { className: "flex gap-3 justify-end", children: [
                /* @__PURE__ */ jsx(
                  "button",
                  {
                    type: "button",
                    onClick: () => handleOpenChange(false),
                    className: "text-slate-300 hover:text-white hover:bg-slate-800 px-4 py-2 rounded-lg transition-colors",
                    children: "Cancel"
                  }
                ),
                /* @__PURE__ */ jsx(
                  "button",
                  {
                    type: "submit",
                    disabled: isSubmitting,
                    className: buttonClassName || "bg-[#00E0FF] hover:bg-[#00E0FF]/90 text-slate-950 font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all disabled:opacity-50 px-6 py-2 flex items-center gap-2",
                    style: {
                      backgroundColor: iconColor || "#00E0FF",
                      color: "white",
                      fontWeight: "600",
                      borderRadius: "0.75rem",
                      padding: "0.5rem 1.5rem",
                      display: "flex",
                      alignItems: "center",
                      gap: "0.5rem",
                      border: "none",
                      cursor: isSubmitting ? "not-allowed" : "pointer",
                      opacity: isSubmitting ? 0.5 : 1,
                      transition: "all 0.2s"
                    },
                    children: isSubmitting ? "Sending..." : /* @__PURE__ */ jsxs(Fragment, { children: [
                      "Send Message",
                      /* @__PURE__ */ jsx(
                        "svg",
                        {
                          className: "h-4 w-4",
                          fill: "none",
                          viewBox: "0 0 24 24",
                          stroke: "currentColor",
                          children: /* @__PURE__ */ jsx(
                            "path",
                            {
                              strokeLinecap: "round",
                              strokeLinejoin: "round",
                              strokeWidth: 2,
                              d: "M12 19l9 2-9-18-9 18 9-2zm0 0v-8"
                            }
                          )
                        }
                      )
                    ] })
                  }
                )
              ] })
            ] })
          ] })
        }
      )
    }
  );
}

// src/forms/email.ts
function getEmailConfig() {
  return {
    contactEmail: process.env.CONTACT_EMAIL || "contact@example.com",
    fromEmail: process.env.FROM_EMAIL || "noreply@example.com",
    fromEmailAutoReply: process.env.FROM_EMAIL_AUTO_REPLY
  };
}
function createEmailConfig(config) {
  const defaults = getEmailConfig();
  return {
    ...defaults,
    ...config
  };
}
async function sendContactEmail(resend, config, data) {
  return resend.emails.send({
    from: config.fromEmail,
    to: [config.contactEmail],
    subject: `New Contact Form Submission from ${data.email}`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #1e293b;">New Contact Form Submission</h2>

        <div style="background-color: #f1f5f9; padding: 20px; border-radius: 8px; margin: 20px 0;">
          <p style="margin: 0 0 10px 0;"><strong>From:</strong> ${data.email}</p>
          <p style="margin: 0;"><strong>Date:</strong> ${(/* @__PURE__ */ new Date()).toLocaleString()}</p>
        </div>

        <div style="background-color: #ffffff; padding: 20px; border: 1px solid #e2e8f0; border-radius: 8px;">
          <h3 style="color: #1e293b; margin-top: 0;">Message:</h3>
          <p style="color: #475569; line-height: 1.6; white-space: pre-wrap;">${data.message}</p>
        </div>

        <p style="color: #94a3b8; font-size: 14px; margin-top: 20px;">
          This email was sent from your contact form.
        </p>
      </div>
    `,
    text: `New Contact Form Submission

From: ${data.email}
Date: ${(/* @__PURE__ */ new Date()).toLocaleString()}

Message:
${data.message}`
  });
}
function ThemeProvider({ children }) {
  return /* @__PURE__ */ jsx(Fragment, { children });
}
function useInView(options = {}) {
  const {
    threshold = 0.1,
    rootMargin = "0px",
    triggerOnce = true
  } = options;
  const ref = useRef(null);
  const [isInView, setIsInView] = useState(false);
  useEffect(() => {
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
  return /* @__PURE__ */ jsx(
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
  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    setMounted(true);
  }, []);
  const stars = useMemo(() => {
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
    return /* @__PURE__ */ jsx("div", { className: `absolute inset-0 overflow-hidden pointer-events-none ${className}` });
  }
  return /* @__PURE__ */ jsx("div", { className: `absolute inset-0 overflow-hidden pointer-events-none ${className}`, children: stars.map((star) => {
    if (star.isGalaxy) {
      return /* @__PURE__ */ jsxs(
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
            /* @__PURE__ */ jsx(
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
            /* @__PURE__ */ jsx(
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
            /* @__PURE__ */ jsx(
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
    return /* @__PURE__ */ jsx(
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
  const [isFlipping, setIsFlipping] = useState(false);
  const [displayValue, setDisplayValue] = useState(value);
  useEffect(() => {
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
  return /* @__PURE__ */ jsx("span", { className: `flip-number ${isFlipping ? "flipping" : ""} ${className}`, children: displayValue.toString().padStart(2, "0") });
}
function ConstellationBackground({ count = 3, className = "" }) {
  const [mounted, setMounted] = useState(false);
  const [constellations, setConstellations] = useState([]);
  useEffect(() => {
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
    return /* @__PURE__ */ jsx("div", { className: `absolute inset-0 pointer-events-none ${className}` });
  }
  return /* @__PURE__ */ jsx(
    "svg",
    {
      className: `absolute inset-0 w-full h-full pointer-events-none ${className}`,
      xmlns: "http://www.w3.org/2000/svg",
      viewBox: "0 0 100 100",
      preserveAspectRatio: "xMidYMid slice",
      children: constellations.map((constellation, constellationIndex) => /* @__PURE__ */ jsxs("g", { opacity: "0.6", children: [
        constellation.lines.map(([i, j], lineIndex) => /* @__PURE__ */ jsx(
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
        constellation.stars.map((star, starIndex) => /* @__PURE__ */ jsx(
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
function AdUnit({
  slot,
  adType = "custom",
  format = "auto",
  style = { display: "block" },
  className = "",
  responsive = true,
  adClient
}) {
  const adRef = useRef(null);
  const [adsMode, setAdsMode] = useState("NONE");
  useEffect(() => {
    fetch("/api/ads-config").then((res) => res.json()).then((data) => setAdsMode(data.adsMode || "NONE")).catch((err) => {
      console.error("Failed to fetch ads config:", err);
    });
  }, []);
  useEffect(() => {
    if (adsMode !== "SHOW_ADS") {
      return;
    }
    const loadAd = () => {
      try {
        if (typeof window !== "undefined" && window.adsbygoogle) {
          (window.adsbygoogle = window.adsbygoogle || []).push({});
        }
      } catch (error) {
        console.error("AdSense error for slot", slot, ":", error);
      }
    };
    if (document.readyState === "complete") {
      setTimeout(loadAd, 100);
    } else {
      window.addEventListener(
        "load",
        () => {
          setTimeout(loadAd, 100);
        },
        { once: true }
      );
    }
  }, [adsMode, slot]);
  if (adsMode === "NONE") {
    return null;
  }
  const clientId = adClient || process.env.NEXT_PUBLIC_ADSENSE_CLIENT_ID || "";
  if (adsMode === "SHOW_PLACEHOLDER") {
    if (adType === "leaderboard") {
      return /* @__PURE__ */ jsxs(Fragment, { children: [
        /* @__PURE__ */ jsx("div", { className: `hidden md:flex justify-center ${className}`, children: /* @__PURE__ */ jsxs(
          "div",
          {
            className: "bg-blue-500 border-2 border-blue-300 p-4 text-white text-center font-medium rounded-lg",
            style: { width: 728, height: 90, minHeight: "80px" },
            children: [
              /* @__PURE__ */ jsx("div", { className: "text-sm", children: "\u{1F4FA} Ad Placeholder" }),
              /* @__PURE__ */ jsx("div", { className: "text-xs", children: "leaderboard (desktop)" }),
              /* @__PURE__ */ jsxs("div", { className: "text-xs", children: [
                "Slot: ",
                slot
              ] }),
              /* @__PURE__ */ jsx("div", { className: "text-xs", children: "728x90" })
            ]
          }
        ) }),
        /* @__PURE__ */ jsx("div", { className: `flex md:hidden justify-center ${className}`, children: /* @__PURE__ */ jsxs(
          "div",
          {
            className: "bg-blue-500 border-2 border-blue-300 p-4 text-white text-center font-medium rounded-lg",
            style: { width: 320, height: 50, minHeight: "80px" },
            children: [
              /* @__PURE__ */ jsx("div", { className: "text-sm", children: "\u{1F4FA} Ad Placeholder" }),
              /* @__PURE__ */ jsx("div", { className: "text-xs", children: "mobile-banner" }),
              /* @__PURE__ */ jsxs("div", { className: "text-xs", children: [
                "Slot: ",
                slot
              ] }),
              /* @__PURE__ */ jsx("div", { className: "text-xs", children: "320x50" })
            ]
          }
        ) })
      ] });
    }
    let devWidth = 300;
    let devHeight = 250;
    if (adType === "sidebar") {
      devWidth = 300;
      devHeight = 600;
    } else if (adType === "mobile-banner") {
      devWidth = 320;
      devHeight = 50;
    } else if (adType === "mobile-large") {
      devWidth = 320;
      devHeight = 100;
    }
    return /* @__PURE__ */ jsx("div", { className: `flex justify-center ${className}`, children: /* @__PURE__ */ jsxs(
      "div",
      {
        className: "bg-blue-500 border-2 border-blue-300 p-4 text-white text-center font-medium rounded-lg max-w-full",
        style: {
          width: Math.min(devWidth, 300),
          height: devHeight,
          minHeight: "80px"
        },
        children: [
          /* @__PURE__ */ jsx("div", { className: "text-sm", children: "\u{1F4FA} Ad Placeholder" }),
          /* @__PURE__ */ jsx("div", { className: "text-xs", children: adType }),
          /* @__PURE__ */ jsxs("div", { className: "text-xs", children: [
            "Slot: ",
            slot
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "text-xs", children: [
            Math.min(devWidth, 300),
            "x",
            devHeight
          ] }),
          /* @__PURE__ */ jsx("div", { className: "text-xs mt-1", children: "Set ADS_MODE=SHOW_ADS for real ads" })
        ]
      }
    ) });
  }
  if (adType === "leaderboard") {
    return /* @__PURE__ */ jsxs(
      "div",
      {
        className: `ad-container ${className}`,
        style: { display: "inline-block", width: "100%", minWidth: "320px" },
        children: [
          /* @__PURE__ */ jsx("div", { className: "text-xs text-slate-500 mb-1 text-center", children: "Advertisement" }),
          /* @__PURE__ */ jsx(
            "ins",
            {
              ref: adRef,
              className: "adsbygoogle",
              style: { display: "block", width: "100%" },
              "data-ad-client": clientId,
              "data-ad-slot": slot,
              "data-ad-format": "auto",
              "data-full-width-responsive": responsive ? "true" : "false"
            }
          )
        ]
      }
    );
  }
  return /* @__PURE__ */ jsxs(
    "div",
    {
      className: `ad-container ${className}`,
      style: { display: "inline-block", width: "100%", minWidth: "300px" },
      children: [
        /* @__PURE__ */ jsx("div", { className: "text-xs text-slate-500 mb-1 text-center", children: "Advertisement" }),
        /* @__PURE__ */ jsx(
          "ins",
          {
            ref: adRef,
            className: "adsbygoogle",
            style: { display: "block", width: "100%" },
            "data-ad-client": clientId,
            "data-ad-slot": slot,
            "data-ad-format": "auto",
            "data-full-width-responsive": responsive ? "true" : "false"
          }
        )
      ]
    }
  );
}

// src/ads/ad-slots.ts
function createAdSlots(slots) {
  return {
    slots,
    getAdSlotId(slotName) {
      const id = slots[slotName];
      if (!id) {
        console.warn(`Ad slot "${slotName}" not found in registry`);
        return "";
      }
      return id;
    },
    hasSlot(slotName) {
      return slotName in slots;
    },
    getAllSlots() {
      return { ...slots };
    }
  };
}
var defaultAdSlots = createAdSlots({
  "homepage-banner": "1234567890",
  "homepage-mid-content": "2345678901",
  "sidebar-ad": "3456789012",
  "article-content": "4567890123",
  "article-end": "5678901234"
});
function getAdSlotId(slotName, slots = defaultAdSlots.getAllSlots()) {
  return slots[slotName] || "";
}

export { AdUnit, ConstellationBackground, ContactModal, ContentBlock, FadeIn, FlipNumber, FloatingStars, InContentAd, KeyPoints, Mdx, NewsletterForm, NewsletterService, SuccessMessage, ThemeProvider, XEmbed, YouTubeEmbed, closeConnection, cn, connectToDatabase, createAdSlots, createEmailConfig, createMongoDBConnection, createNewsletterService, defaultAdSlots, defaultMdxComponents, formatDate, formatDateShort, getAdSlotId, getEmailConfig, getRelativeTime, handleSmoothScroll, scrollToTop, sendContactEmail, useAnalytics, useInView };
//# sourceMappingURL=index.mjs.map
//# sourceMappingURL=index.mjs.map