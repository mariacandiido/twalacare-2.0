import { useState } from "react";
import { Save, Building2, Mail, Phone, MapPin, Clock, FileText, CheckCircle } from "lucide-react";
import { FarmaciaLayout } from "../../layouts/FarmaciaLayout";
import { useAuth } from "../../hooks/useAuth";
import type { PerfilFarmacia } from "../../types/farmacia.types";

export function FarmaciaPerfil() {
  const { user, updateUser, isLoading } = useAuth();

  const [form, setForm] = useState<PerfilFarmacia>({
    nome: user?.nome ?? "Farmácia Saúde",
    email: user?.email ?? "farmacia@gmail.com",
    telefone: user?.telefone ?? "+244 900 000 002",
    endereco: (user as any)?.endereco ?? "Kilamba",
    nif: (user as any)?.nif ?? "5400000000",
    horarioAbertura: (user as any)?.horarioAbertura ?? "08:00",
    horarioFechamento: (user as any)?.horarioFechamento ?? "22:00",
    provincia: (user as any)?.provincia ?? "Luanda",
    municipio: (user as any)?.municipio ?? "Belas",
  });

  const [saved, setSaved] = useState(false);
  const [errors, setErrors] = useState<Partial<Record<keyof PerfilFarmacia, string>>>({});

  function validate(): boolean {
    const newErrors: Partial<Record<keyof PerfilFarmacia, string>> = {};
    if (!form.nome.trim()) newErrors.nome = "Nome é obrigatório";
    if (!form.email.trim() || !/\S+@\S+\.\S+/.test(form.email))
      newErrors.email = "Email inválido";
    if (!form.telefone.trim()) newErrors.telefone = "Telefone é obrigatório";
    if (!form.endereco.trim()) newErrors.endereco = "Endereço é obrigatório";
    if (!form.nif.trim()) newErrors.nif = "NIF é obrigatório";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    if (!validate()) return;
    const ok = await updateUser(form);
    if (ok) {
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    }
  }

  function handleChange(field: keyof PerfilFarmacia, value: string) {
    setForm((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) setErrors((prev) => ({ ...prev, [field]: undefined }));
  }

  const inputStyle = (field: keyof PerfilFarmacia) => ({
    width: "100%",
    padding: "10px 16px",
    border: `1px solid ${errors[field] ? "#d45a5a" : "#d5e8d6"}`,
    borderRadius: 8,
    fontFamily: "'Roboto', sans-serif",
    fontSize: 14,
    color: "#2c3e2c",
    backgroundColor: errors[field] ? "rgba(212,90,90,0.04)" : "#ffffff",
    outline: "none",
  });

  const labelStyle = {
    display: "block" as const,
    fontFamily: "'Roboto', sans-serif" as const,
    fontWeight: 500,
    fontSize: 12,
    color: "#4a7856",
    textTransform: "uppercase" as const,
    letterSpacing: "0.05em",
    marginBottom: 6,
  };

  const sectionStyle = {
    backgroundColor: "#ffffff",
    borderRadius: 12,
    boxShadow: "0 4px 6px rgba(0,0,0,0.05)",
    border: "1px solid rgba(0,0,0,0.06)",
    padding: 24,
  };

  return (
    <FarmaciaLayout>
      <div className="twala-page-enter p-6 lg:p-8" style={{ backgroundColor: "#faf7f2", minHeight: "100vh" }}>
        <div className="max-w-2xl">
          <div className="mb-8">
            <h1 style={{ fontFamily: "'Poppins', sans-serif", fontWeight: 600, fontSize: "clamp(1.4rem, 3vw, 1.8rem)", color: "#2c3e2c", marginBottom: 4 }}>
              Perfil da Farmácia
            </h1>
            <div style={{ width: 50, height: 3, background: "linear-gradient(90deg, #2c5530, #c7a252)", borderRadius: 2, marginBottom: 4 }} />
            <p style={{ fontFamily: "'Roboto', sans-serif", color: "#4a7856", fontSize: 14 }}>
              Atualize as informações da sua farmácia
            </p>
          </div>

          {/* Avatar card */}
          <div className="twala-card p-6 mb-6 flex items-center gap-5" style={{ borderBottom: "3px solid #c7a252" }}>
            <div
              style={{
                width: 64,
                height: 64,
                borderRadius: 16,
                background: "linear-gradient(135deg, #2c5530, #4a7856)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                flexShrink: 0,
                border: "2px solid #c7a252",
                boxShadow: "0 4px 12px rgba(44,85,48,0.25)",
              }}
            >
              <span style={{ fontFamily: "'Poppins', sans-serif", fontWeight: 700, fontSize: 26, color: "#ffffff" }}>
                {form.nome.charAt(0).toUpperCase()}
              </span>
            </div>
            <div>
              <p style={{ fontFamily: "'Poppins', sans-serif", fontWeight: 600, fontSize: 18, color: "#2c3e2c", margin: 0 }}>
                {form.nome}
              </p>
              <p style={{ fontFamily: "'Roboto', sans-serif", fontSize: 13, color: "#4a7856", margin: "2px 0" }}>
                {form.email}
              </p>
              <div className="flex items-center gap-2 mt-1">
                <span style={{ width: 8, height: 8, borderRadius: "50%", backgroundColor: "#2c5530", display: "inline-block" }} />
                <span style={{ fontFamily: "'Roboto', sans-serif", fontSize: 12, color: "#2c5530", fontWeight: 600 }}>Conta ativa</span>
              </div>
            </div>
          </div>

          <form onSubmit={handleSave} className="space-y-6">
            {/* Informações básicas */}
            <div style={sectionStyle}>
              <div className="flex items-center gap-2 pb-3 mb-5" style={{ borderBottom: "1px solid #f0f0f0" }}>
                <Building2 style={{ width: 18, height: 18, color: "#2c5530" }} />
                <h2 style={{ fontFamily: "'Poppins', sans-serif", fontWeight: 600, fontSize: 15, color: "#2c3e2c", margin: 0 }}>
                  Informações Básicas
                </h2>
              </div>

              <div className="space-y-4">
                <div>
                  <label style={labelStyle}>Nome da Farmácia *</label>
                  <input type="text" value={form.nome} onChange={(e) => handleChange("nome", e.target.value)} style={inputStyle("nome")} placeholder="Nome da sua farmácia" />
                  {errors.nome && <p style={{ fontFamily: "'Roboto', sans-serif", fontSize: 12, color: "#d45a5a", marginTop: 4 }}>{errors.nome}</p>}
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label style={labelStyle} className="flex items-center gap-1"><Mail style={{ width: 12, height: 12 }} /> Email *</label>
                    <input type="email" value={form.email} onChange={(e) => handleChange("email", e.target.value)} style={inputStyle("email")} placeholder="email@farmacia.com" />
                    {errors.email && <p style={{ fontFamily: "'Roboto', sans-serif", fontSize: 12, color: "#d45a5a", marginTop: 4 }}>{errors.email}</p>}
                  </div>
                  <div>
                    <label style={labelStyle} className="flex items-center gap-1"><Phone style={{ width: 12, height: 12 }} /> Telefone *</label>
                    <input type="tel" value={form.telefone} onChange={(e) => handleChange("telefone", e.target.value)} style={inputStyle("telefone")} placeholder="+244 900 000 000" />
                    {errors.telefone && <p style={{ fontFamily: "'Roboto', sans-serif", fontSize: 12, color: "#d45a5a", marginTop: 4 }}>{errors.telefone}</p>}
                  </div>
                </div>
                <div>
                  <label style={labelStyle} className="flex items-center gap-1"><FileText style={{ width: 12, height: 12 }} /> NIF *</label>
                  <input type="text" value={form.nif} onChange={(e) => handleChange("nif", e.target.value)} style={inputStyle("nif")} placeholder="Número de Identificação Fiscal" />
                  {errors.nif && <p style={{ fontFamily: "'Roboto', sans-serif", fontSize: 12, color: "#d45a5a", marginTop: 4 }}>{errors.nif}</p>}
                </div>
              </div>
            </div>

            {/* Localização */}
            <div style={sectionStyle}>
              <div className="flex items-center gap-2 pb-3 mb-5" style={{ borderBottom: "1px solid #f0f0f0" }}>
                <MapPin style={{ width: 18, height: 18, color: "#2c5530" }} />
                <h2 style={{ fontFamily: "'Poppins', sans-serif", fontWeight: 600, fontSize: 15, color: "#2c3e2c", margin: 0 }}>
                  Localização
                </h2>
              </div>
              <div className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label style={labelStyle}>Província</label>
                    <select value={form.provincia} onChange={(e) => handleChange("provincia", e.target.value)} style={inputStyle("provincia") as React.CSSProperties}>
                      {["Luanda", "Benguela", "Huambo", "Bié", "Cabinda", "Huíla", "Malanje", "Uíge"].map((p) => (
                        <option key={p} value={p}>{p}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label style={labelStyle}>Município</label>
                    <input type="text" value={form.municipio} onChange={(e) => handleChange("municipio", e.target.value)} style={inputStyle("municipio")} placeholder="Município" />
                  </div>
                </div>
                <div>
                  <label style={labelStyle}>Endereço Completo *</label>
                  <input type="text" value={form.endereco} onChange={(e) => handleChange("endereco", e.target.value)} style={inputStyle("endereco")} placeholder="Rua, número, bairro..." />
                  {errors.endereco && <p style={{ fontFamily: "'Roboto', sans-serif", fontSize: 12, color: "#d45a5a", marginTop: 4 }}>{errors.endereco}</p>}
                </div>
              </div>
            </div>

            {/* Horário */}
            <div style={sectionStyle}>
              <div className="flex items-center gap-2 pb-3 mb-5" style={{ borderBottom: "1px solid #f0f0f0" }}>
                <Clock style={{ width: 18, height: 18, color: "#2c5530" }} />
                <h2 style={{ fontFamily: "'Poppins', sans-serif", fontWeight: 600, fontSize: 15, color: "#2c3e2c", margin: 0 }}>
                  Horário de Funcionamento
                </h2>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label style={labelStyle}>Abertura</label>
                  <input type="time" value={form.horarioAbertura} onChange={(e) => handleChange("horarioAbertura", e.target.value)} style={inputStyle("horarioAbertura")} />
                </div>
                <div>
                  <label style={labelStyle}>Fechamento</label>
                  <input type="time" value={form.horarioFechamento} onChange={(e) => handleChange("horarioFechamento", e.target.value)} style={inputStyle("horarioFechamento")} />
                </div>
              </div>
            </div>

            {/* Botão salvar */}
            <div className="flex items-center gap-4">
              <button
                type="submit"
                disabled={isLoading}
                className="twala-btn-primary flex items-center gap-2"
                style={isLoading ? { opacity: 0.7, cursor: "not-allowed" } : {}}
              >
                {isLoading ? (
                  <div style={{ width: 16, height: 16, border: "2px solid rgba(255,255,255,0.3)", borderTop: "2px solid #fff", borderRadius: "50%", animation: "spin 1s linear infinite" }} />
                ) : (
                  <Save style={{ width: 16, height: 16 }} />
                )}
                {isLoading ? "A guardar..." : "Salvar Alterações"}
              </button>

              {saved && (
                <div className="flex items-center gap-2">
                  <CheckCircle style={{ width: 18, height: 18, color: "#2c5530" }} />
                  <span style={{ fontFamily: "'Roboto', sans-serif", fontSize: 14, color: "#2c5530", fontWeight: 500 }}>
                    Alterações salvas!
                  </span>
                </div>
              )}
            </div>
          </form>
        </div>
      </div>
    </FarmaciaLayout>
  );
}
