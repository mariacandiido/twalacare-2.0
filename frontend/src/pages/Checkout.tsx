import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Upload, CheckCircle, CreditCard, Smartphone, Wallet } from "lucide-react";
import { useCartStore, DELIVERY_FEE } from "../store/cartStore";
import { useAuth } from "../hooks/useAuth";
import { orderService } from "../services/orderService";

const stepLabels = ["Endereço", "Receita", "Pagamento", "Revisão", "Confirmação"];

const inputStyle = {
  width: "100%",
  padding: "10px 16px",
  border: "1px solid #d5e8d6",
  borderRadius: 8,
  fontFamily: "'Roboto', sans-serif",
  fontSize: 14,
  color: "#2c3e2c",
  backgroundColor: "#ffffff",
  outline: "none",
};

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

const PAYMENT_LABELS: Record<string, string> = {
  multicaixa: "Multicaixa Express",
  unitel: "Unitel Money",
  entrega: "Pagamento na Entrega",
};

export function Checkout() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { items, getTotal, clearCart } = useCartStore();
  const [step, setStep] = useState(1);
  const [paymentMethod, setPaymentMethod] = useState<"multicaixa" | "unitel" | "entrega">("multicaixa");
  const [prescriptionUploaded, setPrescriptionUploaded] = useState(false);
  const [enderecoEntrega, setEnderecoEntrega] = useState("Luanda");
  const [pedidoIdConfirmado, setPedidoIdConfirmado] = useState<string | null>(null);

  const requiresPrescription = items.some((item) => item.requiresPrescription);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setPrescriptionUploaded(true);
    }
  };

  const [isPlacingOrder, setIsPlacingOrder] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleConfirmarPedido = async () => {
    setIsPlacingOrder(true);
    setError(null);
    try {
      const orderData = {
        items: items.map(i => ({
          medicamento_id: i.id,
          farmacia_id: i.farmaciaId,
          nome: i.name,
          preco_unitario: i.price,
          quantidade: i.quantity,
          requires_prescription: i.requiresPrescription
        })),
        subtotal: getTotal(),
        taxa_entrega: DELIVERY_FEE,
        total: getTotal() + DELIVERY_FEE,
        metodo_pagamento: PAYMENT_LABELS[paymentMethod] ?? paymentMethod,
        endereco_entrega: enderecoEntrega
      };

      const res = await orderService.create(orderData);
      if (res.success) {
        setPedidoIdConfirmado(res.data.pedido.id);
        setStep(5);
      } else {
        setError(res.error || "Erro ao realizar pedido");
      }
    } catch (err) {
      setError("Falha na conexão com o servidor");
    } finally {
      setIsPlacingOrder(false);
    }
  };

  const handleFinalizePurchase = () => {
    clearCart();
    navigate(`/cliente/acompanhar-entrega/${pedidoIdConfirmado}`);
  };

  if (items.length === 0) {
    navigate("/carrinho");
    return null;
  }

  const paymentOptions = [
    { value: "multicaixa", label: "Multicaixa Express", desc: "Pagamento através da rede Multicaixa", icon: CreditCard },
    { value: "unitel", label: "Unitel Money", desc: "Pagamento através do Unitel Money", icon: Smartphone },
    { value: "entrega", label: "Pagamento na Entrega", desc: "Pague em dinheiro quando receber", icon: Wallet },
  ];

  return (
    <div className="twala-page-enter min-h-screen py-8" style={{ backgroundColor: "#faf7f2" }}>
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 style={{ fontFamily: "'Poppins', sans-serif", fontWeight: 600, fontSize: "clamp(1.8rem, 4vw, 2.5rem)", color: "#2c3e2c", marginBottom: 4 }}>
            Finalizar Compra
          </h1>
          <div style={{ width: 60, height: 3, background: "linear-gradient(90deg, #2c5530, #c7a252)", borderRadius: 2 }} />
        </div>

        {/* Progress Steps */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            {[1, 2, 3, 4, 5].map((num) => (
              <div key={num} className="flex items-center">
                <div
                  style={{
                    width: 40,
                    height: 40,
                    borderRadius: "50%",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontFamily: "'Poppins', sans-serif",
                    fontWeight: 600,
                    fontSize: 15,
                    backgroundColor: step >= num ? "#2c5530" : "#e0e0e0",
                    color: step >= num ? "#ffffff" : "#888",
                    transition: "all 0.3s ease",
                    border: step === num ? "3px solid #c7a252" : "3px solid transparent",
                  }}
                >
                  {step > num ? "✓" : num}
                </div>
                {num < 5 && (
                  <div
                    style={{
                      height: 4,
                      flex: 1,
                      minWidth: 20,
                      backgroundColor: step > num ? "#2c5530" : "#e0e0e0",
                      transition: "background-color 0.3s ease",
                    }}
                  />
                )}
              </div>
            ))}
          </div>
          <div className="flex justify-between mt-2">
            {stepLabels.map((label, i) => (
              <span key={i} style={{ fontFamily: "'Roboto', sans-serif", fontSize: 11, color: step >= i + 1 ? "#2c5530" : "#aaa", fontWeight: step === i + 1 ? 600 : 400 }}>
                {label}
              </span>
            ))}
          </div>
        </div>

        {/* Step 1: Endereço */}
        {step === 1 && (
          <div className="twala-card p-8">
            <h2 style={{ fontFamily: "'Poppins', sans-serif", fontWeight: 600, fontSize: 22, color: "#2c3e2c", marginBottom: 24 }}>
              Endereço de Entrega
            </h2>
            <div className="space-y-4">
              <div>
                <label style={labelStyle}>Nome Completo</label>
                <input type="text" placeholder="Seu nome completo" style={inputStyle} />
              </div>
              <div>
                <label style={labelStyle}>Endereço de entrega</label>
                <input
                  type="text"
                  placeholder="Ex: Luanda, Talatona, Rua Principal 123"
                  style={inputStyle}
                  value={enderecoEntrega}
                  onChange={(e) => setEnderecoEntrega(e.target.value)}
                />
              </div>
              <div>
                <label style={labelStyle}>Telefone</label>
                <input type="tel" placeholder="+244 900 000 000" style={inputStyle} />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label style={labelStyle}>Província</label>
                  <select style={inputStyle}>
                    <option>Luanda</option>
                    <option>Benguela</option>
                    <option>Huíla</option>
                    <option>Huambo</option>
                  </select>
                </div>
                <div>
                  <label style={labelStyle}>Município</label>
                  <input type="text" placeholder="Ex: Talatona" style={inputStyle} />
                </div>
              </div>
              <div>
                <label style={labelStyle}>Endereço Completo</label>
                <textarea rows={3} placeholder="Rua, número, bairro, pontos de referência..." style={{ ...inputStyle, resize: "none", paddingTop: 10 }} />
              </div>
            </div>
            <button onClick={() => setStep(2)} className="twala-btn-primary w-full mt-6">
              Continuar
            </button>
          </div>
        )}

        {/* Step 2: Receita */}
        {step === 2 && (
          <div className="twala-card p-8">
            <h2 style={{ fontFamily: "'Poppins', sans-serif", fontWeight: 600, fontSize: 22, color: "#2c3e2c", marginBottom: 24 }}>
              Upload de Receita Médica
            </h2>
            {requiresPrescription ? (
              <div>
                <p style={{ fontFamily: "'Roboto', sans-serif", color: "#4a7856", marginBottom: 24 }}>
                  Alguns produtos no seu carrinho requerem receita médica. Por favor, faça o upload da sua receita (imagem ou PDF).
                </p>
                <div
                  style={{
                    border: "2px dashed #c7a252",
                    borderRadius: 12,
                    padding: 40,
                    textAlign: "center",
                    backgroundColor: "rgba(199,162,82,0.04)",
                  }}
                >
                  {prescriptionUploaded ? (
                    <div>
                      <CheckCircle style={{ width: 48, height: 48, color: "#2c5530", margin: "0 auto 12px" }} />
                      <p style={{ fontFamily: "'Poppins', sans-serif", fontWeight: 600, color: "#2c5530", marginBottom: 8 }}>
                        Receita enviada com sucesso!
                      </p>
                      <p style={{ fontFamily: "'Roboto', sans-serif", fontSize: 13, color: "#4a7856" }}>
                        A receita será validada pela farmácia
                      </p>
                    </div>
                  ) : (
                    <div>
                      <Upload style={{ width: 48, height: 48, color: "#c7a252", margin: "0 auto 12px" }} />
                      <p style={{ fontFamily: "'Roboto', sans-serif", color: "#4a7856", marginBottom: 16 }}>
                        Arraste seu arquivo ou clique para fazer upload
                      </p>
                      <input type="file" accept="image/*,.pdf" onChange={handleFileUpload} className="hidden" id="prescription-upload" />
                      <label htmlFor="prescription-upload" className="twala-btn-primary inline-block cursor-pointer">
                        Escolher Arquivo
                      </label>
                      <p style={{ fontFamily: "'Roboto', sans-serif", fontSize: 12, color: "#888", marginTop: 12 }}>
                        Formatos aceitos: JPG, PNG, PDF (máx. 5MB)
                      </p>
                    </div>
                  )}
                </div>
                <div className="flex gap-4 mt-6">
                  <button onClick={() => setStep(1)} className="twala-btn-outline flex-1">Voltar</button>
                  <button onClick={() => setStep(3)} disabled={!prescriptionUploaded} className="twala-btn-primary flex-1" style={!prescriptionUploaded ? { opacity: 0.5, cursor: "not-allowed" } : {}}>
                    Continuar
                  </button>
                </div>
              </div>
            ) : (
              <div>
                <p style={{ fontFamily: "'Roboto', sans-serif", color: "#4a7856", marginBottom: 24 }}>
                  Nenhum produto no seu carrinho requer receita médica. Você pode prosseguir diretamente para o pagamento.
                </p>
                <div className="flex gap-4">
                  <button onClick={() => setStep(1)} className="twala-btn-outline flex-1">Voltar</button>
                  <button onClick={() => setStep(3)} className="twala-btn-primary flex-1">Continuar</button>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Step 3: Pagamento */}
        {step === 3 && (
          <div className="twala-card p-8">
            <h2 style={{ fontFamily: "'Poppins', sans-serif", fontWeight: 600, fontSize: 22, color: "#2c3e2c", marginBottom: 24 }}>
              Método de Pagamento
            </h2>
            <div className="space-y-4 mb-6">
              {paymentOptions.map((opt) => {
                const isSelected = paymentMethod === opt.value;
                return (
                  <label
                    key={opt.value}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      padding: 16,
                      borderRadius: 10,
                      border: `2px solid ${isSelected ? "#2c5530" : "#e5e5e5"}`,
                      backgroundColor: isSelected ? "rgba(44,85,48,0.05)" : "#ffffff",
                      cursor: "pointer",
                      transition: "all 0.2s ease",
                    }}
                  >
                    <input
                      type="radio"
                      name="payment"
                      value={opt.value}
                      checked={isSelected}
                      onChange={(e) => setPaymentMethod(e.target.value as "multicaixa" | "unitel" | "entrega")}
                      style={{ accentColor: "#2c5530", width: 16, height: 16 }}
                    />
                    <opt.icon style={{ width: 22, height: 22, color: isSelected ? "#2c5530" : "#888", margin: "0 16px" }} />
                    <div>
                      <p style={{ fontFamily: "'Poppins', sans-serif", fontWeight: 600, fontSize: 15, color: "#2c3e2c", margin: 0 }}>{opt.label}</p>
                      <p style={{ fontFamily: "'Roboto', sans-serif", fontSize: 13, color: "#4a7856", margin: 0 }}>{opt.desc}</p>
                    </div>
                  </label>
                );
              })}
            </div>
            <div className="flex gap-4">
              <button onClick={() => setStep(2)} className="twala-btn-outline flex-1">Voltar</button>
              <button onClick={() => setStep(4)} className="twala-btn-primary flex-1">Continuar</button>
            </div>
          </div>
        )}

        {/* Step 4: Revisão */}
        {step === 4 && (
          <div className="twala-card p-8">
            <h2 style={{ fontFamily: "'Poppins', sans-serif", fontWeight: 600, fontSize: 22, color: "#2c3e2c", marginBottom: 24 }}>
              Revisão do Pedido
            </h2>
            <div className="space-y-6">
              <div>
                <h3 style={{ fontFamily: "'Poppins', sans-serif", fontWeight: 600, fontSize: 15, color: "#2c3e2c", marginBottom: 12 }}>Produtos</h3>
                {items.map((item) => (
                  <div key={item.id} className="flex justify-between py-2" style={{ borderBottom: "1px solid #f0f0f0" }}>
                    <span style={{ fontFamily: "'Roboto', sans-serif", color: "#2c3e2c" }}>{item.name} ×{item.quantity}</span>
                    <span style={{ fontFamily: "'Poppins', sans-serif", fontWeight: 600, color: "#2c5530" }}>{(item.price * item.quantity).toLocaleString()} Kz</span>
                  </div>
                ))}
              </div>
              <div style={{ borderTop: "2px solid #e5e5e5", paddingTop: 16 }}>
                <div className="flex justify-between py-1">
                  <span style={{ fontFamily: "'Roboto', sans-serif", color: "#4a7856" }}>Subtotal</span>
                  <span style={{ fontFamily: "'Roboto', sans-serif", color: "#2c3e2c" }}>{getTotal().toLocaleString()} Kz</span>
                </div>
                <div className="flex justify-between py-1">
                  <span style={{ fontFamily: "'Roboto', sans-serif", color: "#4a7856" }}>Taxa de entrega</span>
                  <span style={{ fontFamily: "'Roboto', sans-serif", color: "#2c3e2c" }}>500 Kz</span>
                </div>
                <div className="flex justify-between py-2 mt-2" style={{ borderTop: "1px solid #e5e5e5" }}>
                  <span style={{ fontFamily: "'Poppins', sans-serif", fontWeight: 600, color: "#2c3e2c", fontSize: 18 }}>Total</span>
                  <span style={{ fontFamily: "'Poppins', sans-serif", fontWeight: 700, color: "#2c5530", fontSize: 20 }}>{(getTotal() + 500).toLocaleString()} Kz</span>
                </div>
              </div>
              <div style={{ borderTop: "1px solid #e5e5e5", paddingTop: 16 }}>
                <h3 style={{ fontFamily: "'Poppins', sans-serif", fontWeight: 600, fontSize: 15, color: "#2c3e2c", marginBottom: 8 }}>Método de Pagamento</h3>
                <p style={{ fontFamily: "'Roboto', sans-serif", color: "#4a7856" }}>
                  {paymentMethod === "multicaixa" && "Multicaixa Express"}
                  {paymentMethod === "unitel" && "Unitel Money"}
                  {paymentMethod === "entrega" && "Pagamento na Entrega"}
                </p>
              </div>
            </div>
            {error && (
              <div
                style={{
                  padding: "12px 16px",
                  backgroundColor: "rgba(212,90,90,0.1)",
                  border: "1px solid #d45a5a",
                  borderRadius: 8,
                  color: "#d45a5a",
                  fontSize: 14,
                  marginBottom: 16,
                  fontFamily: "'Roboto', sans-serif"
                }}
              >
                {error}
              </div>
            )}
            <div className="flex gap-4 mt-8">
              <button onClick={() => setStep(3)} className="twala-btn-outline flex-1">Voltar</button>
              <button
                onClick={handleConfirmarPedido}
                disabled={isPlacingOrder}
                className="twala-btn-primary flex-1 flex items-center justify-center gap-2"
              >
                {isPlacingOrder ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    Processando...
                  </>
                ) : (
                  "Confirmar Pedido"
                )}
              </button>
            </div>
          </div>
        )}

        {/* Step 5: Confirmação */}
        {step === 5 && (
          <div className="twala-card p-8 text-center">
            <div
              style={{
                width: 80,
                height: 80,
                borderRadius: "50%",
                backgroundColor: "rgba(44,85,48,0.1)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                margin: "0 auto 24px",
                border: "3px solid #c7a252",
              }}
            >
              <CheckCircle style={{ width: 40, height: 40, color: "#2c5530" }} />
            </div>
            <h2 style={{ fontFamily: "'Poppins', sans-serif", fontWeight: 700, fontSize: "clamp(1.5rem, 3vw, 2rem)", color: "#2c3e2c", marginBottom: 12 }}>
              Pedido Confirmado!
            </h2>
            <div style={{ width: 60, height: 3, background: "linear-gradient(90deg, transparent, #c7a252, transparent)", margin: "0 auto 16px" }} />
            <p style={{ fontFamily: "'Roboto', sans-serif", color: "#4a7856", marginBottom: 32 }}>
              O seu pedido foi realizado com sucesso. Receberá uma notificação quando o entregador estiver a caminho.
            </p>
            <div
              style={{
                backgroundColor: "rgba(44,85,48,0.06)",
                border: "1px solid rgba(44,85,48,0.2)",
                borderRadius: 10,
                padding: "20px 32px",
                marginBottom: 32,
              }}
            >
              <p style={{ fontFamily: "'Roboto', sans-serif", fontSize: 13, color: "#4a7856", marginBottom: 4 }}>Número do Pedido</p>
              <p style={{ fontFamily: "'Poppins', sans-serif", fontWeight: 700, fontSize: 24, color: "#2c5530" }}>
                {pedidoIdConfirmado ?? `#TC${Date.now()}`}
              </p>
            </div>
            <button onClick={handleFinalizePurchase} className="twala-btn-primary">
              Acompanhar Pedido
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
