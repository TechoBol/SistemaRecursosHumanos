
import { useMemo, useState } from "react";
import { Calendar, Search, FileDown, Eye } from "lucide-react";

import DataTable from "../components/table/DataTable";
import { useCompanies } from "../hooks/useCompanies";

import {
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
        <CellText>CI: {row.employeeDocumentNumber || "-"}</CellText>
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
    minWidth: 140,
    valueFormatter: (value) => formatDate(value),
  },
  {
    field: "employeeType",
    headerName: "Tipo contrato",
    minWidth: 130,
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
    minWidth: 185,
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
    minWidth: 165,
    type: "number",
    valueFormatter: (value) => formatCurrency(value),
  },
  {
    field: "workedPeriod",
    headerName: "Meses y días trabajados",
    minWidth: 200,
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
    headerName: "Total ganado después de duodécimas",
    minWidth: 270,
    type: "number",
    valueFormatter: (value) => formatCurrency(value),
  },
  {
    field: "actions",
    headerName: "Acciones",
    width: 100,
    sortable: false,
    filterable: false,
    disableColumnMenu: true,
    renderCell: () => (
      <TableActions>
        <TableActionButton
          type="button"
          title="Ver detalle del aguinaldo"
          aria-label="Ver detalle del aguinaldo"
          disabled
        >
          <Eye size={18} />
        </TableActionButton>
      </TableActions>
    ),
  },
];

const PayrollChristmasBonus = () => {
  const { companies = [] } = useCompanies();

  const [selectedCompanyId, setSelectedCompanyId] = useState(null);
  const [selectedYear, setSelectedYear] = useState(CURRENT_YEAR);
  const [searchValue, setSearchValue] = useState("");

  // Seleccionar la primera empresa disponible automáticamente.
  // No requiere un useEffect ni un estado adicional.
  const activeCompanyId =
    companies.find(
      (company) => company.id === selectedCompanyId
    )?.id ??
    companies[0]?.id ??
    null;

  // Reemplazar por useChristmasBonuses cuando exista el servicio.
  const christmasBonuses = EMPTY_ROWS;

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

  // Los cálculos se implementarán posteriormente.
  const totals = INITIAL_TOTALS;

  return (
    <PageContainer>
      <PageHeader>
        <PageTitle>
          Planilla de Aguinaldos - {selectedYear}
        </PageTitle>

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
            disabled
          >
            <FileDown size={18} />
            <span>Exportar Planilla</span>
          </ActionSecondaryButton>
        </ChipFilters>
      </FiltersWrapper>

      {/* Tabla de aguinaldos */}
      <DataTable
        rows={filteredRows}
        columns={COLUMNS}
        loading={false}
        pageSize={30}
        pageSizeOptions={[30, 50, 100]}
        height="610px"
        rowHeight={60}
        columnHeaderHeight={58}
        disableColumnMenu
      />
    </PageContainer>
  );
};

export default PayrollChristmasBonus;