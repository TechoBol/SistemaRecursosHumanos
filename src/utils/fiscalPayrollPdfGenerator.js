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

  const iconX = x + 3.0;
  const iconY = y + 2.0;

  doc.setDrawColor(...theme.primary);
  doc.setLineWidth(0.45);
  doc.roundedRect(iconX, iconY, 4.4, 4.5, 0.5, 0.5, "D");

  doc.setFillColor(...theme.primary);
  doc.rect(iconX, iconY, 4.4, 1.4, "F");

  doc.setFillColor(...theme.white);
  doc.circle(iconX + 1.2, iconY + 0.7, 0.3, "F");
  doc.circle(iconX + 3.2, iconY + 0.7, 0.3, "F");

  const textX = x + 9.5;
  const lineY = y + 5.2;

  doc.setFont("helvetica", "bold");
  doc.setFontSize(6.0);
  doc.setTextColor(...theme.mutedText);
  doc.text("Generado:", textX, lineY);

  const genLabelWidth = doc.getTextWidth("Generado:");

  doc.setFont("helvetica", "normal");
  doc.setFontSize(6.2);
  doc.setTextColor(...theme.text);
  doc.text(`${timestamp.dateLine}   ${timestamp.timeLine}`, textX + genLabelWidth + 2.0, lineY);
};

/**
 * Dibuja los datos de contacto de la empresa (Dirección, Correo, Teléfono)
 * debajo del recuadro de fecha de generación.
 */
const drawCompanyContactInfo = (doc, x, y, width, theme, company) => {
  const address = company?.address || "Av. América Nº 1485, Zona Cala Cala";
  const email = company?.email || "contacto@techo-bol.com.bo";

  let phonesText = "";
  if (Array.isArray(company?.phones) && company.phones.length > 0) {
    phonesText = company.phones.map((p) => p.phone).filter(Boolean).join(" - ");
  }
  if (!phonesText) {
    phonesText = company?.phone || "(4) 425 8725";
  }

  const items = [
    { label: "Dirección:", val: address, type: "pin" },
    { label: "Correo:", val: email, type: "mail" },
    { label: "Teléfono:", val: phonesText, type: "phone" },
  ];

  let currentY = y;
  items.forEach((item) => {
    const iconX = x + 0.5;
    const iconCenterY = currentY - 0.9;

    doc.setFillColor(...theme.primary);
    doc.setDrawColor(...theme.primary);

    if (item.type === "pin") {
      // Pin icon
      doc.circle(iconX + 1.2, iconCenterY - 0.7, 1.0, "F");
      doc.triangle(
        iconX + 0.3,
        iconCenterY - 0.5,
        iconX + 2.1,
        iconCenterY - 0.5,
        iconX + 1.2,
        iconCenterY + 1.2,
        "F"
      );
      doc.setFillColor(...theme.white);
      doc.circle(iconX + 1.2, iconCenterY - 0.7, 0.4, "F");
    } else if (item.type === "mail") {
      // Mail icon
      doc.setLineWidth(0.35);
      doc.roundedRect(iconX, iconCenterY - 1.2, 2.6, 2.0, 0.3, 0.3, "D");
      doc.line(iconX, iconCenterY - 1.2, iconX + 1.3, iconCenterY - 0.2);
      doc.line(iconX + 2.6, iconCenterY - 1.2, iconX + 1.3, iconCenterY - 0.2);
    } else if (item.type === "phone") {
      // Phone icon
      doc.setLineWidth(0.4);
      doc.roundedRect(iconX + 0.4, iconCenterY - 1.3, 1.8, 2.4, 0.4, 0.4, "D");
      doc.line(iconX + 0.8, iconCenterY + 0.6, iconX + 1.8, iconCenterY + 0.6);
    }

    const textX = x + 4;
    doc.setFont("helvetica", "bold");
    doc.setFontSize(6.0);
    doc.setTextColor(...theme.primaryDark);
    doc.text(item.label, textX, currentY);

    const labelWidth = doc.getTextWidth(item.label);
    doc.setFont("helvetica", "normal");
    doc.setFontSize(6.0);
    doc.setTextColor(...theme.text);

    const availableValWidth = width - 4 - labelWidth - 1;
    const trimmedVal = doc.splitTextToSize(item.val, availableValWidth)[0] || item.val;
    doc.text(trimmedVal, textX + labelWidth + 1.2, currentY);

    currentY += 4.2;
  });
};

/**
 * Dibuja el recuadro central con:
 * - Nº Identificador Empleador ante el Ministerio de Trabajo (ROE)
 * - Nº de Empleador (Caja de Salud)
 */
