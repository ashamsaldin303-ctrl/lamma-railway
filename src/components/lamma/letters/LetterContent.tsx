'use client';
import ReactMarkdown from 'react-markdown';
import type { Components } from 'react-markdown';
import Image from 'next/image';
import { cn } from '@/lib/utils';

const components: Components = {
  h2: ({ children }) => <h2 className="mb-4 mt-12 font-display text-2xl font-semibold text-ink md:text-3xl">{children}</h2>,
  h3: ({ children }) => <h3 className="mb-3 mt-8 font-display text-xl font-semibold text-ink md:text-2xl">{children}</h3>,
  p: ({ children, node }) => {
    const isFirst = node?.position?.start.line === 1;
    return <p className={cn('mb-6 text-lg leading-relaxed text-ink/80', isFirst && 'first-letter:float-start first-letter:me-2 first-letter:font-display first-letter:text-6xl first-letter:font-semibold first-letter:leading-none first-letter:text-clay')}>{children}</p>;
  },
  blockquote: ({ children }) => <blockquote className="my-8 border-s-4 border-saffron ps-6 font-display text-xl italic text-ink/70">{children}</blockquote>,
  ul: ({ children }) => <ul className="my-6 list-disc space-y-2 ps-6 text-ink/80">{children}</ul>,
  ol: ({ children }) => <ol className="my-6 list-decimal space-y-2 ps-6 text-ink/80">{children}</ol>,
  img: ({ src, alt }) => { if (!src || typeof src !== 'string') return null; return (<figure className="my-8"><div className="relative aspect-[16/9] overflow-hidden rounded-lg bg-secondary"><Image src={src} alt={alt ?? ''} fill sizes="(max-width: 768px) 100vw, 672px" className="object-cover" /></div>{alt && <figcaption className="mt-2 text-center text-sm italic text-stone">{alt}</figcaption>}</figure>); },
  strong: ({ children }) => <strong className="font-semibold text-ink">{children}</strong>,
  em: ({ children }) => <em className="italic text-ink/70">{children}</em>,
  a: ({ children, href }) => <a href={href} target="_blank" rel="noopener noreferrer" className="text-teal underline underline-offset-2 transition-colors hover:text-clay">{children}</a>,
};

export function LetterContent({ content, className }: { content: string; className?: string }) {
  return <article className={cn('mx-auto max-w-2xl', className)}><ReactMarkdown components={components}>{content}</ReactMarkdown></article>;
}
