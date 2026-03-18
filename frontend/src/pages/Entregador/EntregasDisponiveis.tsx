import { useState } from 'react';
import { PackageOpen, Search, SlidersHorizontal } from 'lucide-react';
import { EntregadorLayout } from '../../layouts/EntregadorLayout';
import { EntregaCard } from '../../components/Entregador/EntregaCard';
import { useEntregadorStore } from '../../store/entregadorStore';
import { Link } from 'react-router-dom';

export function EntregasDisponiveis() {
  const { disponivel, toggleDisponivel, entregasDisponiveis, aceitarEntrega, rejeitarEntrega } =
    useEntregadorStore();

  const [busca, setBusca] = useState('');
  const [aceitoId, setAceitoId] = useState<string | null>(null);

  const filtradas = entregasDisponiveis.filter(
    (e) =>
      e.farmacia.toLowerCase().includes(busca.toLowerCase()) ||
      e.cliente.toLowerCase().includes(busca.toLowerCase()) ||
      e.clienteEndereco.toLowerCase().includes(busca.toLowerCase())
  );

  const handleAceitar = (id: string) => {
    setAceitoId(id);
    setTimeout(() => {
      aceitarEntrega(id);
      setAceitoId(null);
    }, 600);
  };

  return (
    <EntregadorLayout disponivel={disponivel} onToggleDisponivel={toggleDisponivel}>
      <div className="twala-page-enter p-6 lg:p-8 space-y-6" style={{ backgroundColor: "#faf7f2", minHeight: "100vh" }}>
        {/* Cabeçalho */}
        <div>
          <h1 style={{ fontFamily: "'Poppins', sans-serif", fontWeight: 600, fontSize: "clamp(1.4rem, 3vw, 1.8rem)", color: "#2c3e2c", marginBottom: 4 }}>
            Entregas Disponíveis
          </h1>
          <div style={{ width: 50, height: 3, background: "linear-gradient(90deg, #2c5530, #c7a252)", borderRadius: 2, marginBottom: 4 }} />
          <p style={{ fontFamily: "'Roboto', sans-serif", color: "#4a7856", fontSize: 13 }}>
            {entregasDisponiveis.length} entrega(s) aguardando para ser aceite
          </p>
        </div>

        {/* Barra de pesquisa */}
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search style={{ position: "absolute", left: 14, top: "50%", transform: "translateY(-50%)", width: 16, height: 16, color: "#4a7856" }} />
            <input
              type="text"
              placeholder="Pesquisar por farmácia, cliente ou endereço..."
              value={busca}
              onChange={(e) => setBusca(e.target.value)}
              className="twala-input w-full"
              style={{ paddingLeft: 44 }}
            />
          </div>
          <button className="twala-btn-outline flex items-center gap-2">
            <SlidersHorizontal style={{ width: 16, height: 16 }} />
            Filtrar
          </button>
        </div>

        {/* Resumo rápido */}
        <div className="grid grid-cols-3 gap-4">
          {[
            { label: 'Disponíveis', valor: entregasDisponiveis.length, bg: "rgba(44,85,48,0.07)", color: "#2c5530" },
            {
              label: 'Mais próxima',
              valor: entregasDisponiveis.length > 0
                ? entregasDisponiveis.reduce((min, e) =>
                    parseFloat(e.distancia) < parseFloat(min.distancia) ? e : min
                  ).distancia
                : '–',
              bg: "rgba(74,120,86,0.08)",
              color: "#4a7856",
            },
            {
              label: 'Maior ganho',
              valor: entregasDisponiveis.length > 0
                ? `${Math.max(...entregasDisponiveis.map((e) => e.valor)).toLocaleString()} Kz`
                : '–',
              bg: "rgba(199,162,82,0.12)",
              color: "#a07a2a",
            },
          ].map((stat) => (
            <div key={stat.label} style={{ backgroundColor: stat.bg, borderRadius: 10, padding: "12px 16px", textAlign: "center" }}>
              <p style={{ fontFamily: "'Poppins', sans-serif", fontWeight: 700, fontSize: 20, color: stat.color, margin: 0 }}>{stat.valor}</p>
              <p style={{ fontFamily: "'Roboto', sans-serif", fontSize: 11, color: "#888", marginTop: 2 }}>{stat.label}</p>
            </div>
          ))}
        </div>

        {/* Status: offline */}
        {!disponivel && (
          <div style={{ backgroundColor: "rgba(199,162,82,0.08)", border: "1px solid rgba(199,162,82,0.3)", borderRadius: 10, padding: 16, display: "flex", alignItems: "center", gap: 12 }}>
            <div style={{ width: 40, height: 40, borderRadius: "50%", backgroundColor: "rgba(199,162,82,0.2)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
              <PackageOpen style={{ width: 20, height: 20, color: "#a07a2a" }} />
            </div>
            <div>
              <p style={{ fontFamily: "'Poppins', sans-serif", fontWeight: 600, fontSize: 14, color: "#7a5a1a", margin: 0 }}>
                Você está offline
              </p>
              <p style={{ fontFamily: "'Roboto', sans-serif", fontSize: 12, color: "#9a7a3a", margin: "2px 0 0" }}>
                Active o seu estado para aceitar novas entregas.
              </p>
            </div>
            <button
              onClick={toggleDisponivel}
              className="twala-btn-primary"
              style={{ marginLeft: "auto", fontSize: 12, padding: "6px 14px", backgroundColor: "#c7a252", borderColor: "#c7a252", color: "#2c3e2c" }}
            >
              Ficar Online
            </button>
          </div>
        )}

        {/* Lista de entregas */}
        {filtradas.length === 0 ? (
          <div className="twala-card flex flex-col items-center justify-center py-16 text-center">
            <div style={{ width: 72, height: 72, borderRadius: 16, backgroundColor: "rgba(44,85,48,0.08)", display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 16 }}>
              <PackageOpen style={{ width: 36, height: 36, color: "#4a7856" }} />
            </div>
            {busca ? (
              <>
                <p style={{ fontFamily: "'Poppins', sans-serif", fontWeight: 500, color: "#4a7856" }}>Nenhum resultado para "{busca}"</p>
                <p style={{ fontFamily: "'Roboto', sans-serif", fontSize: 13, color: "#888", marginTop: 4 }}>Tente pesquisar com outros termos.</p>
              </>
            ) : (
              <>
                <p style={{ fontFamily: "'Poppins', sans-serif", fontWeight: 500, color: "#4a7856" }}>Nenhuma entrega disponível</p>
                <p style={{ fontFamily: "'Roboto', sans-serif", fontSize: 13, color: "#888", marginTop: 4 }}>
                  Novas entregas aparecerão aqui quando os clientes fizerem pedidos.
                </p>
              </>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
            {filtradas.map((entrega) => (
              <div
                key={entrega.id}
                style={{ transition: "all 0.5s ease", opacity: aceitoId === entrega.id ? 0.5 : 1, transform: aceitoId === entrega.id ? "scale(0.95)" : "scale(1)" }}
              >
                <EntregaCard
                  entrega={entrega}
                  onAceitar={handleAceitar}
                  onRejeitar={rejeitarEntrega}
                />
              </div>
            ))}
          </div>
        )}

        {/* Link para minhas entregas */}
        <div
          style={{
            backgroundColor: "rgba(44,85,48,0.06)",
            border: "1px solid rgba(44,85,48,0.15)",
            borderRadius: 10,
            padding: 16,
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <p style={{ fontFamily: "'Roboto', sans-serif", fontSize: 14, color: "#2c5530", fontWeight: 500, margin: 0 }}>
            Já aceitou uma entrega? Acompanhe em tempo real.
          </p>
          <Link
            to="/entregador/minhas-entregas"
            style={{ fontFamily: "'Roboto', sans-serif", fontSize: 14, color: "#c7a252", fontWeight: 600, textDecoration: "none" }}
            onMouseEnter={e => { (e.currentTarget as HTMLAnchorElement).style.textDecoration = "underline"; }}
            onMouseLeave={e => { (e.currentTarget as HTMLAnchorElement).style.textDecoration = "none"; }}
          >
            Minhas Entregas →
          </Link>
        </div>
      </div>
    </EntregadorLayout>
  );
}
