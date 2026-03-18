import {
  MapPin,
  Clock,
  DollarSign,
  Phone,
  Package,
  Building2,
  User,
} from 'lucide-react';
import type { EntregaDisponivel } from '../../types/entregador.types';

interface EntregaCardProps {
  entrega: EntregaDisponivel;
  onAceitar: (id: string) => void;
  onRejeitar: (id: string) => void;
}

export function EntregaCard({ entrega, onAceitar, onRejeitar }: EntregaCardProps) {
  return (
    <div className="bg-white rounded-2xl shadow-md hover:shadow-lg transition-shadow duration-200 overflow-hidden">
      {/* Cabeçalho */}
      <div className="bg-gradient-to-r from-green-600 to-green-500 px-5 py-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Building2 className="w-4 h-4 text-white/80" />
          <span className="text-white font-semibold text-sm">{entrega.farmacia}</span>
        </div>
        <div className="flex items-center gap-1.5 bg-white/20 rounded-full px-2.5 py-1">
          <Clock className="w-3.5 h-3.5 text-white" />
          <span className="text-white text-xs font-medium">{entrega.criadoEm}</span>
        </div>
      </div>

      {/* Corpo */}
      <div className="p-5 space-y-4">
        {/* Farmácia → Cliente */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div className="bg-gray-50 rounded-xl p-3 space-y-1.5">
            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Retirar em</p>
            <div className="flex items-start gap-2">
              <MapPin className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
              <p className="text-xs text-gray-700 leading-relaxed">{entrega.farmaciaEndereco}</p>
            </div>
          </div>

          <div className="bg-gray-50 rounded-xl p-3 space-y-1.5">
            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Entregar em</p>
            <div className="flex items-start gap-2">
              <MapPin className="w-4 h-4 text-blue-500 mt-0.5 flex-shrink-0" />
              <p className="text-xs text-gray-700 leading-relaxed">{entrega.clienteEndereco}</p>
            </div>
          </div>
        </div>

        {/* Cliente */}
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0">
              <User className="w-3.5 h-3.5 text-blue-600" />
            </div>
            <span className="text-sm font-medium text-gray-800">{entrega.cliente}</span>
          </div>
          <div className="flex items-center gap-1 ml-auto text-gray-500">
            <Phone className="w-3.5 h-3.5" />
            <span className="text-xs">{entrega.clienteTelefone}</span>
          </div>
        </div>

        {/* Itens */}
        <div className="flex items-start gap-2 bg-amber-50 rounded-xl p-3">
          <Package className="w-4 h-4 text-amber-600 mt-0.5 flex-shrink-0" />
          <div>
            <p className="text-[10px] font-bold text-amber-700 uppercase tracking-wider mb-1">Itens</p>
            {entrega.itens.map((item, i) => (
              <p key={i} className="text-xs text-amber-800">{item}</p>
            ))}
          </div>
        </div>

        {/* Métricas */}
        <div className="grid grid-cols-3 gap-3">
          <div className="text-center bg-green-50 rounded-xl py-2">
            <MapPin className="w-4 h-4 text-green-600 mx-auto mb-0.5" />
            <p className="text-sm font-bold text-green-700">{entrega.distancia}</p>
            <p className="text-[10px] text-gray-500">Distância</p>
          </div>
          <div className="text-center bg-purple-50 rounded-xl py-2">
            <Clock className="w-4 h-4 text-purple-600 mx-auto mb-0.5" />
            <p className="text-sm font-bold text-purple-700">{entrega.tempoEstimado}</p>
            <p className="text-[10px] text-gray-500">Estimado</p>
          </div>
          <div className="text-center bg-blue-50 rounded-xl py-2">
            <DollarSign className="w-4 h-4 text-blue-600 mx-auto mb-0.5" />
            <p className="text-sm font-bold text-blue-700">{entrega.valor.toLocaleString()} Kz</p>
            <p className="text-[10px] text-gray-500">Ganho</p>
          </div>
        </div>

        {/* Botões */}
        <div className="grid grid-cols-2 gap-3 pt-1">
          <button
            onClick={() => onRejeitar(entrega.id)}
            className="py-2.5 rounded-xl border-2 border-red-200 text-red-600 text-sm font-semibold hover:bg-red-50 hover:border-red-300 transition-all duration-200"
          >
            Rejeitar
          </button>
          <button
            onClick={() => onAceitar(entrega.id)}
            className="py-2.5 rounded-xl bg-green-600 text-white text-sm font-semibold hover:bg-green-700 shadow-md shadow-green-200 transition-all duration-200"
          >
            Aceitar Entrega
          </button>
        </div>
      </div>
    </div>
  );
}
