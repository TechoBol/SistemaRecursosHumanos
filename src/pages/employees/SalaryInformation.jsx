import {
  CalendarDays,
  DollarSign,
  TrendingUp,
} from "lucide-react";
import {
  ActionButton,
  SectionTitle,
  TabContentCard,
} from "../../components/ui/Employees.styles";
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
  HistoryEmptyState,
  SummaryCard,
  SummaryContent,
  SummaryGrid,
  SummaryIcon,
  SummaryLabel,
  SummaryValue,
  TabDescription,
  TabHeader,
} from "../../components/ui/employees/EmployeeTabs.styles";
import { calculateSalarySummary } from "../../utils/salaryCalculator";
import { useAttendanceIncidents } from "../../hooks/useAttendanceIncidents";
import { useEmployeeAdvances } from "../../hooks/useEmployeeAdvances";

const formatCurrency = (amount = 0) =>
  new Intl.NumberFormat("es-BO", {
    style: "currency",
    currency: "BOB",
    currencyDisplay: "code",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })
    .format(amount)
    .replace("BOB", "Bs");

const SalaryInformation = ({ employee }) => {
  const activeContract =
    employee?.contracts?.find(
      (contract) => contract.isActive
    ) ??
    employee?.contracts?.[0] ??
    null;

  const { incidents = [] } = useAttendanceIncidents(employee?.id);
  const { advances = [] } = useEmployeeAdvances(employee?.id);
  const salary = calculateSalarySummary({
    contract: activeContract,
    incidents,
    advances,
  });

  return (
    <>
      <TabContentCard>
        <TabHeader>
          <div>
            <SectionTitle>Resumen salario</SectionTitle>
            <TabDescription>Información general del mes actual</TabDescription>
          </div>

          <ActionButton type="button">
            Actualizar haber básico
          </ActionButton>
        </TabHeader>

        <SummaryGrid $columns={3}>
          <SummaryCard $variant="primary">
            <SummaryContent>
              <SummaryLabel>Haber básico</SummaryLabel>
              <SummaryValue>
                {formatCurrency(salary.baseSalary)}
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
                {salary.workedDays}
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
                {formatCurrency(salary.basicEarnings)}
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
                  <DetailDescription>{salary.seniorityDescription}</DetailDescription>
                </DetailInfo>
                <DetailValue>
                  {formatCurrency(salary.seniorityBonus)}
                </DetailValue>
              </DetailItem>
            </DetailList>
          </DetailSection>

          <HighlightCard>
            <HighlightLabel>Total ganado</HighlightLabel>
            <HighlightValue>{formatCurrency(salary.totalEarned)}</HighlightValue>
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
                  <DetailDescription>AFP (12,71 % sobre Total Ganado)</DetailDescription>
                </DetailInfo>
                <DetailValue $variant="danger">
                  - {formatCurrency(salary.gestoraDeduction)}
                </DetailValue>
              </DetailItem>

              <DetailItem>
                <DetailInfo>
                  <DetailLabel>Deudas</DetailLabel>
                  <DetailDescription>Permisos y faltas</DetailDescription>
                </DetailInfo>
                <DetailValue $variant="danger">
                  - {formatCurrency(salary.deudasDeduction)}
                </DetailValue>
              </DetailItem>

              <DetailItem>
                <DetailInfo>
                  <DetailLabel>Anticipos</DetailLabel>
                  <DetailDescription>Adelantos del mes</DetailDescription>
                </DetailInfo>
                <DetailValue $variant="danger">
                  - {formatCurrency(salary.anticiposDeduction)}
                </DetailValue>
              </DetailItem>
            </DetailList>
          </DetailSection>

          <HighlightCard>
            <HighlightLabel>Líquido pagable</HighlightLabel>
            <HighlightValue>{formatCurrency(salary.netPayable)}</HighlightValue>
            <DollarSign size={54} strokeWidth={1.7} />
          </HighlightCard>
        </DetailGrid>
      </TabContentCard>

      <TabContentCard>
        <SectionTitle>Meses anteriores</SectionTitle>
        <HistoryEmptyState>
          No se encontraron registros de nóminas de meses anteriores
        </HistoryEmptyState>
      </TabContentCard>
    </>
  );
};

export default SalaryInformation;