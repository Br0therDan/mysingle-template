

아래는 FastAPI 프로젝트 배포에 대한 내용을 한글로 번역한 문서입니다.

---

# FastAPI 프로젝트 - 배포

이 프로젝트는 Docker Compose를 사용해 원격 서버에 배포할 수 있습니다.

이 프로젝트는 외부와의 통신 및 HTTPS 인증서를 처리하기 위해 Traefik 프록시를 사용하도록 설계되었습니다.

GitHub Actions와 같은 CI/CD(지속적 통합 및 배포) 시스템을 사용하여 자동으로 배포할 수 있는 구성도 포함되어 있습니다.

하지만 먼저 몇 가지 설정이 필요합니다. 🤓

---

## 준비 작업

- 원격 서버를 준비하고 사용할 수 있도록 설정합니다.
- 생성한 서버의 IP에 도메인의 DNS 레코드를 연결합니다.
- 도메인에 와일드카드 서브도메인을 설정합니다. 예: `*.fastapi-project.example.com`.  
  이는 `dashboard.fastapi-project.example.com`, `api.fastapi-project.example.com`, `traefik.fastapi-project.example.com` 같은 여러 서브도메인을 통해 각 구성 요소에 접근하기 위해 필요합니다.  
  스테이징 환경에서도 사용할 수 있습니다. 예: `dashboard.staging.fastapi-project.example.com`, `adminer.staging.fastapi-project.example.com`.
