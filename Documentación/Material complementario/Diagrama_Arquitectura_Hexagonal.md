# 🏛️ Diagrama de Arquitectura Hexagonal - FadeBooker

Este diagrama representa el flujo de datos y la organización de patrones de diseño en el backend de FadeBooker, siguiendo los principios de **Clean Architecture**.

```mermaid
graph TD
    subgraph Capas_de_Arquitectura_Hexagonal [Capas de Arquitectura Hexagonal]
        direction TB

        subgraph Entrada [1. LÍNEA DE ENTRADA]
            A[Request HTTP] --> B{Middlewares}
            B --> C[Controllers]
        end

        subgraph Application [2. CORAZÓN DE NEGOCIO]
            C --> D[Services / Use Cases]
            D --> E[Lógica de Dominio]
        end

        subgraph Infrastructure [3. ADAPTADORES]
            D --> F[Repository Impl]
            D --> G[External Adapters]
        end

        subgraph Data_Source [4. EXTERIOR]
            F --> H[(Azure SQL)]
            G --> I[Mercado Pago]
            G --> J[Cloudinary]
        end
    end

    classDef default fill:#fff,stroke:#333,stroke-width:1px;
    class E fill:#f96,stroke:#333,stroke-width:4px;
    class D fill:#bbf,stroke:#333,stroke-width:2px;
    class C fill:#dfd,stroke:#333,stroke-width:2px;
```

### 📝 Resumen Técnico para Presentación

- **Domain:** Entidades puras y reglas esenciales (independiente de tecnología).
- **Application:** Servicios que orquestan los casos de uso del negocio.
- **Infrastructure:** Puertos y adaptadores para DB (Azure SQL), Pagos (Mercado Pago) e Imágenes (Cloudinary).
- **Interfaces:** Controladores REST protegidos por middlewares de seguridad.
