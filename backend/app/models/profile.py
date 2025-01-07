from sqlalchemy import Column, String, DateTime, Integer, ForeignKey, func, Table
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import relationship
from .base import Base
import uuid
from datetime import datetime

# Association table for many-to-many relationship between Roles and Profiles
profile_roles_association = Table(
    'profile_roles',
    Base.metadata,
    Column('profile_id', UUID(as_uuid=True), ForeignKey('profiles.id', ondelete='CASCADE'), primary_key=True),
    Column('role_id', Integer, ForeignKey('roles.id', ondelete='CASCADE'), primary_key=True)
)

# Roles Table
class Role(Base):
    __tablename__ = 'roles'

    id = Column(Integer, primary_key=True, autoincrement=True)
    name = Column(String, unique=True, nullable=False)

    profiles = relationship(
        "Profile",
        secondary=profile_roles_association,
        back_populates="roles"
    )

# Profiles Table
class Profile(Base):
    __tablename__ = 'profiles'

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    user_id = Column(UUID(as_uuid=True), ForeignKey('users.id', ondelete='CASCADE'), nullable=False, unique=True)
    avatar_url = Column(String, nullable=True)  # Profile picture URL
    bio = Column(String, nullable=True)  # User bio
    birth_date = Column(DateTime, nullable=True)  # Date of birth
    created_at = Column(DateTime, server_default=func.now(), nullable=False)
    updated_at = Column(DateTime, server_default=func.now(), onupdate=func.now(), nullable=False)

    user = relationship("User", back_populates="profile")
    roles = relationship(
        "Role",
        secondary=profile_roles_association,
        back_populates="profiles"
    )
