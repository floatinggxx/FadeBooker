import React from 'react';

const HelpPage: React.FC = () => {
  return (
    <div className="p-8 max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Ayuda y Soporte</h1>
      <p className="mb-4">¿Tienes dudas sobre cómo usar FadeBooker? Aquí encontrarás respuestas a las preguntas más frecuentes y canales de contacto para soporte.</p>
      <ul className="list-disc ml-6 space-y-2">
        <li>¿Cómo agendar una cita?</li>
        <li>¿Cómo modificar o cancelar una reserva?</li>
        <li>¿Cómo contactar a una barbería?</li>
        <li>¿Cómo funciona la recomendación de cortes?</li>
      </ul>
      <div className="mt-8">
        <h2 className="text-lg font-semibold mb-2">¿No encuentras lo que buscas?</h2>
        <p>Escríbenos a <a href="mailto:soporte@fadebooker.com" className="text-blue-600 underline">soporte@fadebooker.com</a> y te ayudaremos.</p>
      </div>
    </div>
  );
};

export default HelpPage;
