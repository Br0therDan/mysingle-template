아래는 원문의 내용을 한국어로 번역한 것입니다. 문서 전체를 번역한 뒤, 마지막에 조금 더 나은 접근 방안(팁)을 간단히 제시하였으니 참고해보세요.

---

# FastAPI 프로젝트 - 개발

## Docker Compose

- Docker Compose로 로컬 스택을 시작하려면:

```bash
docker compose watch
```

- 이제 브라우저를 열고 아래 URL들을 통해 프로젝트와 상호 작용할 수 있습니다:

  - **프론트엔드(Frontend)**: Docker로 빌드되었으며, 경로에 따라 라우트가 처리됩니다.  
    URL: <http://localhost:5173>

  - **백엔드(Backend)**: OpenAPI 기반의 JSON Web API  
    URL: <http://localhost:8000>

  - **자동화된 인터랙티브 문서(Swagger UI)**: OpenAPI(백엔드)에서 제공  
    URL: <http://localhost:8000/docs>

  - **Adminer**: 데이터베이스 웹 관리자  
    URL: <http://localhost:8080>

  - **Traefik UI**: 프록시에 의해 라우트가 처리되는 방식을 확인  
    URL: <http://localhost:8090>

**참고**: 스택을 처음 시작할 때, 준비가 완료되기까지 약간 시간이 걸릴 수 있습니다. 백엔드가 데이터베이스를 대기하며 모든 구성을 마칠 때까지 로그를 확인하면 진행 상황을 볼 수 있습니다.

- 로그를 확인하려면(다른 터미널에서):

  ```bash
  docker compose logs
  ```

- 특정 서비스의 로그만 확인하려면 서비스 이름을 추가합니다(예: `backend`):

  ```bash
  docker compose logs backend
  ```

---

## 로컬 개발(Local Development)

`docker-compose.yml` 파일들은 각각의 서비스를 `localhost`의 서로 다른 포트로 제공하도록 설정되어 있습니다.

- 백엔드와 프론트엔드 모두 기본적으로 각각 로컬 개발 서버에서 사용하던 포트를 사용합니다.  
  - **백엔드**: <http://localhost:8000>  
  - **프론트엔드**: <http://localhost:5173>

이렇게 설정하면, Docker Compose 서비스 중 하나를 종료하고 로컬 개발 서버를 직접 실행해도 동일한 포트를 사용하므로 전체 동작에 문제가 없습니다.

예시:  
- 프론트엔드 서비스를 중단하려면:

  ```bash
  docker compose stop frontend
  ```

- 그리고 로컬 프론트엔드 개발 서버를 실행:

  ```bash
  cd frontend
  npm run dev
  ```

혹은 백엔드 Docker Compose 서비스를 중단한 뒤:

```bash
docker compose stop backend
```

백엔드 로컬 개발 서버를 실행할 수 있습니다:

```bash
cd backend
fastapi dev app/main.py
```

---

## `localhost.tiangolo.com`에서의 Docker Compose

Docker Compose 스택을 실행하면, 기본적으로 `localhost`를 사용하고 서비스별로 다른 포트를 할당합니다(예: 백엔드, 프론트엔드, Adminer 등).

프로덕션(또는 스테이징) 환경에 배포할 때는 각 서비스가 서로 다른 서브도메인을 사용합니다(예: 백엔드 `api.example.com`, 프론트엔드 `dashboard.example.com`).

[배포(deployment.md)](deployment.md)에 대한 가이드에서 Traefik을 다루는데, 이것이 서브도메인 기반으로 각 서비스로 트래픽을 전달해주는 주요 컴포넌트입니다.

로컬에서 이러한 서브도메인 기반 설정을 테스트해보고 싶다면, 로컬 `.env` 파일을 열어 아래처럼 수정할 수 있습니다:

```dotenv
DOMAIN=localhost.tiangolo.com
```

Docker Compose 파일들이 이 설정값을 사용해 서비스의 기본 도메인을 구성합니다.  
Traefik은 이를 이용하여 `api.localhost.tiangolo.com`에 대한 트래픽을 백엔드로, `dashboard.localhost.tiangolo.com`에 대한 트래픽을 프론트엔드로 전달합니다.

`localhost.tiangolo.com` 도메인은 특수하게 설정(하위 도메인을 포함해서)되어 있으며, `127.0.0.1`을 가리키므로 로컬 환경에서 서브도메인을 사용하는 테스트가 가능합니다.

변경 사항을 반영하려면 다시 실행합니다:

```bash
docker compose watch
```

예를 들어, 실제 운영 환경(프로덕션)에서는 이 Docker Compose에 포함되지 않은 Traefik 구성을 별도로 두며, 여기서는 `docker-compose.override.yml`에 있는 Traefik 설정을 통해 로컬에서 서브도메인 동작을 테스트할 수 있습니다(`api.localhost.tiangolo.com`, `dashboard.localhost.tiangolo.com` 등).

---

## Docker Compose 파일 및 환경 변수(env vars)

메인 `docker-compose.yml` 파일에는 스택 전체에 대한 공통 설정이 들어 있으며, `docker compose` 명령어로 자동으로 사용됩니다.

그리고 `docker-compose.override.yml`은 개발 환경용으로 볼륨(소스코드 등)을 마운트하는 등의 오버라이드 설정을 담고 있습니다. 이 파일 역시 `docker compose`에서 자동으로 로드되어 `docker-compose.yml` 위에 오버레이 됩니다.

