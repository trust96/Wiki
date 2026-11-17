import { boolean, object, ref, string, ValidationError, type AnyObjectSchema, type InferType } from "yup";
import { codePointLength, trimUnicodeWhitespace } from "../../helper/identity";

// Prevent Yup from coercing numbers or booleans into credential strings.
const text = () => string().transform((_value, original: unknown) => original);
const trimmedText = () => text().transform((_value, original: unknown) => (typeof original === "string" ? trimUnicodeWhitespace(original) : original));
const email = () => trimmedText().email("Enter a valid email address.").required("Email is required.");
const password = () => trimmedText().required("Password is required.");
const newPassword = () =>
  password().test("password-length", "Password must contain 8-30 Unicode code points.", (value) => !value || (codePointLength(value) >= 8 && codePointLength(value) <= 30));
const confirmation = () => trimmedText().required("Password confirmation is required.").oneOf([ref("password")], "Passwords do not match.");
const token = () => text().required("Token is required.");

export const usernameValidation = trimmedText()
  .required("Username is required.")
  .matches(/^[A-Za-z0-9][A-Za-z0-9_-]{2,29}$/, "Username must contain 3-30 ASCII letters, numbers, underscores or hyphens, starting with a letter or number.");

export function registrationValidation(termsVersion: string) {
  if (!termsVersion) throw new Error("A published terms version must be configured.");
  return object({
    email: email(),
    username: usernameValidation,
    password: newPassword(),
    confirmPassword: confirmation(),
    termsAccepted: boolean().strict().required("Terms acceptance is required.").oneOf([true], "Terms must be accepted."),
    termsVersion: text().required("Terms version is required.").oneOf([termsVersion], "Accept the current terms version."),
  })
    .exact("Unknown request fields are not allowed.")
    .default(undefined)
    .required("A JSON object is required.");
}

export const loginValidation = object({
  identifier: trimmedText().required("Email or username is required."),
  password: password(),
})
  .exact("Unknown request fields are not allowed.")
  .default(undefined)
  .required("A JSON object is required.");

export const emailRequestValidation = object({ email: email() })
  .exact("Unknown request fields are not allowed.")
  .default(undefined)
  .required("A JSON object is required.");

export const verificationValidation = object({ token: token() })
  .exact("Unknown request fields are not allowed.")
  .default(undefined)
  .required("A JSON object is required.");

export const passwordResetValidation = object({
  token: token(),
  password: newPassword(),
  confirmPassword: confirmation(),
})
  .exact("Unknown request fields are not allowed.")
  .default(undefined)
  .required("A JSON object is required.");

export const emptyPayloadValidation = object({})
  .exact("Request fields are not allowed.")
  .default(undefined)
  .required("A JSON object is required.");

export class AuthValidationError extends Error {
  constructor(public readonly errors: Record<string, string[]>) {
    super("Request validation failed.");
    this.name = "AuthValidationError";
  }
}

export async function validateAuthPayload<T extends AnyObjectSchema>(schema: T, input: unknown): Promise<InferType<T>> {
  try {
    return await schema.validate(input, { abortEarly: false, stripUnknown: false });
  } catch (error) {
    if (!(error instanceof ValidationError)) throw error;
    const errors: Record<string, string[]> = Object.create(null);
    for (const issue of error.inner.length ? error.inner : [error]) {
      const field = issue.path || "_form";
      // Yup's default type errors include the rejected value, which may be a secret.
      const message = issue.type === "typeError" ? "Invalid field type." : issue.message;
      (errors[field] ??= []).push(message);
    }
    throw new AuthValidationError(errors);
  }
}
