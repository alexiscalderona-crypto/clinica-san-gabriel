from rest_framework import serializers
from django.utils import timezone
from .models import Especialidad, Medico, Paciente, EstadoCita, Cita, HistoriaClinica


class EspecialidadSerializer(serializers.ModelSerializer):
    class Meta:
        model = Especialidad
        fields = ['id', 'nombre', 'descripcion']


class MedicoSerializer(serializers.ModelSerializer):
    especialidad_nombre = serializers.CharField(source='especialidad.nombre', read_only=True)

    class Meta:
        model = Medico
        fields = ['id', 'nombres', 'cmp', 'especialidad', 'especialidad_nombre', 'telefono', 'correo', 'foto']


class PacienteSerializer(serializers.ModelSerializer):
    class Meta:
        model = Paciente
        fields = ['id', 'dni', 'nombres', 'fecha_nacimiento', 'telefono', 'correo']

    def validate_dni(self, value):
        if len(value) != 8 or not value.isdigit():
            raise serializers.ValidationError("El DNI debe tener exactamente 8 dígitos numéricos.")
        return value


class EstadoCitaSerializer(serializers.ModelSerializer):
    class Meta:
        model = EstadoCita
        fields = ['id', 'nombre', 'es_final']


class CitaSerializer(serializers.ModelSerializer):
    # Campos de solo lectura solicitados explícitamente mediante source
    paciente_nombre = serializers.CharField(source='paciente.nombres', read_only=True)
    medico_nombre = serializers.CharField(source='medico.nombres', read_only=True)
    especialidad = serializers.CharField(source='medico.especialidad.nombre', read_only=True)
    estado_nombre = serializers.CharField(source='estado.nombre', read_only=True)

    class Meta:
        model = Cita
        fields = [
            'id',
            'paciente',
            'paciente_nombre',
            'medico',
            'medico_nombre',
            'especialidad',
            'fecha',
            'hora',
            'motivo',
            'estado',
            'estado_nombre',
        ]
        # Vaciamos validators automáticos para que se ejecute nuestro validate() con el mensaje personalizado claro solicitado
        validators = []

    def validate(self, attrs):
        # Manejo de instancias para creación y actualización (PATCH)
        fecha = attrs.get('fecha', getattr(self.instance, 'fecha', None))
        hora = attrs.get('hora', getattr(self.instance, 'hora', None))
        medico = attrs.get('medico', getattr(self.instance, 'medico', None))

        # 1. Validación: Rechazar citas con fecha pasada
        hoy = timezone.now().date()
        if fecha and fecha < hoy:
            raise serializers.ValidationError({
                "fecha": f"No se puede registrar una cita en una fecha pasada ({fecha}). Debe ser una fecha actual o futura."
            })

        # 2. Validación: Rechazar si el médico ya tiene un horario ocupado
        if medico and fecha and hora:
            citas_conflicto = Cita.objects.filter(medico=medico, fecha=fecha, hora=hora)
            if self.instance:
                citas_conflicto = citas_conflicto.exclude(pk=self.instance.pk)

            if citas_conflicto.exists():
                raise serializers.ValidationError({
                    "hora": f"El/la Dr(a). {medico.nombres} ya tiene una cita ocupada el {fecha} a las {hora}. Por favor elija otro horario."
                })

        return attrs


class HistoriaClinicaSerializer(serializers.ModelSerializer):
    paciente_nombre = serializers.CharField(source='paciente.nombres', read_only=True)

    class Meta:
        model = HistoriaClinica
        fields = ['id', 'paciente', 'paciente_nombre', 'grupo_sanguineo', 'alergias', 'antecedentes']
