from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import (
    EspecialidadViewSet,
    MedicoViewSet,
    PacienteViewSet,
    EstadoCitaViewSet,
    CitaViewSet,
    HistoriaClinicaViewSet,
)

# Registro de rutas usando DefaultRouter
router = DefaultRouter()
router.register(r'especialidades', EspecialidadViewSet, basename='especialidad')
router.register(r'medicos', MedicoViewSet, basename='medico')
router.register(r'pacientes', PacienteViewSet, basename='paciente')
router.register(r'estados', EstadoCitaViewSet, basename='estado')
router.register(r'citas', CitaViewSet, basename='cita')
router.register(r'historias', HistoriaClinicaViewSet, basename='historia')

urlpatterns = [
    path('', include(router.urls)),
]
