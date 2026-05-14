import React from 'react';
import { Text } from '../atoms/Text';

interface StepCardProps {
  step: string;
  title: string;
  description: string;
}

const StepCard: React.FC<StepCardProps> = ({ step, title, description }) => (
  <article className="card-surface animate-fade-in-up">
    <strong>{step}</strong>
    <h3>{title}</h3>
    <Text>{description}</Text>
  </article>
);

export default StepCard;
