import styled from "styled-components";

export const LoginPage = styled.main`
  width: 100%;
  min-height: 100vh;
  display: grid;
  grid-template-columns: 44% 56%;
  overflow: hidden;
  background-color: ${({ theme }) => theme.colors.sidebar};
  @media (max-width: 900px) {
    grid-template-columns: 40% 60%;
  }
  @media (max-width: 700px) {
    display: block;
    background-color: ${({ theme }) => theme.colors.background};
  }
`;

export const ImageSection = styled.section`
  position: relative;
  z-index: 1;
  width: calc(100% + 80px);
  min-height: 100vh;
  background-image: url(${({ $background }) => $background});
  background-position: center;
  background-repeat: no-repeat;
  background-size: cover;
  @media (max-width: 900px) {
    width: calc(100% + 60px);
  }
  @media (max-width: 700px) {
    display: none;
  }
`;

export const FormSection = styled.section`
  position: relative;
  z-index: 2;
  min-width: 0;
  min-height: 100vh;
  padding: 40px 32px 24px;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: ${({ theme }) => theme.colors.background};
  border-top-left-radius: 72px;
  border-bottom-left-radius: 72px;
  overflow: hidden;
  @media (max-width: 900px) {
    padding: 36px 28px 22px;
    border-top-left-radius: 52px;
    border-bottom-left-radius: 52px;
  }
  @media (max-width: 700px) {
    min-height: 100vh;
    padding: 32px 24px 20px;

    border-radius: 0;
  }
`;

export const FormContainer = styled.div`
  width: min(100%, 400px);
  margin-top: -20px;
  @media (max-width: 900px) {
    width: min(100%, 360px);
  }
  @media (max-width: 700px) {
    width: min(100%, 420px);
    margin-top: 0;
  }
`;

export const LoginTitle = styled.h1`
  margin: 0 0 76px;
  color: ${({ theme }) => theme.colors.black};
  font-size: clamp(30px, 3vw, 38px);
  font-weight: 700;
  line-height: 1.2;
  text-align: center;
  @media (max-width: 900px) {
    margin-bottom: 60px;
  }
  @media (max-width: 700px) {
    margin-bottom: 48px;
    font-size: 30px;
  }
`;

export const LoginForm = styled.form`
  width: 100%;
  display: flex;
  flex-direction: column;
`;

export const InputGroup = styled.div`
  position: relative;
  width: 100%;
  margin-bottom: 28px;
`;

export const Input = styled.input`
  width: 100%;
  height: 42px;
  padding: 0 40px 8px 8px;
  border: none;
  border-bottom: 1px solid ${({ theme }) => theme.colors.border};
  outline: none;
  background-color: transparent;
  color: ${({ theme }) => theme.colors.text};
  font-size: 14px;
  font-weight: 400;
  transition: border-color ${({ theme }) => theme.transitions.fast};
  &::placeholder {
    color: ${({ theme }) => theme.colors.textMuted};
    opacity: 0.8;
  }
  &:focus {
    border-bottom-color: ${({ theme }) => theme.colors.primary};
  }
  &:disabled {
    cursor: not-allowed;
    opacity: 0.6;
  }
`;

export const PasswordButton = styled.button`
  position: absolute;
  right: 4px;
  bottom: 8px;
  width: 30px;
  height: 30px;
  display: grid;
  place-items: center;
  padding: 0;
  border: none;
  border-radius: 50%;
  background-color: transparent;
  color: ${({ theme }) => theme.colors.textMuted};
  cursor: pointer;
  transition:
    color ${({ theme }) => theme.transitions.fast},
    background-color ${({ theme }) => theme.transitions.fast};
  &:hover {
    color: ${({ theme }) => theme.colors.text};
    background-color: ${({ theme }) => theme.colors.menuHover};
  }
  &:focus-visible {
    outline: 2px solid ${({ theme }) => theme.colors.primary};
    outline-offset: 2px;
  }
`;

export const SubmitButton = styled.button`
  width: 100%;
  height: 50px;
  margin-top: 20px;
  padding: 0 24px;
  border: none;
  border-radius: 12px;
  background-color: ${({ theme }) => theme.colors.sidebar};
  color: ${({ theme }) => theme.colors.white};
  font-size: 15px;
  font-weight: 600;
  box-shadow: 0 3px 6px rgba(31, 31, 31, 0.28);
  cursor: pointer;
  transition:
    opacity ${({ theme }) => theme.transitions.fast},
    transform ${({ theme }) => theme.transitions.fast},
    box-shadow ${({ theme }) => theme.transitions.fast};
  &:hover {
    opacity: 0.94;
    transform: translateY(-1px);
    box-shadow: 0 5px 10px rgba(31, 31, 31, 0.24);
  }
  &:active {
    transform: translateY(0);
    box-shadow: 0 2px 4px rgba(31, 31, 31, 0.24);
  }
  &:focus-visible {
    outline: 2px solid ${({ theme }) => theme.colors.primary};
    outline-offset: 3px;
  }
  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
    transform: none;
  }
`;

export const FooterText = styled.p`
  position: absolute;
  bottom: 10px;
  left: 50%;
  margin: 0;
  color: ${({ theme }) => theme.colors.text};
  font-size: 15px;
  font-weight: 400;
  white-space: nowrap;
  transform: translateX(-50%);
  @media (max-width: 700px) {
    bottom: 14px;
  }
`;