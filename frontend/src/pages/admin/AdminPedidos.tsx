import { useState } from "react";
import { useAdminStore, type AdminPedido } from "../../store/adminStore";
import type { OrderStatus } from "../../types";

const G = "#2c5530";
const GOLD = "#c7a252";

const STATUS_CONFIG: Record<OrderStatus, { label: string; bg: string; color: string }> = {
  "pendente":      { label: "Pendente",      bg: "rgba(199,162,82,0.12)",  color: "#8a6e25" },
  "confirmado":    { label: "Confirmado",    bg: "rgba(44,85,48,0.1)",     color: G },
  "em-preparacao": { label: "Em Preparação", bg: "rgba(74,120,86,0.12)",   color: "#3d6645" },
  "pronto":        { label: "Pronto",        bg: "rgba(44,85,48,0.15)",    color: "#1a3320" },
  "em-transito":   { label: "Em Trânsito",   bg: "rgba(100,149,237,0.12)", color: "#3a5a8a" },
  "entregue":      { label: "Entregue",      bg: "rgba(44,85,48,0.1)",     color: G },
  "cancelado":     { label: "Cancelado",     bg: "rgba(212,90,90,0.1)",    color: "#a03030" },
};

const PROXIMOS_STATUS: Record<OrderStatus, OrderStatus | null> = {
  "pendente":      "confirmado",
  "confirmado":    "em-preparacao",
  "em-preparacao": "pronto",
  "pronto":        "em-transito",
  "em-transito":   "entregue",
  "entregue":      null,
  "cancelado":     null,
};

function BadgeStatus({ status }: { status: OrderStatus }) {
  const s = STATUS_CONFIG[status];
  return (
    <span style={{ padding: "4px 11px", borderRadius: 20, backgroundColor: s.bg, color: s.color, fontFamily: "'Roboto',sans-serif", fontSize: 11, fontWeight: 600, whiteSpace: "nowrap" }}>
      {s.label}
    </span>
  );
}

