import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import techobolLogo from "../assets/logotechobol.png";
import megadisLogo from "../assets/logomegadis.png";
import rhinoconsLogo from "../assets/logorhinocons.jpeg";
import {
  MONTH_NAMES,
  getPayrollTheme,
  formatMoneyPdf,
  formatDatePdf,
  getFormattedUpdateTimestamp,
} from "../components/ui/PayrollPDF.styles";

const COMPANY_LOCATION = "Cochabamba - Bolivia";

const PAYROLL_LABELS = {
  contract: {
    name: "Planilla Fiscal",
    title: "PLANILLA FISCAL DE SUELDOS",
  },
  consolidated: {
    name: "Planilla Consolidada",
    title: "PLANILLA CONSOLIDADA DE SUELDOS",
  },
};

const COMPANY_LOGOS = {
  TECHOBOL: {
    src: techobolLogo,
    format: "PNG",
  },
  MEGADIS: {
    src: megadisLogo,
    format: "PNG",
  },
  RHINOCONS: {
    src: rhinoconsLogo,
    format: "JPEG",
  },
};

const getCompanyKey = (companyName = "") => {
  const name = companyName.toLowerCase();
  if (name.includes("megadis")) return "MEGADIS";
  if (name.includes("rhinocons")) return "RHINOCONS";
  return "TECHOBOL";
};

const loadImage = (src) =>
  new Promise((resolve, reject) => {
    const image = new Image();
    image.onload = () => resolve(image);
    image.onerror = reject;
    image.src = src;
  });

const getEmployeeFullName = (employee) => {
  if (employee.employeeLastNames) {
    return `${employee.employeeLastNames} ${
      employee.employeeFirstNames || ""
    }`.trim();
  }
  return employee.employeeName || "-";
};

const drawCompanyLogo = async (doc, companyName) => {
  const companyKey = getCompanyKey(companyName);
  const logo = COMPANY_LOGOS[companyKey];
  const image = await loadImage(logo.src);
  const maxWidth = 13;
  const maxHeight = 15;
  const scale = Math.min(
    maxWidth / image.width,
    maxHeight / image.height
  );
  const width = image.width * scale;
  const height = image.height * scale;
  const x = 10;
  const y = 7 + (maxHeight - height) / 2;
  doc.addImage(
    image,
    logo.format,
    x,
    y,
    width,
    height
  );
};

const drawUpdateMetadataBox = (
  doc,
  x,
  y,
  width,
  height,
  theme,
  timestamp
) => {
  doc.setFillColor(250, 252, 255);
  doc.setDrawColor(...theme.borderSoft);
  doc.setLineWidth(0.25);
  doc.roundedRect(x, y, width, height, 1.8, 1.8, "FD");

  const iconX = x + 3.2;
  const iconY = y + 4;

  doc.setDrawColor(...theme.primary);
  doc.setLineWidth(0.45);
  doc.roundedRect(
    iconX,
    iconY,
    5.2,
    5.5,
    0.5,
    0.5,
    "D"
  );

  doc.setFillColor(...theme.primary);
  doc.rect(iconX, iconY, 5.2, 1.8, "F");

  doc.setFillColor(...theme.white);
  doc.circle(iconX + 1.4, iconY + 0.9, 0.35, "F");
  doc.circle(iconX + 3.8, iconY + 0.9, 0.35, "F");

  const textX = x + 10.5;

  doc.setFont("helvetica", "bold");
  doc.setFontSize(6.2);
  doc.setTextColor(...theme.mutedText);
  doc.text(
    "Última actualización:",
    textX,
    y + 4.8
  );

  doc.setFont("helvetica", "normal");
  doc.setFontSize(6.8);
  doc.setTextColor(...theme.text);
  doc.text(timestamp.dateLine, textX, y + 8.8);
  doc.setFontSize(6.2);
  doc.setTextColor(...theme.mutedText);
  doc.text(timestamp.timeLine, textX, y + 12.6);
};

