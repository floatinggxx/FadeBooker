import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronDown, ChevronUp, Shield, Lock, Eye, FileText, Mail, AlertCircle } from 'lucide-react';
import '../styles/TermsAndPrivacyPage.css';

interface Section {
  id: string;
  title: string;
  icon: React.ReactNode;
  content: React.ReactNode;
}

const TermsAndPrivacyPage: React.FC = () => {
  const navigate = useNavigate();
  const [expandedSections, setExpandedSections] = useState<Set<string>>(new Set(['intro']));
  const [activeTab, setActiveTab] = useState<'privacy' | 'terms'>('privacy');

  const toggleSection = (id: string) => {
    setExpandedSections(prev => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  };

  const privacySections: Section[] = [
    {
      id: 'intro',
      title: 'Introducción y Responsable de Datos',
      icon: <FileText size={24} />,
      content: (
        <div className="section-content">
          <p>
            <strong>FadeBooker</strong> es una plataforma digital innovadora que conecta clientes con profesionales 
            de la barbería, permitiendo reservas online, gestión de pagos seguros y seguimiento de citas en tiempo real.
          </p>
          <p>
            Operamos bajo los más altos estándares internacionales de privacidad y seguridad de datos, en cumplimiento 
            con la Ley de Protección de Datos Personales, GDPR y regulaciones locales.
          </p>
          <div className="info-box">
            <strong>🏢 Responsable del Tratamiento:</strong><br/>
            FadeBooker S.A. | Chile<br/>
            <strong>📧 Contacto de Privacidad:</strong> privacy@fadebooker.com<br/>
            <strong>📋 Última Actualización:</strong> 2 de Junio de 2026
          </div>
        </div>
      ),
    },
    {
      id: 'datos',
      title: '🔍 Datos que Recopilamos',
      icon: <Eye size={24} />,
      content: (
        <div className="section-content">
          <div className="subsection">
            <h4>✏️ Información que Proporcionas</h4>
            <ul className="feature-list">
              <li><strong>Datos de Registro:</strong> Nombre, correo, teléfono, género (opcional), fecha nacimiento</li>
              <li><strong>Perfil Profesional:</strong> Foto, biografía, especialidades, horarios, servicios ofrecidos</li>
              <li><strong>Datos de Pago:</strong> Procesados por Mercado Pago (NO almacenamos datos de tarjetas)</li>
              <li><strong>Citas y Reservas:</strong> Fechas, horarios, servicios, notas especiales</li>
              <li><strong>Calificaciones:</strong> Puntuaciones, comentarios, fotos de trabajos realizados</li>
            </ul>
          </div>

          <div className="subsection">
            <h4>🖥️ Información Técnica (Recopilada Automáticamente)</h4>
            <ul className="feature-list">
              <li>Dirección IP, navegador, sistema operativo, dispositivo</li>
              <li>Páginas visitadas, duración de sesiones, interacciones</li>
              <li>Ubicación aproximada (ciudad) sin localización GPS sin consentimiento</li>
              <li>Cookies de sesión para mantener tu login activo</li>
            </ul>
          </div>
        </div>
      ),
    },
    {
      id: 'uso',
      title: '⚙️ Cómo Usamos Tu Información',
      icon: <Lock size={24} />,
      content: (
        <div className="section-content">
          <div className="usage-grid">
            <div className="usage-card">
              <div className="usage-icon">✅</div>
              <h4>Facilitar Servicios</h4>
              <p>Procesar reservas, pagos y comunicaciones de citas</p>
            </div>
            <div className="usage-card">
              <div className="usage-icon">🛡️</div>
              <h4>Seguridad</h4>
              <p>Prevenir fraude, detectar actividad sospechosa</p>
            </div>
            <div className="usage-card">
              <div className="usage-icon">📊</div>
              <h4>Mejora Continua</h4>
              <p>Analizar uso para personalizar tu experiencia</p>
            </div>
            <div className="usage-card">
              <div className="usage-icon">📢</div>
              <h4>Comunicaciones</h4>
              <p>Recordatorios, confirmaciones (solo con tu consentimiento)</p>
            </div>
          </div>
          <div className="subsection mt-4">
            <h4>💼 Suscripciones y Pagos Recurrentes</h4>
            <p>
              Si contratas un plan de suscripción como barbero o dueño de barbería, guardamos únicamente el registro de la suscripción,
              su estado, fechas de inicio/fin y la barbería asociada. Los cobros recurrentes son procesados por
              Mercado Pago; no almacenamos datos de tarjeta. Puedes cancelar la suscripción desde tu panel en cualquier momento.
            </p>
          </div>
        </div>
      ),
    },
    {
      id: 'terceros',
      title: '🤝 Compartición con Terceros (Proveedores de Confianza)',
      icon: <AlertCircle size={24} />,
      content: (
        <div className="section-content">
          <p className="highlight-box">
            ⚠️ <strong>NO vendemos tus datos personales a terceros.</strong> Solo compartimos la información 
            necesaria con proveedores autorizados que ayudan a operar la plataforma.
          </p>
          <div className="partners-grid">
            <div className="partner-card">
              <div className="partner-logo">💳</div>
              <h4>Mercado Pago</h4>
              <p className="partner-role">Procesamiento de Pagos</p>
              <p className="partner-info">Cumple PCI DSS. No almacenamos datos de tarjetas.</p>
            </div>
            <div className="partner-card">
              <div className="partner-logo">🖼️</div>
              <h4>Cloudinary</h4>
              <p className="partner-role">Almacenamiento de Imágenes</p>
              <p className="partner-info">Privacidad certificada internacionalmente</p>
            </div>
            <div className="partner-card">
              <div className="partner-logo">☁️</div>
              <h4>Microsoft Azure</h4>
              <p className="partner-role">Infraestructura de Hosting</p>
              <p className="partner-info">Cumple GDPR y Standard Contractual Clauses</p>
            </div>
            <div className="partner-card">
              <div className="partner-logo">📧</div>
              <h4>Gmail (Google)</h4>
              <p className="partner-role">Envío de Correos</p>
              <p className="partner-info">Confirmaciones y recordatorios de citas</p>
            </div>
          </div>
        </div>
      ),
    },
    {
      id: 'seguridad',
      title: '🔒 Seguridad y Protección de Datos',
      icon: <Shield size={24} />,
      content: (
        <div className="section-content">
          <div className="security-grid">
            <div className="security-item">
              <span className="security-icon">✓</span>
              <div>
                <h4>Encriptación en Tránsito</h4>
                <p>HTTPS/TLS protege datos mientras viajan</p>
              </div>
            </div>
            <div className="security-item">
              <span className="security-icon">✓</span>
              <div>
                <h4>Encriptación en Reposo</h4>
                <p>AES-256 para datos almacenados</p>
              </div>
            </div>
            <div className="security-item">
              <span className="security-icon">✓</span>
              <div>
                <h4>Hashing de Contraseñas</h4>
                <p>bcrypt con salting - contraseñas nunca se almacenan en texto plano</p>
              </div>
            </div>
            <div className="security-item">
              <span className="security-icon">✓</span>
              <div>
                <h4>Autenticación JWT</h4>
                <p>Tokens de corta duración para máxima seguridad</p>
              </div>
            </div>
            <div className="security-item">
              <span className="security-icon">✓</span>
              <div>
                <h4>Firewalls y Monitoreo</h4>
                <p>Sistemas de detección de intrusiones 24/7</p>
              </div>
            </div>
            <div className="security-item">
              <span className="security-icon">✓</span>
              <div>
                <h4>Auditorías Regulares</h4>
                <p>Evaluaciones de seguridad independientes</p>
              </div>
            </div>
          </div>
        </div>
      ),
    },
    {
      id: 'derechos',
      title: '👤 Tus Derechos como Usuario',
      icon: <Mail size={24} />,
      content: (
        <div className="section-content">
          <p>Tienes derecho a:</p>
          <ul className="rights-list">
            <li><strong>Acceso:</strong> Solicitar una copia de tus datos personales</li>
            <li><strong>Rectificación:</strong> Corregir datos inexactos o incompletos</li>
            <li><strong>Eliminación:</strong> Solicitar borrado de datos ("derecho al olvido")</li>
            <li><strong>Restricción:</strong> Limitar cómo usamos tus datos</li>
            <li><strong>Portabilidad:</strong> Recibir tus datos en formato estructurado</li>
            <li><strong>Oposición:</strong> Rechazar procesamiento para marketing directo</li>
          </ul>
          <p className="cta-text">
            Para ejercer cualquiera de estos derechos, contacta a <strong>privacy@fadebooker.com</strong> con tu 
            solicitud y verificaremos tu identidad antes de proceder.
          </p>
        </div>
      ),
    },
  ];

  const termsSections: Section[] = [
    {
      id: 'terms-intro',
      title: 'Términos de Servicio',
      icon: <FileText size={24} />,
      content: (
        <div className="section-content">
          <p>
            Al acceder y utilizar FadeBooker, aceptas estar vinculado por estos Términos de Servicio. 
            Si no estás de acuerdo con cualquier parte de estos términos, por favor, no uses la plataforma.
          </p>
          <div className="info-box">
            <strong>Última Actualización:</strong> 2 de Junio de 2026<br/>
            <strong>Efectivo para:</strong> Todos los usuarios, clientes, barberos y dueños de barbería
          </div>
        </div>
      ),
    },
    {
      id: 'uso-servicio',
      title: '📱 Uso del Servicio',
      icon: <AlertCircle size={24} />,
      content: (
        <div className="section-content">
          <h4>Responsabilidades del Usuario</h4>
          <ul className="feature-list">
            <li>Proporcionarás información precisa y completa en el registro</li>
            <li>Eres responsable de mantener la confidencialidad de tu contraseña</li>
            <li>No usarás la plataforma para actividades ilegales o fraudulentas</li>
            <li>Respetarás los derechos de otros usuarios</li>
            <li>No compartirás contenido ofensivo, difamatorio o malicioso</li>
            <li>No interferirás con la operación normal de la plataforma</li>
          </ul>
        </div>
      ),
    },
    {
      id: 'reservas-pagos',
      title: '💳 Reservas y Pagos',
      icon: <Lock size={24} />,
      content: (
        <div className="section-content">
          <div className="terms-box">
            <h4>🔐 Política de Pagos</h4>
            <ul>
              <li>Los pagos se procesan únicamente a través de Mercado Pago (sistema seguro certificado)</li>
              <li>Al confirmar una cita con retención, aceptas debitar el monto acordado</li>
              <li>Las retenciones se aplican según la política de la barbería</li>
                <li>Los reembolsos se procesan dentro de 3-5 días hábiles</li>
                <li>Para suscripciones, los cobros recurrentes mensuales serán visibles en tu cuenta de Mercado Pago y estarán sujetos a las políticas de Mercado Pago.</li>
            </ul>
          </div>

          <div className="terms-box">
            <h4>📅 Cancelación y Reprogramación</h4>
            <ul>
              <li>Puedes cancelar hasta 24 horas antes de la cita sin penalidad</li>
              <li>Cancelaciones dentro de 24 horas pueden resultar en pérdida de retención</li>
              <li>La reprogramación es gratuita hasta 24 horas antes</li>
            </ul>
          </div>
        </div>
      ),
    },
    {
      id: 'contenido',
      title: '📸 Contenido y Propiedad Intelectual',
      icon: <Eye size={24} />,
      content: (
        <div className="section-content">
          <p>
            Todo contenido en FadeBooker (diseño, logotipo, código, texto, imágenes) es propiedad intelectual de 
            FadeBooker S.A. o está licenciado para nosotros.
          </p>
          <div className="highlight-box">
            <strong>Tu Contenido:</strong> Al subir fotos, comentarios o reseñas, nos otorgas licencia para 
            utilizarlos en la plataforma y marketing asociado (siempre respetando tu privacidad).
          </div>
        </div>
      ),
    },
    {
      id: 'responsabilidad',
      title: '⚖️ Limitación de Responsabilidad',
      icon: <AlertCircle size={24} />,
      content: (
        <div className="section-content">
          <div className="warning-box">
            <strong>⚠️ Descargo de Responsabilidad:</strong>
          </div>
          <ul className="feature-list">
            <li>FadeBooker se proporciona "tal cual" sin garantías explícitas o implícitas</li>
            <li>No somos responsables por daños directos, indirectos o consecuentes del uso de la plataforma</li>
            <li>No somos responsables por actos de barberos o terceros en la plataforma</li>
            <li>Nuestra responsabilidad máxima es el monto que pagaste en los últimos 30 días</li>
          </ul>
        </div>
      ),
    },
    {
      id: 'cambios',
      title: '🔄 Cambios en los Términos',
      icon: <FileText size={24} />,
      content: (
        <div className="section-content">
          <p>
            Nos reservamos el derecho de modificar estos términos en cualquier momento. Los cambios serán efectivos 
            cuando se publiquen. Tu uso continuado de la plataforma constituye aceptación de los términos modificados.
          </p>
          <div className="info-box">
            Te notificaremos sobre cambios significativos por correo electrónico.
          </div>
        </div>
      ),
    },
  ];

  const sections = activeTab === 'privacy' ? privacySections : termsSections;

  return (
    <div className="terms-page-container">
      {/* Header Premium */}
      <div className="terms-header">
        <div className="terms-header-content">
          <div>
            <h1 className="terms-title">
              {activeTab === 'privacy' ? '🔐 Política de Privacidad' : '📋 Términos de Servicio'}
            </h1>
            <p className="terms-subtitle">
              {activeTab === 'privacy'
                ? 'Tu privacidad es nuestra prioridad. Conoce cómo protegemos tus datos.'
                : 'Lee atentamente nuestros términos de servicio antes de usar FadeBooker.'}
            </p>
          </div>
          <button className="btn-close-terms" onClick={() => navigate(-1)}>
            ← Volver
          </button>
        </div>
      </div>

      {/* Tab Selector */}
      <div className="terms-tabs">
        <button
          className={`tab-button ${activeTab === 'privacy' ? 'active' : ''}`}
          onClick={() => setActiveTab('privacy')}
        >
          🔐 Privacidad
        </button>
        <button
          className={`tab-button ${activeTab === 'terms' ? 'active' : ''}`}
          onClick={() => setActiveTab('terms')}
        >
          📋 Términos
        </button>
      </div>

      {/* Main Content */}
      <div className="terms-content">
        <div className="sections-container">
          {sections.map((section) => (
            <div key={section.id} className="section-card">
              <button
                className="section-header"
                onClick={() => toggleSection(section.id)}
              >
                <div className="section-title-group">
                  <span className="section-icon">{section.icon}</span>
                  <h2 className="section-title">{section.title}</h2>
                </div>
                <span className="section-toggle">
                  {expandedSections.has(section.id) ? (
                    <ChevronUp size={24} />
                  ) : (
                    <ChevronDown size={24} />
                  )}
                </span>
              </button>

              {expandedSections.has(section.id) && (
                <div className="section-body">
                  {section.content}
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Footer */}
        <div className="terms-footer">
          <div className="footer-content">
            <p className="footer-text">
              ¿Preguntas sobre privacidad o términos? Contáctanos en{' '}
              <a href="mailto:privacy@fadebooker.com">privacy@fadebooker.com</a>
            </p>
            <p className="footer-date">
              Última actualización: 2 de Junio de 2026 | Versión 1.0
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TermsAndPrivacyPage;
