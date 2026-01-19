from sqlalchemy import Column, String, Integer
from sqlalchemy.dialects.postgresql import JSONB
from ..database import Base
import uuid


class Settings(Base):
    __tablename__ = "settings"

    id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    data = Column(JSONB, nullable=False)
