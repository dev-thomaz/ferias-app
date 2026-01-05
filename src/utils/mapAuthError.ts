interface FirebaseError {
  code?: string;
  message?: string;
}

export function mapAuthError(error: unknown): string {
  const err = error as FirebaseError;
  const message = err?.message || "";
  const code = err?.code || "";

  const upperMsg = message.toUpperCase();

  if (upperMsg.includes("ACCOUNT_PENDING")) {
    return "Seu cadastro ainda está aguardando aprovação do administrador.";
  }

  if (upperMsg.includes("ACCOUNT_DISABLED")) {
    return "Esta conta foi desativada. Entre em contato com o suporte.";
  }

  if (upperMsg.includes("ACCOUNT_BLOCKED")) {
    return "Sua conta não está ativa.";
  }

  switch (code) {
    case "auth/invalid-credential":
    case "auth/wrong-password":
    case "auth/user-not-found":
      return "E-mail ou senha incorretos.";

    case "auth/email-already-in-use":
      return "Este e-mail já está sendo usado por outra conta.";

    case "auth/invalid-email":
      return "O formato do e-mail é inválido.";

    case "auth/weak-password":
      return "A senha deve ter pelo menos 6 caracteres.";

    case "auth/user-disabled":
      return "Este usuário foi desativado.";

    case "auth/too-many-requests":
      return "Muitas tentativas consecutivas. Aguarde alguns instantes.";

    case "auth/network-request-failed":
    case "unavailable":
      return "Verifique sua conexão com a internet.";

    case "auth/operation-not-allowed":
      return "O login com e-mail/senha não está habilitado.";

    default:
      if (upperMsg.includes("USER_NOT_FOUND")) {
        return "Não encontramos uma conta com este e-mail.";
      }

      return "Ocorreu um erro inesperado. Tente novamente.";
  }
}
