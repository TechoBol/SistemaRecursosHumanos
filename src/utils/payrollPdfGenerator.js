import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import techobolLogo from "../assets/logotechobol.png";
import megadisLogo from "../assets/logomegadis.png";
import rhinoconsLogo from "../assets/logorhinocons.jpeg";
import {
  MONTH_NAMES,
  getPayrollTheme,
  formatMoneyPdf,
  formatNetSalaryPdf,
  formatDatePdf,
  getFormattedUpdateTimestamp,
} from "../components/ui/PayrollPDF.styles";
import {
  CONSOLIDATED_JOB_CATEGORIES,
  findJobCategory,
  getFiscalOrderForConsolidated,
  formatBranchTitle,
  calculatePayrollTotals,
} from "./payrollClassification";

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
    "Generado:",
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

const sortEmployeesByName = (employees = []) =>
  [...employees].sort((a, b) =>
    getEmployeeFullName(a).localeCompare(getEmployeeFullName(b), "es", {
      sensitivity: "base",
    })
  );

{/** CONTENIDO FILAS DE LA TABLA */}
const buildEmployeeTableRow = (employee, index, theme, isFiscal = false) => {
  const row = [
    {
      content: String(index),
      styles: { halign: "center" },
    },
    {
      content: getEmployeeFullName(employee).toUpperCase(),
      styles: { halign: "left" },
    },
    {
      content: (employee.contractJobTitleName || "-").toUpperCase(),
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
  ];

  if (isFiscal) {
    const cns = Number(employee.grossPay || 0) * 0.1;
    row.push({
      content: formatMoneyPdf(cns),
      styles: { halign: "right" },
    });
  }

  row.push(
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
      content: formatNetSalaryPdf(employee.netSalary),
      styles: {
        halign: "right",
        fontStyle: "bold",
        textColor: theme.primaryDark,
      },
    }
  );

  return row;
};

const buildTotalsRow = (
  totals,
  theme,
  label = "TOTAL GENERAL",
  level = "general",
  isFiscal = false
) => {
  const isGeneral = level === "general";
  const isFiscalDivision = level === "fiscal";

  let rowFillColor = theme.totalsBg;
  let labelTextColor = theme.primaryDark;
  let fontSize = 6.4;

  if (level === "division") {
    rowFillColor = [248, 250, 252];
    labelTextColor = [71, 85, 105];
    fontSize = 6.0;
  } else if (isFiscalDivision) {
    rowFillColor = theme.totalsBg;
    labelTextColor = theme.primaryDark;
    fontSize = 6.4;
  } else {
    rowFillColor = theme.totalsBg;
    labelTextColor = theme.primaryDark;
    fontSize = 6.8;
  }

  const baseStyle = {
    halign: "right",
    fontStyle: "bold",
    fillColor: rowFillColor,
    fontSize,
  };

  const netSalaryStyle = isGeneral
    ? {
        ...baseStyle,
        fillColor: theme.liquidHighlightBg,
        textColor: theme.liquidHighlightText,
        fontSize: 7.2,
      }
    : isFiscalDivision
    ? {
        ...baseStyle,
        fillColor: theme.liquidHighlightBg,
        textColor: theme.primaryDark,
        fontSize: 6.6,
      }
    : {
        ...baseStyle,
        textColor: theme.primaryDark,
      };

  const row = [
    {
      content: label,
      colSpan: 4,
      styles: { ...baseStyle, textColor: labelTextColor },
    },
    {
      content: formatMoneyPdf(totals.baseSalary),
      styles: baseStyle,
    },
    {
      content: "",
      styles: { fillColor: rowFillColor },
    },
    {
      content: formatMoneyPdf(totals.earnedSalary),
      styles: baseStyle,
    },
    {
      content: formatMoneyPdf(totals.seniorityBonus),
      styles: baseStyle,
    },
    {
      content: formatMoneyPdf(totals.otherBonuses),
      styles: baseStyle,
    },
    {
      content: formatMoneyPdf(totals.grossPay),
      styles: { ...baseStyle, textColor: theme.primaryDark },
    },
  ];

  if (isFiscal) {
    const cnsTotal = Number(totals.grossPay || 0) * 0.1;
    row.push({
      content: formatMoneyPdf(cnsTotal),
      styles: baseStyle,
    });
  }

  row.push(
    {
      content: formatMoneyPdf(totals.afpDeduction),
      styles: baseStyle,
    },
    {
      content: formatMoneyPdf(totals.absenceDeduction),
      styles: baseStyle,
    },
    {
      content: formatMoneyPdf(totals.advanceDeduction),
      styles: baseStyle,
    },
    {
      content: formatMoneyPdf(totals.totalDeductions),
      styles: baseStyle,
    },
    {
      content: formatNetSalaryPdf(totals.netSalary),
      styles: netSalaryStyle,
    }
  );

  return row;
};

