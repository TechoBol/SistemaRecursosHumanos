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
  city: "",
  companies: [],
};

const CITY_OPTIONS = [
  "Beni",
  "Cochabamba",
  "La Paz",
  "Santa Cruz",
];

const COMPANY_OPTIONS = [
  "TechoBol",
  "Megadis",
  "Rhinocons",
];

const BranchModal = ({
  isOpen,
  mode = "create",
  branch = null,
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
        city: branch.city ?? "",
        companies: branch.companies ?? [],
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

  const handleToggleCompany = (company) => {
    setFormData((currentData) => {
      const companyIsSelected = currentData.companies.includes(company);
      return {
        ...currentData,
        companies: companyIsSelected
          ? currentData.companies.filter(
              (currentCompany) =>
                currentCompany !== company,
            )
          : [...currentData.companies, company],
      };
    });
    setErrors((currentErrors) => ({
      ...currentErrors,
      companies: "",
    }));
  };

  const validateForm = () => {
    const nextErrors = {};
    if (!formData.name.trim()) {
      nextErrors.name = "El nombre es obligatorio.";
    }
    if (!formData.city) {
      nextErrors.city = "Selecciona una ciudad.";
    }
    if (formData.companies.length === 0) {
      nextErrors.companies =
        "Selecciona al menos una empresa.";
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
      ...formData,
      name: formData.name.trim(),
      description: formData.description.trim(),
      address: formData.address.trim(),
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
                    name="city"
                    value={formData.city}
                    onChange={handleChange}
                  >
                    <option value="">Seleccionar</option>
                    {CITY_OPTIONS.map((city) => (
                      <option key={city} value={city}>
                        {city}
                      </option>
                    ))}
                  </FormSelect>
                  {errors.city && (
                    <FormErrorText>{errors.city}</FormErrorText>
                  )}
                </FormField>

                <FormField>
                  <FormLabel>Empresas</FormLabel>
                  <SelectableOptions>
                    {COMPANY_OPTIONS.map((company) => {
                      const isSelected = formData.companies.includes(company);
                      return (
                        <SelectableOptionButton
                          key={company}
                          type="button"
                          $active={isSelected}
                          aria-pressed={isSelected}
                          onClick={() => handleToggleCompany(company)}
                        >
                          {isSelected && (
                            <Check size={15} strokeWidth={2.2} />
                          )}
                          {company}
                        </SelectableOptionButton>
                      );
                    })}
                  </SelectableOptions>
                  <FormHelperText>Puedes seleccionar una o varias empresas.</FormHelperText>
                  {errors.companies && (
                    <FormErrorText>{errors.companies}</FormErrorText>
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