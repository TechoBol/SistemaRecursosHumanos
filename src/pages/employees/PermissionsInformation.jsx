import { useMemo, useState } from "react";
import Swal from "sweetalert2";
import {
  CalendarX2,
  CircleAlert,
  ClipboardCheck,
  Clock3,
  MoreVertical,
  Pencil,
  Plus,
  Trash2,
} from "lucide-react";
import {
  ActionButton,
  SectionTitle,
  TabContentCard,
} from "../../components/ui/Employees.styles";
import {
  EmptyState,
  EmptyStateAction,
  SummaryCard,
  SummaryContent,
  SummaryGrid,
  SummaryIcon,
  SummaryLabel,
  SummaryValue,
  TabDescription,
  TabHeader,
  IncidentItem,
  IncidentDateBlock,
  IncidentDay,
  IncidentMonth,
  IncidentIndicator,
  IncidentContent,
  IncidentHeader,
  IncidentBadge,
  IncidentReason,
  IncidentMeta,
  IncidentValueBlock,
  IncidentDiscount,
  IncidentActions,
  IncidentActionButton,
  YearFilterSelect,
  HistoryHeaderNew,
  GroupSummaryText,
  IncidentListContainer,
  FilterLabel,
  HistoryEmptyState,
  HistoryMonthHeader,
  DesktopOnly,
  MobileOnly,
  IncidentMenu,
  IncidentMenuButton,
  IncidentMenuList,
  IncidentMenuAction,
  MobileHeaderRow,
  MobileHeaderLeft,
} from "../../components/ui/employees/EmployeeTabs.styles";
import { useLoginStore } from "../../components/store/loginStore";
import PermissionAbsenceModal from "../../components/modals/PermissionAbsenceModal";
import { useAttendanceIncidents } from "../../hooks/useAttendanceIncidents";

const createId = () => {
  if (
    typeof crypto !== "undefined" &&
    typeof crypto.randomUUID === "function"
  ) {
    return crypto.randomUUID();
  }
  return `${Date.now()}-${Math.random()}`;
};

const formatCurrency = (amount = 0) => {
  return new Intl.NumberFormat("es-BO", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount);
};

const parseRecordDate = (dateStr) => {
  if (!dateStr) return { day: "--", month: "---", year: "----" };
  const parts = dateStr.split("-");
  if (parts.length !== 3) return { day: "--", month: "---", year: "----" };
  const [y, m, d] = parts;
  const dateObj = new Date(Number(y), Number(m) - 1, Number(d));
  const day = String(dateObj.getDate()).padStart(2, "0");
  const month = dateObj.toLocaleString("es-BO", { month: "short" }).toUpperCase().replace(".", "");
  return { day, month, year: y };
};

