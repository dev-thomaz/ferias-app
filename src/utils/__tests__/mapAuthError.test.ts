import { mapAuthError } from "../mapAuthError";

describe("mapAuthError", () => {
  describe("Custom Business Logic", () => {
    it("should detect ACCOUNT_PENDING in message", () => {
      const error = { message: "Error: The user is ACCOUNT_PENDING status." };
      expect(mapAuthError(error)).toBe(
        "Seu cadastro ainda está aguardando aprovação do administrador."
      );
    });

    it("should detect ACCOUNT_DISABLED in message", () => {
      const error = { message: "Error: ACCOUNT_DISABLED by admin." };
      expect(mapAuthError(error)).toBe(
        "Esta conta foi desativada. Entre em contato com o suporte."
      );
    });

    it("should detect ACCOUNT_BLOCKED in message", () => {
      const error = { message: "User is ACCOUNT_BLOCKED." };
      expect(mapAuthError(error)).toBe("Sua conta não está ativa.");
    });
  });

  describe("Firebase Error Codes", () => {
    it("should handle invalid credentials/password", () => {
      expect(mapAuthError({ code: "auth/invalid-credential" })).toBe(
        "E-mail ou senha incorretos."
      );
      expect(mapAuthError({ code: "auth/wrong-password" })).toBe(
        "E-mail ou senha incorretos."
      );
      expect(mapAuthError({ code: "auth/user-not-found" })).toBe(
        "E-mail ou senha incorretos."
      );
    });

    it("should handle email already in use", () => {
      expect(mapAuthError({ code: "auth/email-already-in-use" })).toBe(
        "Este e-mail já está sendo usado por outra conta."
      );
    });

    it("should handle invalid email format", () => {
      expect(mapAuthError({ code: "auth/invalid-email" })).toBe(
        "O formato do e-mail é inválido."
      );
    });

    it("should handle weak password", () => {
      expect(mapAuthError({ code: "auth/weak-password" })).toBe(
        "A senha deve ter pelo menos 6 caracteres."
      );
    });

    it("should handle user disabled (Firebase code)", () => {
      expect(mapAuthError({ code: "auth/user-disabled" })).toBe(
        "Este usuário foi desativado."
      );
    });

    it("should handle too many requests", () => {
      expect(mapAuthError({ code: "auth/too-many-requests" })).toBe(
        "Muitas tentativas consecutivas. Aguarde alguns instantes."
      );
    });

    it("should handle network errors", () => {
      const expectedMsg = "Verifique sua conexão com a internet.";
      expect(mapAuthError({ code: "auth/network-request-failed" })).toBe(
        expectedMsg
      );
      expect(mapAuthError({ code: "unavailable" })).toBe(expectedMsg);
    });

    it("should handle operation not allowed", () => {
      expect(mapAuthError({ code: "auth/operation-not-allowed" })).toBe(
        "O login com e-mail/senha não está habilitado."
      );
    });
  });

  describe("Fallbacks", () => {
    it("should fallback to USER_NOT_FOUND if present in message but no code matched", () => {
      const error = { code: "unknown", message: "Error: USER_NOT_FOUND here" };
      expect(mapAuthError(error)).toBe(
        "Não encontramos uma conta com este e-mail."
      );
    });

    it("should return generic message for completely unknown error", () => {
      const error = { code: "auth/unknown-weird-error" };
      expect(mapAuthError(error)).toBe(
        "Ocorreu um erro inesperado. Tente novamente."
      );
    });

    it("should handle null or undefined error gracefully", () => {
      expect(mapAuthError(null)).toBe(
        "Ocorreu um erro inesperado. Tente novamente."
      );
      expect(mapAuthError(undefined)).toBe(
        "Ocorreu um erro inesperado. Tente novamente."
      );
    });
  });
});
