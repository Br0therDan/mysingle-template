from datetime import datetime
from typing import Optional
from pydantic import BaseModel, Field
from uuid import UUID

class ItemBase(BaseModel):  
    title: str
    description: str | None

class ItemCreate(ItemBase):  # 항목 생성시 시 클라이언트로 부터 받을 데이터 속성
    pass

class ItemUpdate(ItemBase):  # 항목 업데이트 시 클라이언트로 부터 받을 데이터 속성
    id: UUID
    title: str | None

class ItemPublic(ItemBase): #  API를 통해 반환할 속성, ID는 항상 필수 (DB스키마와 동일)
    id: UUID
    owner_id: UUID
    created_at: Optional[datetime]
    updated_at: Optional[datetime]
    class Config:
        from_attributes = True

class ItemsPublic(BaseModel):   ## User 모델과 1:N 관계
    data: list[ItemPublic]
    count: int

