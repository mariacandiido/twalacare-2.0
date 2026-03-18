// Página de Receitas Enviadas pelo Cliente
// Mostra todas as receitas médicas que o cliente enviou para as farmácias,
// com o estado de cada uma (pendente, aprovada ou rejeitada).

import { useState } from "react";
import {
  FileText,     // ícone de documento/receita
  Building2,    // ícone de farmácia
  Calendar,     // ícone de data
  Search,       // ícone de pesquisa
  CheckCircle2, // ícone de aprovada
  Clock,        // ícone de pendente
  XCircle,      // ícone de rejeitada
  ImageOff,     // ícone de fallback quando a imagem falha
  Pill,         // ícone de medicamento
  TrendingUp,   // ícone usado nas observações
} from "lucide-react";

// -------------------------------------------------------
// TIPOS LOCAIS
// -------------------------------------------------------

// Os três estados possíveis de uma receita médica
type StatusReceita = "pendente" | "aprovada" | "rejeitada";

// Estrutura de dados de uma receita enviada pelo cliente
interface Receita {
  id: string;                    // identificador único da receita
  imagemUrl: string;             // URL da foto da receita tirada pelo cliente
  medicamentoSolicitado: string; // medicamento pedido na receita
  farmaciaRecebeu: string;       // farmácia que recebeu e vai analisar a receita
  dataEnvio: string;             // data de envio no formato "AAAA-MM-DD"
  status: StatusReceita;         // estado atual da análise da receita
  observacao?: string;           // mensagem opcional da farmácia ao cliente
}

// -------------------------------------------------------
// DADOS DE EXEMPLO (mock)
// Substituir por chamada à API quando o backend estiver pronto
// -------------------------------------------------------
const RECEITAS_MOCK: Receita[] = [
  {
    id: "R001",
    imagemUrl: "https://placehold.co/300x200/e8f5e9/16a34a?text=Receita+Médica",
    medicamentoSolicitado: "Amoxicilina 500mg",
    farmaciaRecebeu: "Farmácia Saúde",
    dataEnvio: "2025-02-08",
    status: "aprovada",
    observacao: "Receita válida. Medicamento disponível para levantamento.",
  },
  {
    id: "R002",
    imagemUrl: "https://placehold.co/300x200/e8f5e9/16a34a?text=Receita+Médica",
    medicamentoSolicitado: "Metformina 850mg",
    farmaciaRecebeu: "Farmácia Central",
    dataEnvio: "2025-02-20",
    status: "pendente",
  },
  {
    id: "R003",
    imagemUrl: "https://placehold.co/300x200/fef2f2/dc2626?text=Receita+Inválida",
    medicamentoSolicitado: "Tramadol 50mg",
    farmaciaRecebeu: "Farmácia Kilamba",
    dataEnvio: "2025-01-15",
    status: "rejeitada",
    observacao: "Receita ilegível. Por favor envie uma imagem mais nítida.",
  },
  {
    id: "R004",
    imagemUrl: "https://placehold.co/300x200/e8f5e9/16a34a?text=Receita+Médica",
    medicamentoSolicitado: "Insulina NPH 100UI/ml",
    farmaciaRecebeu: "Farmácia Talatona",
    dataEnvio: "2025-03-02",
    status: "pendente",
  },
  {
    id: "R005",
    imagemUrl: "https://placehold.co/300x200/e8f5e9/16a34a?text=Receita+Médica",
    medicamentoSolicitado: "Omeprazol 20mg",
    farmaciaRecebeu: "Farmácia Saúde",
    dataEnvio: "2025-03-07",
    status: "aprovada",
    observacao: "Aprovada. Entrega agendada para amanhã.",
  },
];

// -------------------------------------------------------
// CONFIGURAÇÃO DE BADGES DE ESTADO
// Cada estado tem: texto, ícone, classes de cor e cor do ponto
// -------------------------------------------------------
const STATUS_CONFIG: Record<
  StatusReceita,
  { label: string; icon: React.FC<{ className?: string }>; classes: string; dot: string }
> = {
  aprovada: {
    label: "Aprovada",
    icon: CheckCircle2,
    classes: "bg-green-100 text-green-700",
    dot: "bg-green-500",
  },
  pendente: {
    label: "Pendente",
    icon: Clock,
    classes: "bg-amber-100 text-amber-700",
    dot: "bg-amber-500",
  },
  rejeitada: {
    label: "Rejeitada",
    icon: XCircle,
    classes: "bg-red-100 text-red-600",
    dot: "bg-red-500",
  },
};

