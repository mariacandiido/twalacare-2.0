import { useEffect, useState } from "react";
import { adminService } from "../../services/adminService";

export function AdminDashboard() {
  const [metrics, setMetrics] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    adminService.getDashboardMetrics().then((res) => {
      if (res.success) {
        setMetrics(res.data);
      } else {
        setError(res.error ?? "Falha ao carregar métricas");
      }
    });
  }, []);

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold text-[#2c5530]">
        Painel do Administrador
      </h1>
      {error && <p className="text-red-600">{error}</p>}
      {!metrics && !error && (
        <p className="text-sm text-gray-500">Carregando métricas...</p>
      )}
      {metrics && (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {[
            { label: "Farmácias cadastradas", value: metrics.farmaciasTotal },
            {
              label: "Entregadores cadastrados",
              value: metrics.entregadoresTotal,
            },
            { label: "Clientes cadastrados", value: metrics.clientesTotal },
            { label: "Pedidos totais", value: metrics.pedidosTotal },
            { label: "Pedidos pendentes", value: metrics.pedidosPendentes },
          ].map((item) => (
            <div
              key={item.label}
              className="rounded-lg border border-gray-200 bg-white p-4 shadow-sm"
            >
              <p className="text-xs uppercase text-gray-500">{item.label}</p>
              <p className="mt-2 text-3xl font-bold text-[#2c5530]">
                {item.value}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
