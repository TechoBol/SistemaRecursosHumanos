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
  const [formData, setFormData] = useState({
    workedDays: 30,
    otherBonuses: 0,
    absenceDeduction: 0,
    advanceDeduction: 0,
    status: "DRAFT",
  });

  useEffect(() => {
    if (isOpen && payroll) {
      setFormData({
        workedDays: payroll.workedDays ?? 30,
        otherBonuses: payroll.otherBonuses ?? 0,
        absenceDeduction: payroll.absenceDeduction ?? 0,
        advanceDeduction: payroll.advanceDeduction ?? 0,
        status: payroll.status ?? "DRAFT",
      });
    }
  }, [isOpen, payroll]);

  if (!isOpen || !payroll) return null;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === "status" ? value : Number(value),
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  const handleOverlayClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <ModalOverlay $zIndex={1600} onMouseDown={handleOverlayClick}>
      <ModalContainer $maxWidth="440px" role="dialog" aria-modal="true">
        <ModalHeader>
          <ModalTitle>Editar registro de nómina</ModalTitle>
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
                  <FormLabel htmlFor="workedDays">Días trabajados</FormLabel>
                  <FormInput
                    id="workedDays"
                    name="workedDays"
                    type="number"
                    min="0"
                    max="30"
                    step="1"
                    value={formData.workedDays}
                    onChange={handleChange}
                  />
                </FormField>

                <FormField>
                  <FormLabel htmlFor="otherBonuses">Otros bonos (Bs.)</FormLabel>
                  <FormInput
                    id="otherBonuses"
                    name="otherBonuses"
                    type="number"
                    min="0"
                    step="0.01"
                    value={formData.otherBonuses}
                    onChange={handleChange}
                  />
                </FormField>

                <FormField>
                  <FormLabel htmlFor="absenceDeduction">
                    Descuento Permisos/Faltas (Bs.)
                  </FormLabel>
                  <FormInput
                    id="absenceDeduction"
                    name="absenceDeduction"
                    type="number"
                    min="0"
                    step="0.01"
                    value={formData.absenceDeduction}
                    onChange={handleChange}
                  />
                </FormField>

                <FormField>
                  <FormLabel htmlFor="advanceDeduction">
                    Descuento Anticipos (Bs.)
                  </FormLabel>
                  <FormInput
                    id="advanceDeduction"
                    name="advanceDeduction"
                    type="number"
                    min="0"
                    step="0.01"
                    value={formData.advanceDeduction}
                    onChange={handleChange}
                  />
                </FormField>

                <FormField>
                  <FormLabel htmlFor="status">Estado</FormLabel>
                  <FormSelect
                    id="status"
                    name="status"
                    value={formData.status}
                    onChange={handleChange}
                  >
                    <option value="DRAFT">Borrador</option>
                    <option value="GENERATED">Generado</option>
                    <option value="APPROVED">Aprobado</option>
                    <option value="PAID">Pagado</option>
                    <option value="CANCELLED">Cancelado</option>
                  </FormSelect>
                </FormField>
              </FormStack>
            </ModalSection>
          </ModalContent>

          <ModalActions>
            <CancelButton type="button" onClick={onClose}>
              Cancelar
            </CancelButton>
            <PrimaryButton type="submit" $minWidth="160px">
              Guardar cambios
            </PrimaryButton>
          </ModalActions>
        </ModalForm>
      </ModalContainer>
    </ModalOverlay>
  );
};

export default PayrollModal;
