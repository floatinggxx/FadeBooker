import React, { useEffect, useState } from 'react';
import { FALLBACK_URLS } from '@/lib/utils/placeholders';

interface ImageCarouselProps {
  images?: Array<{ src: string; alt: string; caption?: string }>;
}

const defaultSlides = [
  {
    src: '/images/slider-1.jpg',
    alt: 'Barbería con estilo moderno',
    fallback: 'https://images.unsplash.com/photo-1503951914875-452162b0f3f1?q=80&w=1200',
    caption: 'Explora barberías premium cerca de ti con resultados profesionales.'
  },
  {
    src: '/images/slider-2.jpg',
    alt: 'Reserva tu cita fácilmente',
    fallback: 'https://images.unsplash.com/photo-1599351474290-288d8460d689?q=80&w=1200',
    caption: 'Agenda tus citas con rapidez y mantén tu rutina de estilo bajo control.'
  },
  {
    src: '/images/slider-3.jpg',
    alt: 'Cortes profesionales',
    fallback: 'https://images.unsplash.com/photo-1621605815971-fbc98d665033?q=80&w=1200',
    caption: 'Encuentra cortes y servicios adaptados a tu estilo con un solo clic.'
  }
];

const ImageCarousel: React.FC<ImageCarouselProps> = ({ images = defaultSlides }) => {
  const [activeIndex, setActiveIndex] = useState(0);
  const [failedImages, setFailedImages] = useState<Record<number, boolean>>({});
  const [isPaused, setIsPaused] = useState(false);

  useEffect(() => {
    if (isPaused) return;
    const timer = window.setInterval(() => {
      setActiveIndex((current) => (current + 1) % images.length);
    }, 6000);

    return () => window.clearInterval(timer);
  }, [images.length, isPaused]);

  const goToPrevious = () => {
    setActiveIndex((current) => (current - 1 + images.length) % images.length);
  };

  const goToNext = () => {
    setActiveIndex((current) => (current + 1) % images.length);
  };

  const handleImageError = (index: number) => {
    setFailedImages((prev) => ({ ...prev, [index]: true }));
  };

  const slide = images[activeIndex];
  // @ts-ignore
  const currentSrc = failedImages[activeIndex] ? (slide.fallback || FALLBACK_URLS.TIENDA) : slide.src;
  const progressPercent = ((activeIndex + 1) / images.length) * 100;

  return (
    <div
      className="carousel"
      aria-label="Carrusel de imágenes"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      <div className="carousel-slide">
        <img 
            src={currentSrc} 
            alt={slide.alt} 
            onError={() => handleImageError(activeIndex)} 
            className="animate-in fade-in duration-700"
        />
        <div className="carousel-caption" aria-live="polite">
          <p className="font-bold text-lg">{slide.caption || ''}</p>
        </div>
      </div>
      <div className="carousel-controls">
        <button type="button" onClick={goToPrevious} className="carousel-action-btn" aria-label="Imagen anterior">
          ‹
        </button>
        <button type="button" onClick={goToNext} className="carousel-action-btn" aria-label="Imagen siguiente">
          ›
        </button>
      </div>
      <div className="carousel-progress">
        <div className="carousel-progress-inner" style={{ width: `${progressPercent}%` }} />
      </div>
      <div className="carousel-indicators">
        {images.map((slide, index) => (
          <button
            key={slide.src}
            type="button"
            className={`carousel-indicator ${index === activeIndex ? 'active' : ''}`}
            onClick={() => setActiveIndex(index)}
            aria-label={`Mostrar imagen ${index + 1}`}
          />
        ))}
      </div>
    </div>
  );
};

export default ImageCarousel;
