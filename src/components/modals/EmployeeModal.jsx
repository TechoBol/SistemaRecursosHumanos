import { useEffect, useRef, useState } from "react";
import { CalendarDays, MapPin, X } from "lucide-react";
import {
  CancelButton,
  FormField,
  FormGrid,
  FormInput,
  FormLabel,
  FormSelect,
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
  ModalSectionTitle,
  ModalTitle,
  PrimaryButton,
  ToggleButton,
  ToggleGroup,
} from "../ui/Modal.styles";

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
    if (!isOpen) {
      return;
    }
    setOpenCalendar(null);
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
    setFormData((currentForm) => ({
      ...currentForm,
      [name]: value,
    }));
  };

  const handleEmployeeType = (employeeType) => {
    setFormData((currentForm) => ({
      ...currentForm,
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

  const openDatePicker = (fieldName, inputRef) => {
    setOpenCalendar(fieldName);
    inputRef.current?.showPicker?.();
  };

  const handleDateChange = (event) => {
    handleChange(event);
    setOpenCalendar(null);
  };

  const title = mode === "edit" ? "Editar empleado" : "Agregar empleado";
  const buttonText = mode === "edit" ? "Guardar cambios" : "Añadir empleado";

  return (
    <ModalOverlay onMouseDown={handleOverlayClick}>
      <ModalContainer
        $maxWidth="800px"
        role="dialog"
        aria-modal="true"
        aria-labelledby="employee-modal-title"
      >
        <ModalHeader>
          <ModalTitle id="employee-modal-title">{title}</ModalTitle>
          <ModalCloseButton
            type="button"
            aria-label="Cerrar modal"
            onClick={onClose}
          >
            <X size={22} />
          </ModalCloseButton>
        </ModalHeader>

        <ModalForm onSubmit={handleSubmit}>
          <ModalContent>
            <ModalSection>
              <ModalSectionTitle>Información personal</ModalSectionTitle>
              <FormGrid>
                <FormField>
                  <FormLabel htmlFor="firstName">Nombre</FormLabel>
                  <FormInput
                    id="firstName"
                    name="firstName"
                    value={formData.firstName}
                    onChange={handleChange}
                    autoComplete="given-name"
                    required
                  />
                </FormField>

                <FormField>
                  <FormLabel htmlFor="lastName">Apellido</FormLabel>
                  <FormInput
                    id="lastName"
                    name="lastName"
                    value={formData.lastName}
                    onChange={handleChange}
                    autoComplete="family-name"
                    required
                  />
                </FormField>

                <FormField>
                  <FormLabel htmlFor="ci">CI</FormLabel>
                  <FormInput
                    id="ci"
                    name="ci"
                    value={formData.ci}
                    onChange={handleChange}
                    required
                  />
                </FormField>

                <FormField>
                  <FormLabel htmlFor="birthDate">Fecha de nacimiento</FormLabel>
                  <InputIconContainer>
                    <FormInput
                      ref={birthDateRef}
                      id="birthDate"
                      name="birthDate"
                      type="date"
                      value={formData.birthDate}
                      onChange={handleDateChange}
                      onBlur={() => setOpenCalendar(null)}
                    />

                    <InputIconButton
                      type="button"
                      aria-label="Abrir calendario de fecha de nacimiento"
                      aria-expanded={ openCalendar === "birthDate" }
                      onClick={() =>
                        openDatePicker(
                          "birthDate",
                          birthDateRef,
                        )
                      }
                    >
                      <CalendarDays size={19} />
                    </InputIconButton>
                  </InputIconContainer>
                </FormField>
              </FormGrid>

              <FormGrid $columns={3}>
                <FormField>
                  <FormLabel htmlFor="email">Correo</FormLabel>
                  <FormInput
                    id="email"
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleChange}
                    autoComplete="email"
                    required
                  />
                </FormField>

                <FormField>
                  <FormLabel htmlFor="phone">Teléfono</FormLabel>
                  <FormInput
                    id="phone"
                    name="phone"
                    type="tel"
                    value={formData.phone}
                    onChange={handleChange}
                    autoComplete="tel"
                  />
                </FormField>

                <FormField>
                  <FormLabel htmlFor="address">Dirección</FormLabel>
                  <InputIconContainer>
                    <FormInput
                      id="address"
                      name="address"
                      value={formData.address}
                      onChange={handleChange}
                      autoComplete="street-address"
                    />
                    <MapPin size={20} />
                  </InputIconContainer>
                </FormField>
              </FormGrid>
            </ModalSection>

            <ModalSection>
              <ModalSectionTitle>Información laboral</ModalSectionTitle>
              <FormGrid $columns={3}>
                <FormField>
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
                </FormField>

                <FormField>
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
                </FormField>

                <FormField>
                  <FormLabel>Tipo de empleado</FormLabel>
                  <ToggleGroup>
                    <ToggleButton
                      type="button"
                      $active={formData.employeeType === "Planta"}
                      aria-pressed={ formData.employeeType === "Planta" }
                      onClick={() => handleEmployeeType("Planta")}
                    >
                      Planta
                    </ToggleButton>

                    <ToggleButton
                      type="button"
                      $active={formData.employeeType === "Consultor"}
                      aria-pressed={formData.employeeType === "Consultor"}
                      onClick={() => handleEmployeeType("Consultor")}
                    >
                      Consultor
                    </ToggleButton>
                  </ToggleGroup>
                </FormField>
              </FormGrid>

              <FormGrid $columns={3}>
                <FormField>
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
                </FormField>

                <FormField>
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
                </FormField>

                <FormField>
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
                </FormField>

                <FormField>
                  <FormLabel htmlFor="contractDate">Inicio de contrato</FormLabel>
                  <InputIconContainer>
                    <FormInput
                      ref={contractDateRef}
                      id="contractDate"
                      name="contractDate"
                      type="date"
                      value={formData.contractDate}
                      onChange={handleDateChange}
                      onBlur={() => setOpenCalendar(null)}
                      required
                    />

                    <InputIconButton
                      type="button"
                      aria-label="Abrir calendario de fecha de contratación"
                      aria-expanded={openCalendar === "contractDate"}
                      onClick={() =>
                        openDatePicker(
                          "contractDate",
                          contractDateRef,
                        )
                      }
                    >
                      <CalendarDays size={19} />
                    </InputIconButton>
                  </InputIconContainer>
                </FormField>

                <FormField>
                  <FormLabel htmlFor="contractDate">Fin de contrato</FormLabel>
                  <InputIconContainer>
                    <FormInput
                      
                    />
                  </InputIconContainer>
                </FormField>
              </FormGrid>
            </ModalSection>
          </ModalContent>

          <ModalActions>
            <CancelButton type="button" onClick={onClose}>Cancelar</CancelButton>
            <PrimaryButton type="submit">{buttonText}</PrimaryButton>
          </ModalActions>
        </ModalForm>
      </ModalContainer>
    </ModalOverlay>
  );
};

export default EmployeeModal;