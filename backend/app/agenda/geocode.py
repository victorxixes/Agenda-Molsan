import requests
import math

# =========================================================
# COORDENADAS DE MOLSAN (PUNTO DE PARTIDA Y RETORNO)
# =========================================================
MOLSAN_LAT = 41.2230
MOLSAN_LNG = 1.7250


# =========================================================
# DISTANCIA ENTRE DOS COORDENADAS (HAVERSINE)
# =========================================================
def distancia_km(lat1, lon1, lat2, lon2):
    """
    Calcula la distancia en kilómetros entre dos coordenadas usando Haversine.
    """

    lat1, lon1, lat2, lon2 = map(math.radians, [
        float(lat1), float(lon1), float(lat2), float(lon2)
    ])

    dlat = lat2 - lat1
    dlon = lon2 - lon1

    a = math.sin(dlat/2)**2 + math.cos(lat1) * math.cos(lat2) * math.sin(dlon/2)**2
    c = 2 * math.asin(math.sqrt(a))

    R = 6371  # Radio de la Tierra en km
    return R * c


# =========================================================
# DISTANCIA MOLSAN → NOTARIA
# =========================================================
def distancia_molsan(lat, lng):
    return distancia_km(MOLSAN_LAT, MOLSAN_LNG, lat, lng)


# =========================================================
# RUTA COMPLETA: Molsan → Notaría A → ... → Notaría N → Molsan
# =========================================================
def ruta_molsan(notarias):
    """
    notarias = lista de dicts con lat/lng y nombre
    Devuelve:
    - distancia total
    - lista de tramos
    """

    tramos = []
    distancia_total = 0

    lat_prev = MOLSAN_LAT
    lng_prev = MOLSAN_LNG

    for n in notarias:
        lat = float(n["lat"])
        lng = float(n["lng"])

        km = distancia_km(lat_prev, lng_prev, lat, lng)
        distancia_total += km

        tramos.append({
            "desde": "Molsan" if lat_prev == MOLSAN_LAT else f"{lat_prev},{lng_prev}",
            "hasta": n["nombre"],
            "km": round(km, 2)
        })

        lat_prev = lat
        lng_prev = lng

    # Retorno a Molsan
    km_vuelta = distancia_km(lat_prev, lng_prev, MOLSAN_LAT, MOLSAN_LNG)
    distancia_total += km_vuelta

    tramos.append({
        "desde": f"{lat_prev},{lng_prev}",
        "hasta": "Molsan",
        "km": round(km_vuelta, 2)
    })

    return {
        "distancia_total_km": round(distancia_total, 2),
        "tramos": tramos
    }


# =========================================================
# GEOCODIFICACIÓN SEGURA (Nominatim con User-Agent)
# =========================================================
def geocode_cp(cp: str, municipio: str | None = None, provincia: str | None = None):
    if not cp:
        return None

    query = cp
    if municipio:
        query += f" {municipio}"
    if provincia:
        query += f" {provincia}"

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

        if res.status_code != 200:
            print("Geocode error:", res.status_code)
            return None

        data = res.json()
        if not data:
            return None

        return {
            "direccion_real": data[0]["display_name"],
            "lat": float(data[0]["lat"]),
            "lng": float(data[0]["lon"])
        }

    except Exception as e:
        print("Error geocoding:", e)
        return None
