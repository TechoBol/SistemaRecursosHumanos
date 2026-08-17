import { useMemo, useState } from "react";
import {
  Pencil,
  Search,
  Trash2,
  UserPlus,
} from "lucide-react";
import Swal from "sweetalert2";
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
import { useUsers } from "../hooks/useUsers";
import { useRoles } from "../hooks/useRoles";

const Users = () => {
  const { users, isLoading, createUser, updateUser, deleteUser } = useUsers();
  const { roles } = useRoles();
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
        user.role?.name,
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

  const handleSaveUser = async (userData) => {
    if (modalMode === "edit" && selectedUser) {
      await updateUser(selectedUser.id, userData);
    } else {
      await createUser(userData);
    }
    handleCloseModal();
  };

  const handleDeleteUser = (user) => {
    Swal.fire({
      title: "¿Estás seguro?",
      text: `¿Deseas eliminar al usuario ${user.firstName} ${user.lastName}?`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#2F573C",
      cancelButtonColor: "#D32F2F",
      confirmButtonText: "Sí, eliminar",
      cancelButtonText: "Cancelar"
    }).then(async (result) => {
      if (result.isConfirmed) {
        await deleteUser(user.id);
      }
    });
  };

  const columns = useMemo(
    () => [
      {
        field: "firstName",
        headerName: "Nombre",
        minWidth: 160,
        flex: 0.8,
      },
      {
        field: "lastName",
        headerName: "Apellido",
        minWidth: 180,
        flex: 1,
      },
      {
        field: "email",
        headerName: "Correo",
        minWidth: 260,
        flex: 1.3,
      },
      {
        field: "role",
        headerName: "Rol",
        minWidth: 160,
        flex: 0.8,
        renderCell: ({ row }) => row.role?.name || "Sin Rol",
      },
      {
        field: "isActive",
        headerName: "Estado",
        minWidth: 120,
        flex: 0.6,
        renderCell: ({ row }) => (
          <span
            style={{
              color: row.isActive ? "#2E7D32" : "#D32F2F",
              fontWeight: "600",
            }}
          >
            {row.isActive ? "Activo" : "Inactivo"}
          </span>
        ),
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

            {row.isActive && (
              <TableActionButton
                type="button"
                title="Eliminar usuario"
                aria-label={`Desactivar a ${row.firstName} ${row.lastName}`}
                onClick={(event) => {
                  event.stopPropagation();
                  handleDeleteUser(row);
                }}
              >
                <Trash2 size={19} color="#FF2B2B" />
              </TableActionButton>
            )}
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
          loading={isLoading}
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
        roles={roles}
        onClose={handleCloseModal}
        onSubmit={handleSaveUser}
      />
    </>
  );
};

export default Users;