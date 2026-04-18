import { useState, useEffect } from "react";
import {
  ShoppingBag,
  CheckCircle,
  XCircle,
  Clock,
  ChevronDown,
  Search,
  Eye,
  X,
  AlertCircle,
} from "lucide-react";
import { FarmaciaLayout } from "../../layouts/FarmaciaLayout";
import { orderService } from "../../services/orderService";
import type { OrderStatus } from "../../types";

const STATUS_CONFIG: Record<string, { label: string; bg: string; color: string; icon: React.ElementType }> = {
  pendente: { label: "Pendente", bg: "rgba(199,162,82,0.15)", color: "#a07a2a", icon: Clock },
  confirmado: { label: "Confirmado", bg: "rgba(74,120,86,0.12)", color: "#2c5530", icon: Clock },
  "em-preparacao": { label: "Em preparação", bg: "rgba(74,120,86,0.12)", color: "#2c5530", icon: Clock },
  pronto: { label: "Pronto para entrega", bg: "rgba(44,85,48,0.1)", color: "#2c5530", icon: CheckCircle },
  "em-transito": { label: "Em trânsito", bg: "rgba(44,85,48,0.15)", color: "#2c5530", icon: Clock },
  entregue: { label: "Entregue", bg: "rgba(44,85,48,0.12)", color: "#2c5530", icon: CheckCircle },
  cancelado: { label: "Cancelado", bg: "rgba(212,90,90,0.12)", color: "#d45a5a", icon: XCircle },
};

const NEXT_STATUS: Partial<Record<OrderStatus, OrderStatus>> = {
  pendente: "confirmado",
  confirmado: "em-preparacao",
  "em-preparacao": "pronto",
};

