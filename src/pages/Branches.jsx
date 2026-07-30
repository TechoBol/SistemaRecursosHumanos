import { useMemo, useState } from "react";
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

const INITIAL_BRANCHES = [
  {
    id: 1,
    name: "Central Megadis",
    description: "Sucursal Central de MEGADIS",
    address: "Av. 9 de abril entre C. Kanaudt",
    city: "Cochabamba",
    companies: ["TechoBol", "Megadis"],
  },
  {
    id: 2,
    name: "Villa Bolívar",
    description: "Ventas MEGADIS",
    address: "Calle 4, Zona Téllez Ross",
    city: "La Paz",
    companies: ["Megadis", "Rhinocons"],
  },
  {
    id: 3,
    name: "Sucursal Trinidad",
    description: "Sucursal regional",
    address: "Av. 6 de Agosto, Zona Central",
    city: "Beni",
    companies: ["TechoBol"],
  },
];

const CITY_FILTERS = [
  {
    id: "all",
    label: "Todos",
  },
  {
    id: "Beni",
    label: "Beni",
  },
  {
    id: "Cochabamba",
    label: "Cochabamba",
  },
  {
    id: "La Paz",
    label: "La Paz",
  },
];

const BRANCH_COLUMNS = `
  minmax(320px, 1.6fr)
  minmax(130px, 0.7fr)
  minmax(170px, 0.9fr)
  110px
`;

const Branches = () => {
  const [branches, setBranches] = useState(INITIAL_BRANCHES);
  const [searchValue, setSearchValue] = useState("");
  const [selectedCity, setSelectedCity] = useState("all");

  const filteredBranches = useMemo(() => {
    const search = searchValue.trim().toLowerCase();

    return branches.filter((branch) => {
      const matchesCity =
        selectedCity === "all" ||
        branch.city === selectedCity;

      const searchableContent = [
        branch.name,
        branch.description,
        branch.address,
        branch.city,
        ...branch.companies,
      ]
        .join(" ")
        .toLowerCase();

      const matchesSearch = !search || searchableContent.includes(search);
      return matchesCity && matchesSearch;
    });
  }, [branches, searchValue, selectedCity]);

  const handleAddBranch = () => {
    console.log("Añadir sucursal");
  };

  const handleEditBranch = (branch) => {
    console.log("Editar sucursal:", branch);
  };

  const handleDeleteBranch = (branch) => {
    const shouldDelete = window.confirm(
      `¿Deseas eliminar la sucursal ${branch.name}?`,
    );

    if (!shouldDelete) {
      return;
    }

    setBranches((currentBranches) =>
      currentBranches.filter(
        (currentBranch) =>
          currentBranch.id !== branch.id,
      ),
    );
  };

  return (
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
        {CITY_FILTERS.map((filter) => (
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
          {filteredBranches.length === 0 ? (
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
                    {branch.city}
                  </CatalogColumn>

                  <CatalogColumn data-label="Empresas">
                    <CatalogBadgeList>
                      {branch.companies.map((company) => (
                        <CatalogBadge key={`${branch.id}-${company}`}>
                          {company}
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

                    <CatalogActionButton
                      type="button"
                      $danger
                      title="Eliminar sucursal"
                      aria-label={`Eliminar sucursal ${branch.name}`}
                      onClick={() => handleDeleteBranch(branch)}
                    >
                      <Trash2 size={19} />
                    </CatalogActionButton>
                  </CatalogActions>
                </CatalogRow>
              ))}
            </CatalogList>
          )}
        </CatalogTable>
      </CatalogContainer>
    </PageContainer>
  );
};

export default Branches;