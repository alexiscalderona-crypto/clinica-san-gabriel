import os
import django
from datetime import date, time

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'clinica.settings')
django.setup()

from django.contrib.auth.models import User
from citas.models import Especialidad, Medico, Paciente, EstadoCita, Cita, HistoriaClinica

print("Iniciando carga de datos iniciales...")

# 1. Superusuario
if not User.objects.filter(username='admin').exists():
    User.objects.create_superuser('admin', 'admin@clinicasangabriel.com', 'admin123')
    print("[OK] Superusuario 'admin' creado (password: admin123)")
else:
    print("[INFO] Superusuario 'admin' ya existe")

# 2. Estados de Cita
estados_data = [
    ('pendiente', False),
    ('confirmada', False),
    ('atendida', True),
    ('cancelada', True),
]
estados = {}
for nombre, es_final in estados_data:
    obj, _ = EstadoCita.objects.get_or_create(nombre=nombre, defaults={'es_final': es_final})
    estados[nombre] = obj
print(f"[OK] {len(estados)} Estados registrados: {list(estados.keys())}")

# 3. Especialidades (minimo 3)
especialidades_data = [
    ("Cardiologia", "Diagnostico y tratamiento de enfermedades del corazon y sistema circulatorio."),
    ("Pediatria", "Atencion medica integral de bebes, ninos y adolescentes."),
    ("Medicina General", "Atencion medica primaria preventiva, curativa y derivacion oportuna."),
    ("Traumatologia", "Tratamiento de lesiones en el aparato locomotor (huesos, articulaciones y musculos)."),
]
especialidades = {}
for nombre, desc in especialidades_data:
    obj, _ = Especialidad.objects.get_or_create(nombre=nombre, defaults={'descripcion': desc})
    especialidades[nombre] = obj
print(f"[OK] {len(especialidades)} Especialidades registradas")

# 4. Medicos (minimo 4)
medicos_data = [
    {
        "nombres": "Carlos Mendoza Ruiz",
        "cmp": "45892",
        "especialidad": especialidades["Cardiologia"],
        "telefono": "987654321",
        "correo": "cmendoza@clinicasangabriel.com",
        "foto": "https://images.unsplash.com/photo-1622253692010-333f2da6031d?w=300&auto=format&fit=crop&q=80"
    },
    {
        "nombres": "Laura Paredes Silva",
        "cmp": "51203",
        "especialidad": especialidades["Pediatria"],
        "telefono": "976543210",
        "correo": "lparedes@clinicasangabriel.com",
        "foto": "https://images.unsplash.com/photo-1594824813626-d6a86c67d603?w=300&auto=format&fit=crop&q=80"
    },
    {
        "nombres": "Jorge Ramirez Castro",
        "cmp": "39410",
        "especialidad": especialidades["Medicina General"],
        "telefono": "965432109",
        "correo": "jramirez@clinicasangabriel.com",
        "foto": "https://images.unsplash.com/photo-1537368910025-700350fe46c7?w=300&auto=format&fit=crop&q=80"
    },
    {
        "nombres": "Sofia Torres Vega",
        "cmp": "62044",
        "especialidad": especialidades["Traumatologia"],
        "telefono": "954321098",
        "correo": "storres@clinicasangabriel.com",
        "foto": "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=300&auto=format&fit=crop&q=80"
    },
]
medicos = []
for m in medicos_data:
    obj, _ = Medico.objects.get_or_create(cmp=m["cmp"], defaults=m)
    medicos.append(obj)
print(f"[OK] {len(medicos)} Medicos registrados")

# 5. Pacientes (minimo 5)
pacientes_data = [
    {
        "dni": "72345678",
        "nombres": "Juan Perez Quispe",
        "fecha_nacimiento": date(1995, 5, 14),
        "telefono": "912345678",
        "correo": "juan.perez@gmail.com",
        "hc": {"grupo_sanguineo": "O+", "alergias": "Penicilina", "antecedentes": "Hipertension leve controlada"}
    },
    {
        "dni": "45678912",
        "nombres": "Maria Rodriguez Salas",
        "fecha_nacimiento": date(1988, 11, 23),
        "telefono": "923456781",
        "correo": "maria.rodriguez@gmail.com",
        "hc": {"grupo_sanguineo": "A+", "alergias": "Ninguna", "antecedentes": "Asma infantil superada"}
    },
    {
        "dni": "12345678",
        "nombres": "Pedro Gomez Morales",
        "fecha_nacimiento": date(1976, 2, 8),
        "telefono": "934567812",
        "correo": "pedro.gomez@gmail.com",
        "hc": {"grupo_sanguineo": "B+", "alergias": "Sulfas", "antecedentes": "Cirugia de apendice (2015)"}
    },
    {
        "dni": "87654321",
        "nombres": "Ana Flores Chura",
        "fecha_nacimiento": date(2001, 8, 30),
        "telefono": "945678123",
        "correo": "ana.flores@gmail.com",
        "hc": {"grupo_sanguineo": "O-", "alergias": "Polvo y acaros", "antecedentes": "Rinitis alergica"}
    },
    {
        "dni": "23456789",
        "nombres": "Luis Alberto Medina",
        "fecha_nacimiento": date(1965, 4, 17),
        "telefono": "956781234",
        "correo": "luis.medina@gmail.com",
        "hc": {"grupo_sanguineo": "AB+", "alergias": "Ibuprofeno", "antecedentes": "Diabetes tipo 2 en tratamiento"}
    },
]
pacientes = []
for p in pacientes_data:
    hc_data = p.pop("hc")
    pac, _ = Paciente.objects.get_or_create(dni=p["dni"], defaults=p)
    pacientes.append(pac)
    HistoriaClinica.objects.get_or_create(paciente=pac, defaults=hc_data)
print(f"[OK] {len(pacientes)} Pacientes e Historias Clinicas registradas")

# 6. Citas medicas iniciales
from django.utils import timezone
hoy = timezone.now().date()
citas_ejemplo = [
    {
        "paciente": pacientes[0],
        "medico": medicos[0],
        "fecha": hoy,
        "hora": time(9, 0),
        "motivo": "Evaluacion cardiologica por chequeo anual y palpitaciones ocasionales.",
        "estado": estados["pendiente"]
    },
    {
        "paciente": pacientes[1],
        "medico": medicos[1],
        "fecha": hoy,
        "hora": time(10, 30),
        "motivo": "Control pediatrico de rutina y vacunacion de refuerzo.",
        "estado": estados["confirmada"]
    },
    {
        "paciente": pacientes[2],
        "medico": medicos[2],
        "fecha": hoy,
        "hora": time(11, 0),
        "motivo": "Dolor de cabeza recurrente y malestar general desde hace 3 dias.",
        "estado": estados["atendida"]
    },
]

for c in citas_ejemplo:
    Cita.objects.get_or_create(
        medico=c["medico"],
        fecha=c["fecha"],
        hora=c["hora"],
        defaults=c
    )
print(f"[OK] Citas de prueba creadas exitosamente para la fecha: {hoy}")
print("\n[OK] Carga inicial completada al 100%!")
