from typing import Any, List
from uuid import UUID
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session, joinedload
from app.api.deps import SessionDep, get_current_active_superuser, get_current_user
from app.core.security import verify_password
from app.schemas.user import (
    UserCreate,
    UserRegister,
    UserUpdate,
    UserPublic,
    UsersPublic,
    UpdatePassword,
)
from app.schemas.profile import (
    ProfileCreate,
    ProfileUpdate,
    ProfilePublic
)
from app.schemas.profile import Role
from app.schemas.token import Message
from app.crud.user import crud_user
from app.crud.profile import crud_profile
from app.crud.profile import crud_role
from app.models.user import User

router = APIRouter()

# Users Endpoints
@router.get("/", dependencies=[Depends(get_current_active_superuser)], response_model=UsersPublic)
def read_users(
    db: SessionDep,
    skip: int = 0,
    limit: int = 100
) -> UsersPublic:
    """
    [관리자 전용] 모든 사용자 목록을 조회
    """
    users = crud_user.get_multi(db=db, skip=skip, limit=limit)
    count = len(users)
    user_list = [UserPublic.model_validate(u) for u in users]
    return UsersPublic(data=user_list, count=count)


@router.get("/me", response_model=UserPublic)
def read_user_me(
    db: SessionDep,
    current_user: User = Depends(get_current_user)
) -> UserPublic:
    """
    현재 로그인한 사용자 본인 정보 조회 (Profile, Items 등 연관 관계 로딩)
    """
    user_orm = (
        db.query(User)
        .options(joinedload(User.profile))
        .filter(User.id == current_user.id)
        .first()
    )
    if not user_orm:
        raise HTTPException(status_code=404, detail="User not found")
    return UserPublic.model_validate(user_orm)


@router.delete("/me", response_model=Message)
def delete_user_me(
    db: SessionDep,
    current_user: User = Depends(get_current_user)
) -> Any:
    """
    현재 로그인한 사용자 본인 계정 삭제
    """
    if current_user.is_superuser:
        raise HTTPException(
            status_code=403,
            detail="Super users are not allowed to delete themselves"
        )

    deleted_user = crud_user.remove_with_items(db=db, user_id=current_user.id)
    if not deleted_user:
        raise HTTPException(status_code=404, detail="User not found")

    return Message(message="User deleted successfully")


@router.patch("/me/password", response_model=Message)
def update_password_me(
    db: SessionDep,
    body: UpdatePassword,
    current_user: User = Depends(get_current_user)
) -> Any:
    """
    현재 로그인한 사용자의 비밀번호 변경
    """
    if not verify_password(body.current_password, current_user.hashed_password):
        raise HTTPException(status_code=400, detail="Incorrect password")
    if body.current_password == body.new_password:
        raise HTTPException(
            status_code=400,
            detail="New password cannot be the same as current password"
        )

    crud_user.update_user(
        db=db,
        db_obj=current_user,
        obj_in=UserUpdate(password=body.new_password)
    )
    return Message(message="Password updated successfully")


@router.get("/{user_id}", response_model=UserPublic)
def read_user_by_id(
    user_id: UUID,
    db: SessionDep,
    current_user: User = Depends(get_current_user)
) -> Any:
    """
    특정 사용자 정보 조회
    """
    db_user = crud_user.get_with_relations(db=db, user_id=user_id)
    if not db_user:
        raise HTTPException(status_code=404, detail="User not found")

    if (db_user.id != current_user.id) and (not current_user.is_superuser):
        raise HTTPException(status_code=403, detail="Not enough privileges")

    return UserPublic.model_validate(db_user)


@router.post("/", response_model=UserPublic, dependencies=[Depends(get_current_active_superuser)])
def create_user(
    db: SessionDep,
    user_in: UserCreate
) -> Any:
    """
    [관리자 전용] 새 사용자 생성
    """
    existing_user = crud_user.get_user_by_email(db=db, email=user_in.email)
    if existing_user:
        raise HTTPException(
            status_code=400,
            detail="The user with this email already exists",
        )

    user = crud_user.create_user(db=db, obj_in=user_in)
    return UserPublic.model_validate(user)


@router.patch("/{user_id}", response_model=UserPublic, dependencies=[Depends(get_current_active_superuser)])
def update_user(
    user_id: UUID,
    user_in: UserUpdate,
    db: SessionDep
) -> Any:
    """
    [관리자 전용] 특정 사용자 정보 업데이트
    """
    db_user = crud_user.get(db=db, id=user_id)
    if not db_user:
        raise HTTPException(
            status_code=404,
            detail="The user with this id does not exist in the system"
        )

    if user_in.email:
        exist_user_email = crud_user.get_user_by_email(db=db, email=user_in.email)
        if exist_user_email and exist_user_email.id != user_id:
            raise HTTPException(
                status_code=409,
                detail="User with this email already exists",
            )

    updated_user = crud_user.update_user(db=db, db_obj=db_user, obj_in=user_in)
    return UserPublic.model_validate(updated_user)


@router.delete("/{user_id}", dependencies=[Depends(get_current_active_superuser)])
def delete_user(
    user_id: UUID,
    db: SessionDep,
    current_user: User = Depends(get_current_user),
) -> Message:
    """
    [관리자 전용] 특정 사용자 삭제
    """
    db_user = crud_user.get(db=db, id=user_id)
    if not db_user:
        raise HTTPException(status_code=404, detail="User not found")

    if db_user.id == current_user.id:
        raise HTTPException(
            status_code=403,
            detail="Super users are not allowed to delete themselves"
        )

    deleted_user = crud_user.remove_with_items(db=db, user_id=user_id)
    if not deleted_user:
        raise HTTPException(status_code=404, detail="User not found")

    return Message(message="User deleted successfully")


@router.post("/signup", response_model=UserPublic)
def register_user(
    db: SessionDep,
    user_in: UserRegister
) -> Any:
    """
    누구나 접근 가능한 회원가입 엔드포인트
    """
    existing_user = crud_user.get_user_by_email(db=db, email=user_in.email)
    if existing_user:
        raise HTTPException(
            status_code=400,
            detail="The user with this email already exists",
        )

    user_create = user_in.to_user_create()
    user = crud_user.create_user(db=db, obj_in=user_create)

    return UserPublic.model_validate(user)

# Profiles Endpoints
@router.get("/{user_id}/profiles/{profile_id}", response_model=ProfilePublic)
def read_profile(
    user_id: UUID,
    profile_id: UUID,
    db: SessionDep,
    current_user: User = Depends(get_current_user),
) -> Any:
    """
    특정 사용자와 Profile 조회
    """
    db_profile = crud_profile.get(db=db, id=profile_id)
    if not db_profile or db_profile.user_id != user_id:
        raise HTTPException(status_code=404, detail="Profile not found")

    return db_profile


@router.post("/{user_id}/profiles", response_model=ProfilePublic)
def create_profile(
    user_id: UUID,
    profile_in: ProfileCreate,
    db: SessionDep,
    current_user: User = Depends(get_current_user),
) -> Any:
    """
    특정 사용자에 Profile 생성
    """
    if (not current_user.is_superuser) and (user_id != current_user.id):
        raise HTTPException(status_code=403, detail="Cannot create a profile for another user")

    existing_profile = crud_profile.get_by_user_id(db=db, user_id=user_id)
    if existing_profile:
        raise HTTPException(status_code=400, detail="Profile already exists for this user")

    profile_in.user_id = user_id
    new_profile = crud_profile.create(db=db, obj_in=profile_in)

    if profile_in.role_ids:
        roles = crud_role.get_multi_by_ids(db=db, ids=profile_in.role_ids)
        if not roles:
            raise HTTPException(status_code=400, detail="Invalid role IDs provided")
        crud_profile.assign_roles(db=db, profile=new_profile, roles=roles)

    return new_profile


@router.patch("/{user_id}/profiles/{profile_id}", response_model=ProfilePublic)
def update_profile(
    user_id: UUID,
    profile_id: UUID,
    profile_in: ProfileUpdate,
    db: SessionDep,
    current_user: User = Depends(get_current_user),
) -> Any:
    """
    특정 사용자와 Profile 수정
    """
    db_profile = crud_profile.get(db=db, id=profile_id)
    if not db_profile or db_profile.user_id != user_id:
        raise HTTPException(status_code=404, detail="Profile not found")

    if (db_profile.user_id != current_user.id) and (not current_user.is_superuser):
        raise HTTPException(status_code=403, detail="Not enough privileges to update this profile")

    updated_profile = crud_profile.update(db=db, db_obj=db_profile, obj_in=profile_in)

    if profile_in.role_ids is not None:
        roles = crud_role.get_multi_by_ids(db=db, ids=profile_in.role_ids)
        if not roles:
            raise HTTPException(status_code=400, detail="Invalid role IDs provided")
        crud_profile.update_roles(db=db, profile=updated_profile, roles=roles)

    return updated_profile


@router.post("/{user_id}/profiles/{profile_id}/roles", response_model=ProfilePublic)
def add_roles_to_profile(
    user_id: UUID,
    profile_id: UUID,
    role_ids: List[int],
    db: SessionDep,
    current_user: User = Depends(get_current_user),
) -> Any:
    """
    특정 Profile에 Role 추가
    """
    db_profile = crud_profile.get(db=db, id=profile_id)
    if not db_profile or db_profile.user_id != user_id:
        raise HTTPException(status_code=404, detail="Profile not found")

    if (db_profile.user_id != current_user.id) and (not current_user.is_superuser):
        raise HTTPException(status_code=403, detail="Not enough privileges to add roles to this profile")

    roles = crud_role.get_multi_by_ids(db=db, ids=role_ids)
    if not roles:
        raise HTTPException(status_code=400, detail="Invalid role IDs provided")

    crud_profile.add_roles(db=db, profile=db_profile, roles=roles)
    return db_profile


@router.delete("/{user_id}/profiles/{profile_id}/roles", response_model=ProfilePublic)
def remove_roles_from_profile(
    user_id: UUID,
    profile_id: UUID,
    role_ids: List[int],
    db: SessionDep,
    current_user: User = Depends(get_current_user),
) -> Any:
    """
    특정 Profile에서 Role 제거
    """
    db_profile = crud_profile.get(db=db, id=profile_id)
    if not db_profile or db_profile.user_id != user_id:
        raise HTTPException(status_code=404, detail="Profile not found")

    if (db_profile.user_id != current_user.id) and (not current_user.is_superuser):
        raise HTTPException(status_code=403, detail="Not enough privileges to remove roles from this profile")

    roles = crud_role.get_multi_by_ids(db=db, ids=role_ids)
    if not roles:
        raise HTTPException(status_code=400, detail="Invalid role IDs provided")

    crud_profile.remove_roles(db=db, profile=db_profile, roles=roles)
    return db_profile

