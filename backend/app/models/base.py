
from sqlalchemy import Column, DateTime, func
from sqlalchemy.dialects.postgresql import UUID
import uuid
from sqlalchemy.ext.declarative import declared_attr
from app.database.base import Base  # 프로젝트 전반에서 사용하는 단일 Base를 가져옵니다.

class TimestampMixin:
    created_at = Column(DateTime, default=func.now(), nullable=False)
    updated_at = Column(DateTime, default=func.now(), onupdate=func.now(), nullable=False)

class BaseModel:
    """공통 필드를 포함하는 추상화된 베이스 모델."""
    __abstract__ = True
