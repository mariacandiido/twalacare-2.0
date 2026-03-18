import { useState, useMemo, type ReactNode } from "react";
import { useFarmaciasStore } from "../../store/farmaciasStore";
import { useEntregadoresAdminStore } from "../../store/entregadoresAdminStore";
import { useAdminLogsStore } from "../../store/adminLogsStore";
import {
  UsuarioTabela,
  BadgeStatusUsuario,
  type StatusUsuario,
  type ColunaUsuario,
} from "../../components/admin/UsuarioTabela";

const G = "#2c5530";
const GOLD = "#c7a252";

type Tab = "clientes" | "farmacias" | "entregadores";

interface UsuarioBase {
  id: string;
  nome: string;
  email: string;
  tipo: Tab;
}

const mockClientes: (UsuarioBase & { telefone: string; provincia: string; dataRegisto: string })[] = [
  { id: "c1", nome: "Maria Cliente", email: "cliente@gmail.com", telefone: "+244 900 000 001", provincia: "Luanda", dataRegisto: "2024-01-01", tipo: "clientes" },
  { id: "c2", nome: "João Baptista", email: "joao@gmail.com", telefone: "+244 911 111 002", provincia: "Benguela", dataRegisto: "2025-02-10", tipo: "clientes" },
  { id: "c3", nome: "Ana Costa", email: "ana@gmail.com", telefone: "+244 922 222 003", provincia: "Luanda", dataRegisto: "2025-03-05", tipo: "clientes" },
  { id: "c4", nome: "Pedro Mendes", email: "pedro@gmail.com", telefone: "+244 933 333 004", provincia: "Luanda", dataRegisto: "2025-01-20", tipo: "clientes" },
  { id: "c5", nome: "Sofia Lopes", email: "sofia@gmail.com", telefone: "+244 944 444 005", provincia: "Huíla", dataRegisto: "2025-02-28", tipo: "clientes" },
  { id: "c6", nome: "Carlos Fernandes", email: "carlos.f@gmail.com", telefone: "+244 955 555 006", provincia: "Luanda", dataRegisto: "2025-03-01", tipo: "clientes" },
];

function ModalPerfil({
  titulo,
  children,
  onFechar,
}: {
  titulo: string;
  children: ReactNode;
  onFechar: () => void;
}) {
  return (
    <div
      onClick={onFechar}
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 9998,
        backgroundColor: "rgba(0,0,0,0.5)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: 16,
      }}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          backgroundColor: "#fff",
          borderRadius: 16,
          padding: 28,
          width: "100%",
          maxWidth: 440,
          borderTop: `4px solid ${G}`,
          maxHeight: "85vh",
          overflowY: "auto",
        }}
      >
        <h3 style={{ fontFamily: "'Poppins',sans-serif", fontWeight: 600, fontSize: 16, color: "#1a3320", margin: "0 0 16px" }}>
          {titulo}
        </h3>
        <div style={{ fontFamily: "'Roboto',sans-serif", fontSize: 13, color: "#2c3e2c" }}>{children}</div>
        <button
          onClick={onFechar}
          style={{
            marginTop: 20,
            padding: "10px 20px",
            borderRadius: 8,
            border: "1.5px solid #d5e8d6",
            backgroundColor: "#fff",
            fontFamily: "'Roboto',sans-serif",
            fontSize: 14,
            cursor: "pointer",
          }}
        >
          Fechar
        </button>
      </div>
    </div>
  );
}

