# Schema Form Library

Zod 스키마를 입력받아 type-safe한 React 폼을 자동으로 생성하는 라이브러리입니다. react-hook-form과 통합되어 강력한 폼 검증과 타입 안전성을 제공합니다.

## 특징

- 🛡️ **Type Safety**: Zod 스키마를 통한 완전한 TypeScript 타입 안전성
- ⚡ **Easy to Use**: 스키마만 정의하면 자동으로 폼 생성
- 🎨 **Customizable**: 커스텀 필드 렌더러를 통한 UI 커스터마이징
- 🔧 **React Hook Form**: 검증된 폼 라이브러리와의 완벽한 통합
- 📝 **Rich Validation**: Zod의 강력한 검증 기능 활용

## 설치

```bash
npm install @raon/schema-form react react-hook-form zod
# 또는
yarn add @raon/schema-form react react-hook-form zod
```

## 기본 사용법

```tsx
import React from "react";
import { z } from "zod";
import { SchemaForm } from "@raon/schema-form";

// Zod 스키마 정의
const userSchema = z.object({
  name: z.string().min(2, "이름은 최소 2글자 이상이어야 합니다"),
  email: z.string().email("올바른 이메일 주소를 입력해주세요"),
  age: z.number().min(18, "18세 이상이어야 합니다"),
  isSubscribed: z.boolean().default(false),
  role: z.enum(["user", "admin", "moderator"]),
});

type UserFormData = z.infer<typeof userSchema>;

function UserForm() {
  const handleSubmit = (data: UserFormData) => {
    console.log("Form submitted:", data);
    // 타입 안전한 데이터 처리
  };

  return (
    <SchemaForm
      schema={userSchema}
      onSubmit={handleSubmit}
      defaultValues={{
        isSubscribed: true,
      }}
    />
  );
}
```

## 고급 사용법

### 중첩된 객체

```tsx
const profileSchema = z.object({
  name: z.string(),
  address: z.object({
    street: z.string(),
    city: z.string(),
    zipCode: z.string()
  }),
  preferences: z.object({
    newsletter: z.boolean(),
    theme: z.enum(['light', 'dark'])
  })
})

<SchemaForm schema={profileSchema} onSubmit={handleSubmit} />
```

### 커스텀 필드 렌더러

```tsx
import { StringField } from '@raon/schema-form'

const CustomStringField = (props) => (
  <div className="custom-field">
    <StringField {...props} className="custom-input" />
  </div>
)

<SchemaForm
  schema={userSchema}
  onSubmit={handleSubmit}
  fieldRenderers={{
    string: CustomStringField
  }}
/>
```

### useSchemaForm 훅 사용

```tsx
import { useSchemaForm } from "@raon/schema-form";

function CustomForm() {
  const { form, errors, isSubmitting, isValid } = useSchemaForm({
    schema: userSchema,
  });

  const onSubmit = form.handleSubmit((data) => {
    console.log(data);
  });

  return (
    <form onSubmit={onSubmit}>
      <input {...form.register("name")} />
      {errors.name && <span>{errors.name}</span>}

      <button type="submit" disabled={isSubmitting}>
        {isSubmitting ? "제출 중..." : "제출"}
      </button>
    </form>
  );
}
```

## API 참조

### SchemaForm Props

| Prop             | Type                                 | Description                   |
| ---------------- | ------------------------------------ | ----------------------------- |
| `schema`         | `ZodSchema`                          | Zod 스키마 객체               |
| `onSubmit`       | `(data: T) => void \| Promise<void>` | 폼 제출 핸들러                |
| `defaultValues`  | `Partial<T>`                         | 기본값 (선택사항)             |
| `className`      | `string`                             | CSS 클래스명 (선택사항)       |
| `fieldRenderers` | `Partial<FieldRendererMap>`          | 커스텀 필드 렌더러 (선택사항) |
| `submitButton`   | `ReactNode \| Function`              | 커스텀 제출 버튼 (선택사항)   |
| `resetButton`    | `ReactNode \| Function`              | 커스텀 리셋 버튼 (선택사항)   |

### 지원되는 Zod 타입

- `z.string()` - 텍스트 입력
- `z.number()` - 숫자 입력
- `z.boolean()` - 체크박스
- `z.date()` - 날짜 선택기
- `z.enum()` - 선택 드롭다운
- `z.object()` - 중첩된 객체
- `z.array()` - 배열 (개발 중)
- `z.optional()` - 선택적 필드
- `z.default()` - 기본값이 있는 필드

## 개발

```bash
# 의존성 설치
npm install

# 개발 서버 시작
npm run dev

# 라이브러리 빌드
npm run build:lib

# 테스트 실행
npm test

# 린팅
npm run lint
```

## 라이선스

MIT

## 기여

이슈나 풀 리퀘스트는 언제나 환영합니다!

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request
