interface MdxProps {
    code: string;
}
interface XEmbedProps {
    id: string;
    theme?: 'light' | 'dark';
    conversation?: 'none' | 'all';
    align?: 'left' | 'center' | 'right';
}
interface YouTubeEmbedProps {
    videoId: string;
    title?: string;
    startTime?: number;
    endTime?: number;
    aspectRatio?: '16:9' | '4:3';
}

export type { MdxProps, XEmbedProps, YouTubeEmbedProps };
