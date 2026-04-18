// Página de Perfil do Cliente.
// Permite ao cliente autenticado visualizar e editar os seus dados pessoais.
// As alterações são guardadas através do hook useAuth (updateUser),
// que persiste os dados no localStorage enquanto não há backend real.

import { useState } from "react";
import { Link } from "react-router-dom";
import {
  User,
  Mail,
  Phone,
  MapPin,
  Calendar,
  Save,
  CheckCircle2,
  AlertCircle,
  ShoppingBag,
  FileText,
  X,
} from "lucide-react";
import { useAuth } from "../../hooks/useAuth";
import type { Cliente } from "../../types";

// -------------------------------------------------------
// TIPOS DO ALERTA
// O alerta pode ser de sucesso (verde) ou de erro (vermelho)
// -------------------------------------------------------
type TipoAlerta = "sucesso" | "erro";

interface EstadoAlerta {
  visivel: boolean;
  tipo: TipoAlerta;
  titulo: string;
  mensagem: string;
}

// -------------------------------------------------------
// COMPONENTE AlertModal
// Modal de alerta que aparece no centro do ecrã.
// Usa estilos inline para garantir compatibilidade com qualquer versão do Tailwind.
// Fecha ao clicar no botão "OK", no X, ou no fundo escuro.
// -------------------------------------------------------
function AlertModal({
  alerta,
  onFechar,
}: {
  alerta: EstadoAlerta;
  onFechar: () => void;
}) {
  // Se o alerta não estiver visível, não renderiza nada no DOM
  if (!alerta.visivel) return null;

  // Cores e ícone mudam conforme o tipo (sucesso = verde, erro = vermelho)
  const isSucesso = alerta.tipo === "sucesso";
  const Icone = isSucesso ? CheckCircle2 : AlertCircle;

  return (
    <div
      onClick={onFechar}
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 9999,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "rgba(0, 0, 0, 0.5)",
        padding: "1rem",
      }}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          background: "#faf7f2",
          borderRadius: 16,
          boxShadow: "0 25px 50px rgba(0,0,0,0.25)",
          width: "100%",
          maxWidth: "360px",
          padding: "2rem",
          position: "relative",
          borderTop: `4px solid ${isSucesso ? "#2c5530" : "#d45a5a"}`,
        }}
      >
        <button
          onClick={onFechar}
          aria-label="Fechar"
          style={{
            position: "absolute",
            top: "1rem",
            right: "1rem",
            background: "none",
            border: "none",
            cursor: "pointer",
            color: "#888",
            padding: "4px",
            borderRadius: "6px",
          }}
        >
          <X style={{ width: 20, height: 20 }} />
        </button>

        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", textAlign: "center", gap: "0.75rem" }}>
          <div
            style={{
              width: 72,
              height: 72,
              borderRadius: "50%",
              backgroundColor: isSucesso ? "rgba(44,85,48,0.1)" : "rgba(212,90,90,0.1)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Icone style={{ width: 36, height: 36, color: isSucesso ? "#2c5530" : "#d45a5a" }} />
          </div>

          <h3
            style={{
              fontFamily: "'Poppins', sans-serif",
              fontSize: "1.125rem",
              fontWeight: 600,
              color: isSucesso ? "#2c5530" : "#d45a5a",
              margin: 0,
            }}
          >
            {alerta.titulo}
          </h3>

          <p style={{ fontFamily: "'Roboto', sans-serif", fontSize: "0.875rem", color: "#666", lineHeight: 1.6, margin: 0 }}>
            {alerta.mensagem}
          </p>

          <button
            onClick={onFechar}
            style={{
              marginTop: "0.5rem",
              width: "100%",
              padding: "0.75rem",
              borderRadius: 8,
              border: "none",
              cursor: "pointer",
              backgroundColor: isSucesso ? "#2c5530" : "#d45a5a",
              color: "#ffffff",
              fontFamily: "'Poppins', sans-serif",
              fontWeight: 600,
              fontSize: "0.875rem",
              transition: "opacity 0.2s",
            }}
            onMouseOver={(e) => (e.currentTarget.style.opacity = "0.85")}
            onMouseOut={(e) => (e.currentTarget.style.opacity = "1")}
          >
            OK
          </button>
        </div>
      </div>
    </div>
  );
}

