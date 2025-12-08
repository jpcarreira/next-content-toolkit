import { AdSlots, AdSlotName } from './types';

/**
 * Create an ad slots registry
 * @param slots - Object mapping slot names to AdSense ad unit IDs
 */
declare function createAdSlots(slots: AdSlots): {
    slots: AdSlots;
    getAdSlotId(slotName: AdSlotName): string;
    hasSlot(slotName: AdSlotName): boolean;
    getAllSlots(): AdSlots;
};
/**
 * Example ad slots configuration
 * Replace with your actual AdSense ad unit IDs
 */
declare const defaultAdSlots: {
    slots: AdSlots;
    getAdSlotId(slotName: AdSlotName): string;
    hasSlot(slotName: AdSlotName): boolean;
    getAllSlots(): AdSlots;
};
/**
 * Get ad slot ID from slot name
 * @param slotName - Name of the ad slot
 * @param slots - Ad slots registry (optional, uses default if not provided)
 */
declare function getAdSlotId(slotName: AdSlotName, slots?: AdSlots): string;

export { createAdSlots, defaultAdSlots, getAdSlotId };
