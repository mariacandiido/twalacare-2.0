import { RouterProvider } from "react-router-dom";
import { router } from "./routes";
import { AuthProvider } from "./hooks/useAuth";
import { ThemeProvider } from "./contexts/ThemeContext";
import { DomTranslator } from "./i18n/DomTranslator";

export default function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
      <RouterProvider router={router} />
        <DomTranslator />
      </AuthProvider>
    </ThemeProvider>
  );
}
