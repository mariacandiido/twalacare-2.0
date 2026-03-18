import type { ReactNode } from "react";

const G = "#2c5530";

export interface CardEstatisticaProps {
  label: string;
  valor: number | string;
  sub?: string;
  cor?: string;
  onClick?: () => void;
  children?: ReactNode;
}

export function CardEstatistica({
  label,
  valor,
  sub,
  cor = G,
  onClick,
  children,
}: CardEstatisticaProps) {
  return (
    <div
      onClick={onClick}
      role={onClick ? "button" : undefined}
      style={{
        backgroundColor: "#fff",
        borderRadius: 14,
        border: "1px solid #e8f0e8",
        padding: "20px 22px",
        boxShadow: "0 2px 8px rgba(44,85,48,0.06)",
        cursor: onClick ? "pointer" : "default",
        transition: "all 0.18s",
        borderBottom: `3px solid ${cor}`,
      }}
      onMouseEnter={(e) => {
        if (onClick) {
          (e.currentTarget as HTMLElement).style.transform = "translateY(-2px)";
          (e.currentTarget as HTMLElement).style.boxShadow =
            "0 6px 18px rgba(44,85,48,0.12)";
        }
      }}
      onMouseLeave={(e) => {
        (e.currentTarget as HTMLElement).style.transform = "translateY(0)";
        (e.currentTarget as HTMLElement).style.boxShadow =
          "0 2px 8px rgba(44,85,48,0.06)";
      }}
    >
      <p
        style={{
          fontFamily: "'Roboto',sans-serif",
          fontSize: 11,
          fontWeight: 600,
          color: "#7a8a7a",
          textTransform: "uppercase",
          letterSpacing: "0.07em",
          margin: "0 0 8px",
        }}
      >
        {label}
      </p>
      {children ?? (
        <p
          style={{
            fontFamily: "'Poppins',sans-serif",
            fontWeight: 700,
            fontSize: 32,
            color: cor,
            margin: 0,
            lineHeight: 1,
          }}
        >
          {valor}
        </p>
      )}
      {sub && (
        <p
          style={{
            fontFamily: "'Roboto',sans-serif",
            fontSize: 12,
            color: "#9aa89a",
            margin: "6px 0 0",
          }}
        >
          {sub}
        </p>
      )}
    </div>
  );
}
