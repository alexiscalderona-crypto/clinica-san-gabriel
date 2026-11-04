import React from 'react';
import Boton from './Boton';
import './BuscadorPacientes.css';

export default function BuscadorPacientes({
  terminoBusqueda,
  onCambiarTermino,
  onLimpiar,
}) {
  return (
    <div className="buscador-pacientes-container">
      <div className="buscador-input-wrapper">
        <input
          type="text"
          className="buscador-input"
          placeholder="Buscar paciente por nombre o DNI..."
          value={terminoBusqueda}
          onChange={(e) => onCambiarTermino(e.target.value)}
        />
      </div>

      {terminoBusqueda && (
        <Boton
          texto="Limpiar"
          variante="secundario"
          onClick={onLimpiar}
        />
      )}
    </div>
  );
}
