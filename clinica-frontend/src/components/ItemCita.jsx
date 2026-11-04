import React from 'react';
import Boton from './Boton';
import './ItemCita.css';

export default function ItemCita({ cita, onSeleccionar, esSeleccionada }) {
  // Clase de color según el estado
  const getEstadoClase = (estadoNombre) => {
    switch (estadoNombre?.toLowerCase()) {
      case 'pendiente':
        return 'estado-tag-pendiente';
      case 'confirmada':
        return 'estado-tag-confirmada';
      case 'atendida':
        return 'estado-tag-atendida';
      case 'cancelada':
        return 'estado-tag-cancelada';
      default:
        return 'estado-tag-default';
    }
  };

  return (
    <div className={`item-cita-card ${esSeleccionada ? 'seleccionada' : ''}`}>
      <div className="item-cita-header">
        <span className="item-cita-id">Cita #{cita.id}</span>
        <span className={`estado-tag ${getEstadoClase(cita.estado_nombre)}`}>
          {cita.estado_nombre}
        </span>
      </div>

      <div className="item-cita-info">
        <p className="item-paciente">
          <strong>Paciente:</strong> {cita.paciente_nombre}
        </p>
        <p className="item-medico">
          <strong>Médico:</strong> {cita.medico_nombre}
        </p>
        <p className="item-horario">
          <strong>Horario:</strong> {cita.fecha} a las {cita.hora?.substring(0, 5)}
        </p>
      </div>

      <div className="item-cita-acciones">
        <Boton
          texto={esSeleccionada ? 'Viendo detalle' : 'Ver detalle'}
          variante={esSeleccionada ? 'primario' : 'secundario'}
          onClick={() => onSeleccionar(cita.id)}
        />
      </div>
    </div>
  );
}
