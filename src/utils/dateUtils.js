const getDaysInMonth = (year, month) => {
  return new Date(year, month, 0).getDate();
};

const calculateSeniority = (dateString) => {
  if (!dateString) {
    return { years: 0, months: 0, days: 0 };
  }

  const [startYear, startMonth, startDay] = dateString
    .split("T")[0]
    .split("-")
    .map(Number);

  const today = new Date();

  let years = today.getFullYear() - startYear;
  let months = today.getMonth() + 1 - startMonth;
  let days = today.getDate() - startDay;

  if (days < 0) {
    months--;
    let previousMonth = today.getMonth();
    let previousMonthYear = today.getFullYear();
    if (previousMonth === 0) {
      previousMonth = 12;
      previousMonthYear--;
    }
    days += getDaysInMonth(previousMonthYear, previousMonth);
  }

  if (months < 0) {
    years--;
    months += 12;
  }

  if (years < 0) {
    return { years: 0, months: 0, days: 0 };
  }

  return { years, months, days };
};

export const getSeniorityShort = (dateString) => {
  if (!dateString) return "N/A";
  const { years, months } = calculateSeniority(dateString);
  return `${years} año${years !== 1 ? "s" : ""} ${months} mes${months !== 1 ? "es" : ""}`;
};

export const getSeniorityFull = (dateString) => {
  if (!dateString) return "Sin antigüedad";
  const { years, months, days } = calculateSeniority(dateString);
  return `${years} año${years !== 1 ? "s" : ""} ${months} mes${months !== 1 ? "es" : ""} ${days} día${days !== 1 ? "s" : ""}`;
};

// no hace calculo de fechas solo convierte fecha a texto
export const formatLongDate = (dateString) => {
  if (!dateString) return "";
  const [year, month, day] = dateString
    .split("T")[0]
    .split("-")
    .map(Number);
  const months = [
    "enero",
    "febrero",
    "marzo",
    "abril",
    "mayo",
    "junio",
    "julio",
    "agosto",
    "septiembre",
    "octubre",
    "noviembre",
    "diciembre",
  ];
  return `${day} de ${months[month - 1]} de ${year}`;
};

export const getContractStatus = (contract) => {
  if (!contract) return { label: "Finalizado", variant: "danger", isActive: false };

  // Si fue cancelado explícitamente
  if (contract.status === "CANCELLED") {
    return { label: "Finalizado", variant: "danger", isActive: false };
  }

  const rawEndDate = contract.endDate || contract.contractEndDate;
  if (!rawEndDate) {
    // Si no tiene fecha de fin, se considera activo (indefinido) a menos que esté inactivo
    const isExplicitlyInactive = contract.isActive === false && contract.status === "ENDED";
    if (isExplicitlyInactive) {
      return { label: "Finalizado", variant: "danger", isActive: false };
    }
    return { label: "Activo", variant: "success", isActive: true };
  }

  const [endYear, endMonth, endDay] = rawEndDate
    .split("T")[0]
    .split("-")
    .map(Number);

  if (!endYear || !endMonth || !endDay) {
    return { label: "Activo", variant: "success", isActive: true };
  }

  const today = new Date();
  const currentYear = today.getFullYear();
  const currentMonth = today.getMonth() + 1; // 1-12
  const currentDay = today.getDate();

  const endDateNorm = new Date(endYear, endMonth - 1, endDay);
  const todayNorm = new Date(currentYear, currentMonth - 1, currentDay);

  // 1. Si la fecha de fin de contrato ya pasó
  if (endDateNorm < todayNorm) {
    return { label: "Finalizado", variant: "danger", isActive: false };
  }

  // 2. Si la fecha de fin es dentro del mismo mes y año vigente
  if (endYear === currentYear && endMonth === currentMonth) {
    return { label: "Finaliza este mes", variant: "warning", isActive: true };
  }

  // 3. Si la fecha de fin es en meses futuros
  return { label: "Activo", variant: "success", isActive: true };
};

export const getEmployeeStatus = (employee) => {
  if (!employee) return { label: "Finalizado", variant: "danger" };

  if (employee.status === "INACTIVE" || employee.status === "TERMINATED") {
    return { label: "Finalizado", variant: "danger" };
  }

  if (!employee.contracts || employee.contracts.length === 0) {
    return { label: "Finalizado", variant: "danger" };
  }

  // Buscar el contrato más relevante: primero uno que según sus fechas esté activo
  const sortedContracts = [...employee.contracts].sort((a, b) => {
    const timeA = a.hireDate ? new Date(a.hireDate).getTime() : 0;
    const timeB = b.hireDate ? new Date(b.hireDate).getTime() : 0;
    return timeB - timeA;
  });

  const activeContract =
    sortedContracts.find((c) => getContractStatus(c).isActive) ||
    sortedContracts[0];

  if (!activeContract) {
    return { label: "Finalizado", variant: "danger" };
  }

  return getContractStatus(activeContract);
};
