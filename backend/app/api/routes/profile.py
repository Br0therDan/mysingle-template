# path: app/api/endpoints/profiles.py

from typing import Any
from uuid import UUID

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

# JWT 인증/인가
from app.api.deps import get_current_user, SessionDep
from app.models.user import User

from app.crud.profile import crud_profile
from app.schemas.profile import (
    ProfileCreate,
    ProfileUpdate,
    ProfilePublic
)

router = APIRouter()

@router.get("/{profile_id}", response_model=ProfilePublic)
def read_profile(
    profile_id: UUID,
    db: SessionDep,
    current_user: User = Depends(get_current_user),
) -> Any:
    """
    특정 profile_id로 Profile 조회
    """
    db_profile = crud_profile.get(db=session, id=profile_id)
    if not db_profile:
        raise HTTPException(status_code=404, detail="Profile not found")
    return db_profile


@router.post("/", response_model=ProfilePublic)
def create_profile(
    profile_in: ProfileCreate,
    db: SessionDep,
    current_user: User = Depends(get_current_user),
) -> Any:
    """
    Profile 생성 (기본적으로 user_id와 1:1)
    - 일반 사용자: 자기 user_id로만 Profile 생성 가능
    - 슈퍼유저: 원하는 user_id로 Profile 생성 가능
    """
    # 일반사용자는 자기 user_id만 허용
    if (not current_user.is_superuser) and (profile_in.user_id != current_user.id):
        raise HTTPException(status_code=403, detail="Cannot create a profile for another user")

    # 이미 프로필이 있는지 중복 체크
    existing_profile = crud_profile.get_by_user_id(db=session, user_id=profile_in.user_id)
    if existing_profile:
        raise HTTPException(status_code=400, detail="Profile already exists for this user")

    new_profile = crud_profile.create(db=session, obj_in=profile_in)
    return new_profile


@router.patch("/{profile_id}", response_model=ProfilePublic)
def update_profile(
    profile_id: UUID,
    profile_in: ProfileUpdate,
    db: SessionDep,
    current_user: User = Depends(get_current_user),
) -> Any:
    """
    Profile 수정
    - 일반 사용자: 자기 자신의 프로필만 수정
    - 슈퍼유저: 다른 사람 프로필도 수정 가능
    """
    db_profile = crud_profile.get(db=session, id=profile_id)
    if not db_profile:
        raise HTTPException(status_code=404, detail="Profile not found")

    # 권한 로직
    if (db_profile.user_id != current_user.id) and (not current_user.is_superuser):
        raise HTTPException(status_code=403, detail="Not enough privileges to update this profile")

    updated_profile = crud_profile.update(db=session, db_obj=db_profile, obj_in=profile_in)
    return updated_profile


@router.delete("/{profile_id}")
def delete_profile(
    profile_id: UUID,
    db: SessionDep,
    current_user: User = Depends(get_current_user),
) -> Any:
    """
    Profile 삭제
    - 일반 사용자: 자기 자신의 프로필만 삭제
    - 슈퍼유저: 다른 사람 프로필도 삭제 가능
    """
    db_profile = crud_profile.get(db=session, id=profile_id)
    if not db_profile:
        raise HTTPException(status_code=404, detail="Profile not found")

    # 권한 로직
    if (db_profile.user_id != current_user.id) and (not current_user.is_superuser):
        raise HTTPException(status_code=403, detail="Not enough privileges to delete this profile")

    crud_profile.remove(db=session, id=profile_id)
    return {"message": "Profile deleted successfully"}
