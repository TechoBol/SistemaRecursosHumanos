import { useEffect, useRef, useState } from "react";
import { CalendarDays, X } from "lucide-react";
import {
  CancelButton,
  FormErrorText,
  FormField,
  FormGrid,
  FormInput,
  FormLabel,
  FormTextarea,
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
} from "../ui/Modal.styles";

const INITIAL_FORM = {
  amount: "",
  date: "",
  notes: "",
};

const AdvanceModal = ({
  isOpen,
  record = null,
  mode = "create",
  onClose,
  onSubmit,
}) => {
  const isEditMode = mode === "edit";
  const dateInputRef = useRef(null);
  const [formData, setFormData] = useState(INITIAL_FORM);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (!isOpen) {
      return;
    }
    if (isEditMode && record) {
      setFormData({
        amount: record.amount ?? "",
        date: record.date ?? "",
        notes: record.notes ?? "",
      });
    } else {
      setFormData(INITIAL_FORM);
    }
    setErrors({});
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
    if (errors[name]) {
      setErrors((currentErrors) => ({
        ...currentErrors,
        [name]: "",
      }));
    }
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
    const nextErrors = {};

    const parsedAmount = Number(formData.amount);
    if (!formData.amount || isNaN(parsedAmount) || parsedAmount <= 0) {
      nextErrors.amount = "Ingresa un monto válido para el anticipo.";
    }
    if (!formData.date) {
      nextErrors.date = "La fecha del adelanto es obligatoria.";
    }

    if (Object.keys(nextErrors).length > 0) {
      setErrors(nextErrors);
      return;
    }

    const normalizedData = {
      amount: parsedAmount,
      date: formData.date,
      notes: formData.notes.trim(),
    };
    onSubmit(normalizedData);
  };

  const handleOverlayMouseDown = (event) => {
    if (event.target === event.currentTarget) {
      onClose();
    }
  };

  return (
    <ModalOverlay onMouseDown={handleOverlayMouseDown}>
      <ModalContainer
        $maxWidth="500px"
        role="dialog"
        aria-modal="true"
        aria-labelledby="advance-modal-title"
      >
        <ModalHeader>
          <ModalTitle id="advance-modal-title">
            {isEditMode ? "Editar anticipo" : "Registrar anticipo"}
          </ModalTitle>
          <ModalCloseButton
            type="button"
            title="Cerrar"
            aria-label="Cerrar modal"
            onClick={onClose}
          >
            <X size={20} />
          </ModalCloseButton>
        </ModalHeader>

        <ModalForm onSubmit={handleSubmit}>
          <ModalContent>
            <ModalSection $compact>
              <FormGrid $columns={1}>
                <FormField>
                  <FormLabel htmlFor="advance-amount">Monto del adelanto (Bs.)</FormLabel>
                  <FormInput
                    id="advance-amount"
                    name="amount"
                    type="number"
                    step="0.01"
                    min="0"
                    placeholder="0.00"
                    value={formData.amount}
                    onChange={handleChange}
                    style={{ borderColor: errors.amount ? "#FF2B2B" : undefined }}
                    autoFocus
                  />
                  {errors.amount && (
                    <FormErrorText>{errors.amount}</FormErrorText>
                  )}
                </FormField>

                <FormField>
                  <FormLabel htmlFor="advance-date">Fecha del adelanto</FormLabel>
                  <InputIconContainer>
                    <FormInput
                      ref={dateInputRef}
                      id="advance-date"
                      name="date"
                      type="date"
                      value={formData.date}
                      onChange={handleChange}
                      style={{ borderColor: errors.date ? "#FF2B2B" : undefined }}
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
                  {errors.date && (
                    <FormErrorText>{errors.date}</FormErrorText>
                  )}
                </FormField>

                <FormField>
                  <FormLabel htmlFor="advance-notes">Notas / Observaciones</FormLabel>
                  <FormTextarea
                    id="advance-notes"
                    name="notes"
                    value={formData.notes}
                    onChange={handleChange}
                    placeholder="Detalles opcionales sobre el anticipo..."
                  />
                </FormField>
              </FormGrid>
            </ModalSection>
          </ModalContent>

          <ModalActions>
            <CancelButton type="button" onClick={onClose}>
              Cancelar
            </CancelButton>
            <PrimaryButton type="submit" $minWidth="170px">
              {isEditMode ? "Guardar cambios" : "Registrar anticipo"}
            </PrimaryButton>
          </ModalActions>
        </ModalForm>
      </ModalContainer>
    </ModalOverlay>
  );
};

export default AdvanceModal;
