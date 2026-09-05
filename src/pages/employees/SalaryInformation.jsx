import { useMemo } from "react";
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
import { calculateSalarySummary } from "../../utils/salaryCalculator";
import { useAttendanceIncidents } from "../../hooks/useAttendanceIncidents";
import { useEmployeeAdvances } from "../../hooks/useEmployeeAdvances";

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
  const activeContract = useMemo(() => {
    return employee?.contracts?.find((c) => c.isActive) || employee?.contracts?.[0] || null;
  }, [employee]);

  const { incidents = [] } = useAttendanceIncidents(employee?.id);
  const { advances = [] } = useEmployeeAdvances(employee?.id);

  const currentYear = new Date().getFullYear();
  const currentMonthNum = new Date().getMonth() + 1;

  // Suma de deudas (descuentos por asistencias/faltas/atrasos) del mes actual
  const attendanceDiscountsTotal = useMemo(() => {
    return incidents.reduce((sum, item) => {
      if (!item.date) return sum;
      const parts = item.date.split("-");
      if (parts.length !== 3) return sum;
      const y = Number(parts[0]);
      const m = Number(parts[1]);
      if (y === currentYear && m === currentMonthNum) {
        return sum + (Number(item.discount) || 0);
      }
      return sum;
    }, 0);
  }, [incidents, currentYear, currentMonthNum]);

  // Suma de anticipos otorgados en el mes actual
  const advanceTotal = useMemo(() => {
    return advances.reduce((sum, item) => {
      if (!item.date) return sum;
      const parts = item.date.split("-");
      if (parts.length !== 3) return sum;
      const y = Number(parts[0]);
      const m = Number(parts[1]);
      if (y === currentYear && m === currentMonthNum) {
        return sum + (Number(item.amount) || 0);
      }
      return sum;
    }, 0);
  }, [advances, currentYear, currentMonthNum]);

  const salarySummary = useMemo(() => {
    return calculateSalarySummary(
      activeContract,
      new Date(),
      attendanceDiscountsTotal,
      advanceTotal
    );
  }, [activeContract, attendanceDiscountsTotal, advanceTotal]);

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
                {formatCurrency(salarySummary.basicEarnings)}
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
                  <DetailDescription>{salarySummary.seniorityDescription}</DetailDescription>
                </DetailInfo>
                <DetailValue>
                  {formatCurrency(salarySummary.seniorityBonus)}
                </DetailValue>
              </DetailItem>
            </DetailList>
          </DetailSection>

          <HighlightCard>
            <HighlightLabel>Total ganado</HighlightLabel>
            <HighlightValue>{formatCurrency(salarySummary.totalEarned)}</HighlightValue>
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
                  - {formatCurrency(salarySummary.gestoraDeduction)}
                </DetailValue>
              </DetailItem>

              <DetailItem>
                <DetailInfo>
                  <DetailLabel>Deudas</DetailLabel>
                  <DetailDescription>Permisos, atrasos y faltas</DetailDescription>
                </DetailInfo>
                <DetailValue $variant="danger">
                  - {formatCurrency(salarySummary.deudasDeduction)}
                </DetailValue>
              </DetailItem>

              <DetailItem>
                <DetailInfo>
                  <DetailLabel>Anticipos</DetailLabel>
                  <DetailDescription>Adelantos del mes</DetailDescription>
                </DetailInfo>
                <DetailValue $variant="danger">
                  - {formatCurrency(salarySummary.anticiposDeduction)}
                </DetailValue>
              </DetailItem>
            </DetailList>
          </DetailSection>

          <HighlightCard>
            <HighlightLabel>Líquido pagable</HighlightLabel>
            <HighlightValue>{formatCurrency(salarySummary.netPayable)}</HighlightValue>
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