// Página de Acompanhamento de Entrega do Cliente.
// Mostra um mapa simulado com a rota da entrega, o estado actual e um contador regressivo.
// As fases avançam automaticamente para simular uma entrega em tempo real.

import { useState, useEffect, useRef } from "react";
import {
  Truck,
  CheckCircle2,
  Clock,
  MapPin,
  Package,
  Star,
  Phone,
  User,
} from "lucide-react";

// -------------------------------------------------------
// TIPOS E CONFIGURAÇÕES DAS FASES DE ENTREGA
// -------------------------------------------------------

type FaseEntrega =
  | "confirmado"    // pedido confirmado, aguarda preparação
  | "preparacao"    // farmácia está a preparar os medicamentos
  | "recolha"       // entregador está a recolher o pedido
  | "transito"      // pedido a caminho do cliente
  | "entregue";     // entrega concluída

// Ordem sequencial das fases (usada para calcular a próxima fase)
const ORDEM_FASES: FaseEntrega[] = [
  "confirmado",
  "preparacao",
  "recolha",
  "transito",
  "entregue",
];

// Configuração visual e textual de cada fase
const FASES: Record<
  FaseEntrega,
  { label: string; descricao: string; cor: string; bgCor: string }
> = {
  confirmado: {
    label: "Pedido Confirmado",
    descricao: "O seu pedido foi recebido e está a ser processado.",
    cor: "#2563eb",
    bgCor: "#eff6ff",
  },
  preparacao: {
    label: "Em Preparação",
    descricao: "A farmácia está a preparar os seus medicamentos.",
    cor: "#d97706",
    bgCor: "#fffbeb",
  },
  recolha: {
    label: "Recolha pelo Entregador",
    descricao: "O entregador está a recolher o seu pedido na farmácia.",
    cor: "#7c3aed",
    bgCor: "#f5f3ff",
  },
  transito: {
    label: "Em Trânsito",
    descricao: "O seu pedido está a caminho. Chegará em breve!",
    cor: "#16a34a",
    bgCor: "#f0fdf4",
  },
  entregue: {
    label: "Entregue!",
    descricao: "O seu pedido foi entregue com sucesso. Obrigado!",
    cor: "#15803d",
    bgCor: "#dcfce7",
  },
};

// Tempo (em milissegundos) que cada fase demora antes de avançar para a seguinte
const TEMPOS_FASE: Record<FaseEntrega, number> = {
  confirmado: 4000,
  preparacao: 6000,
  recolha: 5000,
  transito: 8000,
  entregue: 0, // fase final — não avança
};

// -------------------------------------------------------
// COMPONENTE: TruckAnimado
// Calcula a posição do ícone do caminhão ao longo do percurso SVG
// com base na percentagem de progresso (0 a 100).
// -------------------------------------------------------
function TruckAnimado({ progresso }: { progresso: number }) {
  // O percurso no SVG tem 3 segmentos: (50,89)→(99,89), (99,89)→(99,177), (99,177)→(340,177)
  // Comprimentos aproximados dos segmentos:
  const seg1 = 49;   // segmento horizontal superior
  const seg2 = 88;   // segmento vertical
  const seg3 = 241;  // segmento horizontal inferior
  const total = seg1 + seg2 + seg3; // ≈ 378

  // Converte a percentagem para distância percorrida no caminho
  const dist = (progresso / 100) * total;

  let cx: number;
  let cy: number;

  if (dist <= seg1) {
    // Segmento 1: percurso horizontal de x=50 a x=99, y=89
    cx = 50 + dist;
    cy = 89;
  } else if (dist <= seg1 + seg2) {
    // Segmento 2: percurso vertical de y=89 a y=177, x=99
    cx = 99;
    cy = 89 + (dist - seg1);
  } else {
    // Segmento 3: percurso horizontal de x=99 a x=340, y=177
    cx = 99 + (dist - seg1 - seg2);
    cy = 177;
  }

  return (
    <g>
      {/* Sombra do caminhão */}
      <ellipse cx={cx} cy={cy + 14} rx="12" ry="4" fill="rgba(0,0,0,0.15)" />
      {/* Círculo de fundo do caminhão */}
      <circle cx={cx} cy={cy} r="13" fill="#16a34a" stroke="white" strokeWidth="2.5" />
      {/* Ícone simplificado de caminhão */}
      <text
        x={cx}
        y={cy + 4}
        textAnchor="middle"
        fontSize="12"
        fill="white"
        style={{ fontWeight: "bold" }}
      >
        🚛
      </text>
    </g>
  );
}