이 Docker Compose 파일들은 `.env` 파일(환경변수)에서 설정을 불러와 컨테이너에 주입합니다.  
또한 `docker compose` 명령어가 실행되기 전에 스크립트로부터 전달되는 환경변수도 추가로 사용합니다.

환경변수를 변경했다면, 스택을 재시작해야 반영됩니다:

```bash
docker compose watch
```

---

## .env 파일

`.env` 파일은 각종 설정값, 생성된 키, 비밀번호 등이 들어 있는 파일입니다.

프로젝트가 공개 저장소 등에서 관리된다면, `.env` 파일을 Git 추적 대상에서 제외할 수도 있습니다. 그럴 경우, CI(지속적 통합) 도구가 빌드나 배포 시점에 `.env` 파일의 내용을 참조하거나, 환경변수로 직접 설정하게 해야 합니다.

한 가지 방법으로는, CI/CD 시스템에 각 환경변수를 추가한 뒤 `docker-compose.yml`이 `.env` 대신 CI/CD 시스템의 환경변수를 읽도록 수정하는 방법이 있습니다.

---

## Pre-commits 및 코드 린팅(코드 품질 점검)

이 프로젝트에서는 [pre-commit](https://pre-commit.com/)이라는 도구로 코드 린팅(linting)과 포매팅(formatting)을 자동화합니다.

`pre-commit`을 설치하면, Git 커밋을 수행하기 직전에 자동으로 코드 검사를 실행합니다. 이를 통해 코드가 커밋되기 전 일관성 있게 포맷팅됩니다.

프로젝트 루트 경로에 `.pre-commit-config.yaml` 파일에서 설정을 확인할 수 있습니다.

#### 자동 실행을 위한 pre-commit 설치

`pre-commit`은 프로젝트 종속성에 이미 포함되어 있지만, 필요에 따라 전역 설치도 가능합니다(자세한 내용은 [공식 pre-commit 문서](https://pre-commit.com/) 참고).

`pre-commit` 툴을 설치한 뒤, 현재 로컬 저장소에 대해 아래처럼 “설치” 과정을 진행해야 합니다(자동 훅 실행을 위해):

```bash
❯ uv run pre-commit install
pre-commit installed at .git/hooks/pre-commit
```

이제 `git commit`을 시도할 때마다 pre-commit이 실행되어, 커밋할 코드가 린팅 및 포매팅을 거치게 됩니다. 만약 수정된 파일이 있다면, 다시 `git add`로 스테이징하고 커밋해야 합니다.

#### 수동으로 pre-commit 훅 실행하기

원한다면 수동으로도 pre-commit 훅을 모든 파일에 대해 실행할 수 있습니다. `uv`를 통해 다음 명령어로 실행할 수 있습니다:

```bash
❯ uv run pre-commit run --all-files
check for added large files..............................................Passed
check toml...............................................................Passed
check yaml...............................................................Passed
ruff.....................................................................Passed
ruff-format..............................................................Passed
eslint...................................................................Passed
prettier.................................................................Passed
```

---

## URL

프로덕션 혹은 스테이징 환경에서도 동일한 경로를 사용하지만, 여러분의 도메인이 적용됩니다.

### 개발(Development) URL

로컬 개발 환경에서 사용할 수 있는 URL은 다음과 같습니다:

- **프론트엔드**: <http://localhost:5173>  
- **백엔드**: <http://localhost:8000>  
- **자동화된 문서 (Swagger UI)**: <http://localhost:8000/docs>  
- **대안 문서 (ReDoc)**: <http://localhost:8000/redoc>  
- **Adminer**: <http://localhost:8080>  
- **Traefik UI**: <http://localhost:8090>  
- **MailCatcher**: <http://localhost:1080>

### `localhost.tiangolo.com`이 설정된 개발(Development) URL

도메인 설정(`localhost.tiangolo.com`)을 활성화한 로컬 개발 환경에서의 URL:

- **프론트엔드**: <http://dashboard.localhost.tiangolo.com>  
- **백엔드**: <http://api.localhost.tiangolo.com>  
- **자동화된 문서 (Swagger UI)**: <http://api.localhost.tiangolo.com/docs>  
- **대안 문서 (ReDoc)**: <http://api.localhost.tiangolo.com/redoc>  
- **Adminer**: <http://localhost.tiangolo.com:8080>  
- **Traefik UI**: <http://localhost.tiangolo.com:8090>  
- **MailCatcher**: <http://localhost.tiangolo.com:1080>

---

## 추가 팁: 더 나은 접근 방법 제안
- **Docker Compose를 대체/보완하는 Dev 환경**: 컨테이너를 매번 재시작하지 않고도 빠르게 개발하려면 [VS Code Remote Containers](https://code.visualstudio.com/docs/remote/containers) 또는 [GitHub Codespaces](https://github.com/features/codespaces) 같은 도구를 고려해볼 수 있습니다.
- **환경변수 관리**: `.env` 파일을 통해 관리하기보다 [Direnv](https://direnv.net/) 같은 툴을 사용하면, 민감 정보를 좀 더 안전하게 관리할 수 있습니다.
- **배포 자동화**: CI/CD 파이프라인 설정 시, Docker 이미지를 빌드하고 `docker-compose` 또는 쿠버네티스(Kubernetes) 환경에서 자동으로 배포하는 방식을 고려해보세요.

위와 같은 방법들을 사용하면 로컬 개발 속도와 보안, 그리고 배포 프로세스까지 모두 개선할 수 있으니 상황에 맞춰 적용해보시길 권장드립니다.