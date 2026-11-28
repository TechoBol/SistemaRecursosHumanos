
import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Calendar, Search, FileDown, ChevronRight, Lock, CheckCircle2, AlertCircle } from "lucide-react";
import Swal from "sweetalert2";
import DataTable from "../components/table/DataTable";
import { useCompanies } from "../hooks/useCompanies";
import { useChristmasBonuses } from "../hooks/useChristmasBonuses";
import { usePermissions } from "../hooks/usePermissions";
import { exportChristmasBonusPdf } from "../utils/christmasBonusPdfGenerator";
import { successToast, errorToast } from "../services/toasts";
import {
  ActionPrimaryButton,
  ActionSecondaryButton,
  ChipFilterButton,
  ChipFilters,
  FiltersWrapper,
  PageActions,
  PageContainer,
  PageHeader,
  PageTitle,
  SearchContainer,
  SearchInput,
  TotalsGrid,
  TotalCard,
  TotalLabel,
  TotalValue,
  PeriodSelector,
  PeriodSelect,
} from "../components/ui/Page.styles";
import {
  CellStack,
  CellText,
  CellTitle,
  TableActionButton,
  TableActions,
} from "../components/ui/table/TableCell.styles";

const SYSTEM_START_YEAR = 2026;
const CURRENT_YEAR = new Date().getFullYear();

const AVAILABLE_YEARS = Array.from(
  { length: Math.max(0, CURRENT_YEAR - SYSTEM_START_YEAR + 1) },
  (_, index) => CURRENT_YEAR - index
);

const currencyFormatter = new Intl.NumberFormat("es-BO", {
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
});

const formatCurrency = (amount) => {
  if (amount == null) return "-";
  return currencyFormatter.format(amount);
};

const formatDate = (date) => {
  if (!date) return "-";
  return date.slice(0, 10).split("-").reverse().join("/");
};

// Datos pendientes de integración con el backend.
const EMPTY_ROWS = [];

const INITIAL_TOTALS = {
  averageBaseSalary: 0,
  averageSeniorityBonus: 0,
  averageOtherBonuses: 0,
  averageGrossPay: 0,
  totalChristmasBonus: 0,
  totalEmployees: 0,
};

const TOTAL_CARDS = [
  {
    key: "averageBaseSalary",
    label: "Prom. Haber Básico",
  },
  {
    key: "averageSeniorityBonus",
    label: "Prom. Bono Antigüedad",
  },
  {
    key: "averageOtherBonuses",
    label: "Prom. Otros Bonos",
  },
  {
    key: "averageGrossPay",
    label: "Prom. Total Ganado",
    variant: "dark",
  },
  {
    key: "totalChristmasBonus",
    label: "Total Aguinaldos",
    variant: "highlight",
  },
  {
    key: "totalEmployees",
    label: "Total Empleados",
    variant: "dark",
    isCount: true,
  },
];

const COLUMNS = [
  {
    field: "employeeName",
    headerName: "Empleado",
    minWidth: 220,
    flex: 1.2,
    renderCell: ({ row }) => (
      <CellStack>
        <CellTitle>{row.employeeName}</CellTitle>
        <CellText>CI: {row.employeeDocumentNumber || "-"}{row.employeeCiExtension ? ` ${row.employeeCiExtension}` : ""}</CellText>
      </CellStack>
    ),
  },
  {
    field: "contractJobTitleName",
    headerName: "Cargo contrato",
    minWidth: 180,
  },
  {
    field: "hireDate",
    headerName: "Fecha de ingreso",
    minWidth: 130,
    valueFormatter: (value) => formatDate(value),
  },
  {
    field: "employeeType",
    headerName: "Tipo contrato",
    minWidth: 120,
  },
  {
    field: "averageBaseSalary",
    headerName: "Prom. haber básico",
    minWidth: 165,
    type: "number",
    valueFormatter: (value) => formatCurrency(value),
  },
  {
    field: "averageSeniorityBonus",
    headerName: "Prom. bono antigüedad",
    minWidth: 165,
    type: "number",
    valueFormatter: (value) => formatCurrency(value),
  },
  {
    field: "averageOtherBonuses",
    headerName: "Prom. otros bonos",
    minWidth: 155,
    type: "number",
    valueFormatter: (value) => formatCurrency(value),
  },
  {
    field: "averageGrossPay",
    headerName: "Prom. total ganado",
    minWidth: 160,
    type: "number",
    valueFormatter: (value) => formatCurrency(value),
  },
  {
    field: "workedPeriod",
    headerName: "Meses y días trabajados",
    minWidth: 165,
    sortable: false,
    valueGetter: (_, row) => {
      if (row.workedMonths == null && row.workedDays == null) {
        return "-";
      }

      const months = row.workedMonths ?? 0;
      const days = row.workedDays ?? 0;

      return `${months} meses y ${days} días`;
    },
  },
  {
    field: "christmasBonusAmount",
    headerName: "Total ganado de aguinaldo",
    minWidth: 195,
    type: "number",
    valueFormatter: (value) => formatCurrency(value),
  },
];

