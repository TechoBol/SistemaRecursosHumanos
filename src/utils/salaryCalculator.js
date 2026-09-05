/**
 * Funciones de utilidad centralizadas para cálculos salariales comerciales (base de 30 días/mes).
 */

/**
 * Salario Mínimo Nacional (SMN) de referencia para el cálculo de beneficios de ley (Bolivia).
 */
export const MINIMUM_NATIONAL_SALARY = 2796.40;

/**
 * Obtiene el total de días calendario de un mes determinado (mes 1-indexed, ej. 8 para agosto).
 * @param {number} year - Año completo (ej. 2026)
 * @param {number} month - Mes base 1 (1 a 12)
 * @returns {number} - Cantidad de días en el mes (ej. 31, 28, 30)
 */
export const getDaysInMonth = (year, month) => {
  return new Date(year, month, 0).getDate();
};

/**
 * Calcula los días trabajados en el mes de referencia para un contrato dado.
 *
 * @param {Object} activeContract - Objeto del contrato activo con hireDate, baseSalary y opcionalmente endDate
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
    // Regla comercial de 30 días para meses completados:
    const isLastDayOfCalendarMonth = effectiveEndDay >= daysInTargetMonth;

    if (isLastDayOfCalendarMonth) {
      return 30; // Se topa o salta a 30 días por mes comercial completo
    }

    // En días 1 al 29 (o limitado por fin de contrato):
    return Math.min(30, effectiveEndDay);
  }

  // CASO: Empleado ingresó DURANTE el mes objetivo
  if (effectiveEndDay < hireD) {
    return 0; // Aún no llega al día de ingreso
  }

  // Fórmula para contrataciones a mitad de mes: D - H
  const daysWorked = effectiveEndDay - hireD;
  return Math.max(0, daysWorked);
};

// REVISAR DESDE AQUIII
/**
 * Calcula el bono de antigüedad según la escala legal sobre 3 Salarios Mínimos Nacionales.
 *
 * @param {Object} activeContract - Objeto del contrato activo
 * @param {Date} [targetDate=new Date()] - Fecha de cálculo
 * @param {number} workedDays - Días trabajados acumulados en el mes
 * @returns {Object} - { amount, description, percentage }
 */
export const calculateSeniorityBonus = (activeContract, targetDate = new Date(), workedDays = 0) => {
  if (!activeContract || !activeContract.hireDate) {
    return { amount: 0, description: "Sin información de contrato", percentage: 0 };
  }

  // Si el tipo de contrato es Consultoría, no corresponde bono
  const cType = String(activeContract.contractType || "").toUpperCase();
  if (cType === "CONSULTORIA" || cType === "CONSULTOR") {
    return { amount: 0, description: "No aplica para contrato de consultoría", percentage: 0 };
  }

  if (workedDays <= 0) {
    return { amount: 0, description: "Sin días trabajados en el mes", percentage: 0 };
  }

  const hireDateStr = String(activeContract.hireDate).split("T")[0];
  const [hireY, hireM, hireD] = hireDateStr.split("-").map(Number);
  if (!hireY || !hireM || !hireD) {
    return { amount: 0, description: "Fecha de contrato inválida", percentage: 0 };
  }

  const targetY = targetDate.getFullYear();
  const targetM = targetDate.getMonth() + 1;
  const currentDay = targetDate.getDate();
  const daysInTargetMonth = getDaysInMonth(targetY, targetM);

  // Calcular años cumplidos a la fecha
  let years = targetY - hireY;
  const hasReachedAnniversary =
    targetM > hireM || (targetM === hireM && currentDay >= hireD);

  if (!hasReachedAnniversary) {
    years -= 1;
  }
  if (years < 0) years = 0;

  // Escala legal de antigüedad (D.S. 21060):
  let percentage = 0;
  let description = `Menor a 2 años de antigüedad (ingreso: ${hireD}/${hireM}/${hireY})`;

  if (years >= 25) {
    percentage = 0.50;
    description = `25 años o más (${percentage * 100} %) - Desde ${hireD}/${hireM}/${hireY}`;
  } else if (years >= 20) {
    percentage = 0.42;
    description = `20 a 24 años (${percentage * 100} %) - Desde ${hireD}/${hireM}/${hireY}`;
  } else if (years >= 15) {
    percentage = 0.34;
    description = `15 a 19 años (${percentage * 100} %) - Desde ${hireD}/${hireM}/${hireY}`;
  } else if (years >= 11) {
    percentage = 0.26;
    description = `11 a 14 años (${percentage * 100} %) - Desde ${hireD}/${hireM}/${hireY}`;
  } else if (years >= 8) {
    percentage = 0.18;
    description = `8 a 10 años (${percentage * 100} %) - Desde ${hireD}/${hireM}/${hireY}`;
  } else if (years >= 5) {
    percentage = 0.11;
    description = `5 a 7 años (${percentage * 100} %) - Desde ${hireD}/${hireM}/${hireY}`;
  } else if (years >= 2) {
    percentage = 0.05;
    description = `2 a 4 años (${percentage * 100} %) - Desde ${hireD}/${hireM}/${hireY}`;
  }

  if (percentage === 0) {
    return { amount: 0, description, percentage: 0 };
  }

  // Base legal (D.S. 21060): 3 Salarios Mínimos Nacionales
  const calculationBase = MINIMUM_NATIONAL_SALARY * 3;
  const fullMonthlyBonus = calculationBase * percentage;
  const dailyBonusRate = fullMonthlyBonus / 30;

  // Verificar si es el MES ANIVERSARIO en que se alcanza el nuevo escalón
  const is2YearAnniversaryMonth = (targetY === hireY + 2) && (targetM === hireM);
  const is5YearAnniversaryMonth = (targetY === hireY + 5) && (targetM === hireM);
  const isAnniversaryMonth = is2YearAnniversaryMonth || is5YearAnniversaryMonth;

  let bonusDays = 0;

  if (isAnniversaryMonth) {
    // Si aún no se ha llegado al día del aniversario dentro del mes
    if (currentDay < hireD) {
      bonusDays = 0;
    } else {
      // Desde el día de aniversario en adelante
      const isLastDay = currentDay >= daysInTargetMonth;
      if (isLastDay) {
        // En mes completo de aniversario (28, 30 o 31 días), los días con bono = 30 - hireD
        bonusDays = 30 - hireD;
      } else {
        // A mitad de mes: D - H
        bonusDays = currentDay - hireD;
      }
    }
  } else {
    // Meses posteriores al aniversario: aplica para todos los días trabajados en el mes
    bonusDays = workedDays;
  }

  const bonusAmount = Math.max(0, dailyBonusRate * Math.max(0, bonusDays));
  return {
    amount: Math.round(bonusAmount * 100) / 100,
    description,
    percentage,
  };
};

