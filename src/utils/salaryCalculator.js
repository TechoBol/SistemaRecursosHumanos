/**
 * Funciones para cálculos salariales (base de 30 días/mes).
 */

/**
 * Obtiene el total de días calendario de un mes determinado
 * @param {number} year - Año completo (ej. 2026)
 * @param {number} month - Mes base 1 (1 a 12)
 * @returns {number} - Cantidad de días en el mes
 */
export const getDaysInMonth = (year, month) => {
  return new Date(year, month, 0).getDate();
};

/**
 * Calcula los días trabajados en el mes de referencia para un contrato dado
 *
 * @param {Object} activeContract - Objeto del contrato activo con fecha decontrato, salario base y opcionalmente fecha fin de contrato
 * @param {Date} [targetDate=new Date()] - Fecha de cálculo (por defecto hoy)
 * @returns {number} - Días trabajados (0 a 30)
 */
export const calculateWorkedDaysInMonth = (activeContract, targetDate = new Date()) => {
  if (!activeContract || !activeContract.hireDate) {
    return 0;
  }

  // Parsear fecha de ingreso (YYYY-MM-DD sin desfasaje de zona horaria)
  const hireDateStr = String(activeContract.hireDate).split("T")[0];
  const [hireY, hireM, hireD] = hireDateStr.split("-").map(Number);
  if (!hireY || !hireM || !hireD) {
    return 0;
  }

  const targetYear = targetDate.getFullYear();
  const targetMonth1Indexed = targetDate.getMonth() + 1;
  const currentDay = targetDate.getDate();

  const daysInTargetMonth = getDaysInMonth(targetYear, targetMonth1Indexed);

  // Si ingresó después del mes de cálculo, 0 días trabajados
  if (
    hireY > targetYear ||
    (hireY === targetYear && hireM > targetMonth1Indexed)
  ) {
    return 0;
  }

  // Parsear fecha de fin de contrato (si existe)
  let endDateObj = null;
  if (activeContract.endDate) {
    const endStr = String(activeContract.endDate).split("T")[0];
    const [endY, endM, endD] = endStr.split("-").map(Number);
    if (endY && endM && endD) {
      if (endY < targetYear || (endY === targetYear && endM < targetMonth1Indexed)) {
        return 0;
      }
      if (endY === targetYear && endM === targetMonth1Indexed) {
        endDateObj = { year: endY, month: endM, day: endD };
      }
    }
  }

  // Determinar el día límite efectivo de cálculo
  let effectiveEndDay = currentDay;
  if (endDateObj) {
    effectiveEndDay = Math.min(currentDay, endDateObj.day);
  }

  // Verificar si el empleado ingresó ANTES del mes objetivo
  const joinedBeforeTargetMonth =
    hireY < targetYear || (hireY === targetYear && hireM < targetMonth1Indexed);

  if (joinedBeforeTargetMonth) {
    // Regla de 30 días para meses completados:
    // Si hoy es el último día del mes calendario (ej. día 31 en agosto, o 28/29 en febrero):
    const isLastDayOfCalendarMonth = effectiveEndDay >= daysInTargetMonth;

    if (isLastDayOfCalendarMonth) {
      return 30; // Se topa o salta a 30 días por mes completo
    }

    return Math.min(30, effectiveEndDay); // En días 1 al 29 (o limitado por fin de contrato):
  }

  // CASO: Empleado ingresó DURANTE el mes objetivo
  if (effectiveEndDay < hireD) {
    return 0; // Aún no llega al día de ingreso
  }

  // Fórmula para contrataciones a mitad de mes: D - H
  const daysWorked = effectiveEndDay - hireD;
  return Math.max(0, daysWorked);
};

/**
 * Calcula el resumen salarial del mes actual según el contrato activo
 *
 * @param {Object} activeContract - Objeto del contrato activo
 * @param {Date} [targetDate=new Date()] - Fecha de cálculo
 * @returns {Object} - { baseSalary, workedDays, basicEarnings }
 */
export const calculateSalarySummary = (activeContract, targetDate = new Date()) => {
  if (!activeContract || !activeContract.baseSalary) {
    return {
      baseSalary: 0,
      workedDays: 0,
      basicEarnings: 0,
    };
  }

  const baseSalary = Number(activeContract.baseSalary) || 0;
  const workedDays = calculateWorkedDaysInMonth(activeContract, targetDate);

  // (haberBasico / 30) * diasTrabajados
  const dailyRate = baseSalary / 30;
  const basicEarnings = Math.round(dailyRate * workedDays * 100) / 100;

  return {
    baseSalary,
    workedDays,
    basicEarnings,
  };
};
