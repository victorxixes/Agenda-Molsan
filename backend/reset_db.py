from fastapi import FastAPI, Depends
from sqlalchemy.orm import Session
from backend.app.database import get_db

app = FastAPI()

@app.post("/drop-roles")
def drop_roles(db: Session = Depends(get_db)):
    db.execute("DROP TABLE IF EXISTS roles;")
    db.commit()
    return {"estado": "OK", "tabla_borrada": "roles"}
