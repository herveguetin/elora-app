export const parseFields = (fields: { key: string; value: string }[]): Record<string, string> => {
  return fields.reduce((acc: Record<string, string>, field) => {
    acc[field.key] = field.value;
    return acc;
  }, {});
};
