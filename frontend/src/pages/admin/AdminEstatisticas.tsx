import { useEffect, useState } from "react";
import { adminService } from "../../services/adminService";

export function AdminEstatisticas() {
  const [metrics, setMetrics] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    adminService.getDashboardMetrics().then((res) => {
      if (res.success) setMetrics(res.data);
      else setError(res.error ?? "Erro ao carregar estatísticas");
    });
  }, []);

  return (
    <div>
      <h1 className="text-2xl font-bold text-[#2c5530] mb-4">Estatísticas</h1>
      {error && <p className="text-red-600">{error}</p>}
      {metrics ? (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
          <div className="rounded-lg border p-4 bg-white shadow-sm">
            <h2 className="text-sm font-medium text-gray-600">
              Pedidos por status
            </h2>
            <ul className="mt-2 space-y-1 text-sm">
              {(metrics.statusByPedido ?? []).map((item: any) => (
                <li key={item.status}>
                  {item.status}: {item._count.id}
                </li>
              ))}
            </ul>
          </div>
          <div className="rounded-lg border p-4 bg-white shadow-sm">
            <h2 className="text-sm font-medium text-gray-600">
              Farmácias por aprovação
            </h2>
            <ul className="mt-2 space-y-1 text-sm">
              {(metrics.statusByFarmacia ?? []).map(
                (item: any, index: number) => (
                  <li key={index}>
                    Aprovada: {item.aprovada ? item._count.id : 0}, Rejeitada:{" "}
                    {item.rejeitada ? item._count.id : 0}
                  </li>
                ),
              )}
            </ul>
          </div>
          <div className="rounded-lg border p-4 bg-white shadow-sm">
            <h2 className="text-sm font-medium text-gray-600">Resumo</h2>
            <p>Farmácias: {metrics.farmaciasTotal}</p>
            <p>Entregadores: {metrics.entregadoresTotal}</p>
            <p>Clientes: {metrics.clientesTotal}</p>
            <p>Pedidos: {metrics.pedidosTotal}</p>
          </div>
        </div>
      ) : (
        <p className="text-gray-500">Carregando...</p>
      )}
    </div>
  );
}
