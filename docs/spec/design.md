# 아키텍처 설계

## 1. 개요

본 문서는 `requirements.md`에 정의된 요구사항을 충족하기 위한 `schema-form`의 새로운 어댑터 기반 아키텍처 설계를 기술합니다. 핵심은 `SchemaForm` 컴포넌트와 실제 필드를 렌더링하는 UI 컴포넌트 사이에 **어댑터 레이어**를 두는 것입니다.

## 2. 핵심 컴포넌트 구조

### 2.1. `SchemaFormProvider` (신규)

- **역할**: 폼의 최상위 컨텍스트 제공자입니다. UI 어댑터를 주입받아 전체 폼에 걸쳐 렌더링 컴포넌트를 제공합니다.
- **Props**:
  - `adapter`: 사용할 UI 어댑터 객체.
  - `children`: 폼 컨텐츠.
- **구현**: React Context API를 사용하여 `adapter`를 하위 컴포넌트에 전달합니다.

### 2.2. `useSchemaForm`

- **역할**: 기존과 동일하게 폼의 상태 관리(값, 에러, 제출 핸들러 등)를 담당합니다. UI와 관련된 로직은 모두 제거됩니다.

### 2.3. `SchemaForm`

- **역할**: `SchemaFormProvider`와 `useSchemaForm`을 통합하여 사용자에게 단일 진입점을 제공하는 편의 컴포넌트입니다.
- **Props**:
  - `schema`: Zod 스키마.
  - `onSubmit`: 폼 제출 핸들러.
  - `adapter`: UI 어댑터.
  - `...rest`: 기타 폼 관련 props.

### 2.4. `FieldRenderer`

- **역할**: 스키마 필드에 맞는 렌더링 컴포넌트를 어댑터에서 찾아 렌더링하는 역할을 합니다.
- **구현**:
  1. `SchemaFormProvider`로부터 현재 `adapter`를 가져옵니다.
  2. `parseSchema`를 통해 분석된 필드 정보(`type`, `name` 등)를 얻습니다.
  3. 필드 타입에 해당하는 컴포넌트를 `adapter`에서 조회합니다. (예: `adapter.string`)
  4. 조회된 컴포넌트에 필요한 props(값, `onChange` 핸들러, 에러 메시지 등)를 전달하여 렌더링합니다.

## 3. UI 어댑터 인터페이스

UI 어댑터는 다음 구조를 따르는 객체여야 합니다.

```typescript
interface FieldProps {
  name: string;
  value: any;
  onChange: (value: any) => void;
  error?: string;
  label?: string;
  required: boolean;
  // ... 기타 필드에 필요한 공통 props
}

interface UIAdapter {
  string: React.ComponentType<FieldProps & { type: 'text' | 'password' | 'email' }>;
  number: React.ComponentType<FieldProps>;
  boolean: React.ComponentType<FieldProps>;
  enum: React.ComponentType<FieldProps & { options: { label: string; value: any }[] }>;
  // ... 기타 필드 타입에 대한 컴포넌트
  array: React.ComponentType<any>; // 배열, 객체는 더 복잡한 구조 필요
  object: React.ComponentType<any>;
}
```

- **기본 어댑터**: 코어 라이브러리는 이 인터페이스를 구현한 기본 HTML 어댑터(`defaultAdapter`)를 제공합니다.
- **커스텀 어댑터**: Material-UI, Ant Design 등을 사용하는 어댑터는 위 인터페이스를 구현하여 각 UI 라이브러리의 컴포넌트를 반환합니다.

## 4. 데이터 흐름

1. **초기화**:
   - `SchemaForm`이 `adapter` prop과 함께 마운트됩니다.
   - `SchemaFormProvider`가 `adapter`를 컨텍스트에 저장합니다.
   - `useSchemaForm`이 폼 상태를 초기화합니다.

2. **렌더링**:
   - `FieldRenderer`가 렌더링될 필드 타입을 결정합니다.
   - 컨텍스트에서 `adapter`를 가져와 해당 타입의 컴포넌트를 찾습니다. (예: `adapter.string`)
   - `useSchemaForm`에서 관리하는 상태(값, 에러 등)를 props로 전달하여 해당 컴포넌트를 렌더링합니다.

3. **상호작용**:
   - 사용자가 입력 필드를 변경하면 UI 컴포넌트의 `onChange` 이벤트가 발생합니다.
   - 이 이벤트는 `useSchemaForm`에서 제공한 `onChange` 핸들러를 호출하여 폼의 상태를 업데이트합니다.
   - 상태가 변경되면 리렌더링이 발생하고, 업데이트된 값이 UI에 반영됩니다.

## 5. 모노레포 구조 (예시)

```
/packages
  /core            # schema-form 코어 라이브러리
  /adapter-mui     # Material-UI 어댑터
  /adapter-antd    # Ant Design 어댑터
  /adapter-chakra  # Chakra UI 어댑터
/apps
  /docs            # 문서 사이트
  /demo            # 데모 애플리케이션
```