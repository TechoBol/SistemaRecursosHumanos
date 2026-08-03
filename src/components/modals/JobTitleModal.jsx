import { useCallback, useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { Check, ChevronDown, X } from "lucide-react";
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
  MultiSelect,
  MultiSelectChip,
  MultiSelectControl,
  MultiSelectMenu,
  MultiSelectOption,
  PrimaryButton,
} from "../ui/Modal.styles";

const INITIAL_FORM = {
  name: "",
  description: "",
  areaIds: [],
};

const JobTitleModal = ({
  isOpen,
  mode = "create",
  jobTitle = null,
  areas = [],
  onClose,
  onSubmit,
}) => {
  const [formData, setFormData] = useState(INITIAL_FORM);
  const [errors, setErrors] = useState({});
  const [isAreaMenuOpen, setIsAreaMenuOpen] = useState(false);
  const [menuPosition, setMenuPosition] = useState(null);
  const controlRef = useRef(null);
  const menuRef = useRef(null);
  const isEditMode = mode === "edit";

  useEffect(() => {
    if (!isOpen) {
      return;
    }
    setErrors({});
    setIsAreaMenuOpen(false);
    setMenuPosition(null);
    if (isEditMode && jobTitle) {
      setFormData({
        name: jobTitle.name ?? "",
        description: jobTitle.description ?? "",
        areaIds: jobTitle.areas ? jobTitle.areas.map((at) => at.areaId) : [],
      });
      return;
    }
    setFormData(INITIAL_FORM);
  }, [isOpen, isEditMode, jobTitle]);

  const updateMenuPosition = useCallback(() => {
    const control = controlRef.current;
    if (!control) {
      return;
    }
    const rect = control.getBoundingClientRect();
    const gap = 6;
    const viewportPadding = 16;
    const preferredHeight = 240;

    const availableBelow =
      window.innerHeight -
      rect.bottom -
      viewportPadding;

    const availableAbove = rect.top - viewportPadding;

    const openAbove =
      availableBelow < 160 &&
      availableAbove > availableBelow;

    const availableSpace = openAbove
      ? availableAbove
      : availableBelow;

    const position = {
      left: rect.left,
      width: rect.width,
      maxHeight: Math.max(
        120,
        Math.min(preferredHeight, availableSpace),
      ),
    };

    if (openAbove) {
      position.bottom =
        window.innerHeight - rect.top + gap;
    } else {
      position.top = rect.bottom + gap;
    }

    setMenuPosition(position);
  }, []);

  useEffect(() => {
    if (!isAreaMenuOpen) {
      setMenuPosition(null);
      return undefined;
    }

    updateMenuPosition();

    const handleOutsideClick = (event) => {
      const clickedControl =
        controlRef.current?.contains(event.target);

      const clickedMenu =
        menuRef.current?.contains(event.target);

      if (!clickedControl && !clickedMenu) {
        setIsAreaMenuOpen(false);
      }
    };

    document.addEventListener(
      "mousedown",
      handleOutsideClick,
    );

    document.addEventListener(
      "scroll",
      updateMenuPosition,
      true,
    );

    window.addEventListener(
      "resize",
      updateMenuPosition,
    );

    return () => {
      document.removeEventListener(
        "mousedown",
        handleOutsideClick,
      );

      document.removeEventListener(
        "scroll",
        updateMenuPosition,
        true,
      );

      window.removeEventListener(
        "resize",
        updateMenuPosition,
      );
    };
  }, [isAreaMenuOpen, updateMenuPosition]);

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

  const handleToggleArea = (areaId) => {
    setFormData((currentData) => {
      const isSelected =
        currentData.areaIds.includes(areaId);

      return {
        ...currentData,
        areaIds: isSelected
          ? currentData.areaIds.filter(
              (id) =>
                id !== areaId,
            )
          : [...currentData.areaIds, areaId],
      };
    });

    setErrors((currentErrors) => ({
      ...currentErrors,
      areaIds: "",
    }));
  };

  const handleRemoveArea = (event, areaId) => {
    event.stopPropagation();

    setFormData((currentData) => ({
      ...currentData,
      areaIds: currentData.areaIds.filter(
        (id) => id !== areaId,
      ),
    }));
  };

  const validateForm = () => {
    const nextErrors = {};

    if (!formData.name.trim()) {
      nextErrors.name =
        "El nombre del cargo es obligatorio.";
    }

    if (formData.areaIds.length === 0) {
      nextErrors.areaIds =
        "Selecciona al menos un área.";
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
      areaIds: formData.areaIds.map(Number),
    });
  };

  const handleOverlayClick = (event) => {
    if (event.target === event.currentTarget) {
      onClose();
    }
  };

  const getAreaName = (areaId) => {
    const area = areas.find((a) => a.id === areaId);
    return area ? area.name : "Sin Área";
  };

  const renderAreaMenu = () => {
    if (!isAreaMenuOpen || !menuPosition) {
      return null;
    }

    return createPortal(
      <MultiSelectMenu
        ref={menuRef}
        role="listbox"
        aria-label="Áreas disponibles"
        style={menuPosition}
      >
        {areas.map((area) => {
          const isSelected = formData.areaIds.includes(area.id);

          return (
            <MultiSelectOption
              key={area.id}
              type="button"
              role="option"
              $selected={isSelected}
              aria-selected={isSelected}
              onClick={() =>
                handleToggleArea(area.id)
              }
            >
              <span className="checkbox">
                {isSelected && (
                  <Check size={14} />
                )}
              </span>
              <span>{area.name}</span>
            </MultiSelectOption>
          );
        })}
      </MultiSelectMenu>,
      document.body,
    );
  };

  return (
    <ModalOverlay
      $zIndex={1600}
      onMouseDown={handleOverlayClick}
    >
      <ModalContainer
        $maxWidth="430px"
        $maxHeight="calc(90vh - 32px)"
        role="dialog"
        aria-modal="true"
        aria-labelledby="job-title-modal-title"
      >
        <ModalHeader>
          <ModalTitle id="job-title-modal-title">
            {isEditMode
              ? "Editar cargo"
              : "Agregar cargo"}
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

        <ModalForm
          onSubmit={handleSubmit}
          noValidate
        >
          <ModalContent>
            <ModalSection $compact>
              <FormStack>
                <FormField>
                  <FormLabel htmlFor="job-title-name">Nombre del cargo</FormLabel>
                  <FormInput
                    id="job-title-name"
                    name="name"
                    type="text"
                    value={formData.name}
                    onChange={handleChange}
                    autoFocus
                    style={{ borderColor: errors.name ? "#FF2B2B" : undefined }}
                    aria-invalid={Boolean(errors.name)}
                  />
                  {errors.name && (
                    <FormErrorText>{errors.name}</FormErrorText>
                  )}
                </FormField>

                <FormField>
                  <FormLabel htmlFor="job-title-description">Descripción</FormLabel>
                  <FormTextarea
                    id="job-title-description"
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                  />
                </FormField>

                <FormField>
                  <FormLabel>Áreas vinculadas</FormLabel>
                  <MultiSelect>
                    <MultiSelectControl
                      ref={controlRef}
                      type="button"
                      $open={isAreaMenuOpen}
                      aria-haspopup="listbox"
                      aria-expanded={isAreaMenuOpen}
                      style={{ borderColor: errors.areaIds ? "#FF2B2B" : undefined }}
                      aria-invalid={Boolean(errors.areaIds)}
                      onClick={() =>
                        setIsAreaMenuOpen(
                          (currentValue) => !currentValue,
                        )
                      }
                    >
                      <div className="values">
                        {formData.areaIds.length === 0 ? (
                          <span className="placeholder">Seleccionar áreas</span>
                        ) : (
                          formData.areaIds.map((areaId) => (
                            <MultiSelectChip key={areaId}>
                              <span>{getAreaName(areaId)}</span>
                              <button
                                type="button"
                                aria-label={`Quitar ${getAreaName(areaId)}`}
                                onClick={(event) => handleRemoveArea(event, areaId)}
                              >
                                <X size={13} />
                              </button>
                            </MultiSelectChip>
                          ))
                        )}
                      </div>
                      <ChevronDown size={18} />
                    </MultiSelectControl>
                    {renderAreaMenu()}
                  </MultiSelect>

                  {errors.areaIds && (
                    <FormErrorText>{errors.areaIds}</FormErrorText>
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
              {isEditMode ? "Guardar cambios" : "Agregar cargo"}
            </PrimaryButton>
          </ModalActions>
        </ModalForm>
      </ModalContainer>
    </ModalOverlay>
  );
};

export default JobTitleModal;