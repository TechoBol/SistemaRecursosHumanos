import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import techobolLogo from "../assets/logotechobol.png";
import megadisLogo from "../assets/logomegadis.png";
import rhinoconsLogo from "../assets/logorhinocons.jpeg";
import {
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
    return `${employee.employeeLastNames} ${employee.employeeFirstNames || ""}`.trim();
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
      doc.setLineWidth(0.35);
      doc.roundedRect(iconX, iconCenterY - 1.2, 2.6, 2.0, 0.3, 0.3, "D");
      doc.line(iconX, iconCenterY - 1.2, iconX + 1.3, iconCenterY - 0.2);
      doc.line(iconX + 2.6, iconCenterY - 1.2, iconX + 1.3, iconCenterY - 0.2);
    } else if (item.type === "phone") {
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
  doc.setFillColor(252, 254, 255);
  doc.setDrawColor(...theme.borderSoft);
  doc.setLineWidth(0.25);
  doc.roundedRect(x, y, width, height, 2.0, 2.0, "FD");

  const contentLeft = x + 5;
  const contentWidth = width - 10;
  const halfW = contentWidth / 2;

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

/** FILA DE EMPLEADO (AGUINALDOS) */
const buildChristmasBonusTableRow = (employee, index, theme) => {
  const ciFull = employee.employeeDocumentNumber
    ? `${employee.employeeDocumentNumber}${employee.employeeCiExtension ? ` ${employee.employeeCiExtension}` : ""}`
    : "-";
  const nationality = (employee.employeeNationality || "BOLIVIANA").toUpperCase();
  const birthDate = employee.employeeBirthDate ? formatDatePdf(employee.employeeBirthDate) : "-";
  const gender = employee.employeeGender
    ? (employee.employeeGender.toUpperCase().startsWith("F") ? "F" : "M")
    : "-";

  const workedMonths = employee.workedMonths ?? 0;
  const workedDays = employee.workedDays ?? 0;
  const workedPeriodText = `${workedMonths} m y ${workedDays} d`;

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
      content: formatMoneyPdf(employee.averageBaseSalary),
      styles: { halign: "right" },
    },
    {
      content: formatMoneyPdf(employee.averageSeniorityBonus),
      styles: { halign: "right" },
    },
    {
      content: formatMoneyPdf(employee.averageOtherBonuses),
      styles: { halign: "right" },
    },
    {
      content: formatMoneyPdf(employee.averageGrossPay),
      styles: { halign: "right", fontStyle: "bold" },
    },
    {
      content: workedPeriodText,
      styles: { halign: "center" },
    },
    {
      content: formatNetSalaryPdf(employee.christmasBonusAmount),
      styles: {
        halign: "right",
        fontStyle: "bold",
        textColor: theme.primaryDark,
      },
    },
  ];
};

/** FILAS DE TOTALES (AGUINALDOS: colSpan 8) */
const buildChristmasBonusTotalsRow = (
  totals,
  theme,
  label = "TOTAL GENERAL"
) => {
  const baseStyle = {
    halign: "right",
    fontStyle: "bold",
    fillColor: theme.totalsBg,
    fontSize: 7.0,
  };

  const netSalaryStyle = {
    ...baseStyle,
    fillColor: theme.liquidHighlightBg,
    textColor: theme.liquidHighlightText,
    fontSize: 7.4,
  };

  return [
    {
      content: label,
      colSpan: 8,
      styles: { ...baseStyle, textColor: theme.primaryDark },
    },
    {
      content: formatMoneyPdf(totals.averageBaseSalary),
      styles: baseStyle,
    },
    {
      content: formatMoneyPdf(totals.averageSeniorityBonus),
      styles: baseStyle,
    },
    {
      content: formatMoneyPdf(totals.averageOtherBonuses),
      styles: baseStyle,
    },
    {
      content: formatMoneyPdf(totals.averageGrossPay),
      styles: { ...baseStyle, textColor: theme.primaryDark },
    },
    {
      content: "",
      styles: { fillColor: theme.totalsBg },
    },
    {
      content: formatNetSalaryPdf(totals.christmasBonusAmount),
      styles: netSalaryStyle,
    },
  ];
};

