import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";

export function AdminLogin() {
  const { login, isLoading, error } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    const ok = await login(email, password);
    if (ok) {
      navigate("/admin/dashboard", { replace: true });
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#f0f4f0] p-4">
      <div className="w-full max-w-md bg-white rounded-xl shadow-xl p-6">
        <h2 className="text-2xl font-bold text-[#2c5530] mb-4">
          Login Administrador
        </h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <label className="block">
            <span className="text-sm font-medium text-gray-700">Email</span>
            <input
              className="mt-1 block w-full rounded-lg border border-gray-200 p-2"
              type="email"
              placeholder="admin@twalacare.local"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </label>
          <label className="block">
            <span className="text-sm font-medium text-gray-700">Senha</span>
            <input
              className="mt-1 block w-full rounded-lg border border-gray-200 p-2"
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </label>
          {error && <p className="text-red-600 text-sm">{error}</p>}
          <button
            type="submit"
            disabled={isLoading}
            className="w-full rounded-lg bg-[#2c5530] px-4 py-2 text-white font-semibold hover:bg-[#1f3f26] disabled:opacity-50"
          >
            {isLoading ? "Carregando..." : "Entrar"}
          </button>
        </form>
      </div>
    </div>
  );
}
