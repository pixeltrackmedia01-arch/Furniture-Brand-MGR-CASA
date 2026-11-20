import type { CSSProperties, ElementType, ReactNode } from 'react';
import { useReveal } from '../lib/hooks';

export function Reveal({
  as: Tag = 'div',
  children,
  className = '',
  delay = 0,
  variant = 'up',
  ...rest
}: {
  as?: ElementType;
  children: ReactNode;
  className?: string;
  delay?: number;
  variant?: 'up' | 'img';
  [k: string]: unknown;
}) {
  const [ref, inView] = useReveal<HTMLElement>();
  return (
    <Tag
      ref={ref}
      className={`${variant === 'img' ? 'reveal-img' : 'reveal'} ${inView ? 'is-in' : ''} ${className}`}
      style={{ '--d': `${delay}s` } as CSSProperties}
      {...rest}
    >
      {children}
    </Tag>
  );
}
