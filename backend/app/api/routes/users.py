
from uuid import UUID
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import joinedload
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
)
from app.schemas.token import Message
from app.crud.user import crud_user
from app.crud.profile import crud_profile
from app.models.user import User

router = APIRouter()

# --------------------------------------------------------
# [관리자 전용] 모든 사용자 목록 조회
# --------------------------------------------------------
@router.get("/", dependencies=[Depends(get_current_active_superuser)], response_model=UsersPublic)
def read_users(
    db: SessionDep,
    skip: int = 0,
    limit: int = 100
) -> UsersPublic:
    """
    [관리자 전용] 모든 사용자 목록 조회
    """
    users = crud_user.get_multi(db=db, skip=skip, limit=limit)
    return UsersPublic(data=[UserPublic.model_validate(u) for u in users], count=len(users))

# --------------------------------------------------------
# 현재 로그인한 사용자 정보 조회
# --------------------------------------------------------
@router.get("/me", response_model=UserPublic)
def read_user_me(
    db: SessionDep,
    current_user: User = Depends(get_current_user)
) -> UserPublic:
    """
    현재 로그인한 사용자 정보 조회
    """
    user = (
        db.query(User)
        .options(joinedload(User.profile))
        .filter(User.id == current_user.id)
        .first()
    )
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    return UserPublic.model_validate(user)

# --------------------------------------------------------
# 현재 사용자 계정 삭제 (관리자는 불가)
# --------------------------------------------------------
@router.delete("/me", response_model=Message)
def delete_user_me(
    db: SessionDep,
    current_user: User = Depends(get_current_user)
) -> Message:
    """
    현재 사용자 계정 삭제 (관리자는 불가)
    """
    if current_user.is_superuser:
        raise HTTPException(status_code=403, detail="Superusers cannot delete themselves")
    crud_user.remove_with_items(db=db, user_id=current_user.id)
    return Message(message="User deleted successfully")

# --------------------------------------------------------
# 현재 사용자의 비밀번호 변경
# --------------------------------------------------------
@router.patch("/me/password", response_model=Message)
def update_password_me(
    db: SessionDep,
    body: UpdatePassword,
    current_user: User = Depends(get_current_user)
) -> Message:
    """
    현재 사용자의 비밀번호 변경
    """
    if not verify_password(body.current_password, current_user.hashed_password):
        raise HTTPException(status_code=400, detail="Incorrect password")
    if body.current_password == body.new_password:
        raise HTTPException(status_code=400, detail="New password must be different")
    crud_user.update_user(
        db=db,
        db_obj=current_user,
        obj_in=UserUpdate(password=body.new_password)
    )
    return Message(message="Password updated successfully")

# --------------------------------------------------------
# 특정 사용자 정보 조회
# --------------------------------------------------------
@router.get("/{user_id}", response_model=UserPublic)
def read_user_by_id(
    user_id: UUID,
    db: SessionDep,
    current_user: User = Depends(get_current_user)
) -> UserPublic:
    """
    특정 사용자 정보 조회
    """
    user = crud_user.get_with_relations(db=db, user_id=user_id)
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    # 권한 체크
    if (user.id != current_user.id) and (not current_user.is_superuser):
        raise HTTPException(status_code=403, detail="Not enough privileges")
    return UserPublic.model_validate(user)

# --------------------------------------------------------
# [관리자 전용] 사용자 생성
# - 생성된 직후, 자동으로 프로필도 함께 생성하도록 수정
# --------------------------------------------------------
@router.post("/", response_model=UserPublic, dependencies=[Depends(get_current_active_superuser)])
def create_user(
    db: SessionDep,
    user_in: UserCreate
) -> UserPublic:
    """
    [관리자 전용] 사용자 생성
    """
    if crud_user.get_user_by_email(db=db, email=user_in.email):
        raise HTTPException(status_code=400, detail="Email already exists")

    # 1. User 생성
    user = crud_user.create_user(db=db, obj_in=user_in)

    # ------------------------------------------------
    # 2. User 생성 후 "빈 프로필" 자동 생성
    # ------------------------------------------------
    crud_profile.create(
        db=db,
        obj_in=ProfileCreate(
            user_id=user.id,
            first_name="",
            last_name="",
            avatar_url="",
            bio="",
            birth_date=None
        )
    )
    # ------------------------------------------------

    return UserPublic.model_validate(user)

# --------------------------------------------------------
# [관리자 전용] 사용자 정보 업데이트
# --------------------------------------------------------
@router.patch("/{user_id}", response_model=UserPublic, dependencies=[Depends(get_current_active_superuser)])
def update_user(
    user_id: UUID,
    user_in: UserUpdate,
    db: SessionDep
) -> UserPublic:
    """
    [관리자 전용] 사용자 정보 업데이트
    """
    user = crud_user.get(db=db, id=user_id)
    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    if user_in.email:
        existing_user = crud_user.get_user_by_email(db=db, email=user_in.email)
        if existing_user and existing_user.id != user_id:
            raise HTTPException(status_code=409, detail="Email already exists")

    updated_user = crud_user.update_user(db=db, db_obj=user, obj_in=user_in)
    return UserPublic.model_validate(updated_user)

# --------------------------------------------------------
# [관리자 전용] 사용자 삭제
# --------------------------------------------------------
@router.delete("/{user_id}", dependencies=[Depends(get_current_active_superuser)])
def delete_user(
    user_id: UUID,
    db: SessionDep,
    current_user: User = Depends(get_current_user),
) -> Message:
    """
    [관리자 전용] 사용자 삭제
    """
    user = crud_user.get(db=db, id=user_id)
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    if user.id == current_user.id:
        raise HTTPException(status_code=403, detail="Superusers cannot delete themselves")

    crud_user.remove_with_items(db=db, user_id=user_id)
    return Message(message="User deleted successfully")

# --------------------------------------------------------
# [공개] 회원가입
# - 회원가입 직후, 자동으로 프로필도 함께 생성하도록 수정
# --------------------------------------------------------
@router.post("/signup", response_model=UserPublic)
def register_user(
    db: SessionDep,
    user_in: UserRegister
) -> UserPublic:
    """
    회원가입 요청
    """
    if crud_user.get_user_by_email(db=db, email=user_in.email):
        raise HTTPException(status_code=400, detail="Email already exists")

    # 1. User 생성
    user = crud_user.create_user(db=db, obj_in=user_in.to_user_create())

    # ------------------------------------------------
    # 2. 빈 프로필 자동 생성
    # ------------------------------------------------
    crud_profile.create_profile(
        db=db,
        obj_in=ProfileCreate(
            user_id=user.id,
            first_name="",
            last_name="",
            avatar_url="",
            bio="",
            birth_date=None
        )
    )
    # ------------------------------------------------

    return UserPublic.model_validate(user)

