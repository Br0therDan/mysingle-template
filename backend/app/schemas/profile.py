from pydantic import BaseModel
from typing import Optional, List
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
    avatar_url: Optional[str]
    bio: Optional[str]
    birth_date: Optional[datetime]
    roles: Optional[List[Role]]  # Many-to-many relationship with roles

class ProfileCreate(ProfileBase):
    user_id: UUID
    role_ids: Optional[List[int]]  # List of role IDs to assign

class ProfileUpdate(ProfileBase):
    role_ids: Optional[List[int]]  # List of role IDs to update

class ProfilePublic(ProfileBase):
    id: UUID
    user_id: UUID
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True

class Profile(ProfilePublic):
    pass
