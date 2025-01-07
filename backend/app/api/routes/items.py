# path: app/api/endpoints/items.py

from typing import Any
from uuid import UUID
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.api.deps import get_current_user, SessionDep
from app.models.user import User
from app.crud.item import crud_item
from app.schemas.item import (
    ItemCreate,
    ItemUpdate,
    ItemPublic,
    ItemsPublic
)

router = APIRouter()

@router.get("/", response_model=ItemsPublic)
def read_my_items(
    db: SessionDep,
    skip: int = 0,
    limit: int = 100,
    current_user: User = Depends(get_current_user)
) -> Any:
    """
    현재 로그인한 사용자의 Item 목록을 조회
    (슈퍼유저 로직은 필요하다면 수정 가능)
    """
    items = crud_item.get_by_owner(db=db, owner_id=current_user.id, skip=skip, limit=limit)
    return ItemsPublic(data=items, count=len(items))


@router.get("/{item_id}", response_model=ItemPublic)
def read_item_by_id(
    item_id: UUID,
    db: SessionDep,
    current_user: User = Depends(get_current_user)
) -> Any:
    """
    특정 Item 상세 조회
    - 일반사용자: 본인 아이템만 조회 가능
    - 슈퍼유저: 다른 사람 아이템도 조회 가능
    """
    db_item = crud_item.get(db=db, id=item_id)
    if not db_item:
        raise HTTPException(status_code=404, detail="Item not found")

    # 권한 체크
    if (db_item.owner_id != current_user.id) and (not current_user.is_superuser):
        raise HTTPException(status_code=403, detail="Not enough privileges")

    return db_item


@router.post("/", response_model=ItemPublic)
def create_item(
    item_in: ItemCreate,
    db: SessionDep,
    current_user: User = Depends(get_current_user)
) -> Any:
    """
    Item 생성
    - owner_id는 current_user.id 로 설정
    """
    new_item = crud_item.create(db=db, obj_in=ItemCreate(**item_in.dict()))
    # 생성 후, owner_id를 직접 세팅(또는 create 단계에서 포함)
    new_item.owner_id = current_user.id
    db.add(new_item)
    db.commit()
    db.refresh(new_item)
    return new_item


@router.patch("/{item_id}", response_model=ItemPublic)
def update_item(
    item_id: UUID,
    item_in: ItemUpdate,
    db: SessionDep,
    current_user: User = Depends(get_current_user)
) -> Any:
    """
    특정 Item 업데이트
    - 일반 사용자: 본인 아이템만 수정
    - 슈퍼유저: 다른 사람 아이템도 수정 가능
    """
    db_item = crud_item.get(db=db, id=item_id)
    if not db_item:
        raise HTTPException(status_code=404, detail="Item not found")

    # 권한 체크
    if (db_item.owner_id != current_user.id) and (not current_user.is_superuser):
        raise HTTPException(status_code=403, detail="Not enough privileges")

    updated_item = crud_item.update(db=db, db_obj=db_item, obj_in=item_in)
    return updated_item


@router.delete("/{item_id}")
def delete_item(
    item_id: UUID,
    db: SessionDep,
    current_user: User = Depends(get_current_user)
) -> Any:
    """
    특정 Item 삭제
    - 일반 사용자: 본인 아이템만 삭제
    - 슈퍼유저: 다른 사람 아이템도 삭제 가능
    """
    db_item = crud_item.get(db=db, id=item_id)
    if not db_item:
        raise HTTPException(status_code=404, detail="Item not found")

    if (db_item.owner_id != current_user.id) and (not current_user.is_superuser):
        raise HTTPException(status_code=403, detail="Not enough privileges")

    crud_item.remove(db=db, id=item_id)
    return {"message": "Item deleted successfully"}
