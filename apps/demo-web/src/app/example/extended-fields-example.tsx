import { z } from "zod";
import { SchemaForm } from "@schema-form/core";

// Extended fields schema with various new field types
const extendedSchema = z.object({
  // Literal field - read-only display
  terms: z.literal("I agree to the terms and conditions").meta({
    label: "Terms Agreement",
    description: "This is a read-only field showing literal text",
  }),

  // Email field
  email: z
    .string()
    .email()
    .meta({
      label: "Email Address",
      placeholder: "Enter your email",
      props: { type: "email" },
      description: "We'll use this to contact you",
    }),

  // Password field
  password: z
    .string()
    .min(8)
    .meta({
      label: "Password",
      placeholder: "Enter a secure password",
      props: { type: "password" },
      description: "Must be at least 8 characters long",
    }),

  // URL field
  website: z
    .string()
    .url()
    .meta({
      label: "Website",
      placeholder: "https://example.com",
      props: { type: "url", showPreview: true },
      description: "Your personal or company website",
    }),

  // Textarea field
  bio: z.string().meta({
    label: "Biography",
    placeholder: "Tell us about yourself...",
    props: { as: "textarea", rows: 4 },
    description: "A brief description about yourself",
  }),

  // Record field - dynamic key-value pairs
  metadata: z.record(z.string(), z.string()).meta({
    label: "Custom Metadata",
    description: "Add any custom key-value pairs",
    props: {
      keyPlaceholder: "Property name",
      valuePlaceholder: "Property value",
    },
  }),

  // Tuple field - fixed array with different types
  coordinates: z.tuple([z.number(), z.number()]).meta({
    label: "Coordinates",
    description: "Enter latitude and longitude",
    props: {
      layout: "horizontal",
      itemLabels: ["Latitude", "Longitude"],
    },
  }),

  // RGB color tuple
  favoriteColor: z
    .tuple([
      z.number().min(0).max(255),
      z.number().min(0).max(255),
      z.number().min(0).max(255),
    ])
    .meta({
      label: "Favorite Color (RGB)",
      description: "Enter RGB values (0-255)",
      props: {
        layout: "horizontal",
        itemLabels: ["Red", "Green", "Blue"],
      },
    }),

  // Mixed tuple with different types
  profile: z.tuple([z.string(), z.number(), z.boolean()]).meta({
    label: "Profile Info",
    description: "Name, age, and active status",
    props: {
      layout: "vertical",
      itemLabels: ["Full Name", "Age", "Is Active"],
    },
  }),

  // String with fieldType override
  customField: z.string().meta({
    label: "Custom Field",
    fieldType: "textarea",
    description:
      "This string field is rendered as a textarea using fieldType override",
  }),

  // Literal with different display types
  codeSnippet: z.literal("const hello = 'world';").meta({
    label: "Code Example",
    props: { as: "code" },
    description: "This literal is displayed as code",
  }),
});

type ExtendedFormData = z.infer<typeof extendedSchema>;

export function ExtendedFieldsExample() {
  const handleSubmit = (data: ExtendedFormData) => {
    console.log("Extended form data:", data);
    alert("Check the console for form data!");
  };

  // Note: SchemaForm doesn't have onError prop, errors are handled internally

  return (
    <div className="max-w-2xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">Extended Fields Example</h1>
      <p className="text-gray-600 mb-8">
        This example demonstrates the extended field types including literal,
        email, password, URL, textarea, record, and tuple fields.
      </p>

      <SchemaForm
        schema={extendedSchema}
        onSubmit={handleSubmit}
        defaultValues={{
          terms: "I agree to the terms and conditions",
          email: "",
          password: "",
          website: "",
          bio: "",
          metadata: {
            department: "Engineering",
            level: "Senior",
          },
          coordinates: [37.7749, -122.4194], // San Francisco
          favoriteColor: [255, 0, 128], // Pink
          profile: ["John Doe", 30, true],
          customField: "This will be rendered as a textarea",
          codeSnippet: "const hello = 'world';",
        }}
        submitButton={
          <button
            type="submit"
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
          >
            Submit Extended Form
          </button>
        }
        className="space-y-6"
      />
    </div>
  );
}
