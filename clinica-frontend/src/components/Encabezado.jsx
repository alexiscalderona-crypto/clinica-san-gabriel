import React, { useContext } from 'react';
import ClinicaContext from '../context/ClinicaContext';
import './Encabezado.css';

export default function Encabezado() {
  // Lectura directa desde el Context API sin recibir por props
  const { recepcionista, fechaTrabajo } = useContext(ClinicaContext);

  const fechaActual = new Date().toLocaleDateString('es-PE', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  return (
    <header className="clinica-encabezado">
      <div className="encabezado-container">
        <div className="logo-marca">
          <div className="logo-cruz">+</div>
          <div>
            <h1 className="clinica-titulo">Clínica San Gabriel</h1>
            <p className="clinica-subtitulo">Sistema de Gestión Hospitalaria</p>
          </div>
        </div>

        <div className="encabezado-info">
          <div className="info-item">
            <span className="info-label">Fecha:</span>
            <span className="info-valor">{fechaActual}</span>
          </div>

          {recepcionista && (
            <div className="info-item">
              <span className="info-label">Recepcionista activa:</span>
              <span className="info-valor">{recepcionista}</span>
            </div>
          )}

          {fechaTrabajo && (
            <div className="info-item">
              <span className="info-label">Fecha de trabajo:</span>
              <span className="info-valor">{fechaTrabajo}</span>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
