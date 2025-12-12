export interface MdxProps {
  code: string;
}

export interface XEmbedProps {
  id: string;
  theme?: 'light' | 'dark';
  conversation?: 'none' | 'all';
  align?: 'left' | 'center' | 'right';
}

export interface YouTubeEmbedProps {
  videoId: string;
  title?: string;
  startTime?: number;
  endTime?: number;
  aspectRatio?: '16:9' | '4:3';
}
