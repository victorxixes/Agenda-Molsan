import math

# Coordenadas de Molsan
MOLSAN_LAT = 41.424960
MOLSAN_LNG = 2.181740

def distancia_molsan(lat, lng):
    # Haversine
    R = 6371
    dlat = math.radians(lat - MOLSAN_LAT)
    dlng = math.radians(lng - MOLSAN_LNG)

    a = (
        math.sin(dlat / 2) ** 2
        + math.cos(math.radians(MOLSAN_LAT))
        * math.cos(math.radians(lat))
        * math.sin(dlng / 2) ** 2
    )

    c = 2 * math.atan2(math.sqrt(a), math.sqrt(1 - a))
    return round(R * c, 2)
