import React from 'react';

interface TestimonialCardProps {
  name: string;
  quote: string;
}

const TestimonialCard: React.FC<TestimonialCardProps> = ({ name, quote }) => (
  <article className="card-surface testimonial-card animate-appearance">
    <h3>{name}</h3>
    <p>{quote}</p>
  </article>
);

export default TestimonialCard;
