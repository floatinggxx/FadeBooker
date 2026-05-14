import React from 'react';

interface HeadingProps {
  level?: 1 | 2 | 3 | 4;
  children: React.ReactNode;
  className?: string;
}

const levels: Record<1 | 2 | 3 | 4, string> = {
  1: 'hero-title',
  2: 'section-highlight',
  3: 'section-subtitle',
  4: 'section-small-title',
};

export const Heading = ({ level = 2, children, className = '' }: HeadingProps) => {
  const Tag = `h${level}` as keyof JSX.IntrinsicElements;
  return <Tag className={`${levels[level]} ${className}`.trim()}>{children}</Tag>;
};
