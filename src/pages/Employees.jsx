import { useMemo, useState } from "react";
import {
  ChevronRight,
  Pencil,
  Plus,
  Search,
} from "lucide-react";
import {
  Badge,
  CellStack,
  CellStrongText,
  CellText,
  CellTitle,
  TableActionButton,
  TableActions,
} from "../components/ui/TableCell.styles";
import {
  AddButton,
  PageActions,
  PageContainer,
  PageHeader,
  PageTitle,
  SearchContainer,
  SearchInput,
} from "../components/ui/Page.styles";
import DataTable from "../components/table/DataTable";

const employeeRows = [
  {
    id: 1,
    firstName: "Luis",
    lastName: "Perez",
    status: "Activo",
    branch: "BARRIENTOS",
    area: "Tecnología",
    positionCurrent: "Auxiliar de Sistemas",
    positionContract: "Auxiliar de sistemas",
    email: "luis@gmail.com",
    phone: "77777777",
    seniority: "2 meses 1 día",
    hiredAt: "Contratado: 6 de mayo de 2026",
  },
  {
    id: 2,
    firstName: "María Fernanda",
    lastName: "López Vargas",
    status: "Activo",
    branch: "CENTRAL",
    area: "Recursos Humanos",
    positionCurrent: "Analista de Recursos Humanos",
    positionContract: "Recursos Humanos",
    email: "maria.lopez@techobol.com",
    phone: "75984562",
    seniority: "1 año 3 meses",
    hiredAt: "Contratado: 15 de abril de 2025",
  },
  {
    id: 3,
    firstName: "Carlos Andrés",
    lastName: "Mendoza Ruiz",
    status: "Inactivo",
    branch: "NORTE",
    area: "Tecnología",
    positionCurrent: "Desarrollador Frontend",
    positionContract: "Desarrollo",
    email: "carlos.mendoza@techobol.com",
    phone: "76451230",
    seniority: "8 meses",
    hiredAt: "Contratado: 10 de noviembre de 2025",
  },
];

const Employees = () => {
  const [searchValue, setSearchValue] = useState("");

  const handleAddEmployee = () => {
    console.log("Añadir empleado");
  };

  const handleEditEmployee = (employee) => {
    console.log("Editar empleado:", employee);
  };

  const handleViewEmployee = (employee) => {
    console.log("Ver empleado:", employee);
  };

  const filteredRows = useMemo(() => {
    const search = searchValue.trim().toLowerCase();
    if (!search) {
      return employeeRows;
    }
    return employeeRows.filter((employee) =>
      Object.values(employee).some((value) =>
        String(value).toLowerCase().includes(search),
      ),
    );
  }, [searchValue]);

  const columns = useMemo(
    () => [
      {
        field: "employee",
        headerName: "Empleado",
        minWidth: 240,
        flex: 1.4,
        sortable: false,
        valueGetter: (_, row) =>
          `${row.firstName} ${row.lastName}`,
        renderCell: ({ row }) => (
          <CellStack>
            <CellTitle>{row.firstName} {row.lastName}</CellTitle>
            <CellText>{row.hiredAt}</CellText>
          </CellStack>
        ),
      },
      {
        field: "status",
        headerName: "Estado",
        width: 105,
        renderCell: ({ value }) => (
          <Badge
            $variant={ value === "Activo" ? "success" : "danger" }
          >
            {value}
          </Badge>
        ),
      },
      {
        field: "branch",
        headerName: "Sucursal",
        minWidth: 130,
        flex: 0.7,
      },
      {
        field: "area",
        headerName: "Área",
        minWidth: 145,
        flex: 0.8,
      },
      {
        field: "position",
        headerName: "Cargo actual",
        minWidth: 190,
        flex: 1.1,
        renderCell: ({ row }) => (
          <CellStack>
            <CellText>{row.positionCurrent}</CellText>
          </CellStack>
        ),
      },
      {
        field: "contact",
        headerName: "Contacto",
        minWidth: 220,
        flex: 1.2,
        sortable: false,
        renderCell: ({ row }) => (
          <CellStack>
            <CellText>{row.email}</CellText>
            <CellText>{row.phone}</CellText>
          </CellStack>
        ),
      },
      {
        field: "seniority",
        headerName: "Antigüedad",
        minWidth: 130,
        flex: 0.7,
      },
      {
        field: "actions",
        headerName: "Acciones",
        width: 120,
        sortable: false,
        filterable: false,
        disableColumnMenu: true,
        renderCell: ({ row }) => (
          <TableActions>
            <TableActionButton
              type="button"
              title="Editar empleado"
              aria-label={`Editar a ${row.firstName} ${row.lastName}`}
              onClick={(event) => {
                event.stopPropagation();
                handleEditEmployee(row);
              }}
            >
              <Pencil size={19} />
            </TableActionButton>
            <TableActionButton
              type="button"
              title="Ver detalle"
              aria-label={`Ver detalle de ${row.firstName} ${row.lastName}`}
              onClick={(event) => {
                event.stopPropagation();
                handleViewEmployee(row);
              }}
            >
              <ChevronRight size={23} />
            </TableActionButton>
          </TableActions>
        ),
      },
    ],
    [],
  );

  return (
    <PageContainer>
      <PageHeader>
        <PageTitle>Empleados</PageTitle>
        <PageActions>
          <SearchContainer>
            <Search size={21} />
            <SearchInput
              type="search"
              value={searchValue}
              placeholder="Buscar"
              aria-label="Buscar empleado"
              onChange={(event) =>
                setSearchValue(event.target.value)
              }
            />
          </SearchContainer>
          <AddButton
            type="button"
            onClick={handleAddEmployee}
          >
            <Plus size={19} />
            Añadir empleado
          </AddButton>
        </PageActions>
      </PageHeader>

      <DataTable
        rows={filteredRows}
        columns={columns}
        pageSize={10}
        pageSizeOptions={[10, 25, 30, 50]}
        height="610px"
        rowHeight={72}
        columnHeaderHeight={58}
        disableColumnMenu
      />
    </PageContainer>
  );
};

export default Employees;