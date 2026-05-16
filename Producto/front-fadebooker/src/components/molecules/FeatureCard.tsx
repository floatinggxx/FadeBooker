import React from 'react';
import { Text } from '../atoms/Text';

interface FeatureCardProps {
  title: string;
  description: string;
}

const FeatureCard: React.FC<FeatureCardProps> = ({ title, description }) => (
  <article className="card-surface feature-card animate-fade-in-up">
    <div className="feature-card-header">
      <span className="feature-card-accent" aria-hidden="true" />
      <h3>{title}</h3>
    </div>
    <Text>{description}</Text>
  </article>
);

export default FeatureCard;
