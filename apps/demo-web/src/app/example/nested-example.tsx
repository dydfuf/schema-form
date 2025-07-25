import { z } from "zod";
import { SchemaForm } from "@schema-form/core";

// Define a nested Zod schema
const addressSchema = z.object({
  street: z.string().min(1, "주소를 입력해주세요"),
  city: z.string().min(1, "도시를 입력해주세요"),
  zipCode: z.string().regex(/^\d{5}$/, "우편번호는 5자리 숫자여야 합니다"),
  country: z.enum(["KR", "US", "JP", "CN"]).default("KR"),
});

const profileSchema = z.object({
  firstName: z.string().min(1, "이름을 입력해주세요"),
  lastName: z.string().min(1, "성을 입력해주세요"),
  email: z.string().email("올바른 이메일 주소를 입력해주세요"),
  phone: z.string().optional(),
  address: addressSchema,
  preferences: z.object({
    newsletter: z.boolean().default(false),
    notifications: z.boolean().default(true),
    theme: z.enum(["light", "dark", "auto"]).default("auto"),
  }),
  tags: z.array(z.string()).default([]),
  birthYear: z.number().min(1900).max(new Date().getFullYear()).optional(),
});

type ProfileFormData = z.infer<typeof profileSchema>;

export function NestedExample() {
  const handleSubmit = (data: ProfileFormData) => {
    console.log("Profile submitted:", data);
    alert(`프로필이 저장되었습니다: ${data.firstName} ${data.lastName}`);
  };

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-6 text-gray-800">프로필 설정</h2>

      <SchemaForm
        schema={profileSchema}
        onSubmit={handleSubmit}
        defaultValues={
          {
            preferences: {
              newsletter: false,
              notifications: true,
              theme: "light",
            },
          } as any
        }
        className="space-y-6"
      >
        {/* Custom content can be added here */}
        <div className="bg-blue-50 p-4 rounded-md">
          <p className="text-sm text-blue-700">
            💡 모든 필드는 실시간으로 검증됩니다.
          </p>
        </div>
      </SchemaForm>
    </div>
  );
}

// Usage example with custom field renderers:
//
// import { StringField } from '../src'
//
// const CustomStringField = (props) => (
//   <div className="custom-field">
//     <StringField {...props} className="custom-input" />
//   </div>
// )
//
// <SchemaForm
//   schema={profileSchema}
//   onSubmit={handleSubmit}
//   fieldRenderers={{
//     string: CustomStringField
//   }}
// />
