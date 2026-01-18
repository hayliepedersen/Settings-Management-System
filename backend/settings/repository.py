from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, func
from .models import Settings
from typing import Optional


class SettingsRepository:
    def __init__(self, session: AsyncSession):
        self.session = session

    async def create(self, data: dict) -> Settings:
        """Create a new settings object"""
        settings = Settings(data=data)
        self.session.add(settings)
        await self.session.commit()
        await self.session.refresh(settings)
        return settings

    async def get_by_id(self, uid: str) -> Optional[Settings]:
        """Get settings by ID"""
        result = await self.session.execute(
            select(Settings).where(Settings.id == uid)
        )
        return result.scalar_one_or_none()

    async def list_all(self, skip: int = 0, limit: int = 10) -> tuple[list[Settings], int]:
        """Get paginated list of all settings"""
        # Get items
        result = await self.session.execute(
            select(Settings).offset(skip).limit(limit)
        )
        items = result.scalars().all()
        
        # Get total count
        count_result = await self.session.execute(select(func.count(Settings.id)))
        total = count_result.scalar_one()
        
        return list(items), total

    async def update(self, uid: str, data: dict) -> Optional[Settings]:
        """Update settings by ID"""
        settings = await self.get_by_id(uid)
        if not settings:
            return None
        
        settings.data = data
        await self.session.commit()
        await self.session.refresh(settings)
        return settings

    async def delete(self, uid: str) -> bool:
        """Delete settings by ID (idempotent)"""
        settings = await self.get_by_id(uid)
        if settings:
            await self.session.delete(settings)
            await self.session.commit()
            return True
        return False