// -------------------------------------------------------
// COMPONENTE: MapaSimulado
// Renderiza um mapa SVG com estradas, blocos, marcadores
// de farmácia e cliente, e o caminhão animado.
// -------------------------------------------------------
function MapaSimulado({ fase }: { fase: FaseEntrega }) {
  // Percentagem de progresso do caminhão conforme a fase
  const PROGRESSO: Record<FaseEntrega, number> = {
    confirmado: 0,
    preparacao: 5,
    recolha: 20,
    transito: 65,
    entregue: 100,
  };

  const progresso = PROGRESSO[fase];

  return (
    <div
      style={{
        background: "#f0fdf4",
        borderRadius: "1rem",
        overflow: "hidden",
        border: "1px solid #bbf7d0",
        position: "relative",
      }}
    >
      <svg
        viewBox="0 0 400 260"
        xmlns="http://www.w3.org/2000/svg"
        style={{ width: "100%", display: "block" }}
      >
        {/* Fundo do mapa */}
        <rect width="400" height="260" fill="#e8f5e9" />

        {/* Quadras / blocos de edifícios (cor clara para simular quarteirões) */}
        <rect x="10"  y="10"  width="70" height="60"  rx="4" fill="#c8e6c9" />
        <rect x="110" y="10"  width="80" height="60"  rx="4" fill="#c8e6c9" />
        <rect x="220" y="10"  width="90" height="60"  rx="4" fill="#c8e6c9" />
        <rect x="330" y="10"  width="60" height="60"  rx="4" fill="#c8e6c9" />
        <rect x="10"  y="100" width="60" height="55"  rx="4" fill="#c8e6c9" />
        <rect x="130" y="100" width="70" height="55"  rx="4" fill="#c8e6c9" />
        <rect x="240" y="100" width="80" height="55"  rx="4" fill="#c8e6c9" />
        <rect x="10"  y="190" width="80" height="55"  rx="4" fill="#c8e6c9" />
        <rect x="130" y="190" width="70" height="55"  rx="4" fill="#c8e6c9" />
        <rect x="240" y="190" width="70" height="55"  rx="4" fill="#c8e6c9" />
        <rect x="330" y="130" width="60" height="115" rx="4" fill="#c8e6c9" />

        {/* Estradas principais (cor cinza claro) */}
        {/* Estrada horizontal superior */}
        <rect x="0"   y="80"  width="400" height="18" fill="#ffffff" opacity="0.7" />
        {/* Estrada horizontal inferior */}
        <rect x="0"   y="163" width="400" height="18" fill="#ffffff" opacity="0.7" />
        {/* Estrada vertical esquerda */}
        <rect x="86"  y="0"   width="18"  height="260" fill="#ffffff" opacity="0.7" />
        {/* Estrada vertical direita */}
        <rect x="320" y="0"   width="18"  height="260" fill="#ffffff" opacity="0.7" />
        {/* Estrada vertical central */}
        <rect x="207" y="0"   width="16"  height="260" fill="#ffffff" opacity="0.6" />

        {/* Linhas tracejadas das estradas (marcas de centro) */}
        <line x1="0" y1="89" x2="400" y2="89" stroke="#a7f3d0" strokeWidth="1" strokeDasharray="8,6" />
        <line x1="0" y1="172" x2="400" y2="172" stroke="#a7f3d0" strokeWidth="1" strokeDasharray="8,6" />

        {/* PERCURSO DA ENTREGA (linha verde tracejada) */}
        {/* Origem: Farmácia (50,89) → ponto de viragem (99,89) → (99,177) → Destino (340,177) */}
        <polyline
          points="50,89 99,89 99,177 340,177"
          fill="none"
          stroke="#16a34a"
          strokeWidth="4"
          strokeDasharray="10,5"
          strokeLinecap="round"
          opacity="0.85"
        />

        {/* MARCADOR DA FARMÁCIA (origem) */}
        <circle cx="50" cy="89" r="11" fill="#16a34a" stroke="white" strokeWidth="2.5" />
        <text x="50" y="93" textAnchor="middle" fontSize="9" fill="white" fontWeight="bold">F</text>
        {/* Etiqueta "Farmácia" */}
        <rect x="8" y="66" width="44" height="14" rx="3" fill="#16a34a" opacity="0.9" />
        <text x="30" y="76" textAnchor="middle" fontSize="7.5" fill="white" fontWeight="bold">Farmácia</text>

        {/* MARCADOR DO CLIENTE (destino) */}
        <circle cx="340" cy="177" r="11" fill="#dc2626" stroke="white" strokeWidth="2.5" />
        <text x="340" y="181" textAnchor="middle" fontSize="9" fill="white" fontWeight="bold">C</text>
        {/* Etiqueta "Destino" */}
        <rect x="317" y="154" width="46" height="14" rx="3" fill="#dc2626" opacity="0.9" />
        <text x="340" y="164" textAnchor="middle" fontSize="7.5" fill="white" fontWeight="bold">Destino</text>

        {/* CAMINHÃO ANIMADO ou CHECKMARK ao entregar */}
        {fase !== "entregue" ? (
          <TruckAnimado progresso={progresso} />
        ) : (
          // Quando entregue, mostra um check verde na posição do cliente
          <g>
            <circle cx="340" cy="177" r="16" fill="#16a34a" stroke="white" strokeWidth="3" />
            <text x="340" y="183" textAnchor="middle" fontSize="16" fill="white">✓</text>
          </g>
        )}
      </svg>

      {/* Legenda do mapa */}
      <div
        style={{
          display: "flex",
          gap: "1rem",
          padding: "0.5rem 1rem 0.75rem",
          fontSize: "0.7rem",
          color: "#6b7280",
          justifyContent: "center",
        }}
      >
        <span style={{ display: "flex", alignItems: "center", gap: "4px" }}>
          <span
            style={{
              display: "inline-block",
              width: "10px",
              height: "10px",
              borderRadius: "50%",
              background: "#16a34a",
            }}
          />
          Farmácia
        </span>
        <span style={{ display: "flex", alignItems: "center", gap: "4px" }}>
          <span
            style={{
              display: "inline-block",
              width: "10px",
              height: "10px",
              borderRadius: "50%",
              background: "#dc2626",
            }}
          />
          Destino
        </span>
        <span style={{ display: "flex", alignItems: "center", gap: "4px" }}>
          <span
            style={{
              display: "inline-block",
              width: "14px",
              height: "3px",
              background: "#16a34a",
              borderRadius: "2px",
            }}
          />
          Percurso
        </span>
      </div>
    </div>
  );
}

