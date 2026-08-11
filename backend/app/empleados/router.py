from sqlalchemy.orm import Session
from app.database import get_db
from app.empleados.schemas import EmpleadoCreate, EmpleadoUpdate, EmpleadoResponse
from app.empleados.service import crear_empleado, editar_empleado, eliminar_empleado
from app.empleados.models import Empleado

router = APIRouter(prefix="/empleados", tags=["Empleados"])

@router.post("", response_model=EmpleadoResponse)
def crear(data: EmpleadoCreate, db: Session = Depends(get_db)):
    return crear_empleado(db, data)

@router.get("", response_model=list[EmpleadoResponse])
def listar(db: Session = Depends(get_db)):
    return db.query(Empleado).all()

@router.get("/{empleado_id}", response_model=EmpleadoResponse)
def obtener(empleado_id: int, db: Session = Depends(get_db)):
    return db.query(Empleado).filter(Empleado.id == empleado_id).first()

@router.put("/{empleado_id}", response_model=EmpleadoResponse)
def editar(empleado_id: int, data: EmpleadoUpdate, db: Session = Depends(get_db)):
    return editar_empleado(db, empleado_id, data)

@router.delete("/{empleado_id}")
def eliminar(empleado_id: int, db: Session = Depends(get_db)):
    return eliminar_empleado(db, empleado_id