const buildChristmasBonusTableHeader = () => {
  return [
    [
      {
        content: "N°",
        styles: { halign: "center", valign: "middle" },
      },
      {
        content: "APELLIDOS Y NOMBRES",
        styles: { halign: "center", valign: "middle" },
      },
      {
        content: "CI",
        styles: { halign: "center", valign: "middle" },
      },
      {
        content: "NACIONALIDAD",
        styles: { halign: "center", valign: "middle" },
      },
      {
        content: "FECHA DE\nNACIMIENTO",
        styles: { halign: "center", valign: "middle" },
      },
      {
        content: "SEXO\nF/M",
        styles: { halign: "center", valign: "middle" },
      },
      {
        content: "CARGO",
        styles: { halign: "center", valign: "middle" },
      },
      {
        content: "FECHA\nDE INGRESO",
        styles: { halign: "center", valign: "middle" },
      },
      {
        content: "PROM. HABER\nBÁSICO",
        styles: { halign: "center", valign: "middle" },
      },
      {
        content: "PROM. BONO\nANTIGÜEDAD",
        styles: { halign: "center", valign: "middle" },
      },
      {
        content: "PROM. OTROS\nBONOS",
        styles: { halign: "center", valign: "middle" },
      },
      {
        content: "PROM. TOTAL\nGANADO",
        styles: { halign: "center", valign: "middle" },
      },
      {
        content: "MESES Y DÍAS\nTRABAJADOS",
        styles: { halign: "center", valign: "middle" },
      },
      {
        content: "TOTAL\nAGUINALDO",
        styles: { halign: "center", valign: "middle" },
      },
    ],
  ];
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

  await drawCompanyLogo(doc, companyName);

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

  const titleCenterX = 172;
  doc.setFont("helvetica", "bold");
  doc.setFontSize(12.5);
  doc.setTextColor(...theme.primary);
  doc.text(titleText, titleCenterX, 10.5, { align: "center" });

  doc.setFontSize(7.2);
  doc.setTextColor(...theme.mutedText);
  doc.text(subtitle, titleCenterX, 14.5, { align: "center" });

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

  const pageWidth = doc.internal.pageSize.getWidth();
  const updateBoxWidth = 72;
  const updateBoxX = pageWidth - 10 - updateBoxWidth;
  drawUpdateMetadataBox(doc, updateBoxX, 6.0, updateBoxWidth, 8.2, theme, timestamp);

  drawCompanyContactInfo(
    doc,
    updateBoxX,
    18.5,
    updateBoxWidth,
    theme,
    company
  );
};

