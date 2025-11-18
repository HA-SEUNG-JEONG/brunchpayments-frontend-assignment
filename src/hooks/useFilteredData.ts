import { useMemo } from "react";

const matchesSearchQuery = <T>(item: T, query: string, fields: (keyof T)[]) => {
  if (!query.trim()) return true;

  const lowerQuery = query.toLowerCase();

  return fields.some((field) => {
    const fieldValue = String(item[field]).toLowerCase();
    return fieldValue.includes(lowerQuery);
  });
};

const matchesAllFilters = <T>(
  item: T,
  filters: Array<{ field: keyof T; value: string }>
) => {
  return filters.every(({ field, value }) =>
    value ? item[field] === value : true
  );
};

export const useFilteredData = <T>(
  data: T[],
  searchQuery: string,
  searchFields: (keyof T)[],
  exactFilters: Array<{ field: keyof T; value: string }>
) => {
  return useMemo(() => {
    return data.filter((item) => {
      const passesSearch = matchesSearchQuery(item, searchQuery, searchFields);
      const passesFilters = matchesAllFilters(item, exactFilters);

      return passesSearch && passesFilters;
    });
  }, [data, searchQuery, searchFields, exactFilters]);
};
