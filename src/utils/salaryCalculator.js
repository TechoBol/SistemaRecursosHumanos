/**
 * Convierte un valor de fecha del backend a una fecha local
 * sin problemas de zona horaria.
 *
 * Soporta:
 * "2024-09-04"
 * "2024-09-04T00:00:00.000Z"
 */
const parseDate = (dateValue) => {
  if (!dateValue) return null;

  const datePart = String(dateValue).split("T")[0];
  const [year, month, day] = datePart.split("-").map(Number);

  if (!year || !month || !day) {
    return null;
  }

  return new Date(year, month - 1, day);
};


/**
 * Compara únicamente año y mes.
 *
 * Retorna:
 * -1 -> dateA está antes
 *  0 -> mismo año y mes
 *  1 -> dateA está después
 */
const compareYearMonth = (dateA, dateB) => {
  const valueA =
    dateA.getFullYear() * 12 + dateA.getMonth();

  const valueB =
    dateB.getFullYear() * 12 + dateB.getMonth();

  if (valueA < valueB) return -1;
  if (valueA > valueB) return 1;

  return 0;
};


/**
 * Último día calendario del mes.
 *
 * Ejemplos:
 * febrero 2026 -> 28
 * septiembre -> 30
 * octubre -> 31
 */
const getLastDayOfMonth = (date) => {
  return new Date(
    date.getFullYear(),
    date.getMonth() + 1,
    0
  ).getDate();
};


/**
 * Día equivalente para nómina de 30 días.
 *
 * Solo se usa cuando el empleado YA trabajaba
 * antes del mes que estamos calculando.
 *
 * Reglas:
 *
 * Mes de 31 días:
 * día 29 -> 29
 * día 30 -> 30
 * día 31 -> 30
 *
 * Mes de 30 días:
 * día 29 -> 29
 * día 30 -> 30
 *
 * Febrero 28 días:
 * día 27 -> 27
 * día 28 -> 30
 *
 * Febrero bisiesto:
 * día 28 -> 28
 * día 29 -> 30
 */
const getPayrollDay = (date) => {
  const day = date.getDate();
  const lastDay = getLastDayOfMonth(date);

  // En meses menores a 30 días,
  // el último día completa los 30 días de nómina.
  if (lastDay < 30 && day === lastDay) {
    return 30;
  }

  // En meses de 31 días nunca se pagan más de 30.
  return Math.min(day, 30);
};


/**
 * Calcula los días trabajados del mes.
 *
 * REGLAS:
 *
 * 1. Si fue contratado antes del mes actual:
 *    se maneja como trabajador de mes completo.
 *
 * 2. Si fue contratado este mismo mes:
 *    se cuentan solamente los días reales
 *    transcurridos desde su fecha de ingreso.
 *
 *    Ejemplo:
 *    hireDate = 07/09
 *    hoy      = 10/09
 *    resultado = 3 días
 *
 * 3. Si existe endDate, el conteo se detiene
 *    en esa fecha.
 *
 * 4. Nunca devuelve menos de 0 ni más de 30.
 */
