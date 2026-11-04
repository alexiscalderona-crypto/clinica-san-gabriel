import React, { useState, useEffect } from 'react';
import TarjetaMedico from '../components/TarjetaMedico';
import FiltroEspecialidad from '../components/FiltroEspecialidad';
import FormularioPaciente from '../components/FormularioPaciente';
import BuscadorPacientes from '../components/BuscadorPacientes';
import TablaPacientes from '../components/TablaPacientes';
import {
  getEspecialidades,
  getMedicos,
  getPacientes,
  eliminarPaciente,
} from '../services/api';
import './PaginaPacientesMedicos.css';

export default function PaginaPacientesMedicos() {
  const [especialidades, setEspecialidades] = useState([]);
  const [medicos, setMedicos] = useState([]);
  const [especialidadSeleccionada, setEspecialidadSeleccionada] = useState('');
  const [cargandoMedicos, setCargandoMedicos] = useState(false);

  const [pacientes, setPacientes] = useState([]);
  const [terminoBusqueda, setTerminoBusqueda] = useState('');
  const [alertaTabla, setAlertaTabla] = useState('');

  useEffect(() => {
    async function inicializar() {
      try {
        const [espData, pacData] = await Promise.all([
          getEspecialidades(),
          getPacientes(),
        ]);
        setEspecialidades(espData);
        setPacientes(pacData);
      } catch (err) {
        console.error('Error al cargar datos iniciales:', err);
      }
    }
    inicializar();
  }, []);

  useEffect(() => {
    async function cargarMedicos() {
      try {
        setCargandoMedicos(true);
        const data = await getMedicos(especialidadSeleccionada || null);
        setMedicos(data);
      } catch (err) {
        console.error('Error al cargar médicos:', err);
      } finally {
        setCargandoMedicos(false);
      }
    }
    cargarMedicos();
  }, [especialidadSeleccionada]);

  const handlePacienteCreado = (nuevoPaciente) => {
    setPacientes((prev) => [nuevoPaciente, ...prev]);
    setAlertaTabla(`Paciente "${nuevoPaciente.nombres}" registrado con éxito.`);
    setTimeout(() => setAlertaTabla(''), 4000);
  };

  const handleEliminarPaciente = async (id) => {
    try {
      await eliminarPaciente(id);
      setPacientes((prev) => prev.filter((p) => p.id !== id));
      setAlertaTabla('Paciente eliminado del sistema.');
      setTimeout(() => setAlertaTabla(''), 3000);
    } catch (err) {
      alert(err.message || 'Error al eliminar el paciente');
    }
  };

  const pacientesFiltrados = pacientes.filter((p) => {
    const busqueda = terminoBusqueda.toLowerCase().trim();
    if (!busqueda) return true;
    return (
      p.nombres.toLowerCase().includes(busqueda) ||
      p.dni.toLowerCase().includes(busqueda)
    );
  });

  return (
    <div className="pagina-pacientes-medicos">
      {/* SECCIÓN 1: DIRECTÓRIO DE MÉDICOS */}
      <section className="bloque-seccion">
        <div className="seccion-titulo-container">
          <h2>Directorio de Médicos</h2>
          <p>Personal médico de la clínica por área y especialidad</p>
        </div>

        <FiltroEspecialidad
          especialidades={especialidades}
          especialidadSeleccionada={especialidadSeleccionada}
          onCambiarEspecialidad={setEspecialidadSeleccionada}
          totalMedicos={medicos.length}
        />

        {cargandoMedicos ? (
          <div className="alerta alerta-info">Cargando médicos...</div>
        ) : (
          <div className="grid-medicos">
            {medicos.map((m) => (
              <TarjetaMedico
                key={m.id}
                nombres={m.nombres}
                cmp={m.cmp}
                especialidad={m.especialidad_nombre || 'Medicina General'}
                foto={m.foto}
              />
            ))}
          </div>
        )}
      </section>

      <hr className="separador-seccion" />

      {/* SECCIÓN 2: FORMULARIO DE PACIENTE */}
      <section className="bloque-seccion">
        <FormularioPaciente onPacienteCreado={handlePacienteCreado} />
      </section>

      {/* SECCIÓN 3: TABLA DE PACIENTES */}
      <section className="bloque-seccion">
        <div className="seccion-titulo-container">
          <h2>Listado de Pacientes</h2>
          <p>Registro de pacientes y búsqueda rápida</p>
        </div>

        {alertaTabla && (
          <div className="alerta alerta-exito">{alertaTabla}</div>
        )}

        <BuscadorPacientes
          terminoBusqueda={terminoBusqueda}
          onCambiarTermino={setTerminoBusqueda}
          onLimpiar={() => setTerminoBusqueda('')}
        />

        <TablaPacientes
          pacientes={pacientesFiltrados}
          onEliminar={handleEliminarPaciente}
        />
      </section>
    </div>
  );
}
