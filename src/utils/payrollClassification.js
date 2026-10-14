/**
 * Configuración y utilidades de cargos para la Planilla Consolidada.
 *
 * Se definen 5 divisiones centrales fijas en orden de prioridad:
 *  1. CENTRAL GERENTES
 *  2. CENTRAL JEFE DE AREA
 *  3. CENTRAL JEFES DE REGION
 *  4. JEFES DE SECTOR
 *  5. CENTRAL TECNICOS
 *
 * Cualquier cargo que NO coincida con ninguna de estas 5 divisiones
 * será agrupado automáticamente por su respectiva sucursal.
 */

export const CONSOLIDATED_JOB_CATEGORIES = [
  {
    key: "CENTRAL_GERENTES",
    title: "CENTRAL GERENTES",
    jobs: [
      "GERENTE DE CONTROL",
      "GERENTE GENERAL",
      "GERENTE COMERCIAL",
      "CHOFER",
    ],
  },
  {
    key: "CENTRAL_JEFE_DE_AREA",
    title: "CENTRAL JEFE DE AREA",
    jobs: [
      "JEFE DE CONTABILIDAD",
      "JEFE DE FINANZAS",
      "JEFE DE RECURSOS HUMANOS",
      "JEFE DE SUPERVISIÓN Y CONTROL REGION OCCIDENTE",
      "JEFE DE SUPERVISIÓN Y CONTROL REGION ORIENTE - TROPICO",
      "JEFE DE VENTAS Y LOGISTICA",
      "JEFE DE VENTAS Y OPERACIONES",
    ],
  },
  {
    key: "CENTRAL_JEFES_DE_REGION",
    title: "CENTRAL JEFES DE REGION",
    jobs: [
      "JEFE DE REGION",
      "JEFES DE REGION",
      "JEFE REGIONAL",
      "JEFE DE ZONA",
      "SUPERVISOR REGIONAL",
    ],
  },
  {
    key: "JEFES_DE_SECTOR",
    title: "JEFES DE SECTOR",
    jobs: [
      "JEFE DE SECTOR",
      "JEFES DE SECTOR",
      "SUPERVISOR DE SECTOR",
      "ENCARGADO DE SECTOR",
    ],
  },
  {
    key: "CENTRAL_TECNICOS",
    title: "CENTRAL TECNICOS",
    jobs: [
      "AUXILIAR DE SISTEMAS",
      "ENCARGADO DE SISTEMAS",
      "TECNICO DE ACTIVOS FIJOS",
      "TECNICO DE COMPRAS",
      "TECNICO DE CONTABILIDAD",
      "TECNICO DE CONTROL DE BOBINAS",
      "TECNICO DE FINANZAS",
      "TECNICO DE INVENTARIOS",
      "TECNICO DE LOGISTICA E INVENTARIOS",
      "TECNICO DE LOGISTICA Y DISTRIBUCION",
      "TECNICO EN MANTENIMIENTO",
      "TECNICO DE MARKETING E INNOVACION",
      "TECNICO DE RECURSOS HUMANOS",
      "TECNICO EN COMERCIO EXTERIOR Y COMPRAS",
    ],
  },
];

/**
 * Normaliza una cadena quitando acentos/diacríticos, convirtiendo a mayúsculas
 * y eliminando espacios adicionales.
 */
export const normalizeJobTitle = (title = "") =>
  (title || "")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .trim()
    .toUpperCase();

/**
 * Determina si el cargo de un empleado pertenece a alguna de las 5 categorías centrales.
 * Retorna la categoría coincidente o null si debe clasificarse por sucursal.
 */
export const findJobCategory = (jobTitle = "") => {
  if (!jobTitle) return null;
  const normalizedTitle = normalizeJobTitle(jobTitle);
  if (!normalizedTitle) return null;

  for (const category of CONSOLIDATED_JOB_CATEGORIES) {
    const isMatch = category.jobs.some((job) => {
      const normalizedConfigJob = normalizeJobTitle(job);
      if (!normalizedConfigJob) return false;
      return (
        normalizedTitle === normalizedConfigJob ||
        normalizedTitle.startsWith(normalizedConfigJob + " ") ||
        normalizedTitle.endsWith(" " + normalizedConfigJob) ||
        normalizedTitle.includes(" " + normalizedConfigJob + " ") ||
        normalizedTitle.includes(normalizedConfigJob)
      );
    });

    if (isMatch) {
      return category;
    }
  }

  return null;
};

/**
 * Retorna el orden de las empresas fiscales según la empresa consolidada seleccionada:
 * - TECHOBOL: 1. TECHOBOL, 2. MEGADIS, 3. RHINOCONS
 * - RHINOCONS: 1. RHINOCONS, 2. MEGADIS, 3. TECHOBOL
 * - MEGADIS: 1. MEGADIS, 2. TECHOBOL, 3. RHINOCONS
 */
export const getFiscalOrderForConsolidated = (consolidatedCompanyKey = "") => {
  const key = (consolidatedCompanyKey || "").toUpperCase();
  if (key.includes("RHINOCONS")) {
    return ["RHINOCONS", "MEGADIS", "TECHOBOL"];
  }
  if (key.includes("MEGADIS")) {
    return ["MEGADIS", "TECHOBOL", "RHINOCONS"];
  }
  return ["TECHOBOL", "MEGADIS", "RHINOCONS"];
};

/**
 * Formatea el título de una sucursal para que siempre comience con "SUCURSAL [NOMBRE]"
 */
export const formatBranchTitle = (branchName = "") => {
  const trimmed = (branchName || "CENTRAL").trim();
  if (trimmed.toUpperCase().startsWith("SUCURSAL")) {
    return trimmed.toUpperCase();
  }
  return `SUCURSAL ${trimmed.toUpperCase()}`;
};

/**
 * Calcula los totales sumando las columnas numéricas de un listado de empleados de planilla.
 */
export const calculatePayrollTotals = (payrolls = []) =>
  payrolls.reduce(
    (acc, row) => ({
      baseSalary: acc.baseSalary + Number(row.baseSalary || 0),
      earnedSalary: acc.earnedSalary + Number(row.earnedSalary || 0),
      seniorityBonus: acc.seniorityBonus + Number(row.seniorityBonus || 0),
      otherBonuses: acc.otherBonuses + Number(row.otherBonuses || 0),
      grossPay: acc.grossPay + Number(row.grossPay || 0),
      afpDeduction: acc.afpDeduction + Number(row.afpDeduction || 0),
      absenceDeduction: acc.absenceDeduction + Number(row.absenceDeduction || 0),
      advanceDeduction: acc.advanceDeduction + Number(row.advanceDeduction || 0),
      totalDeductions: acc.totalDeductions + Number(row.totalDeductions || 0),
      netSalary: acc.netSalary + Number(row.netSalary || 0),
    }),
    {
      baseSalary: 0,
      earnedSalary: 0,
      seniorityBonus: 0,
      otherBonuses: 0,
      grossPay: 0,
      afpDeduction: 0,
      absenceDeduction: 0,
      advanceDeduction: 0,
      totalDeductions: 0,
      netSalary: 0,
    }
  );
