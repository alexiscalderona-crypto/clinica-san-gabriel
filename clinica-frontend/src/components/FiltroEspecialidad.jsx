import React from 'react';
import './FiltroEspecialidad.css';

export default function FiltroEspecialidad({
  especialidades,
  especialidadSeleccionada,
  onCambiarEspecialidad,
  totalMedicos,
}) {
  return (
    <div className="filtro-especialidad-container">
      <div className="filtro-control">
        <label htmlFor="filtro-select" className="filtro-label">
          Filtrar por especialidad:
        </label>
        <select
          id="filtro-select"
          className="filtro-select"
          value={especialidadSeleccionada}
          onChange={(e) => onCambiarEspecialidad(e.target.value)}
        >
          <option value="">Todas las especialidades</option>
          {especialidades.map((esp) => (
            <option key={esp.id} value={esp.id}>
              {esp.nombre}
            </option>
          ))}
        </select>
      </div>

      <div className="contador-medicos">
        <span className="contador-badge">
          Médicos encontrados: <strong>{totalMedicos}</strong>
        </span>
      </div>
    </div>
  );
}
