# 릴리즈 노트

## 최신 변경 사항

### 새로운 기능

- ✨ **E2E 테스트 전용 비공개 로컬 API 추가**. [PR #1429](https://github.com/fastapi/full-stack-fastapi-template/pull/1429) 작성자: [@patrick91](https://github.com/patrick91)  
- ✨ **최신 `openapi-ts`로 마이그레이션**. [PR #1430](https://github.com/fastapi/full-stack-fastapi-template/pull/1430) 작성자: [@patrick91](https://github.com/patrick91)

---

### 코드 리팩토링

- 🎨 **`prefix` 및 `tags`를 라우터로 이동**. [PR #1439](https://github.com/fastapi/full-stack-fastapi-template/pull/1439) 작성자: [@patrick91](https://github.com/patrick91)  
- ♻️ **`id` 수정 스크립트를 제거하고 `openapi-ts` 구성으로 대체**. [PR #1434](https://github.com/fastapi/full-stack-fastapi-template/pull/1434) 작성자: [@patrick91](https://github.com/patrick91)  
- 👷 **Playwright CI 속도 향상**: 샤딩(병렬 실행), Docker를 사용한 캐시 활용, 환경 변수 사용. [PR #1405](https://github.com/fastapi/full-stack-fastapi-template/pull/1405) 작성자: [@tiangolo](https://github.com/tiangolo)  
- ♻️ **`PaginationFooter` 컴포넌트 추가**. [PR #1381](https://github.com/fastapi/full-stack-fastapi-template/pull/1381) 작성자: [@saltie2193](https://github.com/saltie2193)  
- ♻️ **설정의 암호화 알고리즘 이름을 사용하도록 코드 일관성 개선**. [PR #1160](https://github.com/fastapi/full-stack-fastapi-template/pull/1160) 작성자: [@sameeramin](https://github.com/sameeramin)

---

### 문서 업데이트

- 📝 **`frontend/README.md` 업데이트**: 프론트엔드를 제거할 때 Playwright도 제거하는 방법 추가. [PR #1452](https://github.com/fastapi/full-stack-fastapi-template/pull/1452) 작성자: [@youben11](https://github.com/youben11)  
- 📝 **`deployment.md` 업데이트**: 비루트 VM에 GitHub Runner를 설치하는 방법 추가. [PR #1412](https://github.com/fastapi/full-stack-fastapi-template/pull/1412) 작성자: [@tiangolo](https://github.com/tiangolo)  
- 📝 **`development.md`에 MailCatcher 추가**. [PR #1387](https://github.com/fastapi/full-stack-fastapi-template/pull/1387) 작성자: [@tobiase](https://github.com/tobiase)

---

### 내부 변경

- ⬆ **`astral-sh/setup-uv`를 4에서 5로 업그레이드**. [PR #1453](https://github.com/fastapi/full-stack-fastapi-template/pull/1453) 작성자: [@dependabot[bot]](https://github.com/apps/dependabot)  
- 👷 **`labeler.yml` 업데이트**. [PR #1388](https://github.com/fastapi/full-stack-fastapi-template/pull/1388) 작성자: [@tiangolo](https://github.com/tiangolo)  
- 🔧 **Docker에서 로그 출력을 직접적으로 제공하기 위해 `ENV PYTHONUNBUFFERED=1` 추가**. [PR #1378](https://github.com/fastapi/full-stack-fastapi-template/pull/1378) 작성자: [@tiangolo](https://github.com/tiangolo)

---

### 버전 0.7.1 주요 업데이트

- Poetry를 [`uv`](https://github.com/astral-sh/uv)로 마이그레이션.  
- Docker Compose 파일, Traefik Dockerfile 간소화 및 개선.  
- API와 프론트엔드 분리 배포를 위한 기본 도메인 구성 (`api.example.com`, `dashboard.example.com`).  
- Docker Compose의 백엔드와 프론트엔드가 로컬 개발 서버와 동일한 포트를 사용하도록 조정.  

---

필요한 추가 번역이 있으면 알려주세요! 😊