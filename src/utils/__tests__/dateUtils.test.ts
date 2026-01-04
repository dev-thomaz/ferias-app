import { formatDate } from "../dateUtils";

describe("Date Utils", () => {
  it("should format a valid date string correctly", () => {
    const result = formatDate("2025-12-25T12:00:00");
    expect(result).toBe("25/12/25");
  });

  it("should format a Date object correctly", () => {
    const result = formatDate(new Date("2025-01-01T00:00:00Z"));

    expect(result).toMatch(/01\/01\/25|31\/12\/24/);
  });

  it("should return placeholder for null or undefined", () => {
    expect(formatDate(null)).toBe("--/--/--");
    expect(formatDate(undefined)).toBe("--/--/--");
  });

  it("should return placeholder for invalid date strings", () => {
    expect(formatDate("data-invalida")).toBe("--/--/--");
    expect(formatDate("")).toBe("--/--/--");
  });
});
