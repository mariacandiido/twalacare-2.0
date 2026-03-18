import { useState } from "react";
import { useAdminStore, type AdminProduto } from "../../store/adminStore";

const G = "#2c5530";
const GOLD = "#c7a252";

const CATEGORIAS = ["Todas", "Analgésicos", "Antibióticos", "Vitaminas", "Antialérgicos", "Digestivos", "Antidiabéticos"];
const FARMACIAS  = ["Todas", "Farmácia Central", "Farmácia Saúde Plus", "Farmácia Vida", "Farmácia Bem-Estar", "Farmácia Nova Esperança", "Farmácia São Pedro"];

function ModalEditar({ produto, onSalvar, onFechar }: { produto: AdminProduto; onSalvar: (d: Partial<AdminProduto>) => void; onFechar: () => void }) {
  const [form, setForm] = useState({ nome: produto.nome, preco: produto.preco, stock: produto.stock, descricao: produto.descricao, categoria: produto.categoria });

  const label: React.CSSProperties = { display: "block", fontFamily: "'Roboto',sans-serif", fontWeight: 500, fontSize: 11, color: "#4a7856", textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: 5 };
  const input: React.CSSProperties = { width: "100%", padding: "9px 12px", border: "1.5px solid #d5e8d6", borderRadius: 8, fontFamily: "'Roboto',sans-serif", fontSize: 14, color: "#2c3e2c", outline: "none", boxSizing: "border-box" };

  return (
    <div onClick={onFechar} style={{ position: "fixed", inset: 0, zIndex: 9998, backgroundColor: "rgba(0,0,0,0.5)", display: "flex", alignItems: "center", justifyContent: "center", padding: 16 }}>
      <div onClick={(e) => e.stopPropagation()} style={{ backgroundColor: "#fff", borderRadius: 16, padding: 28, width: "100%", maxWidth: 480, borderTop: `4px solid ${G}` }}>
        <h3 style={{ fontFamily: "'Poppins',sans-serif", fontWeight: 600, fontSize: 16, color: "#1a3320", margin: "0 0 4px" }}>Editar Produto</h3>
        <p style={{ fontFamily: "'Roboto',sans-serif", fontSize: 12, color: "#7a8a7a", margin: "0 0 20px" }}>{produto.farmacia}</p>

        <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
          <div>
            <label style={label}>Nome do produto</label>
            <input value={form.nome} onChange={(e) => setForm((p) => ({ ...p, nome: e.target.value }))} style={input} onFocus={(e) => (e.currentTarget.style.borderColor = G)} onBlur={(e) => (e.currentTarget.style.borderColor = "#d5e8d6")} />
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
            <div>
              <label style={label}>Preço (Kz)</label>
              <input type="number" value={form.preco} onChange={(e) => setForm((p) => ({ ...p, preco: Number(e.target.value) }))} style={input} onFocus={(e) => (e.currentTarget.style.borderColor = G)} onBlur={(e) => (e.currentTarget.style.borderColor = "#d5e8d6")} />
            </div>
            <div>
              <label style={label}>Stock</label>
              <input type="number" value={form.stock} onChange={(e) => setForm((p) => ({ ...p, stock: Number(e.target.value) }))} style={input} onFocus={(e) => (e.currentTarget.style.borderColor = G)} onBlur={(e) => (e.currentTarget.style.borderColor = "#d5e8d6")} />
            </div>
          </div>
          <div>
            <label style={label}>Categoria</label>
            <select value={form.categoria} onChange={(e) => setForm((p) => ({ ...p, categoria: e.target.value }))} style={{ ...input, cursor: "pointer" }}>
              {CATEGORIAS.filter((c) => c !== "Todas").map((c) => <option key={c}>{c}</option>)}
            </select>
          </div>
          <div>
            <label style={label}>Descrição</label>
            <textarea value={form.descricao} onChange={(e) => setForm((p) => ({ ...p, descricao: e.target.value }))} rows={2} style={{ ...input, resize: "none" }} onFocus={(e) => (e.currentTarget.style.borderColor = G)} onBlur={(e) => (e.currentTarget.style.borderColor = "#d5e8d6")} />
          </div>
        </div>

        <div style={{ display: "flex", gap: 10, marginTop: 20 }}>
          <button onClick={onFechar} style={{ flex: 1, padding: "10px", borderRadius: 8, border: "1.5px solid #d5e8d6", backgroundColor: "#fff", fontFamily: "'Roboto',sans-serif", fontSize: 14, cursor: "pointer" }}>Cancelar</button>
          <button onClick={() => { onSalvar(form); onFechar(); }} style={{ flex: 1, padding: "10px", borderRadius: 8, border: "none", backgroundColor: G, color: "#fff", fontFamily: "'Poppins',sans-serif", fontWeight: 600, fontSize: 14, cursor: "pointer" }}>Guardar</button>
        </div>
      </div>
    </div>
  );
}

