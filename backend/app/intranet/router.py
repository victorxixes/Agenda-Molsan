from fastapi import APIRouter
from app.intranet.noticias.router import router as noticias_router
from app.intranet.documentos.router import router as documentos_router

router = APIRouter(prefix="/intranet", tags=["Intranet"])

router.include_router(noticias_router)
router.include_router(documentos_router)
