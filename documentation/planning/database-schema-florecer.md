# Esquema de Base de Datos: Florecer

_¿Cuáles son las entidades principales y relaciones en tu modelo de datos?_

---

## Diagrama ER

```mermaid
erDiagram
  USUARIO {
    int id
    string nombre
    string correo
    string password
    string avatar_url
    string bio
    string rol
    json preferencias
  }
  PRODUCTO {
    int id
    string nombre
    string descripcion
    float precio
    string imagen_url
    string categoria
  }
  CARRITO {
    int id
    int usuario_id
    float total
  }
  CARRITO_ITEM {
    int id
    int carrito_id
    int producto_id
    int cantidad
  }
  RUTINA {
    int id
    int usuario_id
    string nombre
    string tipo
    json pasos
  }
  FAVORITO {
    int id
    int usuario_id
    int producto_id
  }
  RECOMENDACION {
    int id
    int admin_id
    int usuario_id
    int producto_id
    string mensaje
  }
  POST {
    int id
    int usuario_id
    string contenido
    datetime fecha
  }
  USUARIO ||--o{ CARRITO : tiene
  USUARIO ||--o{ RUTINA : crea
  USUARIO ||--o{ FAVORITO : guarda
  USUARIO ||--o{ POST : publica
  USUARIO ||--o{ RECOMENDACION : recibe
  ADMIN ||--o{ RECOMENDACION : envia
  CARRITO ||--o{ CARRITO_ITEM : contiene
  PRODUCTO ||--o{ CARRITO_ITEM : incluido
  PRODUCTO ||--o{ FAVORITO : favorito
  PRODUCTO ||--o{ RECOMENDACION : recomendado
```

<small>(Diagrama inicial. Amplía según evolucione el proyecto.)</small>

---

## Descripción

El modelo de datos de Florecer está centrado en el usuario, permitiendo personalización, recomendaciones y gestión de productos y rutinas. Los usuarios pueden registrar preferencias, crear rutinas de cuidado, guardar productos favoritos y realizar compras simuladas mediante carritos. Los administradores pueden ver perfiles y enviar recomendaciones personalizadas que aparecen en el carrito del usuario. La comunidad se fomenta mediante publicaciones (posts) y la posibilidad de interactuar con otros usuarios. Las relaciones entre entidades permiten una experiencia personalizada, flexible y escalable, alineada con los objetivos de bienestar y e-commerce de la plataforma.

<small>Agrega más entidades y relaciones a medida que tu proyecto crezca.</small>
