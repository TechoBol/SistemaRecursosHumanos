import { useMemo, useState } from "react";
import Swal from "sweetalert2";
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
import { useJobTitles } from "../hooks/useJobTitles";
import { useAreas } from "../hooks/useAreas";

const BRANCH_COLUMNS = `
  minmax(320px, 1fr)
  minmax(180px, 0.6fr)
  110px
`;

const getJobTitleIcon = (name) => {
  const lowerName = String(name).toLowerCase();
  if (lowerName.includes("almacen") || lowerName.includes("logistica") || lowerName.includes("inventario")) {
    return <Archive size={29} strokeWidth={1.8} />;
  }
  return <Truck size={29} strokeWidth={1.8} />;
};

const JobTitles = () => {
  const { jobTitles, isLoading, createJobTitle, updateJobTitle, deleteJobTitle } = useJobTitles();
  const { areas, isLoading: isAreasLoading } = useAreas();
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
      const areaNames = jobTitle.areas
        ? jobTitle.areas.map((at) => at.area?.name || "")
        : [];

      const searchableContent = [
        jobTitle.name,
        jobTitle.description,
        ...areaNames,
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

  const handleSaveJobTitle = async (jobTitleData) => {
    if (modalMode === "edit" && selectedJobTitle) {
      await updateJobTitle(selectedJobTitle.id, jobTitleData);
    } else {
      await createJobTitle(jobTitleData);
    }
    handleCloseJobTitleModal();
  };

  const handleDeleteJobTitle = (jobTitle) => {
    Swal.fire({
      title: "¿Estás seguro?",
      text: `¿Deseas desactivar el cargo ${jobTitle.name}?`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#2F573C",
      cancelButtonColor: "#D32F2F",
      confirmButtonText: "Sí, desactivar",
      cancelButtonText: "Cancelar"
    }).then(async (result) => {
      if (result.isConfirmed) {
        await deleteJobTitle(jobTitle.id);
      }
    });
  };

  const showLoading = isLoading || isAreasLoading;

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

            {showLoading ? (
              <CatalogEmpty>Cargando cargos...</CatalogEmpty>
            ) : filteredJobTitles.length === 0 ? (
              <CatalogEmpty>No se encontraron cargos.</CatalogEmpty>
            ) : (
              <CatalogList>
                {filteredJobTitles.map((jobTitle) => (
                  <CatalogRow key={jobTitle.id} $columns={BRANCH_COLUMNS}>
                    <CatalogMain>
                      <CatalogIcon>{getJobTitleIcon(jobTitle.name)}</CatalogIcon>
                      <CatalogInfo>
                        <CatalogTitle>{jobTitle.name}</CatalogTitle>
                        <CatalogDescription>{jobTitle.description}</CatalogDescription>
                      </CatalogInfo>
                    </CatalogMain>

                    <CatalogColumn data-label="Áreas">
                      <CatalogBadgeList>
                        {jobTitle.areas &&
                          jobTitle.areas.map((at) => (
                            <CatalogBadge key={`${jobTitle.id}-${at.area?.id}`}>
                              {at.area?.name || "Sin Área"}
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

                      {jobTitle.isActive !== false && (
                        <CatalogActionButton
                          type="button"
                          $danger
                          title="Eliminar cargo"
                          aria-label={`Eliminar cargo ${jobTitle.name}`}
                          onClick={() => handleDeleteJobTitle(jobTitle)}
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

      <JobTitleModal
        isOpen={isJobTitleModalOpen}
        mode={modalMode}
        jobTitle={selectedJobTitle}
        areas={areas}
        onClose={handleCloseJobTitleModal}
        onSubmit={handleSaveJobTitle}
      />
    </>
  );
};

export default JobTitles;