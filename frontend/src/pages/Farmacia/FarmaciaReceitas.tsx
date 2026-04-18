import { useState, useEffect } from "react";
import { CheckCircle, XCircle, FileText, Search, Eye, X, AlertCircle } from "lucide-react";
import { FarmaciaLayout } from "../../layouts/FarmaciaLayout";
import { prescriptionService } from "../../services/prescriptionService";

const statusConfig: Record<string, { label: string; className: string }> = {
  pendente: { label: "Pendente", className: "bg-yellow-100 text-yellow-700" },
  aprovada: { label: "Aprovada", className: "bg-green-100 text-green-700" },
  rejeitada: { label: "Rejeitada", className: "bg-red-100 text-red-700" },
};

export function FarmaciaReceitas() {
  const [receitas, setReceitas] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [filtro, setFiltro] = useState<string>("todas");
  const [previewId, setPreviewId] = useState<string | null>(null);
  const [isUpdating, setIsUpdating] = useState<string | null>(null);

  useEffect(() => {
    fetchReceitas();
  }, []);

  const fetchReceitas = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const res = await prescriptionService.getFarmaciaPrescriptions();
      if (res.success) {
        setReceitas(res.data || []);
      } else {
        setError(res.error || "Erro ao carregar receitas");
      }
    } catch (err) {
      setError("Falha na conexão");
    } finally {
      setIsLoading(false);
    }
  };

  const filtered = receitas.filter((r) => {
    const nomeCliente = r.cliente?.nome || "";
    const matchSearch =
      nomeCliente.toLowerCase().includes(search.toLowerCase()) ||
      (r.pedido_id && r.pedido_id.toLowerCase().includes(search.toLowerCase()));
    const matchFiltro = filtro === "todas" || r.estado === filtro;
    return matchSearch && matchFiltro;
  });

  const receitaPreview = receitas.find((r) => r.id === previewId);

  async function atualizarEstado(id: string, novoEstado: string) {
    setIsUpdating(id);
    try {
      const res = await prescriptionService.updateStatus(id, novoEstado);
      if (res.success) {
        fetchReceitas();
        setPreviewId(null);
      } else {
        alert(res.error || "Erro ao atualizar estado da receita");
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

  const contadores = {
    todas: receitas.length,
    pendente: receitas.filter((r) => r.estado === "pendente").length,
    aprovada: receitas.filter((r) => r.estado === "aprovada").length,
    rejeitada: receitas.filter((r) => r.estado === "rejeitada").length,
  };

  return (
    <FarmaciaLayout>
      <div className="twala-page-enter p-6 lg:p-8 space-y-6" style={{ backgroundColor: "#faf7f2", minHeight: "100vh" }}>
        {/* Cabeçalho */}
        <div>
          <h1 style={{ fontFamily: "'Poppins', sans-serif", fontWeight: 600, fontSize: "clamp(1.4rem, 3vw, 1.8rem)", color: "#2c3e2c", marginBottom: 4 }}>
            Receitas Médicas
          </h1>
          <div style={{ width: 50, height: 3, background: "linear-gradient(90deg, #2c5530, #c7a252)", borderRadius: 2, marginBottom: 4 }} />
          <p style={{ fontFamily: "'Roboto', sans-serif", color: "#4a7856", fontSize: 13 }}>
            Aprove ou rejeite as receitas enviadas pelos clientes
          </p>
        </div>

        {/* Cards de resumo */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            { key: "todas", label: "Total", color: "bg-gray-50 text-gray-700" },
            { key: "pendente", label: "Pendentes", color: "bg-yellow-50 text-yellow-700" },
            { key: "aprovada", label: "Aprovadas", color: "bg-green-50 text-green-700" },
            { key: "rejeitada", label: "Rejeitadas", color: "bg-red-50 text-red-700" },
          ].map((item) => (
            <button
              key={item.key}
              onClick={() => setFiltro(item.key)}
              className={`rounded-2xl p-4 text-left transition hover:shadow-md ${item.color} ${filtro === item.key ? "ring-2 ring-offset-1 ring-green-500" : ""}`}
            >
              <p className="text-2xl font-bold">
                {contadores[item.key as keyof typeof contadores]}
              </p>
              <p className="text-sm font-medium mt-1">{item.label}</p>
            </button>
          ))}
        </div>

        {/* Busca */}
        <div className="relative max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="Buscar por cliente ou medicamento..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-10 pr-4 py-2.5 border border-gray-200 rounded-xl w-full text-sm focus:outline-none focus:ring-2 focus:ring-green-500 bg-white"
          />
        </div>

        {/* Lista de receitas */}
        {isLoading ? (
          <div className="bg-white rounded-2xl shadow-md p-12 text-center">
            <div className="twala-loading mx-auto mb-4" />
            <p className="text-gray-500">A carregar receitas...</p>
          </div>
        ) : error ? (
          <div className="bg-white rounded-2xl shadow-md p-12 text-center text-red-500">
            <AlertCircle className="w-12 h-12 mx-auto mb-3" />
            <p className="font-medium">{error}</p>
            <button onClick={fetchReceitas} className="twala-btn-outline mt-4 mx-auto">Tentar Novamente</button>
          </div>
        ) : filtered.length === 0 ? (
          <div className="bg-white rounded-2xl shadow-md p-12 text-center">
            <FileText className="w-12 h-12 text-gray-300 mx-auto mb-3" />
            <p className="text-gray-500 font-medium">Nenhuma receita encontrada</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
            {filtered.map((receita) => {
              const config = statusConfig[receita.estado] || statusConfig.pendente;
              const nomeCliente = receita.cliente?.nome || "Cliente";
              return (
                <div
                  key={receita.id}
                  className="bg-white rounded-2xl shadow-md overflow-hidden hover:shadow-lg transition"
                >
                  {/* Imagem da receita */}
                  <div className="relative">
                    <img
                      src={receita.ficheiro_url}
                      alt="Receita médica"
                      className="w-full h-40 object-cover"
                    />
                    <div className="absolute top-3 right-3">
                      <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${config.className}`}>
                        {config.label}
                      </span>
                    </div>
                  </div>

                  {/* Informações */}
                  <div className="p-4">
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <p className="font-bold text-gray-900">{nomeCliente}</p>
                        <p className="text-sm text-green-700 font-medium mt-0.5">
                          #{receita.id.substring(0, 8)}
                        </p>
                      </div>
                      <button
                        onClick={() => setPreviewId(receita.id)}
                        className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition flex-shrink-0"
                        title="Ver receita ampliada"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                    </div>

                    <p className="text-xs text-gray-400 mb-4">
                      Enviado em {formatarData(receita.data_envio)}
                      {receita.pedido_id && ` · Pedido #${receita.pedido_id.substring(0, 8)}`}
                    </p>

                    {receita.estado === "pendente" ? (
                      <div className="flex space-x-2">
                        <button
                          onClick={() => atualizarEstado(receita.id, "rejeitada")}
                          disabled={isUpdating === receita.id}
                          className="flex-1 flex items-center justify-center space-x-1.5 border border-red-200 text-red-600 hover:bg-red-50 py-2 rounded-xl text-sm font-medium transition disabled:opacity-50"
                        >
                          <XCircle className="w-4 h-4" />
                          <span>Rejeitar</span>
                        </button>
                        <button
                          onClick={() => atualizarEstado(receita.id, "aprovada")}
                          disabled={isUpdating === receita.id}
                          className="flex-1 flex items-center justify-center space-x-1.5 bg-green-600 hover:bg-green-700 text-white py-2 rounded-xl text-sm font-medium transition shadow-sm disabled:opacity-50"
                        >
                          <CheckCircle className="w-4 h-4" />
                          <span>Aprovar</span>
                        </button>
                      </div>
                    ) : (
                      <div className={`flex items-center justify-center space-x-2 py-2 rounded-xl text-sm font-medium ${receita.estado === "aprovada" ? "bg-green-50 text-green-700" : "bg-red-50 text-red-700"}`}>
                        {receita.estado === "aprovada" ? (
                          <CheckCircle className="w-4 h-4" />
                        ) : (
                          <XCircle className="w-4 h-4" />
                        )}
                        <span>
                          {receita.estado === "aprovada" ? "Receita Aprovada" : "Receita Rejeitada"}
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Modal de preview */}
      {previewId && receitaPreview && (
        <div className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg">
            <div className="flex items-center justify-between p-5 border-b border-gray-100">
              <div>
                <h2 className="font-bold text-gray-900">Receita de {receitaPreview.cliente?.nome || "Cliente"}</h2>
                <p className="text-sm text-green-700">#{receitaPreview.id.substring(0, 8)}</p>
              </div>
              <button
                onClick={() => setPreviewId(null)}
                className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-5">
              <img
                src={receitaPreview.ficheiro_url}
                alt="Receita médica ampliada"
                className="w-full rounded-xl border border-gray-100"
              />
            </div>

            {receitaPreview.estado === "pendente" && (
              <div className="p-5 border-t border-gray-100 flex space-x-3">
                <button
                  onClick={() => atualizarEstado(receitaPreview.id, "rejeitada")}
                  disabled={isUpdating === receitaPreview.id}
                  className="flex-1 flex items-center justify-center space-x-2 border border-red-200 text-red-600 hover:bg-red-50 py-2.5 rounded-xl font-medium transition disabled:opacity-50"
                >
                  <XCircle className="w-4 h-4" />
                  <span>Rejeitar</span>
                </button>
                <button
                  onClick={() => atualizarEstado(receitaPreview.id, "aprovada")}
                  disabled={isUpdating === receitaPreview.id}
                  className="flex-1 flex items-center justify-center space-x-2 bg-green-600 hover:bg-green-700 text-white py-2.5 rounded-xl font-medium transition shadow-sm disabled:opacity-50"
                >
                  <CheckCircle className="w-4 h-4" />
                  <span>Aprovar</span>
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </FarmaciaLayout>
  );
}
