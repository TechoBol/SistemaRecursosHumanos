import { useLoginStore } from "../components/store/loginStore";
import { useLocationStore } from "../components/store/locationStore";

export const LEVELS = {
  ADMIN: 1,
  MANAGER: 2,
  BRANCH_MANAGER: 3, // ← nuevo, sucursal fija
  SELLER: 4,
  VIEWER: 5, // ← renombrado, puede ver pero no editar
};

export const usePermissions = () => {
  const { level, location, setSelectedLocationId } = useLoginStore();
  const { selectedLocation } = useLocationStore();

  const lvl = Number(level);

  const isAdmin = lvl === LEVELS.ADMIN;
  const isManager = lvl === LEVELS.MANAGER;
  const isBranchManager = lvl === LEVELS.BRANCH_MANAGER;
  const isSeller = lvl === LEVELS.SELLER;
  const isViewer = lvl === LEVELS.VIEWER;

  // Puede cambiar entre sucursales

  // Solo ve su sucursal asignada (no puede cambiar)
  const hasFixedBranch = isBranchManager;

  const canSwitchBranch = isAdmin || isManager || isViewer;

  const effectiveLocationId = canSwitchBranch
    ? selectedLocation?.id
    : location?.id;

  return {
    level: lvl,
    isAdmin,
    isManager,
    isBranchManager,
    isSeller,
    isViewer,

    canViewDashboard: isAdmin || isManager || isBranchManager || isViewer,
    canSwitchBranch,
    hasFixedBranch,
    effectiveLocationId,
    setSelectedLocationId, // para usar en el selector de sucursal

    canViewProducts: true,
    canSell: isAdmin || isManager || isSeller,
    canViewReceipts: true,
    canViewQuotations: true,

    canViewCustomers: isAdmin || isManager || isViewer,
    canManageSales: isAdmin || isManager || isViewer,
    canManageInventory: isAdmin || isManager || isViewer,
    canManageUsers: isAdmin || isManager || isBranchManager || isViewer,
    canManageRoles: isAdmin || isManager || isViewer,
    canManageBranches: isAdmin || isManager || isViewer,
    canManageTransfers: isAdmin || isManager || isBranchManager || isViewer,
    canManageCosts: isAdmin || isManager || isViewer,
    canViewCreditPlans: true,
    canCreateProduct: isAdmin || isManager,
    canEditProduct: isAdmin || isManager,
    canViewProfits: isAdmin || isViewer,
    canViewCosts: isAdmin || isManager || isViewer,
    canApproveTransfers: isAdmin || isManager,
    canRequestTransfers: isBranchManager,
    canTesoreria: isAdmin || isManager || isViewer,
  };
};
