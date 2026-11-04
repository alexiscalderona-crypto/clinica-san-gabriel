# 🏥 Sistema de Gestión de Citas Médicas - Clínica San Gabriel

Sistema web full-stack desarrollado para la **Clínica San Gabriel**, compuesto por una API REST construida en **Django REST Framework** y un frontend interactivo en **React (Vite)**.

---

## 🛠️ Tecnologías Utilizadas

* **Backend:**
  * Python 3.14
  * Django 6.1
  * Django REST Framework (DRF)
  * django-cors-headers
  * SQLite3
* **Frontend:**
  * React 19
  * Vite
  * Context API
  * CSS3 modular

---

## 🚀 Instrucciones de Instalación y Ejecución

### 1. Backend (Django REST Framework)

```powershell
# 1. Ingresar a la carpeta del backend
cd clinica

# 2. Aplicar migraciones
python manage.py migrate

# 3. Cargar datos iniciales (Especialidades, Médicos, Pacientes, Citas y Superusuario)
python seed.py

# 4. Iniciar el servidor backend
python manage.py runserver
```

* **API REST:** `http://127.0.0.1:8000/api/`
* **Panel de Administración:** `http://127.0.0.1:8000/admin/`
  * **Usuario:** `admin`
  * **Contraseña:** `admin123`

---

### 2. Frontend (React + Vite)

En una nueva terminal:

```powershell
# 1. Ingresar a la carpeta del frontend
cd clinica-frontend

# 2. Instalar dependencias
npm install

# 3. Iniciar el servidor de desarrollo
npm run dev
```

* **Aplicación Web:** `http://localhost:5173/`

---

## 📋 Características Principales

1. **Gestión de Especialidades:** Catálogo dinámico consumido desde DRF con renderizado condicional de carga y error.
2. **Directorio Médico:** Filtrado dinámico por especialidad médica (`/api/medicos/?especialidad=<id>`) con contador interactivo y componentes reutilizables (`TarjetaMedico`, `Boton`).
3. **Registro y Búsqueda de Pacientes:** Formulario controlado con validaciones en el cliente (DNI de 8 dígitos, formato de correo, campos requeridos), búsqueda en tiempo real y eliminación con confirmación.
4. **Reserva de Citas y Control de Agenda:**
   * Comunicación de datos mediante Props, Callbacks y Context API (`ClinicaContext`).
   * Elevación de estado entre componentes hermanos (`ListaCitas` y `DetalleCita`).
   * Validación estricta en backend (HTTP 400) que rechaza fechas pasadas y horarios duplicados para un mismo médico.
   * Gestión de estados de cita (pendiente, confirmada, atendida, cancelada) con deshabilitación automática en estados finales.
