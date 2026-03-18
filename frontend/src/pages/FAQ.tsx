import { useState } from "react";
import { ChevronDown, ChevronUp, HelpCircle, Mail, Phone } from "lucide-react";

const faqs = [
  {
    question: "Como faço para comprar medicamentos?",
    answer: "É simples! Pesquise o medicamento desejado na página de Fármacos, adicione ao carrinho, faça upload da receita (se necessário) e finalize a compra escolhendo seu método de pagamento preferido."
  },
  {
    question: "Qual é o prazo de entrega?",
    answer: "A maioria das entregas é realizada em até 30 minutos, dependendo da sua localização e da farmácia escolhida. Você pode acompanhar o rastreamento em tempo real."
  },
  {
    question: "As farmácias são certificadas?",
    answer: "Sim! Todas as farmácias parceiras são devidamente certificadas e regulamentadas pelas autoridades angolanas de saúde."
  },
  {
    question: "Como faço upload da receita médica?",
    answer: "Durante o checkout, você será solicitado a fazer upload da sua receita (imagem ou PDF) caso algum medicamento no carrinho exija prescrição médica. A receita será validada pela farmácia antes do envio."
  },
  {
    question: "Quais métodos de pagamento são aceitos?",
    answer: "Aceitamos Multicaixa Express, Unitel Money e pagamento na entrega (dinheiro). Você pode escolher o método mais conveniente no checkout."
  },
  {
    question: "Posso rastrear meu pedido?",
    answer: "Sim! Após a confirmação do pedido, você poderá rastrear a entrega em tempo real através do seu dashboard de cliente."
  },
  {
    question: "O que acontece se o medicamento não estiver disponível?",
    answer: "Se um medicamento não estiver em stock, você será notificado imediatamente. Você pode optar por esperar a reposição ou escolher outra farmácia que tenha o produto."
  },
  {
    question: "Como funciona o atendimento farmacêutico online?",
    answer: "Você pode tirar dúvidas com farmacêuticos qualificados através de chat ou videochamada diretamente na plataforma. O serviço está disponível durante o horário comercial."
  },
  {
    question: "Posso devolver um medicamento?",
    answer: "Por questões de segurança e legislação sanitária, medicamentos não podem ser devolvidos após a entrega. Certifique-se de revisar seu pedido antes de finalizar."
  },
  {
    question: "Como me torno um entregador TwalaCare?",
    answer: "Acesse a página de login, selecione 'Entregador' e complete o cadastro com seus dados pessoais, informações do veículo e documentos necessários. Após validação manual pela equipe, você poderá começar a receber entregas."
  },
];

