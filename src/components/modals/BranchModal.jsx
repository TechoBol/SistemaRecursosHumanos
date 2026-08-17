import { useEffect, useState } from "react";
import { Check, X } from "lucide-react";
import {
  CancelButton,
  FormErrorText,
  FormField,
  FormHelperText,
  FormInput,
  FormLabel,
  FormSelect,
  FormStack,
  ModalActions,
  ModalCloseButton,
  ModalContainer,
  ModalContent,
  ModalForm,
  ModalHeader,
  ModalOverlay,
  ModalSection,
  ModalTitle,
  PrimaryButton,
  SelectableOptionButton,
  SelectableOptions,
} from "../ui/Modal.styles";

const INITIAL_FORM = {
  name: "",
  description: "",
  address: "",
  cityId: "",
  companyIds: [],
};

const BranchModal = ({
  isOpen,
  mode = "create",
  branch = null,
  cities = [],
  companies = [],
  onClose,
  onSubmit,
}) => {
  const [formData, setFormData] = useState(INITIAL_FORM);
  const [errors, setErrors] = useState({});
  const isEditMode = mode === "edit";

  useEffect(() => {
    if (!isOpen) {
      return;
    }
    if (isEditMode && branch) {
      setFormData({
        name: branch.name ?? "",
        description: branch.description ?? "",
        address: branch.address ?? "",
        cityId: branch.cityId ?? "",
        companyIds: branch.companies ? branch.companies.map((cb) => cb.companyId) : [],
      });
    } else {
      setFormData(INITIAL_FORM);
    }
    setErrors({});
  }, [isOpen, isEditMode, branch]);

  if (!isOpen) {
    return null;
  }

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((currentData) => ({
      ...currentData,
      [name]: value,
    }));
    setErrors((currentErrors) => ({
      ...currentErrors,
      [name]: "",
    }));
  };

  const handleToggleCompany = (companyId) => {
    setFormData((currentData) => {
      const isSelected = currentData.companyIds.includes(companyId);
      return {
        ...currentData,
        companyIds: isSelected
          ? currentData.companyIds.filter((id) => id !== companyId)
          : [...currentData.companyIds, companyId],
      };
    });
    setErrors((currentErrors) => ({
      ...currentErrors,
      companyIds: "",
    }));
  };

  const validateForm = () => {
    const nextErrors = {};
    if (!formData.name.trim()) {
      nextErrors.name = "El nombre es obligatorio.";
    }
    if (!formData.cityId) {
      nextErrors.cityId = "Selecciona una ciudad.";
    }
    if (formData.companyIds.length === 0) {
      nextErrors.companyIds = "Selecciona al menos una empresa.";
    }
    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    if (!validateForm()) {
      return;
    }
    onSubmit({
      name: formData.name.trim(),
      description: formData.description.trim(),
      address: formData.address.trim(),
      cityId: Number(formData.cityId),
      companyIds: formData.companyIds.map(Number),
    });
  };

  const handleOverlayClick = (event) => {
    if (event.target === event.currentTarget) {
      onClose();
    }
  };

  return (
    <ModalOverlay
      $zIndex={1600}
      onMouseDown={handleOverlayClick}
    >
      <ModalContainer
        $maxWidth="440px"
        $maxHeight="calc(90vh - 32px)"
        role="dialog"
        aria-modal="true"
        aria-labelledby="branch-modal-title"
      >
        <ModalHeader>
          <ModalTitle id="branch-modal-title">
            {isEditMode
              ? "Editar sucursal"
              : "Registrar sucursal"}
          </ModalTitle>

          <ModalCloseButton
            type="button"
            title="Cerrar"
            aria-label="Cerrar modal"
            onClick={onClose}
          >
            <X size={21} />
          </ModalCloseButton>
        </ModalHeader>

        <ModalForm onSubmit={handleSubmit}>
          <ModalContent>
            <ModalSection $compact>
              <FormStack>
                <FormField>
                  <FormLabel htmlFor="branch-name">Nombre</FormLabel>
                  <FormInput
                    id="branch-name"
                    name="name"
                    type="text"
                    value={formData.name}
                    onChange={handleChange}
                    autoFocus
                    style={{ borderColor: errors.name ? "#FF2B2B" : undefined }}
                  />
                  {errors.name && (
                    <FormErrorText>{errors.name}</FormErrorText>
                  )}
                </FormField>

                <FormField>
                  <FormLabel htmlFor="branch-description">Descripción</FormLabel>
                  <FormInput
                    id="branch-description"
                    name="description"
                    type="text"
                    value={formData.description}
                    onChange={handleChange}
                  />
                </FormField>

                <FormField>
                  <FormLabel htmlFor="branch-address">Ubicación</FormLabel>
                  <FormInput
                    id="branch-address"
                    name="address"
                    type="text"
                    value={formData.address}
                    onChange={handleChange}
                  />
                </FormField>

                <FormField>
                  <FormLabel htmlFor="branch-city">Ciudad</FormLabel>
                  <FormSelect
                    id="branch-city"
                    name="cityId"
                    value={formData.cityId}
                    onChange={handleChange}
                    style={{ borderColor: errors.cityId ? "#FF2B2B" : undefined }}
                  >
                    <option value="">Seleccionar</option>
                    {cities.map((city) => (
                      <option key={city.id} value={city.id}>
                        {city.name}
                      </option>
                    ))}
                  </FormSelect>
                  {errors.cityId && (
                    <FormErrorText>{errors.cityId}</FormErrorText>
                  )}
                </FormField>

                <FormField>
                  <FormLabel>Empresas vinculadas</FormLabel>
                  <SelectableOptions>
                    {companies.map((company) => {
                      const isSelected = formData.companyIds.includes(company.id);
                      return (
                        <SelectableOptionButton
                          key={company.id}
                          type="button"
                          $active={isSelected}
                          aria-pressed={isSelected}
                          onClick={() => handleToggleCompany(company.id)}
                          style={{ borderColor: errors.companyIds ? "#FF2B2B" : undefined }}
                        >
                          {isSelected && (
                            <Check size={15} strokeWidth={2.2} />
                          )}
                          {company.name}
                        </SelectableOptionButton>
                      );
                    })}
                  </SelectableOptions>
                  <FormHelperText>Puedes seleccionar una o varias empresas.</FormHelperText>
                  {errors.companyIds && (
                    <FormErrorText>{errors.companyIds}</FormErrorText>
                  )}
                </FormField>
              </FormStack>
            </ModalSection>
          </ModalContent>

          <ModalActions>
            <CancelButton type="button" onClick={onClose}>
              Cancelar
            </CancelButton>

            <PrimaryButton type="submit" $minWidth="180px">
              {isEditMode
                ? "Guardar cambios"
                : "Agregar sucursal"}
            </PrimaryButton>
          </ModalActions>
        </ModalForm>
      </ModalContainer>
    </ModalOverlay>
  );
};

export default BranchModal;