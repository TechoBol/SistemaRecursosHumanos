import React, { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Users,
  Cake,
  FileText,
  Award,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { useEmployees } from "../hooks/useEmployees";
import { getEmployeeStatus, getContractStatus } from "../utils/dateUtils";
import {
  DashboardContainer,
  DashboardHeader,
  HeaderTitleGroup,
  HeaderTitle,
  HeaderDate,
  KpisGrid,
  KpiCard,
  KpiIconWrapper,
  KpiLabel,
  KpiValue,
  KpiHint,
  DashboardGrid,
  Card,
  CardHeader,
  CardTitleGroup,
  CardTitle,
  CardSubtitle,
  SegmentGroup,
  SegmentButton,
  SegmentCount,
  ItemsList,
  ItemRow,
  Avatar,
  ItemMain,
  ItemName,
  ItemMeta,
  ItemRight,
  ItemDate,
  ChipBadge,
  CalendarControls,
  IconButton,
  CalendarLegend,
  LegendFilter,
  LegendDot,
  CalendarWrapper,
  CalendarHead,
  CalendarGrid,
  CalendarCell,
  DayNumber,
  EventDotsGroup,
  EventDot,
  DayDetailSection,
  DayDetailTitle,
  MiniStatsGrid,
  MiniStatItem,
  HitoBadge,
  EmptyState,
} from "../components/ui/Dashboard.styles";

const MONTH_NAMES = [
  "enero",
  "febrero",
  "marzo",
  "abril",
  "mayo",
  "junio",
  "julio",
  "agosto",
  "septiembre",
  "octubre",
  "noviembre",
  "diciembre",
];

const SHORT_MONTHS = MONTH_NAMES.map((m) => m.slice(0, 3));
const DAY_NAMES = [
  "domingo",
  "lunes",
  "martes",
  "miércoles",
  "jueves",
  "viernes",
  "sábado",
];
const SHORT_DAYS = DAY_NAMES.map((d) => d.slice(0, 3));

const MS_PER_DAY = 86400000;

const parseDateOnly = (dateString) => {
  if (!dateString) return null;
  const str = typeof dateString === "string" ? dateString.split("T")[0] : "";
  const parts = str.split("-").map(Number);
  if (parts.length < 3 || isNaN(parts[0])) return null;
  return new Date(parts[0], parts[1] - 1, parts[2]);
};

const normalizeDateOnly = (date) => {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate());
};

const daysDiff = (from, to) => {
  return Math.round((normalizeDateOnly(to) - normalizeDateOnly(from)) / MS_PER_DAY);
};

const formatShortDate = (date) => {
  return `${SHORT_DAYS[date.getDay()]} ${date.getDate()} ${SHORT_MONTHS[date.getMonth()]}`;
};

const formatLongDateDisplay = (date) => {
  return `${DAY_NAMES[date.getDay()]} ${date.getDate()} de ${MONTH_NAMES[date.getMonth()]}`;
};

const capitalizeWords = (str = "") => {
  return str.toLowerCase().replace(/(^|\s)\S/g, (t) => t.toUpperCase());
};

const formatNameTitle = (fullName = "") => {
  return capitalizeWords(fullName);
};

const getInitials = (firstNames = "", lastNames = "") => {
  const f = firstNames.trim().split(" ")[0] || "";
  const l = lastNames.trim().split(" ")[0] || "";
  return `${l[0] || ""}${f[0] || ""}`.toUpperCase() || "EM";
};

const getAvatarColor = (name = "") => {
  const hash = [...name].reduce((acc, c) => (acc * 31 + c.charCodeAt(0)) >>> 0, 7);
  const colors = [
    { bg: "#dcf6e5", fg: "#17633a" },
    { bg: "#eff6ff", fg: "#1d4ed8" },
    { bg: "#f3eafd", fg: "#6a2bb4" },
    { bg: "#fef3c7", fg: "#b45309" },
    { bg: "#fee2e2", fg: "#b91c1c" },
  ];
  return colors[hash % colors.length];
};

