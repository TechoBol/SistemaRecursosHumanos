import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import loginBackground from "../assets/login-backgroung.png";
import {
  FooterText,
  FormContainer,
  FormSection,
  ImageSection,
  Input,
  InputGroup,
  LoginForm,
  LoginPage,
  LoginTitle,
  PasswordButton,
  SubmitButton,
} from "../components/ui/Login.styles";

const Login = () => {
  const [showPassword, setShowPassword] = useState(false);

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const handleChange = (event) => {
    const { name, value } = event.target;

    setFormData((currentData) => ({
      ...currentData,
      [name]: value,
    }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    console.log("Datos de inicio de sesión:", formData);
  };

  return (
    <LoginPage>
      <ImageSection
        $background={loginBackground}
        aria-hidden="true"
      />

      <FormSection>
        <FormContainer>
          <LoginTitle>Inicia Sesión!</LoginTitle>

          <LoginForm onSubmit={handleSubmit}>
            <InputGroup>
              <Input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="Correo"
                autoComplete="email"
                required
              />
            </InputGroup>

            <InputGroup>
              <Input
                type={showPassword ? "text" : "password"}
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="Contraseña"
                autoComplete="current-password"
                required
              />

              <PasswordButton
                type="button"
                onClick={() =>
                  setShowPassword((currentValue) => !currentValue)
                }
                aria-label={
                  showPassword
                    ? "Ocultar contraseña"
                    : "Mostrar contraseña"
                }
              >
                {showPassword ? (
                  <EyeOff size={18} strokeWidth={1.8} />
                ) : (
                  <Eye size={18} strokeWidth={1.8} />
                )}
              </PasswordButton>
            </InputGroup>

            <SubmitButton type="submit">
              Iniciar Sesión
            </SubmitButton>
          </LoginForm>
        </FormContainer>

        <FooterText>Recursos Humanos</FooterText>
      </FormSection>
    </LoginPage>
  );
};

export default Login;