function ModalConfirmar({ msg, onConfirmar, onCancelar }: { msg: string; onConfirmar: () => void; onCancelar: () => void }) {
  return (
    <div onClick={onCancelar} style={{ position: "fixed", inset: 0, zIndex: 9998, backgroundColor: "rgba(0,0,0,0.5)", display: "flex", alignItems: "center", justifyContent: "center", padding: 16 }}>
      <div onClick={(e) => e.stopPropagation()} style={{ backgroundColor: "#fff", borderRadius: 14, padding: 24, maxWidth: 360, width: "100%", borderTop: "4px solid #d45a5a", textAlign: "center" }}>
        <p style={{ fontSize: 28, margin: "0 0 12px" }}>⚠️</p>
        <p style={{ fontFamily: "'Poppins',sans-serif", fontWeight: 600, fontSize: 15, color: "#2c3e2c", margin: "0 0 6px" }}>Confirmar remoção</p>
        <p style={{ fontFamily: "'Roboto',sans-serif", fontSize: 13, color: "#7a8a7a", margin: "0 0 20px" }}>{msg}</p>
        <div style={{ display: "flex", gap: 10 }}>
          <button onClick={onCancelar} style={{ flex: 1, padding: "10px", borderRadius: 8, border: "1.5px solid #d5e8d6", backgroundColor: "#fff", fontFamily: "'Roboto',sans-serif", fontSize: 14, cursor: "pointer" }}>Cancelar</button>
          <button onClick={onConfirmar} style={{ flex: 1, padding: "10px", borderRadius: 8, border: "none", backgroundColor: "#d45a5a", color: "#fff", fontFamily: "'Poppins',sans-serif", fontWeight: 600, fontSize: 14, cursor: "pointer" }}>Remover</button>
        </div>
      </div>
    </div>
  );
}

