import { useState, useMemo, useCallback } from "react";

interface DateSortable {
  createdAt?: string | any;
  updatedAt?: string | any;
  [key: string]: any;
}

type SortOrder = "asc" | "desc";

export function useClientPagination<T extends DateSortable>(
  data: T[],
  itemsPerPage: number = 15
) {
  const [currentPage, setCurrentPage] = useState(1);
  const [sortOrder, setSortOrder] = useState<SortOrder>("desc");

  const sortedData = useMemo(() => {
    return [...data].sort((a, b) => {
      const dateA = a.updatedAt || a.createdAt || "";
      const dateB = b.updatedAt || b.createdAt || "";

      if (sortOrder === "desc") {
        if (dateB > dateA) return 1;
        if (dateB < dateA) return -1;
        return 0;
      } else {
        if (dateA > dateB) return 1;
        if (dateA < dateB) return -1;
        return 0;
      }
    });
  }, [data, sortOrder]);

  const paginatedData = useMemo(() => {
    const endIndex = currentPage * itemsPerPage;
    return sortedData.slice(0, endIndex);
  }, [sortedData, currentPage, itemsPerPage]);

  const loadMore = useCallback(() => {
    if (paginatedData.length >= data.length) return;
    setCurrentPage((prev) => prev + 1);
  }, [paginatedData.length, data.length]);

  const toggleSort = useCallback(() => {
    setSortOrder((prev) => (prev === "desc" ? "asc" : "desc"));
  }, []);

  const resetPagination = useCallback(() => {
    setCurrentPage(1);
  }, []);

  return {
    data: paginatedData,
    totalCount: data.length,
    sortOrder,
    loadMore,
    toggleSort,
    resetPagination,
  };
}
