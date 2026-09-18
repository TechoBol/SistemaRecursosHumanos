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
  ToggleButton,
  ToggleGroup,
} from "../ui/Modal.styles";

const INITIAL_FORM = {
  type: "days",
  startDate: "",
  endDate: "",
  days: "",
  amount: "",
  notes: "",
};

// Función auxiliar para calcular días entre dos fechas (inclusive)
const calculateCalendarDays = (startStr, endStr) => {
  if (!startStr || !endStr) return "";
  const start = new Date(startStr + "T00:00:00");
  const end = new Date(endStr + "T00:00:00");
  if (isNaN(start.getTime()) || isNaN(end.getTime())) return "";
  const diffTime = end.getTime() - start.getTime();
  if (diffTime < 0) return "";
  const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24)) + 1;
  return String(diffDays);
};

const VacationModal = ({
  isOpen,
  record = null,
  mode = "create",
  onClose,
  onSubmit,
}) => {
  const isEditMode = mode === "edit";
  const startDateRef = useRef(null);
  const endDateRef = useRef(null);
  const dateRef = useRef(null);

  const [formData, setFormData] = useState(INITIAL_FORM);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (!isOpen) {
      return;
    }
    if (isEditMode && record) {
      setFormData({
        type: record.type ?? "days",
        startDate: record.startDate ?? "",
        endDate: record.endDate ?? "",
        days: record.days !== undefined && record.days !== null ? String(record.days) : "",
        amount: record.amount !== undefined && record.amount !== null ? String(record.amount) : "",
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

  const handleSelectType = (type) => {
    setFormData((currentData) => ({
      ...currentData,
      type,
    }));
  };

  const handleStartDateChange = (e) => {
    const newStartDate = e.target.value;
    setFormData((currentData) => {
      let updatedEndDate = currentData.endDate;
      // Si la fecha fin estaba vacía o era igual a la fecha de inicio anterior, actualizar fecha fin al nuevo inicio por defecto
      if (!currentData.endDate || currentData.endDate === currentData.startDate) {
        updatedEndDate = newStartDate;
      }
      const calculatedDays = currentData.type === "days"
        ? calculateCalendarDays(newStartDate, updatedEndDate)
        : currentData.days;

      return {
        ...currentData,
        startDate: newStartDate,
        endDate: updatedEndDate,
        days: calculatedDays || currentData.days,
      };
    });

    if (errors.startDate) {
      setErrors((prev) => ({ ...prev, startDate: "" }));
    }
  };

  const handleEndDateChange = (e) => {
    const newEndDate = e.target.value;
    setFormData((currentData) => {
      const calculatedDays = currentData.type === "days"
        ? calculateCalendarDays(currentData.startDate, newEndDate)
        : currentData.days;

      return {
        ...currentData,
        endDate: newEndDate,
        days: calculatedDays || currentData.days,
      };
    });

    if (errors.endDate) {
      setErrors((prev) => ({ ...prev, endDate: "" }));
    }
  };

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

  const handleOpenCalendar = (ref) => {
    const input = ref.current;
    if (!input) return;
    if (typeof input.showPicker === "function") {
      input.showPicker();
      return;
    }
    input.focus();
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    const nextErrors = {};

    const parsedDays = Number(formData.days);
    if (!formData.days || isNaN(parsedDays) || parsedDays <= 0) {
      nextErrors.days = "Ingresa una cantidad de días válida.";
    }

    if (!formData.startDate) {
      nextErrors.startDate = "La fecha es obligatoria.";
    }

    if (formData.type === "days") {
      if (!formData.endDate) {
        nextErrors.endDate = "La fecha fin es obligatoria.";
      } else if (formData.startDate && formData.endDate < formData.startDate) {
        nextErrors.endDate = "La fecha fin no puede ser anterior a la fecha de inicio.";
      }
    } else if (formData.type === "money") {
      const parsedAmount = Number(formData.amount);
      if (!formData.amount || isNaN(parsedAmount) || parsedAmount <= 0) {
        nextErrors.amount = "Ingresa un monto válido.";
      }
    }

    if (Object.keys(nextErrors).length > 0) {
      setErrors(nextErrors);
      return;
    }

    const normalizedData = {
      type: formData.type,
      startDate: formData.startDate,
      endDate: formData.type === "days" ? formData.endDate : null,
      days: parsedDays,
      amount: formData.type === "money" ? Number(formData.amount) : null,
      notes: formData.notes.trim(),
    };
    onSubmit(normalizedData);
  };

  const handleOverlayMouseDown = (event) => {
    if (event.target === event.currentTarget) {
      onClose();
    }
  };

  const title = isEditMode
    ? "Editar registro de vacación"
    : "Registrar vacación";

  return (
    <ModalOverlay onMouseDown={handleOverlayMouseDown}>
      <ModalContainer
        $maxWidth="480px"
        role="dialog"
        aria-modal="true"
        aria-labelledby="vacation-modal-title"
      >
        <ModalHeader>
          <ModalTitle id="vacation-modal-title">{title}</ModalTitle>
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
                {/* Selector de Tipo (Día libre / Efectivo) */}
                <FormField>
                  <FormLabel>Tipo de vacación</FormLabel>
                  <ToggleGroup $columns={2}>
                    <ToggleButton
                      type="button"
                      $active={formData.type === "days"}
                      $variant="primary"
                      aria-pressed={formData.type === "days"}
                      onClick={() => handleSelectType("days")}
                    >
                      Día libre
                    </ToggleButton>
                    <ToggleButton
                      type="button"
                      $active={formData.type === "money"}
                      $variant="primary"
                      aria-pressed={formData.type === "money"}
                      onClick={() => handleSelectType("money")}
                    >
                      Efectivo
                    </ToggleButton>
                  </ToggleGroup>
                </FormField>

                {/* Campos según el modo seleccionado */}
                {formData.type === "days" ? (
                  <>
                    <FormGrid $columns={2}>
                      <FormField>
                        <FormLabel htmlFor="vacation-start-date">Fecha de inicio</FormLabel>
                        <InputIconContainer>
                          <FormInput
                            ref={startDateRef}
                            id="vacation-start-date"
                            name="startDate"
                            type="date"
                            value={formData.startDate}
                            onChange={handleStartDateChange}
                            style={{ borderColor: errors.startDate ? "#FF2B2B" : undefined }}
                          />
                          <InputIconButton
                            type="button"
                            title="Seleccionar fecha"
                            aria-label="Seleccionar fecha"
                            onClick={() => handleOpenCalendar(startDateRef)}
                          >
                            <CalendarDays size={19} />
                          </InputIconButton>
                        </InputIconContainer>
                        {errors.startDate && (
                          <FormErrorText>{errors.startDate}</FormErrorText>
                        )}
                      </FormField>

                      <FormField>
                        <FormLabel htmlFor="vacation-end-date">Fecha fin</FormLabel>
                        <InputIconContainer>
                          <FormInput
                            ref={endDateRef}
                            id="vacation-end-date"
                            name="endDate"
                            type="date"
                            value={formData.endDate}
                            onChange={handleEndDateChange}
                            style={{ borderColor: errors.endDate ? "#FF2B2B" : undefined }}
                          />
                          <InputIconButton
                            type="button"
                            title="Seleccionar fecha fin"
                            aria-label="Seleccionar fecha fin"
                            onClick={() => handleOpenCalendar(endDateRef)}
                          >
                            <CalendarDays size={19} />
                          </InputIconButton>
                        </InputIconContainer>
                        {errors.endDate && (
                          <FormErrorText>{errors.endDate}</FormErrorText>
                        )}
                      </FormField>
                    </FormGrid>

                    <FormField>
                      <FormLabel htmlFor="vacation-days">Cantidad de días</FormLabel>
                      <FormInput
                        id="vacation-days"
                        name="days"
                        type="number"
                        step="0.5"
                        min="0.5"
                        placeholder="Ej: 1, 2.5, 5"
                        value={formData.days}
                        onChange={handleChange}
                        style={{ borderColor: errors.days ? "#FF2B2B" : undefined }}
                      />
                      {errors.days && (
                        <FormErrorText>{errors.days}</FormErrorText>
                      )}
                    </FormField>
                  </>
                ) : (
                  <>
                    <FormGrid $columns={2}>
                      <FormField>
                        <FormLabel htmlFor="vacation-date">Fecha</FormLabel>
                        <InputIconContainer>
                          <FormInput
                            ref={dateRef}
                            id="vacation-date"
                            name="startDate"
                            type="date"
                            value={formData.startDate}
                            onChange={handleChange}
                            style={{ borderColor: errors.startDate ? "#FF2B2B" : undefined }}
                          />
                          <InputIconButton
                            type="button"
                            title="Seleccionar fecha"
                            aria-label="Seleccionar fecha"
                            onClick={() => handleOpenCalendar(dateRef)}
                          >
                            <CalendarDays size={19} />
                          </InputIconButton>
                        </InputIconContainer>
                        {errors.startDate && (
                          <FormErrorText>{errors.startDate}</FormErrorText>
                        )}
                      </FormField>

                      <FormField>
                        <FormLabel htmlFor="vacation-amount">Monto (Bs.)</FormLabel>
                        <FormInput
                          id="vacation-amount"
                          name="amount"
                          type="number"
                          step="0.01"
                          min="0"
                          placeholder="0.00"
                          value={formData.amount}
                          onChange={handleChange}
                          style={{ borderColor: errors.amount ? "#FF2B2B" : undefined }}
                        />
                        {errors.amount && (
                          <FormErrorText>{errors.amount}</FormErrorText>
                        )}
                      </FormField>
                    </FormGrid>

                    <FormField>
                      <FormLabel htmlFor="vacation-days">Cantidad de días</FormLabel>
                      <FormInput
                        id="vacation-days"
                        name="days"
                        type="number"
                        step="0.5"
                        min="0.5"
                        placeholder="Ej: 15"
                        value={formData.days}
                        onChange={handleChange}
                        style={{ borderColor: errors.days ? "#FF2B2B" : undefined }}
                      />
                      {errors.days && (
                        <FormErrorText>{errors.days}</FormErrorText>
                      )}
                    </FormField>
                  </>
                )}

                <FormField>
                  <FormLabel htmlFor="vacation-notes">Notas / Observaciones</FormLabel>
                  <FormTextarea
                    id="vacation-notes"
                    name="notes"
                    value={formData.notes}
                    onChange={handleChange}
                    placeholder="Detalles opcionales sobre la vacación..."
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
              {isEditMode ? "Guardar cambios" : "Registrar vacación"}
            </PrimaryButton>
          </ModalActions>
        </ModalForm>
      </ModalContainer>
    </ModalOverlay>
  );
};

export default VacationModal;
