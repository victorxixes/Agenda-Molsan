from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from backend.app.database import get_db
from backend.app.ctn.service import listar_notarias
from backend.app.agenda.geocode import geocode_cp, distancia_molsan

router = APIRouter(prefix="/agenda", tags=["Agenda"])


@router.get("/notarios")
def obtener_notarios(db: Session = Depends(get_db)):
    notarias = listar_notarias(db)

    resultado = []
    for n in notarias:

        # Geolocalización real
        geo = geocode_cp(n.cp, n.municipio, n.provincia)

        # Coordenadas reales (float) o None
        lat = geo["lat"] if geo else None
        lng = geo["lng"] if geo else None

        # Distancia desde Molsan → Notaría
        distancia_km = distancia_molsan(lat, lng) if geo else None

        resultado.append({
            "id": n.id,
            "codigo": n.codigo,
            "nombre": n.nombre,
            "apellidos": n.apellidos,
            "nif": n.nif,
            "telefono": n.telefono,

            # Departamentos del Excel
            "departamento_cancelaciones": n.departamento_cancelaciones,
            "departamento_copias": n.departamento_copias,
            "otros_departamentos": n.otros_departamentos,

            # Localización del Excel
            "cp": n.cp,
            "provincia": n.provincia,
            "municipio": n.municipio,

            # Campos críticos para autocompletado
            "vc": n.vc,
            "apoderado_id": n.apoderado_id,
            "apoderado_s": n.apoderado_s,
            "observacion": n.observacion,

            # Dirección generada automáticamente
            "direccion": geo["direccion_real"] if geo else f"{n.municipio}, {n.provincia}",

            # Coordenadas reales para el mapa
            "lat": lat,
            "lng": lng,

            # ⭐ Distancia desde Molsan → Notaría
            "distancia_molsan_km": distancia_km
        })

    return resultado
