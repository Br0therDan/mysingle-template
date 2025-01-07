from sqlalchemy import create_engine, select
from sqlalchemy.orm import sessionmaker, Session
from app.core.config import settings
from app.schemas.user import User, UserCreate
from app.crud.user import crud_user


engine = create_engine(str(settings.SQLALCHEMY_DATABASE_URI))
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

def init_db(db: Session) -> None:

    user = db.exec(
        select(User).where(User.email == settings.FIRST_SUPERUSER)
    ).first()
    if not user:
        user_in = UserCreate(
            email=settings.FIRST_SUPERUSER,
            password=settings.FIRST_SUPERUSER_PASSWORD,
            is_superuser=True,
        )
        user = crud_user.create_user(session=db, user_create=user_in)
