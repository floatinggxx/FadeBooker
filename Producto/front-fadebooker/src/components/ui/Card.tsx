import React from 'react';
import { Card as BCard } from 'react-bootstrap';

interface CardProps {
  children: React.ReactNode;
  className?: string;
}

export const Card = ({ children, className }: CardProps) => (
  <BCard className={`shadow-sm ${className || ''}`}>
    {children}
  </BCard>
);

export const CardHeader = ({ children, className }: CardProps) => (
  <BCard.Header className={className}>
    {children}
  </BCard.Header>
);

export const CardBody = ({ children, className }: CardProps) => (
  <BCard.Body className={className}>
    {children}
  </BCard.Body>
);

export const CardFooter = ({ children, className }: CardProps) => (
  <BCard.Footer className={className}>
    {children}
  </BCard.Footer>
);
