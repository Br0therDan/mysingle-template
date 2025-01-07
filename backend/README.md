아래는 FastAPI 프로젝트의 백엔드 부분 한글 번역입니다.

---

# FastAPI 프로젝트 - 백엔드

## 요구사항

- [Docker](https://www.docker.com/)
- Python 패키지 및 환경 관리를 위한 [uv](https://docs.astral.sh/uv/)

---

## Docker Compose

[../development.md](../development.md)의 가이드를 따라 Docker Compose로 로컬 개발 환경을 시작하세요.

---

## 일반적인 워크플로우

기본적으로 [uv](https://docs.astral.sh/uv/)를 사용해 종속성을 관리합니다. uv를 설치하세요.

`./backend/` 디렉토리에서 다음 명령어로 모든 종속성을 설치할 수 있습니다:

```bash
uv sync
```

이후, 가상 환경을 활성화하려면 다음 명령어를 실행하세요:

```bash
source .venv/bin/activate
```

편집기가 올바른 Python 가상 환경을 사용하고 있는지 확인하세요.  
Python 인터프리터 경로는 `backend/.venv/bin/python`이어야 합니다.

SQLModel 모델은 `./backend/app/models.py`에서 수정하거나 추가하세요.  
API 엔드포인트는 `./backend/app/api/`,  
CRUD 유틸리티는 `./backend/app/crud.py`에서 수정하거나 추가하세요.

---

## VS Code

이미 VS Code에서 백엔드를 디버거로 실행할 수 있도록 설정되어 있습니다.  
이 설정을 통해 중단점(breakpoint)을 사용하거나 변수 등을 탐색할 수 있습니다.

테스트를 VS Code의 Python 테스트 탭에서 실행할 수 있도록 구성도 되어 있습니다.

---

## Docker Compose Override

개발 중에는 `docker-compose.override.yml` 파일에서 로컬 개발 환경에만 영향을 미치는 Docker Compose 설정을 변경할 수 있습니다.

이 파일의 변경 사항은 로컬 개발 환경에만 적용되며 프로덕션 환경에는 영향을 미치지 않습니다.  
따라서 개발 워크플로우를 돕기 위한 "임시" 변경 사항을 추가할 수 있습니다.

예를 들어, 백엔드 코드가 포함된 디렉토리가 Docker 컨테이너와 동기화되도록 설정되어 있습니다.  
이렇게 하면 코드를 수정할 때마다 컨테이너 내부의 디렉토리에도 실시간으로 반영되므로 Docker 이미지를 다시 빌드하지 않아도 됩니다.

---

## 컨테이너 내부에서 작업하기

백엔드 컨테이너 내부에서 명령을 실행하거나 개발 서버를 시작하려면 다음 단계를 따르세요:

1. 스택을 실행합니다:

   ```bash
   docker compose watch
   ```

2. 다른 터미널에서 컨테이너 내부로 접속합니다:

   ```bash
   docker compose exec backend bash
   ```

3. 이제 컨테이너 내부에서 FastAPI를 실행하여 코드 변경 시 자동으로 다시 로드되는 서버를 시작할 수 있습니다:

   ```bash
   fastapi run --reload app/main.py
   ```

컨테이너 내부에 머물면서 Python 파일의 오류를 수정하고 서버를 다시 시작할 수 있습니다.

---

## 백엔드 테스트

백엔드 테스트를 실행하려면:

```bash
bash ./scripts/test.sh
```

테스트는 Pytest로 실행됩니다. 테스트를 추가하거나 수정하려면 `./backend/app/tests/` 디렉토리를 사용하세요.

GitHub Actions를 사용 중이라면, 테스트가 자동으로 실행됩니다.

---

## 마이그레이션

모델을 변경할 때마다 `alembic` 명령어로 데이터베이스를 업데이트해야 합니다.  
컨테이너 내부에서 다음 단계를 따라 마이그레이션을 수행할 수 있습니다:

1. 컨테이너 내부로 접속:

   ```bash
   docker compose exec backend bash
   ```

2. 모델 변경 후, 리비전 생성:

   ```bash
   alembic revision --autogenerate -m "Add column last_name to User model"
   ```

3. Git에 생성된 리비전 파일을 커밋:

4. 데이터베이스를 업데이트:

   ```bash
   alembic upgrade head
   ```

---

## 이메일 템플릿

이메일 템플릿은 `./backend/app/email-templates/`에 있습니다.

- **src**: 원본 파일이 저장된 디렉토리.
- **build**: 최종 템플릿 파일이 저장된 디렉토리.

VS Code에서 [MJML 확장 프로그램](https://marketplace.visualstudio.com/items?itemName=attilabuti.vscode-mjml)을 설치한 후, `.mjml` 파일을 HTML로 변환하여 `build` 디렉토리에 저장하세요.

---

## 추가 팁

개발 워크플로우와 배포 효율성을 높이기 위해 다음을 고려해보세요:

1. **테스트 자동화**: 테스트 커버리지 파일(`htmlcov/index.html`)을 통해 개선이 필요한 부분을 식별하세요.
2. **GitHub Actions 통합**: CD(지속적 배포)를 설정하여 배포 프로세스를 자동화하세요.
3. **CI/CD 환경 관리**: Docker Compose 파일을 활용한 환경 분리로 개발, 스테이징, 프로덕션을 명확히 구분하세요.