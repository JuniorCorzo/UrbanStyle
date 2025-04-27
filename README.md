# UrbanStyle

![Astro](https://img.shields.io/badge/Astro-%25.svg?style=for-the-badge&logo=astro&logoColor=white&color=%23BC52EE)
![React](https://img.shields.io/badge/React-%2320232a.svg?style=for-the-badge&logo=react&logoColor=%2361DAFB)
![Java](https://img.shields.io/badge/Java-%23007396.svg?style=for-the-badge&logo=java&logoColor=white)
![Spring Boot](https://img.shields.io/badge/Spring_Boot-F2F4F9?style=for-the-badge&logo=spring-boot)
![MongoDB](https://img.shields.io/badge/MongoDB-%234ea94b.svg?style=for-the-badge&logo=mongodb&logoColor=white)
![Redis](https://img.shields.io/badge/Redis-%23FF4438.svg?style=for-the-badge&logo=redis&logoColor=%23FF4438&color=%23091a22)

Este proyecto tiene como objetivo desarrollar una plataforma de comercio electrónico robusta, intuitiva y de alto rendimiento para la compra y venta de ropa en línea. La aplicación se construye utilizando arquitectura hexagonal, permitiendo una mayor flexibilidad y escalabilidad.

## Frontend

La interfaz de usuario se desarrolló utilizando Astro como framework principal para la construcción de sitios web rápidos y modernos, junto con React para componentes interactivos. Astro permite generar sitios optimizados y eficientes, facilitando el desarrollo ágil y el rendimiento óptimo en el navegador. React, con su enfoque en componentes reutilizables, complementa la experiencia de usuario interactiva y fácil de mantener.

## Backend

La lógica del servidor se implementó con Java y el framework Spring Boot. Spring Boot proporciona un entorno de desarrollo rápido y eficiente, permitiendo la creación de APIs RESTful seguras y escalables para la comunicación con el frontend. Java, como lenguaje robusto y ampliamente utilizado en el ámbito empresarial, garantiza la estabilidad y el rendimiento del backend.

Además, se implementó un módulo de procesamiento de imágenes inspirado en el servicio de Cloudflare, que permite optimizar y transformar imágenes de manera eficiente. Las imágenes no se almacenan tras ser procesadas, sino que son servidas dinámicamente a través de la API. El único procesamiento persistente consiste en transformar las imágenes al formato WebP para mejorar el rendimiento y la eficiencia en la entrega de archivos multimedia.

## Base de Datos

Para el almacenamiento de datos, se utilizará MongoDB, una base de datos NoSQL orientada a documentos. MongoDB ofrece flexibilidad en el esquema de datos y alta escalabilidad, lo que la hace ideal para manejar la gran cantidad de información asociada a un comercio electrónico, como productos, usuarios, pedidos y más.

Para el carrito de compras, se utilizará Redis, un sistema de almacenamiento en memoria que permite un acceso rápido y eficiente a los datos del carrito, lo que facilita la experiencia del usuario al realizar compras.

## Características Principales

- Catálogo de Productos: Visualización detallada de productos con imágenes, descripciones, precios y disponibilidad.

- Carrito de Compras: Funcionalidad para agregar, modificar y eliminar productos del carrito antes de la compra.

- Gestión de Usuarios: Registro, inicio de sesión y perfiles de usuario con historial de pedidos.

- Búsqueda y Filtrado: Herramientas para encontrar productos fácilmente según diferentes criterios.

## Tecnologías Clave

- Frontend: Astro, React, HTML, CSS, JavaScript (ES6+)

- Backend: Java, Spring Boot, Gradle

- Base de Datos: MongoDB

- Comunicación: APIs RESTful (JSON)
