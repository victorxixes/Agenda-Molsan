from datetime import date
from database import db

def obtener_tabla_informes(mes: int, año: int):
    desde = date(año, mes, 1)
    hasta = date(año, mes, 31)

    datos = db.fetch("""
        SELECT 
            e.id AS apoderado_id,
            e.nombre AS nombre,
            c.tipo_firma,
            c.km
        FROM empleados e
        LEFT JOIN citas c 
            ON c.apoderado_id = e.id
            AND c.fecha BETWEEN :desde AND :hasta
        ORDER BY e.nombre ASC
    """, {"desde": desde, "hasta": hasta})

    tabla = {}

    for d in datos:
        aid = d["apoderado_id"]

        if aid not in tabla:
            tabla[aid] = {
                "apoderado_id": aid,
                "nombre": d["nombre"],
                "presencial": 0,
                "vc": 0,
                "km": 0,
            }

        if d["tipo_firma"] == "P":
            tabla[aid]["presencial"] += 1
            tabla[aid]["km"] += d["km"] or 0

        elif d["tipo_firma"] == "VC":
            tabla[aid]["vc"] += 1

    return list(tabla.values())
