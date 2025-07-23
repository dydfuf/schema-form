import React from "react";
import { FieldError } from "react-hook-form";

/**
 * Standard error handling utilities for field components
 */

// Error message type that can be a string or a FieldError object
export type ErrorMessage = string | FieldError | undefined;

/**
 * Extracts a readable error message from various error formats
 */
export function getErrorMessage(error: ErrorMessage): string | undefined {
  if (!error) return undefined;

  if (typeof error === "string") {
    return error;
  }

  if (typeof error === "object" && error.message) {
    return error.message;
  }

  return undefined;
}

/**
 * Generates consistent error styling classes for input elements
 */
export function getErrorInputClasses(error: ErrorMessage): string {
  const hasError = !!getErrorMessage(error);
  return hasError
    ? "border-red-500 focus:ring-red-500 focus:border-red-500"
    : "";
}

/**
 * Generates consistent base input classes with error handling
 */
export function getBaseInputClasses(
  error: ErrorMessage,
  customClassName?: string
): string {
  const baseClasses =
    "w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-50 disabled:text-gray-500";

  const errorClasses = getErrorInputClasses(error);
  const customClasses = customClassName || "";

  return `${baseClasses} ${errorClasses} ${customClasses}`.trim();
}

/**
 * Renders a consistent error message component
 */
export function ErrorMessageComponent({
  error,
}: {
  error: ErrorMessage;
}): React.ReactElement | null {
  const message = getErrorMessage(error);

  if (!message) return null;

  return React.createElement(
    "p",
    { className: "text-sm text-red-600", role: "alert", "aria-live": "polite" },
    message
  );
}

/**
 * Sets appropriate ARIA attributes for error states
 */
export function getErrorAriaAttributes(error: ErrorMessage, fieldId: string) {
  const hasError = !!getErrorMessage(error);

  return {
    "aria-invalid": hasError,
    "aria-describedby": hasError ? `${fieldId}-error` : undefined,
  };
}

/**
 * Props for the FieldWrapper component
 */
export interface FieldWrapperProps {
  children: React.ReactNode;
  label?: string;
  description?: string;
  error: ErrorMessage;
  fieldId: string;
  required?: boolean;
}

/**
 * Renders a field wrapper with consistent error handling
 */
export function FieldWrapper({
  children,
  label,
  description,
  error,
  fieldId,
  required,
}: FieldWrapperProps): React.ReactElement {
  return React.createElement(
    "div",
    { className: "space-y-1" },
    label &&
      React.createElement(
        "label",
        {
          htmlFor: fieldId,
          className: "block text-sm font-medium text-gray-700",
        },
        label,
        required &&
          React.createElement("span", { className: "text-red-500 ml-1" }, "*")
      ),
    children,
    description &&
      React.createElement(
        "p",
        { className: "text-sm text-gray-500", id: `${fieldId}-description` },
        description
      ),
    React.createElement(
      "div",
      { id: `${fieldId}-error` },
      React.createElement(ErrorMessageComponent, { error })
    )
  );
}
