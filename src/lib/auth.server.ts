// Server-only admin password helper.
// Admin login requires ALL THREE passwords entered correctly.
// The client sends them combined as "p1|p2|p3".
const FALLBACK = ["325641", "533814", "7112481"] as const;

export function getAdminPasswords(): [string, string, string] {
  const a = process.env.ADMIN_PASSWORD_1 || FALLBACK[0];
  const b = process.env.ADMIN_PASSWORD_2 || FALLBACK[1];
  const c = process.env.ADMIN_PASSWORD_3 || FALLBACK[2];
  return [a, b, c];
}

export function isValidAdminPassword(input: string): boolean {
  if (typeof input !== "string" || input.length === 0) return false;
  const parts = input.split("|");
  if (parts.length !== 3) return false;
  const expected = getAdminPasswords();
  return parts[0] === expected[0] && parts[1] === expected[1] && parts[2] === expected[2];
}