const PayrollChristmasBonus = () => {
  const navigate = useNavigate();
  const { companies = [] } = useCompanies();
  const { canFinalizePayroll } = usePermissions();
  const [selectedCompanyId, setSelectedCompanyId] = useState(null);
  const [selectedYear, setSelectedYear] = useState(CURRENT_YEAR);
  const [searchValue, setSearchValue] = useState("");

  const activeCompanyId =
    companies.find(
      (company) => company.id === selectedCompanyId
    )?.id ??
    companies[0]?.id ??
    null;

  const {
    bonuses: christmasBonuses,
    isFinalized,
    isAvailable,
    noticeMessage,
    isLoading,
    finalizeBonuses,
  } = useChristmasBonuses(activeCompanyId, selectedYear);

  const columns = useMemo(
    () => [
      ...COLUMNS,
      {
        field: "actions",
        headerName: "Acciones",
        width: 100,
        sortable: false,
        filterable: false,
        disableColumnMenu: true,
        renderCell: ({ row }) => (
          <TableActions>
            <TableActionButton
              type="button"
              title="Ver detalle del empleado"
              aria-label={`Ver detalle del empleado ${row.employeeName}`}
              onClick={(e) => {
                e.stopPropagation();
                navigate(`/empleados/${row.employeeId}`);
              }}
            >
              <ChevronRight size={22} />
            </TableActionButton>
          </TableActions>
        ),
      },
    ],
    [navigate]
  );

  const filteredRows = useMemo(() => {
    const search = searchValue.trim().toLowerCase();

    if (!search) return christmasBonuses;

    return christmasBonuses.filter((row) =>
      [
        row.employeeName,
        row.employeeDocumentNumber,
        row.contractJobTitleName,
        row.employeeType,
      ]
        .filter(Boolean)
        .join(" ")
        .toLowerCase()
        .includes(search)
    );
  }, [christmasBonuses, searchValue]);

  const totals = useMemo(() => {
    if (!filteredRows || filteredRows.length === 0) return INITIAL_TOTALS;

    const baseSum = filteredRows.reduce((acc, r) => acc + (r.averageBaseSalary || 0), 0);
    const senioritySum = filteredRows.reduce((acc, r) => acc + (r.averageSeniorityBonus || 0), 0);
    const otherSum = filteredRows.reduce((acc, r) => acc + (r.averageOtherBonuses || 0), 0);
    const grossSum = filteredRows.reduce((acc, r) => acc + (r.averageGrossPay || 0), 0);
    const bonusSum = filteredRows.reduce((acc, r) => acc + (r.christmasBonusAmount || 0), 0);

    return {
      averageBaseSalary: baseSum,
      averageSeniorityBonus: senioritySum,
      averageOtherBonuses: otherSum,
      averageGrossPay: grossSum,
      totalChristmasBonus: bonusSum,
      totalEmployees: filteredRows.length,
    };
  }, [filteredRows]);

  const handleFinalize = async () => {
    if (isFinalized || !activeCompanyId) return;

    const targetCompany = companies.find((c) => c.id === activeCompanyId);
    const companyName = targetCompany?.name || "la empresa seleccionada";

    const result = await Swal.fire({
      title: "¿Finalizar Planilla de Aguinaldos?",
      text: `Se congelarán los cálculos y montos de aguinaldo para ${companyName} correspondiente a la gestión ${selectedYear}. Esta acción no se puede deshacer.`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#2f573c",
      cancelButtonColor: "#d33",
      confirmButtonText: "Sí, finalizar",
      cancelButtonText: "Cancelar",
    });

    if (result.isConfirmed) {
      await finalizeBonuses();
    }
  };

  const [isExportingPdf, setIsExportingPdf] = useState(false);

  const handleExportPdf = async () => {
    if (!filteredRows || filteredRows.length === 0) {
      errorToast("No hay registros para generar la planilla de aguinaldos en PDF.");
      return;
    }

    try {
      setIsExportingPdf(true);
      const targetCompany = companies.find((c) => c.id === activeCompanyId) || null;
      await exportChristmasBonusPdf({
        bonuses: filteredRows,
        company: targetCompany,
        periodYear: selectedYear,
      });
      successToast("Planilla de aguinaldos en PDF generada exitosamente.");
    } catch (err) {
      console.error("Error al exportar PDF de aguinaldos:", err);
      errorToast("Ocurrió un error al generar el PDF de aguinaldos.");
    } finally {
      setIsExportingPdf(false);
    }
  };

  return (
    <PageContainer>
      <PageHeader>
        <PageTitle>Planilla de Aguinaldos - {selectedYear}</PageTitle>

        <PageActions>
          <PeriodSelector>
            <Calendar size={16} color="#2f573c" />
            <PeriodSelect
              value={selectedYear}
              aria-label="Seleccionar gestión"
              onChange={(e) =>
                setSelectedYear(Number(e.target.value))
              }
            >
              {AVAILABLE_YEARS.map((year) => (
                <option key={year} value={year}>
                  {year}
                </option>
              ))}
            </PeriodSelect>
          </PeriodSelector>

          <SearchContainer>
            <Search size={21} />
            <SearchInput
              type="search"
              value={searchValue}
              placeholder="Buscar empleado"
              aria-label="Buscar empleado"
              onChange={(e) => setSearchValue(e.target.value)}
            />
          </SearchContainer>
        </PageActions>
      </PageHeader>

      {/* Resumen de la planilla */}
      <TotalsGrid>
        {TOTAL_CARDS.map(({ key, label, variant, isCount }) => (
          <TotalCard key={key} $variant={variant}>
            <TotalLabel $variant={variant}>
              {label}
            </TotalLabel>
            <TotalValue $variant={variant}>
              {isCount
                ? totals[key]
                : `Bs ${formatCurrency(totals[key])}`}
            </TotalValue>
          </TotalCard>
        ))}
      </TotalsGrid>

      {/* Filtros de empresas y acciones de la planilla */}
      <FiltersWrapper>
        <ChipFilters>
          {companies.map((company) => (
            <ChipFilterButton
              key={company.id}
              type="button"
              $active={activeCompanyId === company.id}
              onClick={() => setSelectedCompanyId(company.id)}
            >
              {company.name}
            </ChipFilterButton>
          ))}
        </ChipFilters>
        <ChipFilters>
          <ActionSecondaryButton
            type="button"
            title="Exportar planilla de aguinaldos"
            onClick={handleExportPdf}
            disabled={isExportingPdf || isLoading || filteredRows.length === 0}
          >
            <FileDown size={18} />
            <span>{isExportingPdf ? "Generando PDF..." : "Exportar Planilla"}</span>
          </ActionSecondaryButton>

          {canFinalizePayroll && isAvailable && (
            <ActionPrimaryButton
              type="button"
              onClick={handleFinalize}
              disabled={isLoading || isFinalized || filteredRows.length === 0}
              $isFinalized={isFinalized}
              title={
                isFinalized
                  ? "La planilla de aguinaldos de esta gestión ya se encuentra finalizada y registrada."
                  : "Finalizar y registrar definitivamente la planilla de aguinaldos de este año"
              }
            >
              {isFinalized ? (
                <>
                  <CheckCircle2 size={18} />
                  <span>Aguinaldo Finalizado</span>
                </>
              ) : (
                <>
                  <Lock size={18} />
                  <span>Finalizar aguinaldo</span>
                </>
              )}
            </ActionPrimaryButton>
          )}
        </ChipFilters>
      </FiltersWrapper>

      {!isAvailable && noticeMessage && (
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "12px",
            padding: "16px 20px",
            backgroundColor: "#fef3c7",
            borderRadius: "12px",
            color: "#92400e",
            fontSize: "14px",
            fontWeight: 500,
          }}
        >
          <AlertCircle size={20} color="#b45309" />
          <span>{noticeMessage}</span>
        </div>
      )}

      {/* Tabla de aguinaldos */}
      <DataTable
        rows={filteredRows}
        columns={columns}
        loading={isLoading}
        pageSize={30}
        pageSizeOptions={[30, 50, 100]}
        minHeight="540px"
        rowHeight={60}
        columnHeaderHeight={58}
        disableColumnMenu
      />
    </PageContainer>
  );
};

export default PayrollChristmasBonus;