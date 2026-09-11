const GESTORA_RATE = 0.1271;

const SENIORITY_LEVELS = [
  { years: 5, rate: 0.11 },
  { years: 2, rate: 0.05 },
];

const parseDate = (value) => {
  if (!value) return null;
  const [year, month, day] = String(value)
    .split("T")[0]
    .split("-")
    .map(Number);
  if (!year || !month || !day) return null;
  return new Date(year, month - 1, day);
};

const normalizeDate = (date) =>
  new Date(
    date.getFullYear(),
    date.getMonth(),
    date.getDate()
  );

const sameMonth = (dateA, dateB) =>
  dateA.getFullYear() === dateB.getFullYear() &&
  dateA.getMonth() === dateB.getMonth();

const isBeforeMonth = (dateA, dateB) =>
  dateA.getFullYear() < dateB.getFullYear() ||
  (
    dateA.getFullYear() === dateB.getFullYear() &&
    dateA.getMonth() < dateB.getMonth()
  );

const getLastDayOfMonth = (date) =>
  new Date(
    date.getFullYear(),
    date.getMonth() + 1,
    0
  ).getDate();

/*
 * Nómina mensual de 30 días:
 * - meses de 31 -> máximo 30
 * - febrero -> el último día completa 30
 */
const getPayrollDay = (date) => {
  const day = date.getDate();
  const lastDay = getLastDayOfMonth(date);
  if (lastDay < 30 && day === lastDay) {
    return 30;
  }
  return Math.min(day, 30);
};

const clampDays = (days) => Math.max(0, Math.min(days, 30));

const getEffectiveDate = (currentDate, endDate) => {
  const today = normalizeDate(currentDate);
  if (!endDate || endDate >= today) {
    return today;
  }
  return endDate;
};

const getAnniversary = (hireDate, years) =>
  new Date(
    hireDate.getFullYear() + years,
    hireDate.getMonth(),
    hireDate.getDate()
  );

const sumCurrentMonth = (records, field, currentDate) => {
  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();
  return records.reduce((total, record) => {
    const recordDate = parseDate(record?.date);
    if (
      !recordDate ||
      recordDate.getFullYear() !== year ||
      recordDate.getMonth() !== month
    ) {
      return total;
    }
    return total + (Number(record?.[field]) || 0);
  }, 0);
};

/* -------------------------------------------------------
   HABER BÁSICO
------------------------------------------------------- */

export const getBaseSalary = (contract) => {
  const value = Number(contract?.baseSalary);
  return Number.isFinite(value) && value >= 0
    ? value
    : 0;
};

/* -------------------------------------------------------
   DÍAS TRABAJADOS
------------------------------------------------------- */

export const calculateWorkedDays = (contract, currentDate = new Date()) => {
  const hireDate = parseDate(contract?.hireDate);
  const endDate = parseDate(contract?.endDate);
  const today = normalizeDate(currentDate);

  if (!hireDate || hireDate > today) {
    return 0;
  }

  // Terminó antes del mes actual.
  if (endDate && isBeforeMonth(endDate, today)) {
    return 0;
  }

  const effectiveDate = getEffectiveDate(today, endDate);

  /*
   * Ingresó durante el mes actual: días calendario reales, sin normalizar a 30
   * 07 -> 10 = 3 días
   */
  if (sameMonth(hireDate, today)) {
    return clampDays(
      effectiveDate.getDate() -
      hireDate.getDate()
    );
  }

  /* Ya trabajaba antes del mes: nómina normalizada a 30. */
  return clampDays(
    getPayrollDay(effectiveDate)
  );
};

/* -------------------------------------------------------
   SUELDO BÁSICO
------------------------------------------------------- */

const calculateBasicEarnings = (baseSalary, workedDays) => 
  (baseSalary / 30) * workedDays;

/* -------------------------------------------------------
   BONO DE ANTIGÜEDAD
------------------------------------------------------- */

/*
 * Bono completo mensual: baseSalary × porcentaje × 3
 */
const getMonthlySeniorityBonus = (baseSalary, rate) => 
  baseSalary * rate * 3;

/*
 * Calcula el bono considerando:
 * < 2 años    -> 0 %
 * 2 a <5 años -> 5 %
 * >=5 años    -> 11 %
 * Si cumple 2 o 5 años durante el mes, el cambio se aplica únicamente desde la fecha del aniversario
 */
