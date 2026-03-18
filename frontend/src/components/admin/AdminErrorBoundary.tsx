import { Component, type ErrorInfo, type ReactNode } from "react";

const G = "#2c5530";
const GOLD = "#c7a252";

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class AdminErrorBoundary extends Component<Props, State> {
  state: State = { hasError: false, error: null };

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error("AdminErrorBoundary:", error, errorInfo);
  }

  render() {
    if (this.state.hasError && this.state.error) {
      return (
        <div
          style={{
            minHeight: "100vh",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: 24,
            backgroundColor: "#f0f4f0",
            fontFamily: "'Roboto',sans-serif",
          }}
        >
          <div
            style={{
              maxWidth: 480,
              padding: 32,
              backgroundColor: "#fff",
              borderRadius: 16,
              border: "1px solid #e8f0e8",
              boxShadow: "0 4px 20px rgba(44,85,48,0.08)",
            }}
          >
            <h1
              style={{
                fontFamily: "'Poppins',sans-serif",
                fontWeight: 700,
                fontSize: 18,
                color: "#1a3320",
                margin: "0 0 8px",
              }}
            >
              Erro no painel admin
            </h1>
            <p style={{ fontSize: 14, color: "#7a8a7a", margin: "0 0 16px" }}>
              {this.state.error.message}
            </p>
            <button
              type="button"
              onClick={() => window.location.reload()}
              style={{
                padding: "10px 20px",
                borderRadius: 9,
                border: "none",
                backgroundColor: G,
                color: "#fff",
                fontFamily: "'Poppins',sans-serif",
                fontWeight: 600,
                fontSize: 14,
                cursor: "pointer",
              }}
            >
              Recarregar página
            </button>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}
