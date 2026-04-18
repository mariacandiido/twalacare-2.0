import { useEffect, useState } from "react";
import { adminService } from "../../services/adminService";
import { Trash2, Plus, Eye } from "lucide-react";

interface Admin {
  id: number;
  nome: string;
  email: string;
  status: string;
  createdAt: string;
}

export function AdminGerenciarAdmins() {
  const [admins, setAdmins] = useState<Admin[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(20);
  const [total, setTotal] = useState(0);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [selectedAdmin, setSelectedAdmin] = useState<Admin | null>(null);
  const [showDetailModal, setShowDetailModal] = useState(false);

  // Form state
  const [formData, setFormData] = useState({
    nome: "",
    email: "",
    password_hash: "",
  });
  const [formError, setFormError] = useState<string | null>(null);
  const [formLoading, setFormLoading] = useState(false);

  const loadAdmins = async () => {
    setLoading(true);
    setError(null);

    const response = await adminService.listAdmins({
      page,
      limit,
    });

    if (response.success && response.data) {
      setAdmins(response.data.admins);
      setTotal(response.data.total);
    } else {
      setError(response.error ?? "Falha ao carregar administradores");
    }
    setLoading(false);
  };

  useEffect(() => {
    loadAdmins();
  }, [page, limit]);

  const handleCreateAdmin = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);
    setFormLoading(true);

    if (!formData.nome || !formData.email || !formData.password_hash) {
      setFormError("Todos os campos são obrigatórios");
      setFormLoading(false);
      return;
    }

    const response = await adminService.createAdmin(formData);

    if (response.success) {
      alert("Administrador criado com sucesso!");
      setFormData({ nome: "", email: "", password_hash: "" });
      setShowCreateModal(false);
      loadAdmins();
    } else {
      setFormError(response.error ?? "Erro ao criar administrador");
    }

    setFormLoading(false);
  };

  const handleRemoveAdmin = async (id: number, nome: string) => {
    if (
      window.confirm(
        `Tem certeza que deseja remover ${nome} como administrador?`,
      )
    ) {
      const response = await adminService.removeAdmin(id);

      if (response.success) {
        alert("Administrador removido com sucesso");
        loadAdmins();
      } else {
        alert(response.error ?? "Erro ao remover administrador");
      }
    }
  };

  const totalPages = Math.ceil(total / limit);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-[#2c5530]">
            Gerenciar Admins
          </h1>
          <p className="text-gray-600 mt-2">
            Gerenciar permissões e acesso de administradores
          </p>
        </div>
        <button
          onClick={() => setShowCreateModal(true)}
          className="flex items-center gap-2 bg-[#2c5530] hover:bg-[#1f3d23] text-white px-4 py-2 rounded-lg transition-colors font-medium"
        >
          <Plus size={20} />
          Novo Admin
        </button>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
          {error}
        </div>
      )}

      {/* Filters */}
      <div className="bg-white rounded-lg shadow-sm p-4">
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
            className="w-32 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#2c5530] focus:border-transparent"
          >
            <option value={10}>10</option>
            <option value={20}>20</option>
            <option value={50}>50</option>
            <option value={100}>100</option>
          </select>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        {loading ? (
          <div className="flex items-center justify-center p-8">
            <div className="text-gray-500">Carregando...</div>
          </div>
        ) : admins.length > 0 ? (
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
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase">
                    Registrado em
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-700 uppercase">
                    Ações
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {admins.map((admin) => (
                  <tr
                    key={admin.id}
                    className="hover:bg-gray-50 transition-colors"
                  >
                    <td className="px-6 py-4 text-sm text-gray-900 font-medium">
                      {admin.nome}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600">
                      {admin.email}
                    </td>
                    <td className="px-6 py-4 text-sm">
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-medium ${
                          admin.status === "ATIVO"
                            ? "bg-green-100 text-green-800"
                            : "bg-red-100 text-red-800"
                        }`}
                      >
                        {admin.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600">
                      {new Date(admin.createdAt).toLocaleDateString("pt-AO")}
                    </td>
                    <td className="px-6 py-4 text-sm text-right">
                      <div className="flex justify-end gap-2">
                        <button
                          onClick={() => {
                            setSelectedAdmin(admin);
                            setShowDetailModal(true);
                          }}
                          className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                          title="Ver detalhes"
                        >
                          <Eye size={18} />
                        </button>
                        <button
                          onClick={() =>
                            handleRemoveAdmin(admin.id, admin.nome)
                          }
                          className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                          title="Remover admin"
                        >
                          <Trash2 size={18} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="flex items-center justify-center p-8">
            <div className="text-gray-500">Nenhum administrador encontrado</div>
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

      {/* Create Admin Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-lg max-w-md w-full">
            <div className="p-6 border-b border-gray-200 flex justify-between items-center">
              <h2 className="text-xl font-bold text-gray-900">
                Criar Novo Admin
              </h2>
              <button
                onClick={() => {
                  setShowCreateModal(false);
                  setFormError(null);
                }}
                className="text-gray-500 hover:text-gray-700"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateAdmin} className="p-6 space-y-4">
              {formError && (
                <div className="bg-red-50 border border-red-200 text-red-700 px-3 py-2 rounded-lg text-sm">
                  {formError}
                </div>
              )}

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Nome
                </label>
                <input
                  type="text"
                  value={formData.nome}
                  onChange={(e) =>
                    setFormData({ ...formData, nome: e.target.value })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#2c5530] focus:border-transparent"
                  placeholder="Ex: João Silva"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Email
                </label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) =>
                    setFormData({ ...formData, email: e.target.value })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#2c5530] focus:border-transparent"
                  placeholder="admin@example.com"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Senha
                </label>
                <input
                  type="password"
                  value={formData.password_hash}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      password_hash: e.target.value,
                    })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#2c5530] focus:border-transparent"
                  placeholder="••••••••"
                />
              </div>

              <div className="flex gap-2 pt-4">
                <button
                  type="submit"
                  disabled={formLoading}
                  className="flex-1 bg-[#2c5530] hover:bg-[#1f3d23] text-white font-medium py-2 rounded-lg transition-colors disabled:opacity-50"
                >
                  {formLoading ? "Criando..." : "Criar Admin"}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setShowCreateModal(false);
                    setFormError(null);
                  }}
                  className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-800 font-medium py-2 rounded-lg transition-colors"
                >
                  Cancelar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Admin Detail Modal */}
      {showDetailModal && selectedAdmin && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-lg max-w-md w-full">
            <div className="p-6 border-b border-gray-200 flex justify-between items-center">
              <h2 className="text-xl font-bold text-gray-900">
                Detalhes do Admin
              </h2>
              <button
                onClick={() => setShowDetailModal(false)}
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
                <p className="text-gray-900 font-medium">
                  {selectedAdmin.nome}
                </p>
              </div>

              <div>
                <p className="text-xs font-medium text-gray-500 uppercase">
                  Email
                </p>
                <p className="text-gray-900">{selectedAdmin.email}</p>
              </div>

              <div>
                <p className="text-xs font-medium text-gray-500 uppercase">
                  Status
                </p>
                <p className="text-gray-900">{selectedAdmin.status}</p>
              </div>

              <div>
                <p className="text-xs font-medium text-gray-500 uppercase">
                  Registrado em
                </p>
                <p className="text-gray-900">
                  {new Date(selectedAdmin.createdAt).toLocaleDateString(
                    "pt-AO",
                  )}
                </p>
              </div>
            </div>

            <div className="p-6 border-t border-gray-200 flex gap-2">
              <button
                onClick={() => {
                  handleRemoveAdmin(selectedAdmin.id, selectedAdmin.nome);
                  setShowDetailModal(false);
                }}
                className="flex-1 bg-red-600 hover:bg-red-700 text-white font-medium py-2 rounded-lg transition-colors"
              >
                Remover Admin
              </button>
              <button
                onClick={() => setShowDetailModal(false)}
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
