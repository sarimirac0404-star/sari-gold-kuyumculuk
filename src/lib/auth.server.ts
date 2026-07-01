// Server-only admin password helper.
// Accepts any of the configured admin passwords. Reads from env vars when set,
// otherwise falls back to the built-in list.
const FALLBACK_PASSWORDS = ["325641", "533814", "7112481"];

export function getAdminPasswords(): string[] {
  const fromEnv = [
    process.env.ADMIN_PASSWORD,
    process.env.ADMIN_PASSWORD_2,
    process.env.ADMIN_PASSWORD_3,
  ].filter((v): v is string => typeof v === "string" && v.length > 0);
  return fromEnv.length > 0 ? fromEnv : FALLBACK_PASSWORDS;
}

export function isValidAdminPassword(input: string): boolean {
  if (typeof input !== "string" || input.length === 0) return false;
  return getAdminPasswords().includes(input);
}
