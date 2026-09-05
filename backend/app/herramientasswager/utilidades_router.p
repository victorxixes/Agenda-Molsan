@router.post("/drop-table")
def drop_table(nombre: str, db: Session = Depends(get_db)):
    db.execute(f"DROP TABLE IF EXISTS {nombre};")
    db.commit()
    return {"estado": "OK", "tabla_borrada": nombre}
