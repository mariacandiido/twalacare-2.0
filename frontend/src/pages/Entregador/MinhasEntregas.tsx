import { useState } from 'react';
import {
  Truck,
  MapPin,
  Phone,
  Building2,
  Clock,
  ChevronDown,
  Navigation,
  CheckCircle2,
} from 'lucide-react';
import { EntregadorLayout } from '../../layouts/EntregadorLayout';
import { StatusEntrega } from '../../components/Entregador/StatusEntrega';
import { useEntregadorStore } from '../../store/entregadorStore';
import type { StatusEntregaType } from '../../types/entregador.types';
import { Link } from 'react-router-dom';

const statusProgresso: StatusEntregaType[] = [
  'indo-farmacia',
  'pegando-pedido',
  'a-caminho-cliente',
  'entregue',
];

const statusLabel: Record<StatusEntregaType | 'entregue', string> = {
  'indo-farmacia': 'Indo para farmácia',
  'pegando-pedido': 'Pegando pedido',
  'a-caminho-cliente': 'A caminho do cliente',
  entregue: 'Marcar como Entregue',
};

function getProximoStatus(atual: StatusEntregaType): StatusEntregaType | 'entregue' {
  const idx = statusProgresso.indexOf(atual);
  if (idx < statusProgresso.length - 1) return statusProgresso[idx + 1];
  return 'entregue';
}

