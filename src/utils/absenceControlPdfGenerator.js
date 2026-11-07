
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

/* =====================================================
   COLORES - IDENTIDAD VISUAL DEL SISTEMA
===================================================== */


const COLORS = {
  primary: [51, 99, 66],         // Verde oscuro del título
  primaryDark: [34, 67, 45],

  headerLight: [180, 210, 188],
  employeeBg: [250, 252, 250], //[250, 252, 250]
  alternate: [255, 255, 255],

  text: [36, 48, 42],
  muted: [105, 116, 110],
  border: [218, 225, 220],
  white: [255, 255, 255],

  periodBg: [246, 249, 247],
  periodBorder: [197, 217, 202],

  falta: {
    bg: [255, 233, 234],
    text: [195, 39, 48],
    border: [255, 164, 170],
  },

  permiso: {
    bg: [221, 249, 230],
    text: [0, 125, 54],
    border: [167, 233, 187],
  },

  anticipo: {
    bg: [244, 234, 255],
    text: [118, 39, 185],
    border: [219, 190, 249],
  },

  vacaciones: {
    bg: [228, 236, 255],
    text: [33, 82, 193],
    border: [187, 207, 255],
  },
};

const MONTHS = [
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

const PAGE = {
  margin: 12,
  top: 28,
  bottom: 18,
  gap: 9,
};

/* =====================================================
   FUNCIONES AUXILIARES
===================================================== */

const toText = (value) =>
  value === null || value === undefined
    ? ""
    : String(value).trim();

const formatDate = (value) => {
  if (!value) return "-";

  const date = toText(value);

  const match = date.match(
    /^(\d{4})-(\d{2})-(\d{2})/
  );

  if (!match) return date;

  return `${match[3]}/${match[2]}/${match[1]}`;
};

const getDateKey = (item) =>
  toText(item.date || item.startDate).slice(0, 10);

const getEmployeeName = (employee) => {
  const name = [
    toText(employee.lastNames),
    toText(employee.firstNames),
  ]
    .filter(Boolean)
    .join(" ");

  return (
    name.toUpperCase() ||
    `EMPLEADO #${employee.id ?? ""}`
  );
};

/* =====================================================
   FORMATO DE DURACIÓN
===================================================== */

const formatDuration = (item) => {
  if (item.duration === "halfDay") {
    return "0,5 día";
  }

  if (item.duration === "hours") {
    const hours =
      item.hours ?? item.durationHours;

    return hours != null
      ? `${hours} h`
      : "Horas";
  }

  if (
    item.days !== null &&
    item.days !== undefined &&
    Number(item.days) > 0
  ) {
    const days = Number(item.days);

    return `${days} ${
      days === 1 ? "día" : "días"
    }`;
  }

  return "1 día";
};

/* =====================================================
   FECHAS DE VACACIONES
===================================================== */

const formatVacationPeriod = (vacation) => {
  const start = formatDate(
    vacation.startDate || vacation.date
  );

  const end = vacation.endDate
    ? formatDate(vacation.endDate)
    : "";

  return end && end !== start
    ? `${start} al ${end}`
    : start;
};

/* =====================================================
   OBSERVACIONES
===================================================== */

const getObservation = (item, category) => {
  if (category === "anticipo") {
    const type =
      item.type === "salary"
        ? "Anticipo de sueldo"
        : item.type === "debt"
        ? "Anticipo por deuda"
        : "Anticipo";

    return [type, toText(item.notes)]
      .filter(Boolean)
      .join(" - ");
  }

  const reason =
    toText(item.reason) ||
    (category === "falta"
      ? "Sin justificación"
      : "Permiso laboral");

  return [reason, toText(item.description)]
    .filter(Boolean)
    .join(" - ");
};

/* =====================================================
   CELDAS AGRUPADAS POR EMPLEADO
===================================================== */

const employeeCells = (
  employee,
  number,
  rowCount
) => [
  {
    content: String(number),
    rowSpan: rowCount,
    styles: {
      halign: "center",
      valign: "middle",
      fontStyle: "bold",
      textColor: COLORS.primaryDark,
      fillColor: COLORS.employeeBg,
    },
  },
  {
    content: getEmployeeName(employee),
    rowSpan: rowCount,
    styles: {
      halign: "left",
      valign: "middle",
      fontStyle: "bold",
      textColor: COLORS.primaryDark,
      fillColor: COLORS.employeeBg,
      cellPadding: {
        top: 2,
        bottom: 2,
        left: 3,
        right: 2,
      },
    },
  },
];

/* =====================================================
   TABLA 1 - FALTAS, PERMISOS Y ANTICIPOS
===================================================== */

const buildIncidentRows = (employees) => {
  const rows = [];
  let number = 0;

  employees.forEach((employee) => {
    const items = [
      ...(employee.faltas || []).map((item) => ({
        ...item,
        pdfCategory: "falta",
      })),

      ...(employee.permisos || []).map((item) => ({
        ...item,
        pdfCategory: "permiso",
      })),

      ...(employee.anticipos || []).map((item) => ({
        ...item,
        pdfCategory: "anticipo",
      })),
    ].sort((a, b) =>
      getDateKey(a).localeCompare(getDateKey(b))
    );

    if (!items.length) return;

    number++;

    items.forEach((item, index) => {
      const category = item.pdfCategory;
      const color = COLORS[category];

      const row =
        index === 0
          ? employeeCells(
              employee,
              number,
              items.length
            )
          : [];

      const label =
        category === "falta"
          ? "Falta"
          : category === "permiso"
          ? "Permiso"
          : "Anticipo";

      row.push(
        {
          content: label,
          styles: {
            halign: "center",
            valign: "middle",
            fontStyle: "bold",
            fillColor: color.bg,
            textColor: color.text,
          },
        },
        {
          content: formatDate(
            item.date || item.startDate
          ),
          styles: {
            halign: "center",
            valign: "middle",
          },
        },
        {
          content:
            category === "anticipo"
              ? "-"
              : formatDuration(item),
          styles: {
            halign: "center",
            valign: "middle",
          },
        },
        {
          content: getObservation(
            item,
            category
          ),
          styles: {
            halign: "left",
            valign: "middle",
          },
        }
      );

      rows.push(row);
    });
  });

  return rows;
};

/* =====================================================
   TABLA 2 - VACACIONES
===================================================== */

const buildVacationRows = (employees) => {
  const rows = [];
  let number = 0;

  employees.forEach((employee) => {
    const vacations = [
      ...(employee.vacaciones || []),
    ].sort((a, b) =>
      getDateKey(a).localeCompare(getDateKey(b))
    );

    if (!vacations.length) return;

    number++;

    vacations.forEach((vacation, index) => {
      const row =
        index === 0
          ? employeeCells(
              employee,
              number,
              vacations.length
            )
          : [];

      const type =
        vacation.type === "money"
          ? "Compensación monetaria"
          : "Vacaciones";

      const observation = [
        type,
        toText(vacation.notes),
      ]
        .filter(Boolean)
        .join(" - ");

      row.push(
        {
          content: formatVacationPeriod(
            vacation
          ),
          styles: {
            halign: "center",
            valign: "middle",
          },
        },
        {
          content: observation,
          styles: {
            halign: "left",
            valign: "middle",
          },
        }
      );

      rows.push(row);
    });
  });

  return rows;
};

/* =====================================================
   TÍTULOS INTEGRADOS EN LAS TABLAS
===================================================== */

const buildTableTitle = (title, colSpan) => ({
  content: title,
  colSpan,
  styles: {
    fillColor: COLORS.primary,
    textColor: COLORS.white,
    fontStyle: "bold",
    fontSize: 9.3,
    halign: "center",
    valign: "middle",
    cellPadding: {
      top: 5,
      bottom: 5,
      left: 3,
      right: 3,
    },
  },
});

const getIncidentHeader = (month, year) => [
  [
    buildTableTitle(
      `REGISTRO CONSOLIDADO: FALTAS, PERMISOS Y ANTICIPOS - ${month.toUpperCase()} ${year}`,
      6
    ),
  ],
  [
    "N.º",
    "NOMBRE DEL EMPLEADO",
    "TIPO DE\nINCIDENCIA",
    "FECHA /\nPERÍODO",
    "DÍAS /\nHORAS",
    "OBSERVACIÓN / MOTIVO",
  ],
];

const getVacationHeader = () => [
  [buildTableTitle("VACACIONES", 4)],
  [
    "N.º",
    "NOMBRE DEL EMPLEADO",
    "FECHA / PERÍODO",
    "OBSERVACIÓN",
  ],
];

/* =====================================================
   ESTILOS GENERALES DE LAS TABLAS
===================================================== */

const tableStyles = {
  theme: "grid",

  margin: {
    left: PAGE.margin,
    right: PAGE.margin,
    top: PAGE.top,
    bottom: PAGE.bottom,
  },

  styles: {
    font: "helvetica",
    fontSize: 7.2,
    textColor: COLORS.text,
    fillColor: COLORS.employeeBg,
    valign: "middle",
    overflow: "linebreak",

    cellPadding: {
      top: 2.3,
      bottom: 2.3,
      left: 1.8,
      right: 1.8,
    },

    lineWidth: 0.15,
    lineColor: COLORS.border,
  },

  // Encabezado de columnas verde suave
  headStyles: {
    fillColor: COLORS.headerLight,
    textColor: COLORS.primaryDark,
    fontStyle: "bold",
    fontSize: 7.5,
    halign: "center",
    valign: "middle",
    cellPadding: {
      top: 3,
      bottom: 3,
      left: 1.5,
      right: 1.5,
    },
  },

  alternateRowStyles: {
    fillColor: COLORS.alternate,
  },

  rowPageBreak: "avoid",
  showHead: "everyPage",
};

/* =====================================================
   INDICADOR DEL MES
===================================================== */

const drawPeriodBadge = (doc, month, year) => {
  const pageWidth =
    doc.internal.pageSize.getWidth();

  const width = 47;
  const height = 10;
  const x =
    pageWidth - PAGE.margin - width;
  const y = 10;

  doc.setFillColor(...COLORS.periodBg);
  doc.setDrawColor(...COLORS.periodBorder);
  doc.setLineWidth(0.3);

  doc.roundedRect(
    x,
    y,
    width,
    height,
    4,
    4,
    "FD"
  );

  // Calendario
  const iconX = x + 4;
  const iconY = y + 2.5;

  doc.setDrawColor(...COLORS.primary);
  doc.setLineWidth(0.35);

  doc.roundedRect(
    iconX,
    iconY,
    5.3,
    5,
    0.6,
    0.6,
    "D"
  );

  doc.line(
    iconX,
    iconY + 1.7,
    iconX + 5.3,
    iconY + 1.7
  );

  doc.line(
    iconX + 1.3,
    iconY - 0.7,
    iconX + 1.3,
    iconY + 0.8
  );

  doc.line(
    iconX + 4,
    iconY - 0.7,
    iconX + 4,
    iconY + 0.8
  );

  // Mes y año
  doc.setFont("helvetica", "bold");
  doc.setFontSize(8.4);
  doc.setTextColor(...COLORS.primaryDark);

  doc.text(
    `${month} ${year}`,
    x + 12,
    y + 6.3
  );
};

/* =====================================================
   TOTALES - SOLO AL FINAL
===================================================== */

const drawTotals = (doc, y, totals) => {
  const cards = [
    {
      label: "Faltas",
      value: totals.faltas,
      color: COLORS.falta,
    },
    {
      label: "Permisos",
      value: totals.permisos,
      color: COLORS.permiso,
    },
    {
      label: "Anticipos",
      value: totals.anticipos,
      color: COLORS.anticipo,
    },
    {
      label: "Vacaciones",
      value: totals.vacaciones,
      color: COLORS.vacaciones,
    },
  ];

  const pageWidth =
    doc.internal.pageSize.getWidth();

  const gap = 3;

  const availableWidth =
    pageWidth - PAGE.margin * 2;

  const cardWidth =
    (availableWidth - gap * 3) / 4;

  cards.forEach((card, index) => {
    const x =
      PAGE.margin +
      index * (cardWidth + gap);

    doc.setFillColor(...card.color.bg);
    doc.setDrawColor(...card.color.border);
    doc.setLineWidth(0.3);

    doc.roundedRect(
      x,
      y,
      cardWidth,
      20,
      3,
      3,
      "FD"
    );

    doc.setFont("helvetica", "bold");
    doc.setTextColor(...card.color.text);

    doc.setFontSize(15);
    doc.text(
      String(card.value),
      x + cardWidth / 2,
      y + 8.7,
      { align: "center" }
    );

    doc.setFontSize(8.5);
    doc.text(
      card.label,
      x + cardWidth / 2,
      y + 15,
      { align: "center" }
    );
  });
};

/* =====================================================
   PIE DE PÁGINA
===================================================== */

const drawFooters = (doc, month, year) => {
  const totalPages =
    doc.internal.getNumberOfPages();

  const pageWidth =
    doc.internal.pageSize.getWidth();

  const pageHeight =
    doc.internal.pageSize.getHeight();

  for (let page = 1; page <= totalPages; page++) {
    doc.setPage(page);

    // Mes visible en cada página
    drawPeriodBadge(doc, month, year);

    const y = pageHeight - 9;

    doc.setDrawColor(...COLORS.border);
    doc.setLineWidth(0.2);

    doc.line(
      PAGE.margin,
      y,
      pageWidth - PAGE.margin,
      y
    );

    doc.setFont("helvetica", "normal");
    doc.setFontSize(7);
    doc.setTextColor(...COLORS.muted);

    doc.text(
      `Control de ausencias | ${month} ${year}`,
      PAGE.margin,
      y + 4
    );

    doc.text(
      `Página ${page} de ${totalPages}`,
      pageWidth - PAGE.margin,
      y + 4,
      { align: "right" }
    );
  }
};

/* =====================================================
   GENERACIÓN PRINCIPAL DEL PDF
===================================================== */

export const exportAbsenceControlPdf = ({
  employees = [],
  periodMonth = new Date().getMonth() + 1,
  periodYear = new Date().getFullYear(),
} = {}) => {
  const monthName =
    MONTHS[Number(periodMonth)] || "Mes";

  const groupedEmployees =
    Array.isArray(employees) ? employees : [];

  // Totales de registros
  const totals = groupedEmployees.reduce(
    (acc, employee) => {
      acc.faltas +=
        (employee.faltas || []).length;

      acc.permisos +=
        (employee.permisos || []).length;

      acc.anticipos +=
        (employee.anticipos || []).length;

      acc.vacaciones +=
        (employee.vacaciones || []).length;

      return acc;
    },
    {
      faltas: 0,
      permisos: 0,
      anticipos: 0,
      vacaciones: 0,
    }
  );

  // A4 vertical
  const doc = new jsPDF({
    orientation: "portrait",
    unit: "mm",
    format: "a4",
  });

  const pageHeight =
    doc.internal.pageSize.getHeight();

  /* ======================================
     TABLA 1 - INCIDENCIAS
  ====================================== */

  const incidentRows =
    buildIncidentRows(groupedEmployees);

  autoTable(doc, {
    ...tableStyles,
    startY: PAGE.top,

    head: getIncidentHeader(
      monthName,
      periodYear
    ),

    body: incidentRows.length
      ? incidentRows
      : [[{
          content:
            "Sin faltas, permisos ni anticipos registrados",
          colSpan: 6,
          styles: { halign: "center" },
        }]],

    columnStyles: {
      0: {
        cellWidth: 9,
        halign: "center",
      },
      1: {
        cellWidth: 40,
        valign: "middle",
      },
      2: {
        cellWidth: 24,
        halign: "center",
      },
      3: {
        cellWidth: 29,
        halign: "center",
      },
      4: {
        cellWidth: 18,
        halign: "center",
      },
      5: {
        cellWidth: 66,
      },
    },
  });

  /* ======================================
     TABLA 2 - VACACIONES
  ====================================== */

  let y =
    doc.lastAutoTable.finalY + PAGE.gap;

  if (
    y + 30 >
    pageHeight - PAGE.bottom
  ) {
    doc.addPage();
    y = PAGE.top;
  }

  const vacationRows =
    buildVacationRows(groupedEmployees);

  autoTable(doc, {
    ...tableStyles,
    startY: y,

    head: getVacationHeader(),

    body: vacationRows.length
      ? vacationRows
      : [[{
          content:
            "Sin vacaciones registradas",
          colSpan: 4,
          styles: { halign: "center" },
        }]],

    columnStyles: {
      0: {
        cellWidth: 9,
        halign: "center",
      },
      1: {
        cellWidth: 55,
        valign: "middle",
      },
      2: {
        cellWidth: 48,
        halign: "center",
      },
      3: {
        cellWidth: 74,
      },
    },
  });

  /* ======================================
     TOTALES AL FINAL
  ====================================== */

  y = doc.lastAutoTable.finalY + 12;

  if (
    y + 20 >
    pageHeight - PAGE.bottom
  ) {
    doc.addPage();
    y = PAGE.top;
  }

  drawTotals(doc, y, totals);

  /* ======================================
     PERÍODO Y PÁGINAS
  ====================================== */

  drawFooters(doc, monthName, periodYear);

  /* ======================================
     DESCARGAR PDF
  ====================================== */

  const fileName =
    `control_ausencias_${periodYear}_` +
    `${String(periodMonth).padStart(2, "0")}.pdf`;

  doc.save(fileName);
};
