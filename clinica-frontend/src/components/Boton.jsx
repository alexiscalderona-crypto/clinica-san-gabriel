import React from 'react';
import './Boton.css';

/**
 * Componente reutilizable Boton con desestructuración de props
 * Props: texto, variante ('primario', 'peligro', 'secundario', 'exito'), onClick, disabled, children
 */
export default function Boton({ texto, variante = 'primario', onClick, disabled = false, children, type = 'button' }) {
  return (
    <button
      type={type}
      className={`btn btn-${variante}`}
      onClick={onClick}
      disabled={disabled}
    >
      {children || texto}
    </button>
  );
}
