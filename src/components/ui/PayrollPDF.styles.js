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
    primary: [24, 90, 157],
    primaryDark: [16, 68, 122],
    subheaderBg: [48, 114, 181],
    branchBg: [240, 246, 254],
    branchText: [16, 68, 122],
    liquidHighlightBg: [234, 243, 255],
    liquidHighlightText: [16, 68, 122],
    borderSoft: [215, 226, 238],
  },

  MEGADIS: {
    primary: [184, 50, 50],
    primaryDark: [142, 34, 34],
    subheaderBg: [205, 75, 75],
    branchBg: [254, 242, 242],
    branchText: [142, 34, 34],
    liquidHighlightBg: [254, 237, 237],
    liquidHighlightText: [142, 34, 34],
    borderSoft: [243, 214, 214],
  },

  RHINOCONS: {
    primary: [47, 87, 60],
    primaryDark: [30, 60, 40],
    subheaderBg: [65, 115, 80],
    branchBg: [240, 253, 244],
    branchText: [30, 60, 40],
    liquidHighlightBg: [220, 248, 228],
    liquidHighlightText: [30, 60, 40],
    borderSoft: [200, 230, 210],
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