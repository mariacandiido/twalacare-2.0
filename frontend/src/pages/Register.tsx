import { useState } from "react";
import { Link } from "react-router-dom";
import { User, Building2, Truck, ArrowRight } from "lucide-react";
import { ClienteRegister }    from "./register/ClienteRegister";
import { FarmaciaRegister }   from "./register/FarmaciaRegister";
import { EntregadorRegister } from "./register/EntregadorRegister";
import { GREEN, GOLD, GoldDivider } from "./register/shared";

type AccountType = "cliente" | "farmacia" | "entregador";

const PROFILES: {
  type:  AccountType;
  icon:  typeof User;
  label: string;
  desc:  string;
  badge?: string;
}[] = [
  { type: "cliente",    icon: User,      label: "Cliente",    desc: "Compre medicamentos com entrega em casa",    badge: "Mais popular" },
  { type: "farmacia",   icon: Building2, label: "Farmácia",   desc: "Venda produtos e gerencie pedidos online" },
  { type: "entregador", icon: Truck,     label: "Entregador", desc: "Faça entregas e aumente os seus rendimentos" },
];

// ─── Ecrã de seleção de perfil ────────────────────────────────────────────────
function ProfileSelection({ onSelect }: { onSelect: (t: AccountType) => void }) {
  const [selected, setSelected] = useState<AccountType>("cliente");

  return (
    <div className="min-h-screen flex items-center justify-center p-6 twala-page-enter"
      style={{ backgroundColor: "#faf7f2" }}>

      <div className="w-full max-w-md rounded-2xl p-8"
        style={{ backgroundColor: "#fff", boxShadow: "0 8px 40px rgba(0,0,0,0.08)", border: "1px solid rgba(44,85,48,0.08)" }}>

        {/* Logo */}
        <div className="flex justify-center mb-6">
          <div className="w-14 h-14 rounded-2xl flex items-center justify-center"
            style={{ background: `linear-gradient(135deg, ${GREEN}, #4a7856)` }}>
            <span style={{ color: GOLD, fontFamily: "'Poppins',sans-serif", fontWeight: 700, fontSize: 28 }}>T</span>
          </div>
        </div>

        {/* Cabeçalho */}
        <div className="text-center mb-7">
          <h2 style={{ fontFamily: "'Poppins',sans-serif", fontWeight: 600, color: "#2c3e2c", fontSize: 22 }}>
            Criar conta
          </h2>
          <p style={{ fontFamily: "'Roboto',sans-serif", color: "#5a6b5a", fontSize: 14, marginTop: 4 }}>
            Selecione o tipo de conta que pretende criar
          </p>
        </div>

        {/* Cards de seleção */}
        <div className="space-y-3 mb-7">
          {PROFILES.map(({ type, icon: Icon, label, desc, badge }) => {
            const active = selected === type;
            return (
              <button
                key={type}
                type="button"
                onClick={() => {
                  console.log("Register: Selecting", type);
                  setSelected(type);
                }}
                className="w-full flex items-center gap-4 rounded-xl text-left transition-all duration-200"
                style={{
                  padding: "14px 16px",
                  border: active ? `2px solid ${GREEN}` : "2px solid rgba(44,85,48,0.1)",
                  backgroundColor: active ? "rgba(44,85,48,0.04)" : "#fff",
                  boxShadow: active ? "0 4px 20px rgba(44,85,48,0.12)" : "none",
                }}
              >
                <div className="w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0"
                  style={{ backgroundColor: active ? GREEN : "rgba(44,85,48,0.08)" }}>
                  <Icon style={{ width: 20, height: 20, color: active ? "#fff" : "#4a7856" }} />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap mb-0.5">
                    <span style={{ fontFamily: "'Poppins',sans-serif", fontWeight: 600, fontSize: 14, color: "#2c3e2c" }}>
                      {label}
                    </span>
                    {badge && (
                      <span style={{
                        fontFamily: "'Roboto',sans-serif", fontSize: 10, fontWeight: 700,
                        backgroundColor: active ? "rgba(44,85,48,0.12)" : "rgba(44,85,48,0.06)",
                        color: GREEN, padding: "2px 8px", borderRadius: 20,
                        textTransform: "uppercase", letterSpacing: "0.5px",
                      }}>
                        {badge}
                      </span>
                    )}
                  </div>
                  <p style={{ fontFamily: "'Roboto',sans-serif", fontSize: 12, color: "#5a6b5a" }}>{desc}</p>
                </div>
                <div className="flex-shrink-0 w-5 h-5 rounded-full border-2 flex items-center justify-center"
                  style={{ borderColor: active ? GREEN : "rgba(44,85,48,0.25)", backgroundColor: active ? GREEN : "transparent" }}>
                  {active && <div className="w-2 h-2 rounded-full bg-white" />}
                </div>
              </button>
            );
          })}
        </div>

        <GoldDivider />

        
        <button
          key={`btn-${selected}`}
          type="button"
          id="btn-continuar-registo"
          onClick={() => onSelect(selected)}
          className="twala-btn-primary w-full flex items-center justify-center gap-2 mt-5 transition-all"
          style={{ padding: "13px 24px", fontSize: 15 }}
        >
          Continuar como {selected === "cliente" ? "Cliente" : selected === "farmacia" ? "Farmácia" : "Entregador"}
          <ArrowRight style={{ width: 17, height: 17 }} />
        </button>

        <div className="mt-6 pt-5 text-center" style={{ borderTop: "1px solid rgba(44,85,48,0.08)" }}>
          <p style={{ fontFamily: "'Roboto',sans-serif", fontSize: 14, color: "#5a6b5a" }}>
            Já tem uma conta?{" "}
            <Link to="/login" style={{ color: GREEN, fontWeight: 600 }} className="hover:opacity-75 transition-opacity">
              Entrar
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

// ─── Componente principal exportado ──────────────────────────────────────────
export function Register() {
  const [activeType, setActiveType] = useState<AccountType | null>(null);

  if (activeType === "cliente")    return <ClienteRegister    onBack={() => { setActiveType(null); window.scrollTo(0, 0); }} />;
  if (activeType === "farmacia")   return <FarmaciaRegister   onBack={() => { setActiveType(null); window.scrollTo(0, 0); }} />;
  if (activeType === "entregador") return <EntregadorRegister onBack={() => { setActiveType(null); window.scrollTo(0, 0); }} />;

  return <ProfileSelection onSelect={(t) => {
    console.log("Register: Final selection for sub-page:", t);
    setActiveType(t);
    window.scrollTo(0, 0);
  }} />;
}
