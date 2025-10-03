# Guía para Publicar Términos y Condiciones

El E-commerce usa **Versionado Semántico (SemVer)** y etiquetas dinámicas para controlar cambios en los Términos y Condiciones.

---

## SemVer

Formato: **MAJOR.MINOR.PATCH**

- **MAJOR:** cambios importantes o incompatibles (`1.x.x` → `2.0.0`).
- **MINOR:** nuevas cláusulas compatibles (`1.2.0` → `1.3.0`).
- **PATCH:** correcciones menores o de redacción (`1.2.1` → `1.2.2`).

---

## Etiquetas dinámicas

- **`{{version}}`** → versión actual (ej: `v1.2.0`).
- **`{{publishedAt}}`** → fecha de publicación (ej: `26/09/2025`).
- **`{{version_history}}`** → historial de versiones con fecha y descripción.

---

## Ejemplo de estructura

```markdown
# Términos y Condiciones

**Versión:** {{version}}  
**Fecha de Publicación:** {{publishedAt}}

---

## 1. Introducción

Texto de ejemplo...

## 2. Condiciones Generales

Texto de ejemplo...

## 3. Cambios

Podemos actualizar estos Términos y reflejarlo en la versión y fecha.

---

## Historial de Versiones

{{version_history}}
```
