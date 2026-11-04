import React from 'react';
import ItemCita from './ItemCita';
import './ListaCitas.css';

export default function ListaCitas({ citas, onSeleccionar, citaSeleccionadaId }) {
  if (!citas || citas.length === 0) {
    return (
      <div className="lista-citas-vacia">
        <p>No hay citas registradas para mostrar.</p>
      </div>
    );
  }

  return (
    <div className="lista-citas-container">
      <h3 className="titulo-seccion-citas">
        Citas Programadas ({citas.length})
      </h3>
      <div className="lista-citas-scroll">
        {citas.map((cita) => (
          <ItemCita
            key={cita.id}
            cita={cita}
            onSeleccionar={onSeleccionar}
            esSeleccionada={citaSeleccionadaId === cita.id}
          />
        ))}
      </div>
    </div>
  );
}
