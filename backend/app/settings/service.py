from sqlalchemy.ext.asyncio import AsyncSession
from .repository import SettingsRepository
from .schemas import SettingsCreate, SettingsUpdate, SettingsResponse, SettingsList
from typing import Optional


class SettingsService:
    def __init__(self, session: AsyncSession):
        self.repository = SettingsRepository(session)

    async def create_settings(self, settings: SettingsCreate) -> SettingsResponse:
        """Create a new settings object"""
        db_settings = await self.repository.create(settings.data)
        return SettingsResponse(id=db_settings.id, data=db_settings.data)

    async def get_all_settings(self, page: int = 1, page_size: int = 10) -> SettingsList:
        """Get paginated list of all settings"""
        skip = (page - 1) * page_size
        items, total = await self.repository.list_all(skip=skip, limit=page_size)
        
        return SettingsList(
            items=[SettingsResponse(id=s.id, data=s.data) for s in items],
            total=total,
            page=page,
            page_size=page_size
        )

    async def get_settings_by_id(self, uid: str) -> Optional[SettingsResponse]:
        """Get settings by ID"""
        settings = await self.repository.get_by_id(uid)
        if not settings:
            return None
        return SettingsResponse(id=settings.id, data=settings.data)

    async def update_settings(self, uid: str, settings: SettingsUpdate) -> Optional[SettingsResponse]:
        """Update settings by ID"""
        updated = await self.repository.update(uid, settings.data)
        if not updated:
            return None
        return SettingsResponse(id=updated.id, data=updated.data)

    async def delete_settings(self, uid: str) -> bool:
        """Delete settings by ID"""
        return await self.repository.delete(uid)