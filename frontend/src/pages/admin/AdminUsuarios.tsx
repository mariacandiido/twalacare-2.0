import { useEffect, useState } from "react";
import { adminService } from "../../services/adminService";
import { Edit, Lock, Unlock, Trash2, Eye } from "lucide-react";

interface Usuario {
  id: number;
  nome: string;
  email: string;
  tipo: string;
  status: string;
  telefone?: string;
  createdAt?: string;
}

export function AdminUsuarios() {
  const [usuarios, setUsuarios] = useState<Usuario[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(20);
  const [total, setTotal] = useState(0);
  const [tipo, setTipo] = useState<string>("");
  const [status_filter, setStatusFilter] = useState<string>("");
  const [selectedUser, setSelectedUser] = useState<Usuario | null>(null);
  const [showModal, setShowModal] = useState(false);

  const loadUsuarios = async () => {
    setLoading(true);
    setError(null);

    const response = await adminService.getAllUsers({
      page,
      limit,
      tipo: tipo || undefined,
      status: status_filter || undefined,
    });

    if (response.success && response.data) {
      setUsuarios(response.data.users);
      setTotal(response.data.total);
    } else {
      setError(response.error ?? "Falha ao carregar usuários");
    }
    setLoading(false);
  };

  useEffect(() => {
    loadUsuarios();
  }, [page, limit, tipo, status_filter]);

  const handleBlockUser = async (id: number, username: string) => {
    if (window.confirm(`Tem certeza que deseja bloquear ${username}?`)) {
      const response = await adminService.blockUser(id);
      if (response.success) {
        alert("Usuário bloqueado com sucesso");
        loadUsuarios();
      } else {
        alert(response.error ?? "Erro ao bloquear usuário");
      }
    }
  };

  const handleUnblockUser = async (id: number, username: string) => {
    if (window.confirm(`Tem certeza que deseja desbloquear ${username}?`)) {
      const response = await adminService.unblockUser(id);
      if (response.success) {
        alert("Usuário desbloqueado com sucesso");
        loadUsuarios();
      } else {
        alert(response.error ?? "Erro ao desbloquear usuário");
      }
    }
  };

  const totalPages = Math.ceil(total / limit);

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-[#2c5530]">Gerenciar Usuários</h1>

      {/* Filters */}
      <div className="bg-white rounded-lg shadow-sm p-4 space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Tipo
            </label>
            <select
              value={tipo}
              onChange={(e) => {
                setTipo(e.target.value);
                setPage(1);
              }}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#2c5530] focus:border-transparent"
            >
              <option value="">Todos</option>
              <option value="CLIENTE">Cliente</option>
              <option value="FARMACIA">Farmácia</option>
              <option value="ENTREGADOR">Entregador</option>
              <option value="ADMIN">Admin</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Status
            </label>
            <select
              value={status_filter}
              onChange={(e) => {
                setStatusFilter(e.target.value);
                setPage(1);
              }}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#2c5530] focus:border-transparent"
            >
              <option value="">Todos</option>
              <option value="ATIVO">Ativo</option>
              <option value="INATIVO">Inativo</option>
              <option value="SUSPENSO">Suspenso</option>
              <option value="PENDENTE_APROVACAO">Pendente</option>
            </select>
          </div>

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
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#2c5530] focus:border-transparent"
            >
              <option value={10}>10</option>
              <option value={20}>20</option>
              <option value={50}>50</option>
              <option value={100}>100</option>
            </select>
          </div>
        </div>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
          {error}
        </div>
      )}

      {/* Table */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        {loading ? (
          <div className="flex items-center justify-center p-8">
            <div className="text-gray-500">Carregando...</div>
          </div>
        ) : usuarios.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase">
                    Nome
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase">
                    Email
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase">
                    Tipo
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase">
                    Status
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-700 uppercase">
                    Ações
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {usuarios.map((user) => (
                  <tr
                    key={user.id}
                    className="hover:bg-gray-50 transition-colors"
                  >
                    <td className="px-6 py-4 text-sm text-gray-900">
                      {user.nome}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600">
                      {user.email}
                    </td>
                    <td className="px-6 py-4 text-sm">
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-medium ${
                          user.tipo === "ADMIN"
                            ? "bg-purple-100 text-purple-800"
                            : user.tipo === "FARMACIA"
                              ? "bg-blue-100 text-blue-800"
                              : user.tipo === "ENTREGADOR"
                                ? "bg-orange-100 text-orange-800"
                                : "bg-gray-100 text-gray-800"
                        }`}
                      >
                        {user.tipo}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm">
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-medium ${
                          user.status === "ATIVO"
                            ? "bg-green-100 text-green-800"
                            : user.status === "SUSPENSO"
                              ? "bg-yellow-100 text-yellow-800"
                              : user.status === "INATIVO"
                                ? "bg-red-100 text-red-800"
                                : "bg-gray-100 text-gray-800"
                        }`}
                      >
                        {user.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-right">
                      <div className="flex justify-end gap-2">
                        <button
                          onClick={() => {
                            setSelectedUser(user);
                            setShowModal(true);
                          }}
                          className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                          title="Ver detalhes"
                        >
                          <Eye size={18} />
                        </button>
                        {user.status === "SUSPENSO" ? (
                          <button
                            onClick={() =>
                              handleUnblockUser(user.id, user.nome)
                            }
                            className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                            title="Desbloquear"
                          >
                            <Unlock size={18} />
                          </button>
                        ) : user.status !== "INATIVO" ? (
                          <button
                            onClick={() => handleBlockUser(user.id, user.nome)}
                            className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                            title="Bloquear"
                          >
                            <Lock size={18} />
                          </button>
                        ) : null}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="flex items-center justify-center p-8">
            <div className="text-gray-500">Nenhum usuário encontrado</div>
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

          <span className="text-sm text-gray-600 ml-4">
            Página {page} de {totalPages} (Total: {total})
          </span>
        </div>
      )}

      {/* User Detail Modal */}
      {showModal && selectedUser && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-lg max-w-md w-full">
            <div className="p-6 border-b border-gray-200 flex justify-between items-center">
              <h2 className="text-xl font-bold text-gray-900">
                Detalhes do Usuário
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
                  Nome
                </p>
                <p className="text-gray-900 font-medium">{selectedUser.nome}</p>
              </div>

              <div>
                <p className="text-xs font-medium text-gray-500 uppercase">
                  Email
                </p>
                <p className="text-gray-900">{selectedUser.email}</p>
              </div>

              <div>
                <p className="text-xs font-medium text-gray-500 uppercase">
                  Tipo
                </p>
                <p className="text-gray-900">{selectedUser.tipo}</p>
              </div>

              <div>
                <p className="text-xs font-medium text-gray-500 uppercase">
                  Status
                </p>
                <p className="text-gray-900">{selectedUser.status}</p>
              </div>

              {selectedUser.telefone && (
                <div>
                  <p className="text-xs font-medium text-gray-500 uppercase">
                    Telefone
                  </p>
                  <p className="text-gray-900">{selectedUser.telefone}</p>
                </div>
              )}

              {selectedUser.createdAt && (
                <div>
                  <p className="text-xs font-medium text-gray-500 uppercase">
                    Registrado em
                  </p>
                  <p className="text-gray-900">
                    {new Date(selectedUser.createdAt).toLocaleDateString(
                      "pt-AO",
                    )}
                  </p>
                </div>
              )}
            </div>

            <div className="p-6 border-t border-gray-200 flex gap-2">
              {selectedUser.status === "SUSPENSO" ? (
                <button
                  onClick={() => {
                    handleUnblockUser(selectedUser.id, selectedUser.nome);
                    setShowModal(false);
                  }}
                  className="flex-1 bg-green-600 hover:bg-green-700 text-white font-medium py-2 rounded-lg transition-colors"
                >
                  Desbloquear
                </button>
              ) : selectedUser.status !== "INATIVO" ? (
                <button
                  onClick={() => {
                    handleBlockUser(selectedUser.id, selectedUser.nome);
                    setShowModal(false);
                  }}
                  className="flex-1 bg-red-600 hover:bg-red-700 text-white font-medium py-2 rounded-lg transition-colors"
                >
                  Bloquear
                </button>
              ) : null}

              <button
                onClick={() => setShowModal(false)}
                className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-800 font-medium py-2 rounded-lg transition-colors"
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
