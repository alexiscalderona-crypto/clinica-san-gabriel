import React from 'react';
import './ResumenCitas.css';

/**
 * Componente ResumenCitas
 * Props: citas (arreglo de citas)
 * Calcula en tiempo real el total de citas por estado a partir de sus props
 */
export default function ResumenCitas({ citas = [] }) {
  // Cálculo de totales derivados de las props
  const total = citas.length;
  const pendientes = citas.filter((c) => c.estado_nombre?.toLowerCase() === 'pendiente').length;
  const confirmadas = citas.filter((c) => c.estado_nombre?.toLowerCase() === 'confirmada').length;
  const atendidas = citas.filter((c) => c.estado_nombre?.toLowerCase() === 'atendida').length;
  const canceladas = citas.filter((c) => c.estado_nombre?.toLowerCase() === 'cancelada').length;

  return (
    <div className="resumen-citas-card">
      <div className="resumen-item total">
        <span className="resumen-numero">{total}</span>
        <span className="resumen-label">Total Citas</span>
      </div>

      <div className="resumen-item pendiente">
        <span className="resumen-numero">{pendientes}</span>
        <span className="resumen-label">Pendientes</span>
      </div>

      <div className="resumen-item confirmada">
        <span className="resumen-numero">{confirmadas}</span>
        <span className="resumen-label">Confirmadas</span>
      </div>

      <div className="resumen-item atendida">
        <span className="resumen-numero">{atendidas}</span>
        <span className="resumen-label">Atendidas</span>
      </div>

      <div className="resumen-item cancelada">
        <span className="resumen-numero">{canceladas}</span>
        <span className="resumen-label">Canceladas</span>
      </div>
    </div>
  );
}
