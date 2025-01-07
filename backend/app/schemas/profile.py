from pydantic import BaseModel
from typing import Optional
from uuid import UUID
from datetime import datetime

# Role Schema
class RoleBase(BaseModel):
    name: str

class RoleCreate(RoleBase):
    pass

class RoleUpdate(RoleBase):
    pass

class Role(RoleBase):
    id: int
    class Config:
        from_attributes = True


# Profile Schema
class ProfileBase(BaseModel):
    role: Optional[str]
    avatar_url: Optional[str]
    bio: Optional[str]
    birth_date: Optional[datetime]

class ProfileCreate(ProfileBase):
    user_id: UUID

class ProfileUpdate(ProfileBase):
    pass

class ProfilePublic(ProfileBase): ## User 모델과 1:1 관계
    id: UUID
    user_id: UUID
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True

class Profile(ProfilePublic):
    pass

