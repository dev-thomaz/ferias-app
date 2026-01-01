import { VacationStatus } from "../types";

export function formatShortName(name?: string): string {
  if (!name) return "Usuário";

  const parts = name.trim().split(/\s+/).filter(Boolean);

  if (parts.length === 0) return "Usuário";
  if (parts.length === 1) return parts[0];

  return `${parts[0]} ${parts[parts.length - 1]}`;
}

export function getInitials(name?: string): string {
  if (!name) return "US";

  const parts = name.trim().split(/\s+/).filter(Boolean);

  if (parts.length === 0) return "US";

  const firstInitial = parts[0].charAt(0);

  if (parts.length === 1) {
    return firstInitial.toUpperCase();
  }

  const lastInitial = parts[parts.length - 1].charAt(0);
  return (firstInitial + lastInitial).toUpperCase();
}

export function translateStatusFilter(status: VacationStatus | "ALL"): string {
  const map: Record<string, string> = {
    ALL: "todos",
    PENDING: "pendentes",
    APPROVED: "aprovados",
    REJECTED: "reprovados",
  };

  return map[status] || status.toLowerCase();
}

export function translateStatusLabel(status: VacationStatus): string {
  const map: Record<string, string> = {
    PENDING: "Pendente",
    APPROVED: "Aprovado",
    REJECTED: "Reprovado",
  };
  return map[status] || status;
}
