import React, { useState, useRef } from "react";
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
import useAuthentication from "../hooks/useAuthentication";

const Login = () => {
  const [showPassword, setShowPassword] = useState(false);

  const { signIn, isLoading } = useAuthentication();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const passwordRef = useRef(null);

  const handleChange = (event) => {
    const { name, value } = event.target;

    setFormData((currentData) => ({
      ...currentData,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    signIn(email, password);
  };

  return (
    <LoginPage>
      <ImageSection $background={loginBackground} aria-hidden="true" />

      <FormSection>
        <FormContainer>
          <LoginTitle>Inicia Sesión!</LoginTitle>

          <LoginForm onSubmit={handleSubmit}>
            <InputGroup>
              <Input
                type="email"
                placeholder="Ingrese su correo"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                autoFocus
                autoComplete="email"
                enterKeyHint="next"
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    passwordRef.current.focus();
                  }
                }}
                required
              />
            </InputGroup>

            <InputGroup>
              <Input
                ref={passwordRef}
                type={showPassword ? "text" : "password"}
                placeholder="Ingrese su contraseña"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                autoComplete="current-password"
                enterKeyHint="go"
                required
              />

              <PasswordButton
                type="button"
                onClick={() => setShowPassword((currentValue) => !currentValue)}
                aria-label={
                  showPassword ? "Ocultar contraseña" : "Mostrar contraseña"
                }
              >
                {showPassword ? (
                  <EyeOff size={18} strokeWidth={1.8} />
                ) : (
                  <Eye size={18} strokeWidth={1.8} />
                )}
              </PasswordButton>
            </InputGroup>

            <SubmitButton type="submit">Iniciar Sesión</SubmitButton>
          </LoginForm>
        </FormContainer>

        <FooterText>Recursos Humanos</FooterText>
      </FormSection>
    </LoginPage>
  );
};

export default Login;
