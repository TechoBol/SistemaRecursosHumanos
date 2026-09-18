import { useMemo, useState } from "react";
import Swal from "sweetalert2";
import {
  CalendarDays,
  DollarSign,
  MoreVertical,
  Pencil,
  Plus,
  Sun,
  Trash2,
  FileText,
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
import VacationModal from "../../components/modals/VacationModal";
import { useVacations } from "../../hooks/useVacations";

const formatCurrency = (amount = 0) => {
  return new Intl.NumberFormat("es-BO", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount);
};

const formatDateDisplay = (dateValue) => {
  if (!dateValue) return "";
  const parts = dateValue.split("-");
  if (parts.length !== 3) return dateValue;
  const [year, month, day] = parts;
  return `${day}/${month}/${year}`;
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

const VacationsInformation = ({ employee }) => {
  const { fullName } = useLoginStore();
  const { vacations: records = [], addVacation, updateVacation, deleteVacation } = useVacations(employee?.id);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState("create");
  const [selectedRecord, setSelectedRecord] = useState(null);
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const currentYear = new Date().getFullYear();
  const currentMonthNum = new Date().getMonth() + 1; // 1-12

  // Filtrar las vacaciones del mes actual
  const currentMonthRecords = useMemo(() => {
    return records.filter((r) => {
      if (!r.startDate) return false;
      const { year } = parseRecordDate(r.startDate);
      const d = new Date(r.startDate + "T00:00:00");
      return Number(year) === currentYear && (d.getMonth() + 1) === currentMonthNum;
    });
  }, [records, currentYear, currentMonthNum]);

  // Años disponibles para filtrar
  const availableYears = useMemo(() => {
    const years = new Set([new Date().getFullYear()]);
    records.forEach((r) => {
      if (r.startDate) {
        const { year } = parseRecordDate(r.startDate);
        const yNum = Number(year);
        if (!isNaN(yNum)) years.add(yNum);
      }
    });
    return Array.from(years).sort((a, b) => b - a);
  }, [records]);

  // Agrupar registros anteriores por mes para el año seleccionado
  const previousRecordsGroupedByMonth = useMemo(() => {
    const filtered = records.filter((r) => {
      if (!r.startDate) return false;
      const { year } = parseRecordDate(r.startDate);
      const yearMatches = Number(year) === selectedYear;
      const d = new Date(r.startDate + "T00:00:00");
      const isCurrentMonth = Number(year) === currentYear && (d.getMonth() + 1) === currentMonthNum;
      return yearMatches && !isCurrentMonth;
    });

    const groups = {};
    filtered.forEach((r) => {
      const d = new Date(r.startDate + "T00:00:00");
      const monthNum = d.getMonth() + 1;
      if (!groups[monthNum]) {
        groups[monthNum] = {
          monthNum,
          label: d.toLocaleString("es-BO", { month: "long" }),
          records: [],
          totalDays: 0,
        };
      }
      groups[monthNum].records.push(r);
      groups[monthNum].totalDays += r.days ?? 0;
    });

    return Object.values(groups).sort((a, b) => b.monthNum - a.monthNum);
  }, [records, selectedYear, currentYear, currentMonthNum]);

  // Resumen del año seleccionado
  const yearSummary = useMemo(() => {
    const yearRecords = records.filter((r) => {
      if (!r.startDate) return false;
      const { year } = parseRecordDate(r.startDate);
      return Number(year) === selectedYear;
    });
    const totalDays = yearRecords.reduce((sum, r) => sum + (r.days ?? 0), 0);
    return {
      count: yearRecords.length,
      totalDays,
    };
  }, [records, selectedYear]);

  // Resumen del mes actual
  const currentMonthSummary = useMemo(() => {
    return currentMonthRecords.reduce(
      (result, record) => {
        result.count += 1;
        result.totalDays += record.days ?? 0;
        if (record.type === "money") {
          result.totalMoney += record.amount ?? 0;
        }
        return result;
      },
      {
        count: 0,
        totalDays: 0,
        totalMoney: 0,
      }
    );
  }, [currentMonthRecords]);

  const metrics = useMemo(
    () => [
      {
        id: "days",
        label: "Días disfrutados",
        value: `${currentMonthSummary.totalDays} ${currentMonthSummary.totalDays === 1 ? "día" : "días"}`,
        variant: "primary",
        icon: CalendarDays,
      },
      {
        id: "money",
        label: "Compensación en efectivo",
        value: `Bs ${formatCurrency(currentMonthSummary.totalMoney)}`,
        variant: "success",
        icon: DollarSign,
      },
      {
        id: "count",
        label: "Total registros del mes",
        value: String(currentMonthSummary.count),
        variant: "warning",
        icon: FileText,
      },
    ],
    [currentMonthSummary]
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
      await updateVacation(selectedRecord.id, recordData);
    } else {
      await addVacation({
        ...recordData,
        registeredBy: fullName || "Usuario",
      });
    }
    handleCloseModal();
  };

  const handleDeleteRecord = (id) => {
    Swal.fire({
      title: "¿Estás seguro?",
      text: "¿Deseas eliminar este registro de vacación?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#2F573C",
      cancelButtonColor: "#D32F2F",
      confirmButtonText: "Sí, eliminar",
      cancelButtonText: "Cancelar",
    }).then(async (result) => {
      if (result.isConfirmed) {
        await deleteVacation(id);
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

  const renderVacationItem = (record) => {
    const { day, month } = parseRecordDate(record.startDate);
    const isMoney = record.type === "money";
    const typeLabel = isMoney ? "Efectivo" : "Día libre";
    const badgeType = isMoney ? "salary" : "lateness"; // salary styling (green/primary) or lateness styling (blue)

    return (
      <IncidentItem key={record.id}>
        {/* Desktop View */}
        <DesktopOnly>
          <IncidentDateBlock>
            <IncidentDay>{day}</IncidentDay>
            <IncidentMonth>{month}</IncidentMonth>
          </IncidentDateBlock>
          <IncidentIndicator $type={badgeType} />
          <IncidentContent>
            <IncidentHeader>
              <IncidentBadge $type={badgeType}>{typeLabel}</IncidentBadge>
              <IncidentReason>{record.notes || (isMoney ? "Vacacion en efectivo" : "Vación tomada como día libre")}</IncidentReason>
            </IncidentHeader>
            <IncidentMeta>Registrado por {record.registeredBy || "Usuario"}</IncidentMeta>
          </IncidentContent>
          <IncidentValueBlock>
            <IncidentDiscount>
              {isMoney ? `Bs ${formatCurrency(record.amount)}` : `${record.days} ${record.days === 1 ? "día" : "días"}`}
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
              <IncidentIndicator $type={badgeType} />
              <IncidentHeader>
                <IncidentBadge $type={badgeType}>{typeLabel}</IncidentBadge>
                <IncidentDiscount>
                  {isMoney ? `Bs ${formatCurrency(record.amount)}` : `${record.days} ${record.days === 1 ? "día" : "días"}`}
                </IncidentDiscount>
              </IncidentHeader>
            </MobileHeaderLeft>
            {renderMobileMenu(record)}
          </MobileHeaderRow>
          <IncidentReason>{record.notes || (isMoney ? "Vacacion en efectivo" : "Vación tomada como día libre")}</IncidentReason>
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
            <TabDescription>Vacaciones registradas del mes actual</TabDescription>
          </div>
          <ActionButton type="button" onClick={handleOpenCreateModal}>
            <Plus size={17} />
            Registrar vacación
          </ActionButton>
        </TabHeader>

        <SummaryGrid $columns={3}>
          {metrics.map((metric) => {
            const Icon = metric.icon;
            return (
              <SummaryCard key={metric.id} $variant={metric.variant}>
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
              <Sun size={48} strokeWidth={1.6} />
              <strong>No hay vacaciones registradas este mes</strong>
              <EmptyStateAction type="button" onClick={handleOpenCreateModal}>
                + Registrar la primera
              </EmptyStateAction>
            </EmptyState>
          ) : (
            currentMonthRecords.map(renderVacationItem)
          )}
        </IncidentListContainer>
      </TabContentCard>

      <TabContentCard>
        <TabHeader>
          <div>
            <SectionTitle>Registros anteriores</SectionTitle>
          </div>
          <div>
            <FilterLabel htmlFor="vacation-year-select">Gestión</FilterLabel>
            <YearFilterSelect
              id="vacation-year-select"
              value={selectedYear}
              onChange={(e) => setSelectedYear(Number(e.target.value))}
            >
              {availableYears.map((y) => (
                <option key={y} value={y}>
                  {y}
                </option>
              ))}
            </YearFilterSelect>
          </div>
        </TabHeader>

        {previousRecordsGroupedByMonth.length > 0 && (
          <HistoryHeaderNew>
            <GroupSummaryText>
              <strong>{yearSummary.count}</strong> vacaciones en {selectedYear}
            </GroupSummaryText>
            <GroupSummaryText>
              Total días acumulados <strong>{yearSummary.totalDays} días</strong>
            </GroupSummaryText>
          </HistoryHeaderNew>
        )}

        <div>
          {previousRecordsGroupedByMonth.length === 0 ? (
            <HistoryEmptyState>
              No se encontraron vacaciones anteriores para la gestión {selectedYear}
            </HistoryEmptyState>
          ) : (
            previousRecordsGroupedByMonth.map((group) => (
              <div key={group.monthNum}>
                <HistoryMonthHeader>{group.label}</HistoryMonthHeader>
                <div>{group.records.map(renderVacationItem)}</div>
              </div>
            ))
          )}
        </div>
      </TabContentCard>

      <VacationModal
        isOpen={isModalOpen}
        mode={modalMode}
        record={selectedRecord}
        onClose={handleCloseModal}
        onSubmit={handleSaveRecord}
      />
    </>
  );
};

export default VacationsInformation;