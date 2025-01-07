아래는 FastAPI 프로젝트의 프론트엔드 부분 한글 번역입니다.

---

# FastAPI 프로젝트 - 프론트엔드

이 프론트엔드는 [Vite](https://vitejs.dev/), [React](https://reactjs.org/), [TypeScript](https://www.typescriptlang.org/), [TanStack Query](https://tanstack.com/query), [TanStack Router](https://tanstack.com/router), [Chakra UI](https://chakra-ui.com/)를 사용하여 구축되었습니다.

---

## 프론트엔드 개발

시작하기 전에, Node Version Manager(nvm) 또는 Fast Node Manager(fnm)이 시스템에 설치되어 있는지 확인하세요.

- **fnm 설치**: [공식 fnm 가이드](https://github.com/Schniz/fnm#installation)를 따르세요.  
- **nvm 설치**: [공식 nvm 가이드](https://github.com/nvm-sh/nvm#installing-and-updating)를 따르세요.

설치를 완료한 후, `frontend` 디렉토리로 이동합니다:

```bash
cd frontend
```

- `.nvmrc` 파일에 지정된 Node.js 버전이 설치되어 있지 않은 경우, 다음 명령어를 사용하여 설치하세요:

```bash
# fnm을 사용하는 경우
fnm install

# nvm을 사용하는 경우
nvm install
```

- 설치가 완료되면, 해당 Node.js 버전으로 전환합니다:

```bash
# fnm을 사용하는 경우
fnm use

# nvm을 사용하는 경우
nvm use
```

- `frontend` 디렉토리 내에서 필요한 NPM 패키지를 설치합니다:

```bash
npm install
```

- 라이브 서버를 시작하려면 다음 명령어를 실행하세요:

```bash
npm run dev
```

- 브라우저에서 [http://localhost:5173/](http://localhost:5173/)을 열어 확인합니다.

**주의**: 이 라이브 서버는 Docker 내부에서 실행되지 않으며 로컬 개발을 위해 실행됩니다.  
개발이 완료되면 프론트엔드 Docker 이미지를 빌드하여 프로덕션 환경과 유사한 설정에서 테스트할 수 있습니다.  
하지만 코드 변경 시마다 이미지를 빌드하는 대신, 라이브 리로드 서버를 사용하는 것이 생산성을 높이는 데 유리합니다.

`package.json` 파일에서 사용 가능한 다른 옵션을 확인할 수 있습니다.

---

### 프론트엔드 제거

API 전용 앱을 개발 중이며 프론트엔드를 제거하려는 경우 다음 단계를 따르세요:

1. `./frontend` 디렉토리를 삭제합니다.
2. `docker-compose.yml` 파일에서 `frontend` 서비스 섹션을 삭제합니다.
3. `docker-compose.override.yml` 파일에서 `frontend` 및 `playwright` 서비스 섹션을 삭제합니다.

이로써 프론트엔드가 제거된 API 전용 앱이 됩니다. 🤓

원한다면 `.env`와 `./scripts/*.sh`에서 `FRONTEND` 관련 환경 변수를 삭제할 수 있습니다.  
하지만 삭제하지 않아도 문제는 없습니다.

---

## 클라이언트 생성

### 자동 생성

1. 백엔드 가상 환경을 활성화합니다.
2. 프로젝트 최상위 디렉토리에서 다음 스크립트를 실행합니다:

```bash
./scripts/generate-frontend-client.sh
```

3. 변경 사항을 커밋합니다.

---

### 수동 생성

1. Docker Compose 스택을 시작합니다.
2. [http://localhost/api/v1/openapi.json](http://localhost/api/v1/openapi.json)에서 OpenAPI JSON 파일을 다운로드하여 `frontend` 디렉토리에 `openapi.json` 이름으로 저장합니다.
3. 생성된 클라이언트 코드의 이름을 간소화하려면 다음 스크립트를 실행합니다:

```bash
node modify-openapi-operationids.js
```

4. 프론트엔드 클라이언트를 생성하려면 다음 명령어를 실행합니다:

```bash
npm run generate-client
```

5. 변경 사항을 커밋합니다.

**참고**: 백엔드가 변경되면(OpenAPI 스키마 변경), 위 단계를 반복하여 프론트엔드 클라이언트를 업데이트해야 합니다.

---

## 원격 API 사용

원격 API를 사용하려면 환경 변수 `VITE_API_URL`을 원격 API의 URL로 설정하세요.  
예를 들어, `frontend/.env` 파일에서 다음과 같이 설정할 수 있습니다:

```env
VITE_API_URL=https://api.my-domain.example.com
```

이후 프론트엔드를 실행하면 해당 URL이 API의 기본 URL로 사용됩니다.

---

## 코드 구조

프론트엔드 코드는 다음과 같이 구조화되어 있습니다:

- `frontend/src` - 주요 프론트엔드 코드.
- `frontend/src/assets` - 정적 자산.
- `frontend/src/client` - 생성된 OpenAPI 클라이언트.
- `frontend/src/components` - 프론트엔드의 다양한 컴포넌트.
- `frontend/src/hooks` - 커스텀 훅.
- `frontend/src/routes` - 프론트엔드의 페이지를 포함한 라우트.
- `theme.tsx` - Chakra UI 커스텀 테마.

---

## Playwright를 사용한 엔드투엔드(E2E) 테스트

프론트엔드에는 Playwright를 사용한 초기 E2E 테스트가 포함되어 있습니다.

1. Docker Compose 스택을 실행합니다:

```bash
docker compose up -d --wait backend
```

2. 다음 명령어로 테스트를 실행합니다:

```bash
npx playwright test
```

3. UI 모드에서 브라우저를 실행하며 테스트를 실행하려면:

```bash
npx playwright test --ui
```

4. 테스트 데이터를 제거하고 Docker Compose 스택을 중지하려면:

```bash
docker compose down -v
```

5. 테스트를 업데이트하려면 테스트 디렉토리에서 기존 테스트 파일을 수정하거나 새 파일을 추가하세요.

Playwright 테스트 작성 및 실행에 대한 자세한 내용은 [공식 Playwright 문서](https://playwright.dev/docs/intro)를 참고하세요.