const groupPayrollsByBranch = (payrolls) => {
  const groups = {};

  payrolls.forEach((payroll) => {
    const branchName = (payroll.branchName || "CENTRAL").trim();

    if (!groups[branchName]) {
      groups[branchName] = [];
    }

    groups[branchName].push(payroll);
  });

  return Object.keys(groups)
    .sort((a, b) =>
      a.localeCompare(b, "es", {
        sensitivity: "base",
      })
    )
    .map((branchName) => ({
      branchName,
      employees: groups[branchName].sort((a, b) =>
        getEmployeeFullName(a).localeCompare(
          getEmployeeFullName(b),
          "es",
          { sensitivity: "base" }
        )
      ),
    }));
};

const buildTableBody = (payrolls, theme) => {
  const rows = [];
  const groups = groupPayrollsByBranch(payrolls);

  let index = 1;

  groups.forEach(({ branchName, employees }) => {
    rows.push([
      {
        content: `  ${branchName.toUpperCase()}`,
        colSpan: 15,
        styles: {
          fillColor: theme.branchBg,
          textColor: theme.branchText,
          fontStyle: "bold",
          fontSize: 7.2,
          halign: "left",
          cellPadding: {
            top: 2.2,
            bottom: 2.2,
            left: 4,
            right: 4,
          },
        },
      },
    ]);

    employees.forEach((employee) => {
      rows.push([
        {
          content: String(index),
          styles: { halign: "center" },
        },
        {
          content: getEmployeeFullName(employee).toUpperCase(),
          styles: { halign: "left" },
        },
        {
          content: (employee.jobTitleName || "-").toUpperCase(),
          styles: { halign: "left" },
        },
        {
          content: formatDatePdf(employee.hireDate),
          styles: { halign: "center" },
        },
        {
          content: formatMoneyPdf(employee.baseSalary),
          styles: { halign: "right" },
        },
        {
          content: String(employee.workedDays ?? 30),
          styles: { halign: "center" },
        },
        {
          content: formatMoneyPdf(employee.earnedSalary),
          styles: { halign: "right" },
        },
        {
          content: formatMoneyPdf(employee.seniorityBonus),
          styles: { halign: "right" },
        },
        {
          content: formatMoneyPdf(employee.otherBonuses),
          styles: { halign: "right" },
        },
        {
          content: formatMoneyPdf(employee.grossPay),
          styles: { halign: "right", fontStyle: "bold" },
        },
        {
          content: formatMoneyPdf(employee.afpDeduction),
          styles: { halign: "right" },
        },
        {
          content: formatMoneyPdf(employee.absenceDeduction),
          styles: { halign: "right" },
        },
        {
          content: formatMoneyPdf(employee.advanceDeduction),
          styles: { halign: "right" },
        },
        {
          content: formatMoneyPdf(employee.totalDeductions),
          styles: { halign: "right" },
        },
        {
          content: formatMoneyPdf(employee.netSalary),
          styles: { halign: "right", fontStyle: "bold", textColor: theme.primaryDark },
        },
      ]);
      index++;
    });
  });

  return rows;
};

const buildTotalsRow = (totals, theme) => {
  const totalStyle = {
    halign: "right",
    fontStyle: "bold",
    fillColor: theme.totalsBg,
  };

  return [
    {
      content: "TOTAL GENERAL",
      colSpan: 4,
      styles: { ...totalStyle, textColor: theme.primaryDark },
    },
    {
      content: formatMoneyPdf(totals.baseSalary),
      styles: totalStyle,
    },
    {
      content: "",
      styles: { fillColor: theme.totalsBg },
    },
    {
      content: formatMoneyPdf(totals.earnedSalary),
      styles: totalStyle,
    },
    {
      content: formatMoneyPdf(totals.seniorityBonus),
      styles: totalStyle,
    },
    {
      content: formatMoneyPdf(totals.otherBonuses),
      styles: totalStyle,
    },
    {
      content: formatMoneyPdf(totals.grossPay),
      styles: { ...totalStyle, textColor: theme.primaryDark },
    },
    {
      content: formatMoneyPdf(totals.afpDeduction),
      styles: totalStyle,
    },
    {
      content: formatMoneyPdf(totals.absenceDeduction),
      styles: totalStyle,
    },
    {
      content: formatMoneyPdf(totals.advanceDeduction),
      styles: totalStyle,
    },
    {
      content: formatMoneyPdf(totals.totalDeductions),
      styles: totalStyle,
    },
    {
      content: formatMoneyPdf(totals.netSalary),
      styles: {
        ...totalStyle,
        fillColor: theme.liquidHighlightBg,
        textColor: theme.liquidHighlightText,
        fontSize: 7.4,
      },
    },
  ];
};

