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
import UserModal from "../components/modals/UserModal";
import DataTable from "../components/table/DataTable";

const INITIAL_USERS = [
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

const createId = () => {
  if (
    typeof crypto !== "undefined" &&
    typeof crypto.randomUUID === "function"
  ) {
    return crypto.randomUUID();
  }
  return `${Date.now()}-${Math.random()}`;
};

const Users = () => {
  const [users, setUsers] = useState(INITIAL_USERS);
  const [searchValue, setSearchValue] = useState("");
  const [isUserModalOpen, setIsUserModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState("create");
  const [selectedUser, setSelectedUser] = useState(null);

  const filteredRows = useMemo(() => {
    const search = searchValue.trim().toLowerCase();
    if (!search) {
      return users;
    }
    return users.filter((user) => {
      const searchableContent = [
        user.firstName,
        user.lastName,
        user.email,
      ]
        .join(" ")
        .toLowerCase();

      return searchableContent.includes(search);
    });
  }, [searchValue, users]);

  const handleOpenCreateModal = () => {
    setSelectedUser(null);
    setModalMode("create");
    setIsUserModalOpen(true);
  };

  const handleOpenEditModal = (user) => {
    setSelectedUser(user);
    setModalMode("edit");
    setIsUserModalOpen(true);
  };

  const handleCloseModal = () => {
    setSelectedUser(null);
    setIsUserModalOpen(false);
  };

  const handleSaveUser = (userData) => {
    if (modalMode === "edit" && selectedUser) {
      setUsers((currentUsers) =>
        currentUsers.map((user) =>
          user.id === selectedUser.id
            ? {
                ...user,
                ...userData,
              }
            : user,
        ),
      );
    } else {
      setUsers((currentUsers) => [
        ...currentUsers,
        {
          id: createId(),
          ...userData,
        },
      ]);
    }

    handleCloseModal();
  };

  const handleDeleteUser = (user) => {
    const shouldDelete = window.confirm(
      `¿Deseas eliminar al usuario ${user.firstName} ${user.lastName}?`,
    );
    if (!shouldDelete) {
      return;
    }
    setUsers((currentUsers) =>
      currentUsers.filter(
        (currentUser) => currentUser.id !== user.id,
      ),
    );
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
                handleOpenEditModal(row);
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
              <Trash2 size={19} color="#FF2B2B" />
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
              onClick={handleOpenCreateModal}
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

      <UserModal
        isOpen={isUserModalOpen}
        mode={modalMode}
        user={selectedUser}
        onClose={handleCloseModal}
        onSubmit={handleSaveUser}
      />
    </>
  );
};

export default Users;