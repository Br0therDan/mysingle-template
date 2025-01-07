import logging

from sqlalchemy.orm import Session

from app.database.session import engine, init_db
from app.database.base import Base

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

def init() -> None:
    with Session(engine) as db:
        logger.info("Initializing database schema")
        Base.metadata.create_all(bind=engine)  # 모든 모델의 테이블 생성

        logger.info("Initializing database with initial data")
        init_db(db)  # 초기 데이터 삽입 함수 호출

def main() -> None:
    logger.info("Creating initial data")
    init()
    logger.info("Initial data created")

if __name__ == "__main__":
    main