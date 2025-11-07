export type AdSlotName = string;

export type AdType =
  | 'leaderboard'
  | 'rectangle'
  | 'sidebar'
  | 'mobile-banner'
  | 'mobile-large'
  | 'custom';

export type AdFormat = 'auto' | 'rectangle' | 'horizontal' | 'vertical';

export interface AdUnitProps {
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

export interface AdSlots {
  [key: string]: string;
}

export interface AdConfig {
  adsMode?: 'SHOW_ADS' | 'SHOW_PLACEHOLDER' | 'NONE';
  adClient?: string;
}
