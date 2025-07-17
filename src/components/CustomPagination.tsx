"use client";

import React from "react";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { cn } from "@/lib/utils";

interface CustomPaginationProps {
  currentPage: number;
  totalItems: number;
  itemsPerPage: number;
  onPageChange: (page: number) => void;
  className?: string;
  showInfo?: boolean;
  maxVisiblePages?: number;
}

const CustomPagination: React.FC<CustomPaginationProps> = ({
  currentPage,
  totalItems,
  itemsPerPage,
  onPageChange,
  className,
  showInfo = true,
  maxVisiblePages = 5,
}) => {
  const totalPages = Math.ceil(totalItems / itemsPerPage);

  // Don't render pagination if there's only one page or less
  if (totalPages <= 1) return null;

  const handlePrevious = () => {
    if (currentPage > 1) {
      onPageChange(currentPage - 1);
    }
  };

  const handleNext = () => {
    if (currentPage < totalPages) {
      onPageChange(currentPage + 1);
    }
  };

  const generatePageNumbers = () => {
    const pages: (number | "ellipsis")[] = [];

    if (totalPages <= maxVisiblePages) {
      // Show all pages if total pages is less than max visible
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      // Always show first page
      pages.push(1);

      // Calculate start and end for middle pages
      let start = Math.max(2, currentPage - Math.floor(maxVisiblePages / 2));
      let end = Math.min(totalPages - 1, start + maxVisiblePages - 3);

      // Adjust start if end is at the boundary
      if (end === totalPages - 1) {
        start = Math.max(2, end - maxVisiblePages + 3);
      }

      // Add ellipsis if there's a gap after first page
      if (start > 2) {
        pages.push("ellipsis");
      }

      // Add middle pages
      for (let i = start; i <= end; i++) {
        pages.push(i);
      }

      // Add ellipsis if there's a gap before last page
      if (end < totalPages - 1) {
        pages.push("ellipsis");
      }

      // Always show last page
      pages.push(totalPages);
    }

    return pages;
  };

  const pageNumbers = generatePageNumbers();

  return (
    <div
      className={cn(
        "flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4",
        className
      )}
    >
      {/* Pagination Info */}
      {showInfo && (
        <div className="flex-shrink-0">
          <p className="text-sm theme-text-muted">
            Showing {Math.min(itemsPerPage * (currentPage - 1) + 1, totalItems)}{" "}
            to {Math.min(itemsPerPage * currentPage, totalItems)} of{" "}
            {totalItems} results
          </p>
        </div>
      )}

      {/* Pagination Controls */}
      <Pagination
        className={cn(
          "theme-text-primary",
          showInfo ? "sm:justify-end" : "justify-center"
        )}
      >
        <PaginationContent>
          {/* Previous Button */}
          <PaginationItem>
            <PaginationPrevious
              onClick={handlePrevious}
              className={cn(
                "cursor-pointer transition-colors",
                currentPage === 1
                  ? "opacity-50 cursor-not-allowed pointer-events-none"
                  : "hover:theme-bg-muted theme-border"
              )}
            />
          </PaginationItem>

          {/* Page Numbers */}
          {pageNumbers.map((page, index) => (
            <PaginationItem key={index}>
              {page === "ellipsis" ? (
                <PaginationEllipsis className="theme-text-muted" />
              ) : (
                <PaginationLink
                  onClick={() => onPageChange(page)}
                  isActive={currentPage === page}
                  className={cn(
                    "cursor-pointer transition-colors",
                    currentPage === page
                      ? "theme-bg-primary theme-text-primary-foreground border-transparent"
                      : "theme-border hover:theme-bg-muted theme-text-primary"
                  )}
                >
                  {page}
                </PaginationLink>
              )}
            </PaginationItem>
          ))}

          {/* Next Button */}
          <PaginationItem>
            <PaginationNext
              onClick={handleNext}
              className={cn(
                "cursor-pointer transition-colors",
                currentPage === totalPages
                  ? "opacity-50 cursor-not-allowed pointer-events-none"
                  : "hover:theme-bg-muted theme-border"
              )}
            />
          </PaginationItem>
        </PaginationContent>
      </Pagination>

      {/* Additional Page Info */}
      {/* {showInfo && (
        <div className="text-center">
          <p className="text-xs theme-text-muted">
            Page {currentPage} of {totalPages}
          </p>
        </div>
      )} */}
    </div>
  );
};

export default CustomPagination;