export function MinhasEntregas() {
  const { disponivel, toggleDisponivel, entregasAtivas, atualizarStatus } =
    useEntregadorStore();

  const [expandido, setExpandido] = useState<string | null>(
    entregasAtivas[0]?.id ?? null
  );

  const [confirmando, setConfirmando] = useState<string | null>(null);

  const handleAtualizarStatus = (id: string, status: StatusEntregaType) => {
    const proximo = getProximoStatus(status);
    if (proximo === 'entregue') {
      setConfirmando(id);
    } else {
      atualizarStatus(id, proximo);
    }
  };

  const handleConfirmarEntrega = (id: string) => {
    atualizarStatus(id, 'entregue');
    setConfirmando(null);
  };

  return (
    <EntregadorLayout disponivel={disponivel} onToggleDisponivel={toggleDisponivel}>
      <div className="twala-page-enter p-6 lg:p-8 space-y-6" style={{ backgroundColor: "#faf7f2", minHeight: "100vh" }}>
        {/* Cabeçalho */}
        <div>
          <h1 style={{ fontFamily: "'Poppins', sans-serif", fontWeight: 600, fontSize: "clamp(1.4rem, 3vw, 1.8rem)", color: "#2c3e2c", marginBottom: 4 }}>
            Minhas Entregas
          </h1>
          <div style={{ width: 50, height: 3, background: "linear-gradient(90deg, #2c5530, #c7a252)", borderRadius: 2, marginBottom: 4 }} />
          <p style={{ fontFamily: "'Roboto', sans-serif", color: "#4a7856", fontSize: 13 }}>
            {entregasAtivas.length} entrega(s) em andamento
          </p>
        </div>

        {/* Sem entregas */}
        {entregasAtivas.length === 0 ? (
          <div className="twala-card flex flex-col items-center justify-center py-16 text-center">
            <div style={{ width: 72, height: 72, borderRadius: 16, backgroundColor: "rgba(44,85,48,0.08)", display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 16 }}>
              <Truck style={{ width: 36, height: 36, color: "#4a7856" }} />
            </div>
            <p style={{ fontFamily: "'Poppins', sans-serif", fontWeight: 500, color: "#4a7856" }}>Nenhuma entrega em andamento</p>
            <p className="text-gray-400 text-sm mt-1">
              Aceite uma entrega disponível para começar.
            </p>
            <Link
              to="/entregador/entregas-disponiveis"
              className="mt-4 px-5 py-2.5 bg-green-600 text-white text-sm font-semibold rounded-xl hover:bg-green-700 shadow-md shadow-green-200 transition"
            >
              Ver Entregas Disponíveis
            </Link>
          </div>
        ) : (
          <div className="space-y-5">
            {entregasAtivas.map((entrega) => {
              const isExpandido = expandido === entrega.id;
              const proxStatus = getProximoStatus(entrega.status);
              const isUltimo = proxStatus === 'entregue';

              return (
                <div
                  key={entrega.id}
                  className="bg-white rounded-2xl shadow-md overflow-hidden"
                >
                  {/* Cabeçalho do card */}
                  <div className="bg-gradient-to-r from-green-600 to-green-500 px-5 py-4 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 bg-white/20 rounded-xl flex items-center justify-center">
                        <Truck className="w-5 h-5 text-white" />
                      </div>
                      <div>
                        <p className="text-white font-bold text-sm">{entrega.cliente}</p>
                        <p className="text-white/70 text-xs">Aceite às {entrega.aceitoEm}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="text-white font-bold text-sm">
                        {entrega.valor.toLocaleString()} Kz
                      </span>
                      <button
                        onClick={() => setExpandido(isExpandido ? null : entrega.id)}
                        className="w-8 h-8 bg-white/20 rounded-lg flex items-center justify-center hover:bg-white/30 transition"
                      >
                        <ChevronDown
                          className={`w-4 h-4 text-white transition-transform ${isExpandido ? 'rotate-180' : ''}`}
                        />
                      </button>
                    </div>
                  </div>

                  {/* Status bar de progresso */}
                  <div className="px-5 py-4 border-b border-gray-100">
                    <div className="flex items-center justify-between mb-2">
                      <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
                        Status da entrega
                      </p>
                      <StatusEntrega status={entrega.status} />
                    </div>

                    {/* Barra de progresso visual */}
                    <div className="relative mt-3">
                      <div className="absolute top-3 left-0 right-0 h-0.5 bg-gray-200" />
                      <div
                        className="absolute top-3 left-0 h-0.5 bg-green-500 transition-all duration-500"
                        style={{
                          width: `${
                            ((statusProgresso.indexOf(entrega.status)) /
                              (statusProgresso.length - 1)) *
                            100
                          }%`,
                        }}
                      />
                      <div className="relative flex justify-between">
                        {statusProgresso.map((s, i) => {
                          const atual = statusProgresso.indexOf(entrega.status);
                          const isFeito = i <= atual;
                          const isAtual = i === atual;
                          return (
                            <div key={s} className="flex flex-col items-center gap-1.5">
                              <div
                                className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all ${
                                  isFeito
                                    ? 'bg-green-500 border-green-500'
                                    : 'bg-white border-gray-300'
                                } ${isAtual ? 'ring-2 ring-green-300 ring-offset-1' : ''}`}
                              >
                                {isFeito && (
                                  <CheckCircle2 className="w-3.5 h-3.5 text-white" />
                                )}
                              </div>
                              <span className={`text-[9px] font-medium text-center leading-tight max-w-[56px] ${isFeito ? 'text-green-600' : 'text-gray-400'}`}>
                                {s === 'indo-farmacia' && 'Indo farmácia'}
                                {s === 'pegando-pedido' && 'Pegando pedido'}
                                {s === 'a-caminho-cliente' && 'A caminho'}
                                {s === 'entregue' && 'Entregue'}
                              </span>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  </div>

                  {/* Detalhes (expandível) */}
                  {isExpandido && (
                    <div className="px-5 py-4 space-y-4">
                      {/* Mapa placeholder */}
                      <div className="bg-gray-100 rounded-xl h-40 flex flex-col items-center justify-center border-2 border-dashed border-gray-200">
                        <Navigation className="w-8 h-8 text-gray-400 mb-2" />
                        <p className="text-sm font-semibold text-gray-500">Mapa da rota da entrega</p>
                        <div className="flex items-center gap-4 mt-3 text-xs text-gray-400">
                          <span className="flex items-center gap-1">
                            <span className="w-2 h-2 rounded-full bg-green-500" />
                            Farmácia
                          </span>
                          <span className="flex items-center gap-1">
                            <span className="w-2 h-2 rounded-full bg-blue-500" />
                            Cliente
                          </span>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        {/* Farmácia */}
                        <div className="bg-green-50 rounded-xl p-4 space-y-2">
                          <div className="flex items-center gap-2">
                            <Building2 className="w-4 h-4 text-green-600" />
                            <p className="text-xs font-bold text-green-700 uppercase tracking-wider">Farmácia</p>
                          </div>
                          <p className="text-sm font-semibold text-gray-800">{entrega.farmacia}</p>
                          <div className="flex items-start gap-1.5">
                            <MapPin className="w-3.5 h-3.5 text-green-500 mt-0.5 flex-shrink-0" />
                            <p className="text-xs text-gray-600">{entrega.farmaciaEndereco}</p>
                          </div>
                        </div>

                        {/* Cliente */}
                        <div className="bg-blue-50 rounded-xl p-4 space-y-2">
                          <div className="flex items-center gap-2">
                            <Phone className="w-4 h-4 text-blue-600" />
                            <p className="text-xs font-bold text-blue-700 uppercase tracking-wider">Cliente</p>
                          </div>
                          <p className="text-sm font-semibold text-gray-800">{entrega.cliente}</p>
                          <div className="flex items-start gap-1.5">
                            <MapPin className="w-3.5 h-3.5 text-blue-500 mt-0.5 flex-shrink-0" />
                            <p className="text-xs text-gray-600">{entrega.clienteEndereco}</p>
                          </div>
                          <div className="flex items-center gap-1.5">
                            <Phone className="w-3.5 h-3.5 text-blue-400" />
                            <p className="text-xs text-gray-600">{entrega.clienteTelefone}</p>
                          </div>
                        </div>
                      </div>

                      {/* Info rápida */}
                      <div className="grid grid-cols-2 gap-3">
                        <div className="flex items-center gap-2 bg-gray-50 rounded-xl p-3">
                          <MapPin className="w-4 h-4 text-gray-500" />
                          <div>
                            <p className="text-xs text-gray-400">Distância</p>
                            <p className="text-sm font-bold text-gray-800">{entrega.distancia}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2 bg-gray-50 rounded-xl p-3">
                          <Clock className="w-4 h-4 text-gray-500" />
                          <div>
                            <p className="text-xs text-gray-400">Tempo estimado</p>
                            <p className="text-sm font-bold text-gray-800">{entrega.tempoEstimado}</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Botão de atualizar status */}
                  <div className="px-5 pb-5">
                    {confirmando === entrega.id ? (
                      <div className="bg-green-50 border border-green-200 rounded-xl p-4">
                        <p className="text-sm font-semibold text-green-800 mb-3">
                          Confirmar entrega concluída?
                        </p>
                        <div className="grid grid-cols-2 gap-3">
                          <button
                            onClick={() => setConfirmando(null)}
                            className="py-2 rounded-xl border border-gray-200 text-gray-600 text-sm font-semibold hover:bg-gray-50 transition"
                          >
                            Cancelar
                          </button>
                          <button
                            onClick={() => handleConfirmarEntrega(entrega.id)}
                            className="py-2 rounded-xl bg-green-600 text-white text-sm font-semibold hover:bg-green-700 transition"
                          >
                            Confirmar
                          </button>
                        </div>
                      </div>
                    ) : (
                      <button
                        onClick={() => handleAtualizarStatus(entrega.id, entrega.status)}
                        className={`w-full py-3 rounded-xl text-sm font-bold transition-all duration-200 ${
                          isUltimo
                            ? 'bg-green-600 text-white hover:bg-green-700 shadow-md shadow-green-200'
                            : 'bg-gray-900 text-white hover:bg-gray-800'
                        }`}
                      >
                        {isUltimo ? '✓ Marcar como Entregue' : `Avançar: ${statusLabel[proxStatus]}`}
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </EntregadorLayout>
  );
}
