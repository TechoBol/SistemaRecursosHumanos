import { useMemo, useState } from "react";
import { Search } from "lucide-react";

import DataTable from "../components/table/DataTable";

import {
  PageActions,
  PageContainer,
  PageHeader,
  PageTitle,
  SearchContainer,
  SearchInput,
} from "../components/ui/Page.styles";

const PayrollContract = () => {
  const [searchValue, setSearchValue] = useState("");

  // Datos temporales SOLO para visualizar la tabla
  const rows = [
    {
      id: 1,
      name: "Juan Pérez",
      hireDate: "15/03/2022",
      employeeType: "Fiscal",
      basicSalary: "5.000,00",
      workedDays: 30,
      earnedBasicSalary: "5.000,00",
      seniorityBonus: "150,00",
      otherBonuses: "300,00",
      totalEarned: "5.450,00",
      gestora: "692,15",
      permissionsAbsences: "0,00",
      advances: "500,00",
      totalDeductions: "1.192,15",
      netPayable: "4.257,85",
    },
    {
      id: 2,
      name: "María López",
      hireDate: "10/08/2024",
      employeeType: "Consultor",
      basicSalary: "4.500,00",
      workedDays: 28,
      earnedBasicSalary: "4.200,00",
      seniorityBonus: "0,00",
      otherBonuses: "200,00",
      totalEarned: "4.400,00",
      gestora: "558,36",
      permissionsAbsences: "150,00",
      advances: "0,00",
      totalDeductions: "708,36",
      netPayable: "3.691,64",
    },
  ];

  const filteredRows = useMemo(() => {
    const search = searchValue.trim().toLowerCase();

    if (!search) return rows;

    return rows.filter((row) =>
      `${row.name} ${row.employeeType}`
        .toLowerCase()
        .includes(search)
    );
  }, [searchValue]);

  const columns = useMemo(
    () => [
      {
        field: "name",
        headerName: "Nombre",
        minWidth: 190,
        flex: 1,
      },
      {
        field: "hireDate",
        headerName: "Fecha de ingreso",
        minWidth: 135,
      },
      {
        field: "employeeType",
        headerName: "Tipo empleado",
        minWidth: 135,
      },
      {
        field: "basicSalary",
        headerName: "Haber básico",
        minWidth: 120,
      },
      {
        field: "workedDays",
        headerName: "Días trabajados",
        minWidth: 125,
      },
      {
        field: "earnedBasicSalary",
        headerName: "Sueldo básico",
        minWidth: 120,
      },
      {
        field: "seniorityBonus",
        headerName: "Bono de antigüedad",
        minWidth: 155,
      },
      {
        field: "otherBonuses",
        headerName: "Otros bonos",
        minWidth: 115,
      },
      {
        field: "totalEarned",
        headerName: "Total ganado",
        minWidth: 120,
      },
      {
        field: "gestora",
        headerName: "Gestora",
        minWidth: 105,
      },
      {
        field: "permissionsAbsences",
        headerName: "Permisos/Faltas",
        minWidth: 145,
      },
      {
        field: "advances",
        headerName: "Anticipos",
        minWidth: 105,
      },
      {
        field: "totalDeductions",
        headerName: "Total descuentos",
        minWidth: 145,
      },
      {
        field: "netPayable",
        headerName: "Líquido pagable",
        minWidth: 140,
      },
    ],
    []
  );

  return (
    <PageContainer>
      <PageHeader>
        <PageTitle>Nóminas por contrato</PageTitle>
        
        <PageActions>
          <SearchContainer>
            <Search size={21} />
            <SearchInput
              type="search"
              value={searchValue}
              placeholder="Buscar"
              aria-label="Buscar empleado"
              onChange={(event) => setSearchValue(event.target.value)}
            />
          </SearchContainer>
        </PageActions>
      </PageHeader>

      <DataTable
        rows={filteredRows}
        columns={columns}
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

export default PayrollContract;