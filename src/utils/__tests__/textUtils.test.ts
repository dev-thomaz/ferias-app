import {
  formatShortName,
  getInitials,
  translateStatusLabel,
} from "../textUtils";

describe("textUtils", () => {
  describe("formatShortName", () => {
    it("should return 'Usuário' when name is empty", () => {
      expect(formatShortName(undefined)).toBe("Usuário");
      expect(formatShortName("")).toBe("Usuário");
    });

    it("should return the single name if only one part exists", () => {
      expect(formatShortName("Thomaz")).toBe("Thomaz");
    });

    it("should return first and last name for full names", () => {
      expect(formatShortName("Thomaz Bittencourt")).toBe("Thomaz Bittencourt");
      expect(formatShortName("Thomaz de Souza Bittencourt")).toBe(
        "Thomaz Bittencourt"
      );
    });

    it("should handle extra spaces correctly", () => {
      expect(formatShortName("  Thomaz   Bittencourt  ")).toBe(
        "Thomaz Bittencourt"
      );
    });
  });

  describe("getInitials", () => {
    it("should return 'US' when name is empty", () => {
      expect(getInitials(undefined)).toBe("US");
    });

    it("should return single initial for single name", () => {
      expect(getInitials("Thomaz")).toBe("T");
    });

    it("should return first and last initials for full names", () => {
      expect(getInitials("Thomaz Bittencourt")).toBe("TB");
      expect(getInitials("Thomaz de Souza Bittencourt")).toBe("TB");
    });
  });

  describe("translateStatusLabel", () => {
    it("should translate known statuses correctly", () => {
      expect(translateStatusLabel("PENDING")).toBe("Pendente");
      expect(translateStatusLabel("APPROVED")).toBe("Aprovado");
      expect(translateStatusLabel("REJECTED")).toBe("Reprovado");
    });

    it("should return the status itself if unknown", () => {
      // @ts-ignore - Forçando um status inválido para testar o fallback
      expect(translateStatusLabel("UNKNOWN_STATUS")).toBe("UNKNOWN_STATUS");
    });
  });
});
