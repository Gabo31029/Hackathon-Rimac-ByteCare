# Arquitectura en la Nube AWS - Diabetes Care App

## 📋 Tabla de Contenidos

1. [Resumen Ejecutivo](#resumen-ejecutivo)
2. [Arquitectura General](#arquitectura-general)
3. [Servicios AWS Utilizados](#servicios-aws-utilizados)
4. [Diagramas de Flujo](#diagramas-de-flujo)
5. [Consideraciones de Seguridad](#consideraciones-de-seguridad)
6. [Escalabilidad y Costos](#escalabilidad-y-costos)

---

## 🎯 Resumen Ejecutivo

Esta arquitectura AWS está diseñada para soportar un **nuevo feature de la aplicación Rimac** enfocado en el cuidado de diabetes. Como parte del ecosistema Rimac, **la autenticación e inicio de sesión son manejados por el sistema principal de Rimac**, por lo que este feature se integra con la infraestructura existente mediante APIs y tokens de autenticación compartidos. La solución maneja datos sensibles de salud (HIPAA-compliant), requiere alta disponibilidad, escalabilidad automática y capacidades de análisis en tiempo real. Utiliza servicios serverless donde sea posible para minimizar costos operativos y maximizar la escalabilidad.

### Características Clave de la Aplicación:
- **Check-in diario** con cuestionarios y seguimiento de estado
- **Dashboard de salud** con métricas (glucosa, presión arterial, peso, sueño)
- **Sistema de recompensas** con monedas virtuales (Bone Coins y Rimac Coins)
- **Mascota digital** con gamificación
- **Red de apoyo** (familia, profesionales de salud, alertas, foro)
- **Módulos educativos** con lecciones y quizzes
- **Gestión de medicación** con recordatorios y adherencia
- **Alertas automáticas** para situaciones críticas

---

## 🏗️ Arquitectura General

### Diagrama Visual de Alto Nivel (Estilo AWS Architecture)

```
                                    ┌─────────────┐
                                    │   Usuario   │
                                    │ (App Rimac) │
                                    └──────┬──────┘
                                           │
                                           │ HTTPS
                                           ▼
                    ┌──────────────────────────────────────┐
                    │         AWS Cloud                     │
                    │                                        │
                    │  ┌────────────────────────────────┐  │
                    │  │      AWS WAF                     │  │
                    │  │  (Web Application Firewall)      │  │
                    │  └──────────┬───────────────────────┘  │
                    │             │                           │
                    │             │ Validated Requests         │
                    │             ▼                           │
                    │  ┌────────────────────────────────┐  │
                    │  │   Amazon CloudFront (CDN)       │  │
                    │  │   - Caché de assets             │  │
                    │  │   - DDoS Protection             │  │
                    │  └──────────┬───────────────────────┘  │
                    │             │                           │
                    │             │                           │
                    │             ▼                           │
                    │  ┌────────────────────────────────┐  │
                    │  │   API Gateway                   │  │
                    │  │   - Custom Authorizer           │  │
                    │  │   (Valida JWT de Rimac)         │  │
                    │  └──────────┬───────────────────────┘  │
                    │             │                           │
                    │  ┌──────────┴──────────┐              │
                    │  │                      │              │
                    │  ▼                      ▼              │
                    │  ┌──────────────┐  ┌──────────────┐  │
                    │  │ Availability │  │ Availability │  │
                    │  │    Zone A    │  │    Zone B    │  │
                    │  └──────────────┘  └──────────────┘  │
                    │         │                  │           │
                    │         │                  │           │
                    │  ┌──────┴──────────────────┴──────┐   │
                    │  │      VPC (Virtual Private Cloud) │   │
                    │  │                                  │   │
                    │  │  ┌──────────────────────────┐  │   │
                    │  │  │   AWS Lambda Functions     │  │   │
                    │  │  │   (Serverless Compute)     │  │   │
                    │  │  │                            │  │   │
                    │  │  │  • user-sync-lambda        │  │   │
                    │  │  │  • health-metrics-lambda   │  │   │
                    │  │  │  • check-in-lambda         │  │   │
                    │  │  │  • medication-lambda        │  │   │
                    │  │  │  • rewards-lambda          │  │   │
                    │  │  │  • pet-lambda              │  │   │
                    │  │  │  • alert-lambda            │  │   │
                    │  │  │  • education-lambda         │  │   │
                    │  │  │  • forum-lambda            │  │   │
                    │  │  └──────────┬─────────────────┘  │   │
                    │  │             │                     │   │
                    │  │             │                     │   │
                    │  │  ┌──────────┴──────────┐         │   │
                    │  │  │                      │         │   │
                    │  │  ▼                      ▼         │   │
                    │  │  ┌──────────────┐  ┌──────────┐ │   │
                    │  │  │ Amazon RDS   │  │ Amazon   │ │   │
                    │  │  │ (PostgreSQL)  │  │ DynamoDB │ │   │
                    │  │  │              │  │          │ │   │
                    │  │  │ Multi-AZ     │  │ On-Demand│ │   │
                    │  │  │ Standby ────►│  │          │ │   │
                    │  │  └──────────────┘  └──────────┘ │   │
                    │  │                                    │   │
                    │  │  ┌────────────────────────────┐  │   │
                    │  │  │  Amazon ElastiCache (Redis) │  │   │
                    │  │  │  - Caché de sesiones        │  │   │
                    │  │  └────────────────────────────┘  │   │
                    │  └──────────────────────────────────┘   │
                    │                                         │
                    │  ┌──────────────────────────────────┐ │
                    │  │      Amazon S3                    │ │
                    │  │      - Assets (imágenes)           │ │
                    │  │      - Backups                     │ │
                    │  └──────────────────────────────────┘ │
                    │                                         │
                    │  ┌──────────────────────────────────┐ │
                    │  │      Amazon SNS                    │ │
                    │  │      - Push Notifications         │ │
                    │  │      - SMS                        │ │
                    │  └──────────────────────────────────┘ │
                    │                                         │
                    │  ┌──────────────────────────────────┐ │
                    │  │      Amazon SES                    │ │
                    │  │      - Emails transaccionales      │ │
                    │  └──────────────────────────────────┘ │
                    │                                         │
                    │  ┌──────────────────────────────────┐ │
                    │  │      Amazon Kinesis                │ │
                    │  │      - Data Streams                │ │
                    │  │      - Data Firehose               │ │
                    │  └──────────────────────────────────┘ │
                    │                                         │
                    │  ┌──────────────────────────────────┐ │
                    │  │      Amazon QuickSight              │ │
                    │  │      - Analytics Dashboards        │ │
                    │  └──────────────────────────────────┘ │
                    │                                         │
                    │  ┌──────────────────────────────────┐ │
                    │  │      Amazon CloudWatch              │ │
                    │  │      - Monitoring & Logs            │ │
                    │  └──────────────────────────────────┘ │
                    │                                         │
                    │  ┌──────────────────────────────────┐ │
                    │  │      AWS X-Ray                     │ │
                    │  │      - Distributed Tracing         │ │
                    │  └──────────────────────────────────┘ │
                    │                                         │
                    │  ┌──────────────────────────────────┐ │
                    │  │      AWS Secrets Manager          │ │
                    │  │      - Credentials Management     │ │
                    │  └──────────────────────────────────┘ │
                    │                                         │
                    │  ┌──────────────────────────────────┐ │
                    │  │      AWS KMS                       │ │
                    │  │      - Encryption Keys             │ │
                    │  └──────────────────────────────────┘ │
                    │                                         │
                    └─────────────────────────────────────────┘
                                           │
                                           │
                    ┌──────────────────────┴──────────────────────┐
                    │   Integración Externa                        │
                    │                                              │
                    │  ┌──────────────────────────────────────┐ │
                    │  │   Sistema Rimac (Existente)            │ │
                    │  │   - Autenticación                      │ │
                    │  │   - JWKS Endpoint                      │ │
                    │  │   - User Events (Webhooks)             │ │
                    │  └──────────────────────────────────────┘ │
                    └─────────────────────────────────────────────┘
```

### Flujo de Datos Simplificado

```
Usuario (App Rimac)
    │
    │ 1. Request con JWT Token
    ▼
AWS WAF (Protección)
    │
    │ 2. Request validado
    ▼
CloudFront (CDN)
    │
    │ 3. Request enrutado
    ▼
API Gateway
    │
    │ 4. Custom Authorizer valida JWT de Rimac
    ▼
Lambda Functions (Procesamiento)
    │
    ├─► DynamoDB (Datos en tiempo real)
    ├─► RDS (Datos estructurados)
    ├─► ElastiCache (Caché)
    ├─► S3 (Assets)
    ├─► SNS (Notificaciones)
    └─► Kinesis (Analytics)
```

---

## 🏗️ Arquitectura Detallada por Capas

```
┌─────────────────────────────────────────────────────────────────┐
│                        CAPA DE PRESENTACIÓN                      │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │  App Rimac (Sistema Principal)                           │  │
│  │  - iOS / Android                                          │  │
│  │  - Autenticación manejada por Rimac                      │  │
│  │  - Feature: Diabetes Care (React Native Module)          │  │
│  └──────────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│              INTEGRACIÓN CON SISTEMA RIMAC                       │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │  API Gateway Rimac (Existente)                           │  │
│  │  - Validación de tokens JWT                              │  │
│  │  - Enrutamiento a features                               │  │
│  │  - OAuth 2.0 / OpenID Connect                            │  │
│  └──────────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│                      CAPA DE DISTRIBUCIÓN                       │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │  Amazon CloudFront (CDN)                                 │  │
│  │  - Distribución de assets estáticos                      │  │
│  │  - Caché de respuestas API                                │  │
│  │  - DDoS Protection                                        │  │
│  └──────────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│                      CAPA DE API                                 │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │  Amazon API Gateway                                      │  │
│  │  - REST API / GraphQL                                    │  │
│  │  - Rate Limiting                                         │  │
│  │  - Request Validation                                    │  │
│  │  - AWS WAF Integration                                   │  │
│  └──────────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│                    CAPA DE COMPUTACIÓN                           │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │  AWS Lambda Functions                                     │  │
│  │  ├─ User Management (CRUD usuarios)                      │  │
│  │  ├─ Health Metrics (glucosa, presión, peso, sueño)      │  │
│  │  ├─ Check-in Processing                                  │  │
│  │  ├─ Medication Management                                │  │
│  │  ├─ Rewards System (monedas, recompensas)                │  │
│  │  ├─ Pet Management (mascota digital)                     │  │
│  │  ├─ Support Network (familia, profesionales)             │  │
│  │  ├─ Education Module (lecciones, quizzes)                │  │
│  │  ├─ Alert Processing (alertas automáticas)              │  │
│  │  └─ Forum Management (foro de pacientes)                │  │
│  └──────────────────────────────────────────────────────────┘  │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │  AWS AppSync (Opcional - GraphQL)                        │  │
│  │  - Real-time subscriptions                               │  │
│  │  - Offline sync                                           │  │
│  └──────────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│                      CAPA DE DATOS                               │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │  Amazon RDS (PostgreSQL)                                 │  │
│  │  - Datos estructurados (usuarios, métricas, medicación) │  │
│  │  - Multi-AZ para alta disponibilidad                     │  │
│  │  - Automated Backups                                     │  │
│  └──────────────────────────────────────────────────────────┘  │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │  Amazon DynamoDB                                         │  │
│  │  - Datos de alta frecuencia (check-ins, métricas)       │  │
│  │  - TTL para datos temporales                            │  │
│  │  - Global Tables para baja latencia                     │  │
│  └──────────────────────────────────────────────────────────┘  │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │  Amazon ElastiCache (Redis)                              │  │
│  │  - Caché de sesiones                                     │  │
│  │  - Caché de datos frecuentes                             │  │
│  │  - Rate limiting                                         │  │
│  └──────────────────────────────────────────────────────────┘  │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │  Amazon S3                                                │  │
│  │  - Almacenamiento de imágenes (mascota, perfil)        │  │
│  │  - Backups de base de datos                             │  │
│  │  │  - Logs de aplicación                                │  │
│  └──────────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│              INTEGRACIÓN CON AUTENTICACIÓN RIMAC                  │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │  Sistema de Autenticación Rimac (Existente)              │  │
│  │  - Tokens JWT compartidos                                 │  │
│  │  - Validación de sesión                                   │  │
│  │  - Información de usuario (ID, email, perfil)            │  │
│  └──────────────────────────────────────────────────────────┘  │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │  API Gateway - Custom Authorizer                          │  │
│  │  - Valida tokens JWT de Rimac                             │  │
│  │  - Extrae información de usuario                          │  │
│  │  - Políticas de acceso basadas en roles                   │  │
│  └──────────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│                  CAPA DE NOTIFICACIONES                          │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │  Amazon SNS (Simple Notification Service)                 │  │
│  │  - Push notifications (iOS/Android)                      │  │
│  │  - SMS para alertas críticas                             │  │
│  │  - Notificaciones a familiares                           │  │
│  └──────────────────────────────────────────────────────────┘  │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │  Amazon SES (Simple Email Service)                       │  │
│  │  - Emails transaccionales                                 │  │
│  │  - Reportes mensuales a familiares                       │  │
│  │  - Recordatorios de medicación                            │  │
│  └──────────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│                  CAPA DE ANÁLISIS                                │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │  Amazon Kinesis Data Streams                              │  │
│  │  - Streaming de métricas en tiempo real                  │  │
│  │  - Eventos de usuario                                    │  │
│  └──────────────────────────────────────────────────────────┘  │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │  Amazon Kinesis Data Firehose                            │  │
│  │  - Ingesta de datos a S3/Redshift                        │  │
│  └──────────────────────────────────────────────────────────┘  │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │  Amazon QuickSight                                        │  │
│  │  - Dashboards de analytics                               │  │
│  │  - Reportes para profesionales de salud                  │  │
│  └──────────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│                  CAPA DE MONITOREO                               │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │  Amazon CloudWatch                                       │  │
│  │  - Logs de aplicación                                    │  │
│  │  - Métricas de rendimiento                               │  │
│  │  - Alertas automáticas                                   │  │
│  └──────────────────────────────────────────────────────────┘  │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │  AWS X-Ray                                                │  │
│  │  - Trazabilidad de requests                              │  │
│  │  - Análisis de rendimiento                               │  │
│  └──────────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│                  CAPA DE SEGURIDAD                               │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │  AWS WAF (Web Application Firewall)                      │  │
│  │  - Protección contra ataques comunes                     │  │
│  │  - Rate limiting avanzado                                │  │
│  └──────────────────────────────────────────────────────────┘  │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │  AWS Secrets Manager                                     │  │
│  │  - Gestión de credenciales                              │  │
│  │  - Rotación automática                                   │  │
│  └──────────────────────────────────────────────────────────┘  │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │  AWS KMS (Key Management Service)                        │  │
│  │  - Encriptación de datos sensibles                       │  │
│  │  - Gestión de claves                                     │  │
│  └──────────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────────┘
```

---

## 🔗 Integración con Sistema Rimac

### Arquitectura de Integración

Como este feature es parte de la aplicación Rimac, la arquitectura se integra con el sistema principal de la siguiente manera:

```
┌─────────────────────────────────────────────────────────────┐
│              SISTEMA RIMAC (Existente)                      │
│  ┌──────────────────────────────────────────────────────┐  │
│  │  App Rimac Principal                                  │  │
│  │  - Autenticación (Login/Registro)                    │  │
│  │  - Gestión de usuarios                               │  │
│  │  - Otros features                                    │  │
│  └──────────────────────────────────────────────────────┘  │
│  ┌──────────────────────────────────────────────────────┐  │
│  │  API Gateway Rimac                                   │  │
│  │  - Emite tokens JWT                                  │  │
│  │  - JWKS Endpoint público                             │  │
│  └──────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────┘
                        │
                        │ Tokens JWT compartidos
                        │ Webhooks/Events (opcional)
                        ▼
┌─────────────────────────────────────────────────────────────┐
│         FEATURE: DIABETES CARE (Esta Arquitectura)         │
│  ┌──────────────────────────────────────────────────────┐  │
│  │  API Gateway (Custom Authorizer)                    │  │
│  │  - Valida tokens JWT de Rimac                       │  │
│  │  - Extrae user_id, email, metadata                   │  │
│  └──────────────────────────────────────────────────────┘  │
│  ┌──────────────────────────────────────────────────────┐  │
│  │  User Sync Lambda                                     │  │
│  │  - Escucha eventos de registro en Rimac              │  │
│  │  - Crea perfil automático en Diabetes Care           │  │
│  └──────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────┘
```

### Contrato de Integración

**1. Autenticación:**
- **Formato de Token**: JWT (JSON Web Token)
- **Header**: `Authorization: Bearer <token>`
- **Claims requeridos en token**:
  ```json
  {
    "user_id": "rimac-user-123",
    "email": "usuario@example.com",
    "exp": 1234567890,
    "iat": 1234567890,
    "iss": "rimac-auth-service"
  }
  ```
- **Validación**: Custom Authorizer valida token usando JWKS endpoint de Rimac

**2. Sincronización de Usuarios:**
- **Método 1 - Webhook (Recomendado)**:
  - Rimac envía webhook cuando usuario se registra
  - Endpoint: `POST /webhooks/user-created`
  - Payload:
    ```json
    {
      "event": "user.created",
      "user_id": "rimac-user-123",
      "email": "usuario@example.com",
      "name": "María García",
      "timestamp": "2024-01-15T10:30:00Z"
    }
    ```
  - User Sync Lambda crea perfil en Diabetes Care

- **Método 2 - Polling (Alternativo)**:
  - Lambda ejecuta cada hora
  - Consulta API de Rimac para usuarios nuevos
  - Crea perfiles faltantes

**3. Información de Usuario:**
- El `user_id` de Rimac se usa como clave primaria en todas las tablas
- No almacenamos contraseñas ni información de autenticación
- Solo almacenamos datos específicos del feature Diabetes Care

**4. Comunicación entre Features:**
- Los tokens JWT permiten acceso a múltiples features
- Cada feature valida el token independientemente
- No hay sesiones compartidas entre features

---

## 🔧 Servicios AWS Utilizados

### 1. **Integración con Sistema de Autenticación Rimac**
**¿Qué es?**  
Como este feature es parte de la aplicación Rimac, **no manejamos autenticación propia**. El sistema principal de Rimac ya gestiona el inicio de sesión, registro y gestión de usuarios.

**¿Para qué se usa?**
- **Validación de tokens**: Los tokens JWT emitidos por el sistema Rimac son validados en cada request
- **Información de usuario**: Se recibe el `user_id` y metadata del usuario autenticado desde el sistema principal
- **Sincronización de usuarios**: Cuando un usuario se registra en Rimac, se crea automáticamente su perfil en el feature de Diabetes Care
- **Gestión de sesiones**: Las sesiones son manejadas por Rimac, este feature solo valida que la sesión sea válida

**¿Por qué?**
- **Consistencia**: Los usuarios no necesitan múltiples cuentas, usan su cuenta Rimac existente
- **Seguridad centralizada**: La seguridad de autenticación está centralizada en el sistema principal
- **Experiencia unificada**: El usuario tiene una experiencia fluida entre features de Rimac
- **Mantenimiento reducido**: No necesitamos gestionar flujos de autenticación, recuperación de contraseña, etc.

**Configuración sugerida:**
- **API Gateway Custom Authorizer**: Lambda function que valida tokens JWT de Rimac
- **JWKS Endpoint**: Endpoint público de Rimac para validar firmas de tokens
- **User Sync Lambda**: Función que se ejecuta cuando un usuario se registra en Rimac para crear su perfil en Diabetes Care
- **Token Validation**: Validación de expiración, firma y claims del token

**Flujo de Autenticación:**
```
1. Usuario inicia sesión en App Rimac → Recibe JWT token
2. Usuario accede a feature Diabetes Care → App envía JWT en header Authorization
3. API Gateway Custom Authorizer valida token con JWKS de Rimac
4. Si válido, extrae user_id y pasa request a Lambda
5. Lambda usa user_id para operaciones de base de datos
```

---

### 2. **Amazon API Gateway**
**¿Qué es?**  
Servicio para crear, publicar, mantener y monitorear APIs RESTful y WebSocket.

**¿Para qué se usa?**
- **Endpoint único**: Punto de entrada para todas las peticiones del feature Diabetes Care
- **Custom Authorizer**: Validación de tokens JWT de Rimac antes de procesar requests
- **Rate Limiting**: Control de tráfico por usuario/IP para prevenir abusos
- **Request Validation**: Validación de esquemas antes de llegar a Lambda
- **CORS**: Configuración de políticas CORS para desarrollo
- **API Keys**: Gestión de claves para acceso de terceros (integración con sistemas hospitalarios)

**¿Por qué?**
- **Serverless**: No requiere gestión de servidores
- **Escalabilidad automática**: Maneja picos de tráfico sin configuración
- **Integración nativa**: Conecta fácilmente con Lambda, DynamoDB, etc.
- **Monitoreo**: Métricas y logs integrados con CloudWatch
- **Seguridad**: Custom Authorizer valida tokens antes de procesar requests

**Configuración sugerida:**
- REST API con stages (dev, staging, prod)
- **Custom Authorizer Lambda**: Valida tokens JWT de Rimac usando JWKS endpoint
- Throttling: 1000 requests/segundo por defecto, ajustable
- Caching: 5-10 minutos para endpoints de lectura frecuente (con validación de token)
- **Integration con sistema Rimac**: Endpoint para sincronizar usuarios nuevos

**Custom Authorizer Lambda (Pseudocódigo):**
```typescript
// authorizer-lambda.ts
export async function handler(event) {
  const token = event.authorizationToken;
  
  // Validar token con JWKS de Rimac
  const decoded = await validateJWT(token, RIMAC_JWKS_ENDPOINT);
  
  if (!decoded || decoded.exp < Date.now() / 1000) {
    throw new Error('Unauthorized');
  }
  
  // Retornar policy con user_id extraído del token
  return {
    principalId: decoded.user_id,
    policyDocument: {
      Statement: [{
        Effect: 'Allow',
        Action: 'execute-api:Invoke',
        Resource: event.methodArn
      }]
    },
    context: {
      userId: decoded.user_id,
      email: decoded.email,
      role: decoded.role
    }
  };
}
```

---

### 3. **AWS Lambda**
**¿Qué es?**  
Servicio de computación serverless que ejecuta código en respuesta a eventos.

**¿Para qué se usa?**
Cada función Lambda maneja un dominio específico:

#### **user-sync-lambda**
- Sincronización de usuarios desde sistema Rimac
- Creación automática de perfil en Diabetes Care cuando usuario se registra en Rimac
- Actualización de información de usuario cuando cambia en Rimac
- Webhook/Event listener para eventos de usuario en sistema Rimac

#### **user-management-lambda**
- CRUD de perfiles específicos de Diabetes Care (preferencias, configuración)
- Gestión de roles específicos (paciente, familiar, profesional de salud)
- Actualización de permisos de visualización para familiares

#### **health-metrics-lambda**
- Registro de métricas de salud (glucosa, presión arterial, peso, sueño)
- Cálculo de promedios y tendencias
- Validación de rangos normales/anormales

#### **check-in-lambda**
- Procesamiento de check-ins diarios
- Cálculo de recompensas (Bone Coins)
- Actualización de rachas (streaks)
- Generación de insights basados en respuestas

#### **medication-lambda**
- Gestión de medicamentos y horarios
- Cálculo de adherencia (% mensual)
- Detección de medicamentos tardíos (tolerancia 10-15 min)
- Envío de recordatorios (integración con SNS)

#### **rewards-lambda**
- Gestión de monedas (Bone Coins, Rimac Coins)
- Procesamiento de canjes de recompensas
- Validación de disponibilidad de premios
- Historial de transacciones

#### **pet-lambda**
- Gestión del estado de la mascota digital
- Cálculo de felicidad/hambre basado en acciones del usuario
- Procesamiento de compras de accesorios
- Sistema de ranking mensual

#### **support-network-lambda**
- CRUD de contactos (familia, profesionales)
- Gestión de permisos de visualización
- Generación de reportes mensuales para familiares
- Agendamiento de citas con profesionales

#### **education-lambda**
- Gestión de módulos y lecciones
- Procesamiento de quizzes
- Cálculo de progreso y recompensas
- Tracking de lecciones completadas

#### **alert-lambda**
- Procesamiento de alertas automáticas:
  - Glucosa crítica (fuera de rango)
  - Sin mediciones (usuario inactivo)
  - Patrón emocional preocupante
- Notificación a familiares configurados
- Historial de alertas

#### **forum-lambda**
- CRUD de posts en el foro
- Filtrado por región/edad
- Gestión de likes/comentarios
- Moderación de contenido

**¿Por qué?**
- **Costo**: Solo pagas por ejecuciones (primer millón de requests gratis/mes)
- **Escalabilidad**: Escala automáticamente de 0 a miles de ejecuciones concurrentes
- **Mantenimiento**: Sin gestión de servidores, actualizaciones automáticas
- **Velocidad**: Cold start < 1 segundo con provisioned concurrency para funciones críticas

**Configuración sugerida:**
- Runtime: Node.js 20.x o Python 3.11
- Timeout: 30 segundos (aumentar para funciones de procesamiento pesado)
- Memory: 512 MB - 1 GB (ajustar según uso)
- Provisioned Concurrency: Para funciones críticas (check-in, alertas)
- VPC: Solo si necesitan acceso a RDS (aumenta cold start)

---

### 4. **Amazon RDS (PostgreSQL)**
**¿Qué es?**  
Servicio de base de datos relacional administrado.

**¿Para qué se usa?**
Almacenamiento de datos estructurados y relaciones complejas:

- **Usuarios y perfiles**: Información de pacientes, familiares, profesionales
- **Métricas de salud históricas**: Glucosa, presión arterial, peso, sueño (con timestamps)
- **Medicación**: Medicamentos, horarios, historial de tomas
- **Módulos educativos**: Contenido de lecciones, quizzes, respuestas
- **Recompensas**: Catálogo de premios, historial de canjes
- **Red de apoyo**: Relaciones familia-profesional, permisos de visualización
- **Foro**: Posts, comentarios, likes (con relaciones usuario-post)

**¿Por qué?**
- **ACID Compliance**: Garantiza consistencia de datos críticos
- **Relaciones complejas**: JOINs eficientes para consultas relacionadas
- **Backups automáticos**: Snapshots diarios con retención configurable
- **Multi-AZ**: Alta disponibilidad con réplicas en múltiples zonas
- **HIPAA Compliance**: Soporta encriptación en reposo y en tránsito

**Configuración sugerida:**
- Engine: PostgreSQL 15.x
- Instance: db.t3.medium (inicial), escalar según necesidad
- Storage: 100 GB gp3 con auto-scaling
- Multi-AZ: Habilitado para producción
- Backups: 7 días de retención, ventana de mantenimiento nocturna
- Encryption: Habilitada con KMS

**Esquema de tablas principales:**
```sql
- users (id, email, role, created_at, ...)
- health_metrics (id, user_id, type, value, timestamp, ...)
- medications (id, user_id, name, schedule, ...)
- medication_logs (id, medication_id, taken_at, is_late, ...)
- check_ins (id, user_id, responses, coins_earned, date, ...)
- rewards (id, title, cost, category, ...)
- transactions (id, user_id, type, amount, ...)
- education_modules (id, title, progress, ...)
- education_lessons (id, module_id, title, content, ...)
- forum_posts (id, user_id, content, region, age_group, ...)
- alerts (id, user_id, type, triggered_at, notified_to, ...)
```

---

### 5. **Amazon DynamoDB**
**¿Qué es?**  
Base de datos NoSQL completamente administrada, serverless.

**¿Para qué se usa?**
Datos de alta frecuencia y baja latencia:

- **Métricas en tiempo real**: Últimas lecturas de glucosa (últimas 24 horas)
- **Sesiones de usuario**: Estado de sesión activa, tokens
- **Caché de datos frecuentes**: Rankings mensuales, estadísticas de mascota
- **Eventos de usuario**: Logs de acciones (feed de actividad)
- **TTL para datos temporales**: Notificaciones pendientes, datos de sesión

**¿Por qué?**
- **Latencia ultra-baja**: < 10ms para lecturas, < 20ms para escrituras
- **Escalabilidad automática**: Maneja millones de requests sin configuración
- **Serverless**: Sin gestión de servidores, pago por uso
- **TTL nativo**: Eliminación automática de datos expirados

**Configuración sugerida:**
- On-Demand billing para tráfico impredecible
- Global Tables para baja latencia en múltiples regiones
- Point-in-time recovery habilitado
- Encryption at rest con KMS

**Tablas principales:**
```
- health_metrics_realtime (PK: user_id, SK: timestamp)
- user_sessions (PK: session_id, TTL: expires_at)
- pet_state (PK: user_id)
- daily_challenges (PK: user_id, SK: date)
- alert_queue (PK: alert_id, TTL: processed_at)
```

---

### 6. **Amazon ElastiCache (Redis)**
**¿Qué es?**  
Servicio de caché en memoria administrado.

**¿Para qué se usa?**
- **Caché de sesiones**: Tokens JWT, estado de autenticación
- **Caché de datos frecuentes**: Rankings, estadísticas agregadas
- **Rate limiting**: Contador de requests por usuario/IP
- **Locks distribuidos**: Prevenir procesamiento duplicado de alertas

**¿Por qué?**
- **Rendimiento**: Latencia < 1ms para operaciones en memoria
- **Reduce carga en RDS**: Menos queries a base de datos principal
- **Costo-efectivo**: Reduce costos de RDS al cachear consultas frecuentes

**Configuración sugerida:**
- Engine: Redis 7.x
- Node type: cache.t3.micro (desarrollo), cache.t3.small (producción)
- Multi-AZ: Habilitado para alta disponibilidad
- TTL por defecto: 1 hora para datos de sesión, 5 minutos para caché

---

### 7. **Amazon S3**
**¿Qué es?**  
Almacenamiento de objetos escalable.

**¿Para qué se usa?**
- **Imágenes de perfil**: Fotos de usuarios
- **Imágenes de mascota**: Accesorios, estados de la mascota
- **Assets de educación**: Videos, imágenes de lecciones
- **Backups de RDS**: Snapshots exportados
- **Logs de aplicación**: Archivos de log para análisis

**¿Por qué?**
- **Durabilidad**: 99.999999999% (11 nueves)
- **Escalabilidad**: Almacena petabytes sin límite
- **Costo**: Muy económico para almacenamiento masivo
- **CDN Integration**: Fácil integración con CloudFront

**Configuración sugerida:**
- Buckets separados: `diabetes-care-prod-assets`, `diabetes-care-prod-backups`, `diabetes-care-prod-logs`
- Versioning: Habilitado para assets críticos
- Lifecycle policies: Transición a Glacier después de 90 días para backups
- CORS: Configurado para acceso desde la app móvil
- Encryption: SSE-S3 o SSE-KMS

---

### 8. **Amazon SNS (Simple Notification Service)**
**¿Qué es?**  
Servicio de notificaciones push, SMS y email.

**¿Para qué se usa?**
- **Push Notifications**: Notificaciones a la app móvil (iOS/Android)
  - Recordatorios de medicación
  - Alertas de glucosa crítica
  - Notificaciones de nuevos mensajes en foro
  - Recordatorios de check-in diario
- **SMS**: Para alertas críticas cuando la app no está activa
- **Notificaciones a familiares**: Alertas automáticas cuando se activan

**¿Por qué?**
- **Multi-canal**: Push, SMS, email desde un solo servicio
- **Escalabilidad**: Maneja millones de notificaciones
- **Costo**: Pay-per-message, muy económico
- **Integración**: Fácil integración con Lambda para lógica de negocio

**Configuración sugerida:**
- Topics por tipo:
  - `medication-reminders`
  - `critical-alerts`
  - `family-notifications`
  - `forum-updates`
- Subscriptions: Endpoints móviles (APNS para iOS, FCM para Android)
- Dead Letter Queue: SQS para notificaciones fallidas

---

### 9. **Amazon SES (Simple Email Service)**
**¿Qué es?**  
Servicio de envío de emails transaccionales.

**¿Para qué se usa?**
- **Emails transaccionales**: Confirmaciones de registro, reset de contraseña
- **Reportes mensuales**: Envío de reportes de salud a familiares
- **Recordatorios**: Recordatorios de citas con profesionales
- **Newsletters**: Actualizaciones educativas (opcional)

**¿Por qué?**
- **Costo**: Muy económico ($0.10 por 1000 emails)
- **Deliverability**: Alta tasa de entrega con configuración adecuada
- **Templates**: Soporte para templates HTML

**Configuración sugerida:**
- Domain verification: Verificar dominio para mejor deliverability
- Templates: Usar SES Templates para emails consistentes
- Bounce/Complaint handling: Configurar SNS topics para manejar bounces

---

### 10. **Amazon CloudFront**
**¿Qué es?**  
Red de distribución de contenido (CDN) global.

**¿Para qué se usa?**
- **Distribución de assets**: Imágenes, videos de lecciones educativas
- **Caché de API**: Caché de respuestas API para endpoints de lectura
- **DDoS Protection**: Protección integrada contra ataques DDoS
- **HTTPS**: Terminación SSL/TLS global

**¿Por qué?**
- **Latencia baja**: Entrega de contenido desde edge locations cercanas al usuario
- **Reducción de carga**: Reduce carga en API Gateway y Lambda
- **Seguridad**: WAF integration, DDoS protection
- **Costo**: Reduce costos de transferencia de datos

**Configuración sugerida:**
- Origins: S3 bucket para assets, API Gateway para API
- Caching: 
  - Assets estáticos: 1 año
  - API responses: 5-10 minutos (según endpoint)
- Compression: Habilitado (gzip, brotli)
- SSL/TLS: TLSv1.2 mínimo

---

### 11. **Amazon Kinesis Data Streams**
**¿Qué es?**  
Servicio de streaming de datos en tiempo real.

**¿Para qué se usa?**
- **Streaming de métricas**: Envío de métricas de salud en tiempo real
- **Eventos de usuario**: Tracking de acciones (check-ins, lecciones completadas)
- **Analytics en tiempo real**: Procesamiento de eventos para dashboards

**¿Por qué?**
- **Tiempo real**: Procesamiento de eventos en segundos
- **Escalabilidad**: Maneja millones de eventos por segundo
- **Integración**: Fácil integración con Lambda, Firehose, QuickSight

**Configuración sugerida:**
- Shards: 2-4 shards iniciales (1 MB/segundo por shard)
- Retention: 24 horas (máximo 7 días)
- Consumers: Lambda functions para procesamiento en tiempo real

---

### 12. **Amazon Kinesis Data Firehose**
**¿Qué es?**  
Servicio de ingesta de datos a almacenamiento.

**¿Para qué se usa?**
- **Ingesta a S3**: Almacenamiento de logs y eventos para análisis histórico
- **Ingesta a Redshift**: Para análisis de datos grandes (opcional)
- **Transformación**: Transformación de datos antes de almacenar

**¿Por qué?**
- **Automatización**: Ingesta automática sin gestión de infraestructura
- **Transformación**: Lambda functions para transformar datos en vuelo
- **Costo**: Pay-per-GB ingerido

---

### 13. **Amazon QuickSight**
**¿Qué es?**  
Servicio de business intelligence y visualización de datos.

**¿Para qué se usa?**
- **Dashboards para profesionales**: Métricas agregadas de pacientes
- **Reportes para familiares**: Visualización de progreso del paciente
- **Analytics internos**: KPIs de la aplicación (usuarios activos, retención)

**¿Por qué?**
- **Fácil de usar**: Interface drag-and-drop para crear dashboards
- **Costo**: Pay-per-session, muy económico
- **Integración**: Conecta fácilmente con RDS, S3, Redshift

---

### 14. **Amazon CloudWatch**
**¿Qué es?**  
Servicio de monitoreo y observabilidad.

**¿Para qué se usa?**
- **Logs de aplicación**: Centralización de logs de todas las Lambdas
- **Métricas**: CPU, memoria, latencia, errores
- **Alertas**: Notificaciones cuando métricas exceden umbrales
- **Dashboards**: Visualización de métricas clave

**¿Por qué?**
- **Integración nativa**: Todos los servicios AWS envían métricas automáticamente
- **Debugging**: Logs centralizados facilitan troubleshooting
- **Alertas proactivas**: Detección temprana de problemas

**Configuración sugerida:**
- Log Groups: Por función Lambda, retención de 30 días
- Alarms:
  - Error rate > 5%
  - Latencia p95 > 2 segundos
  - RDS CPU > 80%
- Dashboards: Métricas clave por servicio

---

### 15. **AWS X-Ray**
**¿Qué es?**  
Servicio de trazabilidad distribuida.

**¿Para qué se usa?**
- **Trazabilidad de requests**: Seguimiento de requests a través de múltiples servicios
- **Análisis de rendimiento**: Identificación de cuellos de botella
- **Debugging**: Visualización de flujos completos de requests

**¿Por qué?**
- **Visibilidad**: Entiende cómo los servicios interactúan
- **Optimización**: Identifica servicios lentos para optimizar
- **Debugging**: Facilita encontrar la causa raíz de errores

---

### 16. **AWS WAF (Web Application Firewall)**
**¿Qué es?**  
Firewall de aplicaciones web.

**¿Para qué se usa?**
- **Protección contra ataques**: SQL injection, XSS, CSRF
- **Rate limiting avanzado**: Por IP, por usuario autenticado
- **Geo-blocking**: Bloquear tráfico de ciertas regiones (opcional)
- **Bot protection**: Detección y bloqueo de bots maliciosos

**¿Por qué?**
- **Seguridad**: Primera línea de defensa contra ataques comunes
- **HIPAA Compliance**: Protección adicional para datos de salud
- **Costo**: Pay-per-rule, muy económico

**Configuración sugerida:**
- Web ACL asociado a API Gateway
- Rules:
  - AWS Managed Rules (Core, Known Bad Inputs)
  - Rate limiting: 2000 requests/5 minutos por IP
  - Geo-blocking: Bloquear países no deseados (opcional)

---

### 17. **AWS Secrets Manager**
**¿Qué es?**  
Servicio de gestión de secretos y credenciales.

**¿Para qué se usa?**
- **Credenciales de base de datos**: Usuario/contraseña de RDS
- **API Keys**: Claves de servicios externos (APNS, FCM)
- **Tokens**: Tokens de integración con sistemas hospitalarios

**¿Por qué?**
- **Seguridad**: Encriptación automática, rotación de secretos
- **Auditoría**: Logs de acceso a secretos
- **Integración**: Fácil acceso desde Lambda, RDS

**Configuración sugerida:**
- Secrets por servicio:
  - `rds/credentials`
  - `apns/key`
  - `fcm/key`
- Rotación automática: Habilitada para RDS (cada 30 días)

---

### 18. **AWS KMS (Key Management Service)**
**¿Qué es?**  
Servicio de gestión de claves de encriptación.

**¿Para qué se usa?**
- **Encriptación de datos**: Encriptación de datos en RDS, S3, DynamoDB
- **Gestión de claves**: Creación, rotación, revocación de claves
- **Control de acceso**: Políticas IAM para controlar acceso a claves

**¿Por qué?**
- **HIPAA Compliance**: Requerido para encriptación de datos de salud
- **Control**: Control total sobre claves de encriptación
- **Auditoría**: Logs de uso de claves en CloudTrail

**Configuración sugerida:**
- Customer Managed Keys (CMK) para mayor control
- Alias: `alias/diabetes-care-encryption`
- Key policy: Restringir acceso a servicios específicos

---

## 📊 Diagramas de Flujo

### Flujo 1: Check-in Diario y Procesamiento de Recompensas

```
┌─────────────┐
│   Usuario   │
│  (App Rimac)│
└──────┬──────┘
       │
       │ 1. Inicia check-in diario
       │    (Ya autenticado en Rimac)
       ▼
┌─────────────────────────────────┐
│   API Gateway                   │
│   - Custom Authorizer           │
│   - Valida JWT de Rimac         │
└──────┬──────────────────────────┘
       │
       │ 2. Request autenticado
       │    (user_id extraído del token)
       ▼
┌─────────────────────────────────┐
│   API Gateway                   │
│   - Rate limiting               │
│   - Request validation          │
└──────┬──────────────────────────┘
       │
       │ 3. POST /check-in
       ▼
┌─────────────────────────────────┐
│   Lambda: check-in-lambda       │
│   - Procesa respuestas          │
│   - Calcula recompensas         │
└──────┬──────────────────────────┘
       │
       ├─► 4a. Guarda check-in
       │   ┌─────────────────────┐
       │   │ DynamoDB             │
       │   │ - check_ins table    │
       │   └─────────────────────┘
       │
       ├─► 4b. Actualiza monedas
       │   ┌─────────────────────┐
       │   │ DynamoDB             │
       │   │ - user_coins table   │
       │   └─────────────────────┘
       │
       ├─► 4c. Actualiza racha
       │   ┌─────────────────────┐
       │   │ RDS                 │
       │   │ - users.streak      │
       │   └─────────────────────┘
       │
       └─► 5. Envía evento
           ┌─────────────────────┐
           │ Kinesis Stream      │
           │ - Event: check-in   │
           └─────────────────────┘
                   │
                   ▼
           ┌─────────────────────┐
           │ Lambda: analytics   │
           │ - Actualiza stats   │
           └─────────────────────┘
                   │
                   ▼
           ┌─────────────────────┐
           │ CloudWatch          │
           │ - Logs y métricas   │
           └─────────────────────┘
                   │
                   ▼
       ┌───────────────────────────┐
       │   Response a App Móvil    │
       │   - Coins ganados         │
       │   - Nueva racha           │
       └───────────────────────────┘
```

**Descripción del flujo:**
1. Usuario completa el check-in diario en la app
2. App envía request autenticado a API Gateway
3. API Gateway valida y enruta a Lambda
4. Lambda procesa las respuestas, calcula recompensas (10 Bone Coins), actualiza racha
5. Datos se guardan en DynamoDB (check-in) y RDS (usuario)
6. Evento se envía a Kinesis para analytics
7. Respuesta con recompensas se envía al usuario

---

### Flujo 2: Registro de Métrica de Glucosa y Alerta Automática

```
┌─────────────┐
│   Usuario   │
│  (App Rimac)│
└──────┬──────┘
       │
       │ 1. Registra glucosa: 250 mg/dL
       │    (Token JWT de Rimac en header)
       ▼
┌─────────────────────────────────┐
│   API Gateway                   │
│   - Custom Authorizer           │
│   - Valida JWT de Rimac         │
│   POST /health-metrics          │
└──────┬──────────────────────────┘
       │
       │ 2. Request autenticado
       │    (user_id del token)
       ▼
┌─────────────────────────────────┐
│   Lambda: health-metrics-lambda│
│   - Valida rango normal         │
│   - Detecta valor crítico       │
└──────┬──────────────────────────┘
       │
       ├─► 3a. Guarda métrica
       │   ┌─────────────────────┐
       │   │ DynamoDB            │
       │   │ - Realtime table    │
       │   └─────────────────────┘
       │   │
       │   ┌─────────────────────┐
       │   │ RDS                 │
       │   │ - Histórico         │
       │   └─────────────────────┘
       │
       └─► 3b. ¿Valor crítico?
           │ (glucosa > 180 o < 70)
           │
           ├─ NO ──► Fin
           │
           └─ SÍ ──►
               ┌─────────────────────┐
               │ Lambda: alert-lambda │
               │ - Crea alerta       │
               └──────┬───────────────┘
                      │
                      ├─► 4a. Guarda alerta
                      │   ┌─────────────────┐
                      │   │ RDS             │
                      │   │ - alerts table  │
                      │   └─────────────────┘
                      │
                      └─► 4b. Notifica
                          ├─► Push Notification
                          │   ┌───────────────┐
                          │   │ SNS           │
                          │   │ - APNS/FCM    │
                          │   └───────────────┘
                          │
                          └─► Notifica familiares
                              ┌───────────────┐
                              │ SNS           │
                              │ - Email (SES) │
                              │ - SMS         │
                              └───────────────┘
```

**Descripción del flujo:**
1. Usuario registra lectura de glucosa (manual o desde dispositivo)
2. Lambda valida y detecta si está fuera de rango crítico
3. Métrica se guarda en DynamoDB (tiempo real) y RDS (histórico)
4. Si es crítica, se activa alert-lambda
5. Alerta se guarda en RDS
6. Notificaciones push se envían al usuario
7. Familiares configurados reciben email/SMS

---

### Flujo 3: Recordatorio de Medicación y Adherencia

```
┌─────────────────────────────────┐
│   EventBridge (Cron)            │
│   - Cada hora                   │
└──────┬──────────────────────────┘
       │
       │ 1. Trigger cada hora
       ▼
┌─────────────────────────────────┐
│   Lambda: medication-reminder   │
│   - Consulta medicamentos       │
│   - Filtra próximos 15 min      │
└──────┬──────────────────────────┘
       │
       │ 2. Query RDS
       ▼
┌─────────────────────────────────┐
│   RDS                           │
│   - medications table           │
│   - medication_schedules        │
└──────┬──────────────────────────┘
       │
       │ 3. Lista de usuarios
       │    con medicación próxima
       ▼
┌─────────────────────────────────┐
│   Para cada usuario:            │
│   Lambda: send-notification     │
└──────┬──────────────────────────┘
       │
       │ 4. Envía notificación
       ▼
┌─────────────────────────────────┐
│   SNS                           │
│   - Push Notification           │
│   Topic: medication-reminders   │
└──────┬──────────────────────────┘
       │
       │ 5. Notificación recibida
       ▼
┌─────────────────────────────────┐
│   Usuario (App Móvil)           │
│   - Ve recordatorio             │
└──────┬──────────────────────────┘
       │
       │ 6a. Marca como tomada
       │     (dentro de 15 min)
       │
       ▼
┌─────────────────────────────────┐
│   API Gateway                   │
│   POST /medication/taken         │
└──────┬──────────────────────────┘
       │
       │ 6b. Request
       ▼
┌─────────────────────────────────┐
│   Lambda: medication-lambda      │
│   - Registra toma               │
│   - Calcula si fue tarde        │
└──────┬──────────────────────────┘
       │
       ├─► 7a. Guarda log
       │   ┌─────────────────────┐
       │   │ RDS                 │
       │   │ - medication_logs    │
       │   └─────────────────────┘
       │
       └─► 7b. Actualiza adherencia
           ┌─────────────────────┐
           │ RDS                 │
           │ - Calcula % mensual │
           └─────────────────────┘
```

**Descripción del flujo:**
1. EventBridge dispara Lambda cada hora
2. Lambda consulta RDS para medicamentos próximos (próximos 15 minutos)
3. Para cada usuario con medicación próxima, se envía notificación push
4. Usuario recibe notificación en la app
5. Usuario marca medicamento como tomado
6. Lambda registra la toma y calcula si fue a tiempo o tarde (tolerancia 10-15 min)
7. Se actualiza el log de medicación y el porcentaje de adherencia mensual

---

### Flujo 4: Generación de Reporte Mensual para Familiares

```
┌─────────────────────────────────┐
│   EventBridge (Cron)            │
│   - Último día del mes          │
└──────┬──────────────────────────┘
       │
       │ 1. Trigger mensual
       ▼
┌─────────────────────────────────┐
│   Lambda: report-generator      │
│   - Consulta datos del mes      │
└──────┬──────────────────────────┘
       │
       ├─► 2a. Métricas de salud
       │   ┌─────────────────────┐
       │   │ RDS                 │
       │   │ - health_metrics     │
       │   │ - Calcula promedio  │
       │   └─────────────────────┘
       │
       ├─► 2b. Adherencia
       │   ┌─────────────────────┐
       │   │ RDS                 │
       │   │ - medication_logs   │
       │   │ - Calcula %         │
       │   └─────────────────────┘
       │
       └─► 2c. Racha actual
           ┌─────────────────────┐
           │ RDS                 │
           │ - users.streak       │
           └─────────────────────┘
                   │
                   ▼
       ┌───────────────────────────┐
       │   Genera reporte HTML    │
       │   (template)             │
       └──────┬───────────────────┘
              │
              │ 3. Guarda reporte
              ▼
       ┌───────────────────────────┐
       │   S3                      │
       │   - reports/YYYY-MM/      │
       └──────┬───────────────────┘
              │
              │ 4. Obtiene familiares
              ▼
       ┌───────────────────────────┐
       │   RDS                     │
       │   - family_relationships  │
       └──────┬───────────────────┘
              │
              │ 5. Para cada familiar
              ▼
       ┌───────────────────────────┐
       │   Lambda: send-email      │
       └──────┬───────────────────┘
              │
              │ 6. Envía email
              ▼
       ┌───────────────────────────┐
       │   SES                     │
       │   - Template: monthly-    │
       │     report                │
       │   - Adjunta PDF/HTML      │
       └───────────────────────────┘
```

**Descripción del flujo:**
1. EventBridge dispara Lambda el último día del mes
2. Lambda consulta RDS para obtener:
   - Promedio de glucosa del mes
   - Porcentaje de adherencia a medicación
   - Racha actual de check-ins
3. Se genera reporte HTML/PDF usando template
4. Reporte se guarda en S3
5. Se consultan familiares con permisos de visualización
6. Para cada familiar, se envía email con reporte adjunto vía SES

---

### Flujo 5: Procesamiento de Alerta de Patrón Emocional Preocupante

```
┌─────────────────────────────────┐
│   EventBridge (Cron)            │
│   - Diario, 2 AM                │
└──────┬──────────────────────────┘
       │
       │ 1. Trigger diario
       ▼
┌─────────────────────────────────┐
│   Lambda: emotional-pattern      │
│   - Analiza últimos 7 días      │
└──────┬──────────────────────────┘
       │
       │ 2. Consulta check-ins
       ▼
┌─────────────────────────────────┐
│   RDS                           │
│   - check_ins (últimos 7 días)  │
│   - Analiza respuestas          │
│     emocionales                 │
└──────┬──────────────────────────┘
       │
       │ 3. ¿Patrón preocupante?
       │    (ej: 5+ días "triste")
       │
       ├─ NO ──► Fin
       │
       └─ SÍ ──►
           ┌─────────────────────┐
           │ Lambda: alert-lambda │
           │ - Crea alerta        │
           └──────┬───────────────┘
                  │
                  ├─► 4a. Guarda alerta
                  │   ┌───────────────┐
                  │   │ RDS           │
                  │   │ - alerts      │
                  │   └───────────────┘
                  │
                  └─► 4b. Notifica
                      ├─► Usuario
                      │   ┌───────────┐
                      │   │ SNS       │
                      │   │ - Push    │
                      │   └───────────┘
                      │
                      └─► Familiares + Profesionales
                          ┌───────────┐
                          │ SNS       │
                          │ - Email   │
                          │ - SMS     │
                          └───────────┘
```

**Descripción del flujo:**
1. EventBridge dispara Lambda diariamente a las 2 AM
2. Lambda consulta check-ins de los últimos 7 días
3. Analiza respuestas emocionales para detectar patrones preocupantes
4. Si detecta patrón (ej: 5+ días consecutivos con estado "triste" o "ansioso")
5. Se crea alerta en RDS
6. Se notifica al usuario vía push
7. Familiares y profesionales configurados reciben email/SMS

---

### Flujo 6: Canje de Recompensa con Monedas

```
┌─────────────┐
│   Usuario   │
│  (App Rimac)│
└──────┬──────┘
       │
       │ 1. Selecciona recompensa
       │    y hace clic en "Canjear"
       │    (Token JWT de Rimac)
       ▼
┌─────────────────────────────────┐
│   API Gateway                   │
│   - Custom Authorizer           │
│   - Valida JWT de Rimac         │
│   POST /rewards/redeem          │
└──────┬──────────────────────────┘
       │
       │ 2. Request autenticado
       │    (user_id del token)
       ▼
┌─────────────────────────────────┐
│   Lambda: rewards-lambda        │
│   - Valida disponibilidad       │
│   - Verifica monedas            │
└──────┬──────────────────────────┘
       │
       ├─► 3a. Consulta recompensa
       │   ┌─────────────────────┐
       │   │ RDS                 │
       │   │ - rewards table     │
       │   │ - Verifica stock    │
       │   └─────────────────────┘
       │
       ├─► 3b. Consulta monedas
       │   ┌─────────────────────┐
       │   │ DynamoDB            │
       │   │ - user_coins        │
       │   └─────────────────────┘
       │
       │ 4. ¿Monedas suficientes?
       │    ¿Recompensa disponible?
       │
       ├─ NO ──► Error response
       │
       └─ SÍ ──►
           ┌─────────────────────┐
           │ Lambda: process-    │
           │        redemption    │
           └──────┬───────────────┘
                  │
                  ├─► 5a. Descuenta monedas
                  │   ┌───────────────┐
                  │   │ DynamoDB      │
                  │   │ - Update coins│
                  │   └───────────────┘
                  │
                  ├─► 5b. Registra transacción
                  │   ┌───────────────┐
                  │   │ RDS           │
                  │   │ - transactions│
                  │   └───────────────┘
                  │
                  ├─► 5c. Actualiza stock
                  │   ┌───────────────┐
                  │   │ RDS           │
                  │   │ - rewards.stock│
                  │   └───────────────┘
                  │
                  └─► 6. Notifica confirmación
                      ┌───────────────┐
                      │ SNS           │
                      │ - Push        │
                      └───────────────┘
```

**Descripción del flujo:**
1. Usuario selecciona recompensa y hace clic en "Canjear"
2. Lambda valida que la recompensa esté disponible y que el usuario tenga monedas suficientes
3. Se consultan RDS (recompensa) y DynamoDB (monedas del usuario)
4. Si todo es válido, se procesa el canje:
   - Se descuentan monedas del usuario
   - Se registra transacción en RDS
   - Se actualiza stock de la recompensa
5. Se envía notificación push de confirmación

---

## 🔒 Consideraciones de Seguridad

### HIPAA Compliance
- **Encriptación en tránsito**: TLS 1.2+ en todas las comunicaciones
- **Encriptación en reposo**: KMS para RDS, S3, DynamoDB
- **Access Control**: IAM roles con principio de menor privilegio
- **Auditoría**: CloudTrail para logs de acceso
- **BAA**: Business Associate Agreement con AWS para servicios HIPAA-eligible

### Mejores Prácticas
- **Secrets Management**: Secrets Manager para credenciales
- **Network Security**: VPC para recursos privados, Security Groups restrictivos
- **WAF**: Protección contra ataques comunes
- **Rate Limiting**: API Gateway y WAF para prevenir abusos
- **MFA**: Requerido para administradores y profesionales de salud

---

## 📈 Escalabilidad y Costos

### Escalabilidad
- **Serverless**: Lambda, API Gateway, DynamoDB escalan automáticamente
- **RDS**: Auto-scaling de storage, read replicas para lecturas
- **CDN**: CloudFront distribuye carga globalmente
- **Caché**: ElastiCache reduce carga en bases de datos

### Estimación de Costos (Mensual, 10,000 usuarios activos)

| Servicio | Uso Estimado | Costo Mensual |
|----------|-------------|---------------|
| Lambda | 50M requests | $10 |
| API Gateway | 50M requests | $150 |
| RDS (db.t3.medium) | 1 instancia Multi-AZ | $150 |
| DynamoDB | 50M reads, 25M writes | $50 |
| ElastiCache | cache.t3.small | $30 |
| S3 | 100 GB storage | $3 |
| CloudFront | 500 GB transfer | $40 |
| SNS | 1M push notifications | $1 |
| SES | 10K emails | $1 |
| Custom Authorizer | Validación de tokens | Incluido en Lambda |
| CloudWatch | Logs y métricas | $20 |
| **Total Estimado** | | **~$455/mes** |

*Nota: Costos varían según región, uso real y optimizaciones.*

### Optimizaciones de Costo
- **Reserved Instances**: Para RDS (hasta 40% descuento)
- **S3 Lifecycle**: Transición a Glacier para backups antiguos
- **CloudFront Caching**: Reduce requests a API Gateway
- **DynamoDB On-Demand**: Para tráfico impredecible (evita over-provisioning)
- **Lambda Provisioned Concurrency**: Solo para funciones críticas

---

## 🚀 Próximos Pasos

1. **Implementación Gradual**:
   - Fase 1: Integración con autenticación Rimac + API Gateway + Lambda + RDS (MVP)
   - Fase 2: DynamoDB + ElastiCache (optimización)
   - Fase 3: SNS + SES (notificaciones)
   - Fase 4: Kinesis + QuickSight (analytics)

2. **Integración con Sistema Rimac**:
   - Configurar Custom Authorizer para validar tokens JWT de Rimac
   - Establecer endpoint de sincronización de usuarios (webhook o polling)
   - Definir contrato de API para intercambio de información de usuario
   - Implementar user-sync-lambda para crear perfiles automáticamente

2. **Monitoreo y Observabilidad**:
   - Configurar CloudWatch dashboards
   - Habilitar X-Ray para tracing
   - Configurar alertas proactivas

3. **Seguridad**:
   - Configurar WAF rules
   - Habilitar encriptación en todos los servicios
   - Configurar backups automáticos

4. **Testing**:
   - Load testing con AWS Load Testing
   - Chaos engineering con AWS Fault Injection Simulator

---

## 📚 Referencias

- [AWS Well-Architected Framework](https://aws.amazon.com/architecture/well-architected/)
- [HIPAA Compliance on AWS](https://aws.amazon.com/compliance/hipaa-compliance/)
- [AWS Serverless Application Lens](https://docs.aws.amazon.com/wellarchitected/latest/serverless-applications-lens/welcome.html)

---

**Última actualización**: 2024
**Versión**: 1.0

