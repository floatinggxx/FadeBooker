import React from 'react';

interface FAQItemProps {
  question: string;
  answer: string;
  open: boolean;
  onToggle: () => void;
}

const FAQItem: React.FC<FAQItemProps> = ({ question, answer, open, onToggle }) => (
  <div className={`faq-item ${open ? 'open' : ''}`}>
    <button type="button" className="faq-question" onClick={onToggle}>
      {question}
      <span>{open ? '−' : '+'}</span>
    </button>
    <div className="faq-answer">
      <p>{answer}</p>
    </div>
  </div>
);

export default FAQItem;