const buildConsolidatedTableBody = (
  payrolls,
  theme,
  consolidatedCompanyName
) => {
  const consolidatedKey = getCompanyKey(consolidatedCompanyName);
  const orderedFiscalKeys = getFiscalOrderForConsolidated(consolidatedKey);

  // 1. Agrupar empleados por empresa fiscal
  const payrollsByFiscal = {};
  payrolls.forEach((p) => {
    const fiscalKey = getCompanyKey(p.contractCompanyName);
    if (!payrollsByFiscal[fiscalKey]) {
      payrollsByFiscal[fiscalKey] = [];
    }
    payrollsByFiscal[fiscalKey].push(p);
  });

  // Asegurar el orden de empresas fiscales solicitado para la empresa consolidada activa
  const existingFiscalKeys = Object.keys(payrollsByFiscal);
  const keysToProcess = [
    ...orderedFiscalKeys.filter((k) => existingFiscalKeys.includes(k)),
    ...existingFiscalKeys.filter((k) => !orderedFiscalKeys.includes(k)),
  ];

  const rows = [];
  let index = 1;

  keysToProcess.forEach((fiscalKey) => {
    const fiscalPayrolls = payrollsByFiscal[fiscalKey] || [];
    if (fiscalPayrolls.length === 0) return;

    // Header del Grupo Principal (Empresa Fiscal)
    rows.push([
      {
        content: `  EMPRESA FISCAL: ${fiscalKey}`,
        colSpan: 15,
        styles: {
          fillColor: theme.subheaderBg,
          textColor: [255, 255, 255],
          fontStyle: "bold",
          fontSize: 7.6,
          halign: "left",
          cellPadding: { top: 2.4, bottom: 2.4, left: 4, right: 4 },
        },
      },
    ]);

    // Clasificar empleados en:
    // 1. CENTRAL GERENTES
    // 2. CENTRAL JEFE DE AREA
    // 3. CENTRAL JEFES DE REGION
    // 4. JEFES DE SECTOR
    // 5. CENTRAL TECNICOS
    // 6. Sucursales (para cualquier otro cargo)
    const categoryBuckets = CONSOLIDATED_JOB_CATEGORIES.map((cat) => ({
      key: cat.key,
      title: cat.title,
      employees: [],
    }));

    const branchBuckets = {};

    fiscalPayrolls.forEach((employee) => {
      const matchedCategory = findJobCategory(employee.jobTitleName);
      if (matchedCategory) {
        const bucket = categoryBuckets.find(
          (b) => b.key === matchedCategory.key
        );
        if (bucket) {
          bucket.employees.push(employee);
          return;
        }
      }

      // Si no coincide con ninguna categoría central, agrupar por sucursal
      const branchTitle = formatBranchTitle(employee.branchName);
      if (!branchBuckets[branchTitle]) {
        branchBuckets[branchTitle] = [];
      }
      branchBuckets[branchTitle].push(employee);
    });

    const activeDivisions = [];

    // 1. Las 5 categorías fijas
    categoryBuckets.forEach((cat) => {
      if (cat.employees.length > 0) {
        activeDivisions.push({
          title: cat.title,
          employees: sortEmployeesByName(cat.employees),
        });
      }
    });

    // 2. Sucursales ordenadas alfabéticamente
    const sortedBranchTitles = Object.keys(branchBuckets).sort((a, b) =>
      a.localeCompare(b, "es", { sensitivity: "base" })
    );

    sortedBranchTitles.forEach((branchTitle) => {
      activeDivisions.push({
        title: branchTitle,
        employees: sortEmployeesByName(branchBuckets[branchTitle]),
      });
    });

    // Renderizar cada división con sus empleados y subtotales
    activeDivisions.forEach((division) => {
      // Header de la división (Categoría o Sucursal)
      rows.push([
        {
          content: `    ${division.title.toUpperCase()}`,
          colSpan: 15,
          styles: {
            fillColor: theme.branchBg,
            textColor: theme.branchText,
            fontStyle: "bold",
            fontSize: 7.0,
            halign: "left",
            cellPadding: { top: 2.0, bottom: 2.0, left: 6, right: 4 },
          },
        },
      ]);

      // Filas de empleados
      division.employees.forEach((employee) => {
        rows.push(buildEmployeeTableRow(employee, index, theme));
        index++;
      });

      // Subtotal de la división (Categoría o Sucursal)
      const divisionTotals = calculatePayrollTotals(division.employees);
      rows.push(
        buildTotalsRow(
          divisionTotals,
          theme,
          `TOTAL ${division.title.toUpperCase()}`,
          "division"
        )
      );
    });

    // Subtotal de todo el grupo Empresa Fiscal
    const fiscalTotals = calculatePayrollTotals(fiscalPayrolls);
    rows.push(
      buildTotalsRow(
        fiscalTotals,
        theme,
        `TOTAL EMPRESA FISCAL: ${fiscalKey}`,
        "fiscal"
      )
    );
  });

  return rows;
};

