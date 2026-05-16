import React, { useState } from 'react';

interface FAQItemProps {
  question: string;
  answer: string;
  open: boolean;
  onToggle: () => void;
}

const FAQItem: React.FC<FAQItemProps> = ({ question, answer, open, onToggle }) => {
  const [hover, setHover] = useState(false);

  return (
    <div
      className={`faq-item ${open ? 'open' : ''}`}
      style={{
        borderRadius: '0.75rem',
        border: `1px solid ${open ? '#e63946' : '#d1d5db'}`,
        marginBottom: '1rem',
        background: open ? 'rgba(230, 57, 70, 0.03)' : '#ffffff',
        transition: 'all 0.3s ease',
        overflow: 'hidden',
      }}
    >
      <button
        type="button"
        className="faq-question"
        onClick={onToggle}
        onMouseEnter={() => setHover(true)}
        onMouseLeave={() => setHover(false)}
        style={{
          width: '100%',
          padding: '1.25rem',
          background: hover ? 'rgba(230, 57, 70, 0.08)' : '#ffffff',
          border: 'none',
          textAlign: 'left',
          cursor: 'pointer',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          gap: '1rem',
          flexWrap: 'wrap',
          transition: 'all 0.2s ease',
          fontWeight: 600,
          color: '#0f3460',
          fontSize: '1rem',
        }}
      >
        <span style={{ flex: 1, minWidth: 0, textAlign: 'left', lineHeight: '1.4' }}>{question}</span>
        <span
          className="faq-toggle-icon"
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: '32px',
            height: '32px',
            borderRadius: '50%',
            background: open ? '#e63946' : '#f0f5fb',
            color: open ? '#ffffff' : '#0f3460',
            fontWeight: 'bold',
            fontSize: '1.2rem',
            transition: 'all 0.3s ease',
            flexShrink: 0,
            marginLeft: 'auto',
          }}
        >
          {open ? '✓' : '+'}
        </span>
      </button>
      {open && (
        <div
          className="faq-answer"
          style={{
            padding: '0 1.25rem 1.25rem 1.25rem',
            borderTop: '1px solid #e63946',
            animation: 'slideDown 0.3s ease',
          }}
        >
          <p style={{ color: '#4b5563', lineHeight: '1.6', margin: '0' }}>{answer}</p>
        </div>
      )}
    </div>
  );
};

export default FAQItem;
