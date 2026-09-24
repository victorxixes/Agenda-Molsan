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

    # Eliminar palabras que Google Maps rechaza
    direccion = re.sub(
        r"\b(planta|piso|bajo|local|entresuelo|izd|dch|apta|apt|ap|aplanta|puerta|escalera|bloque)\b",
        "",
        direccion,
        flags=re.IGNORECASE
    )

    # Eliminar números de planta tipo "3º", "2A", "1 B"
    direccion = re.sub(r"\b\d+\s*[A-Za-z]?\b", lambda m: m.group(0) if len(m.group(0)) <= 3 else "", direccion)

    # Quitar dobles espacios otra vez
    direccion = re.sub(r"\s+", " ", direccion)

    return direccion.strip()
