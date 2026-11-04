import React, { createContext, useContext, useState } from 'react';

// Creación del contexto de la clínica
const ClinicaContext = createContext();

export function ClinicaProvider({ children }) {
  // Datos globales compartidos por el contexto solicitados en el examen:
  // Recepcionista activa y Fecha de trabajo seleccionada
  const [recepcionista, setRecepcionista] = useState('Lic. María Elena López');
  const [fechaTrabajo, setFechaTrabajo] = useState(() => {
    const hoy = new Date();
    return hoy.toISOString().split('T')[0]; // Formato aaaa-mm-dd
  });

  return (
    <ClinicaContext.Provider
      value={{
        recepcionista,
        setRecepcionista,
        fechaTrabajo,
        setFechaTrabajo,
      }}
    >
      {children}
    </ClinicaContext.Provider>
  );
}

// Hook personalizado para consumir el contexto fácilmente
export function useClinica() {
  const context = useContext(ClinicaContext);
  if (!context) {
    throw new Error('useClinica debe ser utilizado dentro de un ClinicaProvider');
  }
  return context;
}

export default ClinicaContext;
