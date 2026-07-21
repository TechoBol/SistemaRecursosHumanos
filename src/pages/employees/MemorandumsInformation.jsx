import { useState } from "react";
import {
  ChevronDown,
  ChevronUp,
  CircleAlert,
  FileHeart,
  FileText,
  Folder,
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

const MONTHS = [
  { id: 1, label: "Junio de 2026" },
  { id: 2, label: "Mayo de 2026" },
  { id: 3, label: "Abril de 2026" },
  { id: 4, label: "Marzo de 2026" },
];

const METRICS = [
  {
    id: "total",
    label: "Total del mes",
    value: "0",
    variant: "primary",
    icon: Folder,
  },
  {
    id: "positive",
    label: "Positivos",
    value: "0",
    variant: "success",
    icon: FileHeart,
  },
  {
    id: "negative",
    label: "Negativos",
    value: "0",
    variant: "danger",
    icon: CircleAlert,
  },
];

const MemorandumsInformation = () => {
  const [openMonthId, setOpenMonthId] = useState(null);

  const handleRegister = () => {
    console.log("Registrar memorándum");
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
            <SectionTitle>Memorándums</SectionTitle>

            <TabDescription>
              Memorándums del mes actual
            </TabDescription>
          </div>

          <ActionButton type="button" onClick={handleRegister}>
            Registrar memorándum
          </ActionButton>
        </TabHeader>

        <SummaryGrid $columns={3}>
          {METRICS.map((metric) => {
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

        <EmptyState>
          <FileText size={48} strokeWidth={1.6} />

          <strong>
            No hay memorándums registrados este mes
          </strong>

          <EmptyStateAction
            type="button"
            onClick={handleRegister}
          >
            + Registrar el primero
          </EmptyStateAction>
        </EmptyState>
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
                    {METRICS.map((metric) => (
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
    </>
  );
};

export default MemorandumsInformation;