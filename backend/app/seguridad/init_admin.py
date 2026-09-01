from sqlalchemy.orm import Session
import hashlib

from backend.app.database import SessionLocal
from backend.app.empleados.models import Empleado
from backend.app.maestros.models import Departamento, Seccion, Cargo
from backend.app.seguridad.models import Rol


def hash_password(password: str) -> str:
    return hashlib.sha256(password.encode()).hexdigest()


def init_admin():
    db: Session = SessionLocal()

    # ---------------------------------------------------------
    # CREAR MAESTROS SI NO EXISTEN
    # ---------------------------------------------------------
    dep = db.query(Departamento).filter_by(nombre="Direccion").first()
    if not dep:
        dep = Departamento(nombre="Direccion", descripcion="Dirección General")
        db.add(dep)
        db.commit()
        db.refresh(dep)

    sec = db.query(Seccion).filter_by(nombre="General").first()
    if not sec:
        sec = Seccion(nombre="General", descripcion="Sección General")
        db.add(sec)
        db.commit()
        db.refresh(sec)

    car = db.query(Cargo).filter_by(nombre="Administrador").first()
    if not car:
        car = Cargo(nombre="Administrador", descripcion="Cargo Administrador")
        db.add(car)
        db.commit()
        db.refresh(car)

    # ---------------------------------------------------------
    # CREAR ADMIN SI NO EXISTE
    # ---------------------------------------------------------
    existe = db.query(Empleado).filter(Empleado.usuario == "admin").first()

    if not existe:
        nuevo_admin = Empleado(
            nombre="Admin",
            apellidos="General",
            dni="ADMIN000",
            telefono="600000000",
            email_personal="admin@molsan.com",
            email_empresa="admin@molsan.com",
            extension="100",
            fecha_alta="2026-08-01",

            departamento_id=dep.id,
            seccion_id=sec.id,
            cargo_id=car.id,

            usuario="admin",
            password=hash_password("admin"),
            activo=True,

            # JSONB correcto
            modulos_visibles_list=[
                "dashboard",
                "agenda",
                "empleados",
                "ctn",
                "documentos",
                "intranet",
                "mensajes",
                "seguridad"
            ],

            permisos_modulo_dict={
                "dashboard": ["ver"],
                "agenda": ["ver", "crear", "editar", "eliminar"],
                "empleados": ["ver", "crear", "editar", "eliminar"],
                "ctn": ["ver", "crear", "editar", "eliminar"],
                "documentos": ["ver", "crear", "editar", "eliminar"],
                "intranet": ["ver", "crear", "editar"],
                "mensajes": ["ver", "crear", "eliminar"],
                "seguridad": ["ver", "editar"]
            }
        )

        db.add(nuevo_admin)
        db.commit()
        db.refresh(nuevo_admin)

        # ---------------------------------------------------------
        # ASIGNAR ROL ADMINISTRADOR
        # ---------------------------------------------------------
        rol_admin = db.query(Rol).filter(Rol.nombre == "Administrador").first()
        if rol_admin:
            nuevo_admin.rol_id = rol_admin.id
            db.commit()

        print("Administrador creado correctamente.")
    else:
        print("El administrador ya existe.")

    db.close()


if __name__ == "__main__":
    init_admin()
