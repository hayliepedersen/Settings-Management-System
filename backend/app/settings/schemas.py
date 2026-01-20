from pydantic import BaseModel, ConfigDict
from typing import Dict, Any, List


class SettingsCreate(BaseModel):
    data: Dict[str, Any]


class SettingsUpdate(BaseModel):
    data: Dict[str, Any]


class SettingsResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)
    
    id: str
    data: Dict[str, Any]


class SettingsList(BaseModel):
    items: List[SettingsResponse]
    total: int
    page: int
    page_size: int