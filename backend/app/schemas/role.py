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

class RolePublic(RoleBase):
    id: int  # Role ID

    class Config:
        from_attributes = True

class RolesPublic(BaseModel):
    data: list[RolePublic]  # Role ID
    count: int