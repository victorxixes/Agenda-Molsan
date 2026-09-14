# =========================================================
# GEOCODIFICACIÓN OPTIMIZADA (con cache y sin 429)
# =========================================================
def geocode_cp(cp: str, municipio: str | None = None, provincia: str | None = None):
    """
    Optimización:
    - Evita llamadas repetidas a Nominatim (429).
    - No rompe el endpoint si Nominatim falla.
    - Devuelve siempre un dict válido o None.
    """

    if not cp:
        return None

    # Construcción de query
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

        # Si Nominatim devuelve 429 → no romper nada
        if res.status_code == 429:
            print("Geocode error: 429 (rate limit exceeded)")
            return None

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
