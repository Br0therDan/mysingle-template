# path: app/crud/base.py

from typing import Generic, TypeVar, Type, List, Optional, Union
from uuid import UUID

from sqlalchemy.orm import Session
from sqlalchemy.exc import SQLAlchemyError
from pydantic import BaseModel

# 제네릭 타입 변수 선언
ModelType = TypeVar("ModelType")                # 실제 모델 클래스 (ex: User, Item 등)
CreateSchemaType = TypeVar("CreateSchemaType", bound=BaseModel)  # 생성용 Pydantic 스키마
UpdateSchemaType = TypeVar("UpdateSchemaType", bound=BaseModel)  # 업데이트용 Pydantic 스키마

class CRUDBase(Generic[ModelType, CreateSchemaType, UpdateSchemaType]):
    """
    범용적인 CRUD 기능을 제공하는 베이스 클래스.
    """

    def __init__(self, model: Type[ModelType]):
        """
        초기화 메서드

        :param model: SQLAlchemy 모델 클래스
        """
        self.model = model

    def get(self, db: Session, id: Union[int, UUID]) -> Optional[ModelType]:
        """
        단일 레코드 조회 메서드

        :param db: DB 세션
        :param id: 조회할 레코드의 PK (int, UUID 모두 지원)
        :return: 해당 레코드를 반환하거나, 없으면 None을 반환
        """
        return db.query(self.model).filter(self.model.id == id).first()

    def get_multi(self, db: Session, skip: int = 0, limit: int = 100) -> List[ModelType]:
        """
        다수 레코드 조회 메서드

        :param db: DB 세션
        :param skip: 시작 인덱스
        :param limit: 반환할 최대 개수
        :return: 조회된 레코드 목록
        """
        return db.query(self.model).offset(skip).limit(limit).all()

    def create(self, db: Session, obj_in: CreateSchemaType) -> ModelType:
        """
        신규 레코드 생성 메서드

        :param db: DB 세션
        :param obj_in: 생성에 필요한 Pydantic 스키마 객체
        :return: 생성된 레코드 객체
        """
        try:
            obj_data = obj_in.model_dump()
            db_obj = self.model(**obj_data)
            db.add(db_obj)
            db.commit()
            db.refresh(db_obj)
            return db_obj
        except SQLAlchemyError as e:
            db.rollback()
            raise e

    def update(self, db: Session, db_obj: ModelType, obj_in: UpdateSchemaType) -> ModelType:
        """
        기존 레코드 업데이트 메서드

        :param db: DB 세션
        :param db_obj: 기존 레코드 객체
        :param obj_in: 업데이트에 필요한 Pydantic 스키마 객체 (exclude_unset=True 권장)
        :return: 업데이트된 레코드 객체
        """
        try:
            obj_data = obj_in.dict(exclude_unset=True)
            for field, value in obj_data.items():
                setattr(db_obj, field, value)
            db.add(db_obj)
            db.commit()
            db.refresh(db_obj)
            return db_obj
        except SQLAlchemyError as e:
            db.rollback()
            raise e

    def remove(self, db: Session, id: Union[int, UUID]) -> Optional[ModelType]:
        """
        레코드 삭제 메서드

        :param db: DB 세션
        :param id: 삭제할 레코드의 PK (int, UUID 모두 지원)
        :return: 삭제된 레코드 객체 (존재하지 않으면 None)
        """
        obj = db.query(self.model).filter(self.model.id == id).first()
        if obj:
            try:
                db.delete(obj)
                db.commit()
                return obj
            except SQLAlchemyError as e:
                db.rollback()
                raise e
        return None
