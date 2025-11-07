import type { AdSlots, AdSlotName } from './types';

/**
 * Create an ad slots registry
 * @param slots - Object mapping slot names to AdSense ad unit IDs
 */
export function createAdSlots(slots: AdSlots) {
  return {
    slots,
    getAdSlotId(slotName: AdSlotName): string {
      const id = slots[slotName];
      if (!id) {
        console.warn(`Ad slot "${slotName}" not found in registry`);
        return '';
      }
      return id;
    },
    hasSlot(slotName: AdSlotName): boolean {
      return slotName in slots;
    },
    getAllSlots(): AdSlots {
      return { ...slots };
    },
  };
}

/**
 * Example ad slots configuration
 * Replace with your actual AdSense ad unit IDs
 */
export const defaultAdSlots = createAdSlots({
  'homepage-banner': '1234567890',
  'homepage-mid-content': '2345678901',
  'sidebar-ad': '3456789012',
  'article-content': '4567890123',
  'article-end': '5678901234',
});

/**
 * Get ad slot ID from slot name
 * @param slotName - Name of the ad slot
 * @param slots - Ad slots registry (optional, uses default if not provided)
 */
export function getAdSlotId(
  slotName: AdSlotName,
  slots: AdSlots = defaultAdSlots.getAllSlots()
): string {
  return slots[slotName] || '';
}
