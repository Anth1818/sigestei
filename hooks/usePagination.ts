import { useState, useMemo } from "react";

export const usePagination = <T>(items: T[], initialRowsPerPage: number = 10) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(initialRowsPerPage);

  const paginatedItems = useMemo(() => {
    const startIdx = (currentPage - 1) * rowsPerPage;
    const endIdx = startIdx + rowsPerPage;
    return items.slice(startIdx, endIdx);
  }, [items, currentPage, rowsPerPage]);

  const totalPages = Math.max(1, Math.ceil(items.length / rowsPerPage));

  const changePage = (newPage: number) => {
    setCurrentPage(newPage);
  };

  const changeRowsPerPage = (newRowsPerPage: number) => {
    setRowsPerPage(newRowsPerPage);
    setCurrentPage(1);
  };

  return {
    currentPage,
    rowsPerPage,
    paginatedItems,
    totalPages,
    changePage,
    changeRowsPerPage,
    setCurrentPage,
  };
};