import React, { useState, useEffect } from 'react';
import { ClinicaProvider } from './context/ClinicaContext';
import Encabezado from './components/Encabezado';
import PiePagina from './components/PiePagina';
import PaginaPacientesMedicos from './pages/PaginaPacientesMedicos';
import PaginaCitas from './pages/PaginaCitas';
import { getEspecialidades } from './services/api';
import './App.css';

function ContenidoPrincipal() {
  const [pestanaActiva, setPestanaActiva] = useState('citas'); // 'citas' | 'pacientes_medicos' | 'especialidades'

  const [especialidades, setEspecialidades] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function cargarDatos() {
      try {
        setCargando(true);
        setError(null);
        const data = await getEspecialidades();
        setEspecialidades(data);
      } catch (err) {
        setError(err.message || 'Error al conectar con el servidor.');
      } finally {
        setCargando(false);
      }
    }
    cargarDatos();
  }, []);

  return (
    <div className="app-layout">
      {/* Encabezado: consume ClinicaContext */}
      <Encabezado />

      {/* Menú de navegación */}
      <nav className="barra-navegacion">
        <div className="nav-container">
          <button
            type="button"
            className={`nav-btn ${pestanaActiva === 'citas' ? 'activo' : ''}`}
            onClick={() => setPestanaActiva('citas')}
          >
            Gestión de Citas
          </button>
          <button
            type="button"
            className={`nav-btn ${pestanaActiva === 'pacientes_medicos' ? 'activo' : ''}`}
            onClick={() => setPestanaActiva('pacientes_medicos')}
          >
            Médicos y Pacientes
          </button>
          <button
            type="button"
            className={`nav-btn ${pestanaActiva === 'especialidades' ? 'activo' : ''}`}
            onClick={() => setPestanaActiva('especialidades')}
          >
            Especialidades
          </button>
        </div>
      </nav>

      <main className="app-contenido">
        {/* VISTA 1: GESTIÓN DE CITAS (PREGUNTA 4) */}
        {pestanaActiva === 'citas' && (
          <PaginaCitas />
        )}

        {/* VISTA 2: MÉDICOS Y PACIENTES (PREGUNTA 3) */}
        {pestanaActiva === 'pacientes_medicos' && (
          <PaginaPacientesMedicos />
        )}

        {/* VISTA 3: ESPECIALIDADES (PREGUNTA 2) */}
        {pestanaActiva === 'especialidades' && (
          <section className="seccion-especialidades">
            <div className="seccion-cabecera">
              <h2>Especialidades Médicas</h2>
              <p>Áreas de atención y especialidades disponibles en la clínica</p>
            </div>

            {cargando && (
              <div className="alerta alerta-info">
                Cargando especialidades...
              </div>
            )}

            {error && (
              <div className="alerta alerta-error">
                <span>Error: {error}</span>
                <p>Compruebe que el servidor Django esté activo.</p>
              </div>
            )}

            {!cargando && !error && (
              <div className="grid-especialidades">
                {especialidades.map((esp) => (
                  <div key={esp.id} className="tarjeta-especialidad">
                    <h3 className="especialidad-nombre">{esp.nombre}</h3>
                    <p className="especialidad-descripcion">
                      {esp.descripcion || 'Sin descripción disponible.'}
                    </p>
                    <span className="especialidad-badge">Código: #{esp.id}</span>
                  </div>
                ))}
              </div>
            )}
          </section>
        )}
      </main>

      {/* Pie de Página */}
      <PiePagina />
    </div>
  );
}

export default function App() {
  return (
    <ClinicaProvider>
      <ContenidoPrincipal />
    </ClinicaProvider>
  );
}
