import { useState } from "react";
import {
  Plus,
  Pencil,
  Trash2,
  X,
  Package,
  Search,
  FileText,
  UploadCloud,
} from "lucide-react";
import { FarmaciaLayout } from "../../layouts/FarmaciaLayout";
import type { ProdutoFarmacia } from "../../types/farmacia.types";

const produtosMock: ProdutoFarmacia[] = [
  {
    id: "1",
    nome: "Paracetamol 500mg",
    preco: 600,
    descricao: "Analgésico e antipirético para dores leves e febre.",
    imagem: "",
    precisaReceita: false,
    estoque: 120,
    categoria: "Analgésico",
  },
  {
    id: "2",
    nome: "Amoxicilina 875mg",
    preco: 3500,
    descricao: "Antibiótico de largo espectro para infecções bacterianas.",
    imagem: "",
    precisaReceita: true,
    estoque: 45,
    categoria: "Antibiótico",
  },
  {
    id: "3",
    nome: "Ibuprofeno 400mg",
    preco: 700,
    descricao: "Anti-inflamatório, analgésico e antipirético.",
    imagem: "",
    precisaReceita: false,
    estoque: 80,
    categoria: "Anti-inflamatório",
  },
  {
    id: "4",
    nome: "Omeprazol 20mg",
    preco: 900,
    descricao: "Protetor gástrico para refluxo e úlceras.",
    imagem: "",
    precisaReceita: true,
    estoque: 60,
    categoria: "Gastro",
  },
  {
    id: "5",
    nome: "Loratadina 10mg",
    preco: 500,
    descricao: "Anti-histamínico para alergias e rinite.",
    imagem: "",
    precisaReceita: false,
    estoque: 95,
    categoria: "Antialérgico",
  },
];

const emptyForm = {
  nome: "",
  preco: "",
  descricao: "",
  imagem: "",
  precisaReceita: false,
  estoque: "",
  categoria: "",
};

