# clinica-san-gabriel

Proyecto desarrollado para el curso de Desarrollo de Aplicaciones Empresariales (Evaluacion 03).
Sistema web para la gestion de citas medicas de la Clinica San Gabriel desarrollado con Django REST Framework y React con Vite.

## Requisitos

- Python 3.10 o superior
- Node.js 18 o superior

## Ejecucion del proyecto

### 1. Backend (Django)

```bash
cd clinica
python manage.py migrate
python seed.py
python manage.py runserver
```

El backend estara disponible en http://127.0.0.1:8000/

Usuario administrador:
- Usuario: admin
- Clave: admin123

### 2. Frontend (React)

En otra terminal:

```bash
cd clinica-frontend
npm install
npm run dev
```

La aplicacion estara disponible en http://localhost:5173/

## Integrantes
- Alexis Calderon
