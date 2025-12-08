import * as react_jsx_runtime from 'react/jsx-runtime';
import { ComponentPropsWithoutRef, ReactNode } from 'react';
import { XEmbedProps, YouTubeEmbedProps } from './types';
export { MdxProps } from './types';

/**
 * Default MDX components with styled typography and elements
 * Can be extended or customized per project
 */
declare const defaultMdxComponents: {
    h1: (props: ComponentPropsWithoutRef<"h1">) => react_jsx_runtime.JSX.Element;
    h2: (props: ComponentPropsWithoutRef<"h2">) => react_jsx_runtime.JSX.Element;
    h3: (props: ComponentPropsWithoutRef<"h3">) => react_jsx_runtime.JSX.Element;
    p: (props: ComponentPropsWithoutRef<"p">) => react_jsx_runtime.JSX.Element;
    ul: (props: ComponentPropsWithoutRef<"ul">) => react_jsx_runtime.JSX.Element;
    ol: (props: ComponentPropsWithoutRef<"ol">) => react_jsx_runtime.JSX.Element;
    li: (props: ComponentPropsWithoutRef<"li">) => react_jsx_runtime.JSX.Element;
    a: (props: ComponentPropsWithoutRef<"a">) => react_jsx_runtime.JSX.Element;
    img: (props: ComponentPropsWithoutRef<"img">) => react_jsx_runtime.JSX.Element | null;
    blockquote: (props: ComponentPropsWithoutRef<"blockquote">) => react_jsx_runtime.JSX.Element;
    pre: (props: ComponentPropsWithoutRef<"pre">) => react_jsx_runtime.JSX.Element;
    code: (props: ComponentPropsWithoutRef<"code">) => react_jsx_runtime.JSX.Element;
    table: (props: ComponentPropsWithoutRef<"table">) => react_jsx_runtime.JSX.Element;
    thead: (props: ComponentPropsWithoutRef<"thead">) => react_jsx_runtime.JSX.Element;
    th: (props: ComponentPropsWithoutRef<"th">) => react_jsx_runtime.JSX.Element;
    td: (props: ComponentPropsWithoutRef<"td">) => react_jsx_runtime.JSX.Element;
    hr: () => react_jsx_runtime.JSX.Element;
};
/**
 * MDX renderer component
 * @param code - Compiled MDX code from ContentLayer
 * @param components - Custom components to override defaults
 */
declare function Mdx({ code, components, }: {
    code: string;
    components?: Record<string, React.ComponentType<any>>;
}): react_jsx_runtime.JSX.Element;

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
declare function YouTubeEmbed({ videoId, title, startTime, aspectRatio, }: YouTubeEmbedProps): react_jsx_runtime.JSX.Element;

interface ContentBlockProps {
    title: string;
    children: ReactNode;
}
/**
 * Content block component for MDX articles
 * Highlights important sections with a title
 */
declare function ContentBlock({ title, children }: ContentBlockProps): react_jsx_runtime.JSX.Element;

interface KeyPointsProps {
    children: ReactNode;
}
/**
 * Key points component for MDX articles
 * Highlights important takeaways in a distinct box
 */
declare function KeyPoints({ children }: KeyPointsProps): react_jsx_runtime.JSX.Element;

/**
 * In-content ad component for MDX articles
 * Renders children (typically an AdUnit component from the consuming project)
 * Wrapped in a styled container with spacing
 */
interface InContentAdProps {
    children?: ReactNode;
}
declare function InContentAd({ children }: InContentAdProps): react_jsx_runtime.JSX.Element | null;

export { ContentBlock, type ContentBlockProps, InContentAd, type InContentAdProps, KeyPoints, type KeyPointsProps, Mdx, XEmbed, XEmbedProps, YouTubeEmbed, YouTubeEmbedProps, Mdx as default, defaultMdxComponents };
