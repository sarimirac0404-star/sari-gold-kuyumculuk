// Server-only admin password helper.
// Reads ADMIN_PASSWORD from the server environment. Falls back to the
// legacy hardcoded PIN only when the secret is not yet configured, so the
// app keeps working during the rotation window.
const FALLBACK = "325641";

export function getAdminPassword(): string {
  return process.env.ADMIN_PASSWORD || FALLBACK;
}

export function isValidAdminPassword(input: string): boolean {
  return typeof input === "string" && input.length > 0 && input === getAdminPassword();
}
