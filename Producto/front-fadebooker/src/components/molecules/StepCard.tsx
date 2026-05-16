import React from 'react';
import { Text } from '../atoms/Text';

interface StepCardProps {
  step: string;
  title: string;
  description: string;
}

const StepCard: React.FC<StepCardProps> = ({ step, title, description }) => (
  <article className="card-surface step-card animate-fade-in-up">
    <div className="step-card-header">
      <div className="step-badge">{step}</div>
      <h3>{title}</h3>
    </div>
    <Text>{description}</Text>
  </article>
);

export default StepCard;
