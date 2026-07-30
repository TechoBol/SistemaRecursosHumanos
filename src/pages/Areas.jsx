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

const getAreaIcon = (icon) => {
  if (icon === "sales") {
    return <ShoppingCart size={29} strokeWidth={1.8} />;
  }
  return <Boxes size={29} strokeWidth={1.8} />;
};

const Areas = () => {
  const [areas, setAreas] = useState(INITIAL_AREAS);
  const [searchValue, setSearchValue] = useState("");

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
    console.log("Agregar área");
  };

  const handleEditArea = (area) => {
    console.log("Editar área:", area);
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
          <CatalogHeader
            $columns="minmax(0, 1fr) 110px"
            aria-hidden="true"
          >
            <span>Área</span>
            <span>Acciones</span>
          </CatalogHeader>

          {filteredAreas.length === 0 ? (
            <CatalogEmpty>No se encontraron áreas.</CatalogEmpty>
          ) : (
            <CatalogList>
              {filteredAreas.map((area) => (
                <CatalogRow
                  key={area.id}
                  $columns="minmax(0, 1fr) 110px"
                >
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
  );
};

export default Areas;