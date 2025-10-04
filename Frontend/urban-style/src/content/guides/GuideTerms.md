# Guía para la Gestión de Términos y Condiciones

Esta guía explica cómo actualizar y publicar nuevas versiones de los Términos y Condiciones en la plataforma. El sistema utiliza **Versionado Semántico (SemVer)** para asegurar que los cambios sean claros y transparentes para los usuarios.

---

## ¿Cómo funciona el versionado?

El versionado sigue el formato **MAJOR.MINOR.PATCH** (ej: `2.1.5`). Cada número representa un tipo de cambio específico:

- **MAJOR (`X.y.z`):** Se incrementa para cambios drásticos que pueden afectar los derechos y obligaciones de los usuarios. Generalmente, estos cambios no son compatibles con versiones anteriores y requerirán que los usuarios acepten los nuevos términos explícitamente.
  - **Ejemplo:** Introducir una cláusula de arbitraje obligatorio.
  - `1.5.2` → `2.0.0`

- **MINOR (`x.Y.z`):** Se incrementa al añadir nuevas funcionalidades o cláusulas que son compatibles con la versión actual. Los usuarios existentes no se ven perjudicados por estos cambios.
  - **Ejemplo:** Añadir una política de devoluciones para una nueva categoría de productos.
  - `1.2.4` → `1.3.0`

- **PATCH (`x.y.Z`):** Se incrementa para correcciones menores, como errores de redacción, aclaraciones o cambios de formato que no alteran el significado legal de los términos.
  - **Ejemplo:** Corregir un error tipográfico o actualizar un enlace roto.
  - `1.2.1` → `1.2.2`

---

## Etiquetas Dinámicas

Al redactar los términos, puedes usar "etiquetas dinámicas" que el sistema reemplazará automáticamente al publicar el documento.

- **`{{version}}`**: Muestra la versión actual del documento (ej: `v1.3.0`).
- **`{{publishedAt}}`**: Muestra la fecha en que la versión fue publicada (ej: `26/09/2025`).
- **`{{version_history}}`**: Inserta una tabla con el historial de todas las versiones publicadas, incluyendo su fecha y una descripción de los cambios.

---

## Estructura Recomendada del Documento

A continuación, se muestra un ejemplo de cómo estructurar tus Términos y Condiciones en formato Markdown para aprovechar al máximo las funcionalidades del sistema.

```markdown
# Términos y Condiciones de UrbanStyle

**Versión:** {{version}}  
**Fecha de Publicación:** {{publishedAt}}

---

## 1. Introducción

Bienvenido a UrbanStyle. Estos términos rigen el uso de nuestros servicios y la compra de productos en nuestra plataforma.

## 2. Condiciones Generales de Venta

Aquí se detallan las políticas sobre pedidos, pagos, envíos y devoluciones...

## 3. Propiedad Intelectual

Todo el contenido de este sitio, incluyendo imágenes, textos y logos, está protegido por derechos de autor.

## 4. Modificaciones a los Términos

Nos reservamos el derecho de modificar estos términos en cualquier momento. Los cambios significativos serán notificados a los usuarios y se reflejarán en una nueva versión del documento.

---

## Historial de Versiones

{{version_history}}
```

### ¿Cómo se verá el historial de versiones?

La etiqueta `{{version_history}}` generará automáticamente una sección similar a esta:

- **1.2.0** | 26 de septiembre, 2025
- **1.1.0** | 10 de julio, 2025
- **1.0.0** | 01 de enero, 2025

---

Con esta estructura, mantendrás un registro claro y accesible de todas las actualizaciones, garantizando la transparencia con tus usuarios.