- 원격 서버에 [Docker](https://docs.docker.com/engine/install/)를 설치하고 구성합니다. (Docker Engine, Docker Desktop이 아님)

---

## Public Traefik 설정

Traefik 프록시는 들어오는 연결 및 HTTPS 인증서를 처리합니다.

이 설정은 한 번만 수행하면 됩니다.

### Traefik Docker Compose 파일 생성

1. 원격 서버에 Traefik Docker Compose 파일을 저장할 디렉토리를 생성합니다:

   ```bash
   mkdir -p /root/code/traefik-public/
   ```

2. Traefik Docker Compose 파일을 서버로 복사합니다. 로컬 터미널에서 `rsync` 명령어를 실행하여 복사할 수 있습니다:

   ```bash
   rsync -a docker-compose.traefik.yml root@your-server.example.com:/root/code/traefik-public/
   ```

### Traefik Public 네트워크 생성

Traefik은 스택과 통신하기 위해 `traefik-public`이라는 Docker "public network"를 필요로 합니다.

원격 서버에서 아래 명령어를 실행하여 네트워크를 생성합니다:

```bash
docker network create traefik-public
```

### Traefik 환경 변수 설정

Traefik Docker Compose 파일은 시작하기 전에 몇 가지 환경 변수가 설정되어 있어야 합니다. 원격 서버에서 다음 명령어를 실행해 설정할 수 있습니다:

- HTTP 기본 인증에 사용할 사용자 이름 생성:

  ```bash
  export USERNAME=admin
  ```

- HTTP 기본 인증에 사용할 비밀번호 생성:

  ```bash
  export PASSWORD=changethis
  ```

- OpenSSL을 사용해 HTTP 기본 인증 비밀번호를 "해시"된 형태로 변환하여 환경 변수에 저장:

  ```bash
  export HASHED_PASSWORD=$(openssl passwd -apr1 $PASSWORD)
  ```

- 비밀번호가 올바르게 해시되었는지 확인하려면 출력해 봅니다:

  ```bash
  echo $HASHED_PASSWORD
  ```

- 서버의 도메인 이름 설정:

  ```bash
  export DOMAIN=fastapi-project.example.com
  ```

- Let's Encrypt 이메일 설정:

  ```bash
  export EMAIL=admin@example.com
  ```

  **참고**: `@example.com`과 같은 이메일은 사용할 수 없습니다. 실제 이메일을 사용하세요.

### Traefik Docker Compose 시작

원격 서버에서 Traefik Docker Compose 파일이 있는 디렉토리로 이동합니다:

```bash
cd /root/code/traefik-public/
```

환경 변수가 설정된 상태에서 다음 명령어를 실행해 Traefik Docker Compose를 시작합니다:

```bash
docker compose -f docker-compose.traefik.yml up -d
```

---

## FastAPI 프로젝트 배포

이제 Traefik 설정이 완료되었으므로 Docker Compose를 사용해 FastAPI 프로젝트를 배포할 수 있습니다.

**참고**: Continuous Deployment(GitHub Actions)를 바로 설정할 수도 있습니다.

---

## 환경 변수 설정

먼저 몇 가지 환경 변수를 설정해야 합니다.

- `ENVIRONMENT` 설정: 기본값은 `local`(개발용)이며, 서버에 배포 시 `staging` 또는 `production` 같은 값을 사용합니다:

  ```bash
  export ENVIRONMENT=production
  ```

- `DOMAIN` 설정: 기본값은 `localhost`(개발용)이며, 배포 시 자신의 도메인을 사용합니다:

  ```bash
  export DOMAIN=fastapi-project.example.com
  ```

다양한 변수를 설정할 수 있습니다:

- `PROJECT_NAME`: 프로젝트 이름(문서와 이메일에 사용됨)
- `STACK_NAME`: Docker Compose 라벨과 프로젝트 이름으로 사용. 환경(스테이징, 프로덕션 등)에 따라 다르게 설정해야 함.
- `SECRET_KEY`: FastAPI 프로젝트의 토큰 서명에 사용될 비밀 키.
- `FIRST_SUPERUSER`: 첫 번째 관리자(superuser)의 이메일.
- `FIRST_SUPERUSER_PASSWORD`: 첫 번째 관리자의 비밀번호.
- `POSTGRES_PASSWORD`: PostgreSQL 비밀번호.
- 기타 SMTP 관련 설정 및 데이터베이스 설정 등.

---

## Docker Compose를 사용한 배포

환경 변수가 설정되면 다음 명령어를 사용해 Docker Compose로 배포할 수 있습니다:

```bash
docker compose -f docker-compose.yml up -d
```

---

## GitHub Actions로 Continuous Deployment(CD) 설정

GitHub Actions를 사용해 프로젝트를 자동으로 배포할 수 있습니다. 😎

이미 `staging` 및 `production` 환경을 위한 구성이 포함되어 있습니다. 🚀

### GitHub Actions Runner 설치

원격 서버에서 GitHub Actions를 실행할 사용자 계정을 생성합니다:

```bash
sudo adduser github
sudo usermod -aG docker github
```

GitHub Actions Runner를 [공식 가이드](https://docs.github.com/en/actions/hosting-your-own-runners/managing-self-hosted-runners/adding-self-hosted-runners#adding-a-self-hosted-runner-to-a-repository)를 참고하여 설치한 후, 서비스를 설정해 런너가 지속적으로 실행되도록 구성할 수 있습니다.

### GitHub Secrets 설정

GitHub Actions에서 사용할 환경 변수(`SECRET_KEY`, `POSTGRES_PASSWORD` 등)를 GitHub Secrets에 추가합니다.  
[GitHub 공식 가이드](https://docs.github.com/en/actions/security-guides/using-secrets-in-github-actions#creating-secrets-for-a-repository)를 참고하세요.

---

## URL

`fastapi-project.example.com`을 자신의 도메인으로 바꿔 사용하세요.

### Traefik 대시보드

- Traefik UI: `https://traefik.fastapi-project.example.com`

### 프로덕션

- 프론트엔드: `https://dashboard.fastapi-project.example.com`
- 백엔드 API 문서: `https://api.fastapi-project.example.com/docs`
- Adminer: `https://adminer.fastapi-project.example.com`

### 스테이징

- 프론트엔드: `https://dashboard.staging.fastapi-project.example.com`
- 백엔드 API 문서: `https://api.staging.fastapi-project.example.com/docs`
- Adminer: `https://adminer.staging.fastapi-project.example.com`

--- 

추가 팁: 원활한 운영을 위해 Docker Compose와 Traefik 외에도, Kubernetes 같은 컨테이너 오케스트레이션 도구를 도입하면 확장성과 관리를 더욱 쉽게 할 수 있습니다.