export function AdminProdutos() {
  const { produtos, editarProduto, removerProduto, toggleAtivoProduto } = useAdminStore();
  const [busca, setBusca]               = useState("");
  const [filtroFarmacia, setFiltroFarmacia] = useState("Todas");
  const [filtroCategoria, setFiltroCategoria] = useState("Todas");
  const [editando, setEditando]         = useState<AdminProduto | null>(null);
  const [removendo, setRemovendo]       = useState<AdminProduto | null>(null);
  const [toast, setToast]               = useState({ visivel: false, msg: "" });

  const mostrarToast = (msg: string) => {
    setToast({ visivel: true, msg });
    setTimeout(() => setToast((p) => ({ ...p, visivel: false })), 3000);
  };

  const filtrados = produtos.filter((p) => {
    const matchBusca    = p.nome.toLowerCase().includes(busca.toLowerCase()) || p.farmacia.toLowerCase().includes(busca.toLowerCase());
    const matchFarmacia = filtroFarmacia === "Todas" || p.farmacia === filtroFarmacia;
    const matchCat      = filtroCategoria === "Todas" || p.categoria === filtroCategoria;
    return matchBusca && matchFarmacia && matchCat;
  });

  const selectStyle: React.CSSProperties = { padding: "8px 12px", border: "1.5px solid #d5e8d6", borderRadius: 8, fontFamily: "'Roboto',sans-serif", fontSize: 13, color: "#2c3e2c", outline: "none", backgroundColor: "#fff", cursor: "pointer" };

  return (
    <div>
      {/* Toast */}
      <div style={{ position: "fixed", top: 24, right: 24, zIndex: 9999, padding: "12px 20px", borderRadius: 10, backgroundColor: G, color: "#fff", fontFamily: "'Roboto',sans-serif", fontSize: 14, fontWeight: 500, boxShadow: "0 8px 24px rgba(0,0,0,0.18)", transform: toast.visivel ? "translateY(0)" : "translateY(-20px)", opacity: toast.visivel ? 1 : 0, transition: "all 0.3s", pointerEvents: "none" }}>
        {toast.msg}
      </div>

      {editando && (
        <ModalEditar produto={editando} onSalvar={(d) => { editarProduto(editando.id, d); mostrarToast("Produto actualizado com sucesso."); }} onFechar={() => setEditando(null)} />
      )}
      {removendo && (
        <ModalConfirmar msg={`Tem certeza que deseja remover "${removendo.nome}"?`} onConfirmar={() => { removerProduto(removendo.id); setRemovendo(null); mostrarToast("Produto removido."); }} onCancelar={() => setRemovendo(null)} />
      )}

      <div style={{ marginBottom: 24 }}>
        <h1 style={{ fontFamily: "'Poppins',sans-serif", fontWeight: 700, fontSize: "clamp(1.2rem,3vw,1.6rem)", color: "#1a3320", margin: "0 0 4px" }}>Produtos</h1>
        <p style={{ fontFamily: "'Roboto',sans-serif", fontSize: 13, color: "#7a8a7a", margin: 0 }}>
          {produtos.filter((p) => p.ativo).length} produtos activos · {produtos.filter((p) => !p.ativo).length} inactivos
        </p>
      </div>

      {/* Filtros */}
      <div style={{ display: "flex", flexWrap: "wrap", gap: 10, marginBottom: 20 }}>
        <input
          value={busca} onChange={(e) => setBusca(e.target.value)}
          placeholder="Pesquisar produto ou farmácia…"
          style={{ flex: 1, minWidth: 200, padding: "9px 14px", border: "1.5px solid #d5e8d6", borderRadius: 9, fontFamily: "'Roboto',sans-serif", fontSize: 13, color: "#2c3e2c", outline: "none", backgroundColor: "#fff" }}
          onFocus={(e) => (e.currentTarget.style.borderColor = G)}
          onBlur={(e) => (e.currentTarget.style.borderColor = "#d5e8d6")}
        />
        <select value={filtroFarmacia} onChange={(e) => setFiltroFarmacia(e.target.value)} style={selectStyle}>
          {FARMACIAS.map((f) => <option key={f}>{f}</option>)}
        </select>
        <select value={filtroCategoria} onChange={(e) => setFiltroCategoria(e.target.value)} style={selectStyle}>
          {CATEGORIAS.map((c) => <option key={c}>{c}</option>)}
        </select>
      </div>

      {/* Tabela */}
      <div style={{ backgroundColor: "#fff", borderRadius: 14, border: "1px solid #e8f0e8", overflow: "hidden", boxShadow: "0 2px 8px rgba(44,85,48,0.06)" }}>
        <div style={{ overflowX: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr style={{ backgroundColor: "#f8fbf8" }}>
                {["Produto", "Farmácia", "Categoria", "Preço", "Stock", "Receita", "Estado", "Acções"].map((h) => (
                  <th key={h} style={{ padding: "11px 16px", textAlign: "left", fontFamily: "'Roboto',sans-serif", fontWeight: 600, fontSize: 11, color: "#7a8a7a", textTransform: "uppercase", letterSpacing: "0.05em", whiteSpace: "nowrap" }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtrados.length === 0 ? (
                <tr><td colSpan={8} style={{ padding: 40, textAlign: "center", color: "#9aa89a", fontFamily: "'Roboto',sans-serif", fontSize: 14 }}>Nenhum produto encontrado com os filtros aplicados.</td></tr>
              ) : filtrados.map((p, i) => (
                <tr
                  key={p.id}
                  style={{ borderTop: "1px solid #f0f5f0", backgroundColor: i % 2 === 0 ? "#fff" : "#fafdf9", opacity: p.ativo ? 1 : 0.55 }}
                  onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.backgroundColor = "#f0f8f0"; }}
                  onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.backgroundColor = i % 2 === 0 ? "#fff" : "#fafdf9"; }}
                >
                  <td style={{ padding: "12px 16px", whiteSpace: "nowrap" }}>
                    <p style={{ fontFamily: "'Poppins',sans-serif", fontWeight: 600, fontSize: 13, color: "#1a3320", margin: 0 }}>{p.nome}</p>
                    <p style={{ fontFamily: "'Roboto',sans-serif", fontSize: 11, color: "#9aa89a", margin: "2px 0 0" }}>{p.descricao.slice(0, 36)}…</p>
                  </td>
                  <td style={{ padding: "12px 16px", fontFamily: "'Roboto',sans-serif", fontSize: 13, color: "#4a5e4a", whiteSpace: "nowrap" }}>{p.farmacia}</td>
                  <td style={{ padding: "12px 16px", whiteSpace: "nowrap" }}>
                    <span style={{ padding: "3px 10px", borderRadius: 20, backgroundColor: "rgba(44,85,48,0.08)", color: G, fontFamily: "'Roboto',sans-serif", fontSize: 11, fontWeight: 600 }}>{p.categoria}</span>
                  </td>
                  <td style={{ padding: "12px 16px", fontFamily: "'Poppins',sans-serif", fontWeight: 600, fontSize: 13, color: "#1a3320", whiteSpace: "nowrap" }}>{p.preco.toLocaleString("pt-AO")} Kz</td>
                  <td style={{ padding: "12px 16px", whiteSpace: "nowrap" }}>
                    <span style={{ fontFamily: "'Poppins',sans-serif", fontWeight: 700, fontSize: 13, color: p.stock < 50 ? "#d45a5a" : p.stock < 100 ? GOLD : G }}>
                      {p.stock}
                    </span>
                    <span style={{ fontFamily: "'Roboto',sans-serif", fontSize: 11, color: "#9aa89a", marginLeft: 4 }}>un.</span>
                  </td>
                  <td style={{ padding: "12px 16px", whiteSpace: "nowrap" }}>
                    <span style={{ padding: "3px 10px", borderRadius: 20, backgroundColor: p.requerReceita ? "rgba(212,90,90,0.08)" : "rgba(44,85,48,0.08)", color: p.requerReceita ? "#d45a5a" : G, fontFamily: "'Roboto',sans-serif", fontSize: 11, fontWeight: 600 }}>
                      {p.requerReceita ? "Sim" : "Não"}
                    </span>
                  </td>
                  <td style={{ padding: "12px 16px", whiteSpace: "nowrap" }}>
                    <button
                      onClick={() => toggleAtivoProduto(p.id)}
                      style={{ padding: "4px 12px", borderRadius: 7, border: `1.5px solid ${p.ativo ? G : "#d0d0d0"}`, backgroundColor: p.ativo ? "rgba(44,85,48,0.07)" : "rgba(0,0,0,0.04)", color: p.ativo ? G : "#888", fontFamily: "'Roboto',sans-serif", fontWeight: 600, fontSize: 11, cursor: "pointer" }}
                    >
                      {p.ativo ? "Activo" : "Inactivo"}
                    </button>
                  </td>
                  <td style={{ padding: "10px 16px", whiteSpace: "nowrap" }}>
                    <div style={{ display: "flex", gap: 6 }}>
                      <button onClick={() => setEditando(p)} style={{ padding: "5px 12px", borderRadius: 7, border: `1.5px solid ${G}`, backgroundColor: "#fff", color: G, fontFamily: "'Poppins',sans-serif", fontWeight: 600, fontSize: 11, cursor: "pointer" }}>Editar</button>
                      <button onClick={() => setRemovendo(p)} style={{ padding: "5px 10px", borderRadius: 7, border: "1.5px solid #d45a5a", backgroundColor: "#fff", color: "#d45a5a", fontFamily: "'Poppins',sans-serif", fontWeight: 600, fontSize: 11, cursor: "pointer" }}>✕</button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div style={{ padding: "12px 20px", borderTop: "1px solid #f0f5f0", backgroundColor: "#f8fbf8" }}>
          <p style={{ fontFamily: "'Roboto',sans-serif", fontSize: 12, color: "#9aa89a", margin: 0 }}>
            A mostrar {filtrados.length} de {produtos.length} produtos
          </p>
        </div>
      </div>
    </div>
  );
}