const drawEmployerRegistrationBox = (
  doc,
  x,
  y,
  width,
  height,
  theme,
  roeNumber,
  healthInsuranceNumber
) => {
  // Contenedor principal con fondo muy suave y borde redondeado
  doc.setFillColor(252, 254, 255);
  doc.setDrawColor(...theme.borderSoft);
  doc.setLineWidth(0.25);
  doc.roundedRect(x, y, width, height, 2.0, 2.0, "FD");

  // --- DIVISIÓN INTERNA EN 2 SECCIONES ---
  const contentLeft = x + 5;
  const contentWidth = width - 10;
  const halfW = contentWidth / 2;

  // Línea divisoria central
  const dividerX = contentLeft + halfW;
  doc.setDrawColor(...theme.borderSoft);
  doc.setLineWidth(0.2);
  doc.line(dividerX, y + 2.2, dividerX, y + height - 2.2);

  // SECCIÓN 1: MINISTERIO DE TRABAJO
  const sec1TextX = contentLeft;
  doc.setFont("helvetica", "bold");
  doc.setFontSize(5.8);
  doc.setTextColor(...theme.primaryDark);
  doc.text("Nº IDENTIFICADOR EMPLEADOR ANTE EL", sec1TextX, y + 4.2);
  doc.text("MINISTERIO DE TRABAJO:", sec1TextX, y + 7.8);

  // Chip para el valor ROE
  const badge1W = 27;
  const badge1H = 6.0;
  const badge1X = dividerX - badge1W - 3.5;
  const badge1Y = y + (height - badge1H) / 2;

  doc.setFillColor(...theme.liquidHighlightBg);
  doc.setDrawColor(...theme.borderSoft);
  doc.setLineWidth(0.2);
  doc.roundedRect(badge1X, badge1Y, badge1W, badge1H, 1.2, 1.2, "FD");

  doc.setFont("helvetica", "bold");
  doc.setFontSize(7.2);
  doc.setTextColor(...theme.primaryDark);
  doc.text(
    roeNumber || "-",
    badge1X + badge1W / 2,
    badge1Y + 4.1,
    { align: "center" }
  );

  // SECCIÓN 2: CAJA DE SALUD
  const sec2TextX = dividerX + 4;
  doc.setFont("helvetica", "bold");
  doc.setFontSize(5.8);
  doc.setTextColor(...theme.primaryDark);
  doc.text("Nº DE EMPLEADOR", sec2TextX, y + 4.2);
  doc.text("(CAJA DE SALUD):", sec2TextX, y + 7.8);

  // Chip para el valor Caja de Salud
  const badge2W = 27;
  const badge2H = 6.0;
  const badge2X = x + width - badge2W - 4.5;
  const badge2Y = y + (height - badge2H) / 2;

  doc.setFillColor(...theme.liquidHighlightBg);
  doc.setDrawColor(...theme.borderSoft);
  doc.setLineWidth(0.2);
  doc.roundedRect(badge2X, badge2Y, badge2W, badge2H, 1.2, 1.2, "FD");

  doc.setFont("helvetica", "bold");
  doc.setFontSize(7.2);
  doc.setTextColor(...theme.primaryDark);
  doc.text(
    healthInsuranceNumber || "-",
    badge2X + badge2W / 2,
    badge2Y + 4.1,
    { align: "center" }
  );
};

const sortEmployeesByName = (employees = []) =>
  [...employees].sort((a, b) =>
    getEmployeeFullName(a).localeCompare(getEmployeeFullName(b), "es", {
      sensitivity: "base",
    })
  );

/** FILA DE EMPLEADO (FISCAL) */
const buildFiscalEmployeeTableRow = (employee, index, theme) => {
  const cns = Number(employee.grossPay || 0) * 0.1;
  const ciFull = employee.employeeDocumentNumber
    ? `${employee.employeeDocumentNumber}${employee.employeeCiExtension ? ` ${employee.employeeCiExtension}` : ""}`
    : "-";
  const nationality = (employee.employeeNationality || "BOLIVIANA").toUpperCase();
  const birthDate = employee.employeeBirthDate ? formatDatePdf(employee.employeeBirthDate) : "-";
  const gender = employee.employeeGender
    ? (employee.employeeGender.toUpperCase().startsWith("F") ? "F" : "M")
    : "-";

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
      content: ciFull,
      styles: { halign: "center" },
    },
    {
      content: nationality,
      styles: { halign: "center" },
    },
    {
      content: birthDate,
      styles: { halign: "center" },
    },
    {
      content: gender,
      styles: { halign: "center" },
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
    {
      content: formatMoneyPdf(cns),
      styles: { halign: "right" },
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
    {
      content: "",
      styles: { halign: "center" },
    },
  ];
};

