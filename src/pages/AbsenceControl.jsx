import { useState, useMemo, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  AlertCircle,
  Calendar,
  CheckSquare,
  ChevronDown,
  ChevronRight,
  ChevronUp,
  Clock,
  Palmtree,
  Search,
  Users,
} from "lucide-react";
import { useAbsenceControl } from "../hooks/useAbsenceControl";
import { useEmployees } from "../hooks/useEmployees";
import {
  PageContainer,
  PageHeader,
  PageTitle,
  PageDescription,
  PageActions,
  PeriodSelector,
  PeriodSelect,
  SearchContainer,
  SearchInput,
  LoadingSpinner,
  TotalsGrid,
  TotalCard,
  TotalLabel,
  TotalValue,
  SummaryCardIcon,
  SectionWrapper,
  SectionBar,
  SectionHeading,
  SectionCountText,
  CollapsibleCard,
  CollapsibleHeader,
  CollapsibleTitle,
  CollapsibleActions,
  CollapsibleBody,
  StatusPill,
  ActionIconButton,
  DetailItemRow,
  DetailItemTagGroup,
  DetailItemLabel,
  DetailItemText,
  DetailItemDescriptionBox,
  EmptyStateBlock,
} from "../components/ui/Page.styles";
import { TableActionButton } from "../components/ui/table/TableCell.styles";

const ALL_MONTHS = [
  { value: 1, label: "Enero" },
  { value: 2, label: "Febrero" },
  { value: 3, label: "Marzo" },
  { value: 4, label: "Abril" },
  { value: 5, label: "Mayo" },
  { value: 6, label: "Junio" },
  { value: 7, label: "Julio" },
  { value: 8, label: "Agosto" },
  { value: 9, label: "Septiembre" },
  { value: 10, label: "Octubre" },
  { value: 11, label: "Noviembre" },
  { value: 12, label: "Diciembre" },
];

const SYSTEM_START_YEAR = 2026;
const SYSTEM_START_MONTH = 9; // Inicio de registros en Septiembre 2026

const currentYear = new Date().getFullYear();
const currentMonth = new Date().getMonth() + 1;

const formatDateBolivia = (dateStr) => {
  if (!dateStr) return "";
  const parts = dateStr.split("T")[0].split("-");
  if (parts.length !== 3) return dateStr;
  return `${parts[2]}/${parts[1]}/${parts[0]}`;
};

const formatIncidentDuration = (duration) => {
  if (duration === "halfDay") return "(medio día)";
  if (duration === "hours") return "(horas)";
  return "(1 día)";
};

const formatVacationDateRange = (startDateStr, endDateStr, days) => {
  const start = formatDateBolivia(startDateStr);
  const end = formatDateBolivia(endDateStr);
  const parsedDays = Number(days) || 0;
  const daysText = `(${parsedDays} ${parsedDays === 1 ? "día" : "días"})`;
  if (!end || start === end) {
    return `${start} ${daysText}`;
  }
  return `${start} al ${end} ${daysText}`;
};

