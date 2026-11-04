from rest_framework import viewsets, filters
from .models import Especialidad, Medico, Paciente, EstadoCita, Cita, HistoriaClinica
from .serializers import (
    EspecialidadSerializer,
    MedicoSerializer,
    PacienteSerializer,
    EstadoCitaSerializer,
    CitaSerializer,
    HistoriaClinicaSerializer,
)


class EspecialidadViewSet(viewsets.ModelViewSet):
    queryset = Especialidad.objects.all()
    serializer_class = EspecialidadSerializer


class MedicoViewSet(viewsets.ModelViewSet):
    serializer_class = MedicoSerializer

    def get_queryset(self):
        queryset = Medico.objects.all().select_related('especialidad')
        # Filtro requerido: ?especialidad=<id>
        especialidad_id = self.request.query_params.get('especialidad')
        if especialidad_id:
            queryset = queryset.filter(especialidad_id=especialidad_id)
        return queryset


class PacienteViewSet(viewsets.ModelViewSet):
    serializer_class = PacienteSerializer

    def get_queryset(self):
        queryset = Paciente.objects.all()
        # Soporte opcional para búsqueda por texto o dni
        termino = self.request.query_params.get('search')
        if termino:
            queryset = queryset.filter(nombres__icontains=termino) | queryset.filter(dni__icontains=termino)
        return queryset


class EstadoCitaViewSet(viewsets.ModelViewSet):
    queryset = EstadoCita.objects.all()
    serializer_class = EstadoCitaSerializer


class CitaViewSet(viewsets.ModelViewSet):
    serializer_class = CitaSerializer

    def get_queryset(self):
        queryset = Cita.objects.all().select_related('paciente', 'medico', 'medico__especialidad', 'estado')
        # Filtro requerido: ?fecha=<aaaa-mm-dd>
        fecha = self.request.query_params.get('fecha')
        if fecha:
            queryset = queryset.filter(fecha=fecha)
        return queryset


class HistoriaClinicaViewSet(viewsets.ModelViewSet):
    queryset = HistoriaClinica.objects.all().select_related('paciente')
    serializer_class = HistoriaClinicaSerializer
