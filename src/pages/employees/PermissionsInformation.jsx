import { useMemo, useState } from "react";
import {
  CalendarX2,
  ChevronDown,
  ChevronUp,
  CircleAlert,
  Clock3,
} from "lucide-react";
import {
  ActionButton,
  SectionTitle,
  TabContentCard,
} from "../../components/ui/Employees.styles";
import {
  EmptyState,
  EmptyStateAction,
  HistoryContent,
  HistoryHeader,
  HistoryItem,
  HistoryList,
  HistoryValue,
  SummaryCard,
  SummaryContent,
  SummaryGrid,
  SummaryIcon,
  SummaryLabel,
  SummaryValue,
  TabDescription,
  TabHeader,
} from "../../components/ui/employees/EmployeeTabs.styles";
import PermissionAbsenceModal from "../../components/modals/PermissionAbsenceModal";

const MONTHS = [
  { id: 1, label: "Junio de 2026" },
  { id: 2, label: "Mayo de 2026" },
  { id: 3, label: "Abril de 2026" },
  { id: 4, label: "Marzo de 2026" },
];

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

const PermissionsInformation = () => {
  const [openMonthId, setOpenMonthId] = useState(null);
  const [records, setRecords] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const summary = useMemo(() => {
    return records.reduce(
      (result, record) => {
        if (record.type === "permission") {
          result.permissions += 1;
        }
        if (record.type === "absence") {
          result.absences += 1;
        }
        result.totalDiscount += record.discount ?? 0;
        return result;
      },
      {
        permissions: 0,
        absences: 0,
        totalDiscount: 0,
      },
    );
  }, [records]);

  const metrics = useMemo(
    () => [
      {
        id: "permissions",
        label: "Permisos",
        value: String(summary.permissions),
        variant: "primary",
        icon: Clock3,
      },
      {
        id: "absences",
        label: "Faltas",
        value: String(summary.absences),
        variant: "success",
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

  const handleOpenModal = () => {
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  const handleSaveRecord = (recordData) => {
    setRecords((currentRecords) => [
      ...currentRecords,
      {
        id: createId(),
        ...recordData,
        discount: 0,
      },
    ]);
    handleCloseModal();
  };

  const handleToggleMonth = (monthId) => {
    setOpenMonthId((currentId) =>
      currentId === monthId ? null : monthId,
    );
  };

  return (
    <>
      <TabContentCard>
        <TabHeader>
          <div>
            <SectionTitle>Permisos y faltas</SectionTitle>
            <TabDescription>Permisos y faltas del mes actual</TabDescription>
          </div>

          <ActionButton type="button" onClick={handleOpenModal}>
            Registrar permiso/falta
          </ActionButton>
        </TabHeader>

        <SummaryGrid $columns={3}>
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

        {records.length === 0 ? (
          <EmptyState>
            <CalendarX2 size={48} strokeWidth={1.6} />
            <strong>
              No hay permisos o faltas registrados este mes
            </strong>
            <EmptyStateAction
              type="button"
              onClick={handleOpenModal}
            >
              + Registrar el primero
            </EmptyStateAction>
          </EmptyState>
        ) : (
          <HistoryContent>
            {records.map((record) => (
              <HistoryValue key={record.id}>
                <span>
                  {record.type === "permission"
                    ? "Permiso"
                    : "Falta"}
                </span>
                <strong>
                  {record.reason} · {record.date}
                </strong>
              </HistoryValue>
            ))}
          </HistoryContent>
        )}
      </TabContentCard>

      <TabContentCard>
        <SectionTitle>Meses anteriores</SectionTitle>
        <HistoryList>
          {MONTHS.map((month) => {
            const isOpen = openMonthId === month.id;
            return (
              <HistoryItem key={month.id}>
                <HistoryHeader
                  type="button"
                  aria-expanded={isOpen}
                  onClick={() =>
                    handleToggleMonth(month.id)
                  }
                >
                  <span>{month.label}</span>
                  {isOpen ? (
                    <ChevronUp size={19} />
                  ) : (
                    <ChevronDown size={19} />
                  )}
                </HistoryHeader>

                {isOpen && (
                  <HistoryContent>
                    {metrics.map((metric) => (
                      <HistoryValue key={metric.id}>
                        <span>{metric.label}</span>
                        <strong>{metric.value}</strong>
                      </HistoryValue>
                    ))}
                  </HistoryContent>
                )}
              </HistoryItem>
            );
          })}
        </HistoryList>
      </TabContentCard>

      <PermissionAbsenceModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        onSubmit={handleSaveRecord}
      />
    </>
  );
};

export default PermissionsInformation;