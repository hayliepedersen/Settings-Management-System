from sqlalchemy.ext.asyncio import AsyncSession
from fastapi import Depends
from .service import SettingsService
from ..database import get_db


async def get_settings_service(
    session: AsyncSession = Depends(get_db),
) -> SettingsService:
    return SettingsService(session)
