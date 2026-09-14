import requests
import math
from backend.app.database import get_db
from sqlalchemy.orm import Session

# =========================================================
# COORDENADAS DE MOLSAN
# =========================================================
MOLSAN_LAT = 41.2230
MOLSAN_LNG = 1.7250


# =========================================================
# DISTANCIA ENTRE DOS COORDENADAS (HAVERSINE)
# =========================================================
def distancia_km(lat1, lon1, lat2, lon2):
    lat1, lon1, lat2, lon2 = map(math.radians, [
        float(lat1), float(lon1), float(lat2), float(lon2)
    ])

    dlat = lat2 - lat1
    dlon = lon2 - lon1

    a = math.sin(dlat/2)**2 + math.cos(lat1) * math.cos(lat2) * math.sin(dlon/2)**2
    c = 2 * math.asin(math.sqrt(a))

    return 6371 * c


def distancia_molsan(lat, lng):
    return distancia_km(MOLSAN_LAT, MOLSAN_LNG, lat, lng)


# =========================================================
# GEOCODE CON CACHE EN BD (VERSIÓN OPTIMIZADA)
# =========================================================
def geocode_cp(cp: str, municipio: str | None = None, provincia: str | None = None):
    """
    Optimización:
    - Busca lat/lng/dirección en la BD (tabla CTN).
    - Si existe → devuelve cache.
    - Si no existe → llama a Nominatim UNA sola vez.
    - Guarda el resultado en BD.
    - Maneja errores 429 sin romper nada.
    """

    if not cp:
        return None

    db: Session = next(get_db())

    # Import del modelo CTN
    from backend.app.ctn.models import Notaria

    # Buscar notaría en BD
    notaria = (
        db.query(Notaria)
        .filter(Notaria.cp == cp,
                Notaria.municipio == municipio,
                Notaria.provincia == provincia)
        .first()
    )

    # ✔ Si ya tiene coordenadas → devolver cache
    if notaria and notaria.lat and notaria.lng and notaria.direccion_real:
        return {
            "lat": notaria.lat,
            "lng": notaria.lng,
            "direccion_real": notaria.direccion_real,
        }

    # ✔ Si no hay cache → geocodificar UNA vez
    query = f"{cp} {municipio or ''} {provincia or ''}".strip()

    url = "https://nominatim.openstreetmap.org/search"
    params = {
        "q": query,
        "country": "Spain",
        "format": "json",
        "limit": 1
    }

    headers = {
        "User-Agent": "ERP-Molsan/1.0 (contacto: soporte@molsan.es)"
    }

    try:
        res = requests.get(url, params=params, headers=headers, timeout=5)

        # Manejo explícito del error 429
        if res.status_code == 429:
            print("Geocode error: 429 (rate limit exceeded)")
            return None

        if res.status_code != 200:
            print("Geocode error:", res.status_code)
            return None

        data = res.json()
        if not data:
            return None

        lat = float(data[0]["lat"])
        lng = float(data[0]["lon"])
        direccion_real = data[0]["display_name"]

        # ✔ Guardar en BD para cache permanente
        if notaria:
            notaria.lat = lat
            notaria.lng = lng
            notaria.direccion_real = direccion_real
            db.commit()

        return {
            "lat": lat,
            "lng": lng,
            "direccion_real": direccion_real,
        }

    except Exception as e:
        print("Error geocoding:", e)
        return None
