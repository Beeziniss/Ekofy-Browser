export function getUserInitials(fullName: string): string {
  if (!fullName) return "";

  // Trim and split by whitespace, filtering out empty strings
  const parts = fullName.trim().split(/\s+/);

  if (parts.length === 0) return "";
  if (parts.length === 1) {
    // If only one word -> first letter
    return parts[0][0].toUpperCase();
  }

  // Take the first letter of the first and second words only
  const initials = parts
    .slice(0, 2)
    .map((p) => p[0].toUpperCase())
    .join("");
  return initials;
}
