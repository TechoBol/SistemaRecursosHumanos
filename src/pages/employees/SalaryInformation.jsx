import { useState } from "react";
import {
  CalendarDays,
  DollarSign,
  TrendingUp,
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
import {
  TableActions,
  TableActionButton,
} from "../../components/ui/table/TableCell.styles";
import {
  calculateSalarySummary,
  calculateBonusAmountForMonth,
} from "../../utils/salaryCalculator";
import { useAttendanceIncidents } from "../../hooks/useAttendanceIncidents";
import { useEmployeeAdvances } from "../../hooks/useEmployeeAdvances";
import { useEmployeeBonuses } from "../../hooks/useEmployeeBonuses";
import EmployeeBonusModal from "../../components/modals/EmployeeBonusModal";

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
  const { bonuses = [], addBonus, updateBonus, deleteBonus } = useEmployeeBonuses(employee?.id);

  const [isBonusModalOpen, setIsBonusModalOpen] = useState(false);
  const [editingBonus, setEditingBonus] = useState(null);

  const salary = calculateSalarySummary({
    contract: activeContract,
    incidents,
    advances,
    bonuses,
  });

  const handleOpenAddBonus = () => {
    setEditingBonus(null);
    setIsBonusModalOpen(true);
  };

  const handleEditBonus = (bonus) => {
    setEditingBonus(bonus);
    setIsBonusModalOpen(true);
  };

  const handleDeleteBonus = async (id) => {
    await deleteBonus(id);
  };

  const handleSubmitBonusModal = async (formData) => {
    if (editingBonus) {
      await updateBonus(editingBonus.id, formData);
    } else {
      await addBonus(formData);
    }
    setIsBonusModalOpen(false);
    setEditingBonus(null);
  };

  return (
    <>
      <TabContentCard>
        <TabHeader>
          <div>
            <SectionTitle>Resumen salario</SectionTitle>
            <TabDescription>Información general del mes actual</TabDescription>
          </div>

          <ActionButton type="button" onClick={handleOpenAddBonus}>
            <Plus size={17} />
            Agregar otros bonos
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

              {bonuses.map((bonus) => {
                const monthlyBonusAmount = calculateBonusAmountForMonth(
                  bonus,
                  salary.workedDays
                );
                return (
                  <DetailItem key={bonus.id}>
                    <DetailInfo>
                      <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                        <DetailLabel>{bonus.name}</DetailLabel>
                        <TableActions style={{ width: "auto", height: "auto" }}>
                          <TableActionButton
                            type="button"
                            title="Editar bono"
                            onClick={() => handleEditBonus(bonus)}
                            style={{ width: "26px", height: "26px" }}
                          >
                            <Pencil size={15} />
                          </TableActionButton>
                          <TableActionButton
                            type="button"
                            $danger
                            title="Eliminar bono"
                            onClick={() => handleDeleteBonus(bonus.id)}
                            style={{ width: "26px", height: "26px" }}
                          >
                            <Trash2 size={15} />
                          </TableActionButton>
                        </TableActions>
                      </div>
                      <DetailDescription>
                        Bono extra mensual — Base: {formatCurrency(bonus.amount)}
                      </DetailDescription>
                    </DetailInfo>
                    <DetailValue>
                      {formatCurrency(monthlyBonusAmount)}
                    </DetailValue>
                  </DetailItem>
                );
              })}
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

      <EmployeeBonusModal
        isOpen={isBonusModalOpen}
        onClose={() => {
          setIsBonusModalOpen(false);
          setEditingBonus(null);
        }}
        onSubmit={handleSubmitBonusModal}
        initialData={editingBonus}
      />
    </>
  );
};

export default SalaryInformation;