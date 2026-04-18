import { useRouteError } from "react-router-dom";

export function AdminErrorFallback() {
  const error = useRouteError() as Error;

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-6 text-center">
        <h2 className="text-xl font-semibold text-gray-900 mb-2">
          Erro na Rota Administrativa
        </h2>
        <p className="text-gray-600 mb-4">
          {error?.message ||
            "Ocorreu um erro inesperado na rota administrativa."}
        </p>
        <button
          onClick={() => (window.location.href = "/admin/login")}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          Voltar ao Login
        </button>
      </div>
    </div>
  );
}
