import { useState } from 'react';
import {
  User,
  Mail,
  Phone,
  Bike,
  Car,
  Save,
  Star,
  Banknote,
  PackageCheck,
  CheckCircle2,
  AlertCircle,
  MapPin,
} from 'lucide-react';
import { EntregadorLayout } from '../../layouts/EntregadorLayout';
import { useEntregadorStore } from '../../store/entregadorStore';
import { useAuth } from '../../hooks/useAuth';
import type { TipoVeiculo } from '../../types/entregador.types';

const veiculos: { valor: TipoVeiculo; label: string; icon: React.ElementType }[] = [
  { valor: 'moto', label: 'Moto', icon: Bike },
  { valor: 'bicicleta', label: 'Bicicleta', icon: Bike },
  { valor: 'carro', label: 'Carro', icon: Car },
  { valor: 'a-pe', label: 'A pé', icon: User },
];

export function Perfil() {
  const { user } = useAuth();
  const { disponivel, toggleDisponivel, perfil, atualizarPerfil } = useEntregadorStore();

  const [form, setForm] = useState({
    nome: perfil.nome,
    email: perfil.email,
    telefone: perfil.telefone,
    veiculo: perfil.veiculo,
    placaVeiculo: perfil.placaVeiculo,
    provincia: perfil.provincia,
    municipio: perfil.municipio,
  });

  const [salvando, setSalvando] = useState(false);
  const [salvo, setSalvo] = useState(false);
  const [erro, setErro] = useState('');

  const handleChange = (campo: string, valor: string) => {
    setForm((prev) => ({ ...prev, [campo]: valor }));
    setSalvo(false);
    setErro('');
  };

  const handleSalvar = async () => {
    if (!form.nome.trim() || !form.email.trim() || !form.telefone.trim()) {
      setErro('Nome, email e telefone são obrigatórios.');
      return;
    }

    setSalvando(true);
    await new Promise((r) => setTimeout(r, 1000));
    atualizarPerfil(form);
    setSalvando(false);
    setSalvo(true);
    setTimeout(() => setSalvo(false), 3000);
  };

  const iniciais =
    (user?.nome ?? perfil.nome)
      .split(' ')
      .slice(0, 2)
      .map((n) => n.charAt(0).toUpperCase())
      .join('') || 'E';

  return (
    <EntregadorLayout disponivel={disponivel} onToggleDisponivel={toggleDisponivel}>
      <div className="twala-page-enter p-6 lg:p-8 space-y-6 max-w-4xl mx-auto" style={{ backgroundColor: "#faf7f2", minHeight: "100vh" }}>
        {/* Cabeçalho */}
        <div>
          <h1 style={{ fontFamily: "'Poppins', sans-serif", fontWeight: 600, fontSize: "clamp(1.4rem, 3vw, 1.8rem)", color: "#2c3e2c", marginBottom: 4 }}>
            Meu Perfil
          </h1>
          <div style={{ width: 50, height: 3, background: "linear-gradient(90deg, #2c5530, #c7a252)", borderRadius: 2, marginBottom: 4 }} />
          <p style={{ fontFamily: "'Roboto', sans-serif", color: "#4a7856", fontSize: 13 }}>Gerencie as suas informações pessoais</p>
        </div>

        {/* Card de perfil */}
        <div className="bg-white rounded-2xl shadow-md overflow-hidden">
          {/* Banner */}
          <div className="h-24 bg-gradient-to-r from-green-600 to-green-400" />

          <div className="px-6 pb-6">
            {/* Avatar + info */}
            <div className="flex flex-col sm:flex-row sm:items-end gap-4 -mt-12 mb-6">
              <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-green-600 to-green-800 flex items-center justify-center shadow-lg border-4 border-white flex-shrink-0">
                <span className="text-white font-bold text-2xl">{iniciais}</span>
              </div>
              <div className="pb-1">
                <h2 className="text-xl font-bold text-gray-900">{perfil.nome}</h2>
                <p className="text-sm text-gray-500">{perfil.email}</p>
              </div>
            </div>

            {/* Stats do entregador */}
            <div className="grid grid-cols-3 gap-4 mb-6">
              <div className="bg-green-50 rounded-xl p-3 text-center">
                <div className="flex items-center justify-center mb-1">
                  <PackageCheck className="w-5 h-5 text-green-600" />
                </div>
                <p className="text-xl font-bold text-green-700">{perfil.totalEntregas}</p>
                <p className="text-[11px] text-gray-500">Entregas</p>
              </div>
              <div className="bg-yellow-50 rounded-xl p-3 text-center">
                <div className="flex items-center justify-center mb-1">
                  <Star className="w-5 h-5 text-yellow-500" />
                </div>
                <p className="text-xl font-bold text-yellow-700">{perfil.avaliacao} ★</p>
                <p className="text-[11px] text-gray-500">Avaliação</p>
              </div>
              <div className="bg-amber-50 rounded-xl p-3 text-center">
                <div className="flex items-center justify-center mb-1">
                  <Banknote className="w-5 h-5 text-amber-600" />
                </div>
                <p className="text-lg font-bold text-amber-700">
                  {(perfil.ganhosMes / 1000).toFixed(0)}K Kz
                </p>
                <p className="text-[11px] text-gray-500">Mês</p>
              </div>
            </div>
          </div>
        </div>

        {/* Disponibilidade */}
        <div className="bg-white rounded-2xl shadow-md p-6">
          <h3 className="text-base font-bold text-gray-900 mb-4">Disponibilidade</h3>
          <div className="flex items-center justify-between p-4 rounded-xl border-2 border-gray-100 hover:border-green-100 transition">
            <div className="flex items-center gap-3">
              <div
                className={`w-10 h-10 rounded-full flex items-center justify-center ${
                  disponivel ? 'bg-green-100' : 'bg-gray-100'
                }`}
              >
                <span
                  className={`w-3 h-3 rounded-full ${
                    disponivel ? 'bg-green-500 animate-pulse' : 'bg-gray-400'
                  }`}
                />
              </div>
              <div>
                <p className="text-sm font-semibold text-gray-800">
                  {disponivel ? 'Disponível para entregas' : 'Offline – Não disponível'}
                </p>
                <p className="text-xs text-gray-500 mt-0.5">
                  {disponivel
                    ? 'Você está visível para novos pedidos'
                    : 'Active para receber novas entregas'}
                </p>
              </div>
            </div>

            {/* Toggle switch */}
            <button
              onClick={toggleDisponivel}
              className={`relative w-12 h-6 rounded-full transition-colors duration-300 focus:outline-none ${
                disponivel ? 'bg-green-500' : 'bg-gray-300'
              }`}
            >
              <div
                className={`absolute top-0.5 w-5 h-5 bg-white rounded-full shadow-md transition-transform duration-300 ${
                  disponivel ? 'translate-x-6' : 'translate-x-0.5'
                }`}
              />
            </button>
          </div>
        </div>

        {/* Formulário de edição */}
        <div className="bg-white rounded-2xl shadow-md p-6">
          <h3 className="text-base font-bold text-gray-900 mb-5">Informações Pessoais</h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            {/* Nome */}
            <div className="sm:col-span-2">
              <label className="block text-xs font-semibold text-gray-600 mb-1.5 uppercase tracking-wider">
                Nome completo
              </label>
              <div className="relative">
                <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="text"
                  value={form.nome}
                  onChange={(e) => handleChange('nome', e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  placeholder="O seu nome completo"
                />
              </div>
            </div>

            {/* Email */}
            <div>
              <label className="block text-xs font-semibold text-gray-600 mb-1.5 uppercase tracking-wider">
                Email
              </label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="email"
                  value={form.email}
                  onChange={(e) => handleChange('email', e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  placeholder="O seu email"
                />
              </div>
            </div>

            {/* Telefone */}
            <div>
              <label className="block text-xs font-semibold text-gray-600 mb-1.5 uppercase tracking-wider">
                Telefone
              </label>
              <div className="relative">
                <Phone className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="tel"
                  value={form.telefone}
                  onChange={(e) => handleChange('telefone', e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  placeholder="+244 9XX XXX XXX"
                />
              </div>
            </div>

            {/* Província */}
            <div>
              <label className="block text-xs font-semibold text-gray-600 mb-1.5 uppercase tracking-wider">
                Província
              </label>
              <div className="relative">
                <MapPin className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="text"
                  value={form.provincia}
                  onChange={(e) => handleChange('provincia', e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  placeholder="Ex: Luanda"
                />
              </div>
            </div>

            {/* Município */}
            <div>
              <label className="block text-xs font-semibold text-gray-600 mb-1.5 uppercase tracking-wider">
                Município
              </label>
              <div className="relative">
                <MapPin className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="text"
                  value={form.municipio}
                  onChange={(e) => handleChange('municipio', e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  placeholder="Ex: Viana"
                />
              </div>
            </div>

            {/* Tipo de veículo */}
            <div className="sm:col-span-2">
              <label className="block text-xs font-semibold text-gray-600 mb-1.5 uppercase tracking-wider">
                Tipo de veículo
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {veiculos.map(({ valor, label, icon: Icon }) => (
                  <button
                    key={valor}
                    type="button"
                    onClick={() => handleChange('veiculo', valor)}
                    className={`flex flex-col items-center gap-2 py-3 px-4 rounded-xl border-2 transition-all ${
                      form.veiculo === valor
                        ? 'border-green-500 bg-green-50 text-green-700'
                        : 'border-gray-200 text-gray-600 hover:border-gray-300 hover:bg-gray-50'
                    }`}
                  >
                    <Icon className="w-5 h-5" />
                    <span className="text-xs font-semibold">{label}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Placa do veículo */}
            {form.veiculo !== 'a-pe' && form.veiculo !== 'bicicleta' && (
              <div className="sm:col-span-2">
                <label className="block text-xs font-semibold text-gray-600 mb-1.5 uppercase tracking-wider">
                  Placa do veículo
                </label>
                <input
                  type="text"
                  value={form.placaVeiculo}
                  onChange={(e) => handleChange('placaVeiculo', e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  placeholder="Ex: LD-12345-AX"
                />
              </div>
            )}
          </div>

          {/* Feedback */}
          {erro && (
            <div className="mt-4 flex items-center gap-2 bg-red-50 border border-red-200 rounded-xl px-4 py-3">
              <AlertCircle className="w-4 h-4 text-red-500 flex-shrink-0" />
              <p className="text-sm text-red-700">{erro}</p>
            </div>
          )}

          {salvo && (
            <div className="mt-4 flex items-center gap-2 bg-green-50 border border-green-200 rounded-xl px-4 py-3">
              <CheckCircle2 className="w-4 h-4 text-green-600 flex-shrink-0" />
              <p className="text-sm text-green-700 font-medium">Perfil actualizado com sucesso!</p>
            </div>
          )}

          {/* Botão salvar */}
          <div className="mt-6 flex justify-end">
            <button
              onClick={handleSalvar}
              disabled={salvando}
              className="flex items-center gap-2 px-6 py-3 bg-green-600 text-white font-semibold text-sm rounded-xl hover:bg-green-700 shadow-md shadow-green-200 transition-all duration-200 disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {salvando ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Salvando...
                </>
              ) : (
                <>
                  <Save className="w-4 h-4" />
                  Salvar Alterações
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </EntregadorLayout>
  );
}
