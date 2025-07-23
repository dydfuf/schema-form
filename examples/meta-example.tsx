import { z } from "zod";
import {
  SchemaForm,
  createStringMeta,
  createNumberMeta,
  createBooleanMeta,
} from "../src";

const metaSchema = z.object({
  username: z
    .string()
    .min(3, "사용자명은 최소 3자 이상이어야 합니다")
    .meta(
      createStringMeta({
        label: "사용자명",
        placeholder: "사용자명을 입력하세요",
        className: "border-2 border-blue-300 focus:border-blue-500",
        description: "3자 이상의 고유한 사용자명을 입력하세요",
        variant: "text",
      })
    ),

  email: z
    .string()
    .email("올바른 이메일 형식이 아닙니다")
    .meta(
      createStringMeta({
        label: "이메일 주소",
        placeholder: "example@domain.com",
        className: "border-2 border-green-300 focus:border-green-500",
        description: "알림을 받을 이메일 주소를 입력하세요",
        variant: "email",
      })
    ),

  password: z
    .string()
    .min(8, "비밀번호는 최소 8자 이상이어야 합니다")
    .meta(
      createStringMeta({
        label: "비밀번호",
        placeholder: "안전한 비밀번호를 입력하세요",
        className: "border-2 border-red-300 focus:border-red-500",
        description: "8자 이상의 안전한 비밀번호를 설정하세요",
        variant: "password",
      })
    ),

  age: z
    .number()
    .min(18, "18세 이상이어야 합니다")
    .max(100, "100세 이하여야 합니다")
    .meta(
      createNumberMeta({
        label: "나이",
        placeholder: "나이를 입력하세요",
        className: "border-2 border-purple-300 focus:border-purple-500",
        description: "만 나이를 입력하세요 (18-100세)",
        variant: "number",
      })
    ),

  bio: z
    .string()
    .optional()
    .meta(
      createStringMeta({
        label: "자기소개",
        placeholder: "간단한 자기소개를 작성해주세요",
        className:
          "border-2 border-yellow-300 focus:border-yellow-500 h-24 resize-none",
        description: "선택사항: 자신을 소개하는 글을 작성해주세요",
        variant: "textarea",
      })
    ),

  newsletter: z
    .boolean()
    .default(false)
    .meta(
      createBooleanMeta({
        variant: "checkbox",
        label: "뉴스레터 구독",
        description: "최신 소식과 업데이트를 이메일로 받아보시겠습니까?",
        className: "text-indigo-600 focus:ring-indigo-500",
      })
    ),
});

type MetaFormData = z.infer<typeof metaSchema>;

export function MetaExample() {
  const handleSubmit = (data: MetaFormData) => {
    console.log("Meta Example Form Data:", data);
    alert(`폼이 제출되었습니다!\n\n${JSON.stringify(data, null, 2)}`);
  };

  return (
    <div className="space-y-6">
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <h3 className="text-lg font-semibold text-blue-900 mb-2">
          🎨 Meta 기능 데모
        </h3>
        <p className="text-blue-700">
          Zod v4의 <code className="bg-blue-100 px-1 rounded">.meta()</code>{" "}
          메서드를 사용하여 각 필드에 커스텀 스타일, placeholder, 설명 등을
          적용한 예제입니다.
        </p>
      </div>

      <div className="bg-white border rounded-lg p-6">
        <SchemaForm
          schema={metaSchema}
          onSubmit={handleSubmit}
          defaultValues={{
            newsletter: false,
          }}
          submitButton={(isSubmitting, isValid) => (
            <button
              type="submit"
              disabled={isSubmitting || !isValid}
              className="w-full bg-gradient-to-r from-blue-500 to-purple-600 text-white py-3 px-4 rounded-lg font-medium hover:from-blue-600 hover:to-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
            >
              {isSubmitting ? "제출 중..." : "계정 생성"}
            </button>
          )}
        />
      </div>

      <div className="bg-gray-50 border rounded-lg p-4">
        <h4 className="font-semibold text-gray-900 mb-2">💡 Meta 기능 특징:</h4>
        <ul className="text-sm text-gray-700 space-y-1">
          <li>
            • <strong>label</strong>: 필드 라벨 커스터마이징
          </li>
          <li>
            • <strong>placeholder</strong>: 입력 힌트 텍스트
          </li>
          <li>
            • <strong>className</strong>: 커스텀 CSS 클래스
          </li>
          <li>
            • <strong>description</strong>: 필드 설명 텍스트
          </li>
          <li>
            • <strong>props</strong>: 추가 HTML 속성 (type, rows 등)
          </li>
        </ul>
      </div>
    </div>
  );
}
