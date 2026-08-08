import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  ChevronRight,
  Pencil,
  Plus,
  Search,
} from "lucide-react";
import {
  Badge,
  CellStack,
  CellText,
  CellTitle,
  TableActionButton,
  TableActions,
} from "../components/ui/table/TableCell.styles";
import {
  AddButton,
  PageActions,
  PageContainer,
  PageHeader,
  PageTitle,
  SearchContainer,
  SearchInput,
} from "../components/ui/Page.styles";
import EmployeeModal from "../components/modals/EmployeeModal";
import DataTable from "../components/table/DataTable";

const initialEmployeeRows = [
  {
    id: 1,
    firstName: "Luis",
    lastName: "Perez",
    ci: "7854123",
    birthDate: "1998-04-12",
    status: "Activo",
    branch: "BARRIENTOS",
    area: "Tecnología",
    positionCurrent: "Auxiliar de Sistemas",
    contractCompany: "Empresa A",
    consolidatedCompany: "TechoBol",
    employeeType: "Planta",
    email: "luis@gmail.com",
    phone: "77777777",
    address: "Cochabamba",
    seniority: "2 meses 1 día",
    hiredAt: "Contratado: 6 de mayo de 2026",
    contractDate: "2026-05-06",
  },
  {
    id: 2,
    firstName: "María Fernanda",
    lastName: "López Vargas",
    ci: "8547123",
    birthDate: "1995-09-21",
    status: "Activo",
    branch: "CENTRAL",
    area: "Recursos Humanos",
    positionCurrent: "Analista de Recursos Humanos",
    contractCompany: "TechoBol",
    consolidatedCompany: "TechoBol",
    employeeType: "Planta",
    email: "maria.lopez@techobol.com",
    phone: "75984562",
    address: "La Paz",
    seniority: "1 año 3 meses",
    hiredAt: "Contratado: 15 de abril de 2025",
    contractDate: "2025-04-15",
  },
  {
    id: 3,
    firstName: "Carlos Andrés",
    lastName: "Mendoza Ruiz",
    ci: "7548962",
    birthDate: "1997-01-15",
    status: "Inactivo",
    branch: "NORTE",
    area: "Tecnología",
    positionCurrent: "Desarrollador Frontend",
    contractCompany: "Empresa B",
    consolidatedCompany: "TechoBol",
    employeeType: "Consultor",
    email: "carlos.mendoza@techobol.com",
    phone: "76451230",
    address: "Santa Cruz",
    seniority: "8 meses",
    hiredAt: "Contratado: 10 de noviembre de 2025",
    contractDate: "2025-11-10",
  },
];

const Employees = () => {
  const navigate = useNavigate();
  const [employees, setEmployees] = useState(initialEmployeeRows);
  const [searchValue, setSearchValue] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState("create");
  const [selectedEmployee, setSelectedEmployee] = useState(null);

  const handleAddEmployee = () => {
    setSelectedEmployee(null);
    setModalMode("create");
    setIsModalOpen(true);
  };

  const handleEditEmployee = (employee) => {
    setSelectedEmployee(employee);
    setModalMode("edit");
    setIsModalOpen(true);
  };

  const handleViewEmployee = (employee) => {
    navigate(`/empleados/${employee.id}`, {
      state: { employee },
    });
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedEmployee(null);
  };

  const handleSubmitEmployee = (employeeData) => {
    if (modalMode === "edit") {
      setEmployees((currentEmployees) =>
        currentEmployees.map((employee) =>
          employee.id === employeeData.id
            ? {
                ...employee,
                ...employeeData,
                positionCurrent: employeeData.currentPosition,
              }
            : employee,
        ),
      );
    } else {
      const newEmployee = {
        ...employeeData,
        id: Date.now(),
        status: "Activo",
        positionCurrent: employeeData.currentPosition,
        seniority: "0 días",
        hiredAt: employeeData.contractDate
          ? `Contratado: ${employeeData.contractDate}`
          : "Sin fecha de contratación",
      };
      setEmployees((currentEmployees) => [
        ...currentEmployees,
        newEmployee,
      ]);
    }
    handleCloseModal();
  };

  const filteredRows = useMemo(() => {
    const search = searchValue.trim().toLowerCase();
    if (!search) {
      return employees;
    }
    return employees.filter((employee) =>
      Object.values(employee).some((value) =>
        String(value ?? "")
          .toLowerCase()
          .includes(search),
      ),
    );
  }, [employees, searchValue]);

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
        field: "positionCurrent",
        headerName: "Cargo actual",
        minWidth: 190,
        flex: 1.1,
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
    <>
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

      <EmployeeModal
        isOpen={isModalOpen}
        mode={modalMode}
        employee={selectedEmployee}
        onClose={handleCloseModal}
        onSubmit={handleSubmitEmployee}
      />
    </>
  );
};

export default Employees;