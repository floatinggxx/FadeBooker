import React from 'react';
import { Button as BButton, Spinner } from 'react-bootstrap';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline-primary' | 'danger' | 'link' | 'primary-fade' | 'accent-fade';
  size?: 'sm' | 'lg';
  isLoading?: boolean;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'primary-fade', size, isLoading, children, ...props }, ref) => {
    const isCustom = variant === 'primary-fade' || variant === 'accent-fade';
    const bsVariant = isCustom ? undefined : variant;
    const customClass = variant === 'primary-fade' ? 'btn-primary-fade' : variant === 'accent-fade' ? 'btn-accent-fade' : '';

    return (
      <BButton
        ref={ref as any}
        variant={bsVariant as any}
        size={size}
        className={`${customClass} ${className || ''}`}
        disabled={isLoading || props.disabled}
        {...(props as any)}
      >
        {isLoading && (
          <Spinner
            as="span"
            animation="border"
            size="sm"
            role="status"
            aria-hidden="true"
            className="me-2"
          />
        )}
        {children}
      </BButton>
    );
  }
);

Button.displayName = 'Button';
