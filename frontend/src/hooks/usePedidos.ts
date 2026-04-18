import { useState, useEffect } from "react";
import { pedidoService } from "../services/pedidoService";
import { type Pedido, type OrderStatus } from "../types";

export function usePedidos(clienteId?: string) {
  const [pedidos, setPedidos] = useState<Pedido[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Carregar pedidos
  const loadPedidos = async () => {
    try {
      setIsLoading(true);
      setError(null);

      let response;
      if (clienteId) {
        response = await pedidoService.getByCliente(clienteId);
      } else {
        response = await pedidoService.getAll();
      }

      if (response.success && response.data) {
        setPedidos(response.data);
      } else {
        setError(response.error || "Erro ao carregar pedidos");
      }
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : "Erro desconhecido";
      setError(errorMsg);
    } finally {
      setIsLoading(false);
    }
  };

  // Atualizar status
  const updateStatus = async (pedidoId: string, status: OrderStatus) => {
    try {
      const response = await pedidoService.updateStatus(pedidoId, status);
      if (response.success && response.data) {
        setPedidos((prev) =>
          prev.map((p) => (p.id === pedidoId ? response.data! : p)),
        );
        return true;
      } else {
        setError(response.error || "Erro ao atualizar pedido");
        return false;
      }
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : "Erro desconhecido";
      setError(errorMsg);
      return false;
    }
  };

  // Cancelar pedido
  const cancelar = async (pedidoId: string) => {
    try {
      const response = await pedidoService.cancel(pedidoId);
      if (response.success && response.data) {
        setPedidos((prev) =>
          prev.map((p) => (p.id === pedidoId ? response.data! : p)),
        );
        return true;
      } else {
        setError(response.error || "Erro ao cancelar pedido");
        return false;
      }
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : "Erro desconhecido";
      setError(errorMsg);
      return false;
    }
  };

  useEffect(() => {
    loadPedidos();
  }, [clienteId]);

  return {
    pedidos,
    isLoading,
    error,
    updateStatus,
    cancelar,
    refetch: loadPedidos,
  };
}
