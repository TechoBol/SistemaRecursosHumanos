import { useEffect, useRef, useState } from "react";
import { CalendarDays, X } from "lucide-react";
import {
  FormField,
  FormGrid,
  FormInput,
  FormLabel,
  InputIconButton,
  InputIconContainer,
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
  CancelButton,
  ToggleButton,
  ToggleGroup,
} from "../ui/Modal.styles";

const INITIAL_FORM = {
  type: "permission",
  duration: "halfDay",
  date: "",
  reason: "",
  description: "",
  discount: "",
};

const PermissionAbsenceModal = ({
  isOpen,
  record = null,
  mode = "create",
  onClose,
  onSubmit,
}) => {
  const isEditMode = mode === "edit";
  const dateInputRef = useRef(null);
  const [formData, setFormData] = useState(INITIAL_FORM);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    if (!isOpen) {
      return;
    }
    if (isEditMode && record) {
      setFormData({
        type: record.type ?? "permission",
        duration: record.duration ?? "halfDay",
        date: record.date ?? "",
        reason: record.reason ?? "",
        description: record.description ?? "",
        discount: record.discount ?? "",
      });
    } else {
      setFormData(INITIAL_FORM);
    }
    setErrorMessage("");
  }, [isOpen, isEditMode, record]);

  useEffect(() => {
    if (!isOpen) {
      return undefined;
    }
    const handleKeyDown = (event) => {
      if (event.key === "Escape") {
        onClose();
      }
    };
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen) {
    return null;
  }

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((currentData) => ({
      ...currentData,
      [name]: value,
    }));
    if (errorMessage) {
      setErrorMessage("");
    }
  };

  const handleSelectType = (type) => {
    setFormData((currentData) => ({
      ...currentData,
      type,
    }));
  };

  const handleSelectDuration = (duration) => {
    setFormData((currentData) => ({
      ...currentData,
      duration,
    }));
  };

  const handleOpenCalendar = () => {
    const input = dateInputRef.current;
    if (!input) {
      return;
    }
    if (typeof input.showPicker === "function") {
      input.showPicker();
      return;
    }
    input.focus();
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    const normalizedData = {
      type: formData.type,
      duration: formData.duration,
      date: formData.date,
      reason: formData.reason.trim(),
      description: formData.description.trim(),
      discount: formData.discount !== "" ? Number(formData.discount) : 0,
    };
    if (
      !normalizedData.date ||
      !normalizedData.reason ||
      !normalizedData.description
    ) {
      setErrorMessage(
        "Completa la fecha, el motivo y la descripción.",
      );
      return;
    }
    onSubmit(normalizedData);
  };

  const handleOverlayMouseDown = (event) => {
    if (event.target === event.currentTarget) {
      onClose();
    }
  };

  const title = isEditMode
    ? "Editar permiso o falta"
    : "Registrar permiso o falta";

  return (
    <ModalOverlay
      $zIndex={1600}
      onMouseDown={handleOverlayMouseDown}
    >
      <ModalContainer
        $maxWidth="430px"
        $maxHeight="calc(90vh - 40px)"
        role="dialog"
        aria-modal="true"
        aria-labelledby="permission-modal-title"
        onMouseDown={(event) => event.stopPropagation()}
      >
        <ModalHeader>
          <ModalTitle id="permission-modal-title">
            {title}
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
          <ModalContent $scrollable={false}>
            <ModalSection $compact>
              <FormGrid $columns={1}>
                <FormField>
                  <FormLabel>Tipo</FormLabel>
                  <ToggleGroup $columns={3}>
                    <ToggleButton
                      type="button"
                      $active={formData.type === "permission"}
                      $variant="primary"
                      aria-pressed={formData.type === "permission"}
                      onClick={() => handleSelectType("permission")}
                    >
                      Permiso
                    </ToggleButton>
                    <ToggleButton
                      type="button"
                      $active={formData.type === "lateness"}
                      $variant="warning"
                      aria-pressed={ formData.type === "lateness" }
                      onClick={() => handleSelectType("lateness")}
                    >
                      Atraso
                    </ToggleButton>
                    <ToggleButton
                      type="button"
                      $active={formData.type === "absence"}
                      $variant="danger"
                      aria-pressed={ formData.type === "absence" }
                      onClick={() => handleSelectType("absence")}
                    >
                      Falta
                    </ToggleButton>
                  </ToggleGroup>
                </FormField>

                <FormField>
                  <FormLabel>Duración</FormLabel>
                  <ToggleGroup>
                    <ToggleButton
                      type="button"
                      $active={ formData.duration === "halfDay"}
                      onClick={() => handleSelectDuration("halfDay")}
                    >
                      Medio día
                    </ToggleButton>
                    <ToggleButton
                      type="button"
                      $active={formData.duration === "fullDay"}
                      onClick={() => handleSelectDuration("fullDay")}
                    >
                      Un día
                    </ToggleButton>
                  </ToggleGroup>
                </FormField>

                <FormField>
                  <FormLabel htmlFor="permission-date">Fecha</FormLabel>
                  <InputIconContainer>
                    <FormInput
                      ref={dateInputRef}
                      id="permission-date"
                      name="date"
                      type="date"
                      value={formData.date}
                      onChange={handleChange}
                    />
                    <InputIconButton
                      type="button"
                      title="Seleccionar fecha"
                      aria-label="Seleccionar fecha"
                      onClick={handleOpenCalendar}
                    >
                      <CalendarDays size={20} />
                    </InputIconButton>
                  </InputIconContainer>
                </FormField>

                <FormField>
                  <FormLabel htmlFor="permission-reason">Motivo</FormLabel>
                  <FormInput
                    id="permission-reason"
                    name="reason"
                    type="text"
                    value={formData.reason}
                    onChange={handleChange}
                  />
                </FormField>

                <FormField>
                  <FormLabel htmlFor="permission-description">Descripción</FormLabel>
                  <FormInput
                    id="permission-description"
                    name="description"
                    type="text"
                    value={formData.description}
                    onChange={handleChange}
                  />
                </FormField>

                <FormField>
                  <FormLabel htmlFor="permission-discount">Descuento (Bs.)</FormLabel>
                  <FormInput
                    id="permission-discount"
                    name="discount"
                    type="number"
                    step="0.01"
                    min="0"
                    value={formData.discount}
                    onChange={handleChange}
                    placeholder="0.00"
                  />
                </FormField>

                {errorMessage && (
                  <p
                    role="alert"
                    style={{
                      margin: 0,
                      color: "#FF2B2B",
                      fontSize: "12px",
                    }}
                  >
                    {errorMessage}
                  </p>
                )}
              </FormGrid>
            </ModalSection>
          </ModalContent>

          <ModalActions>
            <CancelButton type="button" onClick={onClose}>Cancelar</CancelButton>
            <PrimaryButton type="submit" $minWidth="190px">
              {isEditMode
                ? "Guardar cambios"
                : formData.type === "permission"
                  ? "Registrar permiso"
                  : formData.type === "absence"
                    ? "Registrar falta"
                    : "Registrar atraso"}
            </PrimaryButton>
          </ModalActions>
        </ModalForm>
      </ModalContainer>
    </ModalOverlay>
  );
};

export default PermissionAbsenceModal;