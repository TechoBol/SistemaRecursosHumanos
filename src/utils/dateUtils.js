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

export const getEmployeeStatus = (employee) => {
  if (!employee) return { label: "Finalizado", variant: "danger" };

  if (employee.status === "INACTIVE" || employee.status === "TERMINATED") {
    return { label: "Finalizado", variant: "danger" };
  }

  const activeContract = employee.contracts
    ? employee.contracts.find((c) => c.isActive) || employee.contracts[0]
    : null;

  if (!activeContract) {
    return { label: "Finalizado", variant: "danger" };
  }

  if (
    activeContract.isActive === false ||
    activeContract.status === "ENDED" ||
    activeContract.status === "CANCELLED"
  ) {
    return { label: "Finalizado", variant: "danger" };
  }

  if (!activeContract.endDate) {
    return { label: "Activo", variant: "success" };
  }

  const [endYear, endMonth, endDay] = activeContract.endDate
    .split("T")[0]
    .split("-")
    .map(Number);

  const today = new Date();
  const currentYear = today.getFullYear();
  const currentMonth = today.getMonth() + 1;
  const currentDay = today.getDate();

  const endDateNorm = new Date(endYear, endMonth - 1, endDay);
  const todayNorm = new Date(currentYear, currentMonth - 1, currentDay);

  if (endDateNorm < todayNorm) {
    return { label: "Finalizado", variant: "danger" };
  }

  if (endYear === currentYear && endMonth === currentMonth) {
    return { label: "Finaliza este mes", variant: "warning" };
  }

  return { label: "Activo", variant: "success" };
};