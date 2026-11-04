import React from 'react';
import './PiePagina.css';

export default function PiePagina() {
  const anio = new Date().getFullYear();

  return (
    <footer className="clinica-pie">
      <div className="pie-container">
        <p className="pie-texto">
          © {anio} <strong>Clínica San Gabriel</strong> - Sistema de Gestión de Citas Médicas.
        </p>
        <p className="pie-subtexto">
          Desarrollo de Aplicaciones Empresariales | Django REST Framework + ReactJS
        </p>
      </div>
    </footer>
  );
}
