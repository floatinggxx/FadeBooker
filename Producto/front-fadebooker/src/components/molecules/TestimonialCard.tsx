import React from 'react';

interface TestimonialCardProps {
  name: string;
  quote: string;
  tienda?: string;
}

const TestimonialCard: React.FC<TestimonialCardProps> = ({ name, quote, tienda }) => (
  <article className="card-surface testimonial-card animate-appearance">
    <h3>{name}</h3>
    <p>{quote}</p>
    {tienda && (
      <div className="mt-4 pt-4 border-t border-slate-100 flex items-center justify-between">
        <span className="text-[10px] font-black uppercase tracking-widest text-[#3366FF] bg-blue-50 px-3 py-1 rounded-lg">
          {tienda}
        </span>
        <div className="flex text-yellow-500 text-[10px]">★★★★★</div>
      </div>
    )}
  </article>
);

export default TestimonialCard;
