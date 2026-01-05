import { useState, useEffect, useMemo, useCallback } from "react";
import { adminService } from "../services/adminService";
import { User, UserRole, AccountStatus, DialogState } from "@/types";
import { formatShortName } from "@/utils/textUtils";

export type StatusFilter = "ALL" | "ACTIVE" | "DISABLED";
export type RoleFilter = "ALL" | UserRole;

export function useEmployeesList() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  const [statusFilter, setStatusFilter] = useState<StatusFilter>("ALL");
  const [roleFilter, setRoleFilter] = useState<RoleFilter>("ALL");

  const [dialog, setDialog] = useState<DialogState>({
    visible: false,
    title: "",
    message: "",
    variant: "info",
    confirmText: "Confirmar",
    onConfirm: () => {},
  });

  const loadUsers = useCallback(async () => {
    setLoading(true);
    try {
      const data = await adminService.getAllEmployees();
      setUsers(data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadUsers();
  }, [loadUsers]);

  const filteredUsers = useMemo(() => {
    return users.filter((u) => {
      const searchLower = search.toLowerCase();
      const matchSearch =
        u.name.toLowerCase().includes(searchLower) ||
        u.email.toLowerCase().includes(searchLower);

      const matchStatus =
        statusFilter === "ALL" || u.accountStatus === statusFilter;

      const matchRole = roleFilter === "ALL" || u.role === roleFilter;

      return matchSearch && matchStatus && matchRole;
    });
  }, [users, search, statusFilter, roleFilter]);

  const handleToggleStatus = async (userId: string, currentStatus?: string) => {
    setDialog((d) => ({ ...d, visible: false }));

    const newStatus: AccountStatus =
      currentStatus === "ACTIVE" ? "DISABLED" : "ACTIVE";

    try {
      await adminService.updateUserStatus(userId, newStatus);

      setUsers((prev) =>
        prev.map((u) =>
          u.id === userId ? { ...u, accountStatus: newStatus } : u
        )
      );
    } catch (error) {
      console.error("Erro ao atualizar status:", error);
    }
  };

  const handleResetPassword = async (email: string) => {
    setDialog((d) => ({ ...d, visible: false }));
    try {
      await adminService.resetUserPassword(email);

      setTimeout(() => {
        setDialog({
          visible: true,
          title: "E-mail Enviado",
          message: "O link de recuperação foi enviado com sucesso.",
          variant: "success",
          confirmText: "OK",
          onConfirm: () => setDialog((d) => ({ ...d, visible: false })),
        });
      }, 300);
    } catch (error) {
      console.error("Erro ao resetar senha:", error);
    }
  };

  const openStatusDialog = (user: User) => {
    const isActive = user.accountStatus === "ACTIVE";
    setDialog({
      visible: true,
      title: isActive ? "Desativar Usuário" : "Reativar Usuário",
      message: `Deseja ${
        isActive ? "remover" : "restaurar"
      } o acesso de ${formatShortName(user.name)}?`,
      variant: isActive ? "error" : "success",
      confirmText: isActive ? "Desativar" : "Reativar",
      onConfirm: () => handleToggleStatus(user.id, user.accountStatus),
    });
  };

  const openResetDialog = (user: User) => {
    setDialog({
      visible: true,
      title: "Resetar Senha",
      message: `Enviar e-mail de recuperação para ${user.email}?`,
      variant: "warning",
      confirmText: "Enviar E-mail",
      onConfirm: () => handleResetPassword(user.email),
    });
  };

  const closeDialog = () => setDialog((d) => ({ ...d, visible: false }));

  return {
    users: filteredUsers,
    totalCount: filteredUsers.length,
    loading,

    search,
    setSearch,
    statusFilter,
    setStatusFilter,
    roleFilter,
    setRoleFilter,

    dialog,
    closeDialog,

    actions: {
      openStatusDialog,
      openResetDialog,
    },
  };
}
