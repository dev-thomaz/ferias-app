import { vacationSchema } from "../vacationSchema";

describe("Vacation Schema Validation", () => {
  it("should accept valid dates where end date is after start date", () => {
    const validData = {
      startDate: "2025-10-01",
      endDate: "2025-10-15",
      observation: "Férias merecidas",
    };

    const result = vacationSchema.safeParse(validData);
    expect(result.success).toBe(true);
  });

  it("should reject when end date is before start date", () => {
    const invalidData = {
      startDate: "2025-10-15",
      endDate: "2025-10-01",
    };

    const result = vacationSchema.safeParse(invalidData);
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues[0].message).toBe(
        "A data de término não pode ser anterior à data de início"
      );
    }
  });

  it("should require start and end dates", () => {
    const emptyData = {};
    const result = vacationSchema.safeParse(emptyData);
    expect(result.success).toBe(false);
  });
});
