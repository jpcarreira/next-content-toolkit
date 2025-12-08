import { useRef, useState, useEffect } from 'react';
import { jsxs, Fragment, jsx } from 'react/jsx-runtime';

// src/ads/ad-unit.tsx
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

export { AdUnit, createAdSlots, defaultAdSlots, getAdSlotId };
//# sourceMappingURL=index.mjs.map
//# sourceMappingURL=index.mjs.map