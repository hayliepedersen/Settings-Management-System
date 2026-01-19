from pydantic import BaseModel
from typing import Dict, Any, List


class SettingsCreate(BaseModel):
    data: Dict[str, Any]


class SettingsUpdate(BaseModel):
    data: Dict[str, Any]


class SettingsResponse(BaseModel):
    id: str
    data: Dict[str, Any]

    class Config:
        from_attributes = True


class SettingsList(BaseModel):
    items: List[SettingsResponse]
    total: int
    page: int
    page_size: int