// -------------------------------------------------------
// COMPONENTE PRINCIPAL — AcompanharEntrega
// -------------------------------------------------------
export function AcompanharEntrega() {
  // Fase inicial do ciclo de entrega
  const [fase, setFase] = useState<FaseEntrega>("confirmado");

  // Contador regressivo para a próxima fase (em segundos)
  const [tempoRestante, setTempoRestante] = useState(
    TEMPOS_FASE["confirmado"] / 1000
  );

  // Controla a avaliação com estrelas (visível após entrega)
  const [avaliacao, setAvaliacao] = useState(0);
  const [avaliacaoFeita, setAvaliacaoFeita] = useState(false);

  // Número de pedido gerado aleatoriamente na montagem do componente
  const numeroPedido = useRef(
    "TW-" + Math.floor(10000 + Math.random() * 90000)
  ).current;

  // ---- Avança as fases automaticamente ----
  // A cada vez que "fase" muda, agenda um timeout para avançar para a próxima.
  // Quando a fase é "entregue", não agenda nada.
  useEffect(() => {
    if (fase === "entregue") return;

    const indiceFaseActual = ORDEM_FASES.indexOf(fase);
    const proximaFase = ORDEM_FASES[indiceFaseActual + 1];
    const duracao = TEMPOS_FASE[fase];

    // Reinicia o contador regressivo para a fase actual
    setTempoRestante(duracao / 1000);

    const timer = setTimeout(() => {
      setFase(proximaFase);
    }, duracao);

    return () => clearTimeout(timer);
  }, [fase]);

  // ---- Decrementa o contador a cada segundo ----
  // Usa um intervalo independente que conta de duracao/1000 até 0.
  // Usa ref para não recriar o intervalo em cada render.
  useEffect(() => {
    if (fase === "entregue") return;

    const intervalo = setInterval(() => {
      setTempoRestante((prev) => {
        if (prev <= 1) return 0;
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(intervalo);
  }, [fase]); // só recria quando a fase muda (não a cada tick)

  const faseConfig = FASES[fase];
  const indiceFaseActual = ORDEM_FASES.indexOf(fase);

  return (
    <div className="min-h-screen bg-gray-50 py-6 px-4 sm:px-6 lg:px-8">
      <div className="max-w-2xl mx-auto space-y-5">

        {/* ---- Cabeçalho ---- */}
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Acompanhar Entrega</h1>
          <p className="text-sm text-gray-500 mt-1">
            Pedido <span className="font-semibold text-green-700">{numeroPedido}</span>
          </p>
        </div>

        {/* ---- Estado actual com cor dinâmica ---- */}
        <div
          className="rounded-2xl p-5 border"
          style={{
            backgroundColor: faseConfig.bgCor,
            borderColor: faseConfig.cor + "40",
          }}
        >
          <div className="flex items-start gap-4">
            <div
              className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0"
              style={{ backgroundColor: faseConfig.cor + "20" }}
            >
              {fase === "entregue" ? (
                <CheckCircle2
                  className="w-7 h-7"
                  style={{ color: faseConfig.cor }}
                />
              ) : (
                <Truck className="w-7 h-7" style={{ color: faseConfig.cor }} />
              )}
            </div>
            <div className="flex-1">
              <p
                className="font-bold text-lg"
                style={{ color: faseConfig.cor }}
              >
                {faseConfig.label}
              </p>
              <p className="text-sm text-gray-600 mt-0.5">
                {faseConfig.descricao}
              </p>
              {fase !== "entregue" && (
                <p className="text-xs text-gray-400 mt-1 flex items-center gap-1">
                  <Clock className="w-3 h-3" />
                  Próxima actualização em{" "}
                  <span className="font-semibold">{tempoRestante}s</span>
                </p>
              )}
            </div>
          </div>
        </div>

        {/* ---- Mapa simulado ---- */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="px-5 pt-4 pb-2 flex items-center gap-2">
            <MapPin className="w-4 h-4 text-green-600" />
            <span className="text-sm font-semibold text-gray-700">
              Mapa da Entrega
            </span>
          </div>
          <div className="px-3 pb-3">
            <MapaSimulado fase={fase} />
          </div>
        </div>

        {/* ---- Linha do tempo das fases ---- */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5">
          <h3 className="text-sm font-bold text-gray-700 mb-4">
            Progresso do Pedido
          </h3>
          <div className="space-y-3">
            {ORDEM_FASES.map((f, index) => {
              const config = FASES[f];
              const concluida = index < indiceFaseActual;
              const actual = index === indiceFaseActual;

              return (
                <div key={f} className="flex items-start gap-3">
                  {/* Círculo indicador */}
                  <div className="flex flex-col items-center">
                    <div
                      className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 transition-all duration-500"
                      style={{
                        backgroundColor: concluida
                          ? "#16a34a"
                          : actual
                          ? config.cor
                          : "#e5e7eb",
                        border: actual
                          ? `2px solid ${config.cor}`
                          : "2px solid transparent",
                      }}
                    >
                      {concluida ? (
                        <CheckCircle2 className="w-4 h-4 text-white" />
                      ) : actual ? (
                        <div
                          className="w-3 h-3 rounded-full animate-pulse"
                          style={{ backgroundColor: "white" }}
                        />
                      ) : (
                        <div className="w-3 h-3 rounded-full bg-gray-300" />
                      )}
                    </div>
                    {/* Linha de ligação entre fases */}
                    {index < ORDEM_FASES.length - 1 && (
                      <div
                        className="w-0.5 h-6 mt-1 transition-all duration-500"
                        style={{
                          backgroundColor: concluida ? "#16a34a" : "#e5e7eb",
                        }}
                      />
                    )}
                  </div>

                  {/* Texto da fase */}
                  <div className="pb-4">
                    <p
                      className="text-sm font-semibold transition-all duration-300"
                      style={{
                        color: concluida
                          ? "#16a34a"
                          : actual
                          ? config.cor
                          : "#9ca3af",
                      }}
                    >
                      {config.label}
                    </p>
                    {actual && (
                      <p className="text-xs text-gray-400 mt-0.5">
                        {config.descricao}
                      </p>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* ---- Informações da entrega ---- */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5">
          <h3 className="text-sm font-bold text-gray-700 mb-4">
            Detalhes da Entrega
          </h3>
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 bg-green-100 rounded-lg flex items-center justify-center flex-shrink-0">
                <Package className="w-4 h-4 text-green-600" />
              </div>
              <div>
                <p className="text-xs text-gray-500">Origem</p>
                <p className="text-sm font-medium text-gray-800">
                  Farmácia Saúde — Ingombota, Luanda
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 bg-red-100 rounded-lg flex items-center justify-center flex-shrink-0">
                <MapPin className="w-4 h-4 text-red-600" />
              </div>
              <div>
                <p className="text-xs text-gray-500">Destino</p>
                <p className="text-sm font-medium text-gray-800">
                  Rua da Missão, 45 — Ingombota, Luanda
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                <User className="w-4 h-4 text-blue-600" />
              </div>
              <div>
                <p className="text-xs text-gray-500">Entregador</p>
                <p className="text-sm font-medium text-gray-800">
                  Carlos Entregador
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 bg-purple-100 rounded-lg flex items-center justify-center flex-shrink-0">
                <Phone className="w-4 h-4 text-purple-600" />
              </div>
              <div>
                <p className="text-xs text-gray-500">Contacto do Entregador</p>
                <p className="text-sm font-medium text-gray-800">
                  +244 900 000 003
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* ---- Avaliação (só aparece após entrega) ---- */}
        {fase === "entregue" && (
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5">
            <h3 className="text-sm font-bold text-gray-700 mb-1">
              Como foi a sua entrega?
            </h3>
            <p className="text-xs text-gray-400 mb-4">
              A sua opinião ajuda a melhorar o serviço.
            </p>

            {!avaliacaoFeita ? (
              <>
                <div className="flex gap-2 justify-center mb-4">
                  {[1, 2, 3, 4, 5].map((estrela) => (
                    <button
                      key={estrela}
                      onClick={() => setAvaliacao(estrela)}
                      className="transition-transform hover:scale-110"
                    >
                      <Star
                        className="w-9 h-9"
                        fill={estrela <= avaliacao ? "#facc15" : "none"}
                        stroke={estrela <= avaliacao ? "#facc15" : "#d1d5db"}
                        strokeWidth={1.5}
                      />
                    </button>
                  ))}
                </div>
                {avaliacao > 0 && (
                  <button
                    onClick={() => setAvaliacaoFeita(true)}
                    className="w-full py-2.5 bg-green-600 text-white text-sm font-semibold rounded-xl hover:bg-green-700 transition"
                  >
                    Enviar Avaliação
                  </button>
                )}
              </>
            ) : (
              <div className="flex flex-col items-center gap-2 py-2">
                <CheckCircle2 className="w-10 h-10 text-green-600" />
                <p className="text-sm font-semibold text-green-700">
                  Obrigado pela sua avaliação!
                </p>
                <div className="flex gap-1">
                  {[1, 2, 3, 4, 5].map((estrela) => (
                    <Star
                      key={estrela}
                      className="w-5 h-5"
                      fill={estrela <= avaliacao ? "#facc15" : "none"}
                      stroke={estrela <= avaliacao ? "#facc15" : "#d1d5db"}
                      strokeWidth={1.5}
                    />
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

      </div>
    </div>
  );
}
