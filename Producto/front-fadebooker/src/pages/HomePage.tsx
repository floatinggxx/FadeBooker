
import React from 'react';

const HomePage: React.FC = () => {
  return (
    <div className="bg-gray-50 min-h-screen">
      {/* Carrusel de imágenes/promociones */}
      <section className="w-full bg-white shadow mb-8">
        <div className="max-w-4xl mx-auto py-10 px-4 flex flex-col items-center text-center">
          <h1 className="text-3xl md:text-4xl font-bold mb-4">Agenda en segundos cerca de ti</h1>
          <p className="mb-6 text-lg text-gray-700">Vía FadeBooker puedes reservar tu corte en barberías verificadas, con reseñas reales y atención garantizada.</p>
          <button className="bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold shadow hover:bg-blue-700 transition">Agendar ahora</button>
        </div>
        {/* Aquí iría un carrusel de imágenes si se implementa */}
      </section>

      {/* Buscador de barberías */}
      <section className="max-w-3xl mx-auto mb-8 px-4">
        <h2 className="text-xl font-semibold mb-2">Busca una barbería en la comuna que tú quieras</h2>
        <div className="flex gap-2">
          <input type="text" placeholder="Selecciona comuna o barrio..." className="border rounded px-3 py-2 w-full" disabled />
          <button className="bg-blue-500 text-white px-4 py-2 rounded" disabled>Buscar</button>
        </div>
        <p className="text-xs text-gray-400 mt-1">(Próximamente: buscador interactivo)</p>
      </section>

      {/* ¿Por qué elegir FadeBooker? */}
      <section className="max-w-4xl mx-auto mb-8 px-4 grid md:grid-cols-2 gap-6 items-center">
        <div>
          <h2 className="text-xl font-bold mb-2">¿Por qué elegir FadeBooker?</h2>
          <ul className="list-disc ml-6 text-gray-700 space-y-1">
            <li><b>Agenda rápida:</b> Elige tu barbero y horario en segundos.</li>
            <li><b>Cerca de ti:</b> Recomendación por distancia y ubicación.</li>
            <li><b>Reseñas reales:</b> Opiniones verificadas de otros clientes.</li>
            <li><b>Recomendación con IA:</b> Te sugerimos el corte ideal según tu estilo.</li>
          </ul>
        </div>
        <div className="flex justify-center">
          <img src="/logo192.png" alt="FadeBooker" className="w-40 h-40 object-contain" />
        </div>
      </section>

      {/* Testimonios */}
      <section className="max-w-4xl mx-auto mb-8 px-4">
        <h2 className="text-xl font-bold mb-4">Testimonios</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-white rounded shadow p-4 flex flex-col items-center">
            <img src="/placeholder-avatar.png" alt="Testimonio 1" className="w-16 h-16 rounded-full mb-2" />
            <p className="text-sm text-gray-700 mb-1">"Excelente atención, fácil de reservar y el barbero muy profesional."</p>
            <span className="text-yellow-500">★★★★★</span>
            <span className="text-xs text-gray-500 mt-1">Carlos M.</span>
          </div>
          <div className="bg-white rounded shadow p-4 flex flex-col items-center">
            <img src="/placeholder-avatar.png" alt="Testimonio 2" className="w-16 h-16 rounded-full mb-2" />
            <p className="text-sm text-gray-700 mb-1">"Reservé en minutos y la experiencia fue top. ¡Repetiré!"</p>
            <span className="text-yellow-500">★★★★★</span>
            <span className="text-xs text-gray-500 mt-1">Lorena G.</span>
          </div>
          <div className="bg-white rounded shadow p-4 flex flex-col items-center">
            <img src="/placeholder-avatar.png" alt="Testimonio 3" className="w-16 h-16 rounded-full mb-2" />
            <p className="text-sm text-gray-700 mb-1">"Me recomendaron el corte ideal, ¡quedé feliz!"</p>
            <span className="text-yellow-500">★★★★★</span>
            <span className="text-xs text-gray-500 mt-1">Sofía P.</span>
          </div>
        </div>
      </section>

      {/* Barbería destacada (placeholder) */}
      <section className="max-w-4xl mx-auto mb-8 px-4">
        <h2 className="text-lg font-semibold mb-2">Barbería destacada</h2>
        <div className="bg-white rounded shadow p-4 flex items-center gap-4">
          <img src="/barbershop-placeholder.jpg" alt="Barbería" className="w-24 h-24 rounded object-cover" />
          <div>
            <div className="font-bold">TuttiBarber</div>
            <div className="text-sm text-gray-600">Maestría verificada</div>
            <div className="text-xs text-gray-500">Reservas: 47</div>
          </div>
        </div>
      </section>

      {/* Recomendación de corte */}
      <section className="max-w-3xl mx-auto mb-8 px-4 text-center">
        <h2 className="text-lg font-semibold mb-2">¿No sabes qué corte elegir?</h2>
        <p className="mb-3 text-gray-700">Déjanos ayudarte a encontrar el mejor estilo según tu rostro y preferencias.</p>
        <button className="bg-green-600 text-white px-5 py-2 rounded font-semibold hover:bg-green-700 transition">Probar recomendación IA</button>
      </section>

      {/* Footer simple */}
      <footer className="w-full py-4 bg-gray-200 text-center text-sm text-gray-600 mt-8">
        ¿Tienes alguna duda? <a href="/ayuda" className="text-blue-600 underline">Contáctanos</a>
      </footer>
    </div>
  );
};

export default HomePage;
