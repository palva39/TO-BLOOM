# Requisitos del Proyecto: Florecer

## 1. Nombre del Proyecto

Florecer

---

## 2. Miembros del Equipo

[Por completar]

---

## 3. Descripción General del Proyecto

Florecer es un asistente personal de bienestar y plataforma de e-commerce basada en la web que ayuda a los usuarios a gestionar sus necesidades de belleza, nutrición y cuidado de la piel mediante recomendaciones personalizadas, comunidad y una experiencia personalizable. Combina educación, descubrimiento de productos y bienestar mental en una interfaz hermosa y fácil de usar. Incluye una página de administración donde el admin puede ver todos los perfiles y enviar recomendaciones al carrito de los usuarios para rutinas o productos de cuidado.

---

## 4. Declaración del Problema

Muchas personas buscan mejorar su bienestar personal, pero enfrentan dificultades para encontrar información confiable, productos adecuados y motivación constante. Florecer resuelve esto ofreciendo recomendaciones personalizadas, comunidad, y herramientas para planificar rutinas y compras, todo en un solo lugar. Usuarios objetivo: personas interesadas en bienestar, belleza, nutrición y cuidado personal.

---

## 5. Características Clave (Historias de Usuario)

- Como usuario, quiero registrarme y personalizar mis necesidades de cuidado (nutrición, piel, cabello) para recibir recomendaciones relevantes.
- Como usuario, quiero ver contenido y productos personalizados según mis preferencias.
- Como usuario, quiero comprar productos, planificar rutinas y participar en la comunidad.
- Como usuario, quiero gestionar mi perfil, preferencias y métodos de pago (simulado).
- Como usuario, quiero guardar favoritos y rutinas de cuidado.
- Como usuario, quiero buscar usuarios, productos, rutinas y recetas.
- Como usuario, quiero recibir mensajes motivacionales y disfrutar de una interfaz animada y atractiva.
- Como admin, quiero ver todos los perfiles y enviar recomendaciones a los carritos de los usuarios.

---

## 6. Fuera del Alcance

- Integración con pasarelas de pago reales (solo simulación de compra).
- Envío físico de productos.
- Integraciones con dispositivos de salud externos.

---

## 7. Criterios de Éxito

- Usuarios pueden registrarse, personalizar su perfil y recibir recomendaciones.
- El sistema muestra contenido y productos personalizados.
- El flujo de compra y carrito funciona (simulado).
- El admin puede ver perfiles y enviar recomendaciones.
- La interfaz es atractiva, responsiva y motivacional.

---

## 8. Cronograma / Hitos

- Semana 1: Configuración, autenticación y perfiles
- Semana 2: Personalización y recomendaciones
- Semana 3: Tienda, carrito y rutinas
- Semana 4: Comunidad, búsqueda y UI motivacional
- Semana 5: Panel de admin y pruebas finales

---

## 9. Estilo Visual y CSS

### Paleta de Colores (Definida en :root)

- --morado-pastel: #e9d8fd – lavanda suave para fondos delicados
- --morado-principal: #b48be6 – para branding y acentos
- --verde-menta: #b2f7ef – menta calmante para detalles secundarios
- --morado-oscuro: #7b3f00 – marrón cálido para contraste y legibilidad
- --blanco: #fff – para mantener espacios limpios y aireados

**Intención Visual:**
Una mezcla de pastel y menta crea una experiencia digital tipo spa, transmitiendo seguridad, cuidado y positividad.

### 📐 Layout & Estructura

- Fondo con gradiente diagonal para fluidez visual y suavidad.
- Contenedores centrados y con ancho máximo para legibilidad.
- Uso de box-shadow, border-radius y opacidad ligera para tarjetas "flotantes" y componentes modernos.

### 🦋 Visuales Lúdicos: Mariposas & Mascotas

- Mariposas SVG flotan suavemente usando la animación @keyframes butterfly-float.
- Aparecen en esquinas con retrasos y tamaños aleatorios, aportando calma y elegancia.
- Mascota "Florita": flor animada que rebota y da mensajes motivacionales.

### 📚 Tipografía & Legibilidad

- Fuente: 'Nunito', 'Segoe UI', Arial – sans-serif moderna y redondeada.
- Encabezados grandes con letter-spacing y text-shadow para jerarquía.
- Etiquetas y párrafos ligeramente sobredimensionados para accesibilidad.

### 💻 Estilo de Componentes UI

- **Navegación:** Botones tipo "píldora" con bordes pastel y hover llamativo, responsivos.
- **Secciones / Tarjetas (.main-section, .auth-form):** Fondos blancos suaves, esquinas redondeadas, sombras en capas, animación fadeInUp al cargar.
- **Formularios:** Inputs con resplandor suave al enfocar, hover en tarjetas y botones con efecto "elevado". Botones con gradiente lavanda-menta.

### ✨ Micro-Animaciones

- fadeInUp para carga progresiva.
- :hover en tarjetas, enlaces y posts.
- Transiciones en botones para feedback táctil.

### 📱 Diseño Responsivo

- Secciones principales totalmente adaptables.
- Formularios y tarjetas escalan a 98vw.
- Navegación y fuentes ajustan para móviles.

### 💬 Feedback al Usuario

- Errores (#login-error, #register-error) en rojo fuerte.
- Mensajes de éxito (#defectos-msg) en verde saludable.
- Animaciones sutiles para feedback inmediato y amigable.

### 🧘‍♀️ Intención Emocional del Diseño

El tema CSS de Florecer se inspira en la serenidad, el crecimiento personal y la belleza solidaria:

- Los tonos suaves reflejan sanación y cuidado.
- Elementos curvos y animaciones imitan el ritmo de la naturaleza.
- Cada interacción (hover, click, scroll) es suave y afirmativa.

---
