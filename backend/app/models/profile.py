from sqlalchemy import Column, String, DateTime, Integer, ForeignKey, func, Table
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import relationship
from .base import Base, TimestampMixin
from datetime import datetime

# -----------------------------------------------------------------------------
# 다대다(M:N) 관계: Profile <-> Role
#   1) ondelete='CASCADE': DB 레벨에서 Profile/Role 삭제 시 association row 삭제
#   2) primary_key=True : 두 컬럼 모두 PK로 설정 (1 Profile : 여러 Role 매핑 시 중복 방지)
# -----------------------------------------------------------------------------
profile_roles_association = Table(
    'profile_roles',
    Base.metadata,
    Column(
        'profile_user_id',
        UUID(as_uuid=True),
        ForeignKey('profiles.user_id', ondelete='CASCADE'),
        primary_key=True
    ),
    Column(
        'role_id',
        Integer,
        ForeignKey('roles.id', ondelete='CASCADE'),
        primary_key=True
    )
)

# -----------------------------------------------------------------------------
# Roles Table
# -----------------------------------------------------------------------------
class Role(Base):
    __tablename__ = 'roles'

    id = Column(Integer, primary_key=True, autoincrement=True)
    name = Column(String, unique=True, nullable=False)

    # M:N에서 'delete-orphan'은 비권장
    # passive_deletes=True로 DB ondelete='CASCADE' 신뢰
    profiles = relationship(
        "Profile",
        secondary=profile_roles_association,
        back_populates="roles",
        passive_deletes=True
    )

# -----------------------------------------------------------------------------
# Profiles Table
# -----------------------------------------------------------------------------
class Profile(Base, TimestampMixin):
    __tablename__ = 'profiles'

    user_id = Column(
        UUID(as_uuid=True),
        ForeignKey('users.id', ondelete='CASCADE'),
        primary_key=True
    )
    first_name = Column(String, nullable=True)
    last_name = Column(String, nullable=True)
    avatar_url = Column(String, nullable=True)
    bio = Column(String, nullable=True)
    birth_date = Column(DateTime, nullable=True)

    # 일대일 User 관계 예시. User 모델에서 cascade="all, delete-orphan"을 설정하면
    # User 삭제 시 Profile도 지워집니다.
    user = relationship(
        "User",
        back_populates="profile",
        passive_deletes=True
    )

    roles = relationship(
        "Role",
        secondary=profile_roles_association,
        back_populates="profiles",
        passive_deletes=True
    )
