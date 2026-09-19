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
} from "../components/ui/Page.styles";

import {
  CellStack,
  CellText,
  CellTitle,
  TableActionButton,
  TableActions,
  Badge,
} from "../components/ui/table/TableCell.styles";

const PeriodSelector = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  background-color: #ffffff;
  border: 1px solid #e2e8f0;
  border-radius: 999px;
  padding: 4px 14px;
`;

const PeriodSelect = styled.select`
  border: none;
  background: transparent;
  font-family: inherit;
  font-size: 13px;
  font-weight: 600;
  color: #2f573c;
  outline: none;
  cursor: pointer;
`;

const MONTHS = [
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

const currentYear = new Date().getFullYear();
const currentMonth = new Date().getMonth() + 1;
const YEARS = [currentYear - 1, currentYear, currentYear + 1];

const formatCurrency = (amount) => {
  return new Intl.NumberFormat("es-BO", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount || 0);
};

const PayrollContract = () => {
  const { companies } = useCompanies();
  const [activeCompanyId, setActiveCompanyId] = useState(null);
  const [selectedYear, setSelectedYear] = useState(currentYear);
  const [selectedMonth, setSelectedMonth] = useState(currentMonth);
  const [searchValue, setSearchValue] = useState("");

  const [selectedPayroll, setSelectedPayroll] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Inicializar automáticamente la primera empresa (SIN opción "Todas")
  useEffect(() => {
    if (companies.length > 0 && !activeCompanyId) {
      setActiveCompanyId(companies[0].id);
    }
  }, [companies, activeCompanyId]);

  const { payrolls, isLoading, updatePayroll } = usePayrolls(
    activeCompanyId,
    "contract",
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
          <PageTitle>Nóminas por contrato</PageTitle>

          <PageActions>
            <PeriodSelector>
              <Calendar size={16} color="#2f573c" />
              <PeriodSelect
                value={selectedMonth}
                onChange={(e) => setSelectedMonth(Number(e.target.value))}
              >
                {MONTHS.map((m) => (
                  <option key={m.value} value={m.value}>
                    {m.label}
                  </option>
                ))}
              </PeriodSelect>
              <PeriodSelect
                value={selectedYear}
                onChange={(e) => setSelectedYear(Number(e.target.value))}
              >
                {YEARS.map((y) => (
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

export default PayrollContract;