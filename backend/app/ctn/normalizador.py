import re
import unicodedata

def limpiar_texto(s: str) -> str:
    if not s:
        return ""

    # Normalizar acentos
    s = unicodedata.normalize("NFKD", s).encode("ascii", "ignore").decode("ascii")

    # Quitar dobles espacios
    s = re.sub(r"\s+", " ", s)

    # Quitar espacios antes de comas
    s = re.sub(r"\s+,", ",", s)

    return s.strip()


def limpiar_direccion(direccion: str) -> str:
    if not direccion:
        return ""

    direccion = limpiar_texto(direccion)

    # 🔥 Eliminar palabras que Google Maps rechaza
    direccion = re.sub(
        r"\b(planta|piso|bajo|local|entresuelo|izd|dch|apta|apt|ap|aplanta|puerta|escalera|bloque|oficina|despacho)\b",
        "",
        direccion,
        flags=re.IGNORECASE
    )

    # 🔥 Eliminar números de piso tipo "3º", "2A", "1 B", "4ºA"
    direccion = re.sub(r"\b\d+\s*[A-Za-z]?\b", "", direccion)

    # 🔥 Eliminar ordinales tipo "3º", "4ª"
    direccion = re.sub(r"\b\d+º\b", "", direccion)
    direccion = re.sub(r"\b\d+ª\b", "", direccion)

    # 🔥 Eliminar letras sueltas tipo "A", "B", "C"
    direccion = re.sub(r"\b[A-Za-z]\b", "", direccion)

    # 🔥 Quitar comas duplicadas
    direccion = re.sub(r",+", ",", direccion)

    # 🔥 Quitar espacios dobles otra vez
    direccion = re.sub(r"\s+", " ", direccion)

    # 🔥 Quitar comas al final
    direccion = direccion.rstrip(",")

    return direccion.strip()
