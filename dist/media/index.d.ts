import * as react_jsx_runtime from 'react/jsx-runtime';
import { XEmbedProps, YouTubeEmbedProps } from '../content/types';

declare global {
    interface Window {
        twttr?: {
            widgets: {
                load: (element?: HTMLElement) => void;
            };
        };
    }
}
/**
 * Embed X (Twitter) posts with lazy loading
 */
declare function XEmbed({ id, theme, conversation, align, }: XEmbedProps): react_jsx_runtime.JSX.Element;

/**
 * Embed YouTube videos with lazy loading
 */
declare function YouTubeEmbed({ videoId, title, startTime, endTime, aspectRatio, }: YouTubeEmbedProps): react_jsx_runtime.JSX.Element;

export { XEmbed, XEmbedProps, YouTubeEmbed, YouTubeEmbedProps };