const getRelativeDaysText = (days) => {
  if (days === 0) return "Hoy";
  if (days === 1) return "Mañana";
  if (days === -1) return "Ayer";
  if (days > 0) return `en ${days} días`;
  return `hace ${-days} días`;
};

const getContractTypeLabel = (contractType) => {
  switch (contractType) {
    case "INDEFINITE":
      return "Indefinido";
    case "CONSULTING":
      return "Consultor";
    case "PROMOTER":
      return "Promotor";
    default:
      return "Contrato";
  }
};

const EVENT_LEGEND = {
  cumple: { label: "Cumpleaños", tono: "violet-soft", color: "#8b5cf6" },
  aniv: { label: "Aniversario", tono: "green", color: "#16a34a" },
  contrato: { label: "Fin de contrato", tono: "red", color: "#dc2626" },
};

const Dashboard = () => {
  const navigate = useNavigate();
  const { employees, isLoading } = useEmployees();

  const today = useMemo(() => normalizeDateOnly(new Date()), []);

  // 1. Filtrar empleados activos con contrato activo
  const activeEmployees = useMemo(() => {
    if (!employees || !Array.isArray(employees)) return [];
    return employees.filter((emp) => {
      const statusInfo = getEmployeeStatus(emp);
      return statusInfo.label !== "Finalizado";
    });
  }, [employees]);

  // Contrato activo más reciente de cada empleado
  const getActiveContract = (emp) => {
    if (!emp?.contracts || emp.contracts.length === 0) return null;
    const current = emp.contracts.find((c) => getContractStatus(c).isActive);
    if (current) return current;
    const marked = emp.contracts.find((c) => c.isActive);
    if (marked) return marked;
    return emp.contracts[0];
  };

  // 2. CUMPLEAÑOS
  const [birthdayFilter, setBirthdayFilter] = useState("mes"); // "hoy" | "semana" | "mes"

  const birthdaysData = useMemo(() => {
    const list = [];
    activeEmployees.forEach((emp) => {
      const birth = parseDateOnly(emp.birthDate);
      if (!birth) return;

      // Cumpleaños en el año actual
      let nextBirth = new Date(today.getFullYear(), birth.getMonth(), birth.getDate());
      let diff = daysDiff(today, nextBirth);
      if (diff < 0) {
        nextBirth = new Date(today.getFullYear() + 1, birth.getMonth(), birth.getDate());
        diff = daysDiff(today, nextBirth);
      }

      const isSameMonth = birth.getMonth() === today.getMonth();
      const thisMonthDate = new Date(today.getFullYear(), birth.getMonth(), birth.getDate());
      const thisMonthDiff = daysDiff(today, thisMonthDate);

      list.push({
        emp,
        birth,
        age: today.getFullYear() - birth.getFullYear(),
        nextBirth,
        daysToNext: diff,
        isSameMonth,
        thisMonthDate,
        thisMonthDiff,
      });
    });

    const hoyList = list
      .filter((b) => b.daysToNext === 0)
      .map((b) => ({
        emp: b.emp,
        date: b.nextBirth,
        diff: 0,
        age: b.age,
      }))
      .sort((a, b) => a.emp.lastNames.localeCompare(b.emp.lastNames));

    const semanaList = list
      .filter((b) => b.daysToNext >= 0 && b.daysToNext <= 7)
      .map((b) => ({
        emp: b.emp,
        date: b.nextBirth,
        diff: b.daysToNext,
        age: b.age,
      }))
      .sort((a, b) => a.diff - b.diff);

    const mesList = list
      .filter((b) => b.isSameMonth)
      .map((b) => ({
        emp: b.emp,
        date: b.thisMonthDate,
        diff: b.thisMonthDiff,
        age: b.age,
      }))
      .sort((a, b) => a.date.getDate() - b.date.getDate());

    return { hoy: hoyList, semana: semanaList, mes: mesList };
  }, [activeEmployees, today]);

  // 3. CONTRATOS POR VENCER
  const [contractHorizon, setContractHorizon] = useState(30); // 7 | 30 | 60

  const contractsData = useMemo(() => {
    const list = [];
    activeEmployees.forEach((emp) => {
      const contract = getActiveContract(emp);
      if (!contract || !contract.endDate) return;
      const end = parseDateOnly(contract.endDate);
      if (!end) return;

      const diff = daysDiff(today, end);
      // Incluir si venció en los últimos 30 días o vence en el futuro
      if (diff >= -30) {
        list.push({
          emp,
          contract,
          endDate: end,
          diff,
        });
      }
    });

    const expiredList = list.filter((c) => c.diff < 0);
    const toExpireInHorizon = list.filter((c) => c.diff >= 0 && c.diff <= contractHorizon);

    const filtered = list
      .filter((c) => c.diff <= contractHorizon)
      .sort((a, b) => a.diff - b.diff);

    return {
      expiredCount: expiredList.length,
      toExpireCount: toExpireInHorizon.length,
      filtered,
    };
  }, [activeEmployees, today, contractHorizon]);

  // 4. HITOS DE ANTIGÜEDAD (2 años y 5 años)
  const [seniorityFilter, setSeniorityFilter] = useState("todos"); // "todos" | 2 | 5

  const seniorityData = useMemo(() => {
    const list = [];
    const MILESTONES = [2, 5];

    activeEmployees.forEach((emp) => {
      const contract = getActiveContract(emp);
      if (!contract?.hireDate) return;
      const hire = parseDateOnly(contract.hireDate);
      if (!hire) return;

      MILESTONES.forEach((years) => {
        const anniversary = new Date(hire.getFullYear() + years, hire.getMonth(), hire.getDate());
        const diff = daysDiff(today, anniversary);

        // Cumplen de aquí a 90 días o cumplieron en los últimos 30 días
        if (diff >= -30 && diff <= 90) {
          list.push({
            emp,
            contract,
            hireDate: hire,
            years,
            anniversary,
            diff,
          });
        }
      });
    });

    const count2 = list.filter((m) => m.years === 2 && m.diff >= 0).length;
    const count5 = list.filter((m) => m.years === 5 && m.diff >= 0).length;

    const filtered = list
      .filter((m) => {
        if (seniorityFilter === "todos") return true;
        return m.years === seniorityFilter;
      })
      .sort((a, b) => a.anniversary - b.anniversary);

    return {
      count2,
      count5,
      totalUpcoming: list.filter((m) => m.diff >= 0 && m.diff <= 60).length,
      filtered,
    };
  }, [activeEmployees, today, seniorityFilter]);

  // 5. CALENDARIO INTERACTIVO
  const [calendarMonth, setCalendarMonth] = useState({
    year: today.getFullYear(),
    month: today.getMonth(),
  });
  const [selectedDay, setSelectedDay] = useState(today.getDate());
  const [activeEventTypes, setActiveEventTypes] = useState({
    cumple: true,
    aniv: true,
    contrato: true,
  });

  const monthEventsMap = useMemo(() => {
    const eventsByDay = {};
    const addEvent = (dayNum, event) => {
      if (!eventsByDay[dayNum]) eventsByDay[dayNum] = [];
      eventsByDay[dayNum].push(event);
    };

    activeEmployees.forEach((emp) => {
      // 1. Cumpleaños
      const birth = parseDateOnly(emp.birthDate);
      if (birth && birth.getMonth() === calendarMonth.month) {
        addEvent(birth.getDate(), {
          type: "cumple",
          emp,
          text: `Cumple ${calendarMonth.year - birth.getFullYear()} años`,
        });
      }

      // 2. Aniversarios
      const contract = getActiveContract(emp);
      if (contract?.hireDate) {
        const hire = parseDateOnly(contract.hireDate);
        if (hire && hire.getMonth() === calendarMonth.month && calendarMonth.year > hire.getFullYear()) {
          const years = calendarMonth.year - hire.getFullYear();
          const bonusRate = years >= 5 ? "11%" : years >= 2 ? "5%" : "0%";
          addEvent(hire.getDate(), {
            type: "aniv",
            emp,
            text: `${years} ${years === 1 ? "año" : "años"} en la empresa${
              years === 2 || years === 5 ? ` · bono ${bonusRate}` : ""
            }`,
          });
        }
      }

      // 3. Fin de contrato
      if (contract?.endDate) {
        const end = parseDateOnly(contract.endDate);
        if (
          end &&
          end.getFullYear() === calendarMonth.year &&
          end.getMonth() === calendarMonth.month
        ) {
          addEvent(end.getDate(), {
            type: "contrato",
            emp,
            text: `Vence contrato plazo fijo`,
          });
        }
      }
    });

    return eventsByDay;
  }, [activeEmployees, calendarMonth]);

  const handleMonthStep = (step) => {
    const next = new Date(calendarMonth.year, calendarMonth.month + step, 1);
    setCalendarMonth({ year: next.getFullYear(), month: next.getMonth() });
    setSelectedDay(
      next.getFullYear() === today.getFullYear() && next.getMonth() === today.getMonth()
        ? today.getDate()
        : 1
    );
  };

  const handleResetToToday = () => {
    setCalendarMonth({ year: today.getFullYear(), month: today.getMonth() });
    setSelectedDay(today.getDate());
  };

  // Días de la cuadrícula del calendario
  const firstDayOfMonth = (new Date(calendarMonth.year, calendarMonth.month, 1).getDay() + 6) % 7; // Lunes = 0
  const daysInMonth = new Date(calendarMonth.year, calendarMonth.month + 1, 0).getDate();
  const calendarCells = useMemo(() => {
    const totalSlots = Math.ceil((firstDayOfMonth + daysInMonth) / 7) * 7;
    return Array.from({ length: totalSlots }, (_, i) => {
      const day = i - firstDayOfMonth + 1;
      return day >= 1 && day <= daysInMonth ? day : null;
    });
  }, [firstDayOfMonth, daysInMonth]);

  const getEventsForDay = (day) => {
    if (!day || !monthEventsMap[day]) return [];
    return monthEventsMap[day].filter((ev) => activeEventTypes[ev.type]);
  };

  const selectedDayEvents = getEventsForDay(selectedDay);
  const totalMonthEventsCount = Object.keys(monthEventsMap).reduce(
    (acc, day) => acc + getEventsForDay(Number(day)).length,
    0
  );

  const isTodayDate = (day) => {
    return (
      calendarMonth.year === today.getFullYear() &&
      calendarMonth.month === today.getMonth() &&
      day === today.getDate()
    );
  };

  return (
    <DashboardContainer>
      <DashboardHeader>
        <HeaderTitleGroup>
          <HeaderTitle>Panel de RRHH</HeaderTitle>
          <HeaderDate>
            {DAY_NAMES[today.getDay()]}, {today.getDate()} de {MONTH_NAMES[today.getMonth()]} de{" "}
            {today.getFullYear()}
          </HeaderDate>
        </HeaderTitleGroup>
      </DashboardHeader>

      {/* KPIS PRINCIPALES */}
      <KpisGrid>
        <KpiCard
          $variant="green"
          onClick={() => navigate("/empleados")}
          title="Ver empleados activos"
        >
          <KpiIconWrapper className="kpi-ic">
            <Users size={20} />
          </KpiIconWrapper>
          <KpiLabel>Personal activo</KpiLabel>
          <KpiValue>{activeEmployees.length}</KpiValue>
          <KpiHint>Colaboradores registrados</KpiHint>
        </KpiCard>

        <KpiCard
          $variant="violet"
          onClick={() => {
            const el = document.getElementById("sec-cumpleanios");
            el?.scrollIntoView({ behavior: "smooth" });
          }}
          title="Ver cumpleaños del mes"
        >
          <KpiIconWrapper className="kpi-ic">
            <Cake size={20} />
          </KpiIconWrapper>
          <KpiLabel>Cumpleaños del mes</KpiLabel>
          <KpiValue>{birthdaysData.mes.length}</KpiValue>
          <KpiHint>
            {birthdaysData.hoy.length
              ? `${birthdaysData.hoy.length} celebrando hoy`
              : "Ninguno hoy"}
          </KpiHint>
        </KpiCard>

        <KpiCard
          $variant="red"
          onClick={() => {
            const el = document.getElementById("sec-contratos-vencer");
            el?.scrollIntoView({ behavior: "smooth" });
          }}
          title="Ver contratos por vencer"
        >
          <KpiIconWrapper className="kpi-ic">
            <FileText size={20} />
          </KpiIconWrapper>
          <KpiLabel>Contratos por vencer</KpiLabel>
          <KpiValue>{contractsData.toExpireCount}</KpiValue>
          <KpiHint>
            {contractsData.expiredCount > 0
              ? `${contractsData.expiredCount} ya vencido${contractsData.expiredCount > 1 ? "s" : ""}`
              : `En los próximos ${contractHorizon} días`}
          </KpiHint>
        </KpiCard>

        <KpiCard
          $variant="blue"
          onClick={() => {
            const el = document.getElementById("sec-hitos-antiguedad");
            el?.scrollIntoView({ behavior: "smooth" });
          }}
          title="Ver hitos de antigüedad"
        >
          <KpiIconWrapper className="kpi-ic">
            <Award size={20} />
          </KpiIconWrapper>
          <KpiLabel>Hitos de antigüedad</KpiLabel>
          <KpiValue>{seniorityData.totalUpcoming}</KpiValue>
          <KpiHint>En los próximos 60 días</KpiHint>
        </KpiCard>
      </KpisGrid>

      {/* FILA 1: CALENDARIO INTERACTIVO + CUMPLEAÑOS */}
      <DashboardGrid>
        {/* CALENDARIO (SPAN 8) */}
        <Card className="span-8">
          <CardHeader>
            <CardTitleGroup>
              <CardTitle>
                {capitalizeWords(MONTH_NAMES[calendarMonth.month])} {calendarMonth.year}
              </CardTitle>
              <CardSubtitle>
                {totalMonthEventsCount}{" "}
                {totalMonthEventsCount === 1 ? "evento" : "eventos"} en el mes
              </CardSubtitle>
            </CardTitleGroup>

            <CalendarControls>
              <IconButton
                type="button"
                onClick={() => handleMonthStep(-1)}
                aria-label="Mes anterior"
              >
                <ChevronLeft size={16} />
              </IconButton>
              <IconButton
                type="button"
                className="text-btn"
                onClick={handleResetToToday}
              >
                Hoy
              </IconButton>
              <IconButton
                type="button"
                onClick={() => handleMonthStep(1)}
                aria-label="Mes siguiente"
              >
                <ChevronRight size={16} />
              </IconButton>
            </CalendarControls>
          </CardHeader>

          {/* Filtros de eventos de leyenda */}
          <CalendarLegend>
            {Object.entries(EVENT_LEGEND).map(([typeKey, legendInfo]) => {
              const active = activeEventTypes[typeKey];
              return (
                <LegendFilter
                  key={typeKey}
                  type="button"
                  $active={active}
                  onClick={() =>
                    setActiveEventTypes((prev) => ({
                      ...prev,
                      [typeKey]: !prev[typeKey],
                    }))
                  }
                >
                  <LegendDot $color={active ? legendInfo.color : "#cbd5e1"} />
                  <span>{legendInfo.label}</span>
                </LegendFilter>
              );
            })}
          </CalendarLegend>

          <CalendarWrapper>
            {/* Grilla mensual */}
            <div>
              <CalendarHead>
                {SHORT_DAYS.map((d, idx) => (
                  <span key={idx}>{d}</span>
                ))}
              </CalendarHead>
              <CalendarGrid>
                {calendarCells.map((dayNum, idx) => {
                  if (dayNum === null) {
                    return <CalendarCell key={idx} className="empty" disabled />;
                  }
                  const dayEvents = getEventsForDay(dayNum);
                  const isSelected = selectedDay === dayNum;
                  const isToday = isTodayDate(dayNum);

                  return (
                    <CalendarCell
                      key={idx}
                      type="button"
                      $selected={isSelected}
                      $isToday={isToday}
                      onClick={() => setSelectedDay(dayNum)}
                    >
                      <DayNumber $isToday={isToday}>{dayNum}</DayNumber>
                      <EventDotsGroup>
                        {dayEvents.map((ev, dotIdx) => (
                          <EventDot
                            key={dotIdx}
                            $color={EVENT_LEGEND[ev.type]?.color || "#2f573c"}
                          />
                        ))}
                      </EventDotsGroup>
                    </CalendarCell>
                  );
                })}
              </CalendarGrid>
            </div>

            {/* Panel de detalle del día seleccionado */}
            <DayDetailSection>
              <DayDetailTitle>
                {formatLongDateDisplay(
                  new Date(calendarMonth.year, calendarMonth.month, selectedDay)
                )}
              </DayDetailTitle>

              {selectedDayEvents.length === 0 ? (
                <EmptyState>Sin eventos este día.</EmptyState>
              ) : (
                <ItemsList className="scrollable">
                  {selectedDayEvents.map((item, idx) => {
                    const initials = getInitials(item.emp.firstNames, item.emp.lastNames);
                    const colors = getAvatarColor(item.emp.firstNames);
                    const legend = EVENT_LEGEND[item.type];
                    const activeContract = getActiveContract(item.emp);
                    const branchName =
                      activeContract?.branch?.name || item.emp?.branch?.name || "Sin sucursal";

                    return (
                      <ItemRow
                        key={idx}
                        onClick={() => navigate(`/empleados/${item.emp.id}`)}
                        title="Ver detalle del empleado"
                      >
                        <Avatar $bg={colors.bg} $fg={colors.fg}>
                          {initials}
                        </Avatar>
                        <ItemMain>
                          <ItemName>
                            {formatNameTitle(`${item.emp.lastNames} ${item.emp.firstNames}`)}
                          </ItemName>
                          <ItemMeta>
                            {item.type === "cumple"
                              ? `Sucursal: ${capitalizeWords(branchName)}`
                              : item.text}
                          </ItemMeta>
                        </ItemMain>
                        <ItemRight>
                          <ChipBadge $variant={legend.tono}>{legend.label}</ChipBadge>
                        </ItemRight>
                      </ItemRow>
                    );
                  })}
                </ItemsList>
              )}
            </DayDetailSection>
          </CalendarWrapper>
        </Card>

        {/* CUMPLEAÑOS (SPAN 4) */}
        <Card id="sec-cumpleanios" className="span-4">
          <CardHeader>
            <CardTitleGroup>
              <CardTitle>Cumpleaños</CardTitle>
              <CardSubtitle>
                {capitalizeWords(MONTH_NAMES[today.getMonth()])}: {birthdaysData.mes.length}{" "}
                {birthdaysData.mes.length === 1 ? "persona" : "personas"}
              </CardSubtitle>
            </CardTitleGroup>

            <SegmentGroup>
              <SegmentButton
                type="button"
                $active={birthdayFilter === "hoy"}
                onClick={() => setBirthdayFilter("hoy")}
              >
                Hoy
                <SegmentCount $active={birthdayFilter === "hoy"}>
                  {birthdaysData.hoy.length}
                </SegmentCount>
              </SegmentButton>
              <SegmentButton
                type="button"
                $active={birthdayFilter === "semana"}
                onClick={() => setBirthdayFilter("semana")}
              >
                7 días
                <SegmentCount $active={birthdayFilter === "semana"}>
                  {birthdaysData.semana.length}
                </SegmentCount>
              </SegmentButton>
              <SegmentButton
                type="button"
                $active={birthdayFilter === "mes"}
                onClick={() => setBirthdayFilter("mes")}
              >
                Mes
                <SegmentCount $active={birthdayFilter === "mes"}>
                  {birthdaysData.mes.length}
                </SegmentCount>
              </SegmentButton>
            </SegmentGroup>
          </CardHeader>

          {birthdaysData[birthdayFilter].length === 0 ? (
            <EmptyState>
              {birthdayFilter === "hoy"
                ? "Nadie cumple años hoy."
                : birthdayFilter === "semana"
                ? "Nadie cumple años en los próximos 7 días."
                : "Nadie cumple años este mes."}
            </EmptyState>
          ) : (
            <ItemsList className="scrollable">
              {birthdaysData[birthdayFilter].map((item) => {
                const initials = getInitials(item.emp.firstNames, item.emp.lastNames);
                const colors = getAvatarColor(item.emp.firstNames);
                const isPassed = item.diff < 0;
                const activeContract = getActiveContract(item.emp);
                const branchName =
                  activeContract?.branch?.name || item.emp?.branch?.name || "Sin sucursal";

                return (
                  <ItemRow
                    key={item.emp.id}
                    $dim={isPassed}
                    onClick={() => navigate(`/empleados/${item.emp.id}`)}
                    title="Ver detalle del empleado"
                  >
                    <Avatar $bg={colors.bg} $fg={colors.fg}>
                      {initials}
                    </Avatar>
                    <ItemMain>
                      <ItemName>
                        {formatNameTitle(`${item.emp.lastNames} ${item.emp.firstNames}`)}
                      </ItemName>
                      <ItemMeta>Sucursal: {capitalizeWords(branchName)}</ItemMeta>
                    </ItemMain>
                    <ItemRight>
                      <ItemDate>{formatShortDate(item.date)}</ItemDate>
                      <ChipBadge
                        $variant={
                          item.diff === 0
                            ? "violet-soft"
                            : isPassed
                            ? "gray"
                            : "violet-soft"
                        }
                      >
                        {isPassed ? "Ya pasó" : getRelativeDaysText(item.diff)}
                      </ChipBadge>
                    </ItemRight>
                  </ItemRow>
                );
              })}
            </ItemsList>
          )}
        </Card>
      </DashboardGrid>

      {/* FILA 2: CONTRATOS POR VENCER + HITOS DE ANTIGÜEDAD */}
      <DashboardGrid>
        {/* CONTRATOS POR VENCER (SPAN 6) */}
        <Card id="sec-contratos-vencer" className="span-6">
          <CardHeader>
            <CardTitleGroup>
              <CardTitle>Contratos por vencer</CardTitle>
              <CardSubtitle>Contratos a plazo fijo del personal activo</CardSubtitle>
            </CardTitleGroup>

            <SegmentGroup>
              <SegmentButton
                type="button"
                $active={contractHorizon === 7}
                onClick={() => setContractHorizon(7)}
              >
                7 días
              </SegmentButton>
              <SegmentButton
                type="button"
                $active={contractHorizon === 30}
                onClick={() => setContractHorizon(30)}
              >
                30 días
              </SegmentButton>
              <SegmentButton
                type="button"
                $active={contractHorizon === 60}
                onClick={() => setContractHorizon(60)}
              >
                60 días
              </SegmentButton>
            </SegmentGroup>
          </CardHeader>

          {/* Mini cards indicadores: Vencidos y Por Vencer */}
          <MiniStatsGrid>
            <MiniStatItem $bg="#fee2e2" $fg="#b91c1c" $border="#fecaca">
              <span>Vencidos</span>
              <b>{contractsData.expiredCount}</b>
            </MiniStatItem>
            <MiniStatItem $bg="#f1f5f9" $fg="#334155" $border="#e2e8f0">
              <span>Por vencer ({contractHorizon} días)</span>
              <b>{contractsData.toExpireCount}</b>
            </MiniStatItem>
          </MiniStatsGrid>

          {contractsData.filtered.length === 0 ? (
            <EmptyState>No hay contratos que venzan en este plazo.</EmptyState>
          ) : (
            <ItemsList className="scrollable">
              {contractsData.filtered.map(({ emp, contract, endDate, diff }) => {
                const isExpired = diff < 0;
                const jobTitle =
                  contract?.jobTitle?.name || contract?.contractJobTitle?.name || "Sin cargo";
                const initials = getInitials(emp.firstNames, emp.lastNames);
                const colors = getAvatarColor(emp.firstNames);
                const contractTypeFormatted = getContractTypeLabel(contract?.contractType);

                return (
                  <ItemRow
                    key={emp.id}
                    $dim={isExpired}
                    onClick={() => navigate(`/empleados/${emp.id}`)}
                    title="Ver detalle del empleado"
                  >
                    <Avatar $bg={colors.bg} $fg={colors.fg}>
                      {initials}
                    </Avatar>
                    <ItemMain>
                      <ItemName>
                        {formatNameTitle(`${emp.lastNames} ${emp.firstNames}`)}
                      </ItemName>
                      <ItemMeta>
                        {capitalizeWords(jobTitle)} · {contractTypeFormatted}
                      </ItemMeta>
                    </ItemMain>
                    <ItemRight>
                      <ItemDate>{formatShortDate(endDate)}</ItemDate>
                      <ChipBadge
                        $variant={
                          isExpired
                            ? "red-solid"
                            : diff <= 7
                            ? "red"
                            : "gray"
                        }
                      >
                        {isExpired
                          ? `Venció ${getRelativeDaysText(diff)}`
                          : getRelativeDaysText(diff)}
                      </ChipBadge>
                    </ItemRight>
                  </ItemRow>
                );
              })}
            </ItemsList>
          )}
        </Card>

        {/* HITOS DE ANTIGÜEDAD (SPAN 6) */}
        <Card id="sec-hitos-antiguedad" className="span-6">
          <CardHeader>
            <CardTitleGroup>
              <CardTitle>Hitos de antigüedad</CardTitle>
              <CardSubtitle>
                Cumplen años de servicio de aquí a 90 días y los últimos 30 días
              </CardSubtitle>
            </CardTitleGroup>

            <SegmentGroup>
              <SegmentButton
                type="button"
                $active={seniorityFilter === "todos"}
                onClick={() => setSeniorityFilter("todos")}
              >
                Todos
              </SegmentButton>
              <SegmentButton
                type="button"
                $active={seniorityFilter === 2}
                onClick={() => setSeniorityFilter(2)}
              >
                2 años
                <SegmentCount $active={seniorityFilter === 2}>
                  {seniorityData.count2}
                </SegmentCount>
              </SegmentButton>
              <SegmentButton
                type="button"
                $active={seniorityFilter === 5}
                onClick={() => setSeniorityFilter(5)}
              >
                5 años
                <SegmentCount $active={seniorityFilter === 5}>
                  {seniorityData.count5}
                </SegmentCount>
              </SegmentButton>
            </SegmentGroup>
          </CardHeader>

          {seniorityData.filtered.length === 0 ? (
            <EmptyState>Nadie cumple ese hito en este periodo.</EmptyState>
          ) : (
            <ItemsList className="scrollable">
              {seniorityData.filtered.map(({ emp, years, hireDate, anniversary, diff }) => {
                const isPassed = diff < 0;
                const bonusChange =
                  years === 2 ? "0% → 5%" : years === 5 ? "5% → 11%" : "";

                return (
                  <ItemRow
                    key={`${emp.id}-${years}`}
                    $dim={isPassed}
                    onClick={() => navigate(`/empleados/${emp.id}`)}
                    title="Ver detalle del empleado"
                  >
                    <HitoBadge $years={years}>
                      <b>{years}</b>
                      <i>años</i>
                    </HitoBadge>
                    <ItemMain>
                      <ItemName>
                        {formatNameTitle(`${emp.lastNames} ${emp.firstNames}`)}
                      </ItemName>
                      <ItemMeta>
                        Ingresó el {formatShortDate(hireDate)} {hireDate.getFullYear()} · bono{" "}
                        {bonusChange}
                      </ItemMeta>
                    </ItemMain>
                    <ItemRight>
                      <ItemDate>{formatShortDate(anniversary)}</ItemDate>
                      <ChipBadge
                        $variant={
                          isPassed
                            ? "gray"
                            : diff <= 30
                            ? "blue"
                            : "blue-soft"
                        }
                      >
                        {isPassed
                          ? `Cumplió ${getRelativeDaysText(diff)}`
                          : getRelativeDaysText(diff)}
                      </ChipBadge>
                    </ItemRight>
                  </ItemRow>
                );
              })}
            </ItemsList>
          )}
        </Card>
      </DashboardGrid>
    </DashboardContainer>
  );
};

export default Dashboard;

