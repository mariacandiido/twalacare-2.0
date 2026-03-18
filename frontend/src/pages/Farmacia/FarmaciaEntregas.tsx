import { useState, useMemo } from "react";
import { Truck, UserCheck, Package, CheckCircle, Clock, X, MapPin } from "lucide-react";
import { FarmaciaLayout } from "../../layouts/FarmaciaLayout";
import type { EntregaFarmacia, EntregadorDisponivel, StatusEntregaFarmacia } from "../../types/farmacia.types";
import { useEntregadoresAdminStore } from "../../store/entregadoresAdminStore";

const entregasMock: EntregaFarmacia[] = [
  {
    id: "E-001",
    pedidoId: "TC-0043",
    nomeCliente: "Maria Fernanda",
    enderecoEntrega: "Viana, Rua das Flores, 22",
    total: 2100,
    status: "aguardando-entregador",
  },
  {
    id: "E-002",
    pedidoId: "TC-0040",
    nomeCliente: "Pedro Alves",
    enderecoEntrega: "Talatona, Belas Shopping, Apt 5",
    total: 4500,
    status: "em-transporte",
    entregadorId: "ENT-1",
    nomeEntregador: "Ricardo Santos",
    dataAtribuicao: "2026-03-04T12:00:00Z",
  },
  {
    id: "E-003",
    pedidoId: "TC-0038",
    nomeCliente: "Luísa Carvalho",
    enderecoEntrega: "Kilamba, Rua Principal, 10",
    total: 1800,
    status: "entregue",
    entregadorId: "ENT-2",
    nomeEntregador: "Miguel Ferreira",
    dataAtribuicao: "2026-03-04T10:30:00Z",
  },
  {
    id: "E-004",
    pedidoId: "TC-0037",
    nomeCliente: "Bruno Neto",
    enderecoEntrega: "Miramar, Av. 4 de Fevereiro, 55",
    total: 3200,
    status: "aguardando-entregador",
  },
];

const statusConfig: Record<StatusEntregaFarmacia, { label: string; className: string; icon: React.ElementType }> = {
  "aguardando-entregador": { label: "Aguardando entregador", className: "bg-yellow-100 text-yellow-700", icon: Clock },
  "em-transporte": { label: "Em transporte", className: "bg-blue-100 text-blue-700", icon: Truck },
  entregue: { label: "Entregue", className: "bg-green-100 text-green-700", icon: CheckCircle },
};

