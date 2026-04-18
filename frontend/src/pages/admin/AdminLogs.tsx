import { useEffect, useState } from "react";
import { adminService } from "../../services/adminService";

interface AdminLog {
  id: number;
  acao: string;
  tipo_alvo: string;
  id_alvo: number;
  descricao: string;
  detalhes: string;
  ip_address: string;
  createdAt: string;
  Admin?: {
    id: number;
    nome: string;
    email: string;
  };
}

const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  return new Intl.DateTimeFormat("pt-AO", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  }).format(date);
};

const formatDateTime = (dateString: string) => {
  const date = new Date(dateString);
  return new Intl.DateTimeFormat("pt-AO", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  }).format(date);
};

export function AdminLogs() {
  const [logs, setLogs] = useState<AdminLog[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(20);
  const [total, setTotal] = useState(0);
  const [selectedLog, setSelectedLog] = useState<AdminLog | null>(null);
  const [showModal, setShowModal] = useState(false);

  const loadLogs = async () => {
    setLoading(true);
    setError(null);

    const response = await adminService.getAdminLogs({
      page,
      limit,
    });

    if (response.success && response.data) {
      setLogs(response.data.logs);
      setTotal(response.data.total);
    } else {
      setError(response.error ?? "Falha ao carregar logs");
    }
    setLoading(false);
  };

  useEffect(() => {
    loadLogs();
  }, [page, limit]);

  const totalPages = Math.ceil(total / limit);

  const getActionBadgeColor = (acao: string) => {
    if (acao.includes("CRIAR")) return "bg-green-100 text-green-800";
    if (acao.includes("BLOQUEAR")) return "bg-red-100 text-red-800";
    if (acao.includes("DESBLOQUEAR")) return "bg-blue-100 text-blue-800";
    if (acao.includes("APROVAR")) return "bg-green-100 text-green-800";
    if (acao.includes("REJEITAR")) return "bg-red-100 text-red-800";
    if (acao.includes("REMOVER")) return "bg-red-100 text-red-800";
    return "bg-gray-100 text-gray-800";
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-[#2c5530]">
          Logs Administrativos
        </h1>
        <p className="text-gray-600 mt-2">
          Rastreamento completo de todas as ações administrativas
        </p>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
          {error}
        </div>
      )}

      {/* Filters */}
      <div className="bg-white rounded-lg shadow-sm p-4">
        <div className="flex items-center justify-between">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Por página
            </label>
            <select
              value={limit}
              onChange={(e) => {
                setLimit(Number(e.target.value));
                setPage(1);
              }}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#2c5530] focus:border-transparent"
            >
              <option value={10}>10</option>
              <option value={20}>20</option>
              <option value={50}>50</option>
              <option value={100}>100</option>
            </select>
          </div>
          <div className="text-sm text-gray-600">
            Total de registros: {total}
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        {loading ? (
          <div className="flex items-center justify-center p-8">
            <div className="text-gray-500">Carregando...</div>
          </div>
        ) : logs.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase">
                    Data & Hora
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase">
                    Admin
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase">
                    Ação
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase">
                    Descrição
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase">
                    IP
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-700 uppercase">
                    Detalhes
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {logs.map((log) => (
                  <tr
                    key={log.id}
                    className="hover:bg-gray-50 transition-colors"
                  >
                    <td className="px-6 py-4 text-sm text-gray-900 whitespace-nowrap">
                      {formatDate(log.createdAt)}
                    </td>
                    <td className="px-6 py-4 text-sm">
                      <div>
                        <p className="font-medium text-gray-900">
                          {log.Admin?.nome || "Desconhecido"}
                        </p>
                        <p className="text-xs text-gray-500">
                          {log.Admin?.email}
                        </p>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm">
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-medium ${getActionBadgeColor(
                          log.acao,
                        )}`}
                      >
                        {log.acao}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600">
                      {log.descricao}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600 font-mono">
                      {log.ip_address}
                    </td>
                    <td className="px-6 py-4 text-sm text-right">
                      <button
                        onClick={() => {
                          setSelectedLog(log);
                          setShowModal(true);
                        }}
                        className="text-blue-600 hover:text-blue-800 font-medium"
                      >
                        Ver
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="flex items-center justify-center p-8">
            <div className="text-gray-500">Nenhum log encontrado</div>
          </div>
        )}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-center items-center gap-2">
          <button
            onClick={() => setPage(Math.max(1, page - 1))}
            disabled={page === 1}
            className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50"
          >
            Anterior
          </button>

          <div className="flex gap-1">
            {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
              const p = Math.max(1, page - 2) + i;
              return p <= totalPages ? (
                <button
                  key={p}
                  onClick={() => setPage(p)}
                  className={`px-3 py-2 rounded-lg ${
                    page === p
                      ? "bg-[#2c5530] text-white"
                      : "border border-gray-300 hover:bg-gray-50"
                  }`}
                >
                  {p}
                </button>
              ) : null;
            })}
          </div>

          <button
            onClick={() => setPage(Math.min(totalPages, page + 1))}
            disabled={page === totalPages}
            className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50"
          >
            Próximo
          </button>
        </div>
      )}

      {/* Log Detail Modal */}
      {showModal && selectedLog && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-lg max-w-md w-full max-h-96 overflow-y-auto">
            <div className="p-6 border-b border-gray-200 flex justify-between items-center">
              <h2 className="text-xl font-bold text-gray-900">
                Detalhes do Log
              </h2>
              <button
                onClick={() => setShowModal(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                ✕
              </button>
            </div>

            <div className="p-6 space-y-4">
              <div>
                <p className="text-xs font-medium text-gray-500 uppercase">
                  Ação
                </p>
                <p className="text-gray-900 font-medium">{selectedLog.acao}</p>
              </div>

              <div>
                <p className="text-xs font-medium text-gray-500 uppercase">
                  Tipo de Alvo
                </p>
                <p className="text-gray-900">{selectedLog.tipo_alvo}</p>
              </div>

              <div>
                <p className="text-xs font-medium text-gray-500 uppercase">
                  ID do Alvo
                </p>
                <p className="text-gray-900">{selectedLog.id_alvo}</p>
              </div>

              <div>
                <p className="text-xs font-medium text-gray-500 uppercase">
                  Descrição
                </p>
                <p className="text-gray-900">{selectedLog.descricao}</p>
              </div>

              <div>
                <p className="text-xs font-medium text-gray-500 uppercase">
                  Admin
                </p>
                <p className="text-gray-900">
                  {selectedLog.Admin?.nome} ({selectedLog.Admin?.email})
                </p>
              </div>

              <div>
                <p className="text-xs font-medium text-gray-500 uppercase">
                  IP
                </p>
                <p className="text-gray-900 font-mono">
                  {selectedLog.ip_address}
                </p>
              </div>

              <div>
                <p className="text-xs font-medium text-gray-500 uppercase">
                  Data & Hora
                </p>
                <p className="text-gray-900">
                  {formatDateTime(selectedLog.createdAt)}
                </p>
              </div>

              {selectedLog.detalhes && (
                <div>
                  <p className="text-xs font-medium text-gray-500 uppercase">
                    Detalhes JSON
                  </p>
                  <pre className="text-xs bg-gray-100 p-2 rounded text-gray-900 overflow-auto max-h-32">
                    {selectedLog.detalhes}
                  </pre>
                </div>
              )}
            </div>

            <div className="p-6 border-t border-gray-200">
              <button
                onClick={() => setShowModal(false)}
                className="w-full bg-gray-200 hover:bg-gray-300 text-gray-800 font-medium py-2 rounded-lg transition-colors"
              >
                Fechar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