const buildTableHeader = (theme) => [
  [
    {
      content: "N°",
      rowSpan: 2,
      styles: { halign: "center", valign: "middle" },
    },
    {
      content: "APELLIDOS Y NOMBRES",
      rowSpan: 2,
      styles: { halign: "center", valign: "middle" },
    },
    {
      content: "CARGO ACTUAL",
      rowSpan: 2,
      styles: { halign: "center", valign: "middle" },
    },
    {
      content: "FECHA\nDE INGRESO",
      rowSpan: 2,
      styles: { halign: "center", valign: "middle" },
    },
    {
      content: "HABER\nBÁSICO",
      rowSpan: 2,
      styles: { halign: "center", valign: "middle" },
    },
    {
      content: "DÍAS\nTRAB.",
      rowSpan: 2,
      styles: { halign: "center", valign: "middle" },
    },
    {
      content: "SUELDO\nBÁSICO",
      rowSpan: 2,
      styles: { halign: "center", valign: "middle" },
    },
    {
      content: "BONOS",
      colSpan: 2,
      styles: { halign: "center", valign: "middle" },
    },
    {
      content: "TOTAL\nGANADO",
      rowSpan: 2,
      styles: { halign: "center", valign: "middle" },
    },
    {
      content: "DESCUENTOS",
      colSpan: 3,
      styles: { halign: "center", valign: "middle" },
    },
    {
      content: "TOTAL\nDESC.",
      rowSpan: 2,
      styles: { halign: "center", valign: "middle" },
    },
    {
      content: "LÍQUIDO\nPAGABLE",
      rowSpan: 2,
      styles: { halign: "center", valign: "middle" },
    },
  ],
  [
    {
      content: "ANTIGÜEDAD",
      styles: { halign: "center", valign: "middle", fillColor: theme.subheaderBg },
    },
    {
      content: "OTROS BONOS",
      styles: { halign: "center", valign: "middle", fillColor: theme.subheaderBg },
    },
    {
      content: "GESTORA (AFP)",
      styles: { halign: "center", valign: "middle", fillColor: theme.subheaderBg },
    },
    {
      content: "PERM. / FALTAS",
      styles: { halign: "center", valign: "middle", fillColor: theme.subheaderBg },
    },
    {
      content: "ANTICIPOS",
      styles: { halign: "center", valign: "middle", fillColor: theme.subheaderBg },
    },
  ],
];

