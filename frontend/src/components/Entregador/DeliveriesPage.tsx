import { Link } from 'react-router-dom';
import { PackageOpen, Truck, CheckCircle2, ArrowRight, MapPin, Clock } from 'lucide-react';
import { useEntregadorStore } from '../../store/entregadorStore';
import { useAuth } from '../../hooks/useAuth';
import { EntregadorLayout } from '../../layouts/EntregadorLayout';
import { StatusEntrega } from './StatusEntrega';

export function DeliveriesPage() {
  const { user } = useAuth();
  const {
    disponivel,
    toggleDisponivel,
    entregasDisponiveis,
    entregasAtivas,
    historico,
    aceitarEntrega,
    rejeitarEntrega,
  } = useEntregadorStore();

  if (user?.tipo !== 'entregador') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center p-8 bg-white rounded-2xl shadow-md max-w-md">
          <Truck className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h2 className="text-xl font-bold text-gray-700 mb-2">Acesso Restrito</h2>
          <p className="text-gray-500 mb-4">
            Esta página é exclusiva para entregadores.
          </p>
          <Link
            to="/"
            className="inline-block bg-green-600 text-white px-6 py-2.5 rounded-xl font-medium hover:bg-green-700 transition"
          >
            Voltar ao Início
          </Link>
        </div>
      </div>
    );
  }

  return (
    <EntregadorLayout disponivel={disponivel} onToggleDisponivel={toggleDisponivel}>
      <div className="p-6 lg:p-8 space-y-8">
        <div>
          <h1 className="text-2xl lg:text-3xl font-bold text-gray-900">Entregas</h1>
          <p className="text-gray-500 mt-1 text-sm">
            Visão geral de todas as suas entregas
          </p>
        </div>

        {/* Resumo */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
          <div className="bg-white rounded-2xl shadow-md p-5 flex items-center gap-4">
            <div className="p-3 rounded-xl bg-blue-50">
              <PackageOpen className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">{entregasDisponiveis.length}</p>
              <p className="text-sm text-gray-500">Disponíveis</p>
            </div>
          </div>
          <div className="bg-white rounded-2xl shadow-md p-5 flex items-center gap-4">
            <div className="p-3 rounded-xl bg-purple-50">
              <Truck className="w-6 h-6 text-purple-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">{entregasAtivas.length}</p>
              <p className="text-sm text-gray-500">Em Andamento</p>
            </div>
          </div>
          <div className="bg-white rounded-2xl shadow-md p-5 flex items-center gap-4">
            <div className="p-3 rounded-xl bg-green-50">
              <CheckCircle2 className="w-6 h-6 text-green-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">{historico.length}</p>
              <p className="text-sm text-gray-500">Concluídas</p>
            </div>
          </div>
        </div>

        {/* Entregas Disponíveis */}
        <div className="bg-white rounded-2xl shadow-md p-6">
          <div className="flex items-center justify-between mb-5">
            <h2 className="text-lg font-bold text-gray-900">Entregas Disponíveis</h2>
            <Link
              to="/entregador/entregas-disponiveis"
              className="flex items-center gap-1 text-sm text-green-600 hover:text-green-700 font-medium transition"
            >
              Ver todas <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          {entregasDisponiveis.length === 0 ? (
            <div className="text-center py-8">
              <PackageOpen className="w-12 h-12 text-gray-200 mx-auto mb-3" />
              <p className="text-gray-500 text-sm">Nenhuma entrega disponível no momento</p>
            </div>
          ) : (
            <div className="space-y-3">
              {entregasDisponiveis.slice(0, 3).map((entrega) => (
                <div
                  key={entrega.id}
                  className="flex flex-col sm:flex-row sm:items-center justify-between p-4 rounded-xl border border-gray-100 hover:border-green-100 hover:bg-green-50/30 transition gap-3"
                >
                  <div className="min-w-0">
                    <p className="font-semibold text-gray-900 text-sm truncate">{entrega.farmacia}</p>
                    <div className="flex items-center gap-1 mt-1">
                      <MapPin className="w-3 h-3 text-gray-400 flex-shrink-0" />
                      <p className="text-xs text-gray-500 truncate">{entrega.clienteEndereco}</p>
                    </div>
                    <div className="flex items-center gap-1 mt-0.5">
                      <Clock className="w-3 h-3 text-purple-400 flex-shrink-0" />
                      <p className="text-xs text-gray-500">{entrega.distancia} · {entrega.tempoEstimado}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 flex-shrink-0">
                    <span className="text-sm font-bold text-green-700">
                      {entrega.valor.toLocaleString()} Kz
                    </span>
                    <button
                      onClick={() => aceitarEntrega(entrega.id)}
                      className="px-3 py-1.5 bg-green-600 text-white text-xs font-semibold rounded-lg hover:bg-green-700 transition"
                    >
                      Aceitar
                    </button>
                    <button
                      onClick={() => rejeitarEntrega(entrega.id)}
                      className="px-3 py-1.5 border border-gray-200 text-gray-600 text-xs font-semibold rounded-lg hover:bg-gray-50 transition"
                    >
                      Rejeitar
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Entregas em Andamento */}
        <div className="bg-white rounded-2xl shadow-md p-6">
          <div className="flex items-center justify-between mb-5">
            <h2 className="text-lg font-bold text-gray-900">Em Andamento</h2>
            <Link
              to="/entregador/minhas-entregas"
              className="flex items-center gap-1 text-sm text-green-600 hover:text-green-700 font-medium transition"
            >
              Ver todas <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          {entregasAtivas.length === 0 ? (
            <div className="text-center py-8">
              <Truck className="w-12 h-12 text-gray-200 mx-auto mb-3" />
              <p className="text-gray-500 text-sm">Nenhuma entrega em andamento</p>
            </div>
          ) : (
            <div className="space-y-3">
              {entregasAtivas.map((entrega) => (
                <div
                  key={entrega.id}
                  className="flex flex-col sm:flex-row sm:items-center justify-between p-4 rounded-xl border border-gray-100 gap-3"
                >
                  <div className="min-w-0">
                    <p className="font-semibold text-gray-900 text-sm truncate">{entrega.cliente}</p>
                    <div className="flex items-center gap-1 mt-1">
                      <MapPin className="w-3 h-3 text-gray-400 flex-shrink-0" />
                      <p className="text-xs text-gray-500 truncate">{entrega.clienteEndereco}</p>
                    </div>
                    <p className="text-xs text-gray-400 mt-0.5">via {entrega.farmacia}</p>
                  </div>
                  <div className="flex items-center gap-3 flex-shrink-0">
                    <StatusEntrega status={entrega.status} />
                    <span className="text-sm font-bold text-gray-900">
                      {entrega.valor.toLocaleString()} Kz
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </EntregadorLayout>
  );
}
