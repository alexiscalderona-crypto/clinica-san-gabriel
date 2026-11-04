import React, { useState, useContext, useEffect } from 'react';
import Boton from './Boton';
import ClinicaContext from '../context/ClinicaContext';
import { crearCita } from '../services/api';
import './FormularioCita.css';

export default function FormularioCita({ pacientes, medicos, estados, onCitaCreada }) {
  // Lectura directa desde Context API (sin recibirlo por props)
  const { fechaTrabajo } = useContext(ClinicaContext);

  const [pacienteId, setPacienteId] = useState('');
  const [medicoId, setMedicoId] = useState('');
  const [fecha, setFecha] = useState(fechaTrabajo || '');
  const [hora, setHora] = useState('');
  const [motivo, setMotivo] = useState('');
  const [estadoId, setEstadoId] = useState('');

  // Mensajes de feedback
  const [errorBackend, setErrorBackend] = useState('');
  const [mensajeExito, setMensajeExito] = useState('');
  const [guardando, setGuardando] = useState(false);

  // Sincronizar fecha inicial con la fecha de trabajo del contexto
  useEffect(() => {
    if (fechaTrabajo && !fecha) {
      setFecha(fechaTrabajo);
    }
  }, [fechaTrabajo]);

  // Asignar estado "pendiente" por defecto cuando carguen los estados
  useEffect(() => {
    if (estados && estados.length > 0 && !estadoId) {
      const pendiente = estados.find((e) => e.nombre?.toLowerCase() === 'pendiente');
      if (pendiente) setEstadoId(pendiente.id);
    }
  }, [estados, estadoId]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorBackend('');
    setMensajeExito('');

    // Validación básica de campos requeridos
    if (!pacienteId || !medicoId || !fecha || !hora || !motivo.trim()) {
      setErrorBackend('Todos los campos son obligatorios para reservar la cita.');
      return;
    }

    setGuardando(true);
    try {
      const payload = {
        paciente: parseInt(pacienteId),
        medico: parseInt(medicoId),
        fecha: fecha,
        hora: hora.length === 5 ? `${hora}:00` : hora,
        motivo: motivo.trim(),
        estado: parseInt(estadoId || estados[0]?.id),
      };

      // Envío de POST /api/citas/
      const nuevaCita = await crearCita(payload);

      setMensajeExito(`Cita médica registrada con éxito (Cita #${nuevaCita.id}).`);
      // Limpiar campos
      setMotivo('');
      setHora('');

      // Invocar callback hacia el padre (Hijo a Padre)
      if (onCitaCreada) {
        onCitaCreada(nuevaCita);
      }
    } catch (err) {
      // Manejo de respuesta 400 del backend con mensaje claro devuelto
      if (typeof err === 'object' && err !== null) {
        if (err.hora) {
          setErrorBackend(Array.isArray(err.hora) ? err.hora.join(' ') : err.hora);
        } else if (err.fecha) {
          setErrorBackend(Array.isArray(err.fecha) ? err.fecha.join(' ') : err.fecha);
        } else if (err.non_field_errors) {
          setErrorBackend(Array.isArray(err.non_field_errors) ? err.non_field_errors.join(' ') : err.non_field_errors);
        } else {
          setErrorBackend('Error de validación al registrar la cita.');
        }
      } else {
        setErrorBackend('No se pudo conectar con el servidor.');
      }
    } finally {
      setGuardando(false);
    }
  };

  return (
    <div className="card-formulario-cita">
      <h3 className="titulo-form-cita">Nueva Reserva de Cita Médica</h3>

      {mensajeExito && (
        <div className="alerta alerta-exito">{mensajeExito}</div>
      )}

      {errorBackend && (
        <div className="alerta alerta-error">
          <strong>Aviso:</strong> {errorBackend}
        </div>
      )}

      <form onSubmit={handleSubmit}>
        <div className="fila-dos-columnas">
          <div className="grupo-input">
            <label htmlFor="select-paciente">Paciente: *</label>
            <select
              id="select-paciente"
              value={pacienteId}
              onChange={(e) => setPacienteId(e.target.value)}
            >
              <option value="">-- Seleccionar Paciente --</option>
              {pacientes?.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.nombres} (DNI: {p.dni})
                </option>
              ))}
            </select>
          </div>

          <div className="grupo-input">
            <label htmlFor="select-medico">Médico: *</label>
            <select
              id="select-medico"
              value={medicoId}
              onChange={(e) => setMedicoId(e.target.value)}
            >
              <option value="">-- Seleccionar Médico --</option>
              {medicos?.map((m) => (
                <option key={m.id} value={m.id}>
                  Dr(a). {m.nombres} - {m.especialidad_nombre || 'General'}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="fila-dos-columnas">
          <div className="grupo-input">
            <label htmlFor="input-fecha">Fecha: *</label>
            <input
              type="date"
              id="input-fecha"
              value={fecha}
              onChange={(e) => setFecha(e.target.value)}
            />
          </div>

          <div className="grupo-input">
            <label htmlFor="input-hora">Hora: *</label>
            <input
              type="time"
              id="input-hora"
              value={hora}
              onChange={(e) => setHora(e.target.value)}
            />
          </div>
        </div>

        <div className="grupo-input">
          <label htmlFor="input-motivo">Motivo de Consulta: *</label>
          <textarea
            id="input-motivo"
            rows="3"
            value={motivo}
            onChange={(e) => setMotivo(e.target.value)}
            placeholder="Describa el motivo o síntoma principal del paciente..."
          ></textarea>
        </div>

        <div className="acciones-form-cita">
          <Boton
            type="submit"
            variante="primario"
            disabled={guardando}
          >
            {guardando ? 'Verificando...' : 'Reservar Cita Médica'}
          </Boton>
        </div>
      </form>
    </div>
  );
}
