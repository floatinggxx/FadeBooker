# paleta de colores-fadebooker

> **Fuente:** `Documentos/paleta de colores-fadebooker.docx`  
> **Tipo:** `.DOCX`  
> **Tamaño:** `522.6 KB`

---

## DOCUMENTACIÓN DE ESTILOS VISUALES --- FADEBOOKER

El presente documento describe los estilos visuales (colores, tipografía y tamaños) utilizados en la interfaz de la aplicación FadeBooker. Su objetivo es establecer una referencia clara y consistente para el diseño y desarrollo de todos los componentes del sistema, facilitando la coherencia visual y una experiencia de usuario profesional. Esta guía está sincronizada con las variables definidas en el App.OnStart de la aplicación Power Apps.

## 1. PALETA DE COLORES PRINCIPALES

## 2. COLORES DE ACCIÓN E INTERACCIÓN

Alias de compatibilidad: El código también define variables genéricas para un uso más sencillo: varColorPrimario (Rojo), varColorSecundario (Azul) y varColorExito (Verde).

## 3. ESTADOS Y FEEDBACK VISUAL

## 4. TIPOGRAFÍA Y TAMAÑOS

Se utilizarán las familias tipográficas definidas en el App.OnStart.

### Configuración de la Fuente

Familia Principal (Cuerpo de texto): 'Instrument Sans' (CuerpoFont)

Familia Secundaria (Títulos y elementos destacados): 'Inter' (TituloFont)

### Escala de Tamaños (Valores Sugeridos)

Esta escala debe ser aplicada manualmente en los componentes de Power Apps, ya que no tienes variables definidas para estos tamaños en tu código OnStart.

## 5. USO DE COLORES EN BOTONES Y ACCIONES

El sistema cuenta con tres variantes de color para elementos interactivos, usando las variables definidas:

Acciones Principales (Azul varAccionAzul o su alias varColorSecundario) : Es el color de acción por defecto. Usar para crear, añadir o modificar información (Crear nueva cita, Añadir reseña).

Acciones Destructivas (Rojo varAccionRoja o su alias varColorPrimario) : Restringir exclusivamente para acciones que eliminan datos o cancelan un proceso irreversible (Cancelar reserva, Eliminar cuenta).

Acciones de Éxito (Verde varAccionVerde o su alias varColorExito) : Utilizar para botones que confirman una acción positiva (Guardar, Pagar, Completar cita).

La elección del color debe responder a la intención de la acción y no a criterios estéticos.

## 6. EJEMPLOS DE APLICACIÓN EN POWER APPS

Fondo de pantalla: Fill = varFondoPantalla

Fondo de una tarjeta: Fill = varFondoCard

Texto de una etiqueta: Color = varTextoPrincipal

Un botón de "Crear Reserva": Fill = varAccionAzul (o varColorSecundario)

Un botón de "Cancelar Reserva": Fill = varAccionRoja (o varColorPrimario)

Un botón de "Confirmar Pago": Fill = varAccionVerde (o varColorExito)

Un mensaje de error: Fill = varFondoError

Fuente de un título: Font = TituloFont

Fuente del cuerpo de texto: Font = CuerpoFont

## 7. VERSIÓN DEL TEMA

Nombre: varTemaNombre = "FadeBooker - Tema Oficial"

Versión: varTemaVersion = "1.0.0"

Fecha de la versión: varTemaFecha = "2026-05-03"

## 8. CONCLUSIÓN

Esta guía de estivos está alineada con el código de la aplicación. Cualquier cambio en los colores debe realizarse actualizando las variables en App.OnStart, lo que garantizará la coherencia visual en toda la aplicación de forma centralizada.