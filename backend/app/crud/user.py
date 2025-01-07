# path: app/crud/user.py

from typing import Optional, Union
from uuid import UUID

from sqlalchemy.orm import Session, joinedload
from sqlalchemy.exc import SQLAlchemyError

from app.models.user import User
from app.models.item import Item
from app.schemas.user import UserCreate, UserUpdate
from app.core.security import get_password_hash, verify_password

from .base import CRUDBase

class CRUDUser(CRUDBase[User, UserCreate, UserUpdate]):
    """
    User 모델에 특화된 CRUD 로직을 관리하는 클래스.
    """

    def get_with_relations(self, db: Session, user_id: Union[int, UUID]) -> Optional[User]:
        """
        사용자 정보를 가져오면서, 관련된 items, profile 등 연관관계를 조인하여 가져오는 메서드

        :param db: DB 세션
        :param user_id: 조회할 유저의 PK (int, UUID)
        :return: 조회된 User 객체 (없으면 None)
        """
        return (
            db.query(self.model)
            .options(joinedload(self.model.items), joinedload(self.model.profile))
            .filter(self.model.id == user_id)
            .first()
        )

    def remove_with_items(self, db: Session, user_id: Union[int, UUID]) -> Optional[User]:
        """
        사용자 삭제 시, 자식 레코드(예: Item)도 함께 삭제하는 메서드

        :param db: DB 세션
        :param user_id: 삭제할 유저의 PK (int, UUID)
        :return: 삭제된 User 객체 (존재하지 않으면 None)
        """
        user = db.query(self.model).filter(self.model.id == user_id).first()
        if user:
            try:
                # 자식 테이블(Items) 먼저 삭제
                db.query(Item).filter(Item.owner_id == user_id).delete()
                db.delete(user)
                db.commit()
                return user
            except SQLAlchemyError as e:
                db.rollback()
                raise e
        return None

    def create_user(self, *, db: Session, obj_in: UserCreate) -> User:
        """
        사용자 생성 시, 비밀번호 해싱 로직 등을 수행하는 메서드

        :param db: DB 세션
        :param obj_in: 생성할 유저 정보 (UserCreate)
        :return: 생성된 User 객체
        """
        try:
            db_user = User(
                full_name=obj_in.full_name,
                email=obj_in.email,
                hashed_password=get_password_hash(obj_in.password),
                is_active=True,
                is_superuser=False,
            )
            db.add(db_user)
            db.commit()
            db.refresh(db_user)
            return db_user
        except SQLAlchemyError as e:
            db.rollback()
            raise e

    def update_user(self, *, db: Session, db_obj: User, obj_in: UserUpdate) -> User:
        """
        사용자 정보 업데이트 시, 비밀번호 해싱 등 부가 로직을 처리할 수 있는 메서드

        :param db: DB 세션
        :param db_obj: 기존 User 객체
        :param obj_in: 업데이트할 정보 (UserUpdate)
        :return: 업데이트된 User 객체
        """
        update_data = obj_in.dict(exclude_unset=True)
        # 비밀번호가 들어왔으면 해싱하여 hashed_password에 대입
        if "password" in update_data:
            update_data["hashed_password"] = get_password_hash(update_data["password"])
            del update_data["password"]

        for field, value in update_data.items():
            setattr(db_obj, field, value)

        try:
            db.add(db_obj)
            db.commit()
            db.refresh(db_obj)
            return db_obj
        except SQLAlchemyError as e:
            db.rollback()
            raise e

    def authenticate(self, *, db: Session, email: str, password: str) -> Optional[User]:
        """
        이메일과 비밀번호를 사용해 사용자를 인증하는 메서드

        :param db: DB 세션
        :param email: 사용자 이메일
        :param password: 평문 비밀번호
        :return: 인증된 User 객체 또는 None(인증 실패)
        """
        user = db.query(self.model).filter(self.model.email == email).first()
        if not user:
            return None
        if not verify_password(password, user.hashed_password):
            return None
        return user

    def get_user_by_email(self, *, db: Session, email: str) -> Optional[User]:
        """
        이메일로 사용자를 조회하는 메서드

        :param db: DB 세션
        :param email: 조회할 이메일
        :return: 조회된 User 객체 또는 None
        """
        return db.query(self.model).filter(self.model.email == email).first()

# CRUDUser 인스턴스 생성
crud_user = CRUDUser(User)