export const exportChristmasBonusPdf = async ({
  bonuses = [],
  company = null,
  periodYear = new Date().getFullYear(),
}) => {
  const companyName = company?.name || "";
  const theme = getPayrollTheme(companyName);
  const subtitle = `CORRESPONDIENTE A LA GESTIÓN ${periodYear}`;
  const timestamp = getFormattedUpdateTimestamp();

  const doc = new jsPDF({
    orientation: "landscape",
    unit: "mm",
    format: "legal", // 355.6 mm x 215.9 mm
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
        top: 2.2,
        bottom: 2.2,
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
        top: 2.0,
        bottom: 2.0,
        left: 1.5,
        right: 1.5,
      },
      lineWidth: 0.1,
      lineColor: theme.border,
    },

    alternateRowStyles: {
      fillColor: [253, 254, 255],
    },

    // 14 columnas sumando exactamente 335.6 mm (márgenes exactos de 10 mm a cada lado en hoja Legal de 355.6 mm)
    columnStyles: {
      0: { cellWidth: 9.0, halign: "center" },    // N°
      1: { cellWidth: 46.0, halign: "left" },     // APELLIDOS Y NOMBRES
      2: { cellWidth: 22.0, halign: "center" },   // CI
      3: { cellWidth: 21.0, halign: "center" },   // NACIONALIDAD
      4: { cellWidth: 19.5, halign: "center" },   // FECHA DE NACIMIENTO
      5: { cellWidth: 14.5, halign: "center" },   // SEXO F/M
      6: { cellWidth: 35.0, halign: "left" },     // CARGO
      7: { cellWidth: 18.0, halign: "center" },   // FECHA DE INGRESO
      8: { cellWidth: 23.0, halign: "right" },    // PROM. HABER BÁSICO
      9: { cellWidth: 24.5, halign: "right" },    // PROM. BONO ANTIGÜEDAD
      10: { cellWidth: 22.0, halign: "right" },   // PROM. OTROS BONOS
      11: { cellWidth: 24.5, halign: "right", fontStyle: "bold" }, // PROM. TOTAL GANADO
      12: { cellWidth: 26.6, halign: "center" },  // MESES Y DÍAS TRABAJADOS
      13: { cellWidth: 30.0, halign: "right", fontStyle: "bold" }, // TOTAL AGUINALDO
    },

    didParseCell: (data) => {
      if (data.section === "head" && data.column.index === 13) {
        data.cell.styles.fillColor = theme.primaryDark;
      }
    },
  };

  // Agrupar empleados por ciudad para la Planilla de Aguinaldos
  const groupsByCity = {};
  bonuses.forEach((b) => {
    const cityName = (b.cityName || "SIN CIUDAD").trim().toUpperCase();
    if (!groupsByCity[cityName]) {
      groupsByCity[cityName] = [];
    }
    groupsByCity[cityName].push(b);
  });

  const sortedCities = Object.keys(groupsByCity).sort((a, b) =>
    a.localeCompare(b, "es", { sensitivity: "base" })
  );

  for (let i = 0; i < sortedCities.length; i++) {
    const cityName = sortedCities[i];
    const cityBonuses = groupsByCity[cityName];

    if (i > 0) {
      doc.addPage();
    }

    const cityTitle = `PLANILLA DE PAGO AGUINALDO DE NAVIDAD - ${cityName}`;

    await drawHeader(
      doc,
      company,
      theme,
      cityTitle,
      subtitle,
      timestamp,
      cityName
    );

    const cityTotals = cityBonuses.reduce(
      (acc, row) => ({
        averageBaseSalary: acc.averageBaseSalary + Number(row.averageBaseSalary || 0),
        averageSeniorityBonus: acc.averageSeniorityBonus + Number(row.averageSeniorityBonus || 0),
        averageOtherBonuses: acc.averageOtherBonuses + Number(row.averageOtherBonuses || 0),
        averageGrossPay: acc.averageGrossPay + Number(row.averageGrossPay || 0),
        christmasBonusAmount: acc.christmasBonusAmount + Number(row.christmasBonusAmount || 0),
      }),
      {
        averageBaseSalary: 0,
        averageSeniorityBonus: 0,
        averageOtherBonuses: 0,
        averageGrossPay: 0,
        christmasBonusAmount: 0,
      }
    );

    const sortedEmployees = [...cityBonuses].sort((a, b) =>
      getEmployeeFullName(a).localeCompare(getEmployeeFullName(b), "es", {
        sensitivity: "base",
      })
    );

    const body = sortedEmployees.map((employee, idx) =>
      buildChristmasBonusTableRow(employee, idx + 1, theme)
    );

    body.push(buildChristmasBonusTotalsRow(cityTotals, theme, "TOTAL GENERAL"));

    autoTable(doc, {
      startY: 32,
      margin: { top: 32, bottom: 12, left: 10, right: 10 },
      head: buildChristmasBonusTableHeader(),
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
      `${companyName} • Planilla de Pago Aguinaldo de Navidad • Gestión ${periodYear}`,
      10,
      footerTextY
    );
    doc.text(`Página ${page} de ${totalPages}`, contentRight, footerTextY, {
      align: "right",
    });
  }

  const sanitizedCompanyName = (companyName || "empresa")
    .replace(/[^a-zA-Z0-9]/g, "_")
    .toLowerCase();

  const fileName = `${sanitizedCompanyName}_aguinaldos_${periodYear}.pdf`;

  doc.save(fileName);
};
