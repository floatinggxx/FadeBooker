import React, { useState } from 'react';
import { Star, StarHalf, X, Send } from 'lucide-react';
import { bookingService } from '@/lib/api/bookingService';
import { useNotification } from '@/context/NotificationContext';
import { parseError } from '@/lib/utils/errorParser';

interface ReviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  bookingId: number;
  barberName: string;
}

const ReviewModal: React.FC<ReviewModalProps> = ({ isOpen, onClose, onSuccess, bookingId, barberName }) => {
  const [rating, setRating] = useState<number>(5);
  const [hover, setHover] = useState<number>(0);
  const [comment, setComment] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { showNotification } = useNotification();

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await bookingService.dejarResena(bookingId, {
        puntuacion: rating,
        comentario: comment || 'Sin comentarios'
      });
      showNotification('¡Gracias por tu reseña!', 'success');
      onSuccess();
      onClose();
    } catch (err) {
      showNotification(parseError(err), 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Función para renderizar las estrellas interactivas
  const renderStars = () => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
        stars.push(
            <div key={i} className="relative cursor-pointer group"
                 onMouseMove={(e) => {
                     const rect = e.currentTarget.getBoundingClientRect();
                     const x = e.clientX - rect.left;
                     const isHalf = x < rect.width / 2;
                     setHover(isHalf ? i - 0.5 : i);
                 }}
                 onMouseLeave={() => setHover(0)}
                 onClick={() => {
                     setRating(hover);
                 }}
            >
                <div className="flex">
                    {/* Background Star */}
                    <Star 
                        size={32} 
                        className={(hover || rating) >= i ? "text-amber-400 fill-amber-400" : 
                                  ((hover || rating) === i - 0.5) ? "text-slate-200 fill-slate-200" : 
                                  "text-slate-200 fill-slate-200"} 
                    />
                    
                    {/* Overlay for Half Star */}
                    <div className="absolute top-0 left-0 w-1/2 overflow-hidden">
                         {(hover || rating) >= i - 0.5 && (
                             <Star 
                                size={32} 
                                className="text-amber-400 fill-amber-400" 
                             />
                         )}
                    </div>
                </div>
            </div>
        );
    }
    return stars;
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-300">
      <div className="bg-white w-full max-w-md rounded-[2.5rem] shadow-2xl overflow-hidden animate-in zoom-in-95 duration-300">
        <div className="p-8">
          <div className="flex justify-between items-start mb-6">
            <div>
              <h2 className="text-3xl font-black text-slate-900 tracking-tight">Tu Opinión</h2>
              <p className="text-slate-500 font-bold text-sm uppercase tracking-widest mt-1">
                ¿Qué tal tu corte con <span className="text-blue-600">{barberName}</span>?
              </p>
            </div>
            <button onClick={onClose} className="p-2 hover:bg-slate-100 rounded-xl transition-colors">
              <X className="text-slate-400" size={24} />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Star Rating */}
            <div className="flex flex-col items-center gap-4 bg-slate-50 p-6 rounded-3xl border-2 border-slate-100">
              <div className="flex gap-2">
                {renderStars()}
              </div>
              <p className="text-2xl font-black text-blue-600">{rating} Estrellas</p>
            </div>

            {/* Comment */}
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-4">Comentario (Opcional)</label>
              <textarea
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                placeholder="Cuéntanos tu experiencia..."
                className="w-full p-6 bg-slate-50 border-2 border-slate-100 rounded-3xl text-slate-700 font-bold placeholder:text-slate-300 focus:border-blue-400 focus:ring-4 focus:ring-blue-50 focus:outline-none transition-all resize-none min-h-[120px]"
              />
            </div>

            {/* Actions */}
            <div className="flex gap-4 pt-2">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 px-8 py-4 rounded-2xl text-sm font-black uppercase tracking-widest text-slate-500 hover:bg-slate-50 transition-colors"
              >
                Omitir
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="flex-1 flex items-center justify-center gap-2 bg-[#3366FF] text-white px-8 py-4 rounded-2xl text-sm font-black uppercase tracking-widest shadow-lg shadow-blue-200 hover:bg-[#2563EB] transition-all hover:scale-105 disabled:opacity-50"
              >
                <Send size={18} />
                {isSubmitting ? 'Enviando...' : 'Publicar'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ReviewModal;