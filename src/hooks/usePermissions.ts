import { useLoginStore } from "../components/store/loginStore";

/**
 * Roles del sistema:
 * 1. Superadministrador: Acceso total, único que gestiona usuarios.
 * 2. Administrador de RRHH: Todo excepto gestión de usuarios (sin vista ni menú).
 * 3. Operador de RRHH: Igual que Administrador de RRHH pero no puede finalizar planilla fiscal.
 * 4. Consulta General: Solo lectura en todas las vistas (sin gestión de usuarios). No puede crear/editar/eliminar.
 * 5. Consulta Ejecutiva: Igual que Consulta General, pero en el Dashboard se ocultan cumpleaños y eventos de cumpleaños en el calendario.
 */

export const ROLES = {
  SUPERADMIN: "Superadministrador",
  ADMIN_RRHH: "Administrador de RRHH",
  OPERATOR_RRHH: "Operador de RRHH",
  CONSULTA_GENERAL: "Consulta General",
  CONSULTA_EJECUTIVA: "Consulta Ejecutiva",
};

/**
 * Normaliza nombres de rol para comparaciones tolerantes a mayúsculas/acentos
 */
export const normalizeRole = (roleName = "") => {
  return (roleName || "")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .trim()
    .toLowerCase();
};

/**
 * Hook para consultar permisos del usuario actual de manera centralizada
 */
export const usePermissions = () => {
  const { role } = useLoginStore();
  const normalized = normalizeRole(role);

  // Identificación de roles
  const isSuperAdmin =
    normalized.includes("superadministrador") || normalized.includes("superadmin");

  const isAdminRRHH =
    normalized === "administrador de rrhh" ||
    normalized === "admin rrhh" ||
    (normalized.includes("administrador") && normalized.includes("rrhh") && !isSuperAdmin);

  const isOperatorRRHH =
    normalized.includes("operador");

  const isConsultaEjecutiva =
    normalized.includes("consulta ejecutiva") ||
    (normalized.includes("ejecutiva") && normalized.includes("consulta"));

  const isConsultaGeneral =
    normalized.includes("consulta general") ||
    (normalized.includes("consulta") && !isConsultaEjecutiva);

  // ¿Es algún rol de sólo consulta?
  const isReadOnly = isConsultaGeneral || isConsultaEjecutiva;

  // Permisos específicos:
  // 1. Usuarios: Único Superadministrador
  const canAccessUsers = isSuperAdmin;
  const canManageUsers = isSuperAdmin;

  // 2. Acciones de modificación general (crear, editar, eliminar empleados, áreas, cargos, sucursales, bonos, etc.)
  const canModify = !isReadOnly;

  // 3. Finalizar planilla: Superadministrador y Administrador de RRHH (Operador NO)
  const canFinalizePayroll = isSuperAdmin || isAdminRRHH;

  // 4. Ver cumpleaños en Dashboard y Calendario: Todos excepto Consulta Ejecutiva
  const canViewBirthdays = !isConsultaEjecutiva;

  return {
    role,
    isSuperAdmin,
    isAdminRRHH,
    isOperatorRRHH,
    isConsultaGeneral,
    isConsultaEjecutiva,
    isReadOnly,
    canAccessUsers,
    canManageUsers,
    canModify,
    canFinalizePayroll,
    canViewBirthdays,
  };
};