export function FarmaciaPedidos() {
  const [pedidos, setPedidos] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [filtroStatus, setFiltroStatus] = useState<string>("todos");
  const [detalheId, setDetalheId] = useState<string | null>(null);
  const [isUpdating, setIsUpdating] = useState<string | null>(null);

  useEffect(() => {
    fetchPedidos();
  }, []);

  const fetchPedidos = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const res = await orderService.getFarmaciaPedidos();
      if (res.success) {
        setPedidos(res.data || []);
      } else {
        setError(res.error || "Erro ao carregar pedidos");
      }
    } catch (err) {
      setError("Falha na conexão");
    } finally {
      setIsLoading(false);
    }
  };

  const filtered = pedidos.filter((p) => {
    const nomeCliente = p.cliente?.nome || "";
    const matchSearch =
      nomeCliente.toLowerCase().includes(search.toLowerCase()) ||
      p.id.toLowerCase().includes(search.toLowerCase());
    const matchStatus = filtroStatus === "todos" || 
      (filtroStatus === "pendente" && (p.status === "pendente" || p.status === "confirmado")) ||
      (filtroStatus === "pronto-entrega" && (p.status === "pronto")) ||
      p.status === filtroStatus;
    return matchSearch && matchStatus;
  });

  const pedidoDetalhe = pedidos.find((p) => p.id === detalheId);

  async function avancarStatus(id: string) {
    const p = pedidos.find((x) => x.id === id);
    if (!p) return;
    const proximo = NEXT_STATUS[p.status as OrderStatus];
    if (proximo) {
      setIsUpdating(id);
      try {
        const res = await orderService.updateStatus(id, proximo);
        if (res.success) {
          fetchPedidos();
        } else {
          alert(res.error || "Erro ao atualizar status");
        }
      } catch (err) {
        alert("Erro de conexão");
      } finally {
        setIsUpdating(null);
      }
    }
  }

  async function recusarPedido(id: string) {
    if (!confirm("Tem certeza que deseja recusar este pedido?")) return;
    setIsUpdating(id);
    try {
      const res = await orderService.updateStatus(id, "cancelado");
      if (res.success) {
        fetchPedidos();
        setDetalheId(null);
      } else {
        alert(res.error || "Erro ao recusar pedido");
      }
    } catch (err) {
      alert("Erro de conexão");
    } finally {
      setIsUpdating(null);
    }
  }

  function formatarData(iso: string) {
    return new Date(iso).toLocaleString("pt-AO", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  }

  const totais = {
    todos: pedidos.length,
    pendente: pedidos.filter((p) => p.status === "pendente" || p.status === "confirmado").length,
    "em-preparacao": pedidos.filter((p) => p.status === "em-preparacao").length,
    "pronto-entrega": pedidos.filter((p) => p.status === "pronto").length,
  };

  return (
    <FarmaciaLayout>
      <div className="p-6 lg:p-8 space-y-6">
        {/* Cabeçalho */}
        <div>
          <h1 className="text-2xl lg:text-3xl font-bold text-gray-900">Pedidos</h1>
          <p className="text-gray-500 text-sm mt-1">
            Gerencie os pedidos recebidos dos clientes
          </p>
        </div>

        {/* Cards de resumo */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            { key: "todos", label: "Total", color: "bg-gray-50 text-gray-700" },
            { key: "pendente", label: "Pendentes", color: "bg-yellow-50 text-yellow-700" },
            { key: "em-preparacao", label: "Em preparo", color: "bg-blue-50 text-blue-700" },
            { key: "pronto-entrega", label: "Prontos", color: "bg-green-50 text-green-700" },
          ].map((item) => (
            <button
              key={item.key}
              onClick={() => setFiltroStatus(item.key)}
              className={`rounded-2xl p-4 text-left transition hover:shadow-md ${item.color} ${filtroStatus === item.key ? "ring-2 ring-offset-1 ring-green-500" : ""}`}
            >
              <p className="text-2xl font-bold">{totais[item.key as keyof typeof totais] ?? pedidos.length}</p>
              <p className="text-sm font-medium mt-1">{item.label}</p>
            </button>
          ))}
        </div>

        {/* Filtros */}
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1 max-w-sm">
            <Search style={{ position: "absolute", left: 14, top: "50%", transform: "translateY(-50%)", width: 16, height: 16, color: "#4a7856" }} />
            <input
              type="text"
              placeholder="Buscar por cliente ou ID..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="twala-input w-full"
              style={{ paddingLeft: 44 }}
            />
          </div>
          <div className="relative">
            <select
              value={filtroStatus}
              onChange={(e) => setFiltroStatus(e.target.value)}
              className="twala-input"
              style={{ paddingRight: 36 }}
            >
              <option value="todos">Todos os status</option>
              <option value="pendente">Pendente</option>
              <option value="em-preparacao">Em preparação</option>
              <option value="pronto-entrega">Pronto para entrega</option>
              <option value="recusado">Recusado</option>
            </select>
            <ChevronDown style={{ position: "absolute", right: 12, top: "50%", transform: "translateY(-50%)", width: 16, height: 16, color: "#4a7856", pointerEvents: "none" }} />
          </div>
        </div>

        {/* Lista de pedidos */}
        <div className="space-y-3">
          {isLoading ? (
            <div className="twala-card p-12 text-center">
              <div className="twala-loading mx-auto mb-4" />
              <p className="text-gray-500">A carregar os seus pedidos...</p>
            </div>
          ) : error ? (
            <div className="twala-card p-12 text-center text-red-500">
              <AlertCircle className="w-12 h-12 mx-auto mb-3" />
              <p className="font-medium">{error}</p>
              <button onClick={fetchPedidos} className="twala-btn-outline mt-4 mx-auto">Tentar Novamente</button>
            </div>
          ) : filtered.length === 0 ? (
            <div className="twala-card p-12 text-center">
              <div style={{ width: 56, height: 56, borderRadius: "50%", backgroundColor: "rgba(44,85,48,0.08)", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 12px" }}>
                <ShoppingBag style={{ width: 28, height: 28, color: "#4a7856" }} />
              </div>
              <p style={{ fontFamily: "'Poppins', sans-serif", fontWeight: 500, color: "#4a7856" }}>Nenhum pedido encontrado</p>
            </div>
          ) : (
            filtered.map((pedido) => {
              const config = STATUS_CONFIG[pedido.status] || STATUS_CONFIG.pendente;
              const StatusIcon = config.icon;
              const podeAvancar = NEXT_STATUS[pedido.status as OrderStatus];
              const nomeCliente = pedido.cliente?.nome || "Cliente Desconhecido";
              return (
                <div
                  key={pedido.id}
                  className="twala-card p-5"
                  style={{ transition: "all 0.2s ease" }}
                  onMouseEnter={e => {
                    (e.currentTarget as HTMLDivElement).style.boxShadow = "0 8px 20px rgba(44,85,48,0.12)";
                    (e.currentTarget as HTMLDivElement).style.borderBottom = "2px solid #c7a252";
                  }}
                  onMouseLeave={e => {
                    (e.currentTarget as HTMLDivElement).style.boxShadow = "0 4px 6px rgba(0,0,0,0.05)";
                    (e.currentTarget as HTMLDivElement).style.borderBottom = "1px solid rgba(0,0,0,0.06)";
                  }}
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div className="flex items-start gap-4">
                      <div style={{ width: 44, height: 44, borderRadius: "50%", background: "linear-gradient(135deg, #2c5530, #4a7856)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                        <span style={{ fontFamily: "'Poppins', sans-serif", fontWeight: 700, color: "#ffffff", fontSize: 16 }}>
                          {nomeCliente.charAt(0)}
                        </span>
                      </div>
                      <div>
                        <div className="flex items-center gap-2 flex-wrap">
                          <p style={{ fontFamily: "'Poppins', sans-serif", fontWeight: 600, color: "#2c3e2c", margin: 0 }}>{nomeCliente}</p>
                          <span style={{ fontFamily: "monospace", fontSize: 12, color: "#888" }}>#{pedido.id.substring(0, 8)}</span>
                        </div>
                        <p style={{ fontFamily: "'Roboto', sans-serif", fontSize: 13, color: "#4a7856", marginTop: 2 }}>
                          {pedido.itens?.map((i: any) => `${i.nome} ×${i.quantidade}`).join(" · ") || "Nenhum item"}
                        </p>
                        <p style={{ fontFamily: "'Roboto', sans-serif", fontSize: 12, color: "#888", marginTop: 2 }}>
                          {formatarData(pedido.data_pedido)} · {pedido.metodo_pagamento}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-3 flex-shrink-0 flex-wrap">
                      <div className="text-right">
                        <p style={{ fontFamily: "'Poppins', sans-serif", fontWeight: 700, fontSize: 18, color: "#2c5530", margin: 0 }}>
                          {Number(pedido.total).toLocaleString()} Kz
                        </p>
                        <span style={{ display: "inline-flex", alignItems: "center", gap: 4, fontSize: 11, fontFamily: "'Roboto', sans-serif", fontWeight: 600, padding: "3px 10px", borderRadius: 20, backgroundColor: config.bg, color: config.color }}>
                          <StatusIcon className="w-3 h-3" />
                          {config.label}
                        </span>
                      </div>

                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => setDetalheId(pedido.id)}
                          style={{ padding: 8, color: "#4a7856", backgroundColor: "rgba(44,85,48,0.07)", border: "none", borderRadius: 8, cursor: "pointer", transition: "all 0.2s" }}
                          title="Ver detalhes"
                          onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.backgroundColor = "rgba(44,85,48,0.15)"; }}
                          onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.backgroundColor = "rgba(44,85,48,0.07)"; }}
                        >
                          <Eye style={{ width: 16, height: 16 }} />
                        </button>

                        {podeAvancar && (
                          <button
                            onClick={() => avancarStatus(pedido.id)}
                            disabled={isUpdating === pedido.id}
                            className="twala-btn-primary flex items-center gap-1"
                            style={{ fontSize: 12, padding: "6px 12px" }}
                          >
                            {isUpdating === pedido.id ? (
                               <div style={{ width: 14, height: 14, border: "2px solid rgba(255,255,255,0.3)", borderTop: "2px solid #fff", borderRadius: "50%", animation: "spin 1s linear infinite" }} />
                            ) : (
                              <CheckCircle style={{ width: 14, height: 14 }} />
                            )}
                            {pedido.status === "pendente" ? "Confirmar" : pedido.status === "confirmado" ? "Iniciar preparo" : "Marcar Pronto"}
                          </button>
                        )}

                        {pedido.status === "pendente" && (
                          <button
                            onClick={() => recusarPedido(pedido.id)}
                            disabled={isUpdating === pedido.id}
                            style={{ display: "flex", alignItems: "center", gap: 4, border: "1px solid rgba(212,90,90,0.3)", backgroundColor: "rgba(212,90,90,0.05)", color: "#d45a5a", fontSize: 12, fontFamily: "'Roboto', sans-serif", fontWeight: 500, padding: "6px 12px", borderRadius: 8, cursor: "pointer", transition: "all 0.2s" }}
                            onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.backgroundColor = "rgba(212,90,90,0.12)"; }}
                            onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.backgroundColor = "rgba(212,90,90,0.05)"; }}
                          >
                            <XCircle style={{ width: 14, height: 14 }} />
                            Recusar
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>

      {/* Modal de detalhes */}
      {detalheId && pedidoDetalhe && (
        <div
          style={{ position: "fixed", inset: 0, backgroundColor: "rgba(0,0,0,0.5)", zIndex: 50, display: "flex", alignItems: "center", justifyContent: "center", padding: 16 }}
          onClick={() => setDetalheId(null)}
        >
          <div
            style={{ backgroundColor: "#faf7f2", borderRadius: 16, boxShadow: "0 25px 50px rgba(0,0,0,0.25)", width: "100%", maxWidth: 460, borderTop: "4px solid #c7a252" }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between" style={{ padding: "20px 24px", borderBottom: "1px solid #f0f0f0" }}>
              <h2 style={{ fontFamily: "'Poppins', sans-serif", fontWeight: 600, fontSize: 18, color: "#2c3e2c", margin: 0 }}>
                Pedido #{pedidoDetalhe.id}
              </h2>
              <button onClick={() => setDetalheId(null)} style={{ padding: 8, color: "#888", backgroundColor: "rgba(0,0,0,0.05)", border: "none", borderRadius: 8, cursor: "pointer" }}>
                <X style={{ width: 18, height: 18 }} />
              </button>
            </div>

            <div style={{ padding: 24 }} className="space-y-5">
              <div>
                <p style={{ fontFamily: "'Roboto', sans-serif", fontSize: 11, fontWeight: 600, color: "#4a7856", textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: 8 }}>
                  Cliente
                </p>
                <p style={{ fontFamily: "'Poppins', sans-serif", fontWeight: 600, color: "#2c3e2c", margin: 0 }}>{pedidoDetalhe.cliente?.nome || "Cliente"}</p>
                <p style={{ fontFamily: "'Roboto', sans-serif", fontSize: 13, color: "#4a7856", margin: "2px 0" }}>{pedidoDetalhe.cliente?.telefone || "—"}</p>
                <p style={{ fontFamily: "'Roboto', sans-serif", fontSize: 13, color: "#4a7856" }}>{pedidoDetalhe.endereco_entrega}</p>
              </div>

              <div>
                <p style={{ fontFamily: "'Roboto', sans-serif", fontSize: 11, fontWeight: 600, color: "#4a7856", textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: 8 }}>
                  Itens do Pedido
                </p>
                <div className="space-y-2">
                  {pedidoDetalhe.itens?.map((item: any, i: number) => (
                    <div key={i} className="flex items-center justify-between">
                      <span style={{ fontFamily: "'Roboto', sans-serif", fontSize: 14, color: "#2c3e2c" }}>{item.nome} ×{item.quantidade}</span>
                      <span style={{ fontFamily: "'Roboto', sans-serif", fontWeight: 500, color: "#2c3e2c" }}>{(item.quantidade * item.preco_unitario).toLocaleString()} Kz</span>
                    </div>
                  ))}
                  <div className="flex items-center justify-between" style={{ paddingTop: 8, borderTop: "1px solid #e5e5e5" }}>
                    <span style={{ fontFamily: "'Poppins', sans-serif", fontWeight: 600, color: "#2c3e2c" }}>Total</span>
                    <span style={{ fontFamily: "'Poppins', sans-serif", fontWeight: 700, color: "#2c5530" }}>{Number(pedidoDetalhe.total).toLocaleString()} Kz</span>
                  </div>
                </div>
              </div>

              <div>
                <p style={{ fontFamily: "'Roboto', sans-serif", fontSize: 11, fontWeight: 600, color: "#4a7856", textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: 8 }}>
                  Pagamento
                </p>
                <p style={{ fontFamily: "'Roboto', sans-serif", fontSize: 14, color: "#2c3e2c" }}>{pedidoDetalhe.metodo_pagamento}</p>
              </div>

              <div className="flex items-center justify-between">
                <p style={{ fontFamily: "'Roboto', sans-serif", fontSize: 11, fontWeight: 600, color: "#4a7856", textTransform: "uppercase", letterSpacing: "0.05em" }}>
                  Status
                </p>
                <span style={{ fontSize: 12, fontFamily: "'Roboto', sans-serif", fontWeight: 600, padding: "3px 12px", borderRadius: 20, backgroundColor: (STATUS_CONFIG[pedidoDetalhe.status] ?? STATUS_CONFIG.pendente).bg, color: (STATUS_CONFIG[pedidoDetalhe.status] ?? STATUS_CONFIG.pendente).color }}>
                  {(STATUS_CONFIG[pedidoDetalhe.status] ?? STATUS_CONFIG.pendente).label}
                </span>
              </div>
            </div>

            <div className="flex gap-3" style={{ padding: "16px 24px", borderTop: "1px solid #f0f0f0" }}>
              {pedidoDetalhe.status === "pendente" && (
                <>
                  <button 
                    onClick={() => recusarPedido(pedidoDetalhe.id)} 
                    disabled={isUpdating === pedidoDetalhe.id}
                    className="twala-btn-outline flex-1" 
                    style={{ borderColor: "#d45a5a", color: "#d45a5a" }}
                  >
                    Recusar
                  </button>
                  <button 
                    onClick={() => { avancarStatus(pedidoDetalhe.id); }} 
                    disabled={isUpdating === pedidoDetalhe.id}
                    className="twala-btn-primary flex-1"
                  >
                    Confirmar Pedido
                  </button>
                </>
              )}
              {pedidoDetalhe.status === "confirmado" && (
                <button 
                  onClick={() => { avancarStatus(pedidoDetalhe.id); }} 
                  disabled={isUpdating === pedidoDetalhe.id}
                  className="twala-btn-primary flex-1"
                >
                  Iniciar Preparação
                </button>
              )}
              {pedidoDetalhe.status === "em-preparacao" && (
                <button 
                  onClick={() => { avancarStatus(pedidoDetalhe.id); }} 
                  disabled={isUpdating === pedidoDetalhe.id}
                  className="twala-btn-primary flex-1"
                >
                  Marcar como Pronto
                </button>
              )}
              {["pronto", "em-transito", "entregue", "cancelado"].includes(pedidoDetalhe.status) && (
                <button onClick={() => setDetalheId(null)} className="twala-btn-outline flex-1">
                  Fechar
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </FarmaciaLayout>
  );
}