const AbsenceControl = () => {
  const navigate = useNavigate();
  const [selectedYear, setSelectedYear] = useState(currentYear);
  const [selectedMonth, setSelectedMonth] = useState(currentMonth);
  const [searchTerm, setSearchTerm] = useState("");
  const [collapsedEmployees, setCollapsedEmployees] = useState({});

  // Años disponibles desde el inicio del sistema (2026) hasta el año actual
  const availableYears = useMemo(() => {
    const years = [];
    for (let y = currentYear; y >= SYSTEM_START_YEAR; y--) {
      years.push(y);
    }
    return years;
  }, []);

  // Meses disponibles según el año seleccionado (septiembre 2026 en adelante)
  const availableMonths = useMemo(() => {
    const startM = selectedYear === SYSTEM_START_YEAR ? SYSTEM_START_MONTH : 1;
    const endM = selectedYear === currentYear ? currentMonth : 12;
    return ALL_MONTHS.filter((m) => m.value >= startM && m.value <= endM);
  }, [selectedYear]);

  // Si el mes seleccionado no existe en los meses disponibles para el año, ajustarlo
  useEffect(() => {
    if (availableMonths.length > 0) {
      const exists = availableMonths.some((m) => m.value === selectedMonth);
      if (!exists) {
        setSelectedMonth(availableMonths[availableMonths.length - 1].value);
      }
    }
  }, [availableMonths, selectedMonth]);

  const { incidents, vacations, isLoading } = useAbsenceControl(selectedYear, selectedMonth);
  const { employees } = useEmployees();

  // Mapear y agrupar por empleado
  const { groupedEmployees, kpiData } = useMemo(() => {
    const empMap = new Map();

    // 1. Poblamos desde la lista de empleados general para tener nombres completos y CIs
    employees.forEach((emp) => {
      empMap.set(emp.id, {
        id: emp.id,
        firstNames: emp.firstNames || "",
        lastNames: emp.lastNames || "",
        documentNumber: emp.documentNumber || "",
        status: emp.status,
        faltas: [],
        permisos: [],
        atrasos: [],
        vacaciones: [],
      });
    });

    // 2. Asociar incidentes (faltas, permisos, atrasos)
    incidents.forEach((inc) => {
      let emp = empMap.get(inc.employeeId);
      if (!emp) {
        emp = {
          id: inc.employeeId,
          firstNames: inc.employee?.firstNames || "Empleado",
          lastNames: inc.employee?.lastNames || `#${inc.employeeId}`,
          documentNumber: inc.employee?.documentNumber || "",
          status: inc.employee?.status || "ACTIVE",
          faltas: [],
          permisos: [],
          atrasos: [],
          vacaciones: [],
        };
        empMap.set(inc.employeeId, emp);
      }

      if (inc.type === "absence") {
        emp.faltas.push(inc);
      } else if (inc.type === "permission") {
        emp.permisos.push(inc);
      } else if (inc.type === "lateness") {
        emp.atrasos.push(inc);
      }
    });

    // 3. Asociar vacaciones
    vacations.forEach((vac) => {
      let emp = empMap.get(vac.employeeId);
      if (!emp) {
        emp = {
          id: vac.employeeId,
          firstNames: vac.employee?.firstNames || "Empleado",
          lastNames: vac.employee?.lastNames || `#${vac.employeeId}`,
          documentNumber: vac.employee?.documentNumber || "",
          status: vac.employee?.status || "ACTIVE",
          faltas: [],
          permisos: [],
          atrasos: [],
          vacaciones: [],
        };
        empMap.set(vac.employeeId, emp);
      }
      emp.vacaciones.push(vac);
    });

    // 4. Calcular KPIs
    const permisosCount = incidents.filter((i) => i.type === "permission").length;
    const faltasCount = incidents.filter((i) => i.type === "absence").length;
    const vacacionesDaysTotal = vacations.reduce((sum, v) => sum + Number(v.days || 0), 0);

    // 5. Filtrar por término de búsqueda y registros
    const term = searchTerm.trim().toLowerCase();
    const allEmps = Array.from(empMap.values());

    let filtered = allEmps.filter((emp) => {
      const hasRecords =
        emp.faltas.length > 0 ||
        emp.permisos.length > 0 ||
        emp.atrasos.length > 0 ||
        emp.vacaciones.length > 0;

      if (!term) {
        return hasRecords;
      }

      const fullName = `${emp.firstNames} ${emp.lastNames}`.toLowerCase();
      const reverseName = `${emp.lastNames} ${emp.firstNames}`.toLowerCase();
      const doc = String(emp.documentNumber || "").toLowerCase();

      return (
        fullName.includes(term) ||
        reverseName.includes(term) ||
        doc.includes(term)
      );
    });

    // Ordenar: alfabéticamente por apellido y luego por nombre
    filtered.sort((a, b) => {
      const nameA = `${a.lastNames || ""} ${a.firstNames || ""}`.trim().toLowerCase();
      const nameB = `${b.lastNames || ""} ${b.firstNames || ""}`.trim().toLowerCase();
      return nameA.localeCompare(nameB);
    });
    // Ordenar: primero los que tienen más incidencias, luego por apellido
    /*filtered.sort((a, b) => {
      const totalA = a.faltas.length + a.permisos.length + a.vacaciones.length + a.atrasos.length;
      const totalB = b.faltas.length + b.permisos.length + b.vacaciones.length + b.atrasos.length;
      if (totalB !== totalA) return totalB - totalA;
      return a.lastNames.localeCompare(b.lastNames);
    });*/

    return {
      groupedEmployees: filtered,
      kpiData: {
        permisos: {
          total: permisosCount,
        },
        faltas: {
          total: faltasCount,
        },
        vacaciones: {
          total: vacacionesDaysTotal,
        },
      },
    };
  }, [employees, incidents, vacations, searchTerm]);

  // Toggle colapsar empleado
  const toggleEmployeeCollapse = (employeeId) => {
    setCollapsedEmployees((prev) => ({
      ...prev,
      [employeeId]: !prev[employeeId],
    }));
  };

  // Navegar al detalle del empleado
  const handleViewEmployeeDetail = (employeeId, event) => {
    event.stopPropagation();
    navigate(`/empleados/${employeeId}`);
  };

  const selectedMonthObj = ALL_MONTHS.find((m) => m.value === selectedMonth);
  const selectedMonthName = selectedMonthObj ? selectedMonthObj.label : "";

  return (
    <PageContainer>
      {/* HEADER DE LA PÁGINA */}
      <PageHeader>
        <div>
          <PageTitle>Control de ausencias - {selectedMonthName} {selectedYear}</PageTitle>
          <PageDescription>Vista mensual de permisos, faltas y vacaciones</PageDescription>
        </div>

        <PageActions>
          {/* SELECTOR DE MES Y AÑO */}
          <PeriodSelector>
            <Calendar size={16} color="#2f573c" />
            <PeriodSelect
              value={selectedMonth}
              aria-label="Seleccionar mes"
              onChange={(e) => setSelectedMonth(Number(e.target.value))}
            >
              {availableMonths.map((m) => (
                <option key={m.value} value={m.value}>
                  {m.label}
                </option>
              ))}
            </PeriodSelect>

            <PeriodSelect
              value={selectedYear}
              aria-label="Seleccionar año"
              onChange={(e) => setSelectedYear(Number(e.target.value))}
            >
              {availableYears.map((y) => (
                <option key={y} value={y}>
                  {y}
                </option>
              ))}
            </PeriodSelect>
          </PeriodSelector>

          {/* BUSCADOR DE EMPLEADO */}
          <SearchContainer>
            <Search size={21} />
            <SearchInput
              type="search"
              value={searchTerm}
              placeholder="Buscar empleado..."
              aria-label="Buscar empleado"
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </SearchContainer>
        </PageActions>
      </PageHeader>

      {/* TARJETAS RESUMEN MENSUAL (KPIs) */}
      <TotalsGrid $columns={3}>
        <TotalCard $horizontal>
          <div>
            <TotalLabel $emphasis>Permisos del mes</TotalLabel>
            <div><TotalValue $large>{kpiData.permisos.total}</TotalValue></div>
          </div>
          <SummaryCardIcon $variant="success">
            <CheckSquare size={26} strokeWidth={2.3} />
          </SummaryCardIcon>
        </TotalCard>

        <TotalCard $variant="danger" $horizontal>
          <div>
            <TotalLabel $variant="danger" $emphasis>Faltas del mes</TotalLabel>
            <div><TotalValue $variant="danger" $large>{kpiData.faltas.total}</TotalValue></div>
          </div>
          <SummaryCardIcon $variant="danger">
            <AlertCircle size={26} strokeWidth={2.3} />
          </SummaryCardIcon>
        </TotalCard>

        <TotalCard $variant="highlight" $horizontal>
          <div>
            <TotalLabel $variant="highlight" $emphasis>Vacaciones registradas</TotalLabel>
            <div><TotalValue $variant="highlight" $large>{kpiData.vacaciones.total}</TotalValue></div>
          </div>
          <SummaryCardIcon $variant="highlight">
            <Palmtree size={26} strokeWidth={2.3} />
          </SummaryCardIcon>
        </TotalCard>
      </TotalsGrid>

      {/* VISTA AGRUPADA POR EMPLEADO */}
      <SectionWrapper>
        <SectionBar>
          <SectionHeading>Vista agrupada por empleado</SectionHeading>

          <SectionCountText>
            {groupedEmployees.length}{" "}
            {groupedEmployees.length === 1 ? "empleado mostrado" : "empleados mostrados"}
          </SectionCountText>
        </SectionBar>

        {isLoading ? (
          <EmptyStateBlock>
            <LoadingSpinner />
            <SectionHeading>Cargando información de ausencias...</SectionHeading>
          </EmptyStateBlock>
        ) : groupedEmployees.length === 0 ? (
          <EmptyStateBlock>
            <Users size={36} color="#94a3b8" />
            <SectionHeading>
              {searchTerm
                ? "No se encontraron empleados coincidentes"
                : "Sin ausencias ni vacaciones registradas"}
            </SectionHeading>
            <PageDescription>
              {searchTerm
                ? `No hay registros que coincidan con "${searchTerm}" en ${selectedMonthName} de ${selectedYear}.`
                : `No se encontraron permisos, faltas ni vacaciones registradas para el período de ${selectedMonthName} de ${selectedYear}.`}
            </PageDescription>
          </EmptyStateBlock>
        ) : (
          groupedEmployees.map((emp) => {
            const isCollapsed = Boolean(collapsedEmployees[emp.id]);
            const empFullName = `${emp.lastNames} ${emp.firstNames}`.trim().toUpperCase();

            const items = [
              ...emp.faltas.map((f) => ({ ...f, category: "faltas" })),
              ...emp.permisos.map((p) => ({ ...p, category: "permisos" })),
              ...emp.atrasos.map((a) => ({ ...a, category: "atrasos" })),
              ...emp.vacaciones.map((v) => ({ ...v, category: "vacaciones" })),
            ].sort((a, b) => {
              const dateA = a.date || a.startDate || "";
              const dateB = b.date || b.startDate || "";
              return dateA.localeCompare(dateB);
            });

            return (
              <CollapsibleCard key={emp.id}>
                {/* CABECERA DEL EMPLEADO */}
                <CollapsibleHeader onClick={() => toggleEmployeeCollapse(emp.id)}>
                  <CollapsibleTitle>{empFullName}</CollapsibleTitle>

                  <CollapsibleActions>
                    {/* CHIPS DE CONTADORES */}
                    <StatusPill $variant="danger">
                      Faltas <strong>{emp.faltas.length}</strong>
                    </StatusPill>
                    <StatusPill $variant="success">
                      Permisos <strong>{emp.permisos.length}</strong>
                    </StatusPill>
                    <StatusPill $variant="info">
                      Vacaciones <strong>{emp.vacaciones.length}</strong>
                    </StatusPill>

                    {/* BOTÓN CHEVRON RIGHT: IR AL DETALLE DEL EMPLEADO */}
                    <TableActionButton
                      type="button"
                      title={`Ver detalle de ${empFullName}`}
                      aria-label={`Ver detalle de ${empFullName}`}
                      onClick={(e) => handleViewEmployeeDetail(emp.id, e)}
                    >
                      <ChevronRight size={22} />
                    </TableActionButton>

                    {/* BOTÓN COLAPSAR / EXPANDIR */}
                    <ActionIconButton
                      type="button"
                      aria-label={isCollapsed ? "Expandir detalles" : "Colapsar detalles"}
                    >
                      {isCollapsed ? <ChevronDown size={20} /> : <ChevronUp size={20} />}
                    </ActionIconButton>
                  </CollapsibleActions>
                </CollapsibleHeader>

                {/* DETALLE EXPANDIBLE CON MOTIVO Y DESCRIPCIÓN */}
                {!isCollapsed && (
                  <CollapsibleBody>
                    {items.length === 0 ? (
                      <PageDescription>
                        El empleado no registra faltas, permisos ni vacaciones en este período.
                      </PageDescription>
                    ) : (
                      items.map((item, idx) => {
                        const isVacacion = item.category === "vacaciones";
                        const isFalta = item.category === "faltas";
                        const isPermiso = item.category === "permisos";
                        const isAtraso = item.category === "atrasos";

                        const rowVariant = isFalta
                          ? "danger"
                          : isPermiso
                          ? "success"
                          : isVacacion
                          ? "info"
                          : "warning";

                        return (
                          <DetailItemRow
                            key={`${item.category}-${item.id || idx}`}
                            $variant={rowVariant}
                          >
                            <DetailItemTagGroup>
                                {/* ICONO Y TIPO */}
                                <DetailItemLabel $variant={rowVariant}>
                                  {isVacacion ? (
                                    <Palmtree size={18} />
                                  ) : isAtraso ? (
                                    <Clock size={18} />
                                  ) : (
                                    <Calendar size={18} />
                                  )}
                                  {isVacacion
                                    ? "Vacaciones"
                                    : isFalta
                                    ? "Faltas"
                                    : isPermiso
                                    ? "Permisos"
                                    : "Atraso"}
                                </DetailItemLabel>

                                {/* FECHA Y DURACIÓN */}
                                <DetailItemText>
                                  {isVacacion
                                    ? formatVacationDateRange(
                                        item.startDate,
                                        item.endDate,
                                        item.days
                                      )
                                    : `${formatDateBolivia(item.date)} ${formatIncidentDuration(
                                        item.duration
                                      )}`}
                                </DetailItemText>
                            </DetailItemTagGroup>

                            {/* MOTIVO Y DESCRIPCIÓN */}
                            <DetailItemDescriptionBox>
                              {isVacacion ? (
                                <>
                                  <span>
                                    <strong>Tipo:</strong>{" "}
                                    {item.type === "money" ? "Compensación monetaria" : "Días hábiles"}
                                  </span>
                                  {item.notes ? (
                                    <span>
                                      <strong>Motivo / Notas:</strong> {item.notes}
                                    </span>
                                  ) : (
                                    <span>
                                      <strong>Motivo / Notas:</strong> Período vacacional aprobado
                                    </span>
                                  )}
                                </>
                              ) : (
                                <>
                                  <span>
                                    <strong>Motivo:</strong>{" "}
                                    {item.reason || (isFalta ? "Sin justificar" : "Permiso laboral")}
                                  </span>
                                  {item.description && (
                                    <span>
                                      <strong>Descripción:</strong> {item.description}
                                    </span>
                                  )}
                                </>
                              )}
                            </DetailItemDescriptionBox>
                          </DetailItemRow>
                        );
                      })
                    )}
                  </CollapsibleBody>
                )}
              </CollapsibleCard>
            );
          })
        )}
      </SectionWrapper>
    </PageContainer>
  );
};

export default AbsenceControl;