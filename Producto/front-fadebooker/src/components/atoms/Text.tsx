import React from 'react';

interface TextProps {
  children: React.ReactNode;
  className?: string;
}

export const Text = ({ children, className = '' }: TextProps) => (
  <p className={`paragraph ${className}`.trim()}>{children}</p>
);
