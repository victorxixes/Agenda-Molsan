from pydantic import BaseModel
from typing import List, Dict, Optional

class LoginRequest(BaseModel):
    usuario: str
    password: str

class LoginEmpleadoResponse(BaseModel):
    empleado_id: int
    nombre: str
    foto: Optional[str] = None

    rol_id: Optional[int] = None
    rol_nombre: Optional[str] = None

    modulos_visibles: List[str]
    permisos_modulo: Dict[str, List[str]]

    token: str

    class Config:
        orm_mode = True
