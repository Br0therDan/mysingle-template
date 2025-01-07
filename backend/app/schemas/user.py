from pydantic import BaseModel, EmailStr, Field
from typing import Optional
from uuid import UUID
from datetime import datetime
from app.schemas.item import ItemPublic
from app.schemas.profile import ProfilePublic

class UserBase(BaseModel):
    """
    User 공통 필드
    """
    email: EmailStr = Field(unique=True, index=True, max_length=255)
    is_active: bool = True
    is_superuser: bool = False
    full_name: Optional[str] = Field(default=None, max_length=255)

class UserCreate(UserBase):
    """
    회원 생성 시 클라이언트로부터 받는 데이터
    """
    password: str = Field(min_length=8, max_length=40)

class UserRegister(BaseModel):
    """
    공용 회원가입 스키마
    """
    email: EmailStr
    password: str
    full_name: Optional[str] = None

    def to_user_create(self) -> "UserCreate":
        """
        UserRegister -> UserCreate 변환 헬퍼
        """
        return UserCreate(
            email=self.email,
            password=self.password,
            full_name=self.full_name,
        )

class UserUpdate(UserBase):
    """
    관리자(또는 권한 있는 사용자)가
    다른 유저 정보를 업데이트할 때 사용
    """
    email: Optional[EmailStr] = Field(default=None, max_length=255)  # type: ignore
    password: Optional[str] = Field(default=None, min_length=8, max_length=40)


class UserUpdateMe(BaseModel):
    """
    비밀번호 변경용 스키마
    """
    current_password: str = Field(min_length=8, max_length=40)
    new_password: str = Field(min_length=8, max_length=40)

class UpdatePassword(BaseModel):
    """
    비밀번호 변경용 스키마
    """
    current_password: str = Field(min_length=8, max_length=40)
    new_password: str = Field(min_length=8, max_length=40)


class User(UserBase):
    """
    DB에서 읽어온 User ORM 객체를 표현하는 데 사용.
    내부적으로 hashed_password, items, profile 등
    1:N, 1:1 관계를 함께 포함할 수 있음.
    """
    id: UUID
    hashed_password: str
    created_at: datetime
    updated_at: datetime

    # 연관 관계
    items: Optional[list[ItemPublic]] = None
    profile: Optional[ProfilePublic] = None

    # Pydantic v2: ORM 객체 변환 허용
    class Config:
        from_attributes = True
        arbitrary_types_allowed = True

class UserPublic(UserBase):
    """
    API 응답용 (public) 스키마
    id, created_at, updated_at 등을 노출.
    """
    id: UUID
    created_at: datetime
    updated_at: Optional[datetime] = None  # None 허용

    # 연관 관계
    items: Optional[list[ItemPublic]] = None
    profile: Optional[ProfilePublic] = None
    
    # UserPublic도 ORM 변환 허용
    class Config:
        from_attributes = True
        arbitrary_types_allowed = True


# ------------------------------------------------------------------------------
# UsersPublic
# ------------------------------------------------------------------------------
class UsersPublic(BaseModel):
    """
    다수의 UserPublic와 총 개수를 담는 응답형 스키마
    """
    data: list[UserPublic]
    count: int
