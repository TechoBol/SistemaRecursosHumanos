import { useEffect, useState } from "react";
import { X } from "lucide-react";
import {
  CancelButton,
  FormField,
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
} from "../ui/Modal.styles";

const PayrollModal = ({ isOpen, payroll = null, onClose, onSubmit }) => {
  const [status, setStatus] = useState("DRAFT");

  useEffect(() => {
    if (isOpen && payroll) {
      setStatus(payroll.status ?? "DRAFT");
    }
  }, [isOpen, payroll]);

  if (!isOpen || !payroll) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit({ status });
  };

  const handleOverlayClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <ModalOverlay $zIndex={1600} onMouseDown={handleOverlayClick}>
      <ModalContainer $maxWidth="420px" role="dialog" aria-modal="true">
        <ModalHeader>
          <ModalTitle>Editar estado de nómina</ModalTitle>
          <ModalCloseButton type="button" onClick={onClose}>
            <X size={21} />
          </ModalCloseButton>
        </ModalHeader>

        <ModalForm onSubmit={handleSubmit}>
          <ModalContent>
            <ModalSection $compact>
              <FormStack>
                <FormField>
                  <FormLabel>Empleado</FormLabel>
                  <FormInput
                    type="text"
                    value={payroll.employeeName || ""}
                    disabled
                  />
                </FormField>

                <FormField>
                  <FormLabel>Días trabajados</FormLabel>
                  <FormInput
                    type="number"
                    value={payroll.workedDays ?? 30}
                    disabled
                  />
                </FormField>

                <FormField>
                  <FormLabel htmlFor="status">Estado de la nómina</FormLabel>
                  <FormSelect
                    id="status"
                    name="status"
                    value={status}
                    onChange={(e) => setStatus(e.target.value)}
                  >
                    <option value="DRAFT">Borrador</option>
                    <option value="PAID">Pagado</option>
                  </FormSelect>
                </FormField>
              </FormStack>
            </ModalSection>
          </ModalContent>

          <ModalActions>
            <CancelButton type="button" onClick={onClose}>Cancelar</CancelButton>
            <PrimaryButton type="submit" $minWidth="160px">Guardar estado</PrimaryButton>
          </ModalActions>
        </ModalForm>
      </ModalContainer>
    </ModalOverlay>
  );
};

export default PayrollModal;