from fastapi import Depends, HTTPException
from fastapi.security import OAuth2PasswordBearer
import jwt

SECRET = "SUPER_SECRETO_CAMBIAR"
ALGORITHM = "HS256"

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/auth/login")

def obtener_usuario_actual(token: str = Depends(oauth2_scheme)):
    try:
        payload = jwt.decode(token, SECRET, algorithms=[ALGORITHM])
        return {
            "id": payload["sub"],
            "rol": payload["rol"],
            "permisos": payload["permisos"]
        }
    except:
        raise HTTPException(status_code=401, detail="Token inválido o expirado")
