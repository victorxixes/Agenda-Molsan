from pydantic import BaseModel

class NotariaBase(BaseModel):
    codigo: str | None = None
    nombre: str | None = None
    apellidos: str | None = None
    nif: str | None = None
    telefono: str | None = None

    departamento_cancelaciones: str | None = None
    departamento_copias: str | None = None
    otros_departamentos: str | None = None

    cp: str | None = None
    provincia: str | None = None
    municipio: str | None = None

    vc: str | None = None

    apoderado: str | None = None
    apoderado_s: str | None = None

    observacion: str | None = None


class NotariaCreate(NotariaBase):
    pass


class NotariaResponse(NotariaBase):
    id: int

    model_config = {
        "from_attributes": True
    }
