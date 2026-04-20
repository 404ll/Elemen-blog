export function slugify(value: string): string {
  return value
    .toLowerCase()
    .trim()
    .replace(/[`~!@#$%^&*()+=\[\]{}|\\;:'",.<>/?]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");
}