export function FarmaciaProdutos() {
  const [produtos, setProdutos] = useState<ProdutoFarmacia[]>(produtosMock);
  const [search, setSearch] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState(emptyForm);
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);

  const filtered = produtos.filter((p) =>
    p.nome.toLowerCase().includes(search.toLowerCase()) ||
    p.categoria.toLowerCase().includes(search.toLowerCase())
  );

  function openAdd() {
    setEditingId(null);
    setForm(emptyForm);
    setShowModal(true);
  }

  function openEdit(produto: ProdutoFarmacia) {
    setEditingId(produto.id);
    setForm({
      nome: produto.nome,
      preco: String(produto.preco),
      descricao: produto.descricao,
      imagem: produto.imagem,
      precisaReceita: produto.precisaReceita,
      estoque: String(produto.estoque),
      categoria: produto.categoria,
    });
    setShowModal(true);
  }

  function handleSave() {
    if (!form.nome.trim() || !form.preco || !form.categoria.trim()) return;

    if (editingId) {
      setProdutos((prev) =>
        prev.map((p) =>
          p.id === editingId
            ? {
                ...p,
                nome: form.nome,
                preco: Number(form.preco),
                descricao: form.descricao,
                imagem: form.imagem,
                precisaReceita: form.precisaReceita,
                estoque: Number(form.estoque),
                categoria: form.categoria,
              }
            : p
        )
      );
    } else {
      const novo: ProdutoFarmacia = {
        id: String(Date.now()),
        nome: form.nome,
        preco: Number(form.preco),
        descricao: form.descricao,
        imagem: form.imagem,
        precisaReceita: form.precisaReceita,
        estoque: Number(form.estoque),
        categoria: form.categoria,
      };
      setProdutos((prev) => [novo, ...prev]);
    }
    setShowModal(false);
  }

  function handleDelete(id: string) {
    setProdutos((prev) => prev.filter((p) => p.id !== id));
    setConfirmDeleteId(null);
  }

  return (
    <FarmaciaLayout>
      <div className="twala-page-enter p-6 lg:p-8 space-y-6" style={{ backgroundColor: "#faf7f2", minHeight: "100vh" }}>
        {/* Cabeçalho */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 style={{ fontFamily: "'Poppins', sans-serif", fontWeight: 600, fontSize: "clamp(1.4rem, 3vw, 1.8rem)", color: "#2c3e2c", marginBottom: 4 }}>
              Produtos
            </h1>
            <div style={{ width: 50, height: 3, background: "linear-gradient(90deg, #2c5530, #c7a252)", borderRadius: 2, marginBottom: 4 }} />
            <p style={{ fontFamily: "'Roboto', sans-serif", color: "#4a7856", fontSize: 13 }}>
              {produtos.length} produto(s) cadastrado(s)
            </p>
          </div>
          <button
            onClick={openAdd}
            className="twala-btn-primary flex items-center gap-2"
          >
            <Plus style={{ width: 16, height: 16 }} />
            Adicionar Produto
          </button>
        </div>

        {/* Barra de busca */}
        <div className="relative max-w-md">
          <Search style={{ position: "absolute", left: 14, top: "50%", transform: "translateY(-50%)", width: 16, height: 16, color: "#4a7856" }} />
          <input
            type="text"
            placeholder="Buscar por nome ou categoria..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-10 pr-4 py-2.5 border border-gray-200 rounded-xl w-full text-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent bg-white"
          />
        </div>

        {/* Tabela / Grid de produtos */}
        {filtered.length === 0 ? (
          <div className="bg-white rounded-2xl shadow-md p-12 text-center">
            <Package className="w-12 h-12 text-gray-300 mx-auto mb-3" />
            <p className="text-gray-500 font-medium">Nenhum produto encontrado</p>
            <p className="text-sm text-gray-400 mt-1">
              Tente ajustar a busca ou adicione um novo produto
            </p>
          </div>
        ) : (
          <div className="bg-white rounded-2xl shadow-md overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-gray-50 border-b border-gray-100">
                    <th className="text-left px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                      Produto
                    </th>
                    <th className="text-left px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                      Categoria
                    </th>
                    <th className="text-left px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                      Preço
                    </th>
                    <th className="text-left px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                      Estoque
                    </th>
                    <th className="text-left px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                      Receita
                    </th>
                    <th className="text-right px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                      Ações
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {filtered.map((produto) => (
                    <tr
                      key={produto.id}
                      className="hover:bg-gray-50 transition-colors"
                    >
                      <td className="px-6 py-4">
                        <div className="flex items-center space-x-3">
                          <div className="w-10 h-10 rounded-xl bg-green-50 flex items-center justify-center flex-shrink-0">
                            <Package className="w-5 h-5 text-green-600" />
                          </div>
                          <div>
                            <p className="font-semibold text-gray-900 text-sm">
                              {produto.nome}
                            </p>
                            <p className="text-xs text-gray-400 truncate max-w-[200px]">
                              {produto.descricao}
                            </p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className="text-xs bg-blue-50 text-blue-700 px-2.5 py-1 rounded-full font-medium">
                          {produto.categoria}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <p className="font-bold text-gray-900">
                          {produto.preco.toLocaleString()} Kz
                        </p>
                      </td>
                      <td className="px-6 py-4">
                        <span
                          className={`text-sm font-medium ${produto.estoque < 20 ? "text-red-600" : "text-gray-700"}`}
                        >
                          {produto.estoque} un.
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        {produto.precisaReceita ? (
                          <span className="flex items-center space-x-1 text-xs text-orange-600 bg-orange-50 px-2.5 py-1 rounded-full font-medium w-fit">
                            <FileText className="w-3 h-3" />
                            <span>Necessária</span>
                          </span>
                        ) : (
                          <span className="text-xs text-green-600 bg-green-50 px-2.5 py-1 rounded-full font-medium">
                            Não precisa
                          </span>
                        )}
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center justify-end space-x-2">
                          <button
                            onClick={() => openEdit(produto)}
                            className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition"
                            title="Editar"
                          >
                            <Pencil className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => setConfirmDeleteId(produto.id)}
                            className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition"
                            title="Remover"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>

      {/* Modal Adicionar/Editar */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between p-6 border-b border-gray-100">
              <h2 className="text-xl font-bold text-gray-900">
                {editingId ? "Editar Produto" : "Novo Produto"}
              </h2>
              <button
                onClick={() => setShowModal(false)}
                className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 space-y-5">
              {/* Nome */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Nome do Medicamento *
                </label>
                <input
                  type="text"
                  value={form.nome}
                  onChange={(e) => setForm({ ...form, nome: e.target.value })}
                  placeholder="Ex: Paracetamol 500mg"
                  className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
                />
              </div>

              {/* Categoria e Preço em linha */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Categoria *
                  </label>
                  <input
                    type="text"
                    value={form.categoria}
                    onChange={(e) =>
                      setForm({ ...form, categoria: e.target.value })
                    }
                    placeholder="Ex: Analgésico"
                    className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Preço (Kz) *
                  </label>
                  <input
                    type="number"
                    value={form.preco}
                    onChange={(e) => setForm({ ...form, preco: e.target.value })}
                    placeholder="0"
                    min="0"
                    className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
                  />
                </div>
              </div>

              {/* Estoque */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Estoque (unidades)
                </label>
                <input
                  type="number"
                  value={form.estoque}
                  onChange={(e) =>
                    setForm({ ...form, estoque: e.target.value })
                  }
                  placeholder="0"
                  min="0"
                  className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
                />
              </div>

              {/* Descrição */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Descrição
                </label>
                <textarea
                  value={form.descricao}
                  onChange={(e) =>
                    setForm({ ...form, descricao: e.target.value })
                  }
                  placeholder="Descreva o medicamento..."
                  rows={3}
                  className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-green-500 resize-none"
                />
              </div>

              {/* Upload de imagem */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Imagem do Produto
                </label>
                <label className="flex flex-col items-center justify-center border-2 border-dashed border-gray-200 rounded-xl p-6 cursor-pointer hover:border-green-400 hover:bg-green-50 transition">
                  <UploadCloud className="w-8 h-8 text-gray-300 mb-2" />
                  <p className="text-sm text-gray-500">
                    Clique para fazer upload
                  </p>
                  <p className="text-xs text-gray-400 mt-1">PNG, JPG até 5MB</p>
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) {
                        const url = URL.createObjectURL(file);
                        setForm({ ...form, imagem: url });
                      }
                    }}
                  />
                </label>
                {form.imagem && (
                  <p className="text-xs text-green-600 mt-1">
                    Imagem selecionada
                  </p>
                )}
              </div>

              {/* Checkbox receita */}
              <div className="flex items-center space-x-3 p-4 bg-orange-50 rounded-xl border border-orange-100">
                <input
                  type="checkbox"
                  id="precisaReceita"
                  checked={form.precisaReceita}
                  onChange={(e) =>
                    setForm({ ...form, precisaReceita: e.target.checked })
                  }
                  className="w-4 h-4 text-green-600 rounded accent-green-600 cursor-pointer"
                />
                <label
                  htmlFor="precisaReceita"
                  className="text-sm font-medium text-orange-800 cursor-pointer"
                >
                  Este medicamento precisa de receita médica
                </label>
              </div>
            </div>

            <div className="p-6 border-t border-gray-100 flex space-x-3">
              <button
                onClick={() => setShowModal(false)}
                className="flex-1 border border-gray-200 text-gray-700 py-2.5 rounded-xl font-medium hover:bg-gray-50 transition"
              >
                Cancelar
              </button>
              <button
                onClick={handleSave}
                disabled={!form.nome.trim() || !form.preco || !form.categoria.trim()}
                className="flex-1 bg-green-600 hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed text-white py-2.5 rounded-xl font-medium transition shadow-md shadow-green-200"
              >
                {editingId ? "Salvar Alterações" : "Adicionar Produto"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal Confirmar Exclusão */}
      {confirmDeleteId && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-sm p-6">
            <div className="flex items-center justify-center w-14 h-14 bg-red-100 rounded-full mx-auto mb-4">
              <Trash2 className="w-7 h-7 text-red-600" />
            </div>
            <h3 className="text-lg font-bold text-gray-900 text-center mb-2">
              Remover Produto
            </h3>
            <p className="text-sm text-gray-500 text-center mb-6">
              Tem certeza que deseja remover este produto? Esta ação não pode ser
              desfeita.
            </p>
            <div className="flex space-x-3">
              <button
                onClick={() => setConfirmDeleteId(null)}
                className="flex-1 border border-gray-200 text-gray-700 py-2.5 rounded-xl font-medium hover:bg-gray-50 transition"
              >
                Cancelar
              </button>
              <button
                onClick={() => handleDelete(confirmDeleteId)}
                className="flex-1 bg-red-600 hover:bg-red-700 text-white py-2.5 rounded-xl font-medium transition"
              >
                Remover
              </button>
            </div>
          </div>
        </div>
      )}
    </FarmaciaLayout>
  );
}
