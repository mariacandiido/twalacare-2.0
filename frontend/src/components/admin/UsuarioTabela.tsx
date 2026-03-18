import type { ReactNode, CSSProperties } from "react";

const G = "#2c5530";

export type StatusUsuario = "ATIVO" | "SUSPENSO" | "BANIDO";

const statusMap: Record<
  StatusUsuario,
  { label: string; bg: string; color: string }
> = {
  ATIVO: { label: "Ativo", bg: "rgba(44,85,48,0.1)", color: G },
  SUSPENSO: { label: "Suspenso", bg: "rgba(199,162,82,0.12)", color: "#8a6e25" },
  BANIDO: { label: "Banido", bg: "rgba(212,90,90,0.1)", color: "#a03030" },
};

export function BadgeStatusUsuario({ status }: { status: StatusUsuario }) {
  const s = statusMap[status] ?? statusMap.ATIVO;
  return (
    <span
      style={{
        padding: "3px 10px",
        borderRadius: 20,
        backgroundColor: s.bg,
        color: s.color,
        fontFamily: "'Roboto',sans-serif",
        fontSize: 11,
        fontWeight: 600,
      }}
    >
      {s.label}
    </span>
  );
}

export interface ColunaUsuario {
  key: string;
  label: string;
  render?: (valor: unknown, row: Record<string, unknown>) => ReactNode;
}

export interface UsuarioTabelaProps {
  colunas: ColunaUsuario[];
  dados: Record<string, unknown>[];
  emptyMessage?: string;
  onRowClick?: (row: Record<string, unknown>) => void;
}

function THead({ cols }: { cols: string[] }) {
  return (
    <thead>
      <tr style={{ backgroundColor: "#f8fbf8" }}>
        {cols.map((c) => (
          <th
            key={c}
            style={{
              padding: "10px 16px",
              textAlign: "left",
              fontFamily: "'Roboto',sans-serif",
              fontWeight: 600,
              fontSize: 11,
              color: "#7a8a7a",
              textTransform: "uppercase",
              letterSpacing: "0.05em",
              whiteSpace: "nowrap",
            }}
          >
            {c}
          </th>
        ))}
      </tr>
    </thead>
  );
}

function TRow({
  children,
  i,
  onClick,
}: {
  children: ReactNode;
  i: number;
  onClick?: () => void;
}) {
  return (
    <tr
      onClick={onClick}
      style={{
        borderTop: "1px solid #f0f5f0",
        backgroundColor: i % 2 === 0 ? "#fff" : "#fafdf9",
        cursor: onClick ? "pointer" : "default",
      }}
      onMouseEnter={(e) => {
        (e.currentTarget as HTMLElement).style.backgroundColor = "#f0f8f0";
      }}
      onMouseLeave={(e) => {
        (e.currentTarget as HTMLElement).style.backgroundColor =
          i % 2 === 0 ? "#fff" : "#fafdf9";
      }}
    >
      {children}
    </tr>
  );
}

const tdStyle: CSSProperties = {
  padding: "11px 16px",
  fontFamily: "'Roboto',sans-serif",
  fontSize: 13,
  color: "#2c3e2c",
  whiteSpace: "nowrap",
};

export function UsuarioTabela({
  colunas,
  dados,
  emptyMessage = "Nenhum registo encontrado.",
  onRowClick,
}: UsuarioTabelaProps) {
  return (
    <div
      style={{
        backgroundColor: "#fff",
        borderRadius: 14,
        border: "1px solid #e8f0e8",
        overflow: "hidden",
        boxShadow: "0 2px 8px rgba(44,85,48,0.06)",
      }}
    >
      <div style={{ overflowX: "auto" }}>
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <THead cols={colunas.map((c) => c.label)} />
          <tbody>
            {dados.length === 0 ? (
              <tr>
                <td
                  colSpan={colunas.length}
                  style={{
                    padding: 32,
                    textAlign: "center",
                    color: "#9aa89a",
                    fontFamily: "'Roboto',sans-serif",
                  }}
                >
                  {emptyMessage}
                </td>
              </tr>
            ) : (
              dados.map((row, i) => (
                <TRow
                  key={String(row.id ?? i)}
                  i={i}
                  onClick={
                    onRowClick
                      ? () => onRowClick(row)
                      : undefined
                  }
                >
                  {colunas.map((col) => (
                    <td key={col.key} style={tdStyle}>
                      {col.render
                        ? col.render(row[col.key], row)
                        : String(row[col.key] ?? "—")}
                    </td>
                  ))}
                </TRow>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
