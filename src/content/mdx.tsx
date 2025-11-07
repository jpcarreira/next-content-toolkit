import { ComponentPropsWithoutRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useMDXComponent } from 'next-contentlayer2/hooks';

/**
 * Default MDX components with styled typography and elements
 * Can be extended or customized per project
 */
export const defaultMdxComponents = {
  // Typography
  h1: (props: ComponentPropsWithoutRef<'h1'>) => (
    <h1 className="text-3xl font-bold text-white mb-6 mt-8" {...props} />
  ),
  h2: (props: ComponentPropsWithoutRef<'h2'>) => (
    <h2 className="text-2xl font-bold text-white mb-4 mt-6" {...props} />
  ),
  h3: (props: ComponentPropsWithoutRef<'h3'>) => (
    <h3 className="text-xl font-semibold text-white mb-3 mt-4" {...props} />
  ),
  p: (props: ComponentPropsWithoutRef<'p'>) => (
    <p className="text-slate-300 leading-relaxed mb-4" {...props} />
  ),

  // Lists
  ul: (props: ComponentPropsWithoutRef<'ul'>) => (
    <ul className="space-y-2 text-slate-300 mb-4 list-disc pl-6" {...props} />
  ),
  ol: (props: ComponentPropsWithoutRef<'ol'>) => (
    <ol
      className="space-y-2 text-slate-300 mb-4 list-decimal pl-6"
      {...props}
    />
  ),
  li: (props: ComponentPropsWithoutRef<'li'>) => (
    <li className="leading-relaxed" {...props} />
  ),

  // Links
  a: (props: ComponentPropsWithoutRef<'a'>) => (
    <Link
      {...props}
      href={props.href || '#'}
      className="text-[#00E0FF] underline decoration-dotted hover:opacity-80 transition-opacity"
    />
  ),

  // Images
  img: (props: ComponentPropsWithoutRef<'img'>) => {
    const { src } = props;
    if (!src || typeof src !== 'string') return null;

    const isAbsolute = src.startsWith('http');

    if (isAbsolute) {
      return (
        <img {...props} className="rounded-lg my-6 w-full" loading="lazy" />
      );
    }

    return (
      <Image
        src={src}
        alt={props.alt || ''}
        width={800}
        height={400}
        className="rounded-lg my-6 w-full h-auto"
        loading="lazy"
      />
    );
  },

  // Blockquote
  blockquote: (props: ComponentPropsWithoutRef<'blockquote'>) => (
    <blockquote
      className="border-l-4 border-[#00E0FF] pl-6 my-6 text-slate-400 italic"
      {...props}
    />
  ),

  // Code blocks
  pre: (props: ComponentPropsWithoutRef<'pre'>) => (
    <pre
      className="bg-slate-800/50 rounded-lg p-4 overflow-x-auto mb-4"
      {...props}
    />
  ),
  code: (props: ComponentPropsWithoutRef<'code'>) => (
    <code
      className="bg-slate-800/50 px-1.5 py-0.5 rounded text-sm"
      {...props}
    />
  ),

  // Tables
  table: (props: ComponentPropsWithoutRef<'table'>) => (
    <div className="overflow-x-auto mb-6">
      <table className="min-w-full divide-y divide-slate-700" {...props} />
    </div>
  ),
  thead: (props: ComponentPropsWithoutRef<'thead'>) => (
    <thead className="bg-slate-800/30" {...props} />
  ),
  th: (props: ComponentPropsWithoutRef<'th'>) => (
    <th className="px-4 py-2 text-left text-white font-semibold" {...props} />
  ),
  td: (props: ComponentPropsWithoutRef<'td'>) => (
    <td className="px-4 py-2 text-slate-300" {...props} />
  ),

  // Divider
  hr: () => <hr className="border-slate-700 my-8" />,
};

/**
 * MDX renderer component
 * @param code - Compiled MDX code from ContentLayer
 * @param components - Custom components to override defaults
 */
export default function Mdx({
  code,
  components = {},
}: {
  code: string;
  components?: Record<string, React.ComponentType<any>>;
}) {
  const MDXComponent = useMDXComponent(code);
  return (
    <MDXComponent components={{ ...defaultMdxComponents, ...components }} />
  );
}
