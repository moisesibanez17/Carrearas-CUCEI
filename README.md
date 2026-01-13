# CUCEI Carreras

Plataforma interactiva para la exploración y difusión de programas educativos del **Centro Universitario de Ciencias Exactas e Ingenierías (CUCEI)** de la Universidad de Guadalajara.

## 🚀 Características

- **Catálogo Completo**: Información detallada de 20+ licenciaturas divididas por divisiones (Ciencias Básicas, Ingenierías y Tecnologías).
- **Búsqueda Dinámica**: Buscador en tiempo real por nombre de carrera, coordinador o áreas de interés.
- **Ubicación Integrada**: Mapa 3D de CUCEI con opción de descarga en PDF de alta calidad.
- **Comunidad**: Enlaces directos a canales de WhatsApp oficiales y grupos de generación.
- **Diseño Moderno**: Interfaz responsiva con estética premium basada en los colores institucionales (Negro y Oro).

## 🛠️ Tecnologías Utilizadas

- **Frontend**: HTML5, CSS3 (Vanilla), JavaScript (ES6+).
- **Framework de Estilo**: [Bootstrap 5.3](https://getbootstrap.com/).
- **Iconos**: [Bootstrap Icons](https://icons.getbootstrap.com/).
- **Tipografía**: Google Fonts (Poppins & Inter).

## 📁 Estructura del Proyecto

```
/
├── index.html          # Página principal con buscador y grid de carreras
├── script.js           # Lógica de búsqueda y filtrado dinámico
├── styles.css          # Estilos globales y personalizaciones
├── careers_data.csv    # Fuente de datos para las tarjetas de carreras
├── carreras/           # Directorio con las páginas individuales de cada licenciatura
│   ├── licenciaturas.html
│   └── [nombre_carrera].html
├── images/             # Activos visuales, logos y mapas
└── brain/              # (Interno) Documentación del proceso de desarrollo
```

## 📦 Instalación y Uso

1. Tenga en cuenta que el proyecto utiliza un archivo CSV local para los datos. Se recomienda servir los archivos mediante un servidor web local para evitar restricciones de CORS.
2. Si utiliza Python:
   ```bash
   python -m http.server 8000
   ```
3. Abra `http://localhost:8000` en su navegador.

## 📄 Licencia

Este proyecto está bajo la Licencia MIT. Consulte el archivo [LICENSE](LICENSE) para más detalles.

---
*Desarrollado para la comunidad de CUCEI - Universidad de Guadalajara.*
