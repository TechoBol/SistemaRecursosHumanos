import { useEffect, useRef, useState } from "react";
import { CalendarDays, MapPin, X } from "lucide-react";
import {
  CalendarButton,
  CancelButton,
  CloseButton,
  Field,
  FormCard,
  FormGrid,
  FormInput,
  FormLabel,
  FormSelect,
  InputIconContainer,
  ModalActions,
  ModalContainer,
  ModalContent,
  ModalHeader,
  ModalOverlay,
  ModalTitle,
  PrimaryButton,
  SectionTitle,
  ToggleButton,
  ToggleContainer,
} from "../ui/EmployeeModal.styles";

const INITIAL_FORM = {
  firstName: "",
  lastName: "",
  ci: "",
  birthDate: "",
  email: "",
  phone: "",
  address: "",
  contractCompany: "",
  consolidatedCompany: "",
  contractPosition: "",
  employeeType: "Planta",
  branch: "",
  contractDate: "",
  area: "",
  currentPosition: "",
};

const EmployeeModal = ({
  isOpen,
  mode = "create",
  employee = null,
  onClose,
  onSubmit,
}) => {
  const [formData, setFormData] = useState(INITIAL_FORM);
  const [openCalendar, setOpenCalendar] = useState(null);
  const birthDateRef = useRef(null);
  const contractDateRef = useRef(null);

  useEffect(() => {
    if (!isOpen) return;
    if (mode === "edit" && employee) {
      setFormData({
        firstName: employee.firstName ?? "",
        lastName: employee.lastName ?? "",
        ci: employee.ci ?? "",
        birthDate: employee.birthDate ?? "",

        email: employee.email ?? "",
        phone: employee.phone ?? "",
        address: employee.address ?? "",

        contractCompany: employee.contractCompany ?? "",
        consolidatedCompany: employee.consolidatedCompany ?? "",
        contractPosition: employee.positionContract ?? "",

        employeeType: employee.employeeType ?? "Planta",
        branch: employee.branch ?? "",
        contractDate: employee.contractDate ?? "",

        area: employee.area ?? "",
        currentPosition: employee.positionCurrent ?? "",
      });
      return;
    }
    setFormData(INITIAL_FORM);
  }, [isOpen, mode, employee]);

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

  const handleEmployeeType = (employeeType) => {
    setFormData((current) => ({
      ...current,
      employeeType,
    }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    onSubmit({
      ...formData,
      id: employee?.id,
    });
  };

  const handleOverlayClick = (event) => {
    if (event.target === event.currentTarget) {
      onClose();
    }
  };

  const title = mode === "edit" ? "Editar empleado" : "Agregar empleado";
  const buttonText = mode === "edit" ? "Guardar cambios" : "Añadir empleado";

  return (
    <ModalOverlay onMouseDown={handleOverlayClick}>
      <ModalContainer
        role="dialog"
        aria-modal="true"
        aria-labelledby="employee-modal-title"
      >
        <ModalHeader>
          <ModalTitle id="employee-modal-title">{title}</ModalTitle>
          <CloseButton
            type="button"
            aria-label="Cerrar modal"
            onClick={onClose}
          >
            <X size={22} />
          </CloseButton>
        </ModalHeader>

        <ModalContent as="form" onSubmit={handleSubmit}>
          <FormCard>
            <SectionTitle>Información personal</SectionTitle>
            <FormGrid>
              <Field>
                <FormLabel htmlFor="firstName">Nombre</FormLabel>
                <FormInput
                  id="firstName"
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleChange}
                  required
                />
              </Field>

              <Field>
                <FormLabel htmlFor="lastName">Apellido</FormLabel>
                <FormInput
                  id="lastName"
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleChange}
                  required
                />
              </Field>

              <Field>
                <FormLabel htmlFor="ci">CI</FormLabel>
                <FormInput
                  id="ci"
                  name="ci"
                  value={formData.ci}
                  onChange={handleChange}
                  required
                />
              </Field>

              <Field>
                <FormLabel htmlFor="birthDate">Fecha de nacimiento</FormLabel>
                <InputIconContainer>
                  <FormInput
                    ref={birthDateRef}
                    id="birthDate"
                    name="birthDate"
                    type="date"
                    value={formData.birthDate}
                    onChange={(event) => {
                      handleChange(event);
                      setOpenCalendar(null);
                    }}
                    onBlur={() => setOpenCalendar(null)}
                  />

                  <CalendarButton
                    type="button"
                    aria-label="Abrir o cerrar calendario de fecha de nacimiento"
                    onClick={() => {
                      if (openCalendar === "birthDate") {
                        birthDateRef.current?.blur();
                        setOpenCalendar(null);
                        return;
                      }
                      setOpenCalendar("birthDate");
                      birthDateRef.current?.showPicker?.();
                    }}
                  >
                    <CalendarDays size={19} />
                  </CalendarButton>
                </InputIconContainer>
              </Field>
            </FormGrid>
          </FormCard>

          <FormCard>
            <SectionTitle>Información de contacto</SectionTitle>
            <FormGrid $columns={3}>
              <Field>
                <FormLabel htmlFor="email">Correo</FormLabel>
                <FormInput
                  id="email"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                />
              </Field>

              <Field>
                <FormLabel htmlFor="phone">Teléfono</FormLabel>
                <FormInput
                  id="phone"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                />
              </Field>

              <Field>
                <FormLabel htmlFor="address">Dirección</FormLabel>
                <InputIconContainer>
                  <FormInput
                    id="address"
                    name="address"
                    value={formData.address}
                    onChange={handleChange}
                  />
                  <MapPin size={20} />
                </InputIconContainer>
              </Field>
            </FormGrid>

            <FormGrid $columns={3}>
              <Field>
                <FormLabel htmlFor="contractCompany">Empresa de contrato</FormLabel>
                <FormSelect
                  id="contractCompany"
                  name="contractCompany"
                  value={formData.contractCompany}
                  onChange={handleChange}
                  required
                >
                  <option value="">Seleccionar</option>
                  <option value="TechoBol">TechoBol</option>
                  <option value="Empresa A">Empresa A</option>
                  <option value="Empresa B">Empresa B</option>
                </FormSelect>
              </Field>

              <Field>
                <FormLabel htmlFor="consolidatedCompany">Empresa consolidada</FormLabel>
                <FormSelect
                  id="consolidatedCompany"
                  name="consolidatedCompany"
                  value={formData.consolidatedCompany}
                  onChange={handleChange}
                  required
                >
                  <option value="">Seleccionar</option>
                  <option value="TechoBol">TechoBol</option>
                  <option value="Empresa A">Empresa A</option>
                  <option value="Empresa B">Empresa B</option>
                </FormSelect>
              </Field>

              <Field>
                <FormLabel htmlFor="contractPosition">Cargo de contrato</FormLabel>
                <FormSelect
                  id="contractPosition"
                  name="contractPosition"
                  value={formData.contractPosition}
                  onChange={handleChange}
                  required
                >
                  <option value="">Seleccionar</option>
                  <option value="Auxiliar de sistemas">Auxiliar de sistemas</option>
                  <option value="Analista">Analista</option>
                  <option value="Desarrollador">Desarrollador</option>
                </FormSelect>
              </Field>
            </FormGrid>
          </FormCard>

          <FormCard>
            <SectionTitle>Información laboral</SectionTitle>
            <FormGrid $columns={3}>
              <Field>
                <FormLabel>Tipo de empleado</FormLabel>
                <ToggleContainer>
                  <ToggleButton
                    type="button"
                    $active={formData.employeeType === "Planta"}
                    onClick={() => handleEmployeeType("Planta")}
                  >
                    Planta
                  </ToggleButton>
                  <ToggleButton
                    type="button"
                    $active={formData.employeeType === "Consultor"}
                    onClick={() => handleEmployeeType("Consultor")}
                  >
                    Consultor
                  </ToggleButton>
                </ToggleContainer>
              </Field>

              <Field>
                <FormLabel htmlFor="branch">Sucursal</FormLabel>
                <FormSelect
                  id="branch"
                  name="branch"
                  value={formData.branch}
                  onChange={handleChange}
                  required
                >
                  <option value="">Seleccionar</option>
                  <option value="BARRIENTOS">Barrientos</option>
                  <option value="CENTRAL">Central</option>
                  <option value="NORTE">Norte</option>
                </FormSelect>
              </Field>

              <Field>
                <FormLabel htmlFor="contractDate">Fecha de contratación</FormLabel>
                <InputIconContainer>
                  <FormInput
                    ref={contractDateRef}
                    id="contractDate"
                    name="contractDate"
                    type="date"
                    value={formData.contractDate}
                    onChange={(event) => {
                      handleChange(event);
                      setOpenCalendar(null);
                    }}
                    onBlur={() => setOpenCalendar(null)}
                    required
                  />
                  <CalendarButton
                    type="button"
                    aria-label="Abrir o cerrar calendario de fecha de contratación"
                    onClick={() => {
                      if (openCalendar === "contractDate") {
                        contractDateRef.current?.blur();
                        setOpenCalendar(null);
                        return;
                      }
                      setOpenCalendar("contractDate");
                      contractDateRef.current?.showPicker?.();
                    }}
                  >
                    <CalendarDays size={19} />
                  </CalendarButton>
                </InputIconContainer>
              </Field>

              <Field>
                <FormLabel htmlFor="area">Área</FormLabel>
                <FormSelect
                  id="area"
                  name="area"
                  value={formData.area}
                  onChange={handleChange}
                  required
                >
                  <option value="">Seleccionar</option>
                  <option value="Tecnología">Tecnología</option>
                  <option value="Recursos Humanos">Recursos Humanos</option>
                  <option value="Administración">Administración</option>
                  <option value="Contabilidad">Contabilidad</option>
                </FormSelect>
              </Field>

              <Field>
                <FormLabel htmlFor="currentPosition">Cargo actual</FormLabel>
                <FormSelect
                  id="currentPosition"
                  name="currentPosition"
                  value={formData.currentPosition}
                  onChange={handleChange}
                  required
                >
                  <option value="">Seleccionar</option>
                  <option value="Auxiliar de Sistemas">Auxiliar de Sistemas</option>
                  <option value="Analista de Recursos Humanos">Analista de Recursos Humanos</option>
                  <option value="Desarrollador Frontend">Desarrollador Frontend</option>
                </FormSelect>
              </Field>
            </FormGrid>
          </FormCard>

          <ModalActions>
            <CancelButton type="button" onClick={onClose}>Cancelar</CancelButton>
            <PrimaryButton type="submit">{buttonText}</PrimaryButton>
          </ModalActions>
        </ModalContent>
      </ModalContainer>
    </ModalOverlay>
  );
};

export default EmployeeModal;