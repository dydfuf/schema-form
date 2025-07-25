"use client";

import { useState } from "react";
import { BasicExample } from "./basic-example";
import { NestedExample } from "./nested-example";
import { MetaExample } from "./meta-example";
import { ExtendedFieldsExample } from "./extended-fields-example";

type ExampleType = "basic" | "nested" | "meta" | "extended";

function App() {
  const [currentExample, setCurrentExample] = useState<ExampleType>("basic");

  const examples = {
    basic: {
      title: "기본 예제",
      description: "간단한 폼 필드들을 사용한 기본적인 예제입니다.",
      component: <BasicExample />,
    },
    nested: {
      title: "중첩 객체 예제",
      description: "중첩된 객체와 복잡한 스키마를 다루는 예제입니다.",
      component: <NestedExample />,
    },
    meta: {
      title: "Meta 기능 예제",
      description: "Zod v4의 meta 기능을 사용한 커스터마이징 예제입니다.",
      component: <MetaExample />,
    },
    extended: {
      title: "확장 필드 예제",
      description: "새로 추가된 다양한 필드 타입들을 보여주는 예제입니다.",
      component: <ExtendedFieldsExample />,
    },
  };

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                Schema Form Library
              </h1>
              <p className="text-gray-600 mt-1">
                Zod 스키마를 사용한 Type-safe React 폼 라이브러리
              </p>
            </div>
            <div className="flex space-x-4">
              <a
                href="https://github.com/your-username/schema-form"
                className="text-gray-500 hover:text-gray-700"
                target="_blank"
                rel="noopener noreferrer"
              >
                GitHub
              </a>
            </div>
          </div>
        </div>
      </header>

      {/* Navigation */}
      <nav className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex space-x-8">
            {Object.entries(examples).map(([key, example]) => (
              <button
                key={key}
                onClick={() => setCurrentExample(key as ExampleType)}
                className={`
                  py-4 px-1 border-b-2 font-medium text-sm
                  ${
                    currentExample === key
                      ? "border-blue-500 text-blue-600"
                      : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                  }
                `}
              >
                {example.title}
              </button>
            ))}
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            {examples[currentExample].title}
          </h2>
          <p className="text-gray-600">
            {examples[currentExample].description}
          </p>
        </div>

        {/* Example Component */}
        <div className="bg-white rounded-lg shadow-sm border p-8">
          {examples[currentExample].component}
        </div>

        {/* Features */}
        <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="text-center">
            <div className="bg-blue-100 rounded-full w-12 h-12 flex items-center justify-center mx-auto mb-4">
              <span className="text-blue-600 font-bold text-xl">🛡️</span>
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              Type Safety
            </h3>
            <p className="text-gray-600">
              Zod 스키마를 통한 완전한 TypeScript 타입 안전성을 제공합니다.
            </p>
          </div>

          <div className="text-center">
            <div className="bg-green-100 rounded-full w-12 h-12 flex items-center justify-center mx-auto mb-4">
              <span className="text-green-600 font-bold text-xl">⚡</span>
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              Easy to Use
            </h3>
            <p className="text-gray-600">
              스키마만 정의하면 자동으로 폼이 생성되어 개발 시간을 단축합니다.
            </p>
          </div>

          <div className="text-center">
            <div className="bg-purple-100 rounded-full w-12 h-12 flex items-center justify-center mx-auto mb-4">
              <span className="text-purple-600 font-bold text-xl">🎨</span>
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              Customizable
            </h3>
            <p className="text-gray-600">
              커스텀 필드 렌더러를 통해 원하는 대로 UI를 커스터마이징할 수
              있습니다.
            </p>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-white border-t mt-16">
        <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
          <p className="text-center text-gray-500">
            Built with React, TypeScript, Zod, and react-hook-form
          </p>
        </div>
      </footer>
    </div>
  );
}

export default App;
