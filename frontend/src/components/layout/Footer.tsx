import { Link } from "react-router-dom";
import { Mail, Phone, MapPin, Facebook, Instagram, Twitter } from "lucide-react";

const GREEN = "#2c5530";
const GOLD  = "#c7a252";

export function Footer() {
  return (
    <footer style={{ backgroundColor: GREEN }}>
      {/* Linha dourada de separação no topo */}
      <div style={{ height: 3, background: `linear-gradient(90deg, transparent, ${GOLD}, transparent)` }} />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">

          {/* Sobre TwalaCare */}
          <div className="md:col-span-1">
            <div className="flex items-center gap-3 mb-4">
              <div
                className="w-10 h-10 rounded-xl flex items-center justify-center shadow-md"
                style={{ background: `linear-gradient(135deg, ${GOLD}, #a88235)`, border: "1px solid rgba(255,255,255,0.2)" }}
              >
                <span style={{ color: GREEN, fontFamily: "'Poppins', sans-serif", fontWeight: 700, fontSize: 18 }}>T</span>
              </div>
              <div>
                <span style={{ fontFamily: "'Poppins', sans-serif", fontWeight: 600, color: "#ffffff", fontSize: 18 }}>
                  Twala<span style={{ color: GOLD }}>CARE</span>
                </span>
                <p style={{ fontFamily: "'Roboto', sans-serif", fontSize: 10, color: "rgba(255,255,255,0.5)", letterSpacing: "0.5px" }}>
                  Farmácias Online · Angola
                </p>
              </div>
            </div>
            <p style={{ fontFamily: "'Roboto', sans-serif", fontSize: 14, color: "rgba(255,255,255,0.7)", lineHeight: 1.7 }}>
              Sua farmácia online de confiança em Angola. Medicamentos de
              qualidade, entrega rápida e atendimento profissional.
            </p>
            {/* Redes Sociais */}
            <div className="flex items-center gap-3 mt-5">
              {[Facebook, Instagram, Twitter].map((Icon, i) => (
                <a
                  key={i}
                  href="#"
                  className="w-9 h-9 rounded-full flex items-center justify-center transition-all duration-300"
                  style={{
                    backgroundColor: "rgba(255,255,255,0.08)",
                    border: "1px solid rgba(255,255,255,0.15)",
                    color: "rgba(255,255,255,0.8)",
                  }}
                  onMouseEnter={(e) => {
                    (e.currentTarget as HTMLElement).style.backgroundColor = GOLD;
                    (e.currentTarget as HTMLElement).style.borderColor = GOLD;
                    (e.currentTarget as HTMLElement).style.color = GREEN;
                    (e.currentTarget as HTMLElement).style.transform = "translateY(-2px)";
                  }}
                  onMouseLeave={(e) => {
                    (e.currentTarget as HTMLElement).style.backgroundColor = "rgba(255,255,255,0.08)";
                    (e.currentTarget as HTMLElement).style.borderColor = "rgba(255,255,255,0.15)";
                    (e.currentTarget as HTMLElement).style.color = "rgba(255,255,255,0.8)";
                    (e.currentTarget as HTMLElement).style.transform = "translateY(0)";
                  }}
                >
                  <Icon className="w-4 h-4" />
                </a>
              ))}
            </div>
          </div>

          {/* Links Rápidos */}
          <div>
            <h3
              className="mb-4 pb-2"
              style={{
                fontFamily: "'Poppins', sans-serif",
                fontWeight: 600,
                color: "#ffffff",
                fontSize: 15,
                borderBottom: `1px solid rgba(199,162,82,0.3)`,
              }}
            >
              Links Rápidos
            </h3>
            <ul className="space-y-2.5">
              {[
                { to: "/farmacias", label: "Farmácias" },
                { to: "/farmacos",  label: "Fármacos" },
                { to: "/sobre-nos", label: "Sobre Nós" },
                { to: "/faq",       label: "FAQ" },
              ].map((link) => (
                <li key={link.to}>
                  <Link
                    to={link.to}
                    style={{ fontFamily: "'Roboto', sans-serif", fontSize: 14, color: "rgba(255,255,255,0.65)", textDecoration: "none", display: "inline-flex", alignItems: "center", gap: 6 }}
                    onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.color = GOLD; }}
                    onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.color = "rgba(255,255,255,0.65)"; }}
                  >
                    <span style={{ color: GOLD, fontSize: 10 }}>▸</span>
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Suporte */}
          <div>
            <h3
              className="mb-4 pb-2"
              style={{
                fontFamily: "'Poppins', sans-serif",
                fontWeight: 600,
                color: "#ffffff",
                fontSize: 15,
                borderBottom: `1px solid rgba(199,162,82,0.3)`,
              }}
            >
              Suporte
            </h3>
            <ul className="space-y-2.5">
              {[
                { to: "/termos",     label: "Termos de Uso" },
                { to: "/privacidade",label: "Política de Privacidade" },
                { to: "/ajuda",      label: "Central de Ajuda" },
                { to: "/contato",    label: "Contacte-nos" },
              ].map((link) => (
                <li key={link.to}>
                  <Link
                    to={link.to}
                    style={{ fontFamily: "'Roboto', sans-serif", fontSize: 14, color: "rgba(255,255,255,0.65)", textDecoration: "none", display: "inline-flex", alignItems: "center", gap: 6 }}
                    onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.color = GOLD; }}
                    onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.color = "rgba(255,255,255,0.65)"; }}
                  >
                    <span style={{ color: GOLD, fontSize: 10 }}>▸</span>
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contacto */}
          <div>
            <h3
              className="mb-4 pb-2"
              style={{
                fontFamily: "'Poppins', sans-serif",
                fontWeight: 600,
                color: "#ffffff",
                fontSize: 15,
                borderBottom: `1px solid rgba(199,162,82,0.3)`,
              }}
            >
              Contacto
            </h3>
            <ul className="space-y-3.5">
              {[
                { icon: Mail,   text: "suporte@twalacare.ao" },
                { icon: Phone,  text: "+244 900 000 000" },
                { icon: MapPin, text: "Luanda, Angola" },
              ].map(({ icon: Icon, text }) => (
                <li key={text} className="flex items-start gap-3">
                  <div
                    className="w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5"
                    style={{ backgroundColor: "rgba(199,162,82,0.15)" }}
                  >
                    <Icon className="w-3.5 h-3.5" style={{ color: GOLD }} />
                  </div>
                  <span style={{ fontFamily: "'Roboto', sans-serif", fontSize: 14, color: "rgba(255,255,255,0.7)", lineHeight: 1.5 }}>
                    {text}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Copyright */}
        <div
          className="mt-10 pt-6 flex flex-col sm:flex-row items-center justify-between gap-4"
          style={{ borderTop: "1px solid rgba(255,255,255,0.1)" }}
        >
          <p style={{ fontFamily: "'Roboto', sans-serif", fontSize: 13, color: "rgba(255,255,255,0.5)" }}>
            © 2026 TwalaCARE. Todos os direitos reservados.
          </p>
          <div className="flex items-center gap-2">
            <span className="twala-seal" style={{ fontSize: 10 }}>
              Farmácia de Confiança · Angola
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}
