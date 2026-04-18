/* Constantes globais do projeto: categorias, províncias, status, mensagens, etc. */

// Constantes de Categorias
export const CATEGORIAS = [
  "Todos",
  "Analgésicos",
  "Antibióticos",
  "Vitaminas",
  "Antialérgicos",
  "Digestivos",
];

// Constantes de Províncias
export const PROVINCIAS = [
  "Todas",
  "Luanda",
  "Benguela",
  "Huíla",
  "Huambo",
  "Cabinda",
  "Zaire",
  "Cuanza Norte",
  "Cuanza Sul",
  "Kwanza Sul",
  "Lunda Norte",
  "Lunda Sul",
  "Malanje",
  "Moxico",
  "Namibe",
  "Uige",
];

// Constantes de Tipos de Usuário
export const USER_TYPES = [
  { value: "farmacia", label: "Farmácia", icon: "Building2" },
  { value: "entregador", label: "Entregador", icon: "Truck" },
  { value: "admin", label: "Administrador", icon: "Shield" },
];

// Status de Pedidos
export const ORDER_STATUS = {
  PENDENTE: "pendente",
  CONFIRMADO: "confirmado",
  EM_PREPARACAO: "em-preparacao",
  PRONTO: "pronto",
  EM_TRANSITO: "em-transito",
  ENTREGUE: "entregue",
  CANCELADO: "cancelado",
};

// Status de Entrega
export const DELIVERY_STATUS = {
  DISPONIVEL: "disponivel",
  ACEITO: "aceito",
  COLETANDO: "coletando",
  EM_TRANSITO: "em-transito",
  ENTREGUE: "entregue",
  CANCELADO: "cancelado",
};

// Status de Usuário
export const USER_STATUS = {
  ATIVO: "ativo",
  INATIVO: "inativo",
  SUSPENSO: "suspenso",
  PENDENTE: "pendente",
  APROVADO: "aprovado",
};

// Métodos de Pagamento
export const PAYMENT_METHODS = [
  { value: "multicaixa", label: "Multicaixa Express", icon: "CreditCard" },
  { value: "unitel", label: "Unitel Money", icon: "Smartphone" },
  { value: "entrega", label: "Pagamento na Entrega", icon: "DollarSign" },
];

// Taxas e Valores
export const FEES = {
  DELIVERY_BASE: 500, // Taxa base de entrega em Kz
  DELIVERY_PER_KM: 100, // Taxa por km em Kz
  TAX_RATE: 0.1, // 10% de imposto
};

// Horários de Funcionamento
export const OPENING_HOURS = {
  MONDAY_TO_FRIDAY: "08:00 - 18:00",
  SATURDAY: "09:00 - 13:00",
  SUNDAY: "CLOSED",
};

// Tipos de Veículos
export const VEHICLE_TYPES = ["Motocicleta", "Automóvel", "Bicicleta", "A pé"];

// Limites de Validação
export const VALIDATION = {
  MIN_PASSWORD_LENGTH: 8,
  MAX_FILE_SIZE: 5 * 1024 * 1024, // 5MB
  PHONE_REGEX: /^(\+244|0)?9\d{8}$/,
  EMAIL_REGEX: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  NIF_LENGTH: 10,
};

// Mensagens
export const MESSAGES = {
  SUCCESS: {
    LOGIN: "Login realizado com sucesso!",
    REGISTER: "Cadastro realizado com sucesso!",
    UPDATE: "Atualização realizada com sucesso!",
    DELETE: "Item removido com sucesso!",
    CREATE: "Item criado com sucesso!",
  },
  ERROR: {
    INVALID_EMAIL: "Email inválido!",
    INVALID_PHONE: "Telefone inválido!",
    INVALID_PASSWORD: "Senha deve ter no mínimo 8 caracteres!",
    REQUIRED_FIELD: "Campo obrigatório!",
    SOMETHING_WRONG: "Algo deu errado. Tente novamente!",
    NOT_FOUND: "Item não encontrado!",
  },
};

// Cores por Status
export const STATUS_COLORS = {
  pendente: "bg-yellow-100 text-yellow-700",
  confirmado: "bg-blue-100 text-blue-700",
  "em-preparacao": "bg-blue-100 text-blue-700",
  pronto: "bg-green-100 text-green-700",
  "em-transito": "bg-purple-100 text-purple-700",
  entregue: "bg-green-100 text-green-700",
  cancelado: "bg-red-100 text-red-700",
  ativo: "bg-green-100 text-green-700",
  inativo: "bg-gray-100 text-gray-700",
  suspenso: "bg-red-100 text-red-700",
};

// URLs de Imagens Padrão
export const DEFAULT_IMAGES = {
  MEDICINE:
    "https://images.unsplash.com/photo-1646392206581-2527b1cae5cb?w=400",
  PHARMACY:
    "https://images.unsplash.com/photo-1587854692152-cbe660dbde0e?w=400",
  USER: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400",
};

// Paginação
export const PAGINATION = {
  DEFAULT_PAGE_SIZE: 10,
  MAX_PAGE_SIZE: 100,
};

// Timeouts (em ms)
export const TIMEOUTS = {
  API_CALL: 5000,
  DEBOUNCE: 300,
  TOAST: 3000,
};
