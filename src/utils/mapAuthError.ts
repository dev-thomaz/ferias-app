export function mapAuthError(error: any): string {
  const message = error.message || "";
  const code = error.code || "";

  if (message.includes("ACCOUNT_PENDING")) {
    return "O teu cadastro ainda está aguardando aprovação do administrador.";
  }

  if (message.includes("ACCOUNT_DISABLED")) {
    return "Esta conta foi desativada. Contacte o suporte.";
  }

  if (
    message.includes("USER_NOT_FOUND") ||
    message.includes("auth/user-not-found")
  ) {
    return "Não encontramos uma conta com este e-mail.";
  }

  if (message.includes("ACCOUNT_BLOCKED")) {
    return "A tua conta não está ativa.";
  }

  switch (code) {
    case "auth/invalid-credential":
    case "auth/wrong-password":
      return "E-mail ou senha incorretos.";
    case "auth/email-already-in-use":
      return "Este e-mail já está sendo usado por outra conta.";
    case "auth/invalid-email":
      return "O formato do e-mail é inválido.";
    case "auth/too-many-requests":
      return "Muitas tentativas consecutivas. Aguarde alguns instantes.";
    case "auth/network-request-failed":
      return "Verifique a sua conexão com a internet.";
    default:
      return "Ocorreu um erro inesperado. Tente novamente.";
  }
}
