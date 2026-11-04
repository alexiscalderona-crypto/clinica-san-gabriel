import React, { useState } from 'react';
import Boton from './Boton';
import { crearPaciente } from '../services/api';
import './FormularioPaciente.css';

const estadoInicial = {
  dni: '',
  nombres: '',
  fecha_nacimiento: '',
  telefono: '',
  correo: '',
};

export default function FormularioPaciente({ onPacienteCreado }) {
  const [formData, setFormData] = useState(estadoInicial);
  const [errores, setErrores] = useState({});
  const [mensajeExito, setMensajeExito] = useState('');
  const [mensajeServidor, setMensajeServidor] = useState('');
  const [enviando, setEnviando] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    if (errores[name]) {
      setErrores((prev) => ({
        ...prev,
        [name]: '',
      }));
    }
  };

  const validarFormulario = () => {
    const nuevosErrores = {};

    if (!formData.dni.trim()) {
      nuevosErrores.dni = 'El DNI es obligatorio.';
    } else if (!/^\d{8}$/.test(formData.dni.trim())) {
      nuevosErrores.dni = 'El DNI debe tener exactamente 8 dígitos.';
    }

    if (!formData.nombres.trim()) {
      nuevosErrores.nombres = 'Los nombres y apellidos son obligatorios.';
    }

    if (!formData.fecha_nacimiento) {
      nuevosErrores.fecha_nacimiento = 'La fecha de nacimiento es obligatoria.';
    }

    if (!formData.telefono.trim()) {
      nuevosErrores.telefono = 'El teléfono es obligatorio.';
    }

    const regexEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!formData.correo.trim()) {
      nuevosErrores.correo = 'El correo electrónico es obligatorio.';
    } else if (!regexEmail.test(formData.correo.trim())) {
      nuevosErrores.correo = 'Formato de correo electrónico inválido.';
    }

    return nuevosErrores;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMensajeExito('');
    setMensajeServidor('');

    const erroresDetectados = validarFormulario();
    if (Object.keys(erroresDetectados).length > 0) {
      setErrores(erroresDetectados);
      return;
    }

    setEnviando(true);
    try {
      const pacienteRegistrado = await crearPaciente(formData);
      setMensajeExito(`Paciente ${pacienteRegistrado.nombres} registrado correctamente.`);
      setFormData(estadoInicial);
      setErrores({});
      if (onPacienteCreado) {
        onPacienteCreado(pacienteRegistrado);
      }
    } catch (err) {
      if (typeof err === 'object' && err !== null) {
        const erroresBackend = {};
        for (const [campo, msgs] of Object.entries(err)) {
          erroresBackend[campo] = Array.isArray(msgs) ? msgs.join(' ') : msgs;
        }
        setErrores(erroresBackend);
      } else {
        setMensajeServidor('Error al registrar el paciente.');
      }
    } finally {
      setEnviando(false);
    }
  };

  return (
    <div className="card-formulario-paciente">
      <h3 className="titulo-formulario">Registrar Nuevo Paciente</h3>

      {mensajeExito && (
        <div className="alerta alerta-exito" role="alert">
          {mensajeExito}
        </div>
      )}

      {mensajeServidor && (
        <div className="alerta alerta-error" role="alert">
          {mensajeServidor}
        </div>
      )}

      <form onSubmit={handleSubmit} noValidate>
        <div className="grupo-input">
          <label htmlFor="dni">DNI:</label>
          <input
            type="text"
            id="dni"
            name="dni"
            value={formData.dni}
            onChange={handleChange}
            placeholder="Ingrese 8 dígitos"
            maxLength="8"
            className={errores.dni ? 'input-error' : ''}
          />
          {errores.dni && <span className="texto-error">{errores.dni}</span>}
        </div>

        <div className="grupo-input">
          <label htmlFor="nombres">Nombres y Apellidos:</label>
          <input
            type="text"
            id="nombres"
            name="nombres"
            value={formData.nombres}
            onChange={handleChange}
            placeholder="Nombres completos"
            className={errores.nombres ? 'input-error' : ''}
          />
          {errores.nombres && <span className="texto-error">{errores.nombres}</span>}
        </div>

        <div className="fila-dos-columnas">
          <div className="grupo-input">
            <label htmlFor="fecha_nacimiento">Fecha de Nacimiento:</label>
            <input
              type="date"
              id="fecha_nacimiento"
              name="fecha_nacimiento"
              value={formData.fecha_nacimiento}
              onChange={handleChange}
              className={errores.fecha_nacimiento ? 'input-error' : ''}
            />
            {errores.fecha_nacimiento && (
              <span className="texto-error">{errores.fecha_nacimiento}</span>
            )}
          </div>

          <div className="grupo-input">
            <label htmlFor="telefono">Teléfono:</label>
            <input
              type="tel"
              id="telefono"
              name="telefono"
              value={formData.telefono}
              onChange={handleChange}
              placeholder="Número de contacto"
              className={errores.telefono ? 'input-error' : ''}
            />
            {errores.telefono && <span className="texto-error">{errores.telefono}</span>}
          </div>
        </div>

        <div className="grupo-input">
          <label htmlFor="correo">Correo Electrónico:</label>
          <input
            type="email"
            id="correo"
            name="correo"
            value={formData.correo}
            onChange={handleChange}
            placeholder="ejemplo@correo.com"
            className={errores.correo ? 'input-error' : ''}
          />
          {errores.correo && <span className="texto-error">{errores.correo}</span>}
        </div>

        <div className="acciones-formulario">
          <Boton
            type="submit"
            variante="primario"
            disabled={enviando}
          >
            {enviando ? 'Guardando...' : 'Registrar Paciente'}
          </Boton>
        </div>
      </form>
    </div>
  );
}
