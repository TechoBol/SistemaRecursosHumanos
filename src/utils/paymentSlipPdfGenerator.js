import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

import techobolLogo from "../assets/logotechobol.png";
import megadisLogo from "../assets/logomegadis.png";
import rhinoconsLogo from "../assets/logorhinocons.jpeg";

import {
  MONTH_NAMES,
  getPayrollTheme,
  formatMoneyPdf,
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

const getEmployeeName = (employee) =>
  employee.employeeLastNames
    ? `${employee.employeeLastNames} ${employee.employeeFirstNames || ""}`.trim()
    : employee.employeeName || "-";

const getCompanyLogo = async (companyName) => {
  const logo = COMPANY_LOGOS[getCompanyKey(companyName)];
  const image = await loadImage(logo.src);

  return {
    image,
    format: logo.format,
  };
};

const formatFullDateEs = (date = new Date()) => {
  const day = date.getDate();
  const month = MONTH_NAMES[date.getMonth() + 1]?.toLowerCase() || "";
  const year = date.getFullYear();

  return `${day} de ${month} del ${year}`;
};

const drawSlip = ({
  doc,
  payroll,
  company,
  month,
  year,
  theme,
  logo,
  x,
  y,
  width,
  height,
}) => {
  const companyName = company?.name || "";
  const companyTaxId = company?.taxId || "";
  const employeeName = getEmployeeName(payroll);

  const padding = 5;
  const contentX = x + padding;
  const contentRight = x + width - padding;
  const contentWidth = width - padding * 2;

  const topBoxY = y + 4;
  const topBoxH = 29;

  const titleBoxY = topBoxY + topBoxH + 4;
  const titleBoxH = 18;

  const infoBoxY = titleBoxY + titleBoxH + 4;
  const infoBoxH = 22;

  const tablesY = infoBoxY + infoBoxH + 4;
  const tablesGap = 4;
  const tableWidth = (contentWidth - tablesGap) / 2;

  // =========================
  // CABECERA EMPRESA
  // =========================

  // Fondo general de cabecera
  doc.setFillColor(...theme.branchBg);
  doc.roundedRect(
    contentX,
    topBoxY,
    contentWidth,
    topBoxH,
    2.5,
    2.5,
    "F"
  );

  // Barra vertical corporativa
  doc.setFillColor(...theme.primary);
  doc.roundedRect(
    contentX,
    topBoxY,
    2.2,
    topBoxH,
    1,
    1,
    "F"
  );

  // =========================
  // LOGO
  // =========================

  const logoAreaX = contentX + 6;
  const logoAreaY = topBoxY + 4;

  const maxLogoWidth = 24;
  const maxLogoHeight = 20;

  const logoScale = Math.min(
    maxLogoWidth / logo.image.width,
    maxLogoHeight / logo.image.height
  );

  const logoWidth = logo.image.width * logoScale;
  const logoHeight = logo.image.height * logoScale;

  // Centramos el logo dentro de su área
  const logoX =
    logoAreaX + (maxLogoWidth - logoWidth) / 2;

  const logoY =
    logoAreaY + (maxLogoHeight - logoHeight) / 2;

  doc.addImage(
    logo.image,
    logo.format,
    logoX,
    logoY,
    logoWidth,
    logoHeight
  );

  // =========================
  // SEPARADOR
  // =========================

  const dividerX = contentX + 34;

  doc.setDrawColor(...theme.borderSoft);
  doc.setLineWidth(0.25);

  doc.line(
    dividerX,
    topBoxY + 5,
    dividerX,
    topBoxY + topBoxH - 5
  );

  // =========================
  // INFORMACIÓN EMPRESA
  // =========================

  const companyTextX = dividerX + 6;

  doc.setFont("helvetica", "bold");
  doc.setFontSize(10.8);
  doc.setTextColor(...theme.primaryDark);

  doc.text(
    companyName.toUpperCase(),
    companyTextX,
    topBoxY + 10
  );

  doc.setFont("helvetica", "normal");
  doc.setFontSize(6.8);
  doc.setTextColor(...theme.mutedText);

  let companyInfoY = topBoxY + 15;

  if (companyTaxId) {
    doc.text(
      `NIT ${companyTaxId}`,
      companyTextX,
      companyInfoY
    );

    companyInfoY += 4.5;
  }

  doc.text(
    COMPANY_LOCATION,
    companyTextX,
    companyInfoY
  );

  // =========================
  // DETALLE DECORATIVO DERECHO
  // =========================

  // Fondo muy suave del extremo derecho
  doc.setFillColor(...theme.liquidHighlightBg);

  doc.roundedRect(
    contentRight - 18,
    topBoxY,
    18,
    topBoxH,
    2.5,
    2.5,
    "F"
  );

  // Figura superior
  doc.setFillColor(...theme.primary);

  doc.triangle(
    contentRight - 10,
    topBoxY,
    contentRight,
    topBoxY,
    contentRight,
    topBoxY + 10,
    "F"
  );

  // Figura inferior más suave
  doc.setFillColor(...theme.subheaderBg);

  doc.triangle(
    contentRight - 6,
    topBoxY + topBoxH,
    contentRight,
    topBoxY + topBoxH,
    contentRight,
    topBoxY + topBoxH - 7,
    "F"
  );

  // =========================
  // TITULO + PERIODO
  // =========================
  doc.setFillColor(...theme.branchBg);
  doc.roundedRect(contentX, titleBoxY, contentWidth, titleBoxH, 2, 2, "F");

  const periodBoxW = 42;
  const periodBoxX = contentRight - periodBoxW - 3;

  doc.setDrawColor(...theme.borderSoft);
  doc.setLineWidth(0.2);
  doc.line(periodBoxX - 4, titleBoxY + 3, periodBoxX - 4, titleBoxY + titleBoxH - 3);

  doc.setFillColor(...theme.liquidHighlightBg);
  doc.roundedRect(periodBoxX, titleBoxY + 2.5, periodBoxW, titleBoxH - 5, 1.5, 1.5, "F");

  doc.setFont("helvetica", "bold");
  doc.setFontSize(13.5);
  doc.setTextColor(...theme.primaryDark);
  doc.text("BOLETA DE PAGO", contentX + 4, titleBoxY + 8.5);

  doc.setFont("helvetica", "normal");
  doc.setFontSize(7.2);
  doc.setTextColor(...theme.primaryDark);
  doc.text("(Expresado en Bolivianos)", contentX + 4, titleBoxY + 13.6);

  doc.setFont("helvetica", "bold");
  doc.setFontSize(6.8);
  doc.setTextColor(...theme.primaryDark);
  doc.text("PERIODO", periodBoxX + periodBoxW / 2, titleBoxY + 7, {
    align: "center",
  });

  doc.setFontSize(10.2);
  doc.text(
    `${MONTH_NAMES[month].toUpperCase()} ${year}`,
    periodBoxX + periodBoxW / 2,
    titleBoxY + 12.8,
    { align: "center" }
  );

  // =========================
  // DATOS DEL EMPLEADO
  // =========================
  doc.setFillColor(250, 251, 252);
  doc.roundedRect(contentX, infoBoxY, contentWidth, infoBoxH, 2, 2, "F");

  const infoX = contentX + 5;
  const valueX = infoX + 36;

  doc.setFontSize(6.5);
  doc.setTextColor(...theme.primaryDark);

  doc.setFont("helvetica", "bold");
  doc.text("APELLIDOS Y NOMBRES:", infoX, infoBoxY + 6);
  doc.text("CARGO:", infoX, infoBoxY + 12);
  doc.text("DÍAS TRABAJADOS:", infoX, infoBoxY + 18);

  doc.setFont("helvetica", "normal");
  doc.setFontSize(7.5);
  doc.setTextColor(...theme.text);

  doc.text(employeeName.toUpperCase(), valueX, infoBoxY + 6);
  doc.text(
    (payroll.jobTitleName || "-").toUpperCase(),
    valueX,
    infoBoxY + 12
  );
  doc.text(
    String(payroll.workedDays ?? 0),
    valueX,
    infoBoxY + 18
  );

  // =========================
  // TABLAS LADO A LADO
  // =========================
  const earningsX = contentX;
  const deductionsX = contentX + tableWidth + tablesGap;

  autoTable(doc, {
    startY: tablesY,
    margin: { left: earningsX },
    tableWidth,
    pageBreak: "avoid",
    theme: "grid",
    head: [["HABERES", "MONTO (Bs)"]],
    body: [
      ["Sueldo Básico", formatMoneyPdf(payroll.earnedSalary)],
      ["Bono Antigüedad", formatMoneyPdf(payroll.seniorityBonus)],
      ["Otros Bonos", formatMoneyPdf(payroll.otherBonuses)],
      ["Total Ganado", formatMoneyPdf(payroll.grossPay)],
    ],
    headStyles: {
      fillColor: theme.primary,
      textColor: theme.white,
      fontStyle: "bold",
      fontSize: 7.8,
      halign: "left",
      cellPadding: 2.2,
      lineColor: theme.border,
      lineWidth: 0.15,
    },
    bodyStyles: {
      fontSize: 7.5,
      textColor: theme.text,
      cellPadding: 2.2,
      lineColor: theme.border,
      lineWidth: 0.15,
    },
    columnStyles: {
      0: { cellWidth: tableWidth * 0.64 },
      1: { cellWidth: tableWidth * 0.36, halign: "right" },
    },
    didParseCell: (data) => {
      if (data.section === "body" && data.row.index === 3) {
        data.cell.styles.fillColor = theme.branchBg;
        data.cell.styles.fontStyle = "bold";
        data.cell.styles.textColor = theme.primaryDark;
      }
    },
  });

  const earningsFinalY = doc.lastAutoTable.finalY;

  autoTable(doc, {
    startY: tablesY,
    margin: { left: deductionsX },
    tableWidth,
    pageBreak: "avoid",
    theme: "grid",
    head: [["DESCUENTOS", "MONTO (Bs)"]],
    body: [
      ["Gestora (AFP 12,71%)", formatMoneyPdf(payroll.afpDeduction)],
      ["Permisos / Faltas", formatMoneyPdf(payroll.absenceDeduction)],
      ["Anticipos", formatMoneyPdf(payroll.advanceDeduction)],
      ["Total Descuentos", formatMoneyPdf(payroll.totalDeductions)],
    ],
    headStyles: {
      fillColor: theme.subheaderBg,
      textColor: theme.white,
      fontStyle: "bold",
      fontSize: 7.8,
      halign: "left",
      cellPadding: 2.2,
      lineColor: theme.border,
      lineWidth: 0.15,
    },
    bodyStyles: {
      fontSize: 7.5,
      textColor: theme.text,
      cellPadding: 2.2,
      lineColor: theme.border,
      lineWidth: 0.15,
    },
    columnStyles: {
      0: { cellWidth: tableWidth * 0.64 },
      1: { cellWidth: tableWidth * 0.36, halign: "right" },
    },
    didParseCell: (data) => {
      if (data.section === "body" && data.row.index === 3) {
        data.cell.styles.fillColor = theme.totalsBg;
        data.cell.styles.fontStyle = "bold";
        data.cell.styles.textColor = theme.primaryDark;
      }
    },
  });

  const deductionsFinalY = doc.lastAutoTable.finalY;

  // =========================
  // LIQUIDO PAGABLE
  // =========================
  const liquidBoxY = Math.max(earningsFinalY, deductionsFinalY) + 4;

  doc.setFillColor(...theme.liquidHighlightBg);
  doc.roundedRect(contentX, liquidBoxY, contentWidth, 15, 2, 2, "F");

  doc.setDrawColor(...theme.borderSoft);
  doc.line(contentX + contentWidth / 2, liquidBoxY + 3, contentX + contentWidth / 2, liquidBoxY + 12);

  doc.setFont("helvetica", "bold");
  doc.setTextColor(...theme.primaryDark);

  doc.setFontSize(10);
  doc.text("LÍQUIDO PAGABLE", contentX + 4, liquidBoxY + 9.5);

  doc.setFontSize(15);
  doc.text(
    formatMoneyPdf(payroll.netSalary),
    contentRight - 4,
    liquidBoxY + 10.2,
    { align: "right" }
  );

  // =========================
  // FECHA
  // =========================
  const dateY = liquidBoxY + 23;

  doc.setDrawColor(...theme.borderSoft);
  doc.line(contentX, dateY - 4, contentRight, dateY - 4);

  doc.setFont("helvetica", "normal");
  doc.setFontSize(7.6);
  doc.setTextColor(...theme.primaryDark);
  doc.text(
    `COCHABAMBA, ${formatFullDateEs().toUpperCase()}`,
    x + width / 2,
    dateY,
    { align: "center" }
  );

  // =========================
  // FIRMAS
  // =========================
  const signatureLineY = y + height - 22;

  doc.setDrawColor(...theme.primaryDark);
  doc.setLineWidth(0.25);

  doc.line(contentX + 10, signatureLineY, contentX + 50, signatureLineY);
  doc.line(contentRight - 50, signatureLineY, contentRight - 10, signatureLineY);

  doc.setFont("helvetica", "bold");
  doc.setFontSize(7);
  doc.setTextColor(...theme.primaryDark);

  doc.text("TRABAJADOR", contentX + 30, signatureLineY + 5, {
    align: "center",
  });

  doc.text("EMPRESA", contentRight - 30, signatureLineY + 5, {
    align: "center",
  });

  doc.setFont("helvetica", "normal");
  doc.setFontSize(6.4);
  doc.setTextColor(...theme.text);

  doc.text(employeeName.toUpperCase(), contentX + 30, signatureLineY + 9, {
    align: "center",
    maxWidth: 42,
  });
};

export const exportPaymentSlipsPdf = async ({
  payrolls = [],
  company = null,
  periodMonth,
  periodYear,
}) => {
  if (!payrolls.length) return;

  const companyName = company?.name || "";
  const theme = getPayrollTheme(companyName);
  const logo = await getCompanyLogo(companyName);

  const doc = new jsPDF({
    orientation: "portrait",
    unit: "mm",
    format: [165, 216],
  });

  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  const margin = 6;

  payrolls.forEach((payroll, index) => {
    if (index > 0) {
      doc.addPage([165, 216], "portrait");
    }
    drawSlip({
      doc,
      payroll,
      company,
      month: periodMonth,
      year: periodYear,
      theme,
      logo,
      x: margin,
      y: margin,
      width: pageWidth - margin * 2,
      height: pageHeight - margin * 2,
    });
  });

  const pdfBlob = doc.output("blob");
  const pdfUrl = URL.createObjectURL(pdfBlob);

  window.open(pdfUrl, "_blank");

  setTimeout(() => {
    URL.revokeObjectURL(pdfUrl);
  }, 60000);
};