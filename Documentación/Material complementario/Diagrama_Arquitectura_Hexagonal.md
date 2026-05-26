# 🏛️ Diagrama de Arquitectura Hexagonal - FadeBooker

Este diagrama representa el flujo de datos y la organización de patrones de diseño en el backend de FadeBooker, siguiendo los principios de **Clean Architecture**.

```mermaid
graph TD
    subgraph "Capas de Arquitectura Hexagonal"
        direction TB

        subgraph "1. LÍNEA DE ENTRADA (Interfaces/HTTP)"
            A[Request HTTP /api] --> B{Middlewares}
            B -- Valida JWT/Zod --> C[Controllers]
        end

        subgraph "2. CORAZÓN DE NEGOCIO (Application)"
            C --> D[Use Cases / Services]
            D -- Reglas de Negocio --> E[Lógica de Dominio]
        end

        subgraph "3. ADAPTADORES (Infrastructure)"
            D -- Puerto/Interfaz --> F[Repository Implementation]
            D -- Puerto/Interfaz --> G[Adapter Pago/Cloud]
        end

        subgraph "4. EXTERIOR (Data Source)"
            F --> H[(Azure SQL / Knex.js)]
            G --> I[Mercado Pago SDK]
            G --> J[Cloudinary API]
        end
    end

    style E fill:#f96,stroke:#333,stroke-width:4px
    style D fill:#bbf,stroke:#333,stroke-width:2px
    style C fill:#dfd,stroke:#333,stroke-width:2px
    style H fill:#fff,stroke:#333,stroke-dasharray: 5 5
```

### 📝 Resumen Técnico para Presentación

- **Domain:** Entidades puras y reglas esenciales (independiente de tecnología).
- **Application:** Servicios que orquestan los casos de uso del negocio.
- **Infrastructure:** Puertos y adaptadores para DB (Azure SQL), Pagos (Mercado Pago) e Imágenes (Cloudinary).
- **Interfaces:** Controladores REST protegidos por middlewares de seguridad.
