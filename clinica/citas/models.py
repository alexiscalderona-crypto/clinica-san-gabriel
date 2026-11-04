from django.db import models


class Especialidad(models.Model):
    nombre = models.CharField(max_length=100, unique=True, verbose_name="Nombre de la Especialidad")
    descripcion = models.TextField(blank=True, null=True, verbose_name="Descripción")

    class Meta:
        verbose_name = "Especialidad"
        verbose_name_plural = "Especialidades"
        ordering = ['nombre']

    def __str__(self):
        return self.nombre


class Medico(models.Model):
    nombres = models.CharField(max_length=150, verbose_name="Nombres y Apellidos")
    cmp = models.CharField(max_length=20, unique=True, verbose_name="Número de Colegiatura (CMP)")
    # on_delete=models.PROTECT: Evita borrar la especialidad si existen médicos adscritos a ella.
    especialidad = models.ForeignKey(
        Especialidad,
        on_delete=models.PROTECT,
        related_name="medicos",
        verbose_name="Especialidad"
    )
    telefono = models.CharField(max_length=20, verbose_name="Teléfono")
    correo = models.EmailField(verbose_name="Correo Electrónico")
    foto = models.CharField(
        max_length=255,
        blank=True,
        null=True,
        verbose_name="URL de Foto (opcional)"
    )

    class Meta:
        verbose_name = "Médico"
        verbose_name_plural = "Médicos"
        ordering = ['nombres']

    def __str__(self):
        return f"Dr(a). {self.nombres} - CMP: {self.cmp} ({self.especialidad.nombre})"


class Paciente(models.Model):
    dni = models.CharField(max_length=8, unique=True, verbose_name="DNI (8 dígitos)")
    nombres = models.CharField(max_length=150, verbose_name="Nombres y Apellidos")
    fecha_nacimiento = models.DateField(verbose_name="Fecha de Nacimiento")
    telefono = models.CharField(max_length=20, verbose_name="Teléfono")
    correo = models.EmailField(verbose_name="Correo Electrónico")

    class Meta:
        verbose_name = "Paciente"
        verbose_name_plural = "Pacientes"
        ordering = ['nombres']

    def __str__(self):
        return f"{self.nombres} (DNI: {self.dni})"


class EstadoCita(models.Model):
    nombre = models.CharField(max_length=50, unique=True, verbose_name="Nombre del Estado")
    es_final = models.BooleanField(default=False, verbose_name="¿Es estado final?")

    class Meta:
        verbose_name = "Estado de Cita"
        verbose_name_plural = "Estados de Cita"
        ordering = ['id']

    def __str__(self):
        return f"{self.nombre} {'(Final)' if self.es_final else ''}".strip()


class Cita(models.Model):
    # on_delete=models.CASCADE: Si un paciente es eliminado del sistema, sus citas se eliminan en cascada para mantener la base de datos limpia de reservas de personas inexistentes.
    paciente = models.ForeignKey(
        Paciente,
        on_delete=models.CASCADE,
        related_name="citas",
        verbose_name="Paciente"
    )
    # on_delete=models.PROTECT: Un médico no puede ser eliminado si tiene citas registradas, protegiendo la integridad y auditoría de la agenda médica.
    medico = models.ForeignKey(
        Medico,
        on_delete=models.PROTECT,
        related_name="citas",
        verbose_name="Médico"
    )
    fecha = models.DateField(verbose_name="Fecha de la Cita")
    hora = models.TimeField(verbose_name="Hora de la Cita")
    motivo = models.TextField(verbose_name="Motivo de la Consulta")
    estado = models.ForeignKey(
        EstadoCita,
        on_delete=models.PROTECT,
        related_name="citas",
        verbose_name="Estado de la Cita"
    )

    class Meta:
        verbose_name = "Cita Médica"
        verbose_name_plural = "Citas Médicas"
        ordering = ['fecha', 'hora']
        constraints = [
            models.UniqueConstraint(
                fields=['medico', 'fecha', 'hora'],
                name='unique_cita_medico_horario'
            )
        ]

    def __str__(self):
        return f"Cita #{self.id}: {self.paciente.nombres} con {self.medico.nombres} el {self.fecha} a las {self.hora} [{self.estado.nombre}]"


class HistoriaClinica(models.Model):
    paciente = models.OneToOneField(
        Paciente,
        on_delete=models.CASCADE,
        related_name="historia_clinica",
        verbose_name="Paciente"
    )
    grupo_sanguineo = models.CharField(max_length=10, verbose_name="Grupo Sanguíneo")
    alergias = models.TextField(blank=True, default="", verbose_name="Alergias")
    antecedentes = models.TextField(blank=True, default="", verbose_name="Antecedentes Médicos")

    class Meta:
        verbose_name = "Historia Clínica"
        verbose_name_plural = "Historias Clínicas"

    def __str__(self):
        return f"Historia Clínica - {self.paciente.nombres} (Grupo: {self.grupo_sanguineo})"