function ModalDetalhes({ pedido, onAtualizar, onFechar }: { pedido: AdminPedido; onAtualizar: (status: OrderStatus) => void; onFechar: () => void }) {
  const proximo = PROXIMOS_STATUS[pedido.status];
  const s = STATUS_CONFIG[pedido.status];

  return (
    <div onClick={onFechar} style={{ position: "fixed", inset: 0, zIndex: 9998, backgroundColor: "rgba(0,0,0,0.5)", display: "flex", alignItems: "center", justifyContent: "center", padding: 16 }}>
      <div onClick={(e) => e.stopPropagation()} style={{ backgroundColor: "#fff", borderRadius: 16, padding: 28, width: "100%", maxWidth: 500, borderTop: `4px solid ${G}`, maxHeight: "90vh", overflowY: "auto" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 20 }}>
          <div>
            <h3 style={{ fontFamily: "'Poppins',sans-serif", fontWeight: 700, fontSize: 18, color: "#1a3320", margin: 0 }}>{pedido.id}</h3>
            <p style={{ fontFamily: "'Roboto',sans-serif", fontSize: 13, color: "#7a8a7a", margin: "4px 0 0" }}>Pedido em {pedido.dataPedido}</p>
          </div>
          <BadgeStatus status={pedido.status} />
        </div>

        {/* Linha de progresso */}
        <div style={{ display: "flex", alignItems: "center", gap: 4, marginBottom: 24, overflowX: "auto", paddingBottom: 4 }}>
          {(["pendente","confirmado","em-preparacao","pronto","em-transito","entregue"] as OrderStatus[]).map((st, idx, arr) => {
            const passado  = arr.indexOf(pedido.status) >= idx;
            const actual   = pedido.status === st;
            const cancelado = pedido.status === "cancelado";
            return (
              <div key={st} style={{ display: "flex", alignItems: "center", gap: 4, flexShrink: 0 }}>
                <div style={{ textAlign: "center" }}>
                  <div style={{ width: 28, height: 28, borderRadius: "50%", backgroundColor: cancelado ? "#f0f0f0" : passado ? G : "#e0e8e0", border: `2px solid ${cancelado ? "#d0d0d0" : passado ? G : "#c0d0c0"}`, display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 4px" }}>
                    {passado && !cancelado && <span style={{ color: "#fff", fontSize: 12 }}>✓</span>}
                    {actual && cancelado && <span style={{ color: "#888", fontSize: 12 }}>✕</span>}
                  </div>
                  <p style={{ fontFamily: "'Roboto',sans-serif", fontSize: 9, color: passado && !cancelado ? G : "#9aa89a", margin: 0, fontWeight: actual ? 700 : 400, textAlign: "center", maxWidth: 52 }}>
                    {STATUS_CONFIG[st].label}
                  </p>
                </div>
                {idx < arr.length - 1 && <div style={{ width: 20, height: 2, backgroundColor: passado && arr.indexOf(pedido.status) > idx && !cancelado ? G : "#e0e8e0", flexShrink: 0, marginBottom: 16 }} />}
              </div>
            );
          })}
        </div>

        {/* Detalhes */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px 20px", marginBottom: 20 }}>
          {[
            { l: "Cliente",          v: pedido.clienteNome },
            { l: "Farmácia",         v: pedido.farmacia },
            { l: "Total",            v: `${pedido.total.toLocaleString("pt-AO")} Kz` },
            { l: "Pagamento",        v: pedido.metodoPagamento },
            { l: "Data do Pedido",   v: pedido.dataPedido },
            { l: "Data de Entrega",  v: pedido.dataEntrega ?? "—" },
          ].map(({ l, v }) => (
            <div key={l}>
              <p style={{ fontFamily: "'Roboto',sans-serif", fontSize: 10, fontWeight: 600, color: "#7a8a7a", textTransform: "uppercase", letterSpacing: "0.06em", margin: "0 0 2px" }}>{l}</p>
              <p style={{ fontFamily: "'Roboto',sans-serif", fontSize: 13, color: "#1a3320", margin: 0, fontWeight: l === "Total" ? 700 : 400 }}>{v}</p>
            </div>
          ))}
        </div>
        <div style={{ marginBottom: 20 }}>
          <p style={{ fontFamily: "'Roboto',sans-serif", fontSize: 10, fontWeight: 600, color: "#7a8a7a", textTransform: "uppercase", letterSpacing: "0.06em", margin: "0 0 4px" }}>Endereço de Entrega</p>
          <p style={{ fontFamily: "'Roboto',sans-serif", fontSize: 13, color: "#1a3320", margin: 0 }}>{pedido.enderecoEntrega}</p>
        </div>
        <div style={{ marginBottom: 24, padding: "12px 14px", backgroundColor: "#f8fbf8", borderRadius: 8, border: "1px solid #e8f0e8" }}>
          <p style={{ fontFamily: "'Roboto',sans-serif", fontSize: 10, fontWeight: 600, color: "#7a8a7a", textTransform: "uppercase", letterSpacing: "0.06em", margin: "0 0 4px" }}>Itens</p>
          <p style={{ fontFamily: "'Roboto',sans-serif", fontSize: 13, color: "#2c3e2c", margin: 0 }}>{pedido.itens}</p>
        </div>

        {/* Acções */}
        <div style={{ display: "flex", gap: 10 }}>
          <button onClick={onFechar} style={{ flex: 1, padding: "10px", borderRadius: 8, border: "1.5px solid #d5e8d6", backgroundColor: "#fff", fontFamily: "'Roboto',sans-serif", fontSize: 14, cursor: "pointer" }}>
            Fechar
          </button>
          {proximo && (
            <button
              onClick={() => { onAtualizar(proximo); onFechar(); }}
              style={{ flex: 2, padding: "10px", borderRadius: 8, border: "none", backgroundColor: G, color: "#fff", fontFamily: "'Poppins',sans-serif", fontWeight: 600, fontSize: 14, cursor: "pointer" }}
            >
              Avançar → {STATUS_CONFIG[proximo].label}
            </button>
          )}
          {pedido.status !== "cancelado" && pedido.status !== "entregue" && (
            <button
              onClick={() => { onAtualizar("cancelado"); onFechar(); }}
              style={{ padding: "10px 14px", borderRadius: 8, border: "1.5px solid #d45a5a", backgroundColor: "#fff", color: "#d45a5a", fontFamily: "'Poppins',sans-serif", fontWeight: 600, fontSize: 13, cursor: "pointer" }}
            >
              Cancelar
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

export function AdminPedidos() {
  const { pedidos, atualizarStatusPedido } = useAdminStore();
  const [filtroStatus, setFiltroStatus] = useState<OrderStatus | "todos">("todos");
  const [busca, setBusca] = useState("");
  const [detalhe, setDetalhe] = useState<AdminPedido | null>(null);
  const [toast, setToast] = useState({ visivel: false, msg: "" });

  const mostrarToast = (msg: string) => {
    setToast({ visivel: true, msg });
    setTimeout(() => setToast((p) => ({ ...p, visivel: false })), 3000);
  };

  const filtrados = pedidos.filter((p) => {
    const matchStatus = filtroStatus === "todos" || p.status === filtroStatus;
    const matchBusca  = p.id.toLowerCase().includes(busca.toLowerCase()) ||
                        p.clienteNome.toLowerCase().includes(busca.toLowerCase()) ||
                        p.farmacia.toLowerCase().includes(busca.toLowerCase());
    return matchStatus && matchBusca;
  });

  const contagem = (s: OrderStatus | "todos") =>
    s === "todos" ? pedidos.length : pedidos.filter((p) => p.status === s).length;

  const FILTROS: (OrderStatus | "todos")[] = ["todos", "pendente", "confirmado", "em-preparacao", "em-transito", "entregue", "cancelado"];

  return (
    <div>
      {/* Toast */}
      <div style={{ position: "fixed", top: 24, right: 24, zIndex: 9999, padding: "12px 20px", borderRadius: 10, backgroundColor: G, color: "#fff", fontFamily: "'Roboto',sans-serif", fontSize: 14, fontWeight: 500, boxShadow: "0 8px 24px rgba(0,0,0,0.18)", transform: toast.visivel ? "translateY(0)" : "translateY(-20px)", opacity: toast.visivel ? 1 : 0, transition: "all 0.3s", pointerEvents: "none" }}>
        {toast.msg}
      </div>

      {detalhe && (
        <ModalDetalhes
          pedido={detalhe}
          onAtualizar={(status) => { atualizarStatusPedido(detalhe.id, status); mostrarToast(`Pedido ${detalhe.id} actualizado para "${STATUS_CONFIG[status].label}".`); }}
          onFechar={() => setDetalhe(null)}
        />
      )}

      <div style={{ marginBottom: 24 }}>
        <h1 style={{ fontFamily: "'Poppins',sans-serif", fontWeight: 700, fontSize: "clamp(1.2rem,3vw,1.6rem)", color: "#1a3320", margin: "0 0 4px" }}>Pedidos</h1>
        <p style={{ fontFamily: "'Roboto',sans-serif", fontSize: 13, color: "#7a8a7a", margin: 0 }}>Acompanhe e gerencie todos os pedidos da plataforma.</p>
      </div>

      {/* Filtros de status */}
      <div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginBottom: 16 }}>
        {FILTROS.map((f) => {
          const ativo = filtroStatus === f;
          const label = f === "todos" ? "Todos" : STATUS_CONFIG[f].label;
          const count = contagem(f);
          return (
            <button
              key={f}
              onClick={() => setFiltroStatus(f)}
              style={{
                padding: "6px 14px", borderRadius: 8, border: `1.5px solid ${ativo ? G : "#d5e8d6"}`,
                backgroundColor: ativo ? G : "#fff",
                color: ativo ? "#fff" : "#4a5e4a",
                fontFamily: "'Roboto',sans-serif", fontWeight: ativo ? 600 : 400,
                fontSize: 12, cursor: "pointer", transition: "all 0.15s",
                display: "flex", alignItems: "center", gap: 5,
              }}
            >
              {label}
              <span style={{ padding: "0 5px", borderRadius: 10, backgroundColor: ativo ? "rgba(255,255,255,0.22)" : "rgba(44,85,48,0.08)", fontSize: 10, fontWeight: 700, color: ativo ? "#fff" : G }}>{count}</span>
            </button>
          );
        })}
      </div>

      {/* Busca */}
      <div style={{ marginBottom: 18 }}>
        <input
          value={busca} onChange={(e) => setBusca(e.target.value)}
          placeholder="Pesquisar por ID, cliente ou farmácia…"
          style={{ width: "100%", padding: "9px 14px", border: "1.5px solid #d5e8d6", borderRadius: 9, fontFamily: "'Roboto',sans-serif", fontSize: 13, color: "#2c3e2c", outline: "none", backgroundColor: "#fff", boxSizing: "border-box" }}
          onFocus={(e) => (e.currentTarget.style.borderColor = G)}
          onBlur={(e) => (e.currentTarget.style.borderColor = "#d5e8d6")}
        />
      </div>

      {/* Tabela */}
      <div style={{ backgroundColor: "#fff", borderRadius: 14, border: "1px solid #e8f0e8", overflow: "hidden", boxShadow: "0 2px 8px rgba(44,85,48,0.06)" }}>
        <div style={{ overflowX: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr style={{ backgroundColor: "#f8fbf8" }}>
                {["ID", "Cliente", "Farmácia", "Itens", "Total", "Status", "Data", "Acção"].map((h) => (
                  <th key={h} style={{ padding: "11px 16px", textAlign: "left", fontFamily: "'Roboto',sans-serif", fontWeight: 600, fontSize: 11, color: "#7a8a7a", textTransform: "uppercase", letterSpacing: "0.05em", whiteSpace: "nowrap" }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtrados.length === 0 ? (
                <tr>
                  <td colSpan={8} style={{ padding: 48, textAlign: "center", color: "#9aa89a", fontFamily: "'Roboto',sans-serif", fontSize: 14 }}>
                    Nenhum pedido encontrado.
                  </td>
                </tr>
              ) : filtrados.map((p, i) => (
                <tr
                  key={p.id}
                  style={{ borderTop: "1px solid #f0f5f0", backgroundColor: i % 2 === 0 ? "#fff" : "#fafdf9", cursor: "pointer" }}
                  onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.backgroundColor = "#f0f8f0"; }}
                  onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.backgroundColor = i % 2 === 0 ? "#fff" : "#fafdf9"; }}
                  onClick={() => setDetalhe(p)}
                >
                  <td style={{ padding: "12px 16px", fontFamily: "'Poppins',sans-serif", fontWeight: 700, fontSize: 12, color: G, whiteSpace: "nowrap" }}>{p.id}</td>
                  <td style={{ padding: "12px 16px", fontFamily: "'Roboto',sans-serif", fontSize: 13, color: "#2c3e2c", whiteSpace: "nowrap" }}>{p.clienteNome}</td>
                  <td style={{ padding: "12px 16px", fontFamily: "'Roboto',sans-serif", fontSize: 13, color: "#4a5e4a", whiteSpace: "nowrap" }}>{p.farmacia}</td>
                  <td style={{ padding: "12px 16px", fontFamily: "'Roboto',sans-serif", fontSize: 12, color: "#666", maxWidth: 180 }}>
                    <span style={{ display: "-webkit-box", WebkitLineClamp: 1, WebkitBoxOrient: "vertical", overflow: "hidden" }}>{p.itens}</span>
                  </td>
                  <td style={{ padding: "12px 16px", fontFamily: "'Poppins',sans-serif", fontWeight: 600, fontSize: 13, color: "#1a3320", whiteSpace: "nowrap" }}>{p.total.toLocaleString("pt-AO")} Kz</td>
                  <td style={{ padding: "12px 16px", whiteSpace: "nowrap" }}><BadgeStatus status={p.status} /></td>
                  <td style={{ padding: "12px 16px", fontFamily: "'Roboto',sans-serif", fontSize: 12, color: "#9aa89a", whiteSpace: "nowrap" }}>{p.dataPedido}</td>
                  <td style={{ padding: "10px 16px", whiteSpace: "nowrap" }} onClick={(e) => e.stopPropagation()}>
                    {PROXIMOS_STATUS[p.status] && (
                      <button
                        onClick={() => { atualizarStatusPedido(p.id, PROXIMOS_STATUS[p.status]!); mostrarToast(`Pedido ${p.id} avançado.`); }}
                        style={{ padding: "5px 12px", borderRadius: 7, border: "none", backgroundColor: G, color: "#fff", fontFamily: "'Poppins',sans-serif", fontWeight: 600, fontSize: 11, cursor: "pointer" }}
                      >
                        Avançar →
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div style={{ padding: "12px 20px", borderTop: "1px solid #f0f5f0", backgroundColor: "#f8fbf8" }}>
          <p style={{ fontFamily: "'Roboto',sans-serif", fontSize: 12, color: "#9aa89a", margin: 0 }}>
            A mostrar {filtrados.length} de {pedidos.length} pedidos · Clique numa linha para ver detalhes
          </p>
        </div>
      </div>
    </div>
  );
}