export const exportPayrollPdf = async ({
  payrolls = [],
  company = null,
  periodMonth = new Date().getMonth() + 1,
  periodYear = new Date().getFullYear(),
  payrollType = "contract",
  totals = null,
}) => {
  const companyName = company?.name || "";
  const companyTaxId = company?.taxId || "";
  const theme = getPayrollTheme(companyName);
  const payrollLabels = PAYROLL_LABELS[payrollType] || PAYROLL_LABELS.contract;
  const monthName = MONTH_NAMES[periodMonth] || "";
  const subtitle = `CORRESPONDIENTE AL MES DE ${monthName.toUpperCase()} ${periodYear}`;
  const timestamp = getFormattedUpdateTimestamp();

  const doc = new jsPDF({
    orientation: "landscape",
    unit: "mm",
    format: "a4",
  });

  const pageWidth = doc.internal.pageSize.getWidth();

  const centerX = pageWidth / 2;

  // Logo real de la empresa
  await drawCompanyLogo(doc, companyName);

  // Datos de la empresa
  const companyTextX = 25;

  doc.setFont("helvetica", "bold");
  doc.setFontSize(11);
  doc.setTextColor(15, 23, 42);
  doc.text(companyName, companyTextX, 12.5);
  doc.setFont("helvetica", "normal");
  doc.setFontSize(7.2);
  doc.setTextColor(...theme.mutedText);

  if (companyTaxId) {
    doc.text(
      `NIT ${companyTaxId}`,
      companyTextX,
      16.5
    );
  }

  doc.text(
    COMPANY_LOCATION,
    companyTextX,
    20.5
  );

  // Título principal
  doc.setFont("helvetica", "bold");
  doc.setFontSize(13);
  doc.setTextColor(...theme.primary);

  doc.text(
    payrollLabels.title,
    centerX,
    12.5,
    { align: "center" }
  );

  doc.setFontSize(7.6);
  doc.setTextColor(...theme.mutedText);

  doc.text(
    subtitle,
    centerX,
    17,
    { align: "center" }
  );

  doc.setFillColor(...theme.primary);

  doc.roundedRect(
    centerX - 12,
    19.5,
    24,
    1.1,
    0.5,
    0.5,
    "F"
  );

  // Última actualización
  drawUpdateMetadataBox(
    doc,
    232,
    7.5,
    55,
    15.5,
    theme,
    timestamp
  );

  // Tabla
  const body = buildTableBody(payrolls, theme);

  body.push(buildTotalsRow(totals, theme));

  autoTable(doc, {
    startY: 26,
    margin: {
      top: 26,
      bottom: 12,
      left: 10,
      right: 10,
    },
    head: buildTableHeader(theme),
    body,
    theme: "grid",
    headStyles: {
      fillColor: theme.primary,
      textColor: theme.white,
      fontStyle: "bold",
      fontSize: 6.5,
      cellPadding: {
        top: 1.8,
        bottom: 1.8,
        left: 1.2,
        right: 1.2,
      },
      lineWidth: 0.15,
      lineColor: theme.white,
    },

    bodyStyles: {
      fontSize: 6.5,
      textColor: theme.text,
      cellPadding: {
        top: 1.6,
        bottom: 1.6,
        left: 1.2,
        right: 1.2,
      },
      lineWidth: 0.1,
      lineColor: theme.border,
    },

    alternateRowStyles: {
      fillColor: [253, 254, 255],
    },

    columnStyles: {
      0: { cellWidth: 8, halign: "center" },
      1: { cellWidth: 42, halign: "left" },
      2: { cellWidth: 32, halign: "left" },
      3: { cellWidth: 16, halign: "center" },
      4: { cellWidth: 17, halign: "right" },
      5: { cellWidth: 11, halign: "center" },
      6: { cellWidth: 17, halign: "right" },
      7: { cellWidth: 17, halign: "right" },
      8: { cellWidth: 16, halign: "right" },
      9: { cellWidth: 18, halign: "right", fontStyle: "bold", },
      10: { cellWidth: 16, halign: "right" },
      11: { cellWidth: 16, halign: "right" },
      12: { cellWidth: 15, halign: "right" },
      13: { cellWidth: 16, halign: "right" },
      14: { cellWidth: 20, halign: "right", fontStyle: "bold" },
    },

    didParseCell: (data) => {
      if (
        data.section === "head" && data.column.index === 14
      ) {
        data.cell.styles.fillColor = theme.primaryDark;
      }
    },
  });

  // Footer
  const totalPages = doc.internal.getNumberOfPages();

  for (let page = 1; page <= totalPages; page++) {
    doc.setPage(page);
    doc.setDrawColor(...theme.border);
    doc.setLineWidth(0.25);
    doc.line(10, 201.5, 287, 201.5);
    doc.setFont("helvetica", "normal");
    doc.setFontSize(6.5);
    doc.setTextColor(...theme.mutedText);
    doc.text(
      `${companyName} • ${payrollLabels.name} • ${monthName} ${periodYear}`,
      10,
      205.2
    );
    doc.text(
      `Página ${page} de ${totalPages}`,
      287,
      205.2,
      { align: "right" }
    );
  }

  // Nombre del archivo
  const sanitizedCompanyName = (
    companyName || "empresa"
  )
    .replace(/[^a-zA-Z0-9]/g, "_")
    .toLowerCase();

  const fileName =
    `${sanitizedCompanyName}_` +
    `${payrollType}_` +
    `${periodYear}_` +
    `${String(periodMonth).padStart(2, "0")}.pdf`;

  doc.save(fileName);
};