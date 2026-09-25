import { useMemo, useState, useEffect } from "react";
import { Search, Pencil, Calendar } from "lucide-react";
import styled from "styled-components";
import DataTable from "../components/table/DataTable";
import PayrollModal from "../components/modals/PayrollModal";
import { useCompanies } from "../hooks/useCompanies";
import { usePayrolls } from "../hooks/usePayrolls";
import {
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
  Badge,
} from "../components/ui/table/TableCell.styles";

const ALL_MONTHS = [
  { value: 1, label: "Enero" },
  { value: 2, label: "Febrero" },
  { value: 3, label: "Marzo" },
  { value: 4, label: "Abril" },
  { value: 5, label: "Mayo" },
  { value: 6, label: "Junio" },
  { value: 7, label: "Julio" },
  { value: 8, label: "Agosto" },
  { value: 9, label: "Septiembre" },
  { value: 10, label: "Octubre" },
  { value: 11, label: "Noviembre" },
  { value: 12, label: "Diciembre" },
];

const SYSTEM_START_YEAR = 2026;
const SYSTEM_START_MONTH = 9; // Inicio de registros en Septiembre 2026

const currentYear = new Date().getFullYear();
const currentMonth = new Date().getMonth() + 1;

const formatCurrency = (amount) => {
  return new Intl.NumberFormat("es-BO", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount || 0);
};

