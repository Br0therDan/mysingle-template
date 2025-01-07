# -------------------------
# 1) 빌드 스테이지 (Builder)
# -------------------------
    FROM python:3.11-slim AS builder

    ENV PYTHONUNBUFFERED=1
    WORKDIR /app
    
    # 시스템 의존성 설치: build-essential, libpq-dev, curl 등
    RUN apt-get update && apt-get install -y --no-install-recommends \
        build-essential \
        libpq-dev \
        curl \
        && rm -rf /var/lib/apt/lists/*
    
    # Poetry 설치
    RUN curl -sSL https://install.python-poetry.org | POETRY_HOME=/opt/poetry python && \
        ln -s /opt/poetry/bin/poetry /usr/local/bin/poetry && \
        poetry config virtualenvs.create false
    
    # 의존성 파일 복사 및 종속성 설치
    COPY pyproject.toml poetry.lock /app/
    RUN poetry install --no-root
    
    # 애플리케이션 소스 복사
    COPY . /app
    
    # -------------------------
    # 2) 런타임 스테이지 (Runtime)
    # -------------------------
    FROM python:3.11-slim AS runtime
    
    ENV PYTHONUNBUFFERED=1
    WORKDIR /app
    
    # 런타임에 필요한 시스템 의존성 설치: libpq-dev, curl
    RUN apt-get update && apt-get install -y --no-install-recommends \
        libpq-dev \
        curl \
        && rm -rf /var/lib/apt/lists/*
    
    # 빌드 스테이지에서 설치된 패키지 복사
    COPY --from=builder /usr/local /usr/local
    
    # 애플리케이션 소스 복사
    COPY --from=builder /app /app
    
    # Healthcheck를 위한 curl 설치 확인 (이미 설치됨)
    # 필요하다면 추가적인 설정을 여기에 작성
    
    # 포트 노출
    EXPOSE 8000
    
    # 컨테이너 실행 시 Uvicorn으로 애플리케이션 시작
    CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8000", "--workers", "4"]
    