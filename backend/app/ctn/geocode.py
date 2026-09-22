import time
import logging
from typing import Optional

import requests
from sqlalchemy.orm import Session

from backend.app.ctn.models import Notaria

logger = logging.getLogger(__name__)

NOMINATIM_URL = "https://nominatim.openstreetmap.org/search"
NOMINATIM_USER_AGENT = "agenda-molsan-geocode/1.0"


def _build_address(notaria: Notaria) -> Optional[str]:
    """
    Construye una cadena de dirección lo más completa posible
    para enviar a Nominatim.
    """
    partes = []

    if notaria.direccion:
        partes.append(notaria.direccion)
    if notaria.cp:
        partes.append(notaria.cp)
    if notaria.municipio:
        partes.append(notaria.municipio)
    if notaria.provincia:
        partes.append(notaria.provincia)
    if notaria.nombre or notaria.apellidos:
        partes.append(f"{notaria.nombre or ''} {notaria.apellidos or ''}".strip())

    # Si no hay nada útil, no intentamos geocodificar
    if not partes:
        return None

    return ", ".join(partes)


def _geocode_nominatim(address: str) -> Optional[tuple[float, float]]:
    """
    Llama a Nominatim de forma segura y devuelve (lat, lng) o None.
    Maneja errores de red, respuestas vacías y formatos inesperados.
    """
    try:
        params = {
            "q": address,
            "format": "json",
            "limit": 1,
        }
        headers = {
            "User-Agent": NOMINATIM_USER_AGENT,
        }

        resp = requests.get(NOMINATIM_URL, params=params, headers=headers, timeout=10)

        # Si el servidor responde con error, no rompemos la app
        if resp.status_code != 200:
            logger.warning(
                f"Nominatim error {resp.status_code} para dirección: {address}"
            )
            return None

        data = resp.json()
        if not isinstance(data, list) or not data:
            logger.info(f"Nominatim sin resultados para: {address}")
            return None

        item = data[0]
        lat_str = item.get("lat")
        lon_str = item.get("lon")

        if not lat_str or not lon_str:
            return None

        return float(lat_str), float(lon_str)

    except Exception as e:
        logger.error(f"Error geocodificando '{address}': {e}")
        return None


def geocode_notaria(db: Session, notaria: Notaria) -> bool:
    """
    Geocodifica una sola notaría si no tiene lat/lng.
    Devuelve True si se ha actualizado, False si no.
    """
    # Si ya tiene coordenadas válidas, no tocamos nada
    if notaria.lat and notaria.lng:
        return False

    address = _build_address(notaria)
    if not address:
        logger.info(f"No se puede construir dirección para notaría id={notaria.id}")
        return False

    coords = _geocode_nominatim(address)
    if not coords:
        return False

    lat, lng = coords
    notaria.lat = str(lat)
    notaria.lng = str(lng)

    try:
        db.add(notaria)
        db.commit()
        db.refresh(notaria)
        logger.info(f"Actualizadas coordenadas para notaría id={notaria.id}")
        return True
    except Exception as e:
        db.rollback()
        logger.error(f"Error guardando coordenadas para notaría id={notaria.id}: {e}")
        return False


def geocode_todas_notarias(db: Session) -> dict:
    """
    Geocodifica todas las notarías que no tienen lat/lng.
    Pensado para el endpoint POST /api/ctn/geocode/notarias.
    """
    notarias: list[Notaria] = db.query(Notaria).all()

    total = len(notarias)
    actualizadas = 0
    ya_con_coordenadas = 0
    sin_direccion = 0
    sin_resultados = 0

    for n in notarias:
        # Ya tiene coordenadas
        if n.lat and n.lng:
            ya_con_coordenadas += 1
            continue

        address = _build_address(n)
        if not address:
            sin_direccion += 1
            continue

        coords = _geocode_nominatim(address)
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

        # Pequeña pausa para no saturar Nominatim
        time.sleep(1)

    return {
        "total_notarias": total,
        "actualizadas": actualizadas,
        "ya_con_coordenadas": ya_con_coordenadas,
        "sin_direccion": sin_direccion,
        "sin_resultados": sin_resultados,
    }


def migracion_agregar_coordenadas(db: Session) -> dict:
    """
    Wrapper pensado para el endpoint
    POST /api/ctn/migracion/agregar-coordenadas

    Simplemente llama a geocode_todas_notarias y devuelve el resumen.
    """
    resumen = geocode_todas_notarias(db)
    return resumen
