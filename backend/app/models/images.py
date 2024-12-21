from sqlalchemy import Column, String, DateTime
from sqlalchemy.sql import func
from ..database import Base

class Image(Base):
    __tablename__ = "images"
    id = Column(String, primary_key=True)
    original_key = Column(String)
    mask_key = Column(String, nullable=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())