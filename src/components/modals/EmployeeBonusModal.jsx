import { useEffect, useState } from "react";
import { X } from "lucide-react";
import {
  FormErrorText,
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
  CancelButton,
} from "../ui/Modal.styles";

const INITIAL_FORM = {
  name: "",
  amount: "",
};

const EmployeeBonusModal = ({
  isOpen,
  onClose,
  onSubmit,
  initialData = null,
}) => {
  const [formData, setFormData] = useState(INITIAL_FORM);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (isOpen) {
      if (initialData) {
        setFormData({
          name: initialData.name || "",
          amount: initialData.amount !== undefined ? String(initialData.amount) : "",
        });
      } else {
        setFormData(INITIAL_FORM);
      }
      setErrors({});
    }
  }, [isOpen, initialData]);

  if (!isOpen) return null;

  const validateForm = () => {
    const newErrors = {};
    if (!formData.name.trim()) {
      newErrors.name = "El nombre del bono es obligatorio";
    }
    const numAmount = Number(formData.amount);
    if (!formData.amount || isNaN(numAmount) || numAmount <= 0) {
      newErrors.amount = "Ingrese un monto válido mayor a 0";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validateForm()) return;
    onSubmit({
      name: formData.name.trim(),
      amount: Number(formData.amount),
    });
  };

  return (
    <ModalOverlay onClick={onClose}>
      <ModalContainer $maxWidth="500px" onClick={(e) => e.stopPropagation()}>
        <ModalHeader>
          <ModalTitle>
            {initialData ? "Editar Bono" : "Agregar Bono"}
          </ModalTitle>
          <ModalCloseButton type="button" onClick={onClose}>
            <X size={20} />
          </ModalCloseButton>
        </ModalHeader>

        <ModalForm onSubmit={handleSubmit}>
          <ModalContent>
            <ModalSection>
              <FormGrid $columns={1}>
                <FormField>
                  <FormLabel>Nombre del bono *</FormLabel>
                  <FormInput
                    type="text"
                    placeholder="Ej. Bono de producción, Bono de transporte"
                    value={formData.name}
                    onChange={(e) => setFormData((prev) => ({ ...prev, name: e.target.value }))}
                    $hasError={!!errors.name}
                  />
                  {errors.name && <FormErrorText>{errors.name}</FormErrorText>}
                </FormField>

                <FormField>
                  <FormLabel>Monto (Bs.) *</FormLabel>
                  <FormInput
                    type="number"
                    step="0.01"
                    min="0"
                    placeholder="0.00"
                    value={formData.amount}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        amount: e.target.value,
                      }))
                    }
                    $hasError={!!errors.amount}
                  />
                  {errors.amount && (
                    <FormErrorText>{errors.amount}</FormErrorText>
                  )}
                </FormField>
              </FormGrid>
            </ModalSection>
          </ModalContent>

          <ModalActions>
            <CancelButton type="button" onClick={onClose}>
              Cancelar
            </CancelButton>
            <PrimaryButton type="submit">
              {initialData ? "Guardar Cambios" : "Agregar Bono"}
            </PrimaryButton>
          </ModalActions>
        </ModalForm>
      </ModalContainer>
    </ModalOverlay>
  );
};

export default EmployeeBonusModal;
