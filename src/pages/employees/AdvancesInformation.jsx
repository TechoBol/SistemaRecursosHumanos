import { useMemo, useState } from "react";
import Swal from "sweetalert2";
import {
  Banknote,
  CalendarDays,
  DollarSign,
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
import AdvanceModal from "../../components/modals/AdvanceModal";

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

const AdvancesInformation = () => {
  const { fullName } = useLoginStore();
  const [records, setRecords] = useState([]);
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
          totalAmount: 0,
        };
      }
      groups[monthNum].records.push(r);
      groups[monthNum].totalAmount += r.amount ?? 0;
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
    const totalAmount = yearRecords.reduce((sum, r) => sum + (r.amount ?? 0), 0);
    return {
      count: yearRecords.length,
      totalAmount,
    };
  }, [records, selectedYear]);

  // Resumen del mes actual
  const currentMonthSummary = useMemo(() => {
    return currentMonthRecords.reduce(
      (result, record) => {
        result.count += 1;
        result.totalAmount += record.amount ?? 0;
        return result;
      },
      {
        count: 0,
        totalAmount: 0,
      }
    );
  }, [currentMonthRecords]);

  const metrics = useMemo(
    () => [
      {
        id: "count",
        label: "Anticipos del mes",
        value: String(currentMonthSummary.count),
        variant: "primary",
        icon: CalendarDays,
      },
      {
        id: "total",
        label: "Total adelantos",
        value: `Bs ${formatCurrency(currentMonthSummary.totalAmount)}`,
        variant: "success",
        icon: DollarSign,
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

  const handleSaveRecord = (recordData) => {
    if (modalMode === "edit" && selectedRecord) {
      setRecords((currentRecords) =>
        currentRecords.map((r) =>
          r.id === selectedRecord.id ? { ...r, ...recordData } : r
        )
      );
    } else {
      setRecords((currentRecords) => [
        ...currentRecords,
        {
          id: createId(),
          ...recordData,
          registeredBy: fullName || "Usuario",
        },
      ]);
    }
    handleCloseModal();
  };

  const handleDeleteRecord = (id) => {
    Swal.fire({
      title: "¿Estás seguro?",
      text: "¿Deseas eliminar este registro de anticipo?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#2F573C",
      cancelButtonColor: "#D32F2F",
      confirmButtonText: "Sí, eliminar",
      cancelButtonText: "Cancelar",
    }).then((result) => {
      if (result.isConfirmed) {
        setRecords((currentRecords) => currentRecords.filter((r) => r.id !== id));
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

  const renderAdvanceItem = (record) => {
    const { day, month } = parseRecordDate(record.date);

    return (
      <IncidentItem key={record.id}>
        {/* Desktop View */}
        <DesktopOnly>
          <IncidentDateBlock>
            <IncidentDay>{day}</IncidentDay>
            <IncidentMonth>{month}</IncidentMonth>
          </IncidentDateBlock>
          <IncidentIndicator $type="advance" />
          <IncidentContent>
            <IncidentHeader>
              <IncidentBadge $type="advance">Anticipo</IncidentBadge>
              <IncidentReason>{record.notes || "Adelanto de sueldo"}</IncidentReason>
            </IncidentHeader>
            <IncidentMeta>Registrado por {record.registeredBy || "Usuario"}</IncidentMeta>
          </IncidentContent>
          <IncidentValueBlock>
            <IncidentDiscount>Bs {formatCurrency(record.amount)}</IncidentDiscount>
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
              <IncidentIndicator $type="advance" />
              <IncidentHeader>
                <IncidentBadge $type="advance">Anticipo</IncidentBadge>
                <IncidentDiscount>Bs {formatCurrency(record.amount)}</IncidentDiscount>
              </IncidentHeader>
            </MobileHeaderLeft>
            {renderMobileMenu(record)}
          </MobileHeaderRow>
          <IncidentReason>{record.notes || "Adelanto de sueldo"}</IncidentReason>
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
            <TabDescription>Anticipos de sueldo del mes actual</TabDescription>
          </div>
          <ActionButton type="button" onClick={handleOpenCreateModal}>
            <Plus size={17} />
            Registrar anticipo
          </ActionButton>
        </TabHeader>

        <SummaryGrid $columns={2}>
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
              <Banknote size={48} strokeWidth={1.6} />
              <strong>No hay anticipos registrados este mes</strong>
              <EmptyStateAction type="button" onClick={handleOpenCreateModal}>
                + Registrar el primero
              </EmptyStateAction>
            </EmptyState>
          ) : (
            currentMonthRecords.map(renderAdvanceItem)
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
              <strong>{yearSummary.count}</strong> anticipos en {selectedYear}
            </GroupSummaryText>
            <GroupSummaryText>
              Total adelantado <strong>Bs {formatCurrency(yearSummary.totalAmount)}</strong>
            </GroupSummaryText>
          </HistoryHeaderNew>
        )}

        <div>
          {previousRecordsGroupedByMonth.length === 0 ? (
            <HistoryEmptyState>
              No se encontraron anticipos anteriores para la gestión {selectedYear}
            </HistoryEmptyState>
          ) : (
            previousRecordsGroupedByMonth.map((group) => (
              <div key={group.monthNum}>
                <HistoryMonthHeader>{group.label}</HistoryMonthHeader>
                <div>{group.records.map(renderAdvanceItem)}</div>
              </div>
            ))
          )}
        </div>
      </TabContentCard>

      <AdvanceModal
        isOpen={isModalOpen}
        mode={modalMode}
        record={selectedRecord}
        onClose={handleCloseModal}
        onSubmit={handleSaveRecord}
      />
    </>
  );
};

export default AdvancesInformation;