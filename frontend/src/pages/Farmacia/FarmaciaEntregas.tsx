import { useState, useEffect } from "react";
import { Truck, UserCheck, Package, CheckCircle, Clock, X, MapPin, AlertCircle } from "lucide-react";
import { FarmaciaLayout } from "../../layouts/FarmaciaLayout";
import { farmaciaService } from "../../services/farmaciaService";
import { apiRequest } from "../../services/authService";

const statusConfig: Record<string, { label: string; className: string; icon: React.ElementType }> = {
  DISPONIVEL: { label: "Aguardando entregador", className: "bg-yellow-100 text-yellow-700", icon: Clock },
  PRONTO: { label: "Aguardando entregador", className: "bg-yellow-100 text-yellow-700", icon: Clock },
  EM_TRANSITO: { label: "Em transporte", className: "bg-blue-100 text-blue-700", icon: Truck },
  ENTREGUE: { label: "Entregue", className: "bg-green-100 text-green-700", icon: CheckCircle },
};

export function FarmaciaEntregas() {
  const [entregas, setEntregas] = useState<any[]>([]);
  const [entregadores, setEntregadores] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [atribuindoId, setAtribuindoId] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState<string | null>(null);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const [entregasRes, couriersRes] = await Promise.all([
        apiRequest("/farmacia/pedidos", "GET"),
        farmaciaService.getEntregadoresDisponiveis()
      ]);

      if (entregasRes.success && Array.isArray(entregasRes.data)) {
        // Filtramos apenas pedidos que já foram confirmados ou estão em trânsito
        setEntregas(entregasRes.data.filter((p: any) => 
          ["CONFIRMADO", "EM_PREPARACAO", "PRONTO", "EM_TRANSITO", "ENTREGUE"].includes(p.status)
        ));
      }
      
      if (couriersRes.success) {
        setEntregadores(couriersRes.data || []);
      }

      if (!entregasRes.success) {
        setError(entregasRes.error || "Erro ao carregar entregas");
      }
    } catch (err) {
      setError("Falha na conexão");
    } finally {
      setIsLoading(false);
    }
  };

  async function atribuirEntregador(pedidoId: string, entregadorId: number) {
    setIsProcessing(pedidoId);
    try {
      const res = await farmaciaService.atribuirEntregador(pedidoId, entregadorId);
      if (res.success) {
        fetchData();
        setAtribuindoId(null);
      } else {
        alert(res.error || "Erro ao atribuir entregador. O pedido deve estar PRONTO.");
      }
    } catch (err) {
      alert("Erro de conexão");
    } finally {
      setIsProcessing(null);
    }
  }

  async function marcarPronto(pedidoId: string) {
    setIsProcessing(pedidoId);
    try {
      const res = await apiRequest(`/farmacia/pedidos/${pedidoId}/status`, "PUT", { status: "PRONTO" });
      if (res.success) {
        fetchData();
      } else {
        alert(res.error || "Erro ao atualizar status");
      }
    } catch (err) {
      alert("Erro de conexão");
    } finally {
      setIsProcessing(null);
    }
  }

  const contadores = {
    aguardando: entregas.filter((e) => ["CONFIRMADO", "EM_PREPARACAO", "PRONTO"].includes(e.status)).length,
    transporte: entregas.filter((e) => e.status === "EM_TRANSITO").length,
    entregue: entregas.filter((e) => e.status === "ENTREGUE").length,
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
              Estafetas Online ({entregadores.length})
            </h2>
          </div>
          <div className="flex flex-wrap gap-3">
            {entregadores.map((ent) => (
              <div
                key={ent.id}
                className="flex items-center space-x-3 bg-green-50 border border-green-100 rounded-xl px-4 py-2.5"
              >
                <div className="w-8 h-8 rounded-full bg-green-600 flex items-center justify-center">
                  <span className="text-white text-xs font-bold">{ent.nome.charAt(0)}</span>
                </div>
                <div>
                  <p className="text-sm font-semibold text-gray-900">{ent.nome}</p>
                  <p className="text-xs text-gray-500">{ent.veiculo || "Estafeta"}</p>
                </div>
                <span className="w-2 h-2 rounded-full bg-green-500 flex-shrink-0" title="Disponível" />
              </div>
            ))}
            {entregadores.length === 0 && (
              <p className="text-sm text-gray-500">Nenhum estafeta online no momento.</p>
            )}
          </div>
        </div>

        {/* Lista de entregas */}
        <div>
          <h2 className="font-bold text-gray-900 mb-4">Operações de Logística</h2>
          
          {isLoading ? (
            <div className="bg-white rounded-2xl shadow-md p-10 text-center">
               <div className="twala-loading mx-auto mb-4" />
               <p className="text-gray-500">A carregar entregas...</p>
            </div>
          ) : error ? (
            <div className="bg-white rounded-2xl shadow-md p-10 text-center text-red-500">
               <AlertCircle className="w-12 h-12 mx-auto mb-3" />
               <p>{error}</p>
            </div>
          ) : entregas.length === 0 ? (
            <div className="bg-white rounded-2xl shadow-md p-10 text-center">
               <Package className="w-12 h-12 text-gray-200 mx-auto mb-3" />
               <p className="text-gray-500">Sem entregas registadas hoje.</p>
            </div>
          ) : (
            <div className="space-y-3">
              {entregas.map((pedido) => {
                const config = statusConfig[pedido.status] || statusConfig.DISPONIVEL;
                const StatusIcon = config.icon;
                const nomeCliente = pedido.Cliente?.nome || "Cliente";
                const endereco = pedido.Endereco ? `${pedido.Endereco.municipio}, ${pedido.Endereco.bairro}` : "Endereço não especificado";
                
                return (
                  <div
                    key={pedido.id}
                    className="bg-white rounded-2xl shadow-md p-5 hover:shadow-lg transition"
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                      <div className="flex items-start space-x-4">
                        <div className="w-11 h-11 rounded-full bg-blue-50 flex items-center justify-center flex-shrink-0">
                          <Package className="w-5 h-5 text-blue-600" />
                        </div>
                        <div>
                          <div className="flex items-center space-x-2 flex-wrap gap-y-1">
                            <p className="font-bold text-gray-900">{nomeCliente}</p>
                            <span className="text-xs text-gray-400 font-mono">Pedido #{pedido.id}</span>
                          </div>
                          <div className="flex items-center space-x-1 mt-1">
                            <MapPin className="w-3.5 h-3.5 text-gray-400" />
                            <p className="text-sm text-gray-500">{endereco}</p>
                          </div>
                          {pedido.Entrega?.Entregador && (
                            <p className="text-xs text-blue-600 mt-1 font-medium">
                              Estafeta: {pedido.Entrega.Entregador.nome} ({pedido.Entrega.Entregador.veiculo})
                            </p>
                          )}
                        </div>
                      </div>

                      <div className="flex items-center space-x-3 flex-shrink-0 flex-wrap gap-2">
                        <div className="text-right">
                          <p className="font-bold text-gray-900">
                            {Number(pedido.total).toLocaleString()} Kz
                          </p>
                          <span className={`inline-flex items-center space-x-1 text-xs font-medium px-2.5 py-1 rounded-full ${config.className}`}>
                            <StatusIcon className="w-3 h-3" />
                            <span>{config.label}</span>
                          </span>
                        </div>

                        <div className="flex space-x-2">
                          {pedido.status === "CONFIRMADO" || pedido.status === "EM_PREPARACAO" ? (
                            <button
                              onClick={() => marcarPronto(pedido.id)}
                              disabled={isProcessing === pedido.id}
                              className="twala-btn-primary text-xs py-2 px-4 disabled:opacity-50"
                            >
                              Marcar como Pronto
                            </button>
                          ) : null}

                          {pedido.status === "PRONTO" && !pedido.Entrega?.entregador_id && (
                            <button
                              onClick={() => setAtribuindoId(pedido.id)}
                              disabled={isProcessing === pedido.id}
                              className="flex items-center space-x-1.5 bg-green-600 hover:bg-green-700 text-white text-xs font-medium px-3 py-2 rounded-lg transition disabled:opacity-50"
                            >
                              <UserCheck className="w-3.5 h-3.5" />
                              <span>Atribuir estafeta</span>
                            </button>
                          )}

                          {pedido.status === "EM_TRANSITO" && (
                            <span className="flex items-center space-x-1.5 text-blue-600 text-xs font-medium px-3 py-2">
                              <Truck className="w-3.5 h-3.5" />
                              <span>Em trânsito...</span>
                            </span>
                          )}

                          {pedido.status === "ENTREGUE" && (
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
          )}
        </div>
      </div>

      {/* Modal de atribuição de estafeta */}
      {atribuindoId && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md">
            <div className="flex items-center justify-between p-6 border-b border-gray-100">
              <div>
                <h2 className="font-bold text-gray-900">Atribuir Estafeta</h2>
                <p className="text-sm text-gray-500 mt-0.5">
                  Pedido #{atribuindoId}
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
              {entregadores.length === 0 ? (
                <div className="text-center py-8">
                  <Truck className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                  <p className="text-gray-500">Nenhum estafeta disponível no momento.</p>
                </div>
              ) : (
                <div className="space-y-3">
                  <p className="text-sm text-gray-600 mb-4">
                    Selecione um estafeta para recolha:
                  </p>
                  {entregadores.map((ent) => (
                    <button
                      key={ent.id}
                      onClick={() => atribuirEntregador(atribuindoId, ent.id)}
                      disabled={isProcessing === atribuindoId}
                      className="w-full flex items-center justify-between p-4 border border-gray-200 rounded-xl hover:border-green-400 hover:bg-green-50 transition text-left disabled:opacity-50"
                    >
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center">
                          <span className="text-green-700 font-bold">{ent.nome.charAt(0)}</span>
                        </div>
                        <div>
                          <p className="font-semibold text-gray-900 text-sm">{ent.nome}</p>
                          <p className="text-xs text-gray-500">{ent.veiculo || "Estafeta"} · {ent.telefone}</p>
                        </div>
                      </div>
                      <div className="text-right flex-shrink-0">
                        <span className="text-xs text-green-600 font-medium">Online</span>
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
