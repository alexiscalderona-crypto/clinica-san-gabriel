import React from 'react';
import Boton from './Boton';
import './TablaPacientes.css';

export default function TablaPacientes({ pacientes, onEliminar }) {
  const handleEliminarClick = (paciente) => {
    const confirmacion = window.confirm(
      `¿Está seguro de que desea eliminar al paciente ${paciente.nombres} con DNI ${paciente.dni}?`
    );
    if (confirmacion) {
      onEliminar(paciente.id);
    }
  };

  if (!pacientes || pacientes.length === 0) {
    return (
      <div className="tabla-vacia">
        <p>No se encontraron pacientes registrados.</p>
      </div>
    );
  }

  return (
    <div className="tabla-responsive">
      <table className="tabla-pacientes">
        <thead>
          <tr>
            <th>ID</th>
            <th>DNI</th>
            <th>Nombres y Apellidos</th>
            <th>F. Nacimiento</th>
            <th>Teléfono</th>
            <th>Correo Electrónico</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {pacientes.map((pac) => (
            <tr key={pac.id}>
              <td><strong>#{pac.id}</strong></td>
              <td><span className="badge-dni">{pac.dni}</span></td>
              <td className="nombre-paciente">{pac.nombres}</td>
              <td>{pac.fecha_nacimiento}</td>
              <td>{pac.telefono}</td>
              <td>{pac.correo}</td>
              <td>
                <Boton
                  texto="Eliminar"
                  variante="peligro"
                  onClick={() => handleEliminarClick(pac)}
                />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
