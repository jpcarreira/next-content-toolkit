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

export { createAdSlots, defaultAdSlots, getAdSlotId };
//# sourceMappingURL=ad-slots.mjs.map
//# sourceMappingURL=ad-slots.mjs.map