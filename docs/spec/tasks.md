# 작업 목록

## 1. 모노레포 환경 설정

- [ ] Turborepo 또는 Lerna를 사용하여 모노레포 초기 설정
- [ ] `packages`와 `apps` 디렉토리 구조 생성
- [ ] ESLint, Prettier, TypeScript 등 개발 환경 설정 공유

## 2. 코어 라이브러리 리팩터링 (`packages/core`)

- [ ] 기존 `src` 디렉토리를 `packages/core`로 이동
- [ ] `SchemaFormProvider` 컴포넌트 및 컨텍스트 구현
- [ ] `UIAdapter` 인터페이스 및 관련 타입 정의
- [ ] 기본 HTML 렌더링을 제공하는 `defaultAdapter` 구현
- [ ] `FieldRenderer`가 `SchemaFormProvider`의 컨텍스트를 사용하도록 수정
- [ ] `SchemaForm`이 `adapter` prop을 받도록 수정하고, `SchemaFormProvider`를 내장하도록 변경
- [ ] `useSchemaForm`에서 UI 관련 로직 제거

## 3. UI 어댑터 패키지 개발

- [ ] Material-UI 어댑터 패키지(`packages/adapter-mui`) 생성
  - [ ] `UIAdapter` 인터페이스를 구현하는 `muiAdapter` 개발
  - [ ] 각 필드 타입에 맞는 Material-UI 컴포넌트(TextField, Checkbox, Select 등) 래핑
- [ ] (선택) Ant Design 어댑터 패키지(`packages/adapter-antd`) 생성
- [ ] (선택) Chakra UI 어댑터 패키지(`packages/adapter-chakra`) 생성

## 4. 데모 및 문서 업데이트 (`apps/demo`, `apps/docs`)

- [ ] 데모 애플리케이션(`apps/demo`)을 `packages/core`와 UI 어댑터를 사용하도록 업데이트
  - [ ] 기본 어댑터 사용 예제 추가
  - [ ] Material-UI 어댑터 사용 예제 추가
- [ ] 문서(`apps/docs`) 업데이트
  - [ ] 새로운 아키텍처에 대한 설명 추가
  - [ ] UI 어댑터 사용법 및 API 문서화
  - [ ] 커스텀 어댑터 제작 가이드 추가

## 5. 테스트 및 배포

- [ ] 리팩터링된 코드에 대한 단위 및 통합 테스트 작성/수정
- [ ] 각 패키지에 대한 빌드 및 배포 스크립트 작성
- [ ] NPM에 각 패키지 배포 준비