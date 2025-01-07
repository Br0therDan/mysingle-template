from pydantic import BaseModel
from typing import Optional, List
from uuid import UUID
from datetime import datetime

# Role Schema
class RoleBase(BaseModel):
    """
    Role 공통 필드 정의
    """
    name: str  # Role 이름

class RoleCreate(RoleBase):
    """
    Role 생성 요청 스키마
    """
    pass

class RoleUpdate(RoleBase):
    """
    Role 수정 요청 스키마
    """
    pass

class Role(RoleBase):
    """
    Role 데이터 응답 스키마
    """
    id: int  # Role ID

    class Config:
        from_attributes = True  # ORM 객체 변환 허용

# Profile Schema
class ProfileBase(BaseModel):
    """
    Profile 공통 필드 정의
    """
    avatar_url: Optional[str]  # 프로필 사진 URL
    bio: Optional[str]  # 사용자 소개
    birth_date: Optional[datetime]  # 생년월일
    roles: Optional[List[Role]] = None  # 역할 목록 (N:M 관계)

class ProfileCreate(ProfileBase):
    """
    Profile 생성 요청 스키마
    """
    user_id: UUID  # 사용자 ID
    role_ids: Optional[List[int]] = None  # 할당할 Role ID 목록

class ProfileUpdate(ProfileBase):
    """
    Profile 수정 요청 스키마
    """
    role_ids: Optional[List[int]] = None  # 업데이트할 Role ID 목록

class ProfilePublic(ProfileBase):
    """
    Profile 공개 데이터 응답 스키마
    """
    id: UUID  # Profile ID
    user_id: UUID  # 사용자 ID
    created_at: datetime  # 생성일
    updated_at: datetime  # 수정일

    class Config:
        from_attributes = True  # ORM 객체 변환 허용

class Profile(ProfilePublic):
    """
    Profile 데이터 상세 응답 스키마
    """
    pass