/** FILAS DE TOTALES (FISCAL: colSpan 8) */
const buildFiscalTotalsRow = (
  totals,
  theme,
  label = "TOTAL GENERAL"
) => {
  const baseStyle = {
    halign: "right",
    fontStyle: "bold",
    fillColor: theme.totalsBg,
    fontSize: 6.8,
  };

  const netSalaryStyle = {
    ...baseStyle,
    fillColor: theme.liquidHighlightBg,
    textColor: theme.liquidHighlightText,
    fontSize: 7.2,
  };

  const cnsTotal = Number(totals.grossPay || 0) * 0.1;

  return [
    {
      content: label,
      colSpan: 8,
      styles: { ...baseStyle, textColor: theme.primaryDark },
    },
    {
      content: formatMoneyPdf(totals.baseSalary),
      styles: baseStyle,
    },
    {
      content: "",
      styles: { fillColor: theme.totalsBg },
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
      content: formatMoneyPdf(cnsTotal),
      styles: baseStyle,
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
    {
      content: "",
      styles: { fillColor: theme.totalsBg },
    },
  ];
};

const buildFiscalTableHeader = (theme) => {
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
      content: "CI",
      rowSpan: 2,
      styles: { halign: "center", valign: "middle" },
    },
    {
      content: "NAC.",
      rowSpan: 2,
      styles: { halign: "center", valign: "middle" },
    },
    {
      content: "FECHA DE\nNACIMIENTO",
      rowSpan: 2,
      styles: { halign: "center", valign: "middle" },
    },
    {
      content: "SEXO\nF/M",
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
      content: "DÍAS\nTRAB",
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
      content: "APORTE\nCNS 10%",
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
    {
      content: "FIRMA",
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
  company,
  theme,
  titleText,
  subtitle,
  timestamp,
  cityName
) => {
  const companyName = company?.name || "";
  const companyLegalName = company?.legalName || companyName;
  const companyTaxId = company?.taxId || "";
  const pageWidth = doc.internal.pageSize.getWidth();
  const centerX = pageWidth / 2;

  // Logo real de la empresa
  await drawCompanyLogo(doc, companyName);

  // Datos de la empresa (lado izquierdo)
  const companyTextX = 25;

  doc.setFont("helvetica", "bold");
  doc.setFontSize(11);
  doc.setTextColor(15, 23, 42);
  doc.text(companyLegalName, companyTextX, 11.5);
  doc.setFont("helvetica", "normal");
  doc.setFontSize(7.2);
  doc.setTextColor(...theme.mutedText);

  if (companyTaxId) {
    doc.text(`NIT ${companyTaxId}`, companyTextX, 15.2);
  }

  doc.text(COMPANY_LOCATION, companyTextX, 18.8);

  // Título principal (centrado entre el bloque de la empresa y los datos de contacto)
  const titleCenterX = 172;
  doc.setFont("helvetica", "bold");
  doc.setFontSize(12.5);
  doc.setTextColor(...theme.primary);
  doc.text(titleText, titleCenterX, 10.5, { align: "center" });

  doc.setFontSize(7.2);
  doc.setTextColor(...theme.mutedText);
  doc.text(subtitle, titleCenterX, 14.5, { align: "center" });

  // Buscar Nº de Empleador (Caja de Salud) para esta ciudad
  let healthInsuranceNumber = "";
  if (Array.isArray(company?.healthInsurances) && company.healthInsurances.length > 0) {
    const match = company.healthInsurances.find(
      (hi) =>
        hi.city?.name?.trim().toLowerCase() === cityName?.trim().toLowerCase()
    );
    if (match) {
      healthInsuranceNumber = match.employerNumber;
    }
  }

  const roeNumber = company?.roeNumber || "";

  // Recuadro central: Ministerio de Trabajo y Caja de Salud (sin ícono de maletín)
  const regBoxX = 82;
  const regBoxY = 16.5;
  const regBoxW = 180;
  const regBoxH = 10.5;
  drawEmployerRegistrationBox(
    doc,
    regBoxX,
    regBoxY,
    regBoxW,
    regBoxH,
    theme,
    roeNumber,
    healthInsuranceNumber
  );

  // Lado derecho: Recuadro compacto de Generado (fecha y hora al lado)
  const updateBoxWidth = 72;
  const updateBoxX = pageWidth - 10 - updateBoxWidth;
  drawUpdateMetadataBox(doc, updateBoxX, 6.0, updateBoxWidth, 8.2, theme, timestamp);

  // Datos de contacto (Dirección, Correo, Teléfono) con mayor separación vertical del recuadro
  drawCompanyContactInfo(
    doc,
    updateBoxX,
    18.5,
    updateBoxWidth,
    theme,
    company
  );
};

export const exportFiscalPayrollPdf = async ({
  payrolls = [],
  company = null,
  periodMonth = new Date().getMonth() + 1,
  periodYear = new Date().getFullYear(),
  totals = null,
}) => {
  const companyName = company?.name || "";
  const companyTaxId = company?.taxId || "";
  const theme = getPayrollTheme(companyName);
  const monthName = MONTH_NAMES[periodMonth] || "";
  const subtitle = `CORRESPONDIENTE AL MES DE ${monthName.toUpperCase()} ${periodYear}`;
  const timestamp = getFormattedUpdateTimestamp();

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
      fontSize: 6.8,
      overflow: "linebreak",
      cellPadding: {
        top: 2,
        bottom: 2,
        left: 1.5,
        right: 1.5,
      },
      lineWidth: 0.15,
      lineColor: theme.white,
    },

    bodyStyles: {
      fontSize: 6.8,
      textColor: theme.text,
      overflow: "linebreak",
      cellPadding: {
        top: 1.8,
        bottom: 1.8,
        left: 1.5,
        right: 1.5,
      },
      lineWidth: 0.1,
      lineColor: theme.border,
    },

    alternateRowStyles: {
      fillColor: [253, 254, 255],
    },

    // 21 columnas con ancho total = 335.6mm (márgenes exactos de 10mm en Legal apaisada de 355.6mm)
    // Alineado exactamente con el margen derecho del recuadro de actualización (X = 345.6mm)
    columnStyles: {
      0: { cellWidth: 7.5, halign: "center" },    // N°
      1: { cellWidth: 35.5, halign: "left" },     // APELLIDOS Y NOMBRES
      2: { cellWidth: 16.5, halign: "center" },   // CI
      3: { cellWidth: 15.5, halign: "center" },   // NACIONALIDAD
      4: { cellWidth: 18.0, halign: "center" },   // FECHA DE NACIMIENTO
      5: { cellWidth: 10.5, halign: "center" },   // SEXO F/M
      6: { cellWidth: 24.0, halign: "left" },     // CARGO
      7: { cellWidth: 14.5, halign: "center" },   // FECHA DE INGRESO
      8: { cellWidth: 15.0, halign: "right" },    // HABER BÁSICO
      9: { cellWidth: 9.5, halign: "center" },    // DÍAS TRAB
      10: { cellWidth: 14.5, halign: "right" },   // SUELDO BÁSICO
      11: { cellWidth: 19.5, halign: "right" },   // ANTIGÜEDAD
      12: { cellWidth: 15.0, halign: "right" },   // OTROS BONOS
      13: { cellWidth: 16.5, halign: "right", fontStyle: "bold" }, // TOTAL GANADO
      14: { cellWidth: 14.5, halign: "right" },   // CNS 10%
      15: { cellWidth: 15.0, halign: "right" },   // GESTORA
      16: { cellWidth: 13.5, halign: "right" },   // PERM. / FALTAS
      17: { cellWidth: 16.5, halign: "right" },   // ANTICIPOS
      18: { cellWidth: 14.5, halign: "right" },   // TOTAL DESC.
      19: { cellWidth: 17.5, halign: "right", fontStyle: "bold" }, // LÍQUIDO PAGABLE
      20: { cellWidth: 17.6, halign: "center" },  // FIRMA
    },

    didParseCell: (data) => {
      // Líquido pagable
      if (data.section === "head" && data.column.index === 19) {
        data.cell.styles.fillColor = theme.primaryDark;
      }
    },
  };

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

    await drawHeader(
      doc,
      company,
      theme,
      cityTitle,
      subtitle,
      timestamp,
      cityName
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
      buildFiscalEmployeeTableRow(employee, idx + 1, theme)
    );

    body.push(buildFiscalTotalsRow(cityTotals, theme, "TOTAL GENERAL"));

    autoTable(doc, {
      startY: 32,
      margin: { top: 32, bottom: 12, left: 10, right: 10 },
      head: buildFiscalTableHeader(theme),
      body,
      ...autoTableConfig,
    });
  }

  // Footer en todas las páginas
  const totalPages = doc.internal.getNumberOfPages();
  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
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
      `${companyName} • Planilla Fiscal • ${monthName} ${periodYear}`,
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

  const fileName = `${sanitizedCompanyName}_fiscal_${periodYear}_${String(
    periodMonth
  ).padStart(2, "0")}.pdf`;

  doc.save(fileName);
};