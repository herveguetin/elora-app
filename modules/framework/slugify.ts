/**
 * @see https://chatgpt.com/share/6851b200-b6b0-8003-84bb-ffc638ad2cd5
 */
export const slugify = (input: string, separator: string = '-'): string => {
  return input
    .toLowerCase()
    .normalize("NFD") // Normalize accented characters
    .replace(/[\u0300-\u036f]/g, "") // Remove diacritics
    .replace(/[^a-z0-9\s-]/g, "") // Remove invalid characters
    .trim() // Remove leading/trailing spaces
    .replace(/\s+/g, separator) // Replace spaces with hyphens
    .replace(/-+/g, separator); // Collapse multiple hyphens
};
