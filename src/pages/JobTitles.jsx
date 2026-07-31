import { useMemo, useState } from "react";
import {
  Archive,
  Pencil,
  Plus,
  Search,
  Trash2,
  Truck,
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
  CatalogHeader,
  CatalogIcon,
  CatalogInfo,
  CatalogList,
  CatalogMain,
  CatalogRow,
  CatalogTable,
  CatalogTitle,
} from "../components/ui/CatalogList.styles";
import JobTitleModal from "../components/modals/JobTitleModal";

const INITIAL_JOB_TITLES = [
  {
    id: 1,
    name: "Auxiliar de Operaciones",
    description:
      "Personal a cargo de apoyo y ayuda en el área de Producción o Almacén.",
    areas: ["Ventas", "Operaciones"],
    icon: "operations",
  },
  {
    id: 2,
    name: "Auxiliar de Almacén",
    description:
      "Personal a cargo del inventario, stock y control de los materiales existentes en un almacén de la sucursal.",
    areas: ["Comercial", "Operaciones"],
    icon: "warehouse",
  },
];

const BRANCH_COLUMNS = `
  minmax(320px, 1fr)
  minmax(180px, 0.6fr)
  110px
`;

const getJobTitleIcon = (icon) => {
  if (icon === "warehouse") {
    return <Archive size={29} strokeWidth={1.8} />;
  }
  return <Truck size={29} strokeWidth={1.8} />;
};

const JobTitles = () => {
  const [jobTitles, setJobTitles] = useState(INITIAL_JOB_TITLES,);
  const [searchValue, setSearchValue] = useState("");
  const [isJobTitleModalOpen, setIsJobTitleModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState("create");
  const [selectedJobTitle, setSelectedJobTitle] = useState(null);

  const filteredJobTitles = useMemo(() => {
    const search = searchValue.trim().toLowerCase();
    if (!search) {
      return jobTitles;
    }
    return jobTitles.filter((jobTitle) => {
      const searchableContent = [
        jobTitle.name,
        jobTitle.description,
        ...jobTitle.areas,
      ]
        .join(" ")
        .toLowerCase();
      return searchableContent.includes(search);
    });
  }, [jobTitles, searchValue]);

  const handleAddJobTitle = () => {
    setSelectedJobTitle(null);
    setModalMode("create");
    setIsJobTitleModalOpen(true);
  };

  const handleEditJobTitle = (jobTitle) => {
    setSelectedJobTitle(jobTitle);
    setModalMode("edit");
    setIsJobTitleModalOpen(true);
  };

  const handleCloseJobTitleModal = () => {
    setIsJobTitleModalOpen(false);
    setSelectedJobTitle(null);
  };

  const handleSaveJobTitle = (jobTitleData) => {
    if (modalMode === "edit" && selectedJobTitle) {
      setJobTitles((currentJobTitles) =>
        currentJobTitles.map((jobTitle) =>
          jobTitle.id === selectedJobTitle.id
            ? {
                ...jobTitle,
                ...jobTitleData,
              }
            : jobTitle,
        ),
      );
    } else {
      const nextId =
        Math.max(
          0,
          ...jobTitles.map((jobTitle) => jobTitle.id),
        ) + 1;
      setJobTitles((currentJobTitles) => [
        ...currentJobTitles,
        {
          id: nextId,
          icon: "operations",
          ...jobTitleData,
        },
      ]);
    }
    handleCloseJobTitleModal();
  };

  const handleDeleteJobTitle = (jobTitle) => {
    const shouldDelete = window.confirm(
      `¿Deseas eliminar el cargo ${jobTitle.name}?`,
    );
    if (!shouldDelete) {
      return;
    }
    setJobTitles((currentJobTitles) =>
      currentJobTitles.filter(
        (currentJobTitle) =>
          currentJobTitle.id !== jobTitle.id,
      ),
    );
  };

  return (
    <>
      <PageContainer>
        <PageHeader>
          <PageTitle>Cargos</PageTitle>
          <PageActions>
            <SearchContainer>
              <Search size={20} />
              <SearchInput
                type="search"
                value={searchValue}
                placeholder="Buscar"
                aria-label="Buscar cargo"
                onChange={(event) =>
                  setSearchValue(event.target.value)
                }
              />
            </SearchContainer>
            <AddButton
              type="button"
              onClick={handleAddJobTitle}
            >
              <Plus size={18} />
              Agregar cargo
            </AddButton>
          </PageActions>
        </PageHeader>

        <CatalogContainer>
          <CatalogTable $minWidth="900px">
            <CatalogHeader $columns={BRANCH_COLUMNS} aria-hidden="true">
              <span>Cargo</span>
              <span>Áreas</span>
              <span>Acciones</span>
            </CatalogHeader>

            {filteredJobTitles.length === 0 ? (
              <CatalogEmpty>No se encontraron cargos.</CatalogEmpty>
            ) : (
              <CatalogList>
                {filteredJobTitles.map((jobTitle) => (
                  <CatalogRow key={jobTitle.id} $columns={BRANCH_COLUMNS}>
                    <CatalogMain>
                      <CatalogIcon>{getJobTitleIcon(jobTitle.icon)}</CatalogIcon>
                      <CatalogInfo>
                        <CatalogTitle>{jobTitle.name}</CatalogTitle>
                        <CatalogDescription>{jobTitle.description}</CatalogDescription>
                      </CatalogInfo>
                    </CatalogMain>

                    <CatalogColumn data-label="Áreas">
                      <CatalogBadgeList>
                        {jobTitle.areas.map((area) => (
                          <CatalogBadge key={`${jobTitle.id}-${area}`}>
                            {area}
                          </CatalogBadge>
                        ))}
                      </CatalogBadgeList>
                    </CatalogColumn>

                    <CatalogActions>
                      <CatalogActionButton
                        type="button"
                        title="Editar cargo"
                        aria-label={`Editar cargo ${jobTitle.name}`}
                        onClick={() => handleEditJobTitle(jobTitle)}
                      >
                        <Pencil size={19} />
                      </CatalogActionButton>

                      <CatalogActionButton
                        type="button"
                        $danger
                        title="Eliminar cargo"
                        aria-label={`Eliminar cargo ${jobTitle.name}`}
                        onClick={() => handleDeleteJobTitle(jobTitle)}
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

      <JobTitleModal
        isOpen={isJobTitleModalOpen}
        mode={modalMode}
        jobTitle={selectedJobTitle}
        onClose={handleCloseJobTitleModal}
        onSubmit={handleSaveJobTitle}
      />
    </>
  );
};

export default JobTitles;