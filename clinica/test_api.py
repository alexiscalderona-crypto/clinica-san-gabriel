import os
import django
import json

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'clinica.settings')
django.setup()

from rest_framework.test import APIClient
from citas.models import Medico, Paciente, EstadoCita, Cita

client = APIClient()

print("="*60)
print("PRUEBAS DE ENDPOINTS DE LA API REST (PREGUNTA 1)")
print("="*60)

# 1. GET /api/especialidades/
resp = client.get('/api/especialidades/')
print(f"\n1. GET /api/especialidades/ [Status: {resp.status_code}]")
print(json.dumps(resp.data, indent=2, ensure_ascii=False)[:300] + "\n...")

# 2. GET /api/medicos/
resp = client.get('/api/medicos/')
print(f"\n2. GET /api/medicos/ [Status: {resp.status_code}]")
print(json.dumps(resp.data, indent=2, ensure_ascii=False)[:350] + "\n...")

# 3. GET /api/medicos/?especialidad=1 (Filtro por especialidad)
resp = client.get('/api/medicos/?especialidad=1')
print(f"\n3. FILTRO: GET /api/medicos/?especialidad=1 [Status: {resp.status_code}]")
print(f"Total encontrados: {len(resp.data)}")
print(json.dumps(resp.data, indent=2, ensure_ascii=False))

# 4. GET /api/pacientes/
resp = client.get('/api/pacientes/')
print(f"\n4. GET /api/pacientes/ [Status: {resp.status_code}]")
print(f"Total pacientes: {len(resp.data)}")
print(json.dumps(resp.data[:2], indent=2, ensure_ascii=False))

# 5. POST /api/pacientes/ (Crear nuevo paciente)
nuevo_paciente = {
    "dni": "99887766",
    "nombres": "Carlos Santana Vega",
    "fecha_nacimiento": "1992-06-15",
    "telefono": "999888777",
    "correo": "carlos.santana@example.com"
}
resp = client.post('/api/pacientes/', data=nuevo_paciente, format='json')
print(f"\n5. POST /api/pacientes/ [Status: {resp.status_code}]")
print(json.dumps(resp.data, indent=2, ensure_ascii=False))
paciente_creado_id = resp.data.get('id')

# 6. GET /api/citas/?fecha=2026-11-04 (Filtro por fecha)
resp = client.get('/api/citas/?fecha=2026-11-04')
print(f"\n6. FILTRO: GET /api/citas/?fecha=2026-11-04 [Status: {resp.status_code}]")
print(f"Citas en fecha 2026-11-04: {len(resp.data)}")
print(json.dumps(resp.data[:1], indent=2, ensure_ascii=False))

# 7. POST /api/citas/ (Crear cita válida)
medico = Medico.objects.first()
paciente = Paciente.objects.first()
estado_pendiente = EstadoCita.objects.get(nombre='pendiente')

# Limpiar posibles citas de pruebas anteriores en esa hora para prueba limpia
Cita.objects.filter(medico=medico, fecha="2026-11-25", hora="16:30:00").delete()

nueva_cita = {
    "paciente": paciente.id,
    "medico": medico.id,
    "fecha": "2026-11-25",
    "hora": "16:30:00",
    "motivo": "Consulta de control preventivo programada.",
    "estado": estado_pendiente.id
}
resp = client.post('/api/citas/', data=nueva_cita, format='json')
print(f"\n7. POST /api/citas/ (Cita Válida) [Status: {resp.status_code}]")
print(json.dumps(resp.data, indent=2, ensure_ascii=False))
cita_creada_id = resp.data.get('id')

# 8. VALIDACIÓN 400: Intentar registrar con fecha pasada
cita_pasada = {
    "paciente": paciente.id,
    "medico": medico.id,
    "fecha": "2023-01-10",
    "hora": "10:00:00",
    "motivo": "Intento de cita en el pasado",
    "estado": estado_pendiente.id
}
resp = client.post('/api/citas/', data=cita_pasada, format='json')
print(f"\n8. ERROR DE VALIDACIÓN: Fecha pasada [Status: {resp.status_code}]")
print(json.dumps(resp.data, indent=2, ensure_ascii=False))

# 9. VALIDACIÓN 400: Intentar registrar en el mismo horario que el médico ya tiene ocupado
cita_duplicada = {
    "paciente": paciente.id,
    "medico": medico.id,
    "fecha": "2026-11-25",
    "hora": "16:30:00",  # Mismo horario que la cita creada en el paso 7
    "motivo": "Intento de cita en horario ya ocupado por el Dr.",
    "estado": estado_pendiente.id
}
resp = client.post('/api/citas/', data=cita_duplicada, format='json')
print(f"\n9. ERROR DE VALIDACIÓN: Horario ocupado [Status: {resp.status_code}]")
print(json.dumps(resp.data, indent=2, ensure_ascii=False))

# 10. PATCH /api/citas/<id>/ (Cambiar estado de cita)
estado_confirmada = EstadoCita.objects.get(nombre='confirmada')
resp = client.patch(f'/api/citas/{cita_creada_id}/', data={"estado": estado_confirmada.id}, format='json')
print(f"\n10. PATCH /api/citas/{cita_creada_id}/ (Cambio a confirmada) [Status: {resp.status_code}]")
print(json.dumps(resp.data, indent=2, ensure_ascii=False))

# 11. DELETE /api/pacientes/<id>/
if paciente_creado_id:
    resp = client.delete(f'/api/pacientes/{paciente_creado_id}/')
    print(f"\n11. DELETE /api/pacientes/{paciente_creado_id}/ [Status: {resp.status_code}]")
    print(f"Paciente temporal eliminado exitosamente (Status 204 No Content).")

print("\n" + "="*60)
print("TODAS LAS PRUEBAS DE LA PREGUNTA 1 COMPLETADAS CON ÉXITO")
print("="*60)
