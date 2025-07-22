import { z } from "zod";
import { SchemaForm } from "../src";

// Define a Zod schema
const userSchema = z.object({
  name: z.string().min(2, "이름은 최소 2글자 이상이어야 합니다"),
  email: z.string().email("올바른 이메일 주소를 입력해주세요"),
  age: z
    .number()
    .min(18, "18세 이상이어야 합니다")
    .max(100, "100세 이하여야 합니다"),
  isSubscribed: z.boolean().default(false),
  role: z.enum(["user", "admin", "moderator"]),
  birthDate: z.date().optional(),
});

type UserFormData = z.infer<typeof userSchema>;

export function BasicExample() {
  const handleSubmit = (data: UserFormData) => {
    console.log("Form submitted:", data);
    alert(`안녕하세요, ${data.name}님!`);
  };

  return (
    <div className="max-w-md mx-auto p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-6 text-gray-800">사용자 등록</h2>

      <SchemaForm
        schema={userSchema}
        onSubmit={handleSubmit}
        defaultValues={{
          isSubscribed: true,
        }}
        className="space-y-4"
      />
    </div>
  );
}

// Usage in your app:
// import { BasicExample } from './examples/basic-example'
//
// function App() {
//   return (
//     <div className="min-h-screen bg-gray-100 py-8">
//       <BasicExample />
//     </div>
//   )
// }
