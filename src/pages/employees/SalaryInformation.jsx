import { useState, useEffect, useCallback, useMemo } from "react";
import {
  CalendarDays,
  DollarSign,
  TrendingUp,
  Pencil,
  Plus,
  Trash2,
  ChevronDown,
  ChevronUp,
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
  HistoryList,
  HistoryItem,
  HistoryHeader,
  HistoryContent,
  HistoryValue,
  StatusBadge,
  YearFilterSelect,
  FilterLabel,
  HistoryHeaderNew,
  GroupSummaryText,
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
import { useEmployeeBonuses } from "../../hooks/useEmployeeBonuses";
import EmployeeBonusModal from "../../components/modals/EmployeeBonusModal";
import { useLoginStore } from "../../components/store/loginStore";
import { getEmployeeSalarySummaryApi } from "../../services/PayrollService";

const MONTH_NAMES = [
  "Enero",
  "Febrero",
  "Marzo",
  "Abril",
  "Mayo",
  "Junio",
  "Julio",
  "Agosto",
  "Septiembre",
  "Octubre",
  "Noviembre",
  "Diciembre",
];

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

const formatNetSalaryCurrency = (amount = 0) =>
  new Intl.NumberFormat("es-BO", {
    style: "currency",
    currency: "BOB",
    currencyDisplay: "code",
    minimumFractionDigits: 1,
    maximumFractionDigits: 1,
  })
    .format(amount)
    .replace("BOB", "Bs");

const SalaryInformation = ({ employee }) => {
  const { token } = useLoginStore();
  const { bonuses = [], addBonus, updateBonus, deleteBonus } = useEmployeeBonuses(employee?.id);

  const [isBonusModalOpen, setIsBonusModalOpen] = useState(false);
  const [editingBonus, setEditingBonus] = useState(null);
  const [salarySummary, setSalarySummary] = useState(null);
  const [loading, setLoading] = useState(false);
  const [expandedMonths, setExpandedMonths] = useState({});
  const [selectedYear, setSelectedYear] = useState(() => new Date().getFullYear());

  const fetchSalarySummary = useCallback(async () => {
    if (!employee?.id || !token) return;
    try {
      setLoading(true);
      const data = await getEmployeeSalarySummaryApi(token, employee.id);
      if (data) {
        setSalarySummary(data);
      }
    } catch (error) {
      console.error("Error fetching salary summary from backend:", error);
    } finally {
      setLoading(false);
    }
  }, [employee?.id, token]);

  useEffect(() => {
    fetchSalarySummary();
  }, [fetchSalarySummary]);

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
    fetchSalarySummary();
  };

  const handleSubmitBonusModal = async (formData) => {
    if (editingBonus) {
      await updateBonus(editingBonus.id, formData);
    } else {
      await addBonus(formData);
    }
    setIsBonusModalOpen(false);
    setEditingBonus(null);
    fetchSalarySummary();
  };

  const toggleMonthExpansion = (id) => {
    setExpandedMonths((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  const activeContract =
    employee?.contracts?.find((c) => c.isActive) ??
    employee?.contracts?.[0] ??
    null;

  // Si aún no cargó el resumen de backend, usamos valores seguros por defecto del contrato
  const baseSalary = salarySummary?.baseSalary ?? Number(activeContract?.baseSalary || 0);
  const workedDays = salarySummary?.workedDays ?? 0;
  const basicEarnings = salarySummary?.basicEarnings ?? 0;
  const seniorityBonus = salarySummary?.seniorityBonus ?? 0;
  const seniorityDescription = salarySummary?.seniorityDescription ?? "Calculando...";
  const serverBonuses = salarySummary?.bonuses ?? [];
  const totalEarned = salarySummary?.totalEarned ?? 0;
  const gestoraDeduction = salarySummary?.gestoraDeduction ?? 0;
  const deudasDeduction = salarySummary?.deudasDeduction ?? 0;
  const anticiposDeduction = salarySummary?.anticiposDeduction ?? 0;
  const netPayable = salarySummary?.netPayable ?? 0;
  const history = salarySummary?.history ?? [];

  // Años disponibles basados en el historial y el año actual
  const availableYears = useMemo(() => {
    const years = new Set([new Date().getFullYear()]);
    history.forEach((h) => {
      if (h.year && !isNaN(Number(h.year))) {
        years.add(Number(h.year));
      }
    });
    return Array.from(years).sort((a, b) => b - a);
  }, [history]);

  // Historial filtrado por el año seleccionado (orden descendente de mes)
  const filteredHistory = useMemo(() => {
    return history
      .filter((h) => Number(h.year) === selectedYear)
      .sort((a, b) => b.month - a.month);
  }, [history, selectedYear]);

  // Resumen del año seleccionado
  const yearSummary = useMemo(() => {
    const count = filteredHistory.length;
    const totalNet = filteredHistory.reduce((sum, h) => sum + (Number(h.netSalary) || 0), 0);
    return { count, totalNet };
  }, [filteredHistory]);

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
                {formatCurrency(baseSalary)}
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
                {workedDays}
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
                {formatCurrency(basicEarnings)}
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
                  <DetailDescription>{seniorityDescription}</DetailDescription>
                </DetailInfo>
                <DetailValue>
                  {formatCurrency(seniorityBonus)}
                </DetailValue>
              </DetailItem>

              {serverBonuses.map((bonus) => {
                const bonusRaw = bonuses.find((b) => b.id === bonus.id) || bonus;
                return (
                  <DetailItem key={bonus.id}>
                    <DetailInfo>
                      <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                        <DetailLabel>{bonus.name}</DetailLabel>
                        <TableActions style={{ width: "auto", height: "auto" }}>
                          <TableActionButton
                            type="button"
                            title="Editar bono"
                            onClick={() => handleEditBonus(bonusRaw)}
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
                      {formatCurrency(bonus.monthlyAmount)}
                    </DetailValue>
                  </DetailItem>
                );
              })}
            </DetailList>
          </DetailSection>

          <HighlightCard>
            <HighlightLabel>Total ganado</HighlightLabel>
            <HighlightValue>{formatCurrency(totalEarned)}</HighlightValue>
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
                  - {formatCurrency(gestoraDeduction)}
                </DetailValue>
              </DetailItem>

              <DetailItem>
                <DetailInfo>
                  <DetailLabel>Deudas</DetailLabel>
                  <DetailDescription>Permisos y faltas</DetailDescription>
                </DetailInfo>
                <DetailValue $variant="danger">
                  - {formatCurrency(deudasDeduction)}
                </DetailValue>
              </DetailItem>

              <DetailItem>
                <DetailInfo>
                  <DetailLabel>Anticipos</DetailLabel>
                  <DetailDescription>Adelantos del mes</DetailDescription>
                </DetailInfo>
                <DetailValue $variant="danger">
                  - {formatCurrency(anticiposDeduction)}
                </DetailValue>
              </DetailItem>
            </DetailList>
          </DetailSection>

          <HighlightCard>
            <HighlightLabel>Líquido pagable</HighlightLabel>
            <HighlightValue>{formatNetSalaryCurrency(netPayable)}</HighlightValue>
            <DollarSign size={54} strokeWidth={1.7} />
          </HighlightCard>
        </DetailGrid>
      </TabContentCard>

      <TabContentCard>
        <TabHeader>
          <div>
            <SectionTitle>Meses anteriores</SectionTitle>
          </div>
          <div>
            <FilterLabel htmlFor="salary-history-year-select">Gestión</FilterLabel>
            <YearFilterSelect
              id="salary-history-year-select"
              value={selectedYear}
              onChange={(e) => setSelectedYear(Number(e.target.value))}
            >
              {availableYears.map((y) => (
                <option key={y} value={y}>{y}</option>
              ))}
            </YearFilterSelect>
          </div>
        </TabHeader>

        {filteredHistory.length > 0 && (
          <HistoryHeaderNew>
            <GroupSummaryText>
              <strong>{yearSummary.count}</strong> nómina{yearSummary.count === 1 ? "" : "s"} en {selectedYear}
            </GroupSummaryText>
            <GroupSummaryText>
              Total líquido acumulado <strong>{formatCurrency(yearSummary.totalNet)}</strong>
            </GroupSummaryText>
          </HistoryHeaderNew>
        )}

        {filteredHistory.length === 0 ? (
          <HistoryEmptyState>
            No se encontraron registros de nóminas para la gestión {selectedYear}
          </HistoryEmptyState>
        ) : (
          <HistoryList>
            {filteredHistory.map((record) => {
              const monthName = MONTH_NAMES[record.month - 1] || `Mes ${record.month}`;
              const isExpanded = !!expandedMonths[record.id];
              return (
                <HistoryItem key={record.id}>
                  <HistoryHeader
                    type="button"
                    onClick={() => toggleMonthExpansion(record.id)}
                  >
                    <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                      <strong style={{ fontSize: "14px" }}>
                        {monthName} {record.year}
                      </strong>
                      {record.contractCompanyName && (
                        <span style={{ fontSize: "12px", color: "#64748b", fontWeight: 500 }}>
                          • {record.contractCompanyName}
                        </span>
                      )}
                      <StatusBadge $variant={record.status === "GENERATED" || record.status === "PAID" ? "success" : "neutral"}>
                        {record.status === "PAID"
                          ? "Pagado"
                          : record.status === "GENERATED"
                          ? "Generado"
                          : "Borrador"}
                      </StatusBadge>
                    </div>

                    <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
                      <span>
                        Líquido: <strong>{formatNetSalaryCurrency(record.netSalary)}</strong>
                      </span>
                      {isExpanded ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
                    </div>
                  </HistoryHeader>

                  {isExpanded && (
                    <HistoryContent>
                      {[
                        { label: "Haber Básico", value: formatCurrency(record.baseSalary) },
                        { label: "Días Trabajados", value: record.workedDays },
                        { label: "Sueldo Básico", value: formatCurrency(record.earnedSalary) },
                        { label: "Bono Antigüedad", value: formatCurrency(record.seniorityBonus) },
                        { label: "Otros Bonos", value: formatCurrency(record.otherBonuses) },
                        { label: "Total Ganado", value: formatCurrency(record.grossPay), color: "#2f573c" },
                        { label: "Gestora (12.71%)", value: `- ${formatCurrency(record.afpDeduction)}`, color: "#e53e3e" },
                        { label: "Faltas / Permisos", value: `- ${formatCurrency(record.absenceDeduction)}`, color: "#e53e3e" },
                        { label: "Anticipos", value: `- ${formatCurrency(record.advanceDeduction)}`, color: "#e53e3e" },
                        { label: "Total Descuentos", value: `- ${formatCurrency(record.totalDeductions)}`, color: "#e53e3e" },
                        { label: "Líquido Pagable", value: formatNetSalaryCurrency(record.netSalary), color: "#2f573c", fontSize: "16px" },
                      ].map((item, idx) => (
                        <HistoryValue key={idx}>
                          <span>{item.label}</span>
                          <strong style={{ ...(item.color ? { color: item.color } : {}), ...(item.fontSize ? { fontSize: item.fontSize } : {}) }}>
                            {item.value}
                          </strong>
                        </HistoryValue>
                      ))}
                    </HistoryContent>
                  )}
                </HistoryItem>
              );
            })}
          </HistoryList>
        )}
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