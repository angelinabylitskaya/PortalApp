export const removeEmptyFields = (data: { [field: string]: any }) => {
  return Object.entries(data).reduce(
    (result, [key, value]) => {
      if (value === undefined || value === null) {
        return result;
      }

      result[key] = value;
      return result;
    },
    {} as { [field: string]: any },
  );
};
