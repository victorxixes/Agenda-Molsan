import time
import logging
from typing import Optional

import requests
from sqlalchemy.orm import Session

from backend.app.ctn.models import Notaria
from backend.app.ctn.normalizador import limpiar_direccion

logger = logging.getLogger(__name__)

# ---------------------------------------------------------
# GOOGLE MAPS API KEY
# ---------------------------------------------------------
GOOGLE_MAPS_API_KEY = "AIzaSyDN8PU3Mo3grQyymvsAfNErFuhS1cY8GzQ"
GOOGLE_GEOCODE_URL = "https://maps.googleapis.com/maps/api/geocode/json"


# ---------------------------------------------------------
# CONSTRUIR DIRECCIÓN
# ---------------------------------------------------------
def _build_address(notaria: Notaria) -> Optional[str]:
    partes = []

    if notaria.direccion:
        partes.append(notaria.direccion)
    if notaria.cp:
        partes.append(notaria.cp)
    if notaria.municipio:
        partes.append(notaria.municipio)
    if notaria.provincia:
        partes.append(notaria.provincia)

    partes.append("España")

    direccion = ", ".join(partes).strip()
    return direccion if direccion else None


# ---------------------------------------------------------
# GEOCODIFICAR UNA DIRECCIÓN CON GOOGLE MAPS
# ---------------------------------------------------------
def _geocode_google(address: str) -> Optional[tuple[float, float]]:
    try:
        params = {
            "address": address,
            "key": GOOGLE_MAPS_API_KEY
        }

        resp = requests.get(GOOGLE_GEOCODE_URL, params=params, timeout=10)

        if resp.status_code != 200:
            logger.error(f"Google Maps error {resp.status_code} para: {address}")
            return None

        data = resp.json()

        if data.get("status") != "OK":
            logger.warning(f"Google Maps sin resultados para: {address}")
            return None

        result = data["results"][0]
        location = result["geometry"]["location"]

        lat = location["lat"]
        lng = location["lng"]

        return float(lat), float(lng)

    except Exception as e:
        logger.error(f"Error geocodificando '{address}': {e}")
        return None


# ---------------------------------------------------------
# GEOCODIFICAR UNA NOTARÍA
# ---------------------------------------------------------
def geocode_notaria(db: Session, notaria: Notaria) -> bool:
    if notaria.lat and notaria.lng:
        return False

    # 🔥 Normalizar dirección ANTES de enviar a Google Maps
    raw_address = _build_address(notaria)
    address = limpiar_direccion(raw_address)

    if not address:
        logger.info(f"No se puede construir dirección para notaría id={notaria.id}")
        return False

    coords = _geocode_google(address)
    if not coords:
        return False

    lat, lng = coords
    notaria.lat = str(lat)
    notaria.lng = str(lng)

    try:
        db.add(notaria)
        db.commit()
        db.refresh(notaria)
        logger.info(f"Coordenadas actualizadas para notaría id={notaria.id}")
        return True
    except Exception as e:
        db.rollback()
        logger.error(f"Error guardando coordenadas para notaría id={notaria.id}: {e}")
        return False


# ---------------------------------------------------------
# GEOCODIFICAR TODAS LAS NOTARÍAS
# ---------------------------------------------------------
def geocode_todas_notarias(db: Session) -> dict:
    notarias = db.query(Notaria).all()

    total = len(notarias)
    actualizadas = 0
    ya_con_coordenadas = 0
    sin_direccion = 0
    sin_resultados = 0

    for n in notarias:
        if n.lat and n.lng:
            ya_con_coordenadas += 1
            continue

        raw_address = _build_address(n)
        address = limpiar_direccion(raw_address)

        if not address:
            sin_direccion += 1
            continue

        coords = _geocode_google(address)
        if not coords:
            sin_resultados += 1
            continue

        lat, lng = coords
        n.lat = str(lat)
        n.lng = str(lng)

        try:
            db.add(n)
            db.commit()
            db.refresh(n)
            actualizadas += 1
        except Exception as e:
            db.rollback()
            logger.error(f"Error guardando coordenadas para notaría id={n.id}: {e}")

        time.sleep(0.2)

    return {
        "total_notarias": total,
        "actualizadas": actualizadas,
        "ya_con_coordenadas": ya_con_coordenadas,
        "sin_direccion": sin_direccion,
        "sin_resultados": sin_resultados,
    }

# ---------------------------------------------------------
# MIGRACIÓN
# ---------------------------------------------------------
def migracion_agregar_coordenadas(db: Session) -> dict:
    return geocode_todas_notarias(db)
