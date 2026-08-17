import { useEffect, useMemo, useRef, useState } from "react";
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
  FormErrorText,
} from "../ui/Modal.styles";

const INITIAL_FORM = {
  firstName: "",
  lastName: "",
  ci: "",
  birthDate: "",
  email: "",
  phone: "",
  address: "",
  contractCompanyId: "",
  consolidatedCompanyId: "",
  employeeType: "Planta",
  branchId: "",
  areaId: "",
  jobTitleId: "",
  contractDate: "",
  endDate: "",
  baseSalary: "",
  status: "Activo",
};

const EmployeeModal = ({
  isOpen,
  mode = "create",
  employee = null,
  companies = [],
  branches = [],
  areas = [],
  jobTitles = [],
  onClose,
  onSubmit,
}) => {
  const [formData, setFormData] = useState(INITIAL_FORM);
  const [errors, setErrors] = useState({});
  const [openCalendar, setOpenCalendar] = useState(null);
  const birthDateRef = useRef(null);
  const contractDateRef = useRef(null);
  const endDateRef = useRef(null);
  const isEditMode = mode === "edit";

  const filteredJobTitles = useMemo(() => {
    if (!formData.areaId) return [];
    const areaIdNum = Number(formData.areaId);
    return jobTitles.filter((jt) =>
      jt.areas && jt.areas.some((a) => a.areaId === areaIdNum)
    );
  }, [jobTitles, formData.areaId]);

  useEffect(() => {
    if (!isOpen) {
      return;
    }
    setOpenCalendar(null);
    setErrors({});
    if (isEditMode && employee) {
      const activeContract = employee.contracts ? employee.contracts.find((c) => c.isActive) : null;
      setFormData({
        firstName: employee.firstNames ?? "",
        lastName: employee.lastNames ?? "",
        ci: employee.documentNumber ?? "",
        birthDate: employee.birthDate ? employee.birthDate.split("T")[0] : "",
        email: employee.email ?? "",
        phone: employee.phone ?? "",
        address: employee.address ?? "",
        contractCompanyId: activeContract?.contractCompanyId ?? "",
        consolidatedCompanyId: activeContract?.consolidatedCompanyId ?? "",
        employeeType: activeContract?.contractType === "CONSULTING" ? "Consultor" : "Planta",
        branchId: activeContract?.branchId ?? "",
        areaId: activeContract?.areaId ?? "",
        jobTitleId: activeContract?.jobTitleId ?? "",
        contractDate: activeContract?.hireDate ? activeContract.hireDate.split("T")[0] : "",
        endDate: activeContract?.endDate ? activeContract.endDate.split("T")[0] : "",
        baseSalary: activeContract?.baseSalary ?? "",
        status: employee.status === "INACTIVE" ? "Inactivo" : "Activo",
      });
      return;
    }
    setFormData(INITIAL_FORM);
  }, [isOpen, isEditMode, employee]);

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
    setFormData((currentForm) => {
      const updated = {
        ...currentForm,
        [name]: value,
      };
      if (name === "areaId") {
        updated.jobTitleId = "";
      }
      return updated;
    });
    setErrors((currentErrors) => ({
      ...currentErrors,
      [name]: "",
    }));
  };

  const handleEmployeeType = (employeeType) => {
    setFormData((currentForm) => ({
      ...currentForm,
      employeeType,
    }));
  };

  const validateForm = () => {
    const nextErrors = {};
    if (!formData.firstName.trim()) nextErrors.firstName = "El nombre es obligatorio.";
    if (!formData.lastName.trim()) nextErrors.lastName = "El apellido es obligatorio.";
    if (!formData.ci.trim()) nextErrors.ci = "El CI es obligatorio.";
    if (!formData.contractCompanyId) nextErrors.contractCompanyId = "Selecciona la empresa contratante.";
    if (!formData.consolidatedCompanyId) nextErrors.consolidatedCompanyId = "Selecciona la empresa consolidada.";
    if (!formData.branchId) nextErrors.branchId = "Selecciona una sucursal.";
    if (!formData.areaId) nextErrors.areaId = "Selecciona un área.";
    if (!formData.jobTitleId) nextErrors.jobTitleId = "Selecciona un cargo.";
    if (!formData.contractDate) nextErrors.contractDate = "La fecha de inicio es obligatoria.";

    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    if (!validateForm()) {
      return;
    }
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

  const title = isEditMode ? "Editar empleado" : "Agregar empleado";
  const buttonText = isEditMode ? "Guardar cambios" : "Añadir empleado";

  return (
    <ModalOverlay onMouseDown={handleOverlayClick}>
      <ModalContainer
        $maxWidth="900px"
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

        <ModalForm onSubmit={handleSubmit} noValidate>
          <ModalContent>
            <ModalSection>
              <ModalSectionTitle>Información personal</ModalSectionTitle>
              <FormGrid $columns={3}>
                <FormField>
                  <FormLabel htmlFor="firstName">Nombre</FormLabel>
                  <FormInput
                    id="firstName"
                    name="firstName"
                    value={formData.firstName}
                    onChange={handleChange}
                    autoComplete="given-name"
                    style={{ borderColor: errors.firstName ? "#FF2B2B" : undefined }}
                  />
                  {errors.firstName && <FormErrorText>{errors.firstName}</FormErrorText>}
                </FormField>

                <FormField>
                  <FormLabel htmlFor="lastName">Apellido</FormLabel>
                  <FormInput
                    id="lastName"
                    name="lastName"
                    value={formData.lastName}
                    onChange={handleChange}
                    autoComplete="family-name"
                    style={{ borderColor: errors.lastName ? "#FF2B2B" : undefined }}
                  />
                  {errors.lastName && <FormErrorText>{errors.lastName}</FormErrorText>}
                </FormField>

                <FormField>
                  <FormLabel htmlFor="ci">CI</FormLabel>
                  <FormInput
                    id="ci"
                    name="ci"
                    value={formData.ci}
                    onChange={handleChange}
                    style={{ borderColor: errors.ci ? "#FF2B2B" : undefined }}
                  />
                  {errors.ci && <FormErrorText>{errors.ci}</FormErrorText>}
                </FormField>
              </FormGrid>

              <FormGrid>
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
                      aria-expanded={openCalendar === "birthDate"}
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
                  <FormLabel htmlFor="email">Correo</FormLabel>
                  <FormInput
                    id="email"
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleChange}
                    autoComplete="email"
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
                  <FormLabel htmlFor="contractCompanyId">Empresa de contrato</FormLabel>
                  <FormSelect
                    id="contractCompanyId"
                    name="contractCompanyId"
                    value={formData.contractCompanyId}
                    onChange={handleChange}
                    style={{ borderColor: errors.contractCompanyId ? "#FF2B2B" : undefined }}
                  >
                    <option value="">Seleccionar</option>
                    {companies.map((c) => (
                      <option key={c.id} value={c.id}>{c.name}</option>
                    ))}
                  </FormSelect>
                  {errors.contractCompanyId && <FormErrorText>{errors.contractCompanyId}</FormErrorText>}
                </FormField>

                <FormField>
                  <FormLabel htmlFor="consolidatedCompanyId">Empresa consolidada</FormLabel>
                  <FormSelect
                    id="consolidatedCompanyId"
                    name="consolidatedCompanyId"
                    value={formData.consolidatedCompanyId}
                    onChange={handleChange}
                    style={{ borderColor: errors.consolidatedCompanyId ? "#FF2B2B" : undefined }}
                  >
                    <option value="">Seleccionar</option>
                    {companies.map((c) => (
                      <option key={c.id} value={c.id}>{c.name}</option>
                    ))}
                  </FormSelect>
                  {errors.consolidatedCompanyId && <FormErrorText>{errors.consolidatedCompanyId}</FormErrorText>}
                </FormField>

                <FormField>
                  <FormLabel>Tipo de empleado</FormLabel>
                  <ToggleGroup>
                    <ToggleButton
                      type="button"
                      $active={formData.employeeType === "Planta"}
                      aria-pressed={formData.employeeType === "Planta"}
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
                  <FormLabel htmlFor="branchId">Sucursal</FormLabel>
                  <FormSelect
                    id="branchId"
                    name="branchId"
                    value={formData.branchId}
                    onChange={handleChange}
                    style={{ borderColor: errors.branchId ? "#FF2B2B" : undefined }}
                  >
                    <option value="">Seleccionar</option>
                    {branches.map((b) => (
                      <option key={b.id} value={b.id}>{b.name}</option>
                    ))}
                  </FormSelect>
                  {errors.branchId && <FormErrorText>{errors.branchId}</FormErrorText>}
                </FormField>

                <FormField>
                  <FormLabel htmlFor="areaId">Área</FormLabel>
                  <FormSelect
                    id="areaId"
                    name="areaId"
                    value={formData.areaId}
                    onChange={handleChange}
                    style={{ borderColor: errors.areaId ? "#FF2B2B" : undefined }}
                  >
                    <option value="">Seleccionar</option>
                    {areas.map((a) => (
                      <option key={a.id} value={a.id}>{a.name}</option>
                    ))}
                  </FormSelect>
                  {errors.areaId && <FormErrorText>{errors.areaId}</FormErrorText>}
                </FormField>

                <FormField>
                  <FormLabel htmlFor="jobTitleId">Cargo actual</FormLabel>
                  <FormSelect
                    id="jobTitleId"
                    name="jobTitleId"
                    value={formData.jobTitleId}
                    onChange={handleChange}
                    disabled={!formData.areaId || filteredJobTitles.length === 0}
                    style={{ borderColor: errors.jobTitleId ? "#FF2B2B" : undefined }}
                  >
                    {!formData.areaId ? (
                      <option value="">Selecciona primero un área</option>
                    ) : filteredJobTitles.length === 0 ? (
                      <option value="">No hay cargos en esta área</option>
                    ) : (
                      <>
                        <option value="">Seleccionar</option>
                        {filteredJobTitles.map((jt) => (
                          <option key={jt.id} value={jt.id}>{jt.name}</option>
                        ))}
                      </>
                    )}
                  </FormSelect>
                  {errors.jobTitleId && <FormErrorText>{errors.jobTitleId}</FormErrorText>}
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
                      style={{ borderColor: errors.contractDate ? "#FF2B2B" : undefined }}
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
                  {errors.contractDate && <FormErrorText>{errors.contractDate}</FormErrorText>}
                </FormField>

                <FormField>
                  <FormLabel htmlFor="endDate">Fin de contrato</FormLabel>
                  <InputIconContainer>
                    <FormInput
                      ref={endDateRef}
                      id="endDate"
                      name="endDate"
                      type="date"
                      value={formData.endDate}
                      onChange={handleDateChange}
                      onBlur={() => setOpenCalendar(null)}
                    />

                    <InputIconButton
                      type="button"
                      aria-label="Abrir calendario de fecha fin de contrato"
                      aria-expanded={openCalendar === "endDate"}
                      onClick={() =>
                        openDatePicker(
                          "endDate",
                          endDateRef,
                        )
                      }
                    >
                      <CalendarDays size={19} />
                    </InputIconButton>
                  </InputIconContainer>
                </FormField>

                <FormField>
                  <FormLabel htmlFor="baseSalary">Salario Base (Bs.)</FormLabel>
                  <FormInput
                    id="baseSalary"
                    name="baseSalary"
                    type="number"
                    value={formData.baseSalary}
                    onChange={handleChange}
                  />
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