from fastapi import APIRouter

from app.api.routes import login, private, users, utils, items, profile
from app.core.config import settings


api_router = APIRouter()
api_router.include_router(login.router, prefix="/login", tags=["Login"])
api_router.include_router(users.router, prefix="/users", tags=["Users"])
api_router.include_router(profile.router, prefix="/profile", tags=["Profile"])
api_router.include_router(utils.router, prefix="/utils", tags=["Utils"])
api_router.include_router(items.router, prefix="/items", tags=["Items"])

if settings.ENVIRONMENT == "local":
    api_router.include_router(private.router, prefix="/items", tags=["Items"])