const PermissionsInformation = ({ employee }) => {
  const { fullName } = useLoginStore();
  const activeContract = employee?.contracts?.find((c) => c.isActive);
  const baseSalary = activeContract ? Number(activeContract.baseSalary) : null;
  const { incidents: records = [], addIncident, updateIncident, deleteIncident } = useAttendanceIncidents(employee?.id);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState("create");
  const [selectedRecord, setSelectedRecord] = useState(null);
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());

  const currentYear = new Date().getFullYear();
  const currentMonthNum = new Date().getMonth() + 1; // 1-12

  // Filtramos los del mes actual
  const currentMonthRecords = useMemo(() => {
    return records.filter((r) => {
      if (!r.date) return false;
      const { year } = parseRecordDate(r.date);
      const d = new Date(r.date + "T00:00:00");
      return Number(year) === currentYear && (d.getMonth() + 1) === currentMonthNum;
    });
  }, [records, currentYear, currentMonthNum]);

  // Años disponibles para filtrar
  const availableYears = useMemo(() => {
    const years = new Set([new Date().getFullYear()]);
    records.forEach((r) => {
      if (r.date) {
        const { year } = parseRecordDate(r.date);
        const yNum = Number(year);
        if (!isNaN(yNum)) years.add(yNum);
      }
    });
    return Array.from(years).sort((a, b) => b - a);
  }, [records]);

  // Agrupar registros anteriores por mes para el año seleccionado
  const previousRecordsGroupedByMonth = useMemo(() => {
    const filtered = records.filter((r) => {
      if (!r.date) return false;
      const { year } = parseRecordDate(r.date);
      const yearMatches = Number(year) === selectedYear;
      const d = new Date(r.date + "T00:00:00");
      const isCurrentMonth = Number(year) === currentYear && (d.getMonth() + 1) === currentMonthNum;
      return yearMatches && !isCurrentMonth;
    });

    const groups = {};
    filtered.forEach((r) => {
      const d = new Date(r.date + "T00:00:00");
      const monthNum = d.getMonth() + 1;
      if (!groups[monthNum]) {
        groups[monthNum] = {
          monthNum,
          label: d.toLocaleString("es-BO", { month: "long" }),
          records: [],
          totalDiscount: 0,
        };
      }
      groups[monthNum].records.push(r);
      groups[monthNum].totalDiscount += r.discount ?? 0;
    });

    return Object.values(groups).sort((a, b) => b.monthNum - a.monthNum);
  }, [records, selectedYear, currentYear, currentMonthNum]);

  // Resumen del año seleccionado
  const yearSummary = useMemo(() => {
    const yearRecords = records.filter((r) => {
      if (!r.date) return false;
      const { year } = parseRecordDate(r.date);
      return Number(year) === selectedYear;
    });
    const totalDiscount = yearRecords.reduce((sum, r) => sum + (r.discount ?? 0), 0);
    return {
      count: yearRecords.length,
      totalDiscount,
    };
  }, [records, selectedYear]);

  const summary = useMemo(() => {
    return currentMonthRecords.reduce(
      (result, record) => {
        if (record.type === "permission") {
          result.permissions += 1;
        }
        if (record.type === "absence") {
          result.absences += 1;
        }
        if (record.type === "lateness") {
          result.lateness += 1;
        }
        result.totalDiscount += record.discount ?? 0;
        return result;
      },
      {
        permissions: 0,
        absences: 0,
        lateness: 0,
        totalDiscount: 0,
      },
    );
  }, [currentMonthRecords]);

  const metrics = useMemo(
    () => [
      {
        id: "permissions",
        label: "Permisos",
        value: String(summary.permissions),
        variant: "success",
        icon: ClipboardCheck,
      },
      {
        id: "lateness",
        label: "Atrasos",
        value: String(summary.lateness),
        variant: "primary",
        icon: Clock3,
      },
      {
        id: "absences",
        label: "Faltas",
        value: String(summary.absences),
        variant: "warning",
        icon: CalendarX2,
      },
      {
        id: "discount",
        label: "Total descuento",
        value: `Bs ${formatCurrency(
          summary.totalDiscount,
        )}`,
        variant: "danger",
        icon: CircleAlert,
      },
    ],
    [summary],
  );

  const handleOpenCreateModal = () => {
    setSelectedRecord(null);
    setModalMode("create");
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (record) => {
    setSelectedRecord(record);
    setModalMode("edit");
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setSelectedRecord(null);
    setIsModalOpen(false);
  };

  const handleSaveRecord = async (recordData) => {
    if (modalMode === "edit" && selectedRecord) {
      await updateIncident(selectedRecord.id, recordData);
    } else {
      await addIncident({
        ...recordData,
        registeredBy: fullName || "Usuario",
      });
    }
    handleCloseModal();
  };

  const handleDeleteRecord = (id) => {
    Swal.fire({
      title: "¿Estás seguro?",
      text: "¿Deseas eliminar este registro de asistencia?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#2F573C",
      cancelButtonColor: "#D32F2F",
      confirmButtonText: "Sí, eliminar",
      cancelButtonText: "Cancelar"
    }).then(async (result) => {
      if (result.isConfirmed) {
        await deleteIncident(id);
      }
    });
  };

  const closeMenu = (event) => {
    const details = event.target.closest("details");
    if (details) {
      details.removeAttribute("open");
    }
  };

  const renderMobileMenu = (record) => (
    <IncidentMenu>
      <IncidentMenuButton title="Opciones">
        <MoreVertical size={20} />
      </IncidentMenuButton>
      <IncidentMenuList>
        <IncidentMenuAction
          type="button"
          onClick={(e) => {
            closeMenu(e);
            handleOpenEditModal(record);
          }}
        >
          <Pencil size={14} />
          Editar
        </IncidentMenuAction>
        <IncidentMenuAction
          type="button"
          $variant="danger"
          onClick={(e) => {
            closeMenu(e);
            handleDeleteRecord(record.id);
          }}
        >
          <Trash2 size={14} />
          Eliminar
        </IncidentMenuAction>
      </IncidentMenuList>
    </IncidentMenu>
  );

  /* card de registro */
  const renderIncidentItem = (record) => {
    const { day, month } = parseRecordDate(record.date);
    const badgeText = record.type === "permission" ? "Permiso" : record.type === "absence" ? "Falta" : "Atraso";

    return (
      <IncidentItem key={record.id}>
        {/* Desktop View */}
        <DesktopOnly>
          <IncidentDateBlock>
            <IncidentDay>{day}</IncidentDay>
            <IncidentMonth>{month}</IncidentMonth>
          </IncidentDateBlock>
          <IncidentIndicator $type={record.type} />
          <IncidentContent>
            <IncidentHeader>
              <IncidentBadge $type={record.type}>{badgeText}</IncidentBadge>
              <IncidentReason>{record.reason}</IncidentReason>
            </IncidentHeader>
            <IncidentMeta>Registrado por {record.registeredBy || "Usuario"}</IncidentMeta>
          </IncidentContent>
          <IncidentValueBlock>
            <IncidentDiscount>
              {record.discount > 0 ? `-Bs ${formatCurrency(record.discount)}` : "Bs 0.00"}
            </IncidentDiscount>
          </IncidentValueBlock>
          <IncidentActions>
            <IncidentActionButton
              type="button"
              title="Editar"
              onClick={() => handleOpenEditModal(record)}
            >
              <Pencil size={16} />
            </IncidentActionButton>
            <IncidentActionButton
              type="button"
              $variant="danger"
              title="Eliminar"
              onClick={() => handleDeleteRecord(record.id)}
            >
              <Trash2 size={16} />
            </IncidentActionButton>
          </IncidentActions>
        </DesktopOnly>

        {/* Mobile View */}
        <MobileOnly>
          <MobileHeaderRow>
            <MobileHeaderLeft>
              <IncidentDateBlock>
                <IncidentDay>{day}</IncidentDay>
                <IncidentMonth>{month}</IncidentMonth>
              </IncidentDateBlock>
              <IncidentIndicator $type={record.type} />
              <IncidentHeader>
                <IncidentBadge $type={record.type}>{badgeText}</IncidentBadge>
                <IncidentDiscount>
                  {record.discount > 0 ? `-Bs ${formatCurrency(record.discount)}` : "Bs 0.00"}
                </IncidentDiscount>
              </IncidentHeader>
            </MobileHeaderLeft>
            {renderMobileMenu(record)}
          </MobileHeaderRow>
          <IncidentReason>{record.reason}</IncidentReason>
          <IncidentMeta>Registrado por {record.registeredBy || "Usuario"}</IncidentMeta>
        </MobileOnly>
      </IncidentItem>
    );
  };

  return (
    <>
      <TabContentCard>
        <TabHeader>
          <div>
            <SectionTitle>Registros del mes actual</SectionTitle>
            <TabDescription>Permisos, atrasos y faltas del mes actual</TabDescription>
          </div>

          <ActionButton type="button" onClick={handleOpenCreateModal}>
            <Plus size={17} />
            Registrar
          </ActionButton>
        </TabHeader>

        <SummaryGrid $columns={4}>
          {metrics.map((metric) => {
            const Icon = metric.icon;
            return (
              <SummaryCard
                key={metric.id}
                $variant={metric.variant}
              >
                <SummaryContent>
                  <SummaryLabel>{metric.label}</SummaryLabel>
                  <SummaryValue>{metric.value}</SummaryValue>
                </SummaryContent>

                <SummaryIcon>
                  <Icon size={48} strokeWidth={1.7} />
                </SummaryIcon>
              </SummaryCard>
            );
          })}
        </SummaryGrid>

        <IncidentListContainer>
          {currentMonthRecords.length === 0 ? (
            <EmptyState>
              <CalendarX2 size={48} strokeWidth={1.6} />
              <strong>No hay permisos o faltas registrados este mes</strong>
              <EmptyStateAction type="button" onClick={handleOpenCreateModal}>
                + Registrar el primero
              </EmptyStateAction>
            </EmptyState>
          ) : (
            currentMonthRecords.map(renderIncidentItem)
          )}
        </IncidentListContainer>
      </TabContentCard>

      <TabContentCard>
        <TabHeader>
          <div>
            <SectionTitle>Registros anteriores</SectionTitle>
          </div>
          <div>
            <FilterLabel htmlFor="year-select">Gestión</FilterLabel>
            <YearFilterSelect
              id="year-select"
              value={selectedYear}
              onChange={(e) => setSelectedYear(Number(e.target.value))}
            >
              {availableYears.map((y) => (
                <option key={y} value={y}>{y}</option>
              ))}
            </YearFilterSelect>
          </div>
        </TabHeader>

        {previousRecordsGroupedByMonth.length > 0 && (
          <HistoryHeaderNew>
            <GroupSummaryText>
              <strong>{yearSummary.count}</strong> registros en {selectedYear}
            </GroupSummaryText>
            <GroupSummaryText>
              Descuento acumulado <strong>-Bs {formatCurrency(yearSummary.totalDiscount)}</strong>
            </GroupSummaryText>
          </HistoryHeaderNew>
        )}

        <div>
          {previousRecordsGroupedByMonth.length === 0 ? (
            <HistoryEmptyState>
              No se encontraron registros anteriores para la gestión {selectedYear}
            </HistoryEmptyState>
          ) : (
            previousRecordsGroupedByMonth.map((group) => (
              <div key={group.monthNum}>
                <HistoryMonthHeader>{group.label}</HistoryMonthHeader>
                <div>{group.records.map(renderIncidentItem)}</div>
              </div>
            ))
          )}
        </div>
      </TabContentCard>

      <PermissionAbsenceModal
        isOpen={isModalOpen}
        mode={modalMode}
        record={selectedRecord}
        baseSalary={baseSalary}
        onClose={handleCloseModal}
        onSubmit={handleSaveRecord}
      />
    </>
  );
};

export default PermissionsInformation;;