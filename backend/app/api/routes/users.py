from typing import Any, Optional
from uuid import UUID

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session, joinedload

# 의존성 주입 관련 예시 (프로젝트 구조에 맞게 import)
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
from app.schemas.token import Message
from app.crud.user import crud_user
from app.models.user import User

router = APIRouter()

@router.get("/", dependencies=[Depends(get_current_active_superuser)], response_model=UsersPublic)
def read_users(
    db: SessionDep,
    skip: int = 0,
    limit: int = 100
) -> UsersPublic:
    """
    [관리자 전용] 모든 사용자 목록을 조회
    """
    users = crud_user.get_multi(db=session, skip=skip, limit=limit)
    count = len(users)

    # Pydantic 2.x에서 ORM 객체 -> UserPublic 변환
    # UserPublic 스키마에 from_attributes=True 설정이 있다면 model_validate(u)로 충분
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
    # joinedload로 profile 관계 함께 로딩
    user_orm = (
        db.query(User)
        .options(joinedload(User.profile))
        # 필요시 .options(joinedload(User.items)) 등 추가
        .filter(User.id == current_user.id)
        .first()
    )
    if not user_orm:
        raise HTTPException(status_code=404, detail="User not found")

    # UserPublic 스키마로 직렬화
    return UserPublic.model_validate(user_orm)


@router.delete("/me", response_model=Message)
def delete_user_me(
    db: SessionDep,
    current_user: User = Depends(get_current_user)
) -> Any:
    """
    현재 로그인한 사용자 본인 계정 삭제
    (슈퍼유저이면 삭제 불가)
    """
    if current_user.is_superuser:
        raise HTTPException(
            status_code=403,
            detail="Super users are not allowed to delete themselves"
        )

    deleted_user = crud_user.remove_with_items(db=session, user_id=current_user.id)
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

    # UserUpdate를 통해 비밀번호 수정 로직 처리
    crud_user.update_user(
        db=session,
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
    특정 사용자 정보 조회 (슈퍼유저이거나, 본인인 경우만 접근 허용)
    """
    db_user = crud_user.get_with_relations(db=session, user_id=user_id)
    if not db_user:
        raise HTTPException(status_code=404, detail="User not found")

    # 본인이거나 슈퍼유저가 아닌 경우 접근 불가
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
    existing_user = crud_user.get_user_by_email(db=session, email=user_in.email)
    if existing_user:
        raise HTTPException(
            status_code=400,
            detail="The user with this email already exists",
        )

    user = crud_user.create_user(db=session, obj_in=user_in)
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
    db_user = crud_user.get(db=session, id=user_id)
    if not db_user:
        raise HTTPException(
            status_code=404,
            detail="The user with this id does not exist in the system"
        )

    # 이메일 중복 체크
    if user_in.email:
        exist_user_email = crud_user.get_user_by_email(db=session, email=user_in.email)
        if exist_user_email and exist_user_email.id != user_id:
            raise HTTPException(
                status_code=409,
                detail="User with this email already exists",
            )

    updated_user = crud_user.update_user(db=session, db_obj=db_user, obj_in=user_in)
    return UserPublic.model_validate(updated_user)


@router.delete("/{user_id}", dependencies=[Depends(get_current_active_superuser)])
def delete_user(
    user_id: UUID,
    db: SessionDep,
    current_user: User = Depends(get_current_user),
) -> Message:
    """
    [관리자 전용] 특정 사용자 삭제 (자식 레코드도 함께 삭제)
    """
    db_user = crud_user.get(db=session, id=user_id)
    if not db_user:
        raise HTTPException(status_code=404, detail="User not found")

    # 관리자 본인이 자기 자신을 삭제하는 것 방지
    if db_user.id == current_user.id:
        raise HTTPException(
            status_code=403,
            detail="Super users are not allowed to delete themselves"
        )

    deleted_user = crud_user.remove_with_items(db=session, user_id=user_id)
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
    existing_user = crud_user.get_user_by_email(db=session, email=user_in.email)
    if existing_user:
        raise HTTPException(
            status_code=400,
            detail="The user with this email already exists",
        )

    # user_in은 UserRegister 이므로, 내부적으로 UserCreate로 변환 (권장)
    user_create = user_in.to_user_create()
    user = crud_user.create_user(db=session, obj_in=user_create)

    return UserPublic.model_validate(user)