export function FarmaciaEntregas() {
  const [entregas, setEntregas] = useState<EntregaFarmacia[]>(entregasMock);
  const [atribuindoId, setAtribuindoId] = useState<string | null>(null);
  const entregadoresAprovados = useEntregadoresAdminStore((s) =>
    s.entregadores.filter((e) => e.status === "APROVADO")
  );

  const entregadoresDisponiveis: EntregadorDisponivel[] = useMemo(
    () =>
      entregadoresAprovados.map((e) => ({
        id: e.id,
        nome: e.nome,
        telefone: e.telefone,
        veiculo: e.tipoVeiculo,
        avaliacao: 4.5,
        disponivel: true,
      })),
    [entregadoresAprovados]
  );

  const entregaAtribuindo = entregas.find((e) => e.id === atribuindoId);

  function atribuirEntregador(entregaId: string, entregador: EntregadorDisponivel) {
    setEntregas((prev) =>
      prev.map((e) =>
        e.id === entregaId
          ? {
              ...e,
              status: "em-transporte",
              entregadorId: entregador.id,
              nomeEntregador: entregador.nome,
              dataAtribuicao: new Date().toISOString(),
            }
          : e
      )
    );
    setAtribuindoId(null);
  }

  function marcarEntregue(id: string) {
    setEntregas((prev) =>
      prev.map((e) => (e.id === id ? { ...e, status: "entregue" } : e))
    );
  }

  const contadores = {
    aguardando: entregas.filter((e) => e.status === "aguardando-entregador").length,
    transporte: entregas.filter((e) => e.status === "em-transporte").length,
    entregue: entregas.filter((e) => e.status === "entregue").length,
  };

  return (
    <FarmaciaLayout>
      <div className="twala-page-enter p-6 lg:p-8 space-y-6" style={{ backgroundColor: "#faf7f2", minHeight: "100vh" }}>
        {/* Cabeçalho */}
        <div>
          <h1 style={{ fontFamily: "'Poppins', sans-serif", fontWeight: 600, fontSize: "clamp(1.4rem, 3vw, 1.8rem)", color: "#2c3e2c", marginBottom: 4 }}>
            Entregas
          </h1>
          <div style={{ width: 50, height: 3, background: "linear-gradient(90deg, #2c5530, #c7a252)", borderRadius: 2, marginBottom: 4 }} />
          <p style={{ fontFamily: "'Roboto', sans-serif", color: "#4a7856", fontSize: 13 }}>
            Gerencie as entregas e atribua entregadores
          </p>
        </div>

        {/* Cards de resumo */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="bg-yellow-50 rounded-2xl p-5">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-yellow-100 rounded-xl flex items-center justify-center">
                <Clock className="w-5 h-5 text-yellow-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-yellow-700">{contadores.aguardando}</p>
                <p className="text-sm text-yellow-600 font-medium">Aguardando entregador</p>
              </div>
            </div>
          </div>
          <div className="bg-blue-50 rounded-2xl p-5">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center">
                <Truck className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-blue-700">{contadores.transporte}</p>
                <p className="text-sm text-blue-600 font-medium">Em transporte</p>
              </div>
            </div>
          </div>
          <div className="bg-green-50 rounded-2xl p-5">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-green-100 rounded-xl flex items-center justify-center">
                <CheckCircle className="w-5 h-5 text-green-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-green-700">{contadores.entregue}</p>
                <p className="text-sm text-green-600 font-medium">Entregues</p>
              </div>
            </div>
          </div>
        </div>

        {/* Entregadores disponíveis */}
        <div className="bg-white rounded-2xl shadow-md p-5">
          <div className="flex items-center space-x-2 mb-4">
            <UserCheck className="w-5 h-5 text-green-600" />
            <h2 className="font-bold text-gray-900">
              Entregadores Disponíveis ({entregadoresDisponiveis.length})
            </h2>
          </div>
          <div className="flex flex-wrap gap-3">
            {entregadoresDisponiveis.map((ent) => (
              <div
                key={ent.id}
                className="flex items-center space-x-3 bg-green-50 border border-green-100 rounded-xl px-4 py-2.5"
              >
                <div className="w-8 h-8 rounded-full bg-green-600 flex items-center justify-center">
                  <span className="text-white text-xs font-bold">{ent.nome.charAt(0)}</span>
                </div>
                <div>
                  <p className="text-sm font-semibold text-gray-900">{ent.nome}</p>
                  <p className="text-xs text-gray-500">{ent.veiculo} · ★ {ent.avaliacao}</p>
                </div>
                <span className="w-2 h-2 rounded-full bg-green-500 flex-shrink-0" title="Disponível" />
              </div>
            ))}
            {entregadoresDisponiveis.length === 0 && (
              <p className="text-sm text-gray-500">Nenhum entregador disponível no momento.</p>
            )}
          </div>
        </div>

        {/* Lista de entregas */}
        <div>
          <h2 className="font-bold text-gray-900 mb-4">Lista de Entregas</h2>
          <div className="space-y-3">
            {entregas.map((entrega) => {
              const config = statusConfig[entrega.status];
              const StatusIcon = config.icon;
              return (
                <div
                  key={entrega.id}
                  className="bg-white rounded-2xl shadow-md p-5 hover:shadow-lg transition"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div className="flex items-start space-x-4">
                      <div className="w-11 h-11 rounded-full bg-blue-50 flex items-center justify-center flex-shrink-0">
                        <Package className="w-5 h-5 text-blue-600" />
                      </div>
                      <div>
                        <div className="flex items-center space-x-2 flex-wrap gap-y-1">
                          <p className="font-bold text-gray-900">{entrega.nomeCliente}</p>
                          <span className="text-xs text-gray-400 font-mono">Pedido #{entrega.pedidoId}</span>
                        </div>
                        <div className="flex items-center space-x-1 mt-1">
                          <MapPin className="w-3.5 h-3.5 text-gray-400" />
                          <p className="text-sm text-gray-500">{entrega.enderecoEntrega}</p>
                        </div>
                        {entrega.nomeEntregador && (
                          <p className="text-xs text-blue-600 mt-1 font-medium">
                            Entregador: {entrega.nomeEntregador}
                          </p>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center space-x-3 flex-shrink-0 flex-wrap gap-2">
                      <div className="text-right">
                        <p className="font-bold text-gray-900">
                          {entrega.total.toLocaleString()} Kz
                        </p>
                        <span className={`inline-flex items-center space-x-1 text-xs font-medium px-2.5 py-1 rounded-full ${config.className}`}>
                          <StatusIcon className="w-3 h-3" />
                          <span>{config.label}</span>
                        </span>
                      </div>

                      <div className="flex space-x-2">
                        {entrega.status === "aguardando-entregador" && (
                          <button
                            onClick={() => setAtribuindoId(entrega.id)}
                            className="flex items-center space-x-1.5 bg-green-600 hover:bg-green-700 text-white text-xs font-medium px-3 py-2 rounded-lg transition"
                          >
                            <UserCheck className="w-3.5 h-3.5" />
                            <span>Atribuir entregador</span>
                          </button>
                        )}
                        {entrega.status === "em-transporte" && (
                          <button
                            onClick={() => marcarEntregue(entrega.id)}
                            className="flex items-center space-x-1.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-medium px-3 py-2 rounded-lg transition"
                          >
                            <CheckCircle className="w-3.5 h-3.5" />
                            <span>Marcar Entregue</span>
                          </button>
                        )}
                        {entrega.status === "entregue" && (
                          <span className="flex items-center space-x-1.5 text-green-600 text-xs font-medium px-3 py-2">
                            <CheckCircle className="w-3.5 h-3.5" />
                            <span>Concluída</span>
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Modal de atribuição de entregador */}
      {atribuindoId && entregaAtribuindo && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md">
            <div className="flex items-center justify-between p-6 border-b border-gray-100">
              <div>
                <h2 className="font-bold text-gray-900">Atribuir Entregador</h2>
                <p className="text-sm text-gray-500 mt-0.5">
                  Pedido #{entregaAtribuindo.pedidoId} · {entregaAtribuindo.nomeCliente}
                </p>
              </div>
              <button
                onClick={() => setAtribuindoId(null)}
                className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6">
              {entregadoresDisponiveis.length === 0 ? (
                <div className="text-center py-8">
                  <Truck className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                  <p className="text-gray-500">Nenhum entregador disponível no momento.</p>
                </div>
              ) : (
                <div className="space-y-3">
                  <p className="text-sm text-gray-600 mb-4">
                    Selecione um entregador disponível:
                  </p>
                  {entregadoresDisponiveis.map((ent) => (
                    <button
                      key={ent.id}
                      onClick={() => atribuirEntregador(atribuindoId, ent)}
                      className="w-full flex items-center justify-between p-4 border border-gray-200 rounded-xl hover:border-green-400 hover:bg-green-50 transition text-left"
                    >
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center">
                          <span className="text-green-700 font-bold">{ent.nome.charAt(0)}</span>
                        </div>
                        <div>
                          <p className="font-semibold text-gray-900 text-sm">{ent.nome}</p>
                          <p className="text-xs text-gray-500">{ent.veiculo} · {ent.telefone}</p>
                        </div>
                      </div>
                      <div className="text-right flex-shrink-0">
                        <p className="text-sm font-bold text-yellow-600">★ {ent.avaliacao}</p>
                        <span className="text-xs text-green-600 font-medium">Disponível</span>
                      </div>
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </FarmaciaLayout>
  );
}
