import { useEffect, useState } from "react";
import { Eye, EyeOff, X } from "lucide-react";
import {
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
  ModalTitle,
  PrimaryButton,
  CancelButton,
} from "../ui/Modal.styles";

const INITIAL_FORM = {
  firstName: "",
  lastName: "",
  email: "",
  roleId: "",
  password: "",
  confirmPassword: "",
};

const ErrorMessage = ({ message }) => {
  if (!message) return null;
  return (
    <span
      role="alert"
      style={{
        color: "#FF2B2B",
        fontSize: "11px",
        marginTop: "3px",
        display: "block",
      }}
    >
      {message}
    </span>
  );
};

const UserModal = ({
  isOpen,
  mode = "create",
  user = null,
  roles = [],
  onClose,
  onSubmit,
}) => {
  const isEditMode = mode === "edit";

  const [formData, setFormData] = useState(INITIAL_FORM);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (!isOpen) {
      return;
    }
    if (isEditMode && user) {
      setFormData({
        firstName: user.firstName ?? "",
        lastName: user.lastName ?? "",
        email: user.email ?? "",
        roleId: user.role?.id ?? "",
        password: "",
        confirmPassword: "",
      });
    } else {
      setFormData(INITIAL_FORM);
    }
    setShowPassword(false);
    setShowConfirmPassword(false);
    setErrors({});
  }, [isOpen, isEditMode, user]);

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
      setErrors((prev) => ({
        ...prev,
        [name]: "",
      }));
    }
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    const newErrors = {};
    const firstName = formData.firstName.trim();
    const lastName = formData.lastName.trim();
    const email = formData.email.trim();
    const roleId = formData.roleId;
    const password = formData.password;
    const confirmPassword = formData.confirmPassword;

    if (!firstName) {
      newErrors.firstName = "El nombre es obligatorio.";
    }
    if (!lastName) {
      newErrors.lastName = "El apellido es obligatorio.";
    }
    if (!email) {
      newErrors.email = "El correo electrónico es obligatorio.";
    } else {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        newErrors.email = "El formato de correo no es válido.";
      }
    }
    if (!roleId) {
      newErrors.roleId = "El rol de usuario es obligatorio.";
    }

    if (!isEditMode && !password) {
      newErrors.password = "La contraseña es obligatoria.";
    }

    if (password || confirmPassword) {
      if (password && password.length < 6) {
        newErrors.password = "Debe tener al menos 6 caracteres.";
      }
      if (password !== confirmPassword) {
        newErrors.confirmPassword = "Las contraseñas no coinciden.";
      }
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    const submittedData = {
      firstName,
      lastName,
      email,
      roleId: Number(roleId),
    };

    if (password) {
      submittedData.password = password;
    }

    onSubmit(submittedData);
  };

  const handleOverlayClick = (event) => {
    if (event.target === event.currentTarget) {
      onClose();
    }
  };

  return (
    <ModalOverlay
      $zIndex={1600}
      onMouseDown={handleOverlayClick}
    >
      <ModalContainer
        $maxWidth="430px"
        $maxHeight="calc(90vh - 40px)"
        role="dialog"
        aria-modal="true"
        aria-labelledby="user-modal-title"
        onMouseDown={(event) => event.stopPropagation()}
      >
        <ModalHeader>
          <ModalTitle id="user-modal-title">
            {isEditMode
              ? "Editar usuario"
              : "Registrar usuario"}
          </ModalTitle>

          <ModalCloseButton
            type="button"
            aria-label="Cerrar modal"
            title="Cerrar"
            onClick={onClose}
          >
            <X size={21} />
          </ModalCloseButton>
        </ModalHeader>

        <ModalForm onSubmit={handleSubmit}>
          <ModalContent $scrollable={false}>
            <ModalSection $compact>
              <FormGrid $columns={2}>
                <FormField>
                  <FormLabel htmlFor="user-first-name">Nombre</FormLabel>
                  <FormInput
                    id="user-first-name"
                    name="firstName"
                    type="text"
                    value={formData.firstName}
                    autoComplete="given-name"
                    onChange={handleChange}
                    style={{ borderColor: errors.firstName ? "#FF2B2B" : undefined }}
                  />
                  <ErrorMessage message={errors.firstName} />
                </FormField>

                <FormField>
                  <FormLabel htmlFor="user-last-name">Apellido</FormLabel>
                  <FormInput
                    id="user-last-name"
                    name="lastName"
                    type="text"
                    value={formData.lastName}
                    autoComplete="family-name"
                    onChange={handleChange}
                    style={{ borderColor: errors.lastName ? "#FF2B2B" : undefined }}
                  />
                  <ErrorMessage message={errors.lastName} />
                </FormField>
              </FormGrid>

              <FormGrid $columns={1}>
                <FormField>
                  <FormLabel htmlFor="user-email">Correo electrónico</FormLabel>
                  <FormInput
                    id="user-email"
                    name="email"
                    type="email"
                    value={formData.email}
                    autoComplete="email"
                    onChange={handleChange}
                    style={{ borderColor: errors.email ? "#FF2B2B" : undefined }}
                  />
                  <ErrorMessage message={errors.email} />
                </FormField>

                <FormField>
                  <FormLabel htmlFor="user-role">Rol de usuario</FormLabel>
                  <FormSelect
                    id="user-role"
                    name="roleId"
                    value={formData.roleId}
                    onChange={handleChange}
                    style={{ borderColor: errors.roleId ? "#FF2B2B" : undefined }}
                  >
                    <option value="">Selecciona un rol</option>
                    {roles.map((role) => (
                      <option key={role.id} value={role.id}>
                        {role.name}
                      </option>
                    ))}
                  </FormSelect>
                  <ErrorMessage message={errors.roleId} />
                </FormField>

                <FormField>
                  <FormLabel htmlFor="user-password">
                    {isEditMode
                      ? "Nueva contraseña (opcional)"
                      : "Contraseña"}
                  </FormLabel>

                  <InputIconContainer>
                    <FormInput
                      id="user-password"
                      name="password"
                      type={
                        showPassword ? "text" : "password"
                      }
                      value={formData.password}
                      autoComplete="new-password"
                      onChange={handleChange}
                      style={{ borderColor: errors.password ? "#FF2B2B" : undefined }}
                    />

                    <InputIconButton
                      type="button"
                      aria-label={
                        showPassword
                          ? "Ocultar contraseña"
                          : "Mostrar contraseña"
                      }
                      title={
                        showPassword
                          ? "Ocultar contraseña"
                          : "Mostrar contraseña"
                      }
                      onClick={() =>
                        setShowPassword((current) => !current)
                      }
                    >
                      {showPassword ? (
                        <EyeOff size={20} />
                      ) : (
                        <Eye size={20} />
                      )}
                    </InputIconButton>
                  </InputIconContainer>
                  <ErrorMessage message={errors.password} />
                </FormField>

                <FormField>
                  <FormLabel htmlFor="user-confirm-password">Confirmar contraseña</FormLabel>
                  <InputIconContainer>
                    <FormInput
                      id="user-confirm-password"
                      name="confirmPassword"
                      type={
                        showConfirmPassword
                          ? "text"
                          : "password"
                      }
                      value={formData.confirmPassword}
                      autoComplete="new-password"
                      onChange={handleChange}
                      style={{ borderColor: errors.confirmPassword ? "#FF2B2B" : undefined }}
                    />

                    <InputIconButton
                      type="button"
                      aria-label={
                        showConfirmPassword
                          ? "Ocultar confirmación"
                          : "Mostrar confirmación"
                      }
                      title={
                        showConfirmPassword
                          ? "Ocultar confirmación"
                          : "Mostrar confirmación"
                      }
                      onClick={() =>
                        setShowConfirmPassword(
                          (current) => !current,
                        )
                      }
                    >
                      {showConfirmPassword ? (
                        <EyeOff size={20} />
                      ) : (
                        <Eye size={20} />
                      )}
                    </InputIconButton>
                  </InputIconContainer>
                  <ErrorMessage message={errors.confirmPassword} />
                </FormField>
              </FormGrid>
            </ModalSection>
          </ModalContent>

          <ModalActions>
            <CancelButton type="button" onClick={onClose}>Cancelar</CancelButton>
            <PrimaryButton type="submit" $minWidth="190px">
              {isEditMode
                ? "Guardar cambios"
                : "Registrar usuario"}
            </PrimaryButton>
          </ModalActions>
        </ModalForm>
      </ModalContainer>
    </ModalOverlay>
  );
};

export default UserModal;