/**
 * Calcula el resumen salarial completo (Haber Básico, Días Trabajados, Sueldo Básico,
 * Bono Antigüedad, Total Ganado, Gestora 12.71%, Deudas, Anticipos y Líquido Pagable).
 *
 * @param {Object} activeContract - Objeto del contrato activo
 * @param {Date} [targetDate=new Date()] - Fecha de cálculo
 * @param {number} [attendanceDiscounts=0] - Suma de deudas/descuentos por asistencias del mes
 * @param {number} [advanceTotal=0] - Suma de anticipos otorgados en el mes
 * @returns {Object}
 */
export const calculateSalarySummary = (
  activeContract,
  targetDate = new Date(),
  attendanceDiscounts = 0,
  advanceTotal = 0
) => {
  if (!activeContract || !activeContract.baseSalary) {
    return {
      baseSalary: 0,
      workedDays: 0,
      basicEarnings: 0,
      seniorityBonus: 0,
      seniorityDescription: "Sin información de contrato",
      totalEarned: 0,
      gestoraDeduction: 0,
      deudasDeduction: 0,
      anticiposDeduction: 0,
      totalDeductions: 0,
      netPayable: 0,
    };
  }

  const baseSalary = Number(activeContract.baseSalary) || 0;
  const workedDays = calculateWorkedDaysInMonth(activeContract, targetDate);

  // Sueldo Básico = (haberBasico / 30) * workedDays
  const dailyRate = baseSalary / 30;
  const basicEarnings = Math.round(dailyRate * workedDays * 100) / 100;

  // Bono de Antigüedad sobre 3 SMN
  const seniorityResult = calculateSeniorityBonus(activeContract, targetDate, workedDays);
  const seniorityBonus = seniorityResult.amount;
  const seniorityDescription = seniorityResult.description;

  // Total Ganado = Sueldo Básico + Bono de Antigüedad
  const totalEarned = Math.round((basicEarnings + seniorityBonus) * 100) / 100;

  // Descuentos:
  // Gestora (AFP) = 12.71% sobre el Total Ganado
  const gestoraDeduction = Math.round(totalEarned * 0.1271 * 100) / 100;
  const deudasDeduction = Math.round(Number(attendanceDiscounts || 0) * 100) / 100;
  const anticiposDeduction = Math.round(Number(advanceTotal || 0) * 100) / 100;

  const totalDeductions = Math.round(
    (gestoraDeduction + deudasDeduction + anticiposDeduction) * 100
  ) / 100;

  // Líquido Pagable = Total Ganado - Total Descuentos
  const netPayable = Math.max(
    0,
    Math.round((totalEarned - totalDeductions) * 100) / 100
  );

  return {
    baseSalary,
    workedDays,
    basicEarnings,
    seniorityBonus,
    seniorityDescription,
    totalEarned,
    gestoraDeduction,
    deudasDeduction,
    anticiposDeduction,
    totalDeductions,
    netPayable,
  };
};