const PayrollConsolidation = () => {
  const { companies } = useCompanies();
  const [activeCompanyId, setActiveCompanyId] = useState(null);
  const [selectedYear, setSelectedYear] = useState(currentYear);
  const [selectedMonth, setSelectedMonth] = useState(currentMonth);
  const [searchValue, setSearchValue] = useState("");
  const [selectedPayroll, setSelectedPayroll] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Anios disponibles
  const availableYears = useMemo(() => {
    const years = [];
    for (let y = currentYear; y >= SYSTEM_START_YEAR; y--) {
      years.push(y);
    }
    return years;
  }, []);

  // Meses disponibles
  const availableMonths = useMemo(() => {
    const startM = selectedYear === SYSTEM_START_YEAR ? SYSTEM_START_MONTH : 1;
    const endM = selectedYear === currentYear ? currentMonth : 12;
    return ALL_MONTHS.filter((m) => m.value >= startM && m.value <= endM);
  }, [selectedYear]);

  // Ajustar mes seleccionado si el mes actual no está disponible para ese año
  useEffect(() => {
    if (availableMonths.length > 0) {
      const exists = availableMonths.some((m) => m.value === selectedMonth);
      if (!exists) {
        setSelectedMonth(availableMonths[0].value);
      }
    }
  }, [availableMonths, selectedMonth]);

  // Inicializar automáticamente la primera empresa (SIN opción "Todas")
  useEffect(() => {
    if (companies.length > 0 && !activeCompanyId) {
      setActiveCompanyId(companies[0].id);
    }
  }, [companies, activeCompanyId]);

  const { payrolls, isLoading, updatePayroll } = usePayrolls(
    activeCompanyId,
    "consolidated",
    selectedYear,
    selectedMonth
  );

  const handleEditPayroll = (payroll) => {
    setSelectedPayroll(payroll);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedPayroll(null);
  };

  const handleSubmitModal = async (formData) => {
    if (selectedPayroll) {
      const result = await updatePayroll(selectedPayroll.id, formData);
      if (result) {
        handleCloseModal();
      }
    }
  };

  const filteredRows = useMemo(() => {
    const search = searchValue.trim().toLowerCase();
    if (!search) return payrolls;
    return payrolls.filter((row) =>
      `${row.employeeName} ${row.employeeDocumentNumber} ${row.jobTitleName} ${row.employeeType}`
        .toLowerCase()
        .includes(search)
    );
  }, [payrolls, searchValue]);

  const totals = useMemo(() => {
    return filteredRows.reduce(
      (acc, row) => ({
        baseSalary: acc.baseSalary + Number(row.baseSalary || 0),
        earnedSalary: acc.earnedSalary + Number(row.earnedSalary || 0),
        totalBonuses: acc.totalBonuses + Number(row.seniorityBonus || 0) + Number(row.otherBonuses || 0),
        grossPay: acc.grossPay + Number(row.grossPay || 0),
        afpDeduction: acc.afpDeduction + Number(row.afpDeduction || 0),
        totalDeductions: acc.totalDeductions + Number(row.totalDeductions || 0),
        netSalary: acc.netSalary + Number(row.netSalary || 0),
      }),
      {
        baseSalary: 0,
        earnedSalary: 0,
        totalBonuses: 0,
        grossPay: 0,
        afpDeduction: 0,
        totalDeductions: 0,
        netSalary: 0,
      }
    );
  }, [filteredRows]);

  const columns = useMemo(
    () => [
      {
        field: "employeeName",
        headerName: "Empleado",
        minWidth: 200,
        flex: 1.2,
        renderCell: ({ row }) => (
          <CellStack>
            <CellTitle>{row.employeeName}</CellTitle>
            <CellText>CI: {row.employeeDocumentNumber}</CellText>
          </CellStack>
        ),
      },
      {
        field: "hireDate",
        headerName: "Fecha de ingreso",
        minWidth: 135,
        valueGetter: (_, row) =>
          row.hireDate ? row.hireDate.split("-").reverse().join("/") : "-",
      },
      {
        field: "employeeType",
        headerName: "Tipo empleado",
        minWidth: 125,
      },
      {
        field: "baseSalary",
        headerName: "Haber básico",
        minWidth: 120,
        valueGetter: (_, row) => formatCurrency(row.baseSalary),
      },
      {
        field: "workedDays",
        headerName: "Días trab.",
        minWidth: 95,
      },
      {
        field: "earnedSalary",
        headerName: "Sueldo básico",
        minWidth: 120,
        valueGetter: (_, row) => formatCurrency(row.earnedSalary),
      },
      {
        field: "seniorityBonus",
        headerName: "Bono antigüedad",
        minWidth: 140,
        valueGetter: (_, row) => formatCurrency(row.seniorityBonus),
      },
      {
        field: "otherBonuses",
        headerName: "Otros bonos",
        minWidth: 115,
        valueGetter: (_, row) => formatCurrency(row.otherBonuses),
      },
      {
        field: "grossPay",
        headerName: "Total ganado",
        minWidth: 125,
        valueGetter: (_, row) => formatCurrency(row.grossPay),
      },
      {
        field: "afpDeduction",
        headerName: "Gestora (AFP)",
        minWidth: 115,
        valueGetter: (_, row) => formatCurrency(row.afpDeduction),
      },
      {
        field: "absenceDeduction",
        headerName: "Permisos/Faltas",
        minWidth: 135,
        valueGetter: (_, row) => formatCurrency(row.absenceDeduction),
      },
      {
        field: "advanceDeduction",
        headerName: "Anticipos",
        minWidth: 110,
        valueGetter: (_, row) => formatCurrency(row.advanceDeduction),
      },
      {
        field: "totalDeductions",
        headerName: "Total desc.",
        minWidth: 125,
        valueGetter: (_, row) => formatCurrency(row.totalDeductions),
      },
      {
        field: "netSalary",
        headerName: "Líquido pagable",
        minWidth: 140,
        valueGetter: (_, row) => formatCurrency(row.netSalary),
      },
      {
        field: "status",
        headerName: "Estado",
        minWidth: 110,
        renderCell: ({ row }) => {
          const variants = {
            DRAFT: "secondary",
            GENERATED: "info",
            APPROVED: "warning",
            PAID: "success",
            CANCELLED: "danger",
          };
          const labels = {
            DRAFT: "Borrador",
            GENERATED: "Generado",
            APPROVED: "Aprobado",
            PAID: "Pagado",
            CANCELLED: "Cancelado",
          };
          return (
            <Badge $variant={variants[row.status] || "secondary"}>
              {labels[row.status] || row.status}
            </Badge>
          );
        },
      },
      {
        field: "actions",
        headerName: "Acciones",
        width: 90,
        sortable: false,
        filterable: false,
        disableColumnMenu: true,
        renderCell: ({ row }) => (
          <TableActions>
            <TableActionButton
              type="button"
              title="Editar nómina"
              onClick={(e) => {
                e.stopPropagation();
                handleEditPayroll(row);
              }}
            >
              <Pencil size={18} />
            </TableActionButton>
          </TableActions>
        ),
      },
    ],
    []
  );

  return (
    <>
      <PageContainer>
        <PageHeader>
          <PageTitle>Planilla Consolidada</PageTitle>

          <PageActions>
            <PeriodSelector>
              <Calendar size={16} color="#2f573c" />
              <PeriodSelect
                value={selectedMonth}
                onChange={(e) => setSelectedMonth(Number(e.target.value))}
              >
                {availableMonths.map((m) => (
                  <option key={m.value} value={m.value}>
                    {m.label}
                  </option>
                ))}
              </PeriodSelect>
              <PeriodSelect
                value={selectedYear}
                onChange={(e) => setSelectedYear(Number(e.target.value))}
              >
                {availableYears.map((y) => (
                  <option key={y} value={y}>
                    {y}
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

        <TotalsGrid>
          <TotalCard>
            <TotalLabel>Haber Básico</TotalLabel>
            <TotalValue>Bs {formatCurrency(totals.baseSalary)}</TotalValue>
          </TotalCard>
          <TotalCard>
            <TotalLabel>Sueldo Básico</TotalLabel>
            <TotalValue>Bs {formatCurrency(totals.earnedSalary)}</TotalValue>
          </TotalCard>
          <TotalCard>
            <TotalLabel>Total Bonos</TotalLabel>
            <TotalValue>Bs {formatCurrency(totals.totalBonuses)}</TotalValue>
          </TotalCard>
          <TotalCard $variant="dark">
            <TotalLabel $variant="dark">Total Ganado</TotalLabel>
            <TotalValue $variant="dark">Bs {formatCurrency(totals.grossPay)}</TotalValue>
          </TotalCard>
          <TotalCard $variant="danger">
            <TotalLabel $variant="danger">Total Gestora</TotalLabel>
            <TotalValue $variant="danger">Bs {formatCurrency(totals.afpDeduction)}</TotalValue>
          </TotalCard>
          <TotalCard $variant="danger">
            <TotalLabel $variant="danger">Total Descuentos</TotalLabel>
            <TotalValue $variant="danger">Bs {formatCurrency(totals.totalDeductions)}</TotalValue>
          </TotalCard>
          <TotalCard $variant="highlight">
            <TotalLabel $variant="highlight">Líquido Pagable</TotalLabel>
            <TotalValue $variant="highlight">Bs {formatCurrency(totals.netSalary)}</TotalValue>
          </TotalCard>
        </TotalsGrid>

        <FiltersWrapper>
          <ChipFilters>
            {/* SIN opción "Todas", directo empresas */}
            {companies.map((company) => (
              <ChipFilterButton
                key={company.id}
                type="button"
                $active={Number(activeCompanyId) === company.id}
                onClick={() => setActiveCompanyId(company.id)}
              >
                {company.name}
              </ChipFilterButton>
            ))}
          </ChipFilters>
        </FiltersWrapper>

        <DataTable
          rows={filteredRows}
          columns={columns}
          loading={isLoading}
          pageSize={30}
          pageSizeOptions={[30, 50, 100]}
          height="610px"
          rowHeight={60}
          columnHeaderHeight={58}
          disableColumnMenu
        />
      </PageContainer>

      <PayrollModal
        isOpen={isModalOpen}
        payroll={selectedPayroll}
        onClose={handleCloseModal}
        onSubmit={handleSubmitModal}
      />
    </>
  );
};

export default PayrollConsolidation;