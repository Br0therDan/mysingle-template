
# path: app/crud/profile.py

from typing import Optional, Union
from uuid import UUID

from sqlalchemy.orm import Session

from app.models.profile import Profile, Role
from app.schemas.profile import ProfileCreate, ProfileUpdate, RoleCreate, RoleUpdate
from app.crud.base import CRUDBase
from typing import Optional, Union
from uuid import UUID
from sqlalchemy.orm import Session

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

crud_profile = CRUDProfile(Profile)


class CRUDRole(CRUDBase[Role, RoleCreate, RoleUpdate]):
    pass

# Instantiate CRUD objects
crud_role = CRUDRole(Role)
