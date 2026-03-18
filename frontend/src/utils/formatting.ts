export * from "./formatting";
// Formatação de valores monetários
//function formatCurrency(value: number, currency: string = "Kz"): string {
 // return new Intl.NumberFormat("pt-BR", {
   // style: "currency",
   // currency: "AOA",
  //})
    //.format(value)
    //.replace("AOA", currency)
    //.trim();
//}

// Formatação de datas
export function formatDate(date: string | Date): string {
  const d = typeof date === "string" ? new Date(date) : date;
  return d.toLocaleDateString("pt-BR", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

// Formatação de datas com hora
export function formatDateTime(date: string | Date): string {
  const d = typeof date === "string" ? new Date(date) : date;
  return d.toLocaleDateString("pt-BR", {
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

// Validar email
export function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

// Validar telefone Angolano
export function isValidPhoneNumber(phone: string): boolean {
  const phoneRegex = /^(\+244|0)?9\d{8}$/;
  return phoneRegex.test(phone.replace(/\s/g, ""));
}

// Validar CPF/NIFF
export function isValidNIF(nif: string): boolean {
  return nif.length === 10 && /^\d+$/.test(nif);
}

// Capitalize primeira letra
export function capitalize(str: string): string {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

// Slug
export function toSlug(str: string): string {
  return str
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "")
    .replace(/[\s_-]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

// Truncar texto
export function truncateText(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength) + "...";
}

// Gerar ID aleatório
export function generateId(): string {
  return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
}

// Comparar datas
export function isSameDay(date1: Date, date2: Date): boolean {
  return (
    date1.getFullYear() === date2.getFullYear() &&
    date1.getMonth() === date2.getMonth() &&
    date1.getDate() === date2.getDate()
  );
}

// Status para cor
export function getStatusColor(
  status: string,
): "green" | "red" | "yellow" | "blue" | "gray" {
  const statusColors: Record<
    string,
    "green" | "red" | "yellow" | "blue" | "gray"
  > = {
    entregue: "green",
    em_transito: "blue",
    cancelado: "red",
    pendente: "yellow",
    confirmado: "blue",
    "em-preparacao": "blue",
    pronto: "green",
    ativo: "green",
    inativo: "gray",
    suspenso: "red",
  };

  return statusColors[status] || "gray";
}

// Status para ícone/label
export function getStatusLabel(status: string): string {
  const labels: Record<string, string> = {
    pendente: "Pendente",
    confirmado: "Confirmado",
    "em-preparacao": "Em Preparação",
    pronto: "Pronto",
    "em-transito": "Em Trânsito",
    entregue: "Entregue",
    cancelado: "Cancelado",
    ativo: "Ativo",
    inativo: "Inativo",
    suspenso: "Suspenso",
    "pendente-aprovacao": "Pendente de Aprovação",
  };

  return labels[status] || status;
}

// Cálcular dias desde data
export function daysSince(date: string | Date): number {
  const d = typeof date === "string" ? new Date(date) : date;
  const now = new Date();
  const diffTime = Math.abs(now.getTime() - d.getTime());
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
}

// Formatar endereço
export function formatAddress(
  provincia: string,
  municipio: string,
  endereco: string,
): string {
  return `${provincia}, ${municipio}, ${endereco}`;
}
