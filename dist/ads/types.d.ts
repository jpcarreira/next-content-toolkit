type AdSlotName = string;
type AdType = 'leaderboard' | 'rectangle' | 'sidebar' | 'mobile-banner' | 'mobile-large' | 'custom';
type AdFormat = 'auto' | 'rectangle' | 'horizontal' | 'vertical';
interface AdUnitProps {
    slot: AdSlotName;
    adType?: AdType;
    format?: AdFormat;
    style?: {
        width?: string | number;
        height?: string | number;
        display?: string;
    };
    className?: string;
    responsive?: boolean;
    adClient?: string;
}
interface AdSlots {
    [key: string]: string;
}
interface AdConfig {
    adsMode?: 'SHOW_ADS' | 'SHOW_PLACEHOLDER' | 'NONE';
    adClient?: string;
}

export type { AdConfig, AdFormat, AdSlotName, AdSlots, AdType, AdUnitProps };
