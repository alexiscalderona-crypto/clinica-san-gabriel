import React, { useState } from 'react';
import Boton from './Boton';
import { actualizarEstadoCita } from '../services/api';
import './DetalleCita.css';

export default function DetalleCita({ cita, estados, onCambiarEstado }) {
  const [actualizando, setActualizando] = useState(false);
  const [mensaje, setMensaje] = useState('');

  if (!cita) {
    return (
      <div className="detalle-cita-placeholder">
        <h3>Detalle de Cita Médica</h3>
        <p>Seleccione una cita de la lista izquierda para consultar su información detallada y gestionar su estado.</p>
      </div>
    );
  }

  // Determinar si la cita está en un estado final (atendida o cancelada)
  const estadoActual = estados?.find(
    (e) => e.id === cita.estado || e.nombre?.toLowerCase() === cita.estado_nombre?.toLowerCase()
  );
  const esFinal = estadoActual ? estadoActual.es_final : (
    cita.estado_nombre?.toLowerCase() === 'atendida' || cita.estado_nombre?.toLowerCase() === 'cancelada'
  );

  // Manejar el cambio de estado con PATCH a la API
  const handleCambiarEstado = async (nombreNuevoEstado) => {
    const estadoDestino = estados?.find(
      (e) => e.nombre?.toLowerCase() === nombreNuevoEstado.toLowerCase()
    );

    if (!estadoDestino) {
      alert(`Estado "${nombreNuevoEstado}" no encontrado.`);
      return;
    }

    setActualizando(true);
    setMensaje('');
    try {
      // Envío de PATCH a /api/citas/<id>/
      const citaActualizada = await actualizarEstadoCita(cita.id, estadoDestino.id);
      setMensaje(`Estado actualizado a "${nombreNuevoEstado}" exitosamente.`);
      // Notificar al componente padre (PaginaCitas)
      if (onCambiarEstado) {
        onCambiarEstado(citaActualizada);
      }
    } catch (err) {
      alert('Error al actualizar el estado de la cita.');
    } finally {
      setActualizando(false);
    }
  };

  return (
    <div className="detalle-cita-card">
      <div className="detalle-header">
        <h3>Detalle de la Cita #{cita.id}</h3>
        <span className={`badge-estado estado-${cita.estado_nombre?.toLowerCase()}`}>
          {cita.estado_nombre}
        </span>
      </div>

      {mensaje && (
        <div className="alerta alerta-exito">{mensaje}</div>
      )}

      {esFinal && (
        <div className="alerta alerta-info">
          Esta cita se encuentra en un <strong>estado final</strong>. No admite modificaciones adicionales.
        </div>
      )}

      <div className="detalle-cuerpo">
        <div className="detalle-fila">
          <span className="detalle-etiqueta">Paciente:</span>
          <span className="detalle-valor">{cita.paciente_nombre}</span>
        </div>

        <div className="detalle-fila">
          <span className="detalle-etiqueta">Médico tratante:</span>
          <span className="detalle-valor">{cita.medico_nombre}</span>
        </div>

        <div className="detalle-fila">
          <span className="detalle-etiqueta">Especialidad:</span>
          <span className="detalle-valor">{cita.especialidad}</span>
        </div>

        <div className="detalle-fila">
          <span className="detalle-etiqueta">Fecha programada:</span>
          <span className="detalle-valor">{cita.fecha}</span>
        </div>

        <div className="detalle-fila">
          <span className="detalle-etiqueta">Hora de atención:</span>
          <span className="detalle-valor">{cita.hora}</span>
        </div>

        <div className="detalle-fila vertical">
          <span className="detalle-etiqueta">Motivo de consulta:</span>
          <p className="detalle-motivo">{cita.motivo}</p>
        </div>
      </div>

      <div className="detalle-acciones">
        <h4>Acciones de Gestión de Estado:</h4>
        <div className="botones-acciones-estado">
          <Boton
            texto="Confirmar"
            variante="primario"
            disabled={esFinal || actualizando || cita.estado_nombre?.toLowerCase() === 'confirmada'}
            onClick={() => handleCambiarEstado('confirmada')}
          />
          <Boton
            texto="Marcar como atendida"
            variante="exito"
            disabled={esFinal || actualizando}
            onClick={() => handleCambiarEstado('atendida')}
          />
          <Boton
            texto="Cancelar"
            variante="peligro"
            disabled={esFinal || actualizando}
            onClick={() => handleCambiarEstado('cancelada')}
          />
        </div>
      </div>
    </div>
  );
}