const calculateSeniorityBonus = (
  contract,
  baseSalary,
  currentDate
) => {
  const hireDate = parseDate(contract?.hireDate);
  const endDate = parseDate(contract?.endDate);
  const today = normalizeDate(currentDate);

  if (!hireDate || !baseSalary) {
    return {
      amount: 0,
      description: "Menos de 2 años",
    };
  }

  const effectiveDate = getEffectiveDate(today, endDate);

  if (endDate && isBeforeMonth(endDate, today)) {
    return {
      amount: 0,
      description: "Contrato finalizado",
    };
  }

  const anniversary2 = getAnniversary(hireDate, 2);
  const anniversary5 = getAnniversary(hireDate, 5);

  /* Todavía no cumplió 2 años */
  if (effectiveDate < anniversary2) {
    return {
      amount: 0,
      description: "Menos de 2 años",
    };
  }

  const fullBonus5 = getMonthlySeniorityBonus(baseSalary, 0.05);
  const fullBonus11 = getMonthlySeniorityBonus(baseSalary, 0.11);

  /*
   * Cumple 2 años DURANTE este mes.
   *
   * Ej:
   * aniversario 07/09
   * hoy 10/09
   * => 3 días de bono.
   */
  if (sameMonth(anniversary2, today)) {
    const bonusDays = clampDays(
      effectiveDate.getDate() -
      anniversary2.getDate()
    );
    return {
      amount: (fullBonus5 / 30) * bonusDays,
      description: `2 a 4 años (5 %) - ${bonusDays} días de bono`,
    };
  }

  /*
   * Entre 2 y 5 años.
   *
   * Si el derecho comenzó en meses anteriores,
   * usa los mismos días de nómina del mes.
   */
  if (effectiveDate < anniversary5) {
    const bonusDays = getPayrollDay(effectiveDate);
    return {
      amount: (fullBonus5 / 30) * bonusDays,
      description: "2 a 4 años (5 %)",
    };
  }

  /*
   * Cumple 5 años DURANTE este mes.
   *
   * Antes del aniversario sigue cobrando 5 %.
   * Desde el aniversario cobra 11 %.
   */
  if (sameMonth(anniversary5, today)) {
    const totalPayrollDays = getPayrollDay(effectiveDate);
    const daysAt11 = clampDays(
      effectiveDate.getDate() - anniversary5.getDate()
    );
    const daysAt5 = Math.max(totalPayrollDays - daysAt11, 0);
    const amountAt5 = (fullBonus5 / 30) * daysAt5;
    const amountAt11 = (fullBonus11 / 30) * daysAt11;
    return {
      amount: amountAt5 + amountAt11,
      description: `5 años o más (11 %) - ${daysAt11} días al 11 %`,
    };
  }

  /* Ya tenía 5 años antes del mes actual */
  const bonusDays = getPayrollDay(effectiveDate);

  return {
    amount: (fullBonus11 / 30) * bonusDays,
    description: "5 años o más (11 %)",
  };
};

/* -------------------------------------------------------
   DESCUENTOS
------------------------------------------------------- */

const calculateGestora = (totalEarned) =>
  totalEarned * GESTORA_RATE;

const calculateCurrentMonthDebts = (incidents, currentDate) =>
  sumCurrentMonth(incidents, "discount", currentDate);

const calculateCurrentMonthAdvances = (advances, currentDate) =>
  sumCurrentMonth(advances, "amount", currentDate);

/* -------------------------------------------------------
   RESUMEN
------------------------------------------------------- */

export const calculateSalarySummary = ({
  contract,
  incidents = [],
  advances = [],
  currentDate = new Date(),
}) => {
  const baseSalary = getBaseSalary(contract);
  const workedDays = calculateWorkedDays(contract, currentDate);
  const basicEarnings = calculateBasicEarnings(baseSalary, workedDays);
  const seniority = calculateSeniorityBonus(contract, baseSalary, currentDate);
  const totalEarned = basicEarnings + seniority.amount;
  const gestoraDeduction = calculateGestora(totalEarned);
  const deudasDeduction = calculateCurrentMonthDebts(incidents, currentDate);
  const anticiposDeduction = calculateCurrentMonthAdvances(advances, currentDate);
  const totalDeductions = gestoraDeduction + deudasDeduction + anticiposDeduction;
  const netPayable = totalEarned - totalDeductions;
  return {
    baseSalary,
    workedDays,
    basicEarnings,
    seniorityBonus: seniority.amount,
    seniorityDescription: seniority.description,
    totalEarned,
    gestoraDeduction,
    deudasDeduction,
    anticiposDeduction,
    totalDeductions,
    netPayable,
  };
};