import { useNavigate } from "react-router-dom";
import { useFarmaciasStore } from "../../store/farmaciasStore";
import { useAdminStore } from "../../store/adminStore";
import { useEntregadoresAdminStore } from "../../store/entregadoresAdminStore";
import { CardEstatistica } from "../../components/admin/CardEstatistica";

const G = "#2c5530";
const GOLD = "#c7a252";

// Dados mock para crescimento (últimos 6 meses)
const crescimentoUsuarios = [12, 18, 22, 28, 35, 42];
const crescimentoFarmacias = [4, 5, 5, 6, 6, 6];
const crescimentoEntregadores = [1, 2, 2, 3, 3, 3];
const meses = ["Out", "Nov", "Dez", "Jan", "Fev", "Mar"];

function GraficoBarras({
  dados,
  labels,
  cor = G,
  titulo,
}: {
  dados: number[];
  labels: string[];
  cor?: string;
  titulo: string;
}) {
  const max = Math.max(...dados, 1);
  return (
    <div
      style={{
        backgroundColor: "#fff",
        borderRadius: 14,
        border: "1px solid #e8f0e8",
        padding: "20px 22px",
        boxShadow: "0 2px 8px rgba(44,85,48,0.06)",
      }}
    >
      <p
        style={{
          fontFamily: "'Roboto',sans-serif",
          fontSize: 11,
          fontWeight: 600,
          color: "#7a8a7a",
          textTransform: "uppercase",
          letterSpacing: "0.07em",
          margin: "0 0 16px",
        }}
      >
        {titulo}
      </p>
      <div style={{ display: "flex", alignItems: "flex-end", gap: 8, height: 120 }}>
        {dados.map((v, i) => (
          <div
            key={i}
            style={{
              flex: 1,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: 6,
            }}
          >
            <div
              style={{
                width: "100%",
                height: 100,
                display: "flex",
                alignItems: "flex-end",
                justifyContent: "center",
              }}
            >
              <div
                style={{
                  width: "100%",
                  maxWidth: 28,
                  height: `${(v / max) * 100}%`,
                  minHeight: v > 0 ? 8 : 0,
                  backgroundColor: cor,
                  borderRadius: "6px 6px 0 0",
                  transition: "height 0.3s",
                }}
              />
            </div>
            <span
              style={{
                fontFamily: "'Roboto',sans-serif",
                fontSize: 10,
                color: "#9aa89a",
              }}
            >
              {labels[i]}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

export function AdminDashboard() {
  const navigate = useNavigate();
  const { farmacias, obterAprovadas, obterPendentes } = useFarmaciasStore();
  const { pedidos } = useAdminStore();
  const { obterAprovados } = useEntregadoresAdminStore();

  const entregadores = useEntregadoresAdminStore((s) => s.entregadores);
  const produtos = useAdminStore((s) => s.produtos);

  const totalClientes = 6;
  const totalFarmacias = farmacias.length;
  const farmaciasAprovadas = obterAprovadas().length;
  const totalEntregadores = entregadores.length;
  const entregadoresAprovados = obterAprovados().length;
  const totalMedicamentos = produtos.length;
  const totalPedidos = pedidos.length;

  return (
    <div>
      <div style={{ marginBottom: 28 }}>
        <h1
          style={{
            fontFamily: "'Poppins',sans-serif",
            fontWeight: 700,
            fontSize: "clamp(1.2rem, 3vw, 1.6rem)",
            color: "#1a3320",
            margin: "0 0 4px",
          }}
        >
          Dashboard
        </h1>
        <p
          style={{
            fontFamily: "'Roboto',sans-serif",
            fontSize: 13,
            color: "#7a8a7a",
            margin: 0,
          }}
        >
          Visão geral da plataforma TwalaCare — supervisão e gestão
        </p>
      </div>

      {/* Cards: Total clientes, farmácias, entregadores, medicamentos, pedidos */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(160px, 1fr))",
          gap: 14,
          marginBottom: 24,
        }}
      >
        <CardEstatistica
          label="Total de Clientes"
          valor={totalClientes}
          sub="clientes registados"
          cor={G}
          onClick={() => navigate("/admin/usuarios")}
        />
        <CardEstatistica
          label="Total de Farmácias"
          valor={totalFarmacias}
          sub={`${farmaciasAprovadas} aprovadas`}
          cor="#3d6645"
          onClick={() => navigate("/admin/aprovacoes")}
        />
        <CardEstatistica
          label="Total de Entregadores"
          valor={totalEntregadores}
          sub={`${entregadoresAprovados} aprovados`}
          cor="#5a7a5a"
          onClick={() => navigate("/admin/aprovacoes")}
        />
        <CardEstatistica
          label="Total de Medicamentos"
          valor={totalMedicamentos}
          sub="na plataforma"
          cor={G}
        />
        <CardEstatistica
          label="Total de Pedidos"
          valor={totalPedidos}
          sub="realizados (apenas visualização)"
          cor={GOLD}
        />
      </div>

      {/* Gráficos de crescimento */}
      <p
        style={{
          fontFamily: "'Roboto',sans-serif",
          fontWeight: 600,
          fontSize: 12,
          color: "#7a8a7a",
          textTransform: "uppercase",
          letterSpacing: "0.06em",
          margin: "0 0 12px",
        }}
      >
        Crescimento (últimos meses)
      </p>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))",
          gap: 16,
        }}
      >
        <GraficoBarras
          titulo="Crescimento de usuários"
          dados={crescimentoUsuarios}
          labels={meses}
          cor={G}
        />
        <GraficoBarras
          titulo="Crescimento de farmácias"
          dados={crescimentoFarmacias}
          labels={meses}
          cor="#3d6645"
        />
        <GraficoBarras
          titulo="Crescimento de entregadores"
          dados={crescimentoEntregadores}
          labels={meses}
          cor={GOLD}
        />
      </div>
    </div>
  );
}
