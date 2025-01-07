from sqlalchemy import Column, String, DateTime,  Integer, ForeignKey, func
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import relationship
from .base import Base
import uuid
from datetime import datetime

# Roles Table
class Role(Base):
    __tablename__ = 'roles'

    id = Column(Integer, primary_key=True, autoincrement=True)
    name = Column(String, unique=True, nullable=False)

# Profiles Table
class Profile(Base):
    __tablename__ = 'profiles'

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    user_id = Column(UUID(as_uuid=True), ForeignKey('users.id'), nullable=False, unique=True)
    role = Column(String, nullable=True)
    avatar_url = Column(String, nullable=True)  # 프로필 사진 URL
    bio = Column(String, nullable=True)  # 사용자 소개
    birth_date = Column(DateTime, nullable=True)  # 생년월일
    created_at = Column(DateTime, server_default=func.now(), nullable=False)
    updated_at = Column(DateTime, server_default=func.now(), onupdate=func.now(), nullable=False)


    user = relationship("User", back_populates="profile")

