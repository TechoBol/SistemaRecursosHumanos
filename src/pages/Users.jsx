import { useMemo, useState } from "react";
import {
  Pencil,
  Search,
  Trash2,
  UserPlus,
} from "lucide-react";
import {
  AddButton,
  PageActions,
  PageContainer,
  PageHeader,
  PageTitle,
  SearchContainer,
  SearchInput,
} from "../components/ui/Page.styles";
import {
  TableActionButton,
  TableActions,
} from "../components/ui/table/TableCell.styles";
import DataTable from "../components/table/DataTable";

const USER_ROWS = [
  {
    id: 1,
    firstName: "Juan",
    lastName: "Perez",
    email: "juan@gmail.com",
  },
  {
    id: 2,
    firstName: "Lucia",
    lastName: "Garcia",
    email: "lucia@gmail.com",
  },
];

const Users = () => {
  const [searchValue, setSearchValue] = useState("");

  const filteredRows = useMemo(() => {
    const search = searchValue.trim().toLowerCase();
    if (!search) {
      return USER_ROWS;
    }
    return USER_ROWS.filter((user) =>
      Object.values(user).some((value) =>
        String(value).toLowerCase().includes(search),
      ),
    );
  }, [searchValue]);

  const handleRegisterUser = () => {
    console.log("Registrar usuario");
  };

  const handleEditUser = (user) => {
    console.log("Editar usuario:", user);
  };

  const handleDeleteUser = (user) => {
    const shouldDelete = window.confirm(
      `¿Deseas eliminar al usuario ${user.firstName} ${user.lastName}?`,
    );
    if (!shouldDelete) {
      return;
    }
    console.log("Eliminar usuario:", user);
  };

  const columns = useMemo(
    () => [
      {
        field: "firstName",
        headerName: "Nombre",
        minWidth: 180,
        flex: 0.8,
      },
      {
        field: "lastName",
        headerName: "Apellido",
        minWidth: 220,
        flex: 1,
      },
      {
        field: "email",
        headerName: "Correo",
        minWidth: 280,
        flex: 1.4,
      },
      {
        field: "actions",
        headerName: "Acciones",
        width: 140,
        sortable: false,
        filterable: false,
        disableColumnMenu: true,
        renderCell: ({ row }) => (
          <TableActions>
            <TableActionButton
              type="button"
              title="Editar usuario"
              aria-label={`Editar a ${row.firstName} ${row.lastName}`}
              onClick={(event) => {
                event.stopPropagation();
                handleEditUser(row);
              }}
            >
              <Pencil size={19} />
            </TableActionButton>

            <TableActionButton
              type="button"
              title="Eliminar usuario"
              aria-label={`Eliminar a ${row.firstName} ${row.lastName}`}
              onClick={(event) => {
                event.stopPropagation();
                handleDeleteUser(row);
              }}
            >
              <Trash2
                size={19}
                color="#FF2B2B"
              />
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
        <PageTitle>Usuarios</PageTitle>
        <PageActions>
          <SearchContainer>
            <Search size={20} />
            <SearchInput
              type="search"
              value={searchValue}
              placeholder="Buscar"
              aria-label="Buscar usuario"
              onChange={(event) =>
                setSearchValue(event.target.value)
              }
            />
          </SearchContainer>
          <AddButton
            type="button"
            onClick={handleRegisterUser}
          >
            <UserPlus size={18} />
            Registrar usuario
          </AddButton>
        </PageActions>
      </PageHeader>

      <DataTable
        rows={filteredRows}
        columns={columns}
        pageSize={10}
        pageSizeOptions={[10, 25, 30, 50]}
        height="610px"
        rowHeight={70}
        columnHeaderHeight={56}
        disableColumnMenu
      />
    </PageContainer>
  );
};

export default Users;