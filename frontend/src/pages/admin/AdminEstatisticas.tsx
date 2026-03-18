import { useFarmaciasStore } from "../../store/farmaciasStore";
import { useAdminStore } from "../../store/adminStore";
import { useEntregadoresAdminStore } from "../../store/entregadoresAdminStore";
import { CardEstatistica } from "../../components/admin/CardEstatistica";

const G = "#2c5530";
const GOLD = "#c7a252";

const meses = ["Out", "Nov", "Dez", "Jan", "Fev", "Mar"];

function GraficoLinhaSimples({
  titulo,
  dados,
  cor = G,
}: {
  titulo: string;
  dados: number[];
  cor?: string;
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
      <div style={{ display: "flex", alignItems: "flex-end", gap: 8, height: 140 }}>
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
                height: 120,
                display: "flex",
                alignItems: "flex-end",
                justifyContent: "center",
              }}
            >
              <div
                style={{
                  width: "100%",
                  maxWidth: 32,
                  height: `${(v / max) * 100}%`,
                  minHeight: v > 0 ? 8 : 0,
                  backgroundColor: cor,
                  borderRadius: "6px 6px 0 0",
                }}
              />
            </div>
            <span style={{ fontFamily: "'Roboto',sans-serif", fontSize: 10, color: "#9aa89a" }}>
              {meses[i]}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

export function AdminEstatisticas() {
  const { farmacias, obterAprovadas } = useFarmaciasStore();
  const { pedidos, produtos } = useAdminStore();
  const entregadores = useEntregadoresAdminStore((s) => s.entregadores);

  const totalUsuarios = 6 + obterAprovadas().length + entregadores.filter((e) => e.status === "APROVADO").length;
  const totalFarmacias = farmacias.length;
  const totalEntregadores = entregadores.length;
  const totalPedidos = pedidos.length;

  const novosUsuarios = [8, 10, 12, 14, 16, totalUsuarios];
  const crescimentoFarmacias = [4, 4, 5, 5, 6, totalFarmacias];
  const crescimentoEntregadores = [1, 1, 2, 2, 3, totalEntregadores];
  const pedidosPorMes = [12, 18, 22, 28, 25, totalPedidos];

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
          Estatísticas
        </h1>
        <p
          style={{
            fontFamily: "'Roboto',sans-serif",
            fontSize: 13,
            color: "#7a8a7a",
            margin: 0,
          }}
        >
          Gráficos da plataforma para monitorar o crescimento do TwalaCare.
        </p>
      </div>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(140px, 1fr))",
          gap: 14,
          marginBottom: 24,
        }}
      >
        <CardEstatistica label="Novos usuários (total)" valor={totalUsuarios} cor={G} />
        <CardEstatistica label="Farmácias" valor={totalFarmacias} cor="#3d6645" />
        <CardEstatistica label="Entregadores" valor={totalEntregadores} cor={GOLD} />
        <CardEstatistica label="Pedidos realizados" valor={totalPedidos} cor={G} />
      </div>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
          gap: 20,
        }}
      >
        <GraficoLinhaSimples titulo="Número de novos usuários" dados={novosUsuarios} cor={G} />
        <GraficoLinhaSimples titulo="Crescimento de farmácias" dados={crescimentoFarmacias} cor="#3d6645" />
        <GraficoLinhaSimples titulo="Crescimento de entregadores" dados={crescimentoEntregadores} cor={GOLD} />
        <GraficoLinhaSimples titulo="Quantidade de pedidos realizados" dados={pedidosPorMes} cor={G} />
      </div>
    </div>
  );
}
