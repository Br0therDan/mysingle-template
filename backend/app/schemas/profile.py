from typing import Optional, List
from uuid import UUID
from datetime import datetime
from pydantic import BaseModel

# ---------------------------------------
# Role Schema
# ---------------------------------------
class RoleBase(BaseModel):
    name: str  # Role 이름

class RoleCreate(RoleBase):
    pass

class RoleUpdate(RoleBase):
    pass

class Role(RoleBase):
    id: int  # Role ID

    class Config:
        from_attributes = True

# ---------------------------------------
# Profile Schema
# ---------------------------------------
class ProfileBase(BaseModel):
    """
    Profile 공통 필드 정의
    """
    first_name: Optional[str] = None
    last_name: Optional[str] = None
    avatar_url: Optional[str] = None
    bio: Optional[str] = None
    birth_date: Optional[datetime] = None

    # ✅ 기본값을 빈 리스트로
    # None으로 들어와도 자동으로 빈 리스트 처리 가능
    roles: List[Role] = []

class ProfileCreate(ProfileBase):
    user_id: UUID  # 사용자 ID

    # ✅ 기본값을 빈 리스트로
    role_ids: List[int] = []

class ProfileUpdate(ProfileBase):
    # ✅ 기본값을 빈 리스트로
    role_ids: List[int] = []

class ProfilePublic(ProfileBase):
    user_id: UUID
    created_at: Optional[datetime] = None
    updated_at: Optional[datetime] = None

    class Config:
        from_attributes = True

class Profile(ProfilePublic):
    pass
