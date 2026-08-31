import { describe, expect, it } from "vitest";

import { getPaginationMeta, normalizePage, paginate } from "./pagination";

describe("paginate", () => {
  it("returns the first five items and metadata for page one", () => {
    const result = paginate([1, 2, 3, 4, 5, 6, 7], { page: 1, pageSize: 5 });

    expect(result.items).toEqual([1, 2, 3, 4, 5]);
    expect(result.pagination).toEqual({
      page: 1,
      pageSize: 5,
      totalItems: 7,
      totalPages: 2,
      hasNextPage: true,
      hasPreviousPage: false,
    });
  });

  it("returns the remaining items and navigation state for page two", () => {
    const result = paginate([1, 2, 3, 4, 5, 6, 7], { page: 2, pageSize: 5 });

    expect(result.items).toEqual([6, 7]);
    expect(result.pagination.hasNextPage).toBe(false);
    expect(result.pagination.hasPreviousPage).toBe(true);
  });

  it("returns no items and zero pages for an empty list", () => {
    const result = paginate([], { page: 1, pageSize: 5 });

    expect(result.items).toEqual([]);
    expect(result.pagination.totalPages).toBe(0);
  });
});

describe("getPaginationMeta", () => {
  it("reports page two of three with both navigation directions available", () => {
    const result = getPaginationMeta(12, { page: 2, pageSize: 5 });

    expect(result).toEqual({
      page: 2,
      pageSize: 5,
      totalItems: 12,
      totalPages: 3,
      hasNextPage: true,
      hasPreviousPage: true,
    });
  });
});

describe("normalizePage", () => {
  it("normalizes undefined, nonnumeric, and below-one values to one", () => {
    expect(normalizePage(undefined, 5)).toBe(1);
    expect(normalizePage("not-a-number", 5)).toBe(1);
    expect(normalizePage(0, 5)).toBe(1);
  });

  it("caps values above the maximum page", () => {
    expect(normalizePage(9, 5)).toBe(5);
  });
});
