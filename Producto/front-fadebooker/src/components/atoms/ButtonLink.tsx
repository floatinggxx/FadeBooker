import React from 'react';
import { Link, LinkProps } from 'react-router-dom';

interface ButtonLinkProps extends LinkProps {
  variant?: 'primary' | 'secondary' | 'blue';
  className?: string;
}

const variantClassMap: Record<NonNullable<ButtonLinkProps['variant']>, string> = {
  primary: 'button button-primary button-glow',
  secondary: 'button button-secondary',
  blue: 'button button-blue',
};

export const ButtonLink = ({ variant = 'primary', className = '', ...props }: ButtonLinkProps) => (
  <Link className={`${variantClassMap[variant]} ${className}`.trim()} {...props} />
);
