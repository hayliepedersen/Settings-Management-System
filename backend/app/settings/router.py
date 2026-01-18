from fastapi import APIRouter, Depends, HTTPException, status
from .dependencies import get_settings_service
from .schemas import SettingsCreate, SettingsUpdate, SettingsResponse, SettingsList
from .service import SettingsService


def settings_router() -> APIRouter:
    router = APIRouter(prefix="/settings", tags=["Settings"])

    @router.post("", response_model=SettingsResponse, status_code=status.HTTP_201_CREATED)
    async def create_settings(
        settings: SettingsCreate,
        settings_service: SettingsService = Depends(get_settings_service),
    ):
        """Create a new settings object with a unique ID."""
        return await settings_service.create_settings(settings)

    @router.get("", response_model=SettingsList)
    async def get_all_settings(
        page: int = 1,
        page_size: int = 10,
        settings_service: SettingsService = Depends(get_settings_service),
    ):
        """Returns a paged list of all Settings objects."""
        return await settings_service.get_all_settings(page=page, page_size=page_size)

    @router.get("/{uid}", response_model=SettingsResponse)
    async def get_settings(
        uid: str,
        settings_service: SettingsService = Depends(get_settings_service),
    ):
        """Returns the specific object matching the ID."""
        settings = await settings_service.get_settings_by_id(uid)
        if not settings:
            raise HTTPException(status_code=404, detail="Settings not found")
        return settings

    @router.put("/{uid}", response_model=SettingsResponse)
    async def update_settings(
        uid: str,
        settings: SettingsUpdate,
        settings_service: SettingsService = Depends(get_settings_service),
    ):
        """Entirely replaces the object at the specified ID with the new payload."""
        updated = await settings_service.update_settings(uid, settings)
        if not updated:
            raise HTTPException(status_code=404, detail="Settings not found")
        return updated

    @router.delete("/{uid}", status_code=status.HTTP_204_NO_CONTENT)
    async def delete_settings(
        uid: str,
        settings_service: SettingsService = Depends(get_settings_service),
    ):
        """Removes the settings object."""
        await settings_service.delete_settings(uid)
        return None

    return router