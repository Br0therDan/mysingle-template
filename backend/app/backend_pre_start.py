import logging

from sqlalchemy import Engine
from sqlalchemy.orm import Session
from sqlalchemy.exc import SQLAlchemyError
from tenacity import after_log, before_log, retry, stop_after_attempt, wait_fixed

from app.database.session import engine
from app.database.base import Base  # 모델 정의를 가져옵니다.

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

max_tries = 60 * 5  # 5 minutes
wait_seconds = 1


@retry(
    stop=stop_after_attempt(max_tries),
    wait=wait_fixed(wait_seconds),
    before=before_log(logger, logging.INFO),
    after=after_log(logger, logging.WARN),
)
def init(db_engine: Engine) -> None:
    try:
        # 데이터베이스 연결 및 테이블 생성 확인
        logger.info("Checking database connection and initializing models...")
        Base.metadata.create_all(bind=db_engine)  # 모델의 테이블 생성

        with Session(db_engine) as db:
            # 예시 모델로 간단한 데이터베이스 상호작용
            result = db.query(ExampleModel).first()
            logger.info("Database connection successful. Example query result: %s", result)

    except SQLAlchemyError as e:
        logger.error("SQLAlchemy Error: %s", e)
        raise e
    except Exception as e:
        logger.error("Unexpected Error: %s", e)
        raise e


def main() -> None:
    logger.info("Initializing service")
    init(engine)
    logger.info("Service finished initializing")


if __name__ == "__main__":
    main()
