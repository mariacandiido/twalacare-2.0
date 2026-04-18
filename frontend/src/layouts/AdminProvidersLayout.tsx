import { Outlet } from "react-router-dom";
import { ThemeProvider } from "../contexts/ThemeContext";
import { AuthProvider } from "../hooks/useAuth";
import { DomTranslator } from "../i18n/DomTranslator";

export function AdminProvidersLayout() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <Outlet />
        <DomTranslator />
      </AuthProvider>
    </ThemeProvider>
  );
}
