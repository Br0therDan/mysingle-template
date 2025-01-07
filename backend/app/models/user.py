# models/user.py
from sqlalchemy import Column, String, Boolean, DateTime, func
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import relationship
import uuid

from .base import Base

class User(Base):
    __tablename__ = 'users'

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    full_name = Column(String, nullable=False)
    email = Column(String, nullable=False, unique=True)
    hashed_password = Column(String, nullable=False)
    is_active = Column(Boolean, nullable=True)
    is_superuser = Column(Boolean, nullable=False)

    created_at = Column(DateTime, server_default=func.now(), nullable=True)
    updated_at = Column(DateTime, server_default=func.now(), onupdate=func.now(), nullable=True)

    # 1:1 관계이므로 uselist=False
    # cascade="all, delete-orphan"와 passive_deletes=True 설정
    profile = relationship(
        "Profile",
        back_populates="user",
        cascade="all, delete-orphan",
        uselist=False,
        passive_deletes=True
    )

    items = relationship(
        "Item",
        back_populates="owner",
        cascade="all, delete-orphan",
        passive_deletes=True
    )
