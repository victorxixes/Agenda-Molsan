from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from backend.app.database import get_db
from backend.app.dashboard.service import obtener_dashboard
from backend.app.dashboard.schemas import DashboardResponse

router = APIRouter(prefix="/dashboard", tags=["Dashboard"])

@router.get("/", response_model=DashboardResponse)
def dashboard(db: Session = Depends(get_db)):
    return obtener_dashboard(db)
