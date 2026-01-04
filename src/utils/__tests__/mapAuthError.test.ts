import { mapAuthError } from "../mapAuthError";

describe("mapAuthError", () => {
  it("should return correct message for invalid email", () => {
    const error = { code: "auth/invalid-email" };

    expect(mapAuthError(error)).toBe("O formato do e-mail é inválido.");
  });

  it("should return correct message for user disabled", () => {
    const error = { code: "auth/user-disabled" };

    expect(mapAuthError(error)).toBe(
      "Ocorreu um erro inesperado. Tente novamente."
    );
  });

  it("should return correct message for user not found", () => {
    const error = { code: "auth/user-not-found" };

    expect(mapAuthError(error)).toBe(
      "Ocorreu um erro inesperado. Tente novamente."
    );
  });

  it("should return correct message for wrong password", () => {
    const error = { code: "auth/wrong-password" };

    expect(mapAuthError(error)).toBe("E-mail ou senha incorretos.");
  });

  it("should return correct message for email already in use", () => {
    const error = { code: "auth/email-already-in-use" };

    expect(mapAuthError(error)).toBe(
      "Este e-mail já está sendo usado por outra conta."
    );
  });

  it("should return default message for unknown error code", () => {
    const error = { code: "auth/unknown-weird-error" };
    expect(mapAuthError(error)).toBe(
      "Ocorreu um erro inesperado. Tente novamente."
    );
  });

  it("should return default message for error without code", () => {
    const error = {};
    expect(mapAuthError(error)).toBe(
      "Ocorreu um erro inesperado. Tente novamente."
    );
  });
});
