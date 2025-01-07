
# path: app/crud/profile.py

from typing import Optional, List
from uuid import UUID
from sqlalchemy.orm import Session
from app.models.profile import Profile, Role
from app.schemas.profile import ProfileCreate, ProfileUpdate, RoleCreate, RoleUpdate
from app.crud.base import CRUDBase
from typing import Optional, Union
from uuid import UUID
from sqlalchemy.orm import Session
from sqlalchemy.exc import SQLAlchemyError

class CRUDProfile(CRUDBase[Profile, ProfileCreate, ProfileUpdate]):
    """
    Profile 모델에 특화된 CRUD 로직을 관리하는 클래스
    """
    def get_by_user_id(self, db: Session, user_id: UUID) -> Optional[Profile]:
        """
        user_id를 통해 Profile을 조회.
        """
        return (
            db.query(self.model)
            .filter(self.model.user_id == user_id)
            .first()
        )
    
    def create_profile(self, db: Session, obj_in: ProfileCreate) -> Profile:
        try:
            # 1. role_ids를 제외하고 Profile 인스턴스 생성
            obj_data = obj_in.model_dump(exclude={"role_ids"})
            db_obj = Profile(**obj_data)  # role_ids가 제거됐으므로 에러가 안 난다
            db.add(db_obj)
            db.commit()
            db.refresh(db_obj)

            # 2. role_ids가 있다면, 실제 Role 관계를 맺는다
            if obj_in.role_ids:
                roles = []  # 실제 Role을 가져오는 로직 필요
                # 예: roles = crud_role.get_multi_by_ids(db=db, ids=obj_in.role_ids)

                db_obj.roles = roles  # M:N 관계 설정
                db.commit()
                db.refresh(db_obj)

            return db_obj

        except SQLAlchemyError as e:
            db.rollback()
            raise e
        
    def update_profile(self, db: Session, db_obj: Profile, obj_in: ProfileUpdate) -> Profile:
        """
        Profile을 업데이트할 때, role_ids 처리까지 포함한 메서드.
        """
        try:
            # 1) role_ids 등 Profile 모델에 없는 필드는 제외
            obj_data = obj_in.model_dump(exclude={"role_ids", "roles"})

            # 2) 기본 필드 업데이트
            for field, value in obj_data.items():
                setattr(db_obj, field, value)

            db.add(db_obj)
            db.commit()
            db.refresh(db_obj)

            # 3) role_ids가 None이 아닐 경우에만 M:N 관계 업데이트
            if obj_in.role_ids is not None:
                # 실제 Role 객체 목록을 가져온 뒤 유효성 검증
                roles = crud_role.get_multi_by_ids(db=db, ids=obj_in.role_ids)
                if len(roles) != len(obj_in.role_ids):
                    # 일부 Role이 존재하지 않는 경우 에러 처리
                    raise ValueError("Invalid role IDs provided")

                # 관계 갱신 (덮어쓰기 방식)
                db_obj.roles = roles
                db.commit()
                db.refresh(db_obj)

            return db_obj

        except SQLAlchemyError as e:
            db.rollback()
            raise e
        except ValueError as ve:
            db.rollback()
            raise ve

crud_profile = CRUDProfile(Profile)

class CRUDRole(CRUDBase[Role, RoleCreate, RoleUpdate]):
    """
    Role 전용 CRUD 클래스

    - 필요 시 create, update 메서드를 오버라이드할 수 있음.
    - role_ids를 처리하기 위한 헬퍼 메서드(get_multi_by_ids 등)를 추가할 수 있음.
    """
    def get_multi_by_ids(self, db: Session, ids: List[int]) -> List[Role]:
        """
        주어진 role ID 목록에 해당하는 Role 레코드들을 한 번에 조회.
        """
        if not ids:
            return []
        return db.query(self.model).filter(self.model.id.in_(ids)).all()

    # 필요하다면 create/update 오버라이드 (아래는 기본 CRUDBase 사용)
    #
    # def create(self, db: Session, obj_in: RoleCreate) -> Role:
    #     # 예시로, DB에 넣기 전에 추가 검증 로직이나 기본값 설정 등을 할 수 있음
    #     return super().create(db, obj_in)
    #
    # def update(self, db: Session, db_obj: Role, obj_in: RoleUpdate) -> Role:
    #     # 예시로, 기존 로직에 더해 다른 관계 업데이트 등을 할 수 있음
    #     return super().update(db, db_obj, obj_in)




# Instantiate CRUD objects
crud_role = CRUDRole(Role)
