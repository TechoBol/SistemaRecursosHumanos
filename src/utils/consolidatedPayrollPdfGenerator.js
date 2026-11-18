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
    return `${employee.employeeLastNames} ${employee.employeeFirstNames || ""
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
  const scale = Math.min(maxWidth / image.width, maxHeight / image.height);
  const width = image.width * scale;
  const height = image.height * scale;
  const x = 10;
  const y = 7 + (maxHeight - height) / 2;
  doc.addImage(image, logo.format, x, y, width, height);
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
  doc.roundedRect(iconX, iconY, 5.2, 5.5, 0.5, 0.5, "D");

  doc.setFillColor(...theme.primary);
  doc.rect(iconX, iconY, 5.2, 1.8, "F");

  doc.setFillColor(...theme.white);
  doc.circle(iconX + 1.4, iconY + 0.9, 0.35, "F");
  doc.circle(iconX + 3.8, iconY + 0.9, 0.35, "F");

  const textX = x + 10.5;

  doc.setFont("helvetica", "bold");
  doc.setFontSize(6.2);
  doc.setTextColor(...theme.mutedText);
  doc.text("Generado:", textX, y + 4.8);

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

/** Formatear fecha a DD/MM/AAAA */
const formatSlashDate = (dateVal) => {
  if (!dateVal) return "";
  const str = typeof dateVal === "string" ? dateVal.split("T")[0] : "";
  const parts = str.split("-");
  if (parts.length === 3) {
    return `${parts[2].padStart(2, "0")}/${parts[1].padStart(2, "0")}/${parts[0]}`;
  }
  return str;
};

/**
 * Construir el texto detallado de observaciones (faltas, permisos, anticipos)
 */
const buildEmployeeObservations = (employeeId, incidentsMap, advancesMap) => {
  const empIncidents = incidentsMap[employeeId] || [];
  const empAdvances = advancesMap[employeeId] || [];
  const lines = [];

  // Faltas y Permisos
  empIncidents.forEach((inc) => {
    const isAbsence =
      inc.type === "absence" ||
      inc.type === "ABSENCE" ||
      String(inc.type).toLowerCase().includes("falta");
    const isPermission =
      inc.type === "permission" ||
      inc.type === "PERMISSION" ||
      String(inc.type).toLowerCase().includes("permiso");

    if (isAbsence || isPermission) {
      const label = isAbsence ? "Falta" : "Permiso";
      const isHalf =
        inc.duration === "halfDay" ||
        inc.durationType === "HALF_DAY" ||
        String(inc.duration).toLowerCase().includes("half");
      const dayText = isHalf ? "0.5 dia" : "1 dia";
      const dateFormatted = formatSlashDate(inc.date || inc.incidentDate);
      lines.push(`${label} de ${dayText} en ${dateFormatted}`);
    }
  });

  // Anticipos
  empAdvances.forEach((adv) => {
    const isDebt =
      adv.type === "debt" ||
      adv.type === "DEBT" ||
      String(adv.type).toLowerCase().includes("deuda");
    const advConcept = isDebt ? "reposicion" : "adelanto";
    const amountFormatted = formatMoneyPdf(adv.amount);
    const dateFormatted = formatSlashDate(adv.date || adv.advanceDate);
    lines.push(`Anticipo (${advConcept}) Bs ${amountFormatted} en ${dateFormatted}`);
  });

  return lines.length > 0 ? lines.join("\n") : "-";
};

/** FILA DE EMPLEADO (CONSOLIDADA: incluye columna Tipo Contrato y columna Observaciones) */
const buildConsolidatedEmployeeTableRow = (
  employee,
  index,
  theme,
  incidentsMap,
  advancesMap
) => {
  const observationsText = buildEmployeeObservations(
    employee.employeeId,
    incidentsMap,
    advancesMap
  );

  return [
    {
      content: String(index),
      styles: { halign: "center" },
    },
    {
      content: getEmployeeFullName(employee).toUpperCase(),
      styles: { halign: "left" },
    },
    {
      content: (employee.contractJobTitleName || employee.jobTitleName || "-").toUpperCase(),
      styles: { halign: "left" },
    },
    {
      content: formatDatePdf(employee.hireDate),
      styles: { halign: "center" },
    },
    {
      content: (employee.employeeType || "Fiscal").toUpperCase(),
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
      content: observationsText,
      styles: {
        halign: "left",
        fontSize: 5.2,
        textColor: observationsText === "-" ? [148, 163, 184] : [51, 65, 85],
      },
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
      content: formatNetSalaryPdf(employee.netSalary),
      styles: {
        halign: "right",
        fontStyle: "bold",
        textColor: theme.primaryDark,
      },
    },
  ];
};

/** FILAS DE TOTALES (CONSOLIDADA: colSpan 5 en etiqueta inicial para cubrir N°, Nombre, Cargo, Ingreso, Tipo Contrato) */
const buildConsolidatedTotalsRow = (
  totals,
  theme,
  label = "TOTAL GENERAL",
  level = "general"
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

  return [
    {
      content: label,
      colSpan: 5,
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
    {
      content: "",
      styles: { fillColor: rowFillColor },
    },
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
    },
  ];
};

const buildConsolidatedTableBody = (
  payrolls,
  theme,
  consolidatedCompanyName,
  incidentsMap,
  advancesMap
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

    // Header del Grupo Principal (Empresa Fiscal) - 17 columnas en total
    rows.push([
      {
        content: `  EMPRESA FISCAL: ${fiscalKey}`,
        colSpan: 17,
        styles: {
          halign: "left",
          fontStyle: "bold",
          fillColor: theme.subheaderBg,
          textColor: theme.white,
          fontSize: 7.2,
          cellPadding: { top: 2.2, bottom: 2.2, left: 3 },
        },
      },
    ]);

    // 2. Clasificar empleados en Categorías Centrales y Sucursales
    const centralEmployees = [];
    const branchEmployeesMap = {};

    fiscalPayrolls.forEach((p) => {
      const category = findJobCategory(p.contractJobTitleName);
      if (category) {
        centralEmployees.push({ payroll: p, category });
      } else {
        const branchKey = (p.branchName || "SIN SUCURSAL").trim();
        if (!branchEmployeesMap[branchKey]) {
          branchEmployeesMap[branchKey] = [];
        }
        branchEmployeesMap[branchKey].push(p);
      }
    });

    const divisionSections = [];

    // Secciones centrales (Directorio, Gerencia General, Administración)
    CONSOLIDATED_JOB_CATEGORIES.forEach((cat) => {
      const emps = centralEmployees
        .filter((item) => item.category.key === cat.key)
        .map((item) => item.payroll);
      if (emps.length > 0) {
        divisionSections.push({
          title: cat.title || cat.name || "",
          payrolls: sortEmployeesByName(emps),
        });
      }
    });

    // Secciones de Sucursales
    const sortedBranchKeys = Object.keys(branchEmployeesMap).sort((a, b) =>
      a.localeCompare(b, "es", { sensitivity: "base" })
    );

    sortedBranchKeys.forEach((branchName) => {
      const emps = branchEmployeesMap[branchName];
      divisionSections.push({
        title: formatBranchTitle(branchName),
        payrolls: sortEmployeesByName(emps),
      });
    });

    // Construir filas por cada división
    divisionSections.forEach((division) => {
      rows.push([
        {
          content: `    ${division.title.toUpperCase()}`,
          colSpan: 17,
          styles: {
            halign: "left",
            fontStyle: "bold",
            fillColor: theme.branchBg,
            textColor: theme.branchText,
            fontSize: 6.6,
            cellPadding: { top: 1.8, bottom: 1.8, left: 4 },
          },
        },
      ]);

      division.payrolls.forEach((emp) => {
        rows.push(
          buildConsolidatedEmployeeTableRow(
            emp,
            index++,
            theme,
            incidentsMap,
            advancesMap
          )
        );
      });

      const divisionTotals = calculatePayrollTotals(division.payrolls);
      rows.push(
        buildConsolidatedTotalsRow(
          divisionTotals,
          theme,
          `TOTAL ${division.title.toUpperCase()}`,
          "division"
        )
      );
    });

    // Subtotal de la Empresa Fiscal
    const fiscalTotals = calculatePayrollTotals(fiscalPayrolls);
    rows.push(
      buildConsolidatedTotalsRow(
        fiscalTotals,
        theme,
        `TOTAL EMPRESA FISCAL: ${fiscalKey}`,
        "fiscal"
      )
    );
  });

  return rows;
};

const buildConsolidatedTableHeader = (theme) => {
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
      content: "TIPO\nCONTRATO",
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
      content: "OBSERVACIONES\n(FALTAS / PERMISOS / ANTICIPOS)",
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
  ];

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
  const updateBoxWidth = 55;
  const updateBoxX = pageWidth - 10 - updateBoxWidth;
  drawUpdateMetadataBox(doc, updateBoxX, 7.5, updateBoxWidth, 15.5, theme, timestamp);
};

export const exportConsolidatedPayrollPdf = async ({
  payrolls = [],
  company = null,
  periodMonth = new Date().getMonth() + 1,
  periodYear = new Date().getFullYear(),
  totals = null,
  incidents = [],
  advances = [],
}) => {
  const companyName = company?.name || "";
  const companyTaxId = company?.taxId || "";
  const theme = getPayrollTheme(companyName);
  const monthName = MONTH_NAMES[periodMonth] || "";
  const subtitle = `CORRESPONDIENTE AL MES DE ${monthName.toUpperCase()} ${periodYear}`;
  const timestamp = getFormattedUpdateTimestamp();

  // Mapear incidencias y anticipos por employeeId para acceso O(1)
  const incidentsMap = {};
  if (Array.isArray(incidents)) {
    incidents.forEach((inc) => {
      const empId = inc.employeeId;
      if (!incidentsMap[empId]) incidentsMap[empId] = [];
      incidentsMap[empId].push(inc);
    });
  }

  const advancesMap = {};
  if (Array.isArray(advances)) {
    advances.forEach((adv) => {
      const empId = adv.employeeId;
      if (!advancesMap[empId]) advancesMap[empId] = [];
      advancesMap[empId].push(adv);
    });
  }

  const doc = new jsPDF({
    orientation: "landscape",
    unit: "mm",
    format: "legal",
  });

  const autoTableConfig = {
    theme: "grid",
    headStyles: {
      fillColor: theme.primary,
      textColor: theme.white,
      fontStyle: "bold",
      fontSize: 6.5,
      overflow: "linebreak",
      cellPadding: {
        top: 1.8,
        bottom: 1.8,
        left: 1.0,
        right: 1.0,
      },
      lineWidth: 0.15,
      lineColor: theme.white,
    },

    bodyStyles: {
      fontSize: 6.3,
      textColor: theme.text,
      overflow: "linebreak",
      cellPadding: {
        top: 1.6,
        bottom: 1.6,
        left: 1.0,
        right: 1.0,
      },
      lineWidth: 0.1,
      lineColor: theme.border,
    },

    alternateRowStyles: {
      fillColor: [253, 254, 255],
    },

    // 17 columnas con ancho total = 335.6mm (márgenes exactos de 10mm en Legal apaisada de 355.6mm)
    // Alineado exactamente con el margen derecho del recuadro de actualización (X = 345.6mm)
    columnStyles: {
      0: { cellWidth: 7, halign: "center" },      // N°
      1: { cellWidth: 42.5, halign: "left" },     // APELLIDOS Y NOMBRES
      2: { cellWidth: 30, halign: "left" },       // CARGO
      3: { cellWidth: 16, halign: "center" },     // FECHA DE INGRESO
      4: { cellWidth: 16, halign: "center" },     // TIPO CONTRATO
      5: { cellWidth: 16, halign: "right" },      // HABER BÁSICO
      6: { cellWidth: 10, halign: "center" },     // DÍAS TRAB.
      7: { cellWidth: 16, halign: "right" },      // SUELDO BÁSICO
      8: { cellWidth: 24, halign: "right" },      // ANTIGÜEDAD (espacio amplio sin cortar palabra)
      9: { cellWidth: 19, halign: "right" },      // OTROS BONOS
      10: { cellWidth: 18, halign: "right", fontStyle: "bold" }, // TOTAL GANADO
      11: { cellWidth: 39, halign: "left" },      // OBSERVACIONES (FALTAS / PERMISOS / ANTICIPOS)
      12: { cellWidth: 16, halign: "right" },     // GESTORA (AFP)
      13: { cellWidth: 15, halign: "right" },     // PERM. / FALTAS
      14: { cellWidth: 15, halign: "right" },     // ANTICIPOS
      15: { cellWidth: 16, halign: "right" },     // TOTAL DESC.
      16: { cellWidth: 20.1, halign: "right", fontStyle: "bold" }, // LÍQUIDO PAGABLE
    },

    didParseCell: (data) => {
      // Columna 16 es Líquido Pagable
      if (data.section === "head" && data.column.index === 16) {
        data.cell.styles.fillColor = theme.primaryDark;
      }
    },
  };

  await drawHeader(
    doc,
    companyName,
    companyTaxId,
    theme,
    "PLANILLA CONSOLIDADA DE SUELDOS",
    subtitle,
    timestamp
  );

  const body = buildConsolidatedTableBody(
    payrolls,
    theme,
    companyName,
    incidentsMap,
    advancesMap
  );
  const overallTotals = totals || calculatePayrollTotals(payrolls);
  body.push(buildConsolidatedTotalsRow(overallTotals, theme, "TOTAL GENERAL", "general"));

  autoTable(doc, {
    startY: 26,
    margin: { top: 26, bottom: 12, left: 10, right: 10 },
    head: buildConsolidatedTableHeader(theme),
    body,
    ...autoTableConfig,
  });

  // ==========================================
  // RESUMEN POR TIPO DE CONTRATO Y FIRMA
  // ==========================================
  const pageHeight = doc.internal.pageSize.getHeight();
  const pageWidth = doc.internal.pageSize.getWidth();
  const bottomMarginLimit = pageHeight - 18; // Dejar espacio para el footer
  const summaryBoxHeight = 36; // Altura aproximada requerida para el bloque de resumen y firma

  // Si no hay suficiente espacio en la página actual tras la tabla, agregar nueva página
  if (doc.lastAutoTable.finalY + summaryBoxHeight + 6 > bottomMarginLimit) {
    doc.addPage();
    await drawHeader(
      doc,
      companyName,
      companyTaxId,
      theme,
      "PLANILLA CONSOLIDADA DE SUELDOS",
      subtitle,
      timestamp
    );
    doc.lastAutoTable = { finalY: 28 };
  }

  const summaryStartY = (doc.lastAutoTable?.finalY || 28) + 5;

  // Calcular totales de líquido pagable por tipo de trabajador
  const netByContractType = {
    CONSULTOR: 0,
    PROMOTOR: 0,
    FISCAL: 0,
  };

  payrolls.forEach((p) => {
    const rawType = (p.employeeType || "Fiscal").trim().toUpperCase();
    const net = Number(p.netSalary || 0);
    if (rawType.includes("CONSULT")) {
      netByContractType.CONSULTOR += net;
    } else if (rawType.includes("PROMOT")) {
      netByContractType.PROMOTOR += net;
    } else {
      netByContractType.FISCAL += net;
    }
  });

  const totalNet =
    netByContractType.CONSULTOR +
    netByContractType.PROMOTOR +
    netByContractType.FISCAL;

  // Tabla / Recuadro de Resumen de Líquido Pagable (a la derecha)
  const summaryWidth = 92;
  const summaryX = pageWidth - 10 - summaryWidth;

  autoTable(doc, {
    startY: summaryStartY,
    margin: { left: summaryX },
    tableWidth: summaryWidth,
    theme: "plain",
    head: [
      [
        {
          content: "RESUMEN DE LÍQUIDO PAGABLE",
          colSpan: 2,
          styles: {
            fontStyle: "bold",
            textColor: theme.primaryDark,
            fontSize: 7.2,
            fillColor: theme.liquidHighlightBg,
            cellPadding: { top: 2.2, bottom: 2.2, left: 3, right: 3 },
          },
        },
      ],
    ],
    body: [
      [
        { content: "FISCAL", styles: { halign: "left", fontSize: 6.8, fontStyle: "bold", textColor: theme.text } },
        { content: formatNetSalaryPdf(netByContractType.FISCAL), styles: { halign: "right", fontSize: 6.8, textColor: theme.text } },
      ],
      [
        { content: "CONSULTOR", styles: { halign: "left", fontSize: 6.8, fontStyle: "bold", textColor: theme.text } },
        { content: formatNetSalaryPdf(netByContractType.CONSULTOR), styles: { halign: "right", fontSize: 6.8, textColor: theme.text } },
      ],
      [
        { content: "PROMOTOR", styles: { halign: "left", fontSize: 6.8, fontStyle: "bold", textColor: theme.text } },
        { content: formatNetSalaryPdf(netByContractType.PROMOTOR), styles: { halign: "right", fontSize: 6.8, textColor: theme.text } },
      ],
      [
        {
          content: "TOTAL LÍQUIDO PAGABLE",
          styles: {
            halign: "left",
            fontSize: 7.2,
            fontStyle: "bold",
            textColor: theme.primaryDark,
            fillColor: theme.liquidHighlightBg,
            cellPadding: { top: 2.4, bottom: 2.4, left: 3, right: 3 },
          },
        },
        {
          content: formatNetSalaryPdf(totalNet),
          styles: {
            halign: "right",
            fontSize: 7.5,
            fontStyle: "bold",
            textColor: theme.primaryDark,
            fillColor: theme.liquidHighlightBg,
            cellPadding: { top: 2.4, bottom: 2.4, left: 3, right: 3 },
          },
        },
      ],
    ],
    styles: {
      lineWidth: 0.15,
      lineColor: theme.borderSoft,
      cellPadding: { top: 1.8, bottom: 1.8, left: 3, right: 3 },
    },
    tableLineColor: theme.borderSoft,
    tableLineWidth: 0.25,
  });

  // Firma del Gerente General (a la izquierda)
  const summaryFinalY = doc.lastAutoTable.finalY;
  const signatureY = summaryStartY + (summaryFinalY - summaryStartY) / 2 + 3;
  const signatureWidth = 75;
  const signatureX = 35; // Centrado hacia el tercio izquierdo

  doc.setDrawColor(...theme.primaryDark);
  doc.setLineWidth(0.25);
  doc.line(signatureX, signatureY, signatureX + signatureWidth, signatureY);

  doc.setFont("helvetica", "bold");
  doc.setFontSize(8);
  doc.setTextColor(...theme.primaryDark);
  doc.text(
    "RAMIRO LIMA HUARACHI",
    signatureX + signatureWidth / 2,
    signatureY + 4.5,
    { align: "center" }
  );

  doc.setFont("helvetica", "italic");
  doc.setFontSize(7.2);
  doc.setTextColor(...theme.text);
  doc.text(
    "Gerente General",
    signatureX + signatureWidth / 2,
    signatureY + 8.2,
    { align: "center" }
  );

  // Footer en todas las páginas
  const totalPages = doc.internal.getNumberOfPages();
  const footerLineY = pageHeight - 14.5;
  const footerTextY = pageHeight - 10.8;
  const contentRight = pageWidth - 10;

  for (let page = 1; page <= totalPages; page++) {
    doc.setPage(page);
    doc.setDrawColor(...theme.border);
    doc.setLineWidth(0.25);
    doc.line(10, footerLineY, contentRight, footerLineY);
    doc.setFont("helvetica", "normal");
    doc.setFontSize(6.5);
    doc.setTextColor(...theme.mutedText);
    doc.text(
      `${companyName} • Planilla Consolidada • ${monthName} ${periodYear}`,
      10,
      footerTextY
    );
    doc.text(`Página ${page} de ${totalPages}`, contentRight, footerTextY, {
      align: "right",
    });
  }

  // Nombre del archivo
  const sanitizedCompanyName = (companyName || "empresa")
    .replace(/[^a-zA-Z0-9]/g, "_")
    .toLowerCase();

  const fileName =
    `${sanitizedCompanyName}_consolidado_${periodYear}_${String(
      periodMonth
    ).padStart(2, "0")}.pdf`;

  doc.save(fileName);
};