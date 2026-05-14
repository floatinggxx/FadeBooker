import React from 'react';

interface ParagraphProps {
  children: React.ReactNode;
  className?: string;
}

export const Paragraph = ({ children, className = '' }: ParagraphProps) => (
  <p className={`paragraph ${className}`.trim()}>{children}</p>
);
