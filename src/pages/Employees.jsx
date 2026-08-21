import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  ChevronRight,
  Pencil,
  Plus,
  Search,
  FileText,
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
  ChipFilters,
  ChipFilterButton,
  FiltersWrapper,
  PageActions,
  PageContainer,
  PageHeader,
  PageTitle,
  SearchContainer,
  SearchInput,
  SwitchFilters,
  SwitchFilterButton,
} from "../components/ui/Page.styles";
import EmployeeModal from "../components/modals/EmployeeModal";
import DataTable from "../components/table/DataTable";
import { getSeniorityShort, formatLongDate } from "../utils/dateUtils";
import { useEmployees } from "../hooks/useEmployees";
import { useCompanies } from "../hooks/useCompanies";
import { useBranches } from "../hooks/useBranches";
import { useAreas } from "../hooks/useAreas";
import { useJobTitles } from "../hooks/useJobTitles";

const Employees = () => {
  const navigate = useNavigate();
  const { employees, isLoading, createEmployee, updateEmployee } = useEmployees();
  const { companies } = useCompanies();
  const { branches } = useBranches();
  const { areas } = useAreas();
  const { jobTitles } = useJobTitles();

  const [searchValue, setSearchValue] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState("create");
  const [selectedEmployee, setSelectedEmployee] = useState(null);

  // Filtro por defecto en "all" (Todas)
  const [activeCompanyFilter, setActiveCompanyFilter] = useState("all");
  const [filterType, setFilterType] = useState("contract"); // "contract" o "consolidated"

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

  const handleSubmitEmployee = async (employeeData) => {
    if (modalMode === "edit" && selectedEmployee) {
      await updateEmployee(selectedEmployee.id, employeeData);
    } else {
      await createEmployee(employeeData);
    }
    handleCloseModal();
  };

  const filteredRows = useMemo(() => {
    const search = searchValue.trim().toLowerCase();
    
    return employees.filter((employee) => {
      const activeContract = employee.contracts ? employee.contracts.find((c) => c.isActive) : null;
      
      // Filtrar por la empresa seleccionada en los chips
      let matchesCompany = true;
      if (activeCompanyFilter !== "all") {
        const companyIdNum = Number(activeCompanyFilter);
        if (filterType === "contract") {
          matchesCompany = activeContract && activeContract.contractCompanyId === companyIdNum;
        } else {
          matchesCompany = activeContract && activeContract.consolidatedCompanyId === companyIdNum;
        }
      }

      const searchableContent = [
        employee.firstNames,
        employee.lastNames,
        employee.documentNumber,
        employee.email,
        employee.phone,
        activeContract?.branch?.name,
        activeContract?.area?.name,
        activeContract?.jobTitle?.name,
      ]
        .join(" ")
        .toLowerCase();

      const matchesSearch = !search || searchableContent.includes(search);

      return matchesCompany && matchesSearch;
    });
  }, [employees, searchValue, activeCompanyFilter, filterType]);

  const columns = useMemo(
    () => [
      {
        field: "employee",
        headerName: "Empleado",
        minWidth: 240,
        flex: 1.4,
        sortable: false,
        valueGetter: (_, row) => `${row.firstNames} ${row.lastNames}`,
        renderCell: ({ row }) => {
          const activeContract = row.contracts ? row.contracts.find((c) => c.isActive) : null;
          const hiredText = activeContract?.hireDate
            ? `Contratado: ${formatLongDate(activeContract.hireDate)}`
            : "Sin contratación";
          return (
            <CellStack>
              <CellTitle>{row.firstNames} {row.lastNames}</CellTitle>
              <CellText>{hiredText}</CellText>
            </CellStack>
          );
        },
      },
      {
        field: "status",
        headerName: "Estado",
        width: 105,
        valueGetter: (_, row) => (row.status === "ACTIVE" ? "Activo" : "Inactivo"),
        renderCell: ({ value }) => (
          <Badge
            $variant={value === "Activo" ? "success" : "danger"}
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
        valueGetter: (_, row) => {
          const activeContract = row.contracts ? row.contracts.find((c) => c.isActive) : null;
          return activeContract?.branch?.name || "No seleccionada";
        },
      },
      {
        field: "area",
        headerName: "Área",
        minWidth: 145,
        flex: 0.8,
        valueGetter: (_, row) => {
          const activeContract = row.contracts ? row.contracts.find((c) => c.isActive) : null;
          return activeContract?.area?.name || "No seleccionada";
        },
      },
      {
        field: "positionCurrent",
        headerName: "Cargo actual",
        minWidth: 190,
        flex: 1.1,
        valueGetter: (_, row) => {
          const activeContract = row.contracts ? row.contracts.find((c) => c.isActive) : null;
          return activeContract?.jobTitle?.name || "No seleccionado";
        },
      },
      {
        field: "contact",
        headerName: "Contacto",
        minWidth: 220,
        flex: 1.2,
        sortable: false,
        renderCell: ({ row }) => (
          <CellStack>
            <CellText>{row.email || "Correo NO registrado"}</CellText>
            <CellText>{row.phone || "Celular NO registrado"}</CellText>
          </CellStack>
        ),
      },
      {
        field: "seniority",
        headerName: "Antigüedad",
        minWidth: 130,
        flex: 0.7,
        valueGetter: (_, row) => {
          const activeContract = row.contracts ? row.contracts.find((c) => c.isActive) : null;
          return getSeniorityShort(activeContract?.hireDate);
        },
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
              aria-label={`Editar a ${row.firstNames} ${row.lastNames}`}
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
              aria-label={`Ver detalle de ${row.firstNames} ${row.lastNames}`}
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

        <FiltersWrapper>
          <ChipFilters>
            <ChipFilterButton
              type="button"
              $active={activeCompanyFilter === "all"}
              onClick={() => setActiveCompanyFilter("all")}
            >
              Todas
            </ChipFilterButton>
            {companies.map((c) => (
              <ChipFilterButton
                key={c.id}
                type="button"
                $active={String(activeCompanyFilter) === String(c.id)}
                onClick={() => setActiveCompanyFilter(c.id)}
              >
                {c.name}
              </ChipFilterButton>
            ))}
          </ChipFilters>

          {activeCompanyFilter !== "all" && (
            <SwitchFilters>
              <SwitchFilterButton
                type="button"
                $active={filterType === "contract"}
                onClick={() => setFilterType("contract")}
              >
                <FileText size={16} />
                Contrato
              </SwitchFilterButton>
              <SwitchFilterButton
                type="button"
                $active={filterType === "consolidated"}
                onClick={() => setFilterType("consolidated")}
              >
                <FileText size={16} />
                Consolidación
              </SwitchFilterButton>
            </SwitchFilters>
          )}
        </FiltersWrapper>

        <DataTable
          rows={filteredRows}
          columns={columns}
          loading={isLoading}
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
        companies={companies}
        branches={branches}
        areas={areas}
        jobTitles={jobTitles}
        onClose={handleCloseModal}
        onSubmit={handleSubmitEmployee}
      />
    </>
  );
};

export default Employees;