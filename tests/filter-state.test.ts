import { describe, expect, it } from "vitest";

import {
  defaultFilters,
  filtersToQueryString,
  parseSearchFilters,
  normalizeFilters,
} from "@/lib/filters";

const buildSearchParams = (params: Record<string, string>) => {
  const query = new URLSearchParams();
  Object.entries(params).forEach(([key, value]) => query.set(key, value));
  return query;
};

describe("filters serialization", () => {
  it("parses URL params into strongly typed filters", () => {
    const params = buildSearchParams({
      q: "data",
      jenjang: "Diploma,Sarjana",
      status: "open",
      only_new: "true",
      page: "3",
      limit: "40",
    });

    const result = parseSearchFilters(params);

    expect(result.q).toBe("data");
    expect(result.jenjang).toEqual(["Diploma", "Sarjana"]);
    expect(result.status).toBe("open");
    expect(result.onlyNew).toBe(true);
    expect(result.page).toBe(3);
    expect(result.limit).toBe(40);
  });

  it("drops default values when serializing", () => {
    const query = filtersToQueryString({
      ...defaultFilters,
      q: "designer",
      status: "open",
    });

    expect(query).toBe("q=designer&status=open");
  });

  it("normalizes jenjang + prodi arrays", () => {
    const result = normalizeFilters({
      ...defaultFilters,
      jenjang: ["Diploma", "Invalid"],
      prodi: ["Teknik Informatika", "teknik informatika", "  "],
      page: -1,
      limit: 200,
    });

    expect(result.jenjang).toEqual(["Diploma"]);
    expect(result.prodi).toEqual(["Teknik Informatika"]);
    expect(result.page).toBe(1);
    expect(result.limit).toBe(100);
  });
});
