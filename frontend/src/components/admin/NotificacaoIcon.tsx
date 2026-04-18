import { useState } from "react";

export function NotificacaoIcon() {
  const [hasNotifications] = useState(false); // Mock - implementar lógica real depois

  return (
    <button
      className="relative p-2 rounded-lg hover:bg-gray-100 transition-colors"
      style={{ color: "#2c5530" }}
      onClick={() => {
        // TODO: implementar dropdown de notificações
        console.log("Notificações clicked");
      }}
    >
      <svg
        width="20"
        height="20"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
        <path d="M13.73 21a2 2 0 0 1-3.46 0" />
      </svg>

      {hasNotifications && (
        <span
          className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full flex items-center justify-center"
          style={{ fontSize: "10px", color: "white", fontWeight: "bold" }}
        >
          !
        </span>
      )}
    </button>
  );
}