export function AdminUsuarios() {
  const [tab, setTab] = useState<Tab>("clientes");
  const [busca, setBusca] = useState("");
  const [filtroStatus, setFiltroStatus] = useState<StatusUsuario | "">("");
  const [perfilAberto, setPerfilAberto] = useState<Record<string, unknown> | null>(null);
  const [toast, setToast] = useState({ visivel: false, msg: "", ok: true });

  const [statusClientes, setStatusClientes] = useState<Record<string, StatusUsuario>>({});
  const [statusFarmacias, setStatusFarmacias] = useState<Record<string, StatusUsuario>>({});
  const [statusEntregadores, setStatusEntregadores] = useState<Record<string, StatusUsuario>>({});

  const { obterAprovadas, obterTodas } = useFarmaciasStore();
  const { obterAprovados, obterTodas: obterTodasEntregadores } = useEntregadoresAdminStore();
  const addLog = useAdminLogsStore((s) => s.addLog);

  const farmaciasAprovadas = obterAprovadas();
  const entregadoresAprovados = obterAprovados();

  const getStatus = (id: string, tipo: Tab): StatusUsuario => {
    if (tipo === "clientes") return statusClientes[id] ?? "ATIVO";
    if (tipo === "farmacias") return statusFarmacias[id] ?? "ATIVO";
    return statusEntregadores[id] ?? "ATIVO";
  };

  const setStatus = (id: string, tipo: Tab, status: StatusUsuario) => {
    if (tipo === "clientes") setStatusClientes((s) => ({ ...s, [id]: status }));
    if (tipo === "farmacias") setStatusFarmacias((s) => ({ ...s, [id]: status }));
    else setStatusEntregadores((s) => ({ ...s, [id]: status }));
  };

  const mostrarToast = (msg: string, ok = true) => {
    setToast({ visivel: true, msg, ok });
    setTimeout(() => setToast((p) => ({ ...p, visivel: false })), 3200);
  };

  const handleSuspender = (row: Record<string, unknown>, tipo: Tab) => {
    const id = String(row.id);
    const nome = String(row.nome ?? "");
    setStatus(id, tipo, "SUSPENSO");
    addLog("Conta suspensa", nome, tipo === "clientes" ? "cliente" : tipo === "farmacias" ? "farmacia" : "entregador");
    mostrarToast(`"${nome}" suspenso.`);
  };

  const handleCancelar = (row: Record<string, unknown>, tipo: Tab) => {
    const id = String(row.id);
    const nome = String(row.nome ?? "");
    setStatus(id, tipo, "BANIDO");
    addLog("Conta cancelada (banida)", nome, tipo === "clientes" ? "cliente" : tipo === "farmacias" ? "farmacia" : "entregador");
    mostrarToast(`Conta "${nome}" cancelada.`, false);
  };

  const handleReativar = (row: Record<string, unknown>, tipo: Tab) => {
    const id = String(row.id);
    const nome = String(row.nome ?? "");
    setStatus(id, tipo, "ATIVO");
    addLog("Conta reativada", nome, tipo === "clientes" ? "cliente" : tipo === "farmacias" ? "farmacia" : "entregador");
    mostrarToast(`"${nome}" reativado.`);
  };

  const clientesComStatus = useMemo(
    () =>
      mockClientes.map((c) => ({
        ...c,
        status: getStatus(c.id, "clientes"),
      })),
    [statusClientes]
  );

  const farmaciasComStatus = useMemo(
    () =>
      farmaciasAprovadas.map((f) => ({
        id: f.id,
        nome: f.nome,
        email: f.email,
        telefone: f.telefone,
        provincia: f.provincia,
        dataRegisto: f.dataRegisto,
        tipo: "farmacias" as const,
        status: getStatus(f.id, "farmacias"),
      })),
    [farmaciasAprovadas, statusFarmacias]
  );

  const entregadoresComStatus = useMemo(
    () =>
      entregadoresAprovados.map((e) => ({
        id: e.id,
        nome: e.nome,
        email: e.email,
        telefone: e.telefone,
        veiculo: e.tipoVeiculo,
        dataRegisto: e.dataRegisto,
        tipo: "entregadores" as const,
        status: getStatus(e.id, "entregadores"),
      })),
    [entregadoresAprovados, statusEntregadores]
  );

  const filtrar = <T extends { nome?: string; email?: string; status?: StatusUsuario }>(lista: T[]): T[] => {
    let r = lista;
    if (busca.trim()) {
      const b = busca.toLowerCase();
      r = r.filter((u) => (u.nome ?? "").toLowerCase().includes(b) || (u.email ?? "").toLowerCase().includes(b));
    }
    if (filtroStatus) r = r.filter((u) => u.status === filtroStatus);
    return r;
  };

  const clientesFiltrados = filtrar(clientesComStatus);
  const farmaciasFiltradas = filtrar(farmaciasComStatus);
  const entregadoresFiltrados = filtrar(entregadoresComStatus);

  const colunasClientes: ColunaUsuario[] = [
    { key: "nome", label: "Nome", render: (v) => <span style={{ fontWeight: 600, color: "#1a3320" }}>{String(v)}</span> },
    { key: "email", label: "Email" },
    { key: "telefone", label: "Telefone" },
    { key: "provincia", label: "Província" },
    { key: "dataRegisto", label: "Registado" },
    { key: "status", label: "Estado", render: (v) => <BadgeStatusUsuario status={(v as StatusUsuario) || "ATIVO"} /> },
    {
      key: "acoes",
      label: "Acções",
      render: (_, row) => {
        const status = getStatus(String(row.id), "clientes");
        return (
          <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
            <button type="button" onClick={() => setPerfilAberto(row)} style={{ padding: "5px 10px", borderRadius: 7, border: "1px solid " + G, backgroundColor: "#fff", color: G, fontFamily: "'Roboto',sans-serif", fontSize: 11, cursor: "pointer" }}>Ver perfil</button>
            {status === "ATIVO" && <button type="button" onClick={() => handleSuspender(row, "clientes")} style={{ padding: "5px 10px", borderRadius: 7, border: "1px solid " + GOLD, backgroundColor: "#fff", color: GOLD, fontFamily: "'Roboto',sans-serif", fontSize: 11, cursor: "pointer" }}>Suspender</button>}
            {status === "ATIVO" && <button type="button" onClick={() => handleCancelar(row, "clientes")} style={{ padding: "5px 10px", borderRadius: 7, border: "1px solid #d45a5a", backgroundColor: "#fff", color: "#d45a5a", fontFamily: "'Roboto',sans-serif", fontSize: 11, cursor: "pointer" }}>Cancelar</button>}
            {(status === "SUSPENSO" || status === "BANIDO") && <button type="button" onClick={() => handleReativar(row, "clientes")} style={{ padding: "5px 10px", borderRadius: 7, border: "none", backgroundColor: G, color: "#fff", fontFamily: "'Roboto',sans-serif", fontSize: 11, cursor: "pointer" }}>Reativar</button>}
          </div>
        );
      },
    },
  ];

  const colunasFarmacias: ColunaUsuario[] = [
    { key: "nome", label: "Nome", render: (v) => <span style={{ fontWeight: 600, color: "#1a3320" }}>{String(v)}</span> },
    { key: "email", label: "Email" },
    { key: "telefone", label: "Telefone" },
    { key: "provincia", label: "Província" },
    { key: "dataRegisto", label: "Registado" },
    { key: "status", label: "Estado", render: (v) => <BadgeStatusUsuario status={(v as StatusUsuario) || "ATIVO"} /> },
    {
      key: "acoes",
      label: "Acções",
      render: (_, row) => {
        const status = getStatus(String(row.id), "farmacias");
        return (
          <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
            <button type="button" onClick={() => setPerfilAberto(row)} style={{ padding: "5px 10px", borderRadius: 7, border: "1px solid " + G, backgroundColor: "#fff", color: G, fontFamily: "'Roboto',sans-serif", fontSize: 11, cursor: "pointer" }}>Ver perfil</button>
            {status === "ATIVO" && <button type="button" onClick={() => handleSuspender(row, "farmacias")} style={{ padding: "5px 10px", borderRadius: 7, border: "1px solid " + GOLD, backgroundColor: "#fff", color: GOLD, fontFamily: "'Roboto',sans-serif", fontSize: 11, cursor: "pointer" }}>Suspender</button>}
            {status === "ATIVO" && <button type="button" onClick={() => handleCancelar(row, "farmacias")} style={{ padding: "5px 10px", borderRadius: 7, border: "1px solid #d45a5a", backgroundColor: "#fff", color: "#d45a5a", fontFamily: "'Roboto',sans-serif", fontSize: 11, cursor: "pointer" }}>Cancelar</button>}
            {(status === "SUSPENSO" || status === "BANIDO") && <button type="button" onClick={() => handleReativar(row, "farmacias")} style={{ padding: "5px 10px", borderRadius: 7, border: "none", backgroundColor: G, color: "#fff", fontFamily: "'Roboto',sans-serif", fontSize: 11, cursor: "pointer" }}>Reativar</button>}
          </div>
        );
      },
    },
  ];

  const colunasEntregadores: ColunaUsuario[] = [
    { key: "nome", label: "Nome", render: (v) => <span style={{ fontWeight: 600, color: "#1a3320" }}>{String(v)}</span> },
    { key: "email", label: "Email" },
    { key: "telefone", label: "Telefone" },
    { key: "veiculo", label: "Veículo" },
    { key: "dataRegisto", label: "Registado" },
    { key: "status", label: "Estado", render: (v) => <BadgeStatusUsuario status={(v as StatusUsuario) || "ATIVO"} /> },
    {
      key: "acoes",
      label: "Acções",
      render: (_, row) => {
        const status = getStatus(String(row.id), "entregadores");
        return (
          <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
            <button type="button" onClick={() => setPerfilAberto(row)} style={{ padding: "5px 10px", borderRadius: 7, border: "1px solid " + G, backgroundColor: "#fff", color: G, fontFamily: "'Roboto',sans-serif", fontSize: 11, cursor: "pointer" }}>Ver perfil</button>
            {status === "ATIVO" && <button type="button" onClick={() => handleSuspender(row, "entregadores")} style={{ padding: "5px 10px", borderRadius: 7, border: "1px solid " + GOLD, backgroundColor: "#fff", color: GOLD, fontFamily: "'Roboto',sans-serif", fontSize: 11, cursor: "pointer" }}>Suspender</button>}
            {status === "ATIVO" && <button type="button" onClick={() => handleCancelar(row, "entregadores")} style={{ padding: "5px 10px", borderRadius: 7, border: "1px solid #d45a5a", backgroundColor: "#fff", color: "#d45a5a", fontFamily: "'Roboto',sans-serif", fontSize: 11, cursor: "pointer" }}>Cancelar</button>}
            {(status === "SUSPENSO" || status === "BANIDO") && <button type="button" onClick={() => handleReativar(row, "entregadores")} style={{ padding: "5px 10px", borderRadius: 7, border: "none", backgroundColor: G, color: "#fff", fontFamily: "'Roboto',sans-serif", fontSize: 11, cursor: "pointer" }}>Reativar</button>}
          </div>
        );
      },
    },
  ];

  return (
    <div>
      {toast.visivel && (
        <div style={{ position: "fixed", top: 24, right: 24, zIndex: 9999, padding: "12px 20px", borderRadius: 10, backgroundColor: toast.ok ? G : "#d45a5a", color: "#fff", fontFamily: "'Roboto',sans-serif", fontSize: 14, fontWeight: 500, boxShadow: "0 8px 24px rgba(0,0,0,0.18)" }}>
          {toast.msg}
        </div>
      )}

      {perfilAberto && (
        <ModalPerfil titulo="Perfil do utilizador" onFechar={() => setPerfilAberto(null)}>
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            {Object.entries(perfilAberto).filter(([k]) => !["acoes", "tipo"].includes(k)).map(([k, v]) => (
              <p key={k} style={{ margin: 0 }}>
                <strong style={{ textTransform: "capitalize" }}>{k}:</strong> {String(v ?? "—")}
              </p>
            ))}
          </div>
        </ModalPerfil>
      )}

      <div style={{ marginBottom: 24 }}>
        <h1 style={{ fontFamily: "'Poppins',sans-serif", fontWeight: 700, fontSize: "clamp(1.2rem,3vw,1.6rem)", color: "#1a3320", margin: "0 0 4px" }}>Usuários</h1>
        <p style={{ fontFamily: "'Roboto',sans-serif", fontSize: 13, color: "#7a8a7a", margin: 0 }}>Liste, pesquise e filtre por tipo. Visualize perfil e gerencie estado da conta (suspender, cancelar, reativar).</p>
      </div>

      <div style={{ display: "flex", flexWrap: "wrap", gap: 12, alignItems: "center", marginBottom: 20 }}>
        <div style={{ display: "flex", backgroundColor: "#fff", borderRadius: 10, border: "1px solid #e0ebe0", padding: 4, gap: 4 }}>
          {[
            { id: "clientes" as const, label: "Clientes" },
            { id: "farmacias" as const, label: "Farmácias" },
            { id: "entregadores" as const, label: "Entregadores" },
          ].map((t) => (
            <button
              key={t.id}
              type="button"
              onClick={() => { setTab(t.id); setBusca(""); setFiltroStatus(""); }}
              style={{
                padding: "8px 18px",
                borderRadius: 7,
                border: "none",
                backgroundColor: tab === t.id ? G : "transparent",
                color: tab === t.id ? "#fff" : "#4a5e4a",
                fontFamily: "'Roboto',sans-serif",
                fontWeight: tab === t.id ? 600 : 400,
                fontSize: 13,
                cursor: "pointer",
              }}
            >
              {t.label}
            </button>
          ))}
        </div>
        <select
          value={filtroStatus}
          onChange={(e) => setFiltroStatus((e.target.value || "") as StatusUsuario | "")}
          style={{
            padding: "9px 14px",
            border: "1.5px solid #d5e8d6",
            borderRadius: 9,
            fontFamily: "'Roboto',sans-serif",
            fontSize: 13,
            color: "#2c3e2c",
            backgroundColor: "#fff",
            minWidth: 140,
          }}
        >
          <option value="">Todos os estados</option>
          <option value="ATIVO">Ativo</option>
          <option value="SUSPENSO">Suspenso</option>
          <option value="BANIDO">Banido</option>
        </select>
        <input
          value={busca}
          onChange={(e) => setBusca(e.target.value)}
          placeholder="Pesquisar por nome ou email…"
          style={{
            flex: 1,
            minWidth: 200,
            padding: "9px 14px",
            border: "1.5px solid #d5e8d6",
            borderRadius: 9,
            fontFamily: "'Roboto',sans-serif",
            fontSize: 13,
            color: "#2c3e2c",
            outline: "none",
            backgroundColor: "#fff",
          }}
        />
      </div>

      {tab === "clientes" && (
        <UsuarioTabela
          colunas={colunasClientes}
          dados={clientesFiltrados}
          emptyMessage="Nenhum cliente encontrado."
        />
      )}
      {tab === "farmacias" && (
        <UsuarioTabela
          colunas={colunasFarmacias}
          dados={farmaciasFiltradas}
          emptyMessage="Nenhuma farmácia encontrada."
        />
      )}
      {tab === "entregadores" && (
        <UsuarioTabela
          colunas={colunasEntregadores}
          dados={entregadoresFiltrados}
          emptyMessage="Nenhum entregador encontrado."
        />
      )}
    </div>
  );
}
