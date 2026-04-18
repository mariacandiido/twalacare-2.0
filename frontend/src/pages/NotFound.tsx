import { Link } from "react-router-dom";
import { Home } from "lucide-react";

export function NotFound() {
  return (
    <div
      className="min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 twala-page-enter"
      style={{ backgroundColor: "#faf7f2" }}
    >
      <div className="max-w-md w-full text-center">

        {/* Ícone TwalaCare */}
        <div className="flex justify-center mb-8">
          <div
            className="relative"
            style={{
              width: 100,
              height: 100,
              background: "linear-gradient(135deg, #2c5530, #4a7856)",
              borderRadius: 24,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              boxShadow: "0 16px 40px rgba(44,85,48,0.25)",
              border: "2px solid rgba(199,162,82,0.3)",
            }}
          >
            <svg
              width="52"
              height="52"
              viewBox="0 0 52 52"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              {/* Círculo */}
              <circle cx="26" cy="26" r="18" stroke="#c7a252" strokeWidth="1.5" fill="none" strokeDasharray="4 2" />
              {/* Folha */}
              <path
                d="M26 14 C18 18 15 26 20 32 C23 35 28 35 31 32 C36 27 35 18 26 14Z"
                fill="#7aab7a"
              />
              {/* Cruz dourada */}
              <rect x="23.5" y="21" width="5" height="2" rx="1" fill="#c7a252" />
              <rect x="25" y="19.5" width="2" height="5" rx="1" fill="#c7a252" />
            </svg>
          </div>
        </div>

        {/* 404 */}
        <div className="mb-6">
          <p
            className="font-bold mb-2"
            style={{
              fontFamily: "'Poppins', sans-serif",
              fontSize: "clamp(80px, 12vw, 120px)",
              color: "#2c5530",
              lineHeight: 1,
              letterSpacing: "-4px",
            }}
          >
            404
          </p>
          {/* Linha dourada decorativa */}
          <div
            className="mx-auto"
            style={{
              height: 3,
              width: 80,
              background: "linear-gradient(90deg, transparent, #c7a252, transparent)",
              borderRadius: 2,
              marginBottom: 24,
            }}
          />
        </div>

        {/* Títulos */}
        <h2
          className="mb-4"
          style={{
            fontFamily: "'Poppins', sans-serif",
            fontWeight: 600,
            fontSize: "clamp(20px, 3vw, 28px)",
            color: "#2c3e2c",
          }}
        >
          Página não encontrada
        </h2>
        <p
          className="mb-10"
          style={{
            fontFamily: "'Roboto', sans-serif",
            fontSize: 16,
            color: "#5a6b5a",
            lineHeight: 1.7,
          }}
        >
          Desculpe, a página que você está procurando não existe ou foi movida.
          Mas a sua saúde está em boas mãos!
        </p>

        {/* Botão voltar */}
        <Link
          to="/"
          className="inline-flex items-center gap-2 px-8 py-3.5 rounded-xl font-medium transition-all duration-300"
          style={{
            backgroundColor: "#2c5530",
            color: "#ffffff",
            fontFamily: "'Roboto', sans-serif",
            fontWeight: 500,
            fontSize: 15,
            boxShadow: "0 4px 16px rgba(44,85,48,0.3)",
            textDecoration: "none",
          }}
          onMouseEnter={(e) => {
            (e.currentTarget as HTMLElement).style.backgroundColor = "#224428";
            (e.currentTarget as HTMLElement).style.transform = "translateY(-2px)";
            (e.currentTarget as HTMLElement).style.boxShadow = "0 8px 24px rgba(44,85,48,0.4)";
          }}
          onMouseLeave={(e) => {
            (e.currentTarget as HTMLElement).style.backgroundColor = "#2c5530";
            (e.currentTarget as HTMLElement).style.transform = "translateY(0)";
            (e.currentTarget as HTMLElement).style.boxShadow = "0 4px 16px rgba(44,85,48,0.3)";
          }}
        >
          <Home className="w-4 h-4" />
          Voltar à Página Inicial
        </Link>

        {/* Links úteis */}
        <div
          className="mt-8 pt-6 flex flex-wrap gap-4 justify-center"
          style={{ borderTop: "1px solid rgba(44,85,48,0.1)" }}
        >
          {[
            { to: "/farmacos",  label: "Medicamentos" },
            { to: "/farmacias", label: "Farmácias" },
            { to: "/sobre-nos", label: "Sobre Nós" },
          ].map((link) => (
            <Link
              key={link.to}
              to={link.to}
              className="twala-link text-sm"
              style={{ fontFamily: "'Roboto', sans-serif", fontWeight: 500, color: "#2c5530" }}
            >
              {link.label}
            </Link>
          ))}
        </div>

        {/* Selo TwalaCare */}
        <div className="mt-8">
          <span className="twala-seal" style={{ fontSize: 11 }}>
            TwalaCare · Farmácias Online · Angola
          </span>
        </div>
      </div>
    </div>
  );
}
