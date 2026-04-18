import { useState, useEffect } from "react";

import { 
  Clock, 
  Pill,  
  Plus, 
  Trash2, 
  Edit2, 
  CheckCircle,
  AlertCircle,
  Bell,
  
} from "lucide-react";

type Medicamento = {
  id: string;
  nome: string;
  dosagem: string;
  frequencia: string; // "diária", "semanal", "mensal"
  quantidadeDoses: number;
  duracao: number; // em dias
  horarios: string[];
  instrucoes: string;
  status: "pendente" | "tomado" | "atrasado";
  proximaDose: string;
  paciente: string;
  dataPrescricao: string;
};

type Paciente = {
  id: string;
  nome: string;
  idade: number;
  contato: string;
  historico: string[];
};

export default function ReceitasFarmacia() {
  const [medicamentos, setMedicamentos] = useState<Medicamento[]>([
    {
      id: "1",
      nome: "Paracetamol",
      dosagem: "500mg",
      frequencia: "diária",
      quantidadeDoses: 3,
      duracao: 7,
      horarios: ["08:00", "14:00", "20:00"],
      instrucoes: "Tomar após as refeições",
      status: "pendente",
      proximaDose: "08:00",
      paciente: "Maria Silva",
      dataPrescricao: "2024-01-15"
    },
    {
      id: "2",
      nome: "Amoxicilina",
      dosagem: "250mg",
      frequencia: "diária",
      quantidadeDoses: 2,
      duracao: 10,
      horarios: ["09:00", "21:00"],
      instrucoes: "Tomar com água abundante",
      status: "pendente",
      proximaDose: "09:00",
      paciente: "João Santos",
      dataPrescricao: "2024-01-16"
    },
    {
      id: "3",
      nome: "Omeprazol",
      dosagem: "20mg",
      frequencia: "diária",
      quantidadeDoses: 1,
      duracao: 30,
      horarios: ["07:00"],
      instrucoes: "Tomar em jejum",
      status: "pendente",
      proximaDose: "07:00",
      paciente: "Ana Oliveira",
      dataPrescricao: "2024-01-14"
    }
  ]);

  const [pacientes] = useState<Paciente[]>([
    {
      id: "1",
      nome: "Maria Silva",
      idade: 45,
      contato: "+244 923 456 789",
      historico: ["Hipertensão", "Diabetes tipo 2"]
    },
    {
      id: "2",
      nome: "João Santos",
      idade: 32,
      contato: "+244 924 567 890",
      historico: ["Asma", "Rinite alérgica"]
    },
    {
      id: "3",
      nome: "Ana Oliveira",
      idade: 58,
      contato: "+244 925 678 901",
      historico: ["Gastrite", "Refluxo gastroesofágico"]
    }
  ]);

  const [novoMedicamento, setNovoMedicamento] = useState<Partial<Medicamento>>({
    nome: "",
    dosagem: "",
    frequencia: "diária",
    quantidadeDoses: 1,
    duracao: 7,
    horarios: [],
    instrucoes: "",
    paciente: "",
  });

  const [horarioInput, setHorarioInput] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedPatient, setSelectedPatient] = useState<Paciente | null>(null);
  const [filterStatus, setFilterStatus] = useState<string>("todos");

  // Função para calcular horários automáticos baseados na frequência
  const calcularHorariosAutomaticos = (
    quantidadeDoses: number,
    duracao: number, 
    frequencia: string
  ): string[] => {
    const horarios: string[] = [];
    
    if (frequencia === "diária") {
      // Distribui as doses ao longo do dia (entre 7h e 22h)
      const intervalo = Math.floor(16 / quantidadeDoses); // 16 horas disponíveis
      
      for (let i = 0; i < quantidadeDoses; i++) {
        const hora = 7 + (i * intervalo);
        const horaFormatada = hora.toString().padStart(2, '0') + ":00";
        horarios.push(horaFormatada);
      }
    } else if (frequencia === "semanal") {
      // Uma dose por semana no mesmo horário
      horarios.push("09:00");
    } else if (frequencia === "mensal") {
      // Uma dose por mês no mesmo horário
      horarios.push("10:00");
    }
    
    return horarios;
  };

  // Função para adicionar horário manual
  const adicionarHorario = () => {
    if (horarioInput && /^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/.test(horarioInput)) {
      const horariosAtualizados = [...(novoMedicamento.horarios || []), horarioInput]
        .sort((a, b) => a.localeCompare(b));
      
      setNovoMedicamento({
        ...novoMedicamento,
        horarios: horariosAtualizados
      });
      setHorarioInput("");
    }
  }; 

  // Função para remover horário
  const removerHorario = (index: number) => {
    const horariosAtualizados = [...(novoMedicamento.horarios || [])];
    horariosAtualizados.splice(index, 1);
    setNovoMedicamento({
      ...novoMedicamento,
      horarios: horariosAtualizados
    });
  };

  // Função para adicionar novo medicamento
  const adicionarMedicamento = () => {
    if (!novoMedicamento.nome || !novoMedicamento.dosagem || !novoMedicamento.paciente) {
      alert("Preencha todos os campos obrigatórios");
      return;
    }

    // Se não houver horários definidos, calcular automaticamente
    let horariosFinais = novoMedicamento.horarios;
    if (!horariosFinais || horariosFinais.length === 0) {
      horariosFinais = calcularHorariosAutomaticos(
        novoMedicamento.quantidadeDoses || 1,
        novoMedicamento.duracao || 7,
        novoMedicamento.frequencia || "diária"
      );
    }

    const medicamentoCompleto: Medicamento = {
      id: Date.now().toString(),
      nome: novoMedicamento.nome || "",
      dosagem: novoMedicamento.dosagem || "",
      frequencia: novoMedicamento.frequencia || "diária",
      quantidadeDoses: novoMedicamento.quantidadeDoses || 1,
      duracao: novoMedicamento.duracao || 7,
      horarios: horariosFinais,
      instrucoes: novoMedicamento.instrucoes || "",
      status: "pendente",
      proximaDose: horariosFinais[0] || "08:00",
      paciente: novoMedicamento.paciente || "",
      dataPrescricao: new Date().toISOString().split('T')[0]
    };

    setMedicamentos([...medicamentos, medicamentoCompleto]);
    setIsModalOpen(false);
    resetForm();
  };

  // Função para marcar dose como tomada
  const marcarDoseTomada = (id: string) => {
    setMedicamentos(medicamentos.map(med => {
      if (med.id === id) {
        return { ...med, status: "tomado" };
      }
      return med;
    }));
  };

  // Função para editar medicamento
  const editarMedicamento = (id: string) => {
    const medicamento = medicamentos.find(m => m.id === id);
    if (medicamento) {
      setNovoMedicamento(medicamento);
      setIsModalOpen(true);
    }
  };

  // Função para remover medicamento
  const removerMedicamento = (id: string) => {
    if (window.confirm("Tem certeza que deseja remover este medicamento?")) {
      setMedicamentos(medicamentos.filter(med => med.id !== id));
    }
  };

  // Função para resetar formulário
  const resetForm = () => {
    setNovoMedicamento({
      nome: "",
      dosagem: "",
      frequencia: "diária",
      quantidadeDoses: 1,
      duracao: 7,
      horarios: [],
      instrucoes: "",
      paciente: "",
    });
    setHorarioInput("");
    setSelectedPatient(null);
  };

  // Filtrar medicamentos por status
  const medicamentosFiltrados = medicamentos.filter(med => {
    if (filterStatus === "todos") return true;
    return med.status === filterStatus;
  });

  // Verificar próxima dose
  const getProximaDoseInfo = (medicamento: Medicamento) => {
    const agora = new Date();
    const horaAtual = agora.getHours().toString().padStart(2, '0') + ':' + 
                      agora.getMinutes().toString().padStart(2, '0');
    
    const proximoHorario = medicamento.horarios.find(horario => horario > horaAtual) || 
                          medicamento.horarios[0];
    
    return proximoHorario;
  };

  // Atualizar status baseado no horário
  useEffect(() => {
    const interval = setInterval(() => {
      const agora = new Date();
      const horaAtual = agora.getHours().toString().padStart(2, '0') + ':' + 
                        agora.getMinutes().toString().padStart(2, '0');

      setMedicamentos(prev => prev.map(med => {
        const horarioPassou = med.horarios.some(horario => {
          const [horaMed, minutoMed] = horario.split(':').map(Number);
          const [horaAtualNum, minutoAtualNum] = horaAtual.split(':').map(Number);
          
          return (horaAtualNum > horaMed) || 
                 (horaAtualNum === horaMed && minutoAtualNum >= minutoMed);
        });

        if (horarioPassou && med.status === "pendente") {
          return { ...med, status: "atrasado", proximaDose: getProximaDoseInfo(med) };
        }
        
        return med;
      }));
    }, 60000); // Atualiza a cada minuto

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      {/* Cabeçalho */}
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Gerenciamento de Receitas</h1>
            <p className="text-gray-600 mt-2">Controle de medicamentos e horários dos pacientes</p>
          </div>
          <button
            onClick={() => setIsModalOpen(true)}
            className="flex items-center gap-2 bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition"
          >
            <Plus className="w-5 h-5" />
            Nova Receita
          </button>
        </div>

        {/* Estatísticas */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white p-6 rounded-xl shadow-sm border">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600">Total de Receitas</p>
                <p className="text-2xl font-bold mt-2">{medicamentos.length}</p>
              </div>
              <div className="bg-blue-50 p-3 rounded-lg">
                <Pill className="w-6 h-6 text-blue-600" />
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-sm border">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600">Pendentes</p>
                <p className="text-2xl font-bold mt-2">
                  {medicamentos.filter(m => m.status === "pendente").length}
                </p>
              </div>
              <div className="bg-yellow-50 p-3 rounded-lg">
                <AlertCircle className="w-6 h-6 text-yellow-600" />
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-sm border">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600">Tomados</p>
                <p className="text-2xl font-bold mt-2">
                  {medicamentos.filter(m => m.status === "tomado").length}
                </p>
              </div>
              <div className="bg-green-50 p-3 rounded-lg">
                <CheckCircle className="w-6 h-6 text-green-600" />
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-sm border">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600">Próximas Doses</p>
                <p className="text-2xl font-bold mt-2">
                  {medicamentos.filter(m => m.status === "pendente" || m.status === "atrasado").length}
                </p>
              </div>
              <div className="bg-purple-50 p-3 rounded-lg">
                <Bell className="w-6 h-6 text-purple-600" />
              </div>
            </div>
          </div>
        </div>

        {/* Filtros */}
        <div className="flex gap-4 mb-6">
          <button
            onClick={() => setFilterStatus("todos")}
            className={`px-4 py-2 rounded-lg ${filterStatus === "todos" ? 'bg-green-600 text-white' : 'bg-white text-gray-700 border'}`}
          >
            Todos
          </button>
          <button
            onClick={() => setFilterStatus("pendente")}
            className={`px-4 py-2 rounded-lg ${filterStatus === "pendente" ? 'bg-yellow-600 text-white' : 'bg-white text-gray-700 border'}`}
          >
            Pendentes
          </button>
          <button
            onClick={() => setFilterStatus("tomado")}
            className={`px-4 py-2 rounded-lg ${filterStatus === "tomado" ? 'bg-green-600 text-white' : 'bg-white text-gray-700 border'}`}
          >
            Tomados
          </button>
          <button
            onClick={() => setFilterStatus("atrasado")}
            className={`px-4 py-2 rounded-lg ${filterStatus === "atrasado" ? 'bg-red-600 text-white' : 'bg-white text-gray-700 border'}`}
          >
            Atrasados
          </button>
        </div>

        {/* Lista de Receitas */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {medicamentosFiltrados.map(medicamento => (
            <div key={medicamento.id} className="bg-white rounded-xl shadow-sm border p-6">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <Pill className="w-5 h-5 text-green-600" />
                    <h3 className="font-bold text-lg">{medicamento.nome}</h3>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      medicamento.status === 'pendente' ? 'bg-yellow-100 text-yellow-800' :
                      medicamento.status === 'tomado' ? 'bg-green-100 text-green-800' :
                      'bg-red-100 text-red-800'
                    }`}>
                      {medicamento.status === 'pendente' ? 'Pendente' : 
                       medicamento.status === 'tomado' ? 'Tomado' : 'Atrasado'}
                    </span>
                  </div>
                  <p className="text-gray-600">{medicamento.dosagem}</p>
                  <p className="text-sm text-gray-500 mt-1">
                    Paciente: <span className="font-medium">{medicamento.paciente}</span>
                  </p>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => editarMedicamento(medicamento.id)}
                    className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg"
                  >
                    <Edit2 className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => removerMedicamento(medicamento.id)}
                    className="p-2 text-red-600 hover:bg-red-50 rounded-lg"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Horários */}
              <div className="mb-4">
                <div className="flex items-center gap-2 mb-3">
                  <Clock className="w-4 h-4 text-gray-500" />
                  <span className="font-medium">Horários:</span>
                </div>
                <div className="flex flex-wrap gap-2">
                  {medicamento.horarios.map((horario, index) => (
                    <div
                      key={index}
                      className={`px-3 py-1 rounded-lg flex items-center gap-2 ${
                        horario === medicamento.proximaDose ? 
                        'bg-green-100 text-green-800 border border-green-200' : 
                        'bg-gray-100 text-gray-800'
                      }`}
                    >
                      <Clock className="w-3 h-3" />
                      <span className="font-medium">{horario}</span>
                      {horario === medicamento.proximaDose && (
                        <span className="text-xs">Próxima</span>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* Informações adicionais */}
              <div className="grid grid-cols-2 gap-4 mb-4">
                <div>
                  <p className="text-sm text-gray-600">Frequência</p>
                  <p className="font-medium">{medicamento.frequencia}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Duração</p>
                  <p className="font-medium">{medicamento.duracao} dias</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Doses/dia</p>
                  <p className="font-medium">{medicamento.quantidadeDoses}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Data Prescrição</p>
                  <p className="font-medium">{medicamento.dataPrescricao}</p>
                </div>
              </div>

              {/* Instruções */}
              {medicamento.instrucoes && (
                <div className="mb-4">
                  <p className="text-sm text-gray-600 mb-1">Instruções:</p>
                  <p className="text-sm bg-gray-50 p-3 rounded-lg">{medicamento.instrucoes}</p>
                </div>
              )}

              {/* Botão para marcar como tomado */}
              {medicamento.status !== "tomado" && (
                <button
                  onClick={() => marcarDoseTomada(medicamento.id)}
                  className="w-full flex items-center justify-center gap-2 bg-green-600 text-white py-2 rounded-lg hover:bg-green-700 transition mt-2"
                >
                  <CheckCircle className="w-4 h-4" />
                  Marcar como Tomado
                </button>
              )}
            </div>
          ))}
        </div>

        {/* Modal para nova receita */}
        {isModalOpen && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-xl shadow-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
              <div className="p-6">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-2xl font-bold">Nova Receita</h2>
                  <button
                    onClick={() => {
                      setIsModalOpen(false);
                      resetForm();
                    }}
                    className="text-gray-500 hover:text-gray-700"
                  >
                    ✕
                  </button>
                </div>

                <div className="space-y-6">
                  {/* Seleção de Paciente */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Paciente *
                    </label>
                    <select
                      value={novoMedicamento.paciente || ""}
                      onChange={(e) => setNovoMedicamento({
                        ...novoMedicamento,
                        paciente: e.target.value
                      })}
                      className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-600"
                      required
                    >
                      <option value="">Selecione um paciente</option>
                      {pacientes.map(paciente => (
                        <option key={paciente.id} value={paciente.nome}>
                          {paciente.nome} ({paciente.idade} anos)
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Informações do Medicamento */}
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Nome do Medicamento *
                      </label>
                      <input
                        type="text"
                        value={novoMedicamento.nome || ""}
                        onChange={(e) => setNovoMedicamento({
                          ...novoMedicamento,
                          nome: e.target.value
                        })}
                        className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-600"
                        placeholder="Ex: Paracetamol"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Dosagem *
                      </label>
                      <input
                        type="text"
                        value={novoMedicamento.dosagem || ""}
                        onChange={(e) => setNovoMedicamento({
                          ...novoMedicamento,
                          dosagem: e.target.value
                        })}
                        className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-600"
                        placeholder="Ex: 500mg"
                        required
                      />
                    </div>
                  </div>

                  {/* Configuração de Frequência e Duração */}
                  <div className="grid grid-cols-3 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Frequência
                      </label>
                      <select
                        value={novoMedicamento.frequencia || "diária"}
                        onChange={(e) => setNovoMedicamento({
                          ...novoMedicamento,
                          frequencia: e.target.value
                        })}
                        className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-600"
                      >
                        <option value="diária">Diária</option>
                        <option value="semanal">Semanal</option>
                        <option value="mensal">Mensal</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Doses por dia
                      </label>
                      <input
                        type="number"
                        min="1"
                        max="12"
                        value={novoMedicamento.quantidadeDoses || 1}
                        onChange={(e) => setNovoMedicamento({
                          ...novoMedicamento,
                          quantidadeDoses: parseInt(e.target.value)
                        })}
                        className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-600"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Duração (dias)
                      </label>
                      <input
                        type="number"
                        min="1"
                        value={novoMedicamento.duracao || 7}
                        onChange={(e) => setNovoMedicamento({
                          ...novoMedicamento,
                          duracao: parseInt(e.target.value)
                        })}
                        className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-600"
                      />
                    </div>
                  </div>

                  {/* Horários Personalizados */}
                  <div>
                    <div className="flex justify-between items-center mb-2">
                      <label className="block text-sm font-medium text-gray-700">
                        Horários de Administração
                      </label>
                      <button
                        type="button"
                        onClick={() => {
                          const horariosCalculados = calcularHorariosAutomaticos(
                            novoMedicamento.quantidadeDoses || 1,
                            novoMedicamento.duracao || 7,
                            novoMedicamento.frequencia || "diária"
                          );
                          setNovoMedicamento({
                            ...novoMedicamento,
                            horarios: horariosCalculados
                          });
                        }}
                        className="text-sm text-green-600 hover:text-green-700"
                      >
                        Calcular automaticamente
                      </button>
                    </div>
                    
                    <div className="flex gap-2 mb-3">
                      <input
                        type="time"
                        value={horarioInput}
                        onChange={(e) => setHorarioInput(e.target.value)}
                        className="px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-600"
                      />
                      <button
                        type="button"
                        onClick={adicionarHorario}
                        className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
                      >
                        Adicionar Horário
                      </button>
                    </div>

                    {/* Lista de horários */}
                    <div className="flex flex-wrap gap-2 mb-4">
                      {novoMedicamento.horarios?.map((horario, index) => (
                        <div
                          key={index}
                          className="flex items-center gap-2 bg-green-100 text-green-800 px-3 py-1 rounded-lg"
                        >
                          <Clock className="w-3 h-3" />
                          <span>{horario}</span>
                          <button
                            type="button"
                            onClick={() => removerHorario(index)}
                            className="text-red-500 hover:text-red-700"
                          >
                            ✕
                          </button>
                        </div>
                      ))}
                    </div>

                    <p className="text-sm text-gray-500">
                      {novoMedicamento.horarios?.length || 0} horário(s) definido(s)
                    </p>
                  </div>

                  {/* Instruções Adicionais */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Instruções Adicionais
                    </label>
                    <textarea
                      value={novoMedicamento.instrucoes || ""}
                      onChange={(e) => setNovoMedicamento({
                        ...novoMedicamento,
                        instrucoes: e.target.value
                      })}
                      className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-600"
                      rows={3}
                      placeholder="Ex: Tomar após as refeições, evitar álcool..."
                    />
                  </div>

                  {/* Botões do Modal */}
                  <div className="flex justify-end gap-4 pt-4 border-t">
                    <button
                      type="button"
                      onClick={() => {
                        setIsModalOpen(false);
                        resetForm();
                      }}
                      className="px-6 py-2 border rounded-lg hover:bg-gray-50"
                    >
                      Cancelar
                    </button>
                    <button
                      type="button"
                      onClick={adicionarMedicamento}
                      className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
                    >
                      Salvar Receita
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}