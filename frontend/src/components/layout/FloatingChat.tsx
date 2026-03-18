import { MessageCircle, X, Send } from "lucide-react";
import { useState } from "react";

const GREEN = "#2c5530";
const GOLD  = "#c7a252";

export function FloatingChat() {
  const [isOpen, setIsOpen]     = useState(false);
  const [messages, setMessages] = useState<string[]>([]);
  const [input, setInput]       = useState("");

  const sendMessage = () => {
    if (!input.trim()) return;
    setMessages((prev) => [...prev, input]);
    setInput("");
    setTimeout(() => {
      setMessages((prev) => [
        ...prev,
        "👩🏾‍⚕️ TwalaCare: Obrigado pela sua mensagem! Em breve responderemos.",
      ]);
    }, 1000);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") sendMessage();
  };

  return (
    <>
      {/* ── BOTÃO FLUTUANTE ── */}
      <button
        onClick={() => setIsOpen((p) => !p)}
        className="fixed bottom-6 right-6 z-50 w-14 h-14 rounded-full flex items-center justify-center transition-all duration-300 hover:scale-110"
        style={{
          background: `linear-gradient(135deg, ${GREEN}, #4a7856)`,
          boxShadow: "0 8px 24px rgba(44,85,48,0.4)",
          border: "2px solid rgba(199,162,82,0.3)",
        }}
        title="Suporte TwalaCare"
      >
        <MessageCircle size={24} style={{ color: "#ffffff" }} />
        <span
          className="absolute top-1.5 right-1.5 w-3 h-3 rounded-full border-2 border-white"
          style={{ backgroundColor: "#4ade80", animation: "pulse 2s infinite" }}
        />
      </button>

      {/* ── MODAL CHAT ── */}
      {isOpen && (
        <div
          className="fixed bottom-24 right-6 z-50 w-80 rounded-2xl overflow-hidden flex flex-col"
          style={{
            backgroundColor: "#ffffff",
            boxShadow: "0 16px 48px rgba(0,0,0,0.15)",
            border: "1px solid rgba(44,85,48,0.12)",
            animation: "twala-slide-down 0.2s ease",
            maxHeight: 440,
          }}
        >
          {/* Header */}
          <div
            className="p-4 flex justify-between items-center flex-shrink-0"
            style={{ background: `linear-gradient(135deg, ${GREEN}, #4a7856)` }}
          >
            <div className="flex items-center gap-3">
              <div
                className="w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0"
                style={{ background: `linear-gradient(135deg, ${GOLD}, #a88235)` }}
              >
                <span style={{ color: GREEN, fontFamily: "'Poppins', sans-serif", fontWeight: 700, fontSize: 13 }}>T</span>
              </div>
              <div>
                <h3 style={{ fontFamily: "'Poppins', sans-serif", fontWeight: 600, color: "#ffffff", fontSize: 14 }}>
                  Suporte TwalaCare
                </h3>
                <div className="flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: "#4ade80" }} />
                  <p style={{ fontFamily: "'Roboto', sans-serif", fontSize: 11, color: "rgba(255,255,255,0.8)" }}>
                    Online agora
                  </p>
                </div>
              </div>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="p-1.5 rounded-full transition-colors duration-200"
              style={{ color: "rgba(255,255,255,0.8)" }}
              onMouseEnter={(e) => ((e.currentTarget as HTMLElement).style.backgroundColor = "rgba(255,255,255,0.15)")}
              onMouseLeave={(e) => ((e.currentTarget as HTMLElement).style.backgroundColor = "transparent")}
            >
              <X size={16} />
            </button>
          </div>

          {/* Mensagens */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3" style={{ backgroundColor: "#faf7f2", minHeight: 200 }}>
            {messages.length === 0 ? (
              <div className="text-center py-6">
                <div className="w-10 h-10 rounded-full mx-auto mb-3 flex items-center justify-center" style={{ backgroundColor: "rgba(44,85,48,0.08)" }}>
                  <MessageCircle className="w-5 h-5" style={{ color: GREEN }} />
                </div>
                <p style={{ fontFamily: "'Roboto', sans-serif", fontSize: 13, color: "#5a6b5a", lineHeight: 1.6 }}>
                  Como posso ajudar? Envie uma mensagem!
                </p>
              </div>
            ) : (
              messages.map((msg, i) => {
                const isBot = msg.startsWith("👩🏾‍⚕️");
                return (
                  <div key={i} className={`flex ${isBot ? "justify-start" : "justify-end"}`}>
                    <div
                      className="px-3 py-2 rounded-xl max-w-[85%]"
                      style={{
                        backgroundColor: isBot ? "#ffffff" : GREEN,
                        color: isBot ? "#2c3e2c" : "#ffffff",
                        fontFamily: "'Roboto', sans-serif",
                        fontSize: 13,
                        lineHeight: 1.5,
                        boxShadow: "0 2px 6px rgba(0,0,0,0.08)",
                        border: isBot ? "1px solid rgba(44,85,48,0.1)" : "none",
                      }}
                    >
                      {msg}
                    </div>
                  </div>
                );
              })
            )}
          </div>

          {/* Input */}
          <div
            className="p-3 flex items-center gap-2 flex-shrink-0"
            style={{ borderTop: "1px solid rgba(44,85,48,0.08)", backgroundColor: "#ffffff" }}
          >
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Escreva uma mensagem..."
              style={{
                flex: 1,
                padding: "8px 12px",
                borderRadius: 8,
                border: "1.5px solid rgba(44,85,48,0.15)",
                fontFamily: "'Roboto', sans-serif",
                fontSize: 13,
                color: "#2c3e2c",
                backgroundColor: "#faf7f2",
                outline: "none",
              }}
              onFocus={(e) => (e.currentTarget.style.borderColor = GREEN)}
              onBlur={(e) => (e.currentTarget.style.borderColor = "rgba(44,85,48,0.15)")}
            />
            <button
              onClick={sendMessage}
              disabled={!input.trim()}
              className="w-9 h-9 rounded-xl flex items-center justify-center transition-all duration-200 flex-shrink-0"
              style={{
                background: input.trim() ? `linear-gradient(135deg, ${GREEN}, #4a7856)` : "rgba(44,85,48,0.1)",
                color: input.trim() ? "#ffffff" : "#9aab9a",
              }}
            >
              <Send size={14} />
            </button>
          </div>
        </div>
      )}
    </>
  );
}
