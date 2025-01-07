from typing import List
from uuid import UUID
from fastapi import APIRouter, Depends, HTTPException
from app.api.deps import SessionDep, get_current_active_superuser, get_current_user
from app.schemas.profile import (
    ProfileCreate,
    ProfileUpdate,
    ProfilePublic,
    Role,
    RoleCreate,
    RoleUpdate
)
from app.schemas.token import Message
from app.crud.profile import crud_profile, crud_role
from app.models.user import User

router = APIRouter()

#
# ===================================================================
# 1) Roles 관련 API (관리자 전용)
#   - 먼저 선언하여, "/roles" 경로 충돌을 예방
# ===================================================================
#

@router.get("/roles", response_model=List[Role], dependencies=[Depends(get_current_active_superuser)])
def read_roles(
    db: SessionDep,
    skip: int = 0,
    limit: int = 100,
    current_user: User = Depends(get_current_active_superuser),
) -> List[Role]:
    """
    [관리자 전용] Role 목록 조회
    """
    roles = crud_role.get_multi(db=db, skip=skip, limit=limit)
    return roles


@router.get("/roles/{role_id}", response_model=Role, dependencies=[Depends(get_current_active_superuser)])
def read_role_by_id(
    role_id: int,
    db: SessionDep,
    current_user: User = Depends(get_current_active_superuser),
) -> Role:
    """
    [관리자 전용] 특정 Role 정보 조회
    """
    role = crud_role.get(db=db, id=role_id)
    if not role:
        raise HTTPException(status_code=404, detail="Role not found")
    return role


@router.post("/roles", response_model=Role, dependencies=[Depends(get_current_active_superuser)])
def create_role(
    role_in: RoleCreate,
    db: SessionDep,
    current_user: User = Depends(get_current_active_superuser),
) -> Role:
    """
    [관리자 전용] Role 생성
    """
    # Role 이름 중복 체크 등을 여기에 추가할 수도 있음
    role = crud_role.create(db=db, obj_in=role_in)
    return role


@router.patch("/roles/{role_id}", response_model=Role, dependencies=[Depends(get_current_active_superuser)])
def update_role(
    role_id: int,
    role_in: RoleUpdate,
    db: SessionDep,
    current_user: User = Depends(get_current_active_superuser),
) -> Role:
    """
    [관리자 전용] Role 정보 수정
    """
    db_role = crud_role.get(db=db, id=role_id)
    if not db_role:
        raise HTTPException(status_code=404, detail="Role not found")
    updated_role = crud_role.update(db=db, db_obj=db_role, obj_in=role_in)
    return updated_role


@router.delete("/roles/{role_id}", response_model=Message, dependencies=[Depends(get_current_active_superuser)])
def delete_role(
    role_id: int,
    db: SessionDep,
    current_user: User = Depends(get_current_active_superuser),
) -> Message:
    """
    [관리자 전용] Role 삭제
    """
    db_role = crud_role.get(db=db, id=role_id)
    if not db_role:
        raise HTTPException(status_code=404, detail="Role not found")

    # 삭제 시 관련 Profile-Role 관계도 함께 제거되도록
    # Role 모델과 Profile 모델의 many-to-many relationship에
    # cascade="all, delete-orphan" 설정이 되어 있다면 같이 삭제됨
    crud_role.remove(db=db, id=role_id)
    return Message(message="Role deleted successfully")

#
# ===================================================================
# 2) Profile 관련 API
# ===================================================================
#

@router.get("/{user_id}", response_model=ProfilePublic)
def read_profile(
    user_id: UUID,
    db: SessionDep,
    current_user: User = Depends(get_current_user),
) -> ProfilePublic:
    """
    특정 사용자와 Profile 조회
    """
    profile = crud_profile.get_by_user_id(db=db, user_id=user_id)
    if not profile:
        raise HTTPException(status_code=404, detail="Profile not found")
    return ProfilePublic.model_validate(profile)


@router.post("/{user_id}", response_model=ProfilePublic)
def create_profile(
    user_id: UUID,
    profile_in: ProfileCreate,
    db: SessionDep,
    current_user: User = Depends(get_current_user),
) -> ProfilePublic:
    """
    특정 사용자에 Profile 생성
    (이미 자동생성이 이뤄지는 구조라면 잘 쓰이지 않을 수 있음)
    """
    if (not current_user.is_superuser) and (user_id != current_user.id):
        raise HTTPException(status_code=403, detail="Cannot create a profile for another user")
    if crud_profile.get_by_user_id(db=db, user_id=user_id):
        raise HTTPException(status_code=400, detail="Profile already exists for this user")

    profile_in.user_id = user_id
    profile = crud_profile.create(db=db, obj_in=profile_in)

    if profile_in.role_ids:
        roles = crud_role.get_multi_by_ids(db=db, ids=profile_in.role_ids)
        if not roles:
            raise HTTPException(status_code=400, detail="Invalid role IDs provided")
        crud_profile.assign_roles(db=db, profile=profile, roles=roles)

    return ProfilePublic.model_validate(profile)


@router.patch("/{user_id}", response_model=ProfilePublic)
def update_profile(
    user_id: UUID,
    profile_in: ProfileUpdate,
    db: SessionDep,
    current_user: User = Depends(get_current_user),
) -> ProfilePublic:
    """
    특정 사용자 Profile 수정 (role_ids 포함)
    """
    profile = crud_profile.get_by_user_id(db=db, user_id=user_id)
    if not profile:
        raise HTTPException(status_code=404, detail="Profile not found")

    # 권한 체크
    if (profile.user_id != current_user.id) and (not current_user.is_superuser):
        raise HTTPException(status_code=403, detail="Not enough privileges")

    try:
        updated_profile = crud_profile.update_profile(
            db=db,
            db_obj=profile,
            obj_in=profile_in
        )
    except ValueError as ve:
        # 예: "Invalid role IDs provided" 등
        raise HTTPException(status_code=400, detail=str(ve))

    return ProfilePublic.model_validate(updated_profile)
