const BASE_URL = 'http://localhost:8000/api';

/**
 * Obtener listado de especialidades médicas
 */
export async function getEspecialidades() {
  const response = await fetch(`${BASE_URL}/especialidades/`);
  if (!response.ok) {
    throw new Error(`Error ${response.status}: No se pudo cargar las especialidades`);
  }
  return await response.json();
}

/**
 * Obtener médicos (con filtro opcional por especialidad)
 */
export async function getMedicos(especialidadId = null) {
  const url = especialidadId
    ? `${BASE_URL}/medicos/?especialidad=${especialidadId}`
    : `${BASE_URL}/medicos/`;
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`Error ${response.status}: No se pudo cargar los médicos`);
  }
  return await response.json();
}

/**
 * Obtener listado de pacientes
 */
export async function getPacientes(searchTerm = '') {
  const url = searchTerm
    ? `${BASE_URL}/pacientes/?search=${encodeURIComponent(searchTerm)}`
    : `${BASE_URL}/pacientes/`;
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`Error ${response.status}: No se pudo cargar los pacientes`);
  }
  return await response.json();
}

/**
 * Registrar un nuevo paciente
 */
export async function crearPaciente(pacienteData) {
  const response = await fetch(`${BASE_URL}/pacientes/`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(pacienteData),
  });
  const data = await response.json();
  if (!response.ok) {
    throw data;
  }
  return data;
}

/**
 * Eliminar un paciente por ID
 */
export async function eliminarPaciente(id) {
  const response = await fetch(`${BASE_URL}/pacientes/${id}/`, {
    method: 'DELETE',
  });
  if (!response.ok) {
    throw new Error(`Error ${response.status}: No se pudo eliminar el paciente`);
  }
  return true;
}

/**
 * Obtener citas médicas (con filtro opcional por fecha)
 */
export async function getCitas(fecha = null) {
  const url = fecha
    ? `${BASE_URL}/citas/?fecha=${fecha}`
    : `${BASE_URL}/citas/`;
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`Error ${response.status}: No se pudo cargar las citas`);
  }
  return await response.json();
}

/**
 * Registrar una nueva cita médica
 */
export async function crearCita(citaData) {
  const response = await fetch(`${BASE_URL}/citas/`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(citaData),
  });
  const data = await response.json();
  if (!response.ok) {
    throw data;
  }
  return data;
}

/**
 * Actualizar el estado de una cita médica (PATCH)
 */
export async function actualizarEstadoCita(id, estadoId) {
  const response = await fetch(`${BASE_URL}/citas/${id}/`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ estado: estadoId }),
  });
  const data = await response.json();
  if (!response.ok) {
    throw data;
  }
  return data;
}

/**
 * Obtener los estados posibles de una cita
 */
export async function getEstados() {
  const response = await fetch(`${BASE_URL}/estados/`);
  if (!response.ok) {
    throw new Error(`Error ${response.status}: No se pudo cargar los estados`);
  }
  return await response.json();
}
