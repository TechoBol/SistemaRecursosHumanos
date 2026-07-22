import { useEffect, useState } from "react";
import { Eye, EyeOff, X } from "lucide-react";
import {
  FormField,
  FormGrid,
  FormInput,
  FormLabel,
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
  password: "",
  confirmPassword: "",
};

const UserModal = ({
  isOpen,
  mode = "create",
  user = null,
  onClose,
  onSubmit,
}) => {
  const isEditMode = mode === "edit";

  const [formData, setFormData] = useState(INITIAL_FORM);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    if (!isOpen) {
      return;
    }
    if (isEditMode && user) {
      setFormData({
        firstName: user.firstName ?? "",
        lastName: user.lastName ?? "",
        email: user.email ?? "",
        password: "",
        confirmPassword: "",
      });
    } else {
      setFormData(INITIAL_FORM);
    }
    setShowPassword(false);
    setShowConfirmPassword(false);
    setErrorMessage("");
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
    if (errorMessage) {
      setErrorMessage("");
    }
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    const normalizedData = {
      firstName: formData.firstName.trim(),
      lastName: formData.lastName.trim(),
      email: formData.email.trim(),
      password: formData.password,
      confirmPassword: formData.confirmPassword,
    };

    if (
      !normalizedData.firstName ||
      !normalizedData.lastName ||
      !normalizedData.email
    ) {
      setErrorMessage(
        "Completa el nombre, apellido y correo electrónico.",
      );
      return;
    }

    if (!isEditMode && !normalizedData.password) {
      setErrorMessage("La contraseña es obligatoria.");
      return;
    }

    if (
      normalizedData.password ||
      normalizedData.confirmPassword
    ) {
      if (
        normalizedData.password !==
        normalizedData.confirmPassword
      ) {
        setErrorMessage("Las contraseñas no coinciden.");
        return;
      }

      if (normalizedData.password.length < 6) {
        setErrorMessage(
          "La contraseña debe tener al menos 6 caracteres.",
        );
        return;
      }
    }

    const submittedData = {
      firstName: normalizedData.firstName,
      lastName: normalizedData.lastName,
      email: normalizedData.email,
    };

    /* En edición, la contraseña solo se envía cuando el usuario escribió una nueva */
    if (normalizedData.password) {
      submittedData.password = normalizedData.password;
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
                  />
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
                  />
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
                  />
                </FormField>

                <FormField>
                  <FormLabel htmlFor="user-password">
                    {isEditMode
                      ? "Nueva contraseña"
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
                </FormField>

                {errorMessage && (
                  <p
                    role="alert"
                    style={{
                      margin: 0,
                      color: "#FF2B2B",
                      fontSize: "12px",
                    }}
                  >
                    {errorMessage}
                  </p>
                )}
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