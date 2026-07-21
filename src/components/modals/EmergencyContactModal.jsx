import { useEffect, useState } from "react";
import { X } from "lucide-react";
import {
  CancelButton,
  FormField,
  FormGrid,
  FormInput,
  FormLabel,
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

const initialForm = {
  fullName: "",
  relationship: "",
  phone: "",
  address: "",
};

const EmergencyContactModal = ({
  isOpen,
  contact = null,
  onClose,
  onSubmit,
}) => {
  const [formData, setFormData] = useState(initialForm);

  useEffect(() => {
    if (!isOpen) return;
    setFormData({
      fullName: contact?.fullName ?? "",
      relationship: contact?.relationship ?? "",
      phone: contact?.phone ?? "",
      address: contact?.address ?? "",
    });
  }, [isOpen, contact]);

  if (!isOpen) {
    return null;
  }

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((current) => ({
      ...current,
      [name]: value,
    }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    onSubmit(formData);
  };

  const handleOverlayClick = (event) => {
    if (event.target === event.currentTarget) {
      onClose();
    }
  };

  const title = contact
    ? "Editar contacto de emergencia"
    : "Añadir contacto de emergencia";

  const buttonText = contact
    ? "Guardar cambios"
    : "Añadir contacto";

  return (
    <ModalOverlay
      $zIndex={1600}
      onMouseDown={handleOverlayClick}
    >
      <ModalContainer
        $maxWidth="620px"
        role="dialog"
        aria-modal="true"
        aria-labelledby="emergency-modal-title"
      >
        <ModalHeader>
          <ModalTitle id="emergency-modal-title">{title}</ModalTitle>
          <ModalCloseButton
            type="button"
            aria-label="Cerrar modal"
            onClick={onClose}
          >
            <X size={21} />
          </ModalCloseButton>
        </ModalHeader>

        <ModalForm onSubmit={handleSubmit}>
          <ModalContent $scrollable={false}>
            <ModalSection $compact>
              <FormGrid>
                <FormField>
                  <FormLabel htmlFor="emergencyFullName">Nombre completo</FormLabel>
                  <FormInput
                    id="emergencyFullName"
                    name="fullName"
                    value={formData.fullName}
                    onChange={handleChange}
                    required
                  />
                </FormField>

                <FormField>
                  <FormLabel htmlFor="relationship">Relación</FormLabel>
                  <FormInput
                    id="relationship"
                    name="relationship"
                    value={formData.relationship}
                    onChange={handleChange}
                    placeholder="Ej. Madre, esposo, hermano"
                    required
                  />
                </FormField>

                <FormField>
                  <FormLabel htmlFor="emergencyPhone">Teléfono</FormLabel>
                  <FormInput
                    id="emergencyPhone"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    required
                  />
                </FormField>

                <FormField>
                  <FormLabel htmlFor="emergencyAddress">Dirección</FormLabel>
                  <FormInput
                    id="emergencyAddress"
                    name="address"
                    value={formData.address}
                    onChange={handleChange}
                    required
                  />
                </FormField>
              </FormGrid>
            </ModalSection>
          </ModalContent>

          <ModalActions>
            <CancelButton type="button" onClick={onClose}>Cancelar</CancelButton>
            <PrimaryButton type="submit" $minWidth="165px">{buttonText}</PrimaryButton>
          </ModalActions>
        </ModalForm>
      </ModalContainer>
    </ModalOverlay>
  );
};

export default EmergencyContactModal;