export const MONTH_NAMES = [
  "",
  "Enero",
  "Febrero",
  "Marzo",
  "Abril",
  "Mayo",
  "Junio",
  "Julio",
  "Agosto",
  "Septiembre",
  "Octubre",
  "Noviembre",
  "Diciembre",
];

const BASE_THEME = {
  totalsBg: [241, 245, 249],
  text: [30, 41, 59],
  mutedText: [100, 116, 139],
  border: [226, 232, 240],
  white: [255, 255, 255],
};

export const COMPANY_THEMES = {
  TECHOBOL: {
    primary: [45, 67, 124],
    primaryDark: [30, 45, 88],
    subheaderBg: [72, 91, 145],
    branchBg: [242, 244, 249],
    branchText: [30, 45, 88],
    liquidHighlightBg: [235, 239, 248],
    liquidHighlightText: [30, 45, 88],
    borderSoft: [211, 217, 232],
  },

  MEGADIS: {
    primary: [176, 54, 54],
    primaryDark: [132, 38, 38],
    subheaderBg: [196, 76, 76],
    branchBg: [252, 242, 242],
    branchText: [132, 38, 38],
    liquidHighlightBg: [250, 235, 235],
    liquidHighlightText: [132, 38, 38],
    borderSoft: [238, 211, 211],
  },

  RHINOCONS: {
    primary: [48, 105, 153],
    primaryDark: [31, 73, 112],
    subheaderBg: [74, 125, 166],
    branchBg: [240, 246, 250],
    branchText: [31, 73, 112],
    liquidHighlightBg: [231, 241, 248],
    liquidHighlightText: [31, 73, 112],
    borderSoft: [207, 222, 234],
  },
};

export const getPayrollTheme = (companyName = "") => {
  const name = companyName.toLowerCase();
  const companyKey = name.includes("megadis")
    ? "MEGADIS" : name.includes("rhinocons")
    ? "RHINOCONS" : "TECHOBOL";
  return { ...BASE_THEME, ...COMPANY_THEMES[companyKey] };
};

export const formatMoneyPdf = (amount) =>
  new Intl.NumberFormat("es-BO", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(Number(amount) || 0);

export const formatDatePdf = (dateStr) => {
  if (!dateStr) return "-";
  const [year, month, day] = String(dateStr).split("T")[0].split("-");
  if (!year || !month || !day) return dateStr;
  return `${day.padStart(2, "0")}-${month.padStart(2, "0")}-${year.slice(-2)}`;
};

export const getFormattedUpdateTimestamp = () => {
  const now = new Date();
  const month = MONTH_NAMES[now.getMonth() + 1].toLowerCase();
  const hours = now.getHours();
  const displayHours = hours % 12 || 12;
  return {
    dateLine: `${now.getDate()} de ${month} de ${now.getFullYear()}`,
    timeLine: `a las ${displayHours}:${String(now.getMinutes()).padStart(
      2,
      "0"
    )} ${hours >= 12 ? "p. m." : "a. m."}`,
  };
};