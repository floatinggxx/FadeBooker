import React from 'react';

interface SectionHeadingProps {
  eyebrow?: string;
  title: string;
  description?: string;
  className?: string;
}

export const SectionHeading = ({ eyebrow, title, description, className = '' }: SectionHeadingProps) => (
  <div className={`section-heading ${className}`}>
    {eyebrow && <span className="hero-eyebrow">{eyebrow}</span>}
    <h2>{title}</h2>
    {description && <p>{description}</p>}
  </div>
);