export const calculateWorkedDays = (
  hireDateValue,
  endDateValue = null,
  currentDate = new Date()
) => {
  const hireDate = parseDate(hireDateValue);

  if (!hireDate) {
    return 0;
  }

  const today = new Date(
    currentDate.getFullYear(),
    currentDate.getMonth(),
    currentDate.getDate()
  );

  const hireMonthComparison =
    compareYearMonth(hireDate, today);

  /*
   * El empleado todavía no ingresó.
   *
   * Puede ser:
   * - contratado para un mes futuro
   * - contratado más adelante este mismo mes
   */
  if (
    hireMonthComparison > 0 ||
    (
      hireMonthComparison === 0 &&
      hireDate.getDate() > today.getDate()
    )
  ) {
    return 0;
  }


  const endDate = parseDate(endDateValue);

  /*
   * Determinamos hasta qué fecha contar:
   *
   * normalmente hoy;
   * si el contrato terminó antes, usamos endDate.
   */
  let effectiveDate = today;

  if (endDate && endDate < today) {
    effectiveDate = endDate;
  }


  /*
   * Si el contrato terminó antes del mes actual,
   * no trabajó ningún día de este mes.
   */
  if (
    endDate &&
    compareYearMonth(endDate, today) < 0
  ) {
    return 0;
  }


  /*
   * CASO 1:
   * Contratado DURANTE el mes actual.
   *
   * Aquí NO aplicamos redondeo de nómina.
   * Se utilizan días calendario reales.
   *
   * Ejemplos:
   *
   * contratado 10 / mes termina 30
   * 30 - 10 = 20
   *
   * contratado 10 / febrero termina 28
   * 28 - 10 = 18
   *
   * contratado 10 / mes termina 31
   * 31 - 10 = 21
   */
  if (hireMonthComparison === 0) {
    const workedDays =
      effectiveDate.getDate() -
      hireDate.getDate();

    return Math.max(
      0,
      Math.min(workedDays, 30)
    );
  }


  /*
   * CASO 2:
   * Contratado ANTES del mes actual.
   *
   * Aquí sí se utiliza el criterio
   * de nómina mensual de 30 días.
   */
  const workedDays = getPayrollDay(
    effectiveDate
  );

  return Math.max(
    0,
    Math.min(workedDays, 30)
  );
};


/**
 * Obtiene el haber básico desde el contrato.
 *
 * El backend actualmente devuelve:
 * baseSalary: "3300"
 *
 * Por eso siempre lo convertimos a Number.
 */
export const getBaseSalary = (contract) => {
  const baseSalary =
    Number(contract?.baseSalary);

  if (
    !Number.isFinite(baseSalary) ||
    baseSalary < 0
  ) {
    return 0;
  }

  return baseSalary;
};


/**
 * Calcula el sueldo básico acumulado
 * según los días trabajados.
 *
 * Fórmula:
 *
 * Haber básico / 30 × días trabajados
 */
export const calculateBasicEarnings = (
  baseSalary,
  workedDays
) => {
  const salary = Number(baseSalary) || 0;
  const days = Number(workedDays) || 0;

  return (salary / 30) * days;
};


/**
 * Resumen salarial.
 *
 * Por ahora implementamos únicamente:
 *
 * - Haber básico
 * - Días trabajados
 * - Sueldo básico
 *
 * Los demás cálculos se irán agregando
 * posteriormente aquí.
 */
export const calculateSalarySummary = ({
  contract,
  currentDate = new Date(),
}) => {
  if (!contract) {
    return {
      baseSalary: 0,
      workedDays: 0,
      basicEarnings: 0,

      // Valores temporales para no romper
      // los componentes inferiores.
      seniorityBonus: 0,
      seniorityDescription: "",
      totalEarned: 0,
      gestoraDeduction: 0,
      deudasDeduction: 0,
      anticiposDeduction: 0,
      netPayable: 0,
    };
  }


  /*
   * HABER BÁSICO
   */
  const baseSalary =
    getBaseSalary(contract);


  /*
   * DÍAS TRABAJADOS
   */
  const workedDays =
    calculateWorkedDays(
      contract.hireDate,
      contract.endDate,
      currentDate
    );


  /*
   * SUELDO BÁSICO
   */
  const basicEarnings =
    calculateBasicEarnings(
      baseSalary,
      workedDays
    );


  return {
    baseSalary,
    workedDays,
    basicEarnings,

    /*
     * Temporalmente en 0.
     * Los iremos implementando después.
     */
    seniorityBonus: 0,
    seniorityDescription: "",
    totalEarned: 0,
    gestoraDeduction: 0,
    deudasDeduction: 0,
    anticiposDeduction: 0,
    netPayable: 0,
  };
};