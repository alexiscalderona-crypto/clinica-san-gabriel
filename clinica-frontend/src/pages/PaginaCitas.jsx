import React, { useState, useEffect } from 'react';
import FormularioCita from '../components/FormularioCita';
import ListaCitas from '../components/ListaCitas';
import DetalleCita from '../components/DetalleCita';
import ResumenCitas from '../components/ResumenCitas';
import {
  getCitas,
  getMedicos,
  getPacientes,
  getEstados,
} from '../services/api';
import './PaginaCitas.css';

export default function PaginaCitas() {
  // Estado centralizado en el componente padre:
  const [citas, setCitas] = useState([]);
  const [medicos, setMedicos] = useState([]);
  const [pacientes, setPacientes] = useState([]);
  const [estados, setEstados] = useState([]);
  const [citaSeleccionadaId, setCitaSeleccionadaId] = useState(null);
  const [cargando, setCargando] = useState(true);

  // Carga inicial de datos desde la API
  useEffect(() => {
    async function cargarDatos() {
      try {
        setCargando(true);
        const [citasData, medicosData, pacientesData, estadosData] = await Promise.all([
          getCitas(),
          getMedicos(),
          getPacientes(),
          getEstados(),
        ]);
        setCitas(citasData);
        setMedicos(medicosData);
        setPacientes(pacientesData);
        setEstados(estadosData);

        // Seleccionar la primera cita por defecto si existe
        if (citasData && citasData.length > 0) {
          setCitaSeleccionadaId(citasData[0].id);
        }
      } catch (err) {
        console.error('Error al cargar datos de citas:', err);
      } finally {
        setCargando(false);
      }
    }

    cargarDatos();
  }, []);

  // Callback Hijo a Padre: FormularioCita notifica al registrar una nueva cita
  const handleCitaCreada = (nuevaCita) => {
    // Se agrega al estado sin recargar la página
    setCitas((prev) => [nuevaCita, ...prev]);
    // Seleccionar automáticamente la cita recién creada
    setCitaSeleccionadaId(nuevaCita.id);
  };

  // Callback de Elevación de Estado entre Hermanos: DetalleCita notifica cambio de estado
  const handleCambiarEstado = (citaActualizada) => {
    setCitas((prev) =>
      prev.map((c) => (c.id === citaActualizada.id ? citaActualizada : c))
    );
  };

  // Obtener el objeto de la cita seleccionada para el componente hermano DetalleCita
  const citaSeleccionada = citas.find((c) => c.id === citaSeleccionadaId) || null;

  return (
    <div className="pagina-citas">
      <div className="citas-cabecera">
        <h2>Recepción y Reserva de Citas</h2>
        <p>Control de citas médicas, estado de atención y agenda de consultorios</p>
      </div>

      {/* 1. Resumen de Citas por Estado (Calculado a partir de sus props) */}
      <ResumenCitas citas={citas} />

      {/* 2. Formulario de Cita (Props hacia abajo y Callback onCitaCreada hacia arriba) */}
      <FormularioCita
        pacientes={pacientes}
        medicos={medicos}
        estados={estados}
        onCitaCreada={handleCitaCreada}
      />

      {/* 3. Panel Dividido: Lista de Citas (Hermano 1) y Detalle de Cita (Hermano 2) */}
      <div className="grid-citas-gestion">
        <div className="columna-lista">
          <ListaCitas
            citas={citas}
            onSeleccionar={setCitaSeleccionadaId}
            citaSeleccionadaId={citaSeleccionadaId}
          />
        </div>

        <div className="columna-detalle">
          <DetalleCita
            cita={citaSeleccionada}
            estados={estados}
            onCambiarEstado={handleCambiarEstado}
          />
        </div>
      </div>
    </div>
  );
}