// -------------------------------------------------------
// COMPONENTE BadgeStatus
// Etiqueta colorida que mostra o estado atual da receita
// -------------------------------------------------------
function BadgeStatus({ status }: { status: StatusReceita }) {
  const cfg = STATUS_CONFIG[status];
  const Icon = cfg.icon;

  return (
    <span
      className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold ${cfg.classes}`}
    >
      <Icon className="w-3.5 h-3.5" />
      {cfg.label}
    </span>
  );
}

// -------------------------------------------------------
// COMPONENTE ImagemReceita
// Tenta mostrar a imagem da receita enviada pelo cliente.
// Se a imagem falhar (URL inválida ou sem conexão), mostra
// um placeholder com mensagem de erro amigável.
// -------------------------------------------------------
function ImagemReceita({ src, alt }: { src: string; alt: string }) {
  // Estado para controlar se a imagem falhou ao carregar
  const [erro, setErro] = useState(false);

  // Se houve erro ao carregar a imagem, mostra o placeholder
  if (erro) {
    return (
      <div className="w-full h-36 bg-gray-100 rounded-xl flex flex-col items-center justify-center gap-2 text-gray-400">
        <ImageOff className="w-8 h-8" />
        <span className="text-xs">Imagem indisponível</span>
      </div>
    );
  }

  // Caso normal: mostra a imagem e regista o handler de erro
  return (
    <img
      src={src}
      alt={alt}
      onError={() => setErro(true)} // activa o fallback se a imagem não carregar
      className="w-full h-36 object-cover rounded-xl border border-gray-200"
    />
  );
}

// -------------------------------------------------------
// COMPONENTE PRINCIPAL — ReceitasEnviadas
// -------------------------------------------------------
export function ReceitasEnviadas() {
  // Estado do campo de pesquisa livre (por medicamento, farmácia ou data)
  const [busca, setBusca] = useState("");

  // Estado do filtro por estado da receita (padrão: mostrar todas)
  const [filtroStatus, setFiltroStatus] = useState<StatusReceita | "todos">("todos");

  // Filtra as receitas com base no texto de pesquisa e no estado selecionado
  const receitasFiltradas = RECEITAS_MOCK.filter((r) => {
    const termoBusca = busca.toLowerCase();

    // Verifica se algum campo da receita contém o termo pesquisado
    const matchBusca =
      r.medicamentoSolicitado.toLowerCase().includes(termoBusca) ||
      r.farmaciaRecebeu.toLowerCase().includes(termoBusca) ||
      r.dataEnvio.includes(termoBusca);

    // Verifica se o estado corresponde ao filtro selecionado
    const matchStatus =
      filtroStatus === "todos" || r.status === filtroStatus;

    return matchBusca && matchStatus;
  });

  // Contagem por estado para os cards de resumo no topo
  const totalAprovadas = RECEITAS_MOCK.filter((r) => r.status === "aprovada").length;
  const totalPendentes = RECEITAS_MOCK.filter((r) => r.status === "pendente").length;
  const totalRejeitadas = RECEITAS_MOCK.filter((r) => r.status === "rejeitada").length;

  // Formata a data para o formato angolano: "08 de fevereiro de 2025"
  const formatarData = (data: string) =>
    new Date(data).toLocaleDateString("pt-AO", {
      day: "2-digit",
      month: "long",
      year: "numeric",
    });

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto space-y-6">

        {/* ---- Cabeçalho da página ---- */}
        <div>
          <h1 className="text-2xl lg:text-3xl font-bold text-gray-900">
            Receitas Enviadas
          </h1>
          <p className="text-gray-500 mt-1 text-sm">
            Acompanhe o estado das suas receitas médicas enviadas
          </p>
        </div>

        {/* ---- Cards de resumo por estado ---- */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">

          {/* Card: receitas aprovadas */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5 flex items-center gap-4">
            <div className="w-12 h-12 bg-green-50 rounded-xl flex items-center justify-center flex-shrink-0">
              <CheckCircle2 className="w-6 h-6 text-green-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">{totalAprovadas}</p>
              <p className="text-xs text-gray-500">Aprovadas</p>
            </div>
          </div>

          {/* Card: receitas aguardando análise */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5 flex items-center gap-4">
            <div className="w-12 h-12 bg-amber-50 rounded-xl flex items-center justify-center flex-shrink-0">
              <Clock className="w-6 h-6 text-amber-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">{totalPendentes}</p>
              <p className="text-xs text-gray-500">Pendentes</p>
            </div>
          </div>

          {/* Card: receitas rejeitadas pela farmácia */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5 flex items-center gap-4">
            <div className="w-12 h-12 bg-red-50 rounded-xl flex items-center justify-center flex-shrink-0">
              <XCircle className="w-6 h-6 text-red-500" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">{totalRejeitadas}</p>
              <p className="text-xs text-gray-500">Rejeitadas</p>
            </div>
          </div>
        </div>

        {/* ---- Barra de filtros ---- */}
        <div className="flex flex-col sm:flex-row gap-3">

          {/* Campo de pesquisa por texto livre */}
          <div className="relative flex-1">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Pesquisar por medicamento, farmácia ou data..."
              value={busca}
              onChange={(e) => setBusca(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent shadow-sm"
            />
          </div>

          {/* Selector de filtro por estado da receita */}
          <select
            value={filtroStatus}
            onChange={(e) =>
              setFiltroStatus(e.target.value as StatusReceita | "todos")
            }
            className="px-4 py-2.5 rounded-xl border border-gray-200 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-green-500 shadow-sm"
          >
            <option value="todos">Todos os estados</option>
            <option value="pendente">Pendente</option>
            <option value="aprovada">Aprovada</option>
            <option value="rejeitada">Rejeitada</option>
          </select>
        </div>

        {/* ---- Grelha de receitas ou mensagem de vazio ---- */}
        {receitasFiltradas.length === 0 ? (
          // Mensagem exibida quando não há receitas a mostrar
          <div className="flex flex-col items-center justify-center py-16 text-center bg-white rounded-2xl shadow-sm border border-gray-100">
            <div className="w-20 h-20 bg-gray-100 rounded-2xl flex items-center justify-center mb-4">
              <FileText className="w-10 h-10 text-gray-300" />
            </div>
            <p className="text-gray-500 font-medium">Nenhuma receita encontrada</p>
            <p className="text-gray-400 text-sm mt-1">
              {busca || filtroStatus !== "todos"
                ? "Tente ajustar os filtros de pesquisa."
                : "As suas receitas enviadas aparecerão aqui."}
            </p>
          </div>
        ) : (
          // Grelha de 2 colunas em ecrãs médios e grandes
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {receitasFiltradas.map((receita) => (
              <div
                key={receita.id}
                className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden flex flex-col"
              >
                {/* Imagem da receita com fallback automático */}
                <div className="p-4 pb-2">
                  <ImagemReceita
                    src={receita.imagemUrl}
                    alt={`Receita ${receita.id}`}
                  />
                </div>

                {/* Bloco de informações da receita */}
                <div className="px-4 py-3 flex-1 space-y-3">

                  {/* Medicamento pedido na receita */}
                  <div className="flex items-start gap-2">
                    <Pill className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                    <div>
                      <p className="text-xs text-gray-400 uppercase tracking-wide font-medium">
                        Medicamento solicitado
                      </p>
                      <p className="font-semibold text-gray-900 text-sm">
                        {receita.medicamentoSolicitado}
                      </p>
                    </div>
                  </div>

                  {/* Farmácia que recebeu a receita */}
                  <div className="flex items-start gap-2">
                    <Building2 className="w-4 h-4 text-gray-400 mt-0.5 flex-shrink-0" />
                    <div>
                      <p className="text-xs text-gray-400 uppercase tracking-wide font-medium">
                        Farmácia
                      </p>
                      <p className="text-sm text-gray-700">{receita.farmaciaRecebeu}</p>
                    </div>
                  </div>

                  {/* Data de envio e referência */}
                  <div className="flex items-center gap-2 text-xs text-gray-400">
                    <Calendar className="w-3.5 h-3.5" />
                    <span>Enviada em {formatarData(receita.dataEnvio)}</span>
                    <span className="text-gray-300">·</span>
                    <span className="font-mono">#{receita.id}</span>
                  </div>

                  {/* Observação da farmácia — só aparece quando existe.
                      A cor do bloco muda conforme o estado da receita */}
                  {receita.observacao && (
                    <div
                      className={`flex items-start gap-2 p-3 rounded-xl text-xs ${
                        receita.status === "rejeitada"
                          ? "bg-red-50 text-red-600"      // fundo vermelho se rejeitada
                          : receita.status === "aprovada"
                          ? "bg-green-50 text-green-700"  // fundo verde se aprovada
                          : "bg-gray-50 text-gray-600"    // fundo neutro se pendente
                      }`}
                    >
                      <TrendingUp className="w-3.5 h-3.5 mt-0.5 flex-shrink-0" />
                      <span>{receita.observacao}</span>
                    </div>
                  )}
                </div>

                {/* Rodapé do cartão com o badge de estado */}
                <div className="px-4 py-3 bg-gray-50 border-t border-gray-100 flex items-center justify-between">
                  <span className="text-xs text-gray-400">Estado da receita</span>
                  <BadgeStatus status={receita.status} />
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
