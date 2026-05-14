import React from 'react';
import { Text } from '../atoms/Text';

interface FeatureCardProps {
  title: string;
  description: string;
}

const FeatureCard: React.FC<FeatureCardProps> = ({ title, description }) => (
  <article className="card-surface animate-fade-in-up">
    <h3>{title}</h3>
    <Text>{description}</Text>
  </article>
);

export default FeatureCard;