const buildTableHeader = (theme, isFiscal = false) => {
  const firstRow = [
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
      content: "CARGO",
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
  ];

  if (isFiscal) {
    firstRow.push({
      content: "APORTE\nCNS 10%",
      rowSpan: 2,
      styles: { halign: "center", valign: "middle" },
    });
  }

  firstRow.push(
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
    }
  );

  const secondRow = [
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
  ];

  return [firstRow, secondRow];
};

const drawHeader = async (
  doc,
  companyName,
  companyTaxId,
  theme,
  titleText,
  subtitle,
  timestamp,
  locationText = COMPANY_LOCATION
) => {
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
    doc.text(`NIT ${companyTaxId}`, companyTextX, 16.5);
  }

  doc.text(locationText, companyTextX, 20.5);

  // Título principal
  doc.setFont("helvetica", "bold");
  doc.setFontSize(13);
  doc.setTextColor(...theme.primary);

  doc.text(titleText, centerX, 12.5, { align: "center" });

  doc.setFontSize(7.6);
  doc.setTextColor(...theme.mutedText);

  doc.text(subtitle, centerX, 17, { align: "center" });

  doc.setFillColor(...theme.primary);

  doc.roundedRect(centerX - 12, 19.5, 24, 1.1, 0.5, 0.5, "F");

  // Última actualización
  drawUpdateMetadataBox(doc, 232, 7.5, 55, 15.5, theme, timestamp);
};

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

  const isFiscalPayroll = payrollType === "contract";

  const autoTableConfig = {
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

    columnStyles: isFiscalPayroll
      ? {
          0: { cellWidth: 7, halign: "center" },
          1: { cellWidth: 39, halign: "left" },
          2: { cellWidth: 28, halign: "left" },
          3: { cellWidth: 15, halign: "center" },
          4: { cellWidth: 16, halign: "right" },
          5: { cellWidth: 10, halign: "center" },
          6: { cellWidth: 16, halign: "right" },
          7: { cellWidth: 16, halign: "right" },
          8: { cellWidth: 15, halign: "right" },
          9: { cellWidth: 17, halign: "right", fontStyle: "bold" },
          10: { cellWidth: 16, halign: "right" },
          11: { cellWidth: 16, halign: "right" },
          12: { cellWidth: 15, halign: "right" },
          13: { cellWidth: 15, halign: "right" },
          14: { cellWidth: 16, halign: "right" },
          15: { cellWidth: 20, halign: "right", fontStyle: "bold" },
        }
      : {
          0: { cellWidth: 8, halign: "center" },
          1: { cellWidth: 42, halign: "left" },
          2: { cellWidth: 32, halign: "left" },
          3: { cellWidth: 16, halign: "center" },
          4: { cellWidth: 17, halign: "right" },
          5: { cellWidth: 11, halign: "center" },
          6: { cellWidth: 17, halign: "right" },
          7: { cellWidth: 17, halign: "right" },
          8: { cellWidth: 16, halign: "right" },
          9: { cellWidth: 18, halign: "right", fontStyle: "bold" },
          10: { cellWidth: 16, halign: "right" },
          11: { cellWidth: 16, halign: "right" },
          12: { cellWidth: 15, halign: "right" },
          13: { cellWidth: 16, halign: "right" },
          14: { cellWidth: 20, halign: "right", fontStyle: "bold" },
        },

    didParseCell: (data) => {
      const liquidColIndex = isFiscalPayroll ? 15 : 14;
      if (data.section === "head" && data.column.index === liquidColIndex) {
        data.cell.styles.fillColor = theme.primaryDark;
      }
    },
  };

  if (payrollType === "contract") {
    // Agrupar empleados por ciudad para la Planilla Fiscal
    const groupsByCity = {};
    payrolls.forEach((p) => {
      const cityName = (p.cityName || "SIN CIUDAD").trim().toUpperCase();
      if (!groupsByCity[cityName]) {
        groupsByCity[cityName] = [];
      }
      groupsByCity[cityName].push(p);
    });

    const sortedCities = Object.keys(groupsByCity).sort((a, b) =>
      a.localeCompare(b, "es", { sensitivity: "base" })
    );

    for (let i = 0; i < sortedCities.length; i++) {
      const cityName = sortedCities[i];
      const cityPayrolls = groupsByCity[cityName];

      if (i > 0) {
        doc.addPage();
      }

      const cityTitle = `PLANILLA FISCAL DE SUELDOS - ${cityName}`;
      const cityLocation =
        cityName && cityName !== "SIN CIUDAD"
          ? `${cityName} - Bolivia`
          : COMPANY_LOCATION;
      await drawHeader(
        doc,
        companyName,
        companyTaxId,
        theme,
        cityTitle,
        subtitle,
        timestamp,
        cityLocation
      );

      const cityTotals = cityPayrolls.reduce(
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

      const sortedEmployees = [...cityPayrolls].sort((a, b) =>
        getEmployeeFullName(a).localeCompare(getEmployeeFullName(b), "es", {
          sensitivity: "base",
        })
      );

      const body = sortedEmployees.map((employee, idx) =>
        buildEmployeeTableRow(employee, idx + 1, theme, true)
      );

      body.push(buildTotalsRow(cityTotals, theme, "TOTAL GENERAL", "general", true));

      autoTable(doc, {
        startY: 26,
        margin: { top: 26, bottom: 12, left: 10, right: 10 },
        head: buildTableHeader(theme, true),
        body,
        ...autoTableConfig,
      });
    }
  } else {
    // Planilla Consolidada (ordenada por Empresa Fiscal, Categorías Centrales y Sucursales)
    await drawHeader(
      doc,
      companyName,
      companyTaxId,
      theme,
      payrollLabels.title,
      subtitle,
      timestamp
    );

    const body = buildConsolidatedTableBody(payrolls, theme, companyName);
    const overallTotals = totals || calculatePayrollTotals(payrolls);
    body.push(buildTotalsRow(overallTotals, theme, "TOTAL GENERAL", "general"));

    autoTable(doc, {
      startY: 26,
      margin: { top: 26, bottom: 12, left: 10, right: 10 },
      head: buildTableHeader(theme),
      body,
      ...autoTableConfig,
    });
  }

  // Footer en todas las páginas
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
    doc.text(`Página ${page} de ${totalPages}`, 287, 205.2, {
      align: "right",
    });
  }

  // Nombre del archivo
  const sanitizedCompanyName = (companyName || "empresa")
    .replace(/[^a-zA-Z0-9]/g, "_")
    .toLowerCase();

  const fileName =
    `${sanitizedCompanyName}_` +
    `${payrollType === "contract" ? "fiscal" : "consolidado"}_` +
    `${periodYear}_` +
    `${String(periodMonth).padStart(2, "0")}.pdf`;

  doc.save(fileName);
};