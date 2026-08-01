import { useMemo, useState } from "react";
import Swal from "sweetalert2";
import {
  Building2,
  MapPin,
  Pencil,
  Plus,
  Search,
  Trash2,
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
  CatalogActionButton,
  CatalogActions,
  CatalogBadge,
  CatalogBadgeList,
  CatalogColumn,
  CatalogContainer,
  CatalogDescription,
  CatalogEmpty,
  CatalogFilterButton,
  CatalogFilters,
  CatalogHeader,
  CatalogIcon,
  CatalogInfo,
  CatalogList,
  CatalogMain,
  CatalogMeta,
  CatalogRow,
  CatalogTable,
  CatalogTitle,
} from "../components/ui/CatalogList.styles";
import BranchModal from "../components/modals/BranchModal";
import { useBranches } from "../hooks/useBranches";
import { useCities } from "../hooks/useCities";
import { useCompanies } from "../hooks/useCompanies";

const BRANCH_COLUMNS = `
  minmax(320px, 1.6fr)
  minmax(130px, 0.7fr)
  minmax(170px, 0.9fr)
  110px
`;

const Branches = () => {
  const { branches, isLoading, createBranch, updateBranch, deleteBranch } = useBranches();
  const { cities, isLoading: isCitiesLoading } = useCities();
  const { companies, isLoading: isCompaniesLoading } = useCompanies();

  const [searchValue, setSearchValue] = useState("");
  const [selectedCity, setSelectedCity] = useState("all");
  const [isBranchModalOpen, setIsBranchModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState("create");
  const [selectedBranch, setSelectedBranch] = useState(null);

  const cityFilters = useMemo(() => {
    return [
      { id: "all", label: "Todos" },
      ...cities.map((city) => ({ id: String(city.id), label: city.name })),
    ];
  }, [cities]);

  const filteredBranches = useMemo(() => {
    const search = searchValue.trim().toLowerCase();
    return branches.filter((branch) => {
      const matchesCity =
        selectedCity === "all" ||
        String(branch.cityId) === selectedCity;

      const companyNames = branch.companies
        ? branch.companies.map((cb) => cb.company?.name || "")
        : [];

      const searchableContent = [
        branch.name,
        branch.description,
        branch.address,
        branch.city?.name || "",
        ...companyNames,
      ]
        .join(" ")
        .toLowerCase();

      const matchesSearch = !search || searchableContent.includes(search);
      return matchesCity && matchesSearch;
    });
  }, [branches, searchValue, selectedCity]);

  const handleAddBranch = () => {
    setSelectedBranch(null);
    setModalMode("create");
    setIsBranchModalOpen(true);
  };

  const handleEditBranch = (branch) => {
    setSelectedBranch(branch);
    setModalMode("edit");
    setIsBranchModalOpen(true);
  };

  const handleCloseBranchModal = () => {
    setIsBranchModalOpen(false);
    setSelectedBranch(null);
  };

  const handleSaveBranch = async (branchData) => {
    if (modalMode === "edit" && selectedBranch) {
      await updateBranch(selectedBranch.id, branchData);
    } else {
      await createBranch(branchData);
    }
    handleCloseBranchModal();
  };

  const handleDeleteBranch = (branch) => {
    Swal.fire({
      title: "¿Estás seguro?",
      text: `¿Deseas desactivar la sucursal ${branch.name}?`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#2F573C",
      cancelButtonColor: "#D32F2F",
      confirmButtonText: "Sí, desactivar",
      cancelButtonText: "Cancelar"
    }).then(async (result) => {
      if (result.isConfirmed) {
        await deleteBranch(branch.id);
      }
    });
  };

  const showLoading = isLoading || isCitiesLoading || isCompaniesLoading;

  return (
    <>
      <PageContainer>
        <PageHeader>
          <PageTitle>Sucursales</PageTitle>
          <PageActions>
            <SearchContainer>
              <Search size={20} />
              <SearchInput
                type="search"
                value={searchValue}
                placeholder="Buscar"
                aria-label="Buscar sucursal"
                onChange={(event) => setSearchValue(event.target.value)}
              />
            </SearchContainer>
            <AddButton
              type="button"
              onClick={handleAddBranch}
            >
              <Plus size={18} />
              Añadir sucursal
            </AddButton>
          </PageActions>
        </PageHeader>

        <CatalogFilters aria-label="Filtrar por ciudad">
          {cityFilters.map((filter) => (
            <CatalogFilterButton
              key={filter.id}
              type="button"
              $active={selectedCity === filter.id}
              aria-pressed={selectedCity === filter.id}
              onClick={() => setSelectedCity(filter.id)}
            >
              {filter.label}
            </CatalogFilterButton>
          ))}
        </CatalogFilters>

        <CatalogContainer>
          <CatalogTable $minWidth="900px">
            <CatalogHeader $columns={BRANCH_COLUMNS} aria-hidden="true">
              <span>Sucursal</span>
              <span>Ciudad</span>
              <span>Empresas</span>
              <span>Acciones</span>
            </CatalogHeader>
            {showLoading ? (
              <CatalogEmpty>Cargando sucursales...</CatalogEmpty>
            ) : filteredBranches.length === 0 ? (
              <CatalogEmpty>No se encontraron sucursales.</CatalogEmpty>
            ) : (
              <CatalogList>
                {filteredBranches.map((branch) => (
                  <CatalogRow key={branch.id} $columns={BRANCH_COLUMNS}>
                    <CatalogMain>
                      <CatalogIcon>
                        <Building2 size={29} strokeWidth={1.8} />
                      </CatalogIcon>

                      <CatalogInfo>
                        <CatalogTitle>{branch.name}</CatalogTitle>
                        <CatalogDescription>{branch.description}</CatalogDescription>
                        <CatalogMeta>
                          <MapPin size={16} strokeWidth={1.8} />
                          <span>{branch.address}</span>
                        </CatalogMeta>
                      </CatalogInfo>
                    </CatalogMain>

                    <CatalogColumn data-label="Ciudad">
                      {branch.city?.name || "Sin Ciudad"}
                    </CatalogColumn>

                    <CatalogColumn data-label="Empresas">
                      <CatalogBadgeList>
                        {branch.companies &&
                          branch.companies.map((cb) => (
                            <CatalogBadge key={`${branch.id}-${cb.company?.id}`}>
                              {cb.company?.name || "Sin Empresa"}
                            </CatalogBadge>
                          ))}
                      </CatalogBadgeList>
                    </CatalogColumn>

                    <CatalogActions>
                      <CatalogActionButton
                        type="button"
                        title="Editar sucursal"
                        aria-label={`Editar sucursal ${branch.name}`}
                        onClick={() => handleEditBranch(branch)}
                      >
                        <Pencil size={19} />
                      </CatalogActionButton>

                      {branch.isActive !== false && (
                        <CatalogActionButton
                          type="button"
                          $danger
                          title="Eliminar sucursal"
                          aria-label={`Eliminar sucursal ${branch.name}`}
                          onClick={() => handleDeleteBranch(branch)}
                        >
                          <Trash2 size={19} color="#FF2B2B" />
                        </CatalogActionButton>
                      )}
                    </CatalogActions>
                  </CatalogRow>
                ))}
              </CatalogList>
            )}
          </CatalogTable>
        </CatalogContainer>
      </PageContainer>

      <BranchModal
        isOpen={isBranchModalOpen}
        mode={modalMode}
        branch={selectedBranch}
        cities={cities}
        companies={companies}
        onClose={handleCloseBranchModal}
        onSubmit={handleSaveBranch}
      />
    </>
  );
};

export default Branches;