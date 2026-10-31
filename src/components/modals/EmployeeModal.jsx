import { useEffect, useRef, useState } from "react";
import { CalendarDays, MapPin, X, Plus, ChevronDown, ChevronUp, Briefcase, History, AlertCircle } from "lucide-react";
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
  ModalSectionHeader,
  ModalOutlineButton,
  ModalAccordionCard,
  ModalAccordionHeader,
  ModalAccordionLeading,
  ModalCircleIcon,
  ModalAccordionInfo,
  ModalAccordionTitle,
  ModalAccordionSubtitle,
  ModalAccordionTrailing,
  ModalBadge,
  ModalChevron,
  ModalAccordionBody,
  ModalAlert,
} from "../ui/Modal.styles";

const INITIAL_CONTRACT = {
  contractCompanyId: "",
  contractJobTitleId: "",
  consolidatedCompanyId: "",
  employeeType: "Fiscal",
  branchId: "",
  areaId: "",
  jobTitleId: "",
  contractDate: "",
  endDate: "",
  baseSalary: "",
};

const formatDateDisplay = (dateStr) => {
  if (!dateStr) return "Indefinido";
  const parts = dateStr.split("-");
  if (parts.length === 3) {
    return `${parts[2]}/${parts[1]}/${parts[0]}`;
  }
  return dateStr;
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
  const [personalData, setPersonalData] = useState({
    firstName: "",
    lastName: "",
    ci: "",
    birthDate: "",
    email: "",
    phone: "",
    address: "",
    status: "Activo",
  });

  const [contracts, setContracts] = useState([]);
  const [expandedIndex, setExpandedIndex] = useState(0);
  const [validationError, setValidationError] = useState("");
  const [errors, setErrors] = useState({});
  const [openCalendar, setOpenCalendar] = useState(null);
  const birthDateRef = useRef(null);
  const datePickerRefs = useRef({});
  const isEditMode = mode === "edit";

  useEffect(() => {
    if (!isOpen) return;

    setOpenCalendar(null);
    setErrors({});
    setValidationError("");

    if (isEditMode && employee) {
      setPersonalData({
        firstName: employee.firstNames ?? "",
        lastName: employee.lastNames ?? "",
        ci: employee.documentNumber ?? "",
        birthDate: employee.birthDate ? employee.birthDate.split("T")[0] : "",
        email: employee.email ?? "",
        phone: employee.phone ?? "",
        address: employee.address ?? "",
        status: employee.status === "INACTIVE" ? "Inactivo" : "Activo",
      });

      if (employee.contracts && employee.contracts.length > 0) {
        // Ordenar contratos: Más recientes primero
        const sortedContracts = [...employee.contracts].sort((a, b) => {
          const dateA = new Date(a.hireDate || 0).getTime();
          const dateB = new Date(b.hireDate || 0).getTime();
          return dateB - dateA;
        });

        const mappedContracts = sortedContracts.map((c) => ({
          id: c.id,
          contractCompanyId: c.contractCompanyId ? String(c.contractCompanyId) : "",
          contractJobTitleId: c.contractJobTitleId ? String(c.contractJobTitleId) : "",
          consolidatedCompanyId: c.consolidatedCompanyId ? String(c.consolidatedCompanyId) : "",
          employeeType: c.contractType === "CONSULTING" ? "Consultor" : "Fiscal",
          branchId: c.branchId ? String(c.branchId) : "",
          areaId: c.areaId ? String(c.areaId) : "",
          jobTitleId: c.jobTitleId ? String(c.jobTitleId) : "",
          contractDate: c.hireDate ? c.hireDate.split("T")[0] : "",
          endDate: c.endDate ? c.endDate.split("T")[0] : "",
          baseSalary: c.baseSalary !== undefined ? String(c.baseSalary) : "",
          isActive: c.isActive !== undefined ? c.isActive : !c.endDate,
        }));

        setContracts(mappedContracts);
        setExpandedIndex(0);
      } else {
        setContracts([{ ...INITIAL_CONTRACT }]);
        setExpandedIndex(0);
      }
    } else {
      setPersonalData({
        firstName: "",
        lastName: "",
        ci: "",
        birthDate: "",
        email: "",
        phone: "",
        address: "",
        status: "Activo",
      });
      setContracts([{ ...INITIAL_CONTRACT }]);
      setExpandedIndex(0);
    }
  }, [isOpen, isEditMode, employee]);

  useEffect(() => {
    if (!isOpen) return;
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

  if (!isOpen) return null;

  const handlePersonalChange = (e) => {
    const { name, value } = e.target;
    setPersonalData((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const handleContractChange = (index, field, value) => {
    setContracts((prev) => {
      const updated = [...prev];
      updated[index] = {
        ...updated[index],
        [field]: value,
      };
      if (field === "areaId") {
        updated[index].jobTitleId = "";
      }
      return updated;
    });

    setErrors((prev) => {
      const copy = { ...prev };
      delete copy[`contract_${index}_${field}`];
      return copy;
    });
    setValidationError("");
  };

  const handleAddContract = () => {
    setValidationError("");
    // Validar si existe al menos un contrato y si el último (más reciente) aún no finalizó
    if (contracts.length > 0) {
      const latestContract = contracts[0];
      if (!latestContract.endDate) {
        setValidationError(
          "Para crear un nuevo contrato, primero debe finalizar el contrato anterior asignándole una fecha de fin de contrato."
        );
        setExpandedIndex(0);
        return;
      }
    }

    // Agregar nuevo contrato al inicio (más reciente)
    const newContract = {
      ...INITIAL_CONTRACT,
    };
    setContracts([newContract, ...contracts]);
    setExpandedIndex(0);
  };

  const toggleAccordion = (index) => {
    setExpandedIndex((prev) => (prev === index ? -1 : index));
  };

  const validateAll = () => {
    const nextErrors = {};
    if (!personalData.firstName.trim()) nextErrors.firstName = "El nombre es obligatorio.";
    if (!personalData.lastName.trim()) nextErrors.lastName = "El apellido es obligatorio.";
    if (!personalData.ci.trim()) nextErrors.ci = "El CI es obligatorio.";
    if (contracts.length === 0) {
      setValidationError("Debe existir al menos un contrato registrado.");
      return false;
    }
    // Validar cada contrato
    contracts.forEach((c, idx) => {
      if (!c.contractCompanyId) nextErrors[`contract_${idx}_contractCompanyId`] = "Selecciona la empresa contratante.";
      if (!c.contractJobTitleId) nextErrors[`contract_${idx}_contractJobTitleId`] = "Selecciona el cargo del contrato.";
      if (!c.consolidatedCompanyId) nextErrors[`contract_${idx}_consolidatedCompanyId`] = "Selecciona la empresa consolidada.";
      if (!c.branchId) nextErrors[`contract_${idx}_branchId`] = "Selecciona una sucursal.";
      if (!c.areaId) nextErrors[`contract_${idx}_areaId`] = "Selecciona un área.";
      if (!c.jobTitleId) nextErrors[`contract_${idx}_jobTitleId`] = "Selecciona un cargo.";
      if (!c.contractDate) nextErrors[`contract_${idx}_contractDate`] = "La fecha de inicio es obligatoria.";
      if (!c.baseSalary || Number(c.baseSalary) <= 0) {
        nextErrors[`contract_${idx}_baseSalary`] = "Ingrese un salario mayor a 0";
      }
      // Validar fecha fin posterior a fecha inicio si existe
      if (c.contractDate && c.endDate && new Date(c.endDate) < new Date(c.contractDate)) {
        nextErrors[`contract_${idx}_endDate`] = "El fin de contrato no puede ser menor al inicio.";
      }
    });

    // Validar coherencia entre contratos sucesivos (fecha inicio del nuevo >= fin del anterior)
    for (let i = 0; i < contracts.length - 1; i++) {
      const newer = contracts[i];
      const older = contracts[i + 1];
      if (newer.contractDate && older.endDate) {
        if (new Date(newer.contractDate) < new Date(older.endDate)) {
          nextErrors[`contract_${i}_contractDate`] = "La fecha de inicio no debe ser menor a la fecha fin del contrato anterior.";
        }
      }
    }

    setErrors(nextErrors);

    if (Object.keys(nextErrors).length > 0) {
      const firstErrorKey = Object.keys(nextErrors).find((k) => k.startsWith("contract_"));
      if (firstErrorKey) {
        const errIndex = Number(firstErrorKey.split("_")[1]);
        if (!isNaN(errIndex)) {
          setExpandedIndex(errIndex);
        }
      }
      return false;
    }

    return true;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validateAll()) return;
    // El contrato activo principal es el primero sin fecha fin o el primero
    const primaryContract = contracts.find((c) => !c.endDate) || contracts[0];
    const payload = {
      ...personalData,
      id: employee?.id,
      // Compatibilidad con endpoints simples
      contractCompanyId: primaryContract.contractCompanyId,
      contractJobTitleId: primaryContract.contractJobTitleId,
      consolidatedCompanyId: primaryContract.consolidatedCompanyId,
      employeeType: primaryContract.employeeType,
      branchId: primaryContract.branchId,
      areaId: primaryContract.areaId,
      jobTitleId: primaryContract.jobTitleId,
      contractDate: primaryContract.contractDate,
      endDate: primaryContract.endDate || null,
      baseSalary: primaryContract.baseSalary,
      // Array completo de contratos
      contracts: contracts.map((c) => ({
        id: c.id,
        contractCompanyId: c.contractCompanyId,
        contractJobTitleId: c.contractJobTitleId,
        consolidatedCompanyId: c.consolidatedCompanyId,
        employeeType: c.employeeType,
        branchId: c.branchId,
        areaId: c.areaId,
        jobTitleId: c.jobTitleId,
        contractDate: c.contractDate,
        endDate: c.endDate || null,
        baseSalary: c.baseSalary,
        isActive: !c.endDate,
      })),
    };
    onSubmit(payload);
  };

  const handleOverlayClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  const openDatePicker = (key, ref) => {
    setOpenCalendar(key);
    ref?.showPicker?.();
  };

  const title = isEditMode ? "Editar empleado" : "Agregar empleado";
  const buttonText = isEditMode ? "Guardar cambios" : "Añadir empleado";

  return (
    <ModalOverlay onMouseDown={handleOverlayClick}>
      <ModalContainer
        $maxWidth="950px"
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
            {/* INFORMACIÓN PERSONAL */}
            <ModalSection>
              <ModalSectionTitle>Información personal</ModalSectionTitle>
              <FormGrid $columns={3}>
                <FormField>
                  <FormLabel htmlFor="firstName">Nombre</FormLabel>
                  <FormInput
                    id="firstName"
                    name="firstName"
                    value={personalData.firstName}
                    onChange={handlePersonalChange}
                    autoComplete="given-name"
                    $invalid={Boolean(errors.firstName)}
                  />
                  {errors.firstName && <FormErrorText>{errors.firstName}</FormErrorText>}
                </FormField>

                <FormField>
                  <FormLabel htmlFor="lastName">Apellido</FormLabel>
                  <FormInput
                    id="lastName"
                    name="lastName"
                    value={personalData.lastName}
                    onChange={handlePersonalChange}
                    autoComplete="family-name"
                    $invalid={Boolean(errors.lastName)}
                  />
                  {errors.lastName && <FormErrorText>{errors.lastName}</FormErrorText>}
                </FormField>

                <FormField>
                  <FormLabel htmlFor="ci">CI</FormLabel>
                  <FormInput
                    id="ci"
                    name="ci"
                    value={personalData.ci}
                    onChange={handlePersonalChange}
                    $invalid={Boolean(errors.ci)}
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
                      value={personalData.birthDate}
                      onChange={(e) => {
                        handlePersonalChange(e);
                        setOpenCalendar(null);
                      }}
                      onBlur={() => setOpenCalendar(null)}
                    />
                    <InputIconButton
                      type="button"
                      aria-label="Abrir calendario de fecha de nacimiento"
                      onClick={() => openDatePicker("birthDate", birthDateRef.current)}
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
                    value={personalData.phone}
                    onChange={handlePersonalChange}
                    autoComplete="tel"
                  />
                </FormField>

                <FormField>
                  <FormLabel htmlFor="email">Correo</FormLabel>
                  <FormInput
                    id="email"
                    name="email"
                    type="email"
                    value={personalData.email}
                    onChange={handlePersonalChange}
                    autoComplete="email"
                  />
                </FormField>

                <FormField>
                  <FormLabel htmlFor="address">Dirección</FormLabel>
                  <InputIconContainer>
                    <FormInput
                      id="address"
                      name="address"
                      value={personalData.address}
                      onChange={handlePersonalChange}
                      autoComplete="street-address"
                    />
                    <MapPin size={20} />
                  </InputIconContainer>
                </FormField>
              </FormGrid>
            </ModalSection>

            {/* INFORMACIÓN LABORAL */}
            <ModalSection>
              <ModalSectionHeader>
                <ModalSectionTitle $noMargin>Información laboral</ModalSectionTitle>
                <ModalOutlineButton type="button" onClick={handleAddContract}>
                  <Plus size={16} />
                  Nuevo contrato
                </ModalOutlineButton>
              </ModalSectionHeader>

              {validationError && (
                <ModalAlert>
                  <AlertCircle size={18} />
                  <span>{validationError}</span>
                </ModalAlert>
              )}

              {contracts.map((c, idx) => {
                const isExpanded = expandedIndex === idx;
                const isEnded = Boolean(c.endDate);
                const isActive = !isEnded;
                const companyObj = companies.find((co) => String(co.id) === String(c.contractCompanyId));
                const companyName = companyObj ? companyObj.name : "Empresa";
                const jobObj = jobTitles.find((jt) => String(jt.id) === String(c.contractJobTitleId));
                const jobName = jobObj ? jobObj.name : "Cargo contrato";
                const statusLabel = isActive ? `Activo • ${c.employeeType}` : `Finalizado • ${c.employeeType}`;
                const dateRangeText = `Periodo: ${formatDateDisplay(c.contractDate)} - ${formatDateDisplay(c.endDate)}`;
                const salaryText = `Salario: Bs. ${c.baseSalary || "0.00"}`;
                const currentAreaIdNum = Number(c.areaId);
                const areaJobTitles = currentAreaIdNum
                  ? jobTitles.filter((jt) => jt.areas && jt.areas.some((a) => a.areaId === currentAreaIdNum))
                  : [];

                return (
                  <ModalAccordionCard key={c.id || idx} $highlighted={isActive}>
                    <ModalAccordionHeader $highlighted={isActive} onClick={() => toggleAccordion(idx)}>
                      <ModalAccordionLeading>
                        <ModalCircleIcon $highlighted={isActive}>
                          {isActive ? <Briefcase size={16} /> : <History size={16} />}
                        </ModalCircleIcon>
                        <ModalAccordionInfo>
                          <ModalAccordionTitle>{companyName} — {jobName}</ModalAccordionTitle>
                          <ModalAccordionSubtitle>{dateRangeText} | {salaryText}</ModalAccordionSubtitle>
                        </ModalAccordionInfo>
                      </ModalAccordionLeading>

                      <ModalAccordionTrailing>
                        <ModalBadge $compact $bg={isActive ? "#dcfce7" : "#e2e8f0"} $color={isActive ? "#166534" : "#475569"}>{statusLabel}</ModalBadge>
                        <ModalChevron>
                          {isExpanded ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                        </ModalChevron>
                      </ModalAccordionTrailing>
                    </ModalAccordionHeader>

                    {isExpanded && (
                      <ModalAccordionBody>
                        <FormGrid $columns={3}>
                          <FormField>
                            <FormLabel htmlFor={`contractCompanyId_${idx}`}>Empresa de contrato</FormLabel>
                            <FormSelect
                              id={`contractCompanyId_${idx}`}
                              value={c.contractCompanyId}
                              onChange={(e) => handleContractChange(idx, "contractCompanyId", e.target.value)}
                              $invalid={Boolean(errors[`contract_${idx}_contractCompanyId`])}
                            >
                              <option value="">Seleccionar</option>
                              {companies.map((co) => (
                                <option key={co.id} value={co.id}>
                                  {co.name}
                                </option>
                              ))}
                            </FormSelect>
                            {errors[`contract_${idx}_contractCompanyId`] && (
                              <FormErrorText>{errors[`contract_${idx}_contractCompanyId`]}</FormErrorText>
                            )}
                          </FormField>

                          <FormField>
                            <FormLabel htmlFor={`contractJobTitleId_${idx}`}>Cargo contrato</FormLabel>
                            <FormSelect
                              id={`contractJobTitleId_${idx}`}
                              value={c.contractJobTitleId}
                              onChange={(e) => handleContractChange(idx, "contractJobTitleId", e.target.value)}
                              $invalid={Boolean(errors[`contract_${idx}_contractJobTitleId`])}
                            >
                              <option value="">Seleccionar</option>
                              {jobTitles.map((jt) => (
                                <option key={jt.id} value={jt.id}>
                                  {jt.name}
                                </option>
                              ))}
                            </FormSelect>
                            {errors[`contract_${idx}_contractJobTitleId`] && (
                              <FormErrorText>{errors[`contract_${idx}_contractJobTitleId`]}</FormErrorText>
                            )}
                          </FormField>

                          <FormField>
                            <FormLabel>Tipo de contrato</FormLabel>
                            <ToggleGroup>
                              <ToggleButton
                                type="button"
                                $active={c.employeeType === "Fiscal"}
                                aria-pressed={c.employeeType === "Fiscal"}
                                onClick={() => handleContractChange(idx, "employeeType", "Fiscal")}
                              >
                                Fiscal
                              </ToggleButton>

                              <ToggleButton
                                type="button"
                                $active={c.employeeType === "Consultor"}
                                aria-pressed={c.employeeType === "Consultor"}
                                onClick={() => handleContractChange(idx, "employeeType", "Consultor")}
                              >
                                Consultor
                              </ToggleButton>
                            </ToggleGroup>
                          </FormField>

                          <FormField>
                            <FormLabel htmlFor={`consolidatedCompanyId_${idx}`}>Empresa consolidada</FormLabel>
                            <FormSelect
                              id={`consolidatedCompanyId_${idx}`}
                              value={c.consolidatedCompanyId}
                              onChange={(e) => handleContractChange(idx, "consolidatedCompanyId", e.target.value)}
                              $invalid={Boolean(errors[`contract_${idx}_consolidatedCompanyId`])}
                            >
                              <option value="">Seleccionar</option>
                              {companies.map((co) => (
                                <option key={co.id} value={co.id}>
                                  {co.name}
                                </option>
                              ))}
                            </FormSelect>
                            {errors[`contract_${idx}_consolidatedCompanyId`] && (
                              <FormErrorText>{errors[`contract_${idx}_consolidatedCompanyId`]}</FormErrorText>
                            )}
                          </FormField>

                          <FormField>
                            <FormLabel htmlFor={`areaId_${idx}`}>Área</FormLabel>
                            <FormSelect
                              id={`areaId_${idx}`}
                              value={c.areaId}
                              onChange={(e) => handleContractChange(idx, "areaId", e.target.value)}
                              $invalid={Boolean(errors[`contract_${idx}_areaId`])}
                            >
                              <option value="">Seleccionar</option>
                              {areas.map((a) => (
                                <option key={a.id} value={a.id}>
                                  {a.name}
                                </option>
                              ))}
                            </FormSelect>
                            {errors[`contract_${idx}_areaId`] && (
                              <FormErrorText>{errors[`contract_${idx}_areaId`]}</FormErrorText>
                            )}
                          </FormField>

                          <FormField>
                            <FormLabel htmlFor={`jobTitleId_${idx}`}>Cargo actual</FormLabel>
                            <FormSelect
                              id={`jobTitleId_${idx}`}
                              value={c.jobTitleId}
                              onChange={(e) => handleContractChange(idx, "jobTitleId", e.target.value)}
                              disabled={!c.areaId || areaJobTitles.length === 0}
                              $invalid={Boolean(errors[`contract_${idx}_jobTitleId`])}
                            >
                              {!c.areaId ? (
                                <option value="">Selecciona primero un área</option>
                              ) : areaJobTitles.length === 0 ? (
                                <option value="">No hay cargos en esta área</option>
                              ) : (
                                <>
                                  <option value="">Seleccionar</option>
                                  {areaJobTitles.map((jt) => (
                                    <option key={jt.id} value={jt.id}>
                                      {jt.name}
                                    </option>
                                  ))}
                                </>
                              )}
                            </FormSelect>
                            {errors[`contract_${idx}_jobTitleId`] && (
                              <FormErrorText>{errors[`contract_${idx}_jobTitleId`]}</FormErrorText>
                            )}
                          </FormField>
                        </FormGrid>

                        <FormGrid $columns={4}>
                          <FormField>
                            <FormLabel htmlFor={`branchId_${idx}`}>Sucursal</FormLabel>
                            <FormSelect
                              id={`branchId_${idx}`}
                              value={c.branchId}
                              onChange={(e) => handleContractChange(idx, "branchId", e.target.value)}
                              $invalid={Boolean(errors[`contract_${idx}_branchId`])}
                            >
                              <option value="">Seleccionar</option>
                              {branches.map((b) => (
                                <option key={b.id} value={b.id}>
                                  {b.name}
                                </option>
                              ))}
                            </FormSelect>
                            {errors[`contract_${idx}_branchId`] && (
                              <FormErrorText>{errors[`contract_${idx}_branchId`]}</FormErrorText>
                            )}
                          </FormField>

                          <FormField>
                            <FormLabel htmlFor={`contractDate_${idx}`}>Inicio de contrato</FormLabel>
                            <InputIconContainer>
                              <FormInput
                                ref={(el) => {
                                  if (el) datePickerRefs.current[`contractDate_${idx}`] = el;
                                }}
                                id={`contractDate_${idx}`}
                                type="date"
                                value={c.contractDate}
                                onChange={(e) => {
                                  handleContractChange(idx, "contractDate", e.target.value);
                                  setOpenCalendar(null);
                                }}
                                onBlur={() => setOpenCalendar(null)}
                                $invalid={Boolean(errors[`contract_${idx}_contractDate`])}
                              />
                              <InputIconButton
                                type="button"
                                aria-label="Abrir calendario de inicio de contrato"
                                onClick={() =>
                                  openDatePicker(`contractDate_${idx}`, datePickerRefs.current[`contractDate_${idx}`])
                                }
                              >
                                <CalendarDays size={19} />
                              </InputIconButton>
                            </InputIconContainer>
                            {errors[`contract_${idx}_contractDate`] && (
                              <FormErrorText>{errors[`contract_${idx}_contractDate`]}</FormErrorText>
                            )}
                          </FormField>

                          <FormField>
                            <FormLabel htmlFor={`endDate_${idx}`}>Fin de contrato</FormLabel>
                            <InputIconContainer>
                              <FormInput
                                ref={(el) => {
                                  if (el) datePickerRefs.current[`endDate_${idx}`] = el;
                                }}
                                id={`endDate_${idx}`}
                                type="date"
                                value={c.endDate}
                                onChange={(e) => {
                                  handleContractChange(idx, "endDate", e.target.value);
                                  setOpenCalendar(null);
                                }}
                                onBlur={() => setOpenCalendar(null)}
                                $invalid={Boolean(errors[`contract_${idx}_endDate`])}
                              />
                              <InputIconButton
                                type="button"
                                aria-label="Abrir calendario de fin de contrato"
                                onClick={() =>
                                  openDatePicker(`endDate_${idx}`, datePickerRefs.current[`endDate_${idx}`])
                                }
                              >
                                <CalendarDays size={19} />
                              </InputIconButton>
                            </InputIconContainer>
                            {errors[`contract_${idx}_endDate`] && (
                              <FormErrorText>{errors[`contract_${idx}_endDate`]}</FormErrorText>
                            )}
                          </FormField>

                          <FormField>
                            <FormLabel htmlFor={`baseSalary_${idx}`}>Salario Base (Bs.)</FormLabel>
                            <FormInput
                              id={`baseSalary_${idx}`}
                              type="number"
                              step="0.01"
                              min="0"
                              placeholder="0.00"
                              value={c.baseSalary}
                              onChange={(e) => handleContractChange(idx, "baseSalary", e.target.value)}
                              $invalid={Boolean(errors[`contract_${idx}_baseSalary`])}
                            />
                            {errors[`contract_${idx}_baseSalary`] && (
                              <FormErrorText>{errors[`contract_${idx}_baseSalary`]}</FormErrorText>
                            )}
                          </FormField>
                        </FormGrid>
                      </ModalAccordionBody>
                    )}
                  </ModalAccordionCard>
                );
              })}
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