// -------------------------------------------------------
// COMPONENTE PRINCIPAL — Perfil do Cliente
// -------------------------------------------------------
export function PerfilCliente() {
  // Obtém o utilizador autenticado e a função de actualização do perfil
  const { user, updateUser, isLoading } = useAuth();

  // Faz o cast do utilizador genérico para o tipo Cliente,
  // para aceder aos campos específicos (provincia, municipio, etc.)
  const cliente = user as Cliente | null;

  // Estado do formulário — inicializado com os dados actuais do utilizador
  const [form, setForm] = useState({
    nome: cliente?.nome ?? "",
    email: cliente?.email ?? "",
    telefone: cliente?.telefone ?? "",
    dataNascimento: cliente?.dataNascimento ?? "",
    provincia: cliente?.provincia ?? "",
    municipio: cliente?.municipio ?? "",
    endereco: cliente?.endereco ?? "",
  });

  // Estado do modal de alerta — começa invisível
  const [alerta, setAlerta] = useState<EstadoAlerta>({
    visivel: false,
    tipo: "sucesso",
    titulo: "",
    mensagem: "",
  });

  // Fecha o modal limpando o estado de visibilidade
  const fecharAlerta = () => setAlerta((prev) => ({ ...prev, visivel: false }));

  // Abre o modal com o tipo, título e mensagem recebidos
  const abrirAlerta = (tipo: TipoAlerta, titulo: string, mensagem: string) => {
    setAlerta({ visivel: true, tipo, titulo, mensagem });
  };

  // Actualiza o campo correspondente no estado do formulário
  // sempre que o utilizador digita em qualquer input
  const handleChange = (campo: string, valor: string) => {
    setForm((prev) => ({ ...prev, [campo]: valor }));
  };

  // Valida e guarda as alterações do perfil
  const handleSalvar = async () => {
    // Validação básica: campos obrigatórios não podem estar vazios
    if (!form.nome.trim() || !form.email.trim() || !form.telefone.trim()) {
      abrirAlerta(
        "erro",
        "Campos obrigatórios em falta",
        "Nome, email e telefone são obrigatórios. Por favor preencha todos os campos antes de guardar."
      );
      return;
    }

    // Chama o updateUser do hook useAuth para persistir as alterações
    const sucesso = await updateUser(form);

    if (sucesso) {
      // Mostra o alerta de sucesso com os dados guardados
      abrirAlerta(
        "sucesso",
        "Perfil actualizado!",
        `As suas informações foram guardadas com sucesso, ${form.nome.split(" ")[0]}.`
      );
    } else {
      abrirAlerta(
        "erro",
        "Erro ao guardar",
        "Ocorreu um problema ao guardar as alterações. Tente novamente."
      );
    }
  };

  // Gera as iniciais do nome para o avatar (ex: "Maria Cândido" → "MC")
  const iniciais =
    (cliente?.nome ?? "")
      .split(" ")
      .slice(0, 2)
      .map((n) => n.charAt(0).toUpperCase())
      .join("") || "C";

  const inputStyle = {
    width: "100%",
    padding: "10px 12px 10px 40px",
    border: "1px solid #d5e8d6",
    borderRadius: 8,
    fontFamily: "'Roboto', sans-serif",
    fontSize: 14,
    color: "#2c3e2c",
    backgroundColor: "#ffffff",
    outline: "none",
    transition: "border-color 0.2s",
  };

  const labelStyle = {
    display: "block",
    fontFamily: "'Roboto', sans-serif",
    fontWeight: 500,
    fontSize: 12,
    color: "#4a7856",
    textTransform: "uppercase" as const,
    letterSpacing: "0.05em",
    marginBottom: 6,
  };

  return (
    <div className="twala-page-enter min-h-screen py-8 px-4 sm:px-6 lg:px-8" style={{ backgroundColor: "#faf7f2" }}>
      <AlertModal alerta={alerta} onFechar={fecharAlerta} />
      <div className="max-w-3xl mx-auto space-y-6">

        <div>
          <h1
            style={{
              fontFamily: "'Poppins', sans-serif",
              fontWeight: 600,
              fontSize: "clamp(1.5rem, 3vw, 2rem)",
              color: "#2c3e2c",
              marginBottom: 4,
            }}
          >
            Meu Perfil
          </h1>
          <div style={{ width: 60, height: 3, background: "linear-gradient(90deg, #2c5530, #c7a252)", borderRadius: 2, marginBottom: 4 }} />
          <p style={{ fontFamily: "'Roboto', sans-serif", color: "#4a7856", fontSize: 14 }}>
            Visualize e edite as suas informações pessoais
          </p>
        </div>

        {/* Card de apresentação */}
        <div className="twala-card overflow-hidden" style={{ borderBottom: "3px solid #c7a252" }}>
          <div style={{ height: 96, background: "linear-gradient(135deg, #2c5530 0%, #4a7856 100%)" }} />
          <div className="px-6 pb-6">
            <div className="flex flex-col sm:flex-row sm:items-end gap-4" style={{ marginTop: -48, marginBottom: 24 }}>
              <div
                style={{
                  width: 80,
                  height: 80,
                  borderRadius: 16,
                  background: "linear-gradient(135deg, #2c5530, #4a7856)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  border: "3px solid #c7a252",
                  boxShadow: "0 4px 12px rgba(44,85,48,0.3)",
                  flexShrink: 0,
                }}
              >
                <span
                  style={{
                    fontFamily: "'Poppins', sans-serif",
                    fontWeight: 700,
                    fontSize: 28,
                    color: "#ffffff",
                  }}
                >
                  {iniciais}
                </span>
              </div>
              <div className="pb-1">
                <h2 style={{ fontFamily: "'Poppins', sans-serif", fontWeight: 600, fontSize: 20, color: "#2c3e2c", margin: 0 }}>
                  {cliente?.nome ?? "Cliente"}
                </h2>
                <p style={{ fontFamily: "'Roboto', sans-serif", fontSize: 14, color: "#4a7856", margin: "2px 0" }}>
                  {cliente?.email}
                </p>
                <span
                  style={{
                    display: "inline-block",
                    marginTop: 4,
                    padding: "2px 10px",
                    backgroundColor: "rgba(44,85,48,0.1)",
                    color: "#2c5530",
                    fontSize: 11,
                    fontFamily: "'Roboto', sans-serif",
                    fontWeight: 600,
                    borderRadius: 20,
                    border: "1px solid rgba(44,85,48,0.2)",
                  }}
                >
                  Cliente
                </span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <Link
                to="/cliente/historico-compras"
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 12,
                  padding: 12,
                  borderRadius: 8,
                  border: "1px solid #e5e5e5",
                  textDecoration: "none",
                  transition: "all 0.2s ease",
                }}
                onMouseEnter={e => {
                  (e.currentTarget as HTMLAnchorElement).style.borderColor = "#c7a252";
                  (e.currentTarget as HTMLAnchorElement).style.backgroundColor = "rgba(199,162,82,0.05)";
                }}
                onMouseLeave={e => {
                  (e.currentTarget as HTMLAnchorElement).style.borderColor = "#e5e5e5";
                  (e.currentTarget as HTMLAnchorElement).style.backgroundColor = "transparent";
                }}
              >
                <div
                  style={{
                    width: 36,
                    height: 36,
                    borderRadius: 8,
                    backgroundColor: "rgba(44,85,48,0.1)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    flexShrink: 0,
                  }}
                >
                  <ShoppingBag style={{ width: 16, height: 16, color: "#2c5530" }} />
                </div>
                <div>
                  <p style={{ fontFamily: "'Roboto', sans-serif", fontSize: 12, fontWeight: 600, color: "#2c3e2c", margin: 0 }}>Compras</p>
                  <p style={{ fontFamily: "'Roboto', sans-serif", fontSize: 11, color: "#888", margin: 0 }}>Ver histórico</p>
                </div>
              </Link>
              <Link
                to="/cliente/receitas-enviadas"
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 12,
                  padding: 12,
                  borderRadius: 8,
                  border: "1px solid #e5e5e5",
                  textDecoration: "none",
                  transition: "all 0.2s ease",
                }}
                onMouseEnter={e => {
                  (e.currentTarget as HTMLAnchorElement).style.borderColor = "#c7a252";
                  (e.currentTarget as HTMLAnchorElement).style.backgroundColor = "rgba(199,162,82,0.05)";
                }}
                onMouseLeave={e => {
                  (e.currentTarget as HTMLAnchorElement).style.borderColor = "#e5e5e5";
                  (e.currentTarget as HTMLAnchorElement).style.backgroundColor = "transparent";
                }}
              >
                <div
                  style={{
                    width: 36,
                    height: 36,
                    borderRadius: 8,
                    backgroundColor: "rgba(199,162,82,0.1)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    flexShrink: 0,
                  }}
                >
                  <FileText style={{ width: 16, height: 16, color: "#c7a252" }} />
                </div>
                <div>
                  <p style={{ fontFamily: "'Roboto', sans-serif", fontSize: 12, fontWeight: 600, color: "#2c3e2c", margin: 0 }}>Receitas</p>
                  <p style={{ fontFamily: "'Roboto', sans-serif", fontSize: 11, color: "#888", margin: 0 }}>Ver enviadas</p>
                </div>
              </Link>
            </div>
          </div>
        </div>

        {/* Formulário */}
        <div className="twala-card p-6">
          <h3
            style={{
              fontFamily: "'Poppins', sans-serif",
              fontWeight: 600,
              fontSize: 16,
              color: "#2c3e2c",
              marginBottom: 20,
            }}
          >
            Informações Pessoais
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <div className="sm:col-span-2">
              <label style={labelStyle}>Nome completo *</label>
              <div className="relative">
                <User style={{ position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)", width: 16, height: 16, color: "#4a7856" }} />
                <input type="text" value={form.nome} onChange={(e) => handleChange("nome", e.target.value)} placeholder="O seu nome completo" style={inputStyle} />
              </div>
            </div>

            <div>
              <label style={labelStyle}>Email *</label>
              <div className="relative">
                <Mail style={{ position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)", width: 16, height: 16, color: "#4a7856" }} />
                <input type="email" value={form.email} onChange={(e) => handleChange("email", e.target.value)} placeholder="o.seu@email.com" style={inputStyle} />
              </div>
            </div>

            <div>
              <label style={labelStyle}>Telefone *</label>
              <div className="relative">
                <Phone style={{ position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)", width: 16, height: 16, color: "#4a7856" }} />
                <input type="tel" value={form.telefone} onChange={(e) => handleChange("telefone", e.target.value)} placeholder="+244 9XX XXX XXX" style={inputStyle} />
              </div>
            </div>

            <div>
              <label style={labelStyle}>Data de Nascimento</label>
              <div className="relative">
                <Calendar style={{ position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)", width: 16, height: 16, color: "#4a7856" }} />
                <input type="date" value={form.dataNascimento} onChange={(e) => handleChange("dataNascimento", e.target.value)} style={inputStyle} />
              </div>
            </div>

            <div>
              <label style={labelStyle}>Província</label>
              <div className="relative">
                <MapPin style={{ position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)", width: 16, height: 16, color: "#4a7856" }} />
                <input type="text" value={form.provincia} onChange={(e) => handleChange("provincia", e.target.value)} placeholder="Ex: Luanda" style={inputStyle} />
              </div>
            </div>

            <div>
              <label style={labelStyle}>Município</label>
              <div className="relative">
                <MapPin style={{ position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)", width: 16, height: 16, color: "#4a7856" }} />
                <input type="text" value={form.municipio} onChange={(e) => handleChange("municipio", e.target.value)} placeholder="Ex: Ingombota" style={inputStyle} />
              </div>
            </div>

            <div className="sm:col-span-2">
              <label style={labelStyle}>Morada / Endereço de entrega</label>
              <div className="relative">
                <MapPin style={{ position: "absolute", left: 12, top: 12, width: 16, height: 16, color: "#4a7856" }} />
                <textarea
                  value={form.endereco}
                  onChange={(e) => handleChange("endereco", e.target.value)}
                  placeholder="Ex: Rua da Missão, nº 45, Bairro Azul"
                  rows={3}
                  style={{ ...inputStyle, paddingTop: 12, resize: "none" }}
                />
              </div>
            </div>
          </div>

          <div className="mt-6 flex justify-end">
            <button
              onClick={handleSalvar}
              disabled={isLoading}
              className="twala-btn-primary flex items-center gap-2"
              style={isLoading ? { opacity: 0.7, cursor: "not-allowed" } : {}}
            >
              {isLoading ? (
                <>
                  <div style={{ width: 16, height: 16, border: "2px solid rgba(255,255,255,0.3)", borderTop: "2px solid #fff", borderRadius: "50%", animation: "spin 1s linear infinite" }} />
                  A guardar...
                </>
              ) : (
                <>
                  <Save style={{ width: 16, height: 16 }} />
                  Guardar Alterações
                </>
              )}
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}
