import requests

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

    try:
        res = requests.get(url, params=params, timeout=5)
        data = res.json()

        if not data:
            return None

        return {
            "direccion_real": data[0]["display_name"],
            "lat": data[0]["lat"],
            "lng": data[0]["lon"]
        }

    except Exception as e:
        print("Error geocoding:", e)
        return None
