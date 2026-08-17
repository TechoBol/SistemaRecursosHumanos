import { useEffect, useState } from "react";
import { X } from "lucide-react";
import {
  CancelButton,
  FormErrorText,
  FormField,
  FormInput,
  FormLabel,
  FormStack,
  FormTextarea,
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
} from "../ui/Modal.styles";

const INITIAL_FORM = {
  name: "",
  description: "",
};

const AreaModal = ({
  isOpen,
  mode = "create",
  area = null,
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
    setErrors({});
    if (isEditMode && area) {
      setFormData({
        name: area.name ?? "",
        description: area.description ?? "",
      });
      return;
    }
    setFormData(INITIAL_FORM);
  }, [isOpen, isEditMode, area]);

  if (!isOpen) {
    return null;
  }

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((currentData) => ({
      ...currentData,
      [name]: value,
    }));
    if (name === "name") {
      setErrors((currentErrors) => ({
        ...currentErrors,
        name: "",
      }));
    }
  };

  const validateForm = () => {
    const nextErrors = {};
    if (!formData.name.trim()) {
      nextErrors.name = "El nombre es obligatorio.";
    }
    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    if (!validateForm()) {
      return;
    }

    const submittedData = {
      name: formData.name.trim(),
      description: formData.description.trim(),
    };

    onSubmit(submittedData);
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
        $maxWidth="390px"
        $maxHeight="calc(90vh - 32px)"
        role="dialog"
        aria-modal="true"
        aria-labelledby="area-modal-title"
      >
        <ModalHeader>
          <ModalTitle id="area-modal-title">
            {isEditMode ? "Editar área" : "Registrar área"}
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

        <ModalForm onSubmit={handleSubmit} noValidate>
          <ModalContent $scrollable={false}>
            <ModalSection $compact>
              <FormStack>
                <FormField>
                  <FormLabel htmlFor="area-name">Nombre</FormLabel>
                  <FormInput
                    id="area-name"
                    name="name"
                    type="text"
                    value={formData.name}
                    onChange={handleChange}
                    autoFocus
                    aria-invalid={Boolean(errors.name)}
                    aria-describedby={
                      errors.name
                        ? "area-name-error"
                        : undefined
                    }
                    style={{ borderColor: errors.name ? "#FF2B2B" : undefined }}
                  />
                  {errors.name && (
                    <FormErrorText id="area-name-error">
                      {errors.name}
                    </FormErrorText>
                  )}
                </FormField>

                <FormField>
                  <FormLabel htmlFor="area-description">Descripción</FormLabel>
                  <FormTextarea
                    id="area-description"
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                  />
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
                : "Agregar área"}
            </PrimaryButton>
          </ModalActions>
        </ModalForm>
      </ModalContainer>
    </ModalOverlay>
  );
};

export default AreaModal;