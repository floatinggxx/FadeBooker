import React from 'react';
import { Form } from 'react-bootstrap';

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, label, error, type, ...props }, ref) => {
    return (
      <Form.Group className={`mb-3 ${className || ''}`}>
        {label && <Form.Label className="small fw-medium">{label}</Form.Label>}
        <Form.Control
          type={type}
          isInvalid={!!error}
          ref={ref as any}
          {...(props as any)}
        />
        {error && (
          <Form.Control.Feedback type="invalid">
            {error}
          </Form.Control.Feedback>
        )}
      </Form.Group>
    );
  }
);
Input.displayName = "Input";
