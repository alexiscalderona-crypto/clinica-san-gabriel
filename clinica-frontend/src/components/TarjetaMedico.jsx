import React from 'react';
import './TarjetaMedico.css';

/**
 * Componente reutilizable TarjetaMedico con desestructuración de props
 * Imagen por defecto usando fallback si 'foto' no se envía
 */
export default function TarjetaMedico({
  nombres,
  cmp,
  especialidad,
  foto = 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=300&auto=format&fit=crop&q=80',
}) {
  const imagenFinal = foto && foto.trim() !== ''
    ? foto
    : 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=300&auto=format&fit=crop&q=80';

  return (
    <div className="tarjeta-medico">
      <div className="tarjeta-medico-imagen-container">
        <img
          src={imagenFinal}
          alt={`Dr(a). ${nombres}`}
          className="tarjeta-medico-imagen"
          onError={(e) => {
            e.target.onerror = null;
            e.target.src = 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=300&auto=format&fit=crop&q=80';
          }}
        />
        <span className="tarjeta-medico-badge">{especialidad}</span>
      </div>

      <div className="tarjeta-medico-cuerpo">
        <h4 className="tarjeta-medico-nombre">Dr(a). {nombres}</h4>
        <p className="tarjeta-medico-cmp">
          <strong>CMP:</strong> {cmp}
        </p>
      </div>
    </div>
  );
}