export function FAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <div className="twala-page-enter min-h-screen" style={{ backgroundColor: "#faf7f2" }}>
      {/* Hero Section */}
      <div style={{ background: "linear-gradient(135deg, #2c5530 0%, #4a7856 100%)" }} className="py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="flex justify-center mb-4">
            <div
              style={{
                width: 64,
                height: 64,
                borderRadius: "50%",
                backgroundColor: "rgba(199,162,82,0.2)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                border: "2px solid rgba(199,162,82,0.5)",
              }}
            >
              <HelpCircle style={{ color: "#c7a252", width: 32, height: 32 }} />
            </div>
          </div>
          <h1
            style={{
              fontFamily: "'Poppins', sans-serif",
              fontWeight: 600,
              fontSize: "clamp(2rem, 5vw, 3rem)",
              color: "#ffffff",
              marginBottom: 16,
            }}
          >
            Perguntas Frequentes
          </h1>
          <div style={{ width: 80, height: 3, background: "linear-gradient(90deg, transparent, #c7a252, transparent)", margin: "0 auto 16px" }} />
          <p style={{ fontFamily: "'Roboto', sans-serif", color: "rgba(255,255,255,0.85)", fontSize: 18 }}>
            Encontre respostas para as dúvidas mais comuns sobre a TwalaCare
          </p>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* FAQ Items */}
        <div className="space-y-4 mb-16">
          {faqs.map((faq, index) => (
            <div
              key={index}
              className="twala-card overflow-hidden"
              style={{
                borderBottom: openIndex === index ? "2px solid #c7a252" : "2px solid transparent",
                transition: "all 0.3s ease",
              }}
            >
              <button
                onClick={() => setOpenIndex(openIndex === index ? null : index)}
                className="w-full flex items-center justify-between p-6 text-left"
                style={{ background: "none", border: "none", cursor: "pointer" }}
                onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.backgroundColor = "rgba(44,85,48,0.03)"; }}
                onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.backgroundColor = "transparent"; }}
              >
                <span
                  style={{
                    fontFamily: "'Poppins', sans-serif",
                    fontWeight: 500,
                    fontSize: 16,
                    color: "#2c3e2c",
                    paddingRight: 16,
                  }}
                >
                  {faq.question}
                </span>
                <div
                  style={{
                    width: 32,
                    height: 32,
                    borderRadius: "50%",
                    backgroundColor: openIndex === index ? "#2c5530" : "#f5f5f5",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    flexShrink: 0,
                    transition: "all 0.3s ease",
                  }}
                >
                  {openIndex === index ? (
                    <ChevronUp style={{ color: "#ffffff", width: 16, height: 16 }} />
                  ) : (
                    <ChevronDown style={{ color: "#2c5530", width: 16, height: 16 }} />
                  )}
                </div>
              </button>

              {openIndex === index && (
                <div
                  style={{ padding: "0 24px 24px 24px" }}
                >
                  <div style={{ height: 1, backgroundColor: "#e5e5e5", marginBottom: 16 }} />
                  <p style={{ fontFamily: "'Roboto', sans-serif", color: "#4a7856", fontSize: 15, lineHeight: 1.7 }}>
                    {faq.answer}
                  </p>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Contact Section */}
        <div
          style={{
            background: "linear-gradient(135deg, #2c5530 0%, #4a7856 100%)",
            borderRadius: 12,
            padding: "48px 32px",
            textAlign: "center",
            position: "relative",
            overflow: "hidden",
          }}
        >
          <div
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              right: 0,
              height: 4,
              background: "linear-gradient(90deg, transparent, #c7a252, transparent)",
            }}
          />
          <h2
            style={{
              fontFamily: "'Poppins', sans-serif",
              fontWeight: 600,
              fontSize: "clamp(1.4rem, 3vw, 1.8rem)",
              color: "#ffffff",
              marginBottom: 12,
            }}
          >
            Ainda tem dúvidas?
          </h2>
          <p style={{ fontFamily: "'Roboto', sans-serif", color: "rgba(255,255,255,0.8)", marginBottom: 32, fontSize: 16 }}>
            A nossa equipa está pronta para ajudar você
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="mailto:suporte@twalacare.ao"
              className="twala-btn-primary inline-flex items-center justify-center gap-2"
              style={{ backgroundColor: "#c7a252", borderColor: "#c7a252", color: "#2c3e2c" }}
              onMouseEnter={e => { (e.currentTarget as HTMLAnchorElement).style.backgroundColor = "#b8924a"; }}
              onMouseLeave={e => { (e.currentTarget as HTMLAnchorElement).style.backgroundColor = "#c7a252"; }}
            >
              <Mail style={{ width: 18, height: 18 }} />
              Enviar Email
            </a>
            <a
              href="tel:+244900000000"
              className="twala-btn-outline inline-flex items-center justify-center gap-2"
              style={{ borderColor: "#ffffff", color: "#ffffff" }}
              onMouseEnter={e => {
                (e.currentTarget as HTMLAnchorElement).style.backgroundColor = "rgba(255,255,255,0.1)";
              }}
              onMouseLeave={e => {
                (e.currentTarget as HTMLAnchorElement).style.backgroundColor = "transparent";
              }}
            >
              <Phone style={{ width: 18, height: 18 }} />
              Ligar Agora
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
