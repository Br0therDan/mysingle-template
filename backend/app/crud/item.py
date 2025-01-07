# path: app/crud/item.py

from typing import Union, List
from uuid import UUID
from sqlalchemy.orm import Session

from app.crud.base import CRUDBase
from app.models.item import Item
from app.schemas.item import ItemCreate, ItemUpdate

class CRUDItem(CRUDBase[Item, ItemCreate, ItemUpdate]):
    """
    Item 모델에 특화된 CRUD 로직을 관리하는 클래스
    """
    def get_by_owner(self, db: Session, owner_id: UUID, skip: int = 0, limit: int = 100) -> List[Item]:
        """
        특정 owner_id 기준으로 Item 리스트 조회
        """
        return (
            db.query(self.model)
            .filter(self.model.owner_id == owner_id)
            .offset(skip)
            .limit(limit)
            .all()
        )

crud_item = CRUDItem(Item)
