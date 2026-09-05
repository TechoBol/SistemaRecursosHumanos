import { useMemo, useState } from "react";
import {
  CalendarDays,
  ChevronDown,
  ChevronUp,
  DollarSign,
  TrendingUp,
} from "lucide-react";

import {
  ActionButton,
  SectionTitle,
  TabContentCard,
} from "../../components/ui/Employees.styles";
import { calculateSalarySummary } from "../../utils/salaryCalculator";

import {
  ContentDivider,
  DetailDescription,
  DetailGrid,
  DetailInfo,
  DetailItem,
  DetailLabel,
  DetailList,
  DetailSection,
  DetailTitle,
  DetailValue,
  HighlightCard,
  HighlightLabel,
  HighlightValue,
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

const SALARY_HISTORY = [
  {
    id: 1,
    month: "Junio de 2026",
    baseSalary: 3300,
    workedDays: 7,
    basicEarnings: 770,
    mandatoryDeductions: 97.87,
    otherDeductions: 0,
    total: 770,
  },
  {
    id: 2,
    month: "Mayo de 2026",
    baseSalary: 3300,
    workedDays: 30,
    basicEarnings: 3300,
    mandatoryDeductions: 97.87,
    otherDeductions: 0,
    total: 3202.13,
  },
  {
    id: 3,
    month: "Abril de 2026",
    baseSalary: 3300,
    workedDays: 30,
    basicEarnings: 3300,
    mandatoryDeductions: 97.87,
    otherDeductions: 0,
    total: 3202.13,
  },
  {
    id: 4,
    month: "Marzo de 2026",
    baseSalary: 3100,
    workedDays: 30,
    basicEarnings: 3100,
    mandatoryDeductions: 91.94,
    otherDeductions: 0,
    total: 3008.06,
  },
];

const formatCurrency = (amount = 0) => {
  return new Intl.NumberFormat("es-BO", {
    style: "currency",
    currency: "BOB",
    currencyDisplay: "code",
    minimumFractionDigits: 2,
  })
    .format(amount)
    .replace("BOB", "Bs");
};

const SalaryInformation = ({ employee }) => {
  const [openMonthId, setOpenMonthId] = useState(null);

  const activeContract = useMemo(() => {
    return employee?.contracts?.find((c) => c.isActive) || employee?.contracts?.[0] || null;
  }, [employee]);

  const salarySummary = useMemo(() => {
    return calculateSalarySummary(activeContract);
  }, [activeContract]);

  const currentSalary = SALARY_HISTORY[0];

  const totalDeductions = useMemo(() => {
    return (
      currentSalary.mandatoryDeductions +
      currentSalary.otherDeductions
    );
  }, [
    currentSalary.mandatoryDeductions,
    currentSalary.otherDeductions,
  ]);

  const totalToPay = useMemo(() => {
    return currentSalary.basicEarnings - totalDeductions;
  }, [currentSalary.basicEarnings, totalDeductions]);

  const handleToggleMonth = (monthId) => {
    setOpenMonthId((currentId) =>
      currentId === monthId ? null : monthId,
    );
  };

  const handleUpdateBaseSalary = () => {
    console.log("Actualizar haber básico");
  };

  return (
    <>
      <TabContentCard>
        <TabHeader>
          <div>
            <SectionTitle>Resumen salario</SectionTitle>
            <TabDescription>Información general del mes actual</TabDescription>
          </div>

          <ActionButton
            type="button"
            onClick={handleUpdateBaseSalary}
          >
            Actualizar haber básico
          </ActionButton>
        </TabHeader>

        <SummaryGrid $columns={3}>
          <SummaryCard $variant="primary">
            <SummaryContent>
              <SummaryLabel>Haber básico</SummaryLabel>

              <SummaryValue>
                {formatCurrency(salarySummary.baseSalary)}
              </SummaryValue>
            </SummaryContent>

            <SummaryIcon>
              <DollarSign size={56} strokeWidth={1.7} />
            </SummaryIcon>
          </SummaryCard>

          <SummaryCard $variant="neutral">
            <SummaryContent>
              <SummaryLabel>Días trabajados</SummaryLabel>

              <SummaryValue>
                {salarySummary.workedDays}
              </SummaryValue>
            </SummaryContent>

            <SummaryIcon>
              <CalendarDays size={52} strokeWidth={1.7} />
            </SummaryIcon>
          </SummaryCard>

          <SummaryCard $variant="warning">
            <SummaryContent>
              <SummaryLabel>Sueldo básico</SummaryLabel>

              <SummaryValue>
                {formatCurrency(
                  salarySummary.basicEarnings,
                )}
              </SummaryValue>
            </SummaryContent>

            <SummaryIcon>
              <TrendingUp size={52} strokeWidth={1.7} />
            </SummaryIcon>
          </SummaryCard>
        </SummaryGrid>

        <ContentDivider />

        {/* AUMENTOS */}
        <DetailGrid>
          <DetailSection>
            <DetailTitle>Aumentos</DetailTitle>
            <DetailList>
              <DetailItem>
                <DetailInfo>
                  <DetailLabel>Bono de antigüedad</DetailLabel>
                  <DetailDescription>2 años 5%</DetailDescription>
                </DetailInfo>
                <DetailValue>
                  {formatCurrency(550)}
                </DetailValue>
              </DetailItem>
            </DetailList>
          </DetailSection>

          <HighlightCard>
            <HighlightLabel>Total ganado</HighlightLabel>
            <HighlightValue>{formatCurrency(totalToPay)}</HighlightValue>
            <DollarSign size={54} strokeWidth={1.7} />
          </HighlightCard>
        </DetailGrid>
        
        {/* DESCUENTOS */}
        <DetailGrid>
          <DetailSection>
            <DetailTitle $variant="danger">Descuentos</DetailTitle>
            <DetailList>
              <DetailItem>
                <DetailInfo>
                  <DetailLabel>Gestora</DetailLabel>
                  <DetailDescription>AFP (12,71 %)</DetailDescription>
                </DetailInfo>
                <DetailValue $variant="danger">
                  -{" "}
                  {formatCurrency(
                    currentSalary.mandatoryDeductions,
                  )}
                </DetailValue>
              </DetailItem>

              <DetailItem>
                <DetailInfo>
                  <DetailLabel>Deudas</DetailLabel>
                  <DetailDescription>Permisos, atrasos y faltas</DetailDescription>
                </DetailInfo>
                <DetailValue>
                  {formatCurrency(
                    
                  )}
                </DetailValue>
              </DetailItem>

              <DetailItem>
                <DetailInfo>
                  <DetailLabel>Anticipos</DetailLabel>
                  <DetailDescription>Adelantos del mes</DetailDescription>
                </DetailInfo>
                <DetailValue>{formatCurrency(1)}</DetailValue>
              </DetailItem>
            </DetailList>
          </DetailSection>

          <HighlightCard>
            <HighlightLabel>Líquido pagable</HighlightLabel>
            <HighlightValue>{formatCurrency(totalToPay)}</HighlightValue>
            <DollarSign size={54} strokeWidth={1.7} />
          </HighlightCard>
        </DetailGrid>
      </TabContentCard>

      <TabContentCard>
        <SectionTitle>Meses anteriores</SectionTitle>

        <HistoryList>
          {SALARY_HISTORY.map((history) => {
            const isOpen = openMonthId === history.id;

            return (
              <HistoryItem key={history.id}>
                <HistoryHeader
                  type="button"
                  aria-expanded={isOpen}
                  onClick={() =>
                    handleToggleMonth(history.id)
                  }
                >
                  <span>{history.month}</span>

                  {isOpen ? (
                    <ChevronUp size={19} />
                  ) : (
                    <ChevronDown size={19} />
                  )}
                </HistoryHeader>

                {isOpen && (
                  <HistoryContent>
                    <HistoryValue>
                      <span>Haber básico</span>
                      <strong>
                        {formatCurrency(history.baseSalary)}
                      </strong>
                    </HistoryValue>

                    <HistoryValue>
                      <span>Días trabajados</span>
                      <strong>{history.workedDays}</strong>
                    </HistoryValue>

                    <HistoryValue>
                      <span>Sueldo básico</span>
                      <strong>
                        {formatCurrency(
                          history.basicEarnings,
                        )}
                      </strong>
                    </HistoryValue>

                    <HistoryValue>
                      <span>Gestora</span>
                      <strong>
                        {formatCurrency(
                          history.mandatoryDeductions +
                            history.otherDeductions,
                        )}
                      </strong>
                    </HistoryValue>

                    <HistoryValue>
                      <span>Total pagado</span>
                      <strong>
                        {formatCurrency(history.total)}
                      </strong>
                    </HistoryValue>
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

export default SalaryInformation;