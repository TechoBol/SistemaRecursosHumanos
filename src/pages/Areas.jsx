import { useMemo, useState } from "react";
import {
  Boxes,
  Pencil,
  Plus,
  Search,
  ShoppingCart,
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
  CatalogContainer,
  CatalogDescription,
  CatalogEmpty,
  CatalogHeader,
  CatalogIcon,
  CatalogInfo,
  CatalogList,
  CatalogMain,
  CatalogRow,
  CatalogTable,
  CatalogTitle,
} from "../components/ui/CatalogList.styles";
import AreaModal from "../components/modals/AreaModal";

const INITIAL_AREAS = [
  {
    id: 1,
    name: "Ventas",
    description:
      "Área comercial dedicada a las ventas y atención al cliente. Intervienen ejecutivos de ventas, marketing y jefes de ventas.",
    icon: "sales",
  },
  {
    id: 2,
    name: "Operaciones",
    description:
      "Área de producción y control de almacenes, materiales, stock y logística.",
    icon: "operations",
  },
];

const BRANCH_COLUMNS = `
  minmax(0, 1fr)
  110px
`;

const getAreaIcon = (icon) => {
  if (icon === "sales") {
    return <ShoppingCart size={29} strokeWidth={1.8} />;
  }
  return <Boxes size={29} strokeWidth={1.8} />;
};

const Areas = () => {
  const [areas, setAreas] = useState(INITIAL_AREAS);
  const [searchValue, setSearchValue] = useState("");
  const [isAreaModalOpen, setIsAreaModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState("create");
  const [selectedArea, setSelectedArea] = useState(null);

  const filteredAreas = useMemo(() => {
    const search = searchValue.trim().toLowerCase();
    if (!search) {
      return areas;
    }
    return areas.filter((area) => {
      const searchableContent = [
        area.name,
        area.description,
      ]
        .join(" ")
        .toLowerCase();
      return searchableContent.includes(search);
    });
  }, [areas, searchValue]);

  const handleAddArea = () => {
    setSelectedArea(null);
    setModalMode("create");
    setIsAreaModalOpen(true);
  };

  const handleEditArea = (area) => {
    setSelectedArea(area);
    setModalMode("edit");
    setIsAreaModalOpen(true);
  };

  const handleCloseAreaModal = () => {
    setIsAreaModalOpen(false);
    setSelectedArea(null);
  };

  const handleSaveArea = (areaData) => {
    if (modalMode === "edit" && selectedArea) {
      setAreas((currentAreas) =>
        currentAreas.map((area) =>
          area.id === selectedArea.id
            ? {
                ...area,
                ...areaData,
              }
            : area,
        ),
      );
    } else {
      const nextId = Math.max(0, ...areas.map((area) => area.id)) + 1;
      setAreas((currentAreas) => [
        ...currentAreas,
        {
          id: nextId,
          icon: "operations",
          ...areaData,
        },
      ]);
    }
    handleCloseAreaModal();
  };

  const handleDeleteArea = (area) => {
    const shouldDelete = window.confirm(
      `¿Deseas eliminar el área ${area.name}?`,
    );
    if (!shouldDelete) {
      return;
    }
    setAreas((currentAreas) =>
      currentAreas.filter(
        (currentArea) => currentArea.id !== area.id,
      ),
    );
  };

  return (
    <>
      <PageContainer>
        <PageHeader>
          <PageTitle>Áreas</PageTitle>
          <PageActions>
            <SearchContainer>
              <Search size={20} />
              <SearchInput
                type="search"
                value={searchValue}
                placeholder="Buscar"
                aria-label="Buscar área"
                onChange={(event) =>
                  setSearchValue(event.target.value)
                }
              />
            </SearchContainer>
            <AddButton
              type="button"
              onClick={handleAddArea}
            >
              <Plus size={18} />
              Agregar área
            </AddButton>
          </PageActions>
        </PageHeader>

        <CatalogContainer>
          <CatalogTable $minWidth="900px">
            <CatalogHeader $columns={BRANCH_COLUMNS} aria-hidden="true">
              <span>Área</span>
              <span>Acciones</span>
            </CatalogHeader>

            {filteredAreas.length === 0 ? (
              <CatalogEmpty>No se encontraron áreas.</CatalogEmpty>
            ) : (
              <CatalogList>
                {filteredAreas.map((area) => (
                  <CatalogRow key={area.id} $columns={BRANCH_COLUMNS}>
                    <CatalogMain>
                      <CatalogIcon>{getAreaIcon(area.icon)}</CatalogIcon>
                      <CatalogInfo>
                        <CatalogTitle>{area.name}</CatalogTitle>
                        <CatalogDescription>{area.description}</CatalogDescription>
                      </CatalogInfo>
                    </CatalogMain>

                    <CatalogActions>
                      <CatalogActionButton
                        type="button"
                        title="Editar área"
                        aria-label={`Editar área ${area.name}`}
                        onClick={() => handleEditArea(area)}
                      >
                        <Pencil size={19} />
                      </CatalogActionButton>

                      <CatalogActionButton
                        type="button"
                        $danger
                        title="Eliminar área"
                        aria-label={`Eliminar área ${area.name}`}
                        onClick={() => handleDeleteArea(area)}
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

      <AreaModal
        isOpen={isAreaModalOpen}
        mode={modalMode}
        area={selectedArea}
        onClose={handleCloseAreaModal}
        onSubmit={handleSaveArea}
      />
    </>
  );
};

export default Areas;