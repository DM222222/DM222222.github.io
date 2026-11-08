import {
  MessageCircle,
  X,
  Send,
  Mic,
  Paperclip,
} from "lucide-react";
import { useState, useEffect, useRef } from "react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
}

// Simulações de respostas rápidas inteligentes
const getAIResponse = (userMessage: string): string => {
  const message = userMessage.toLowerCase();

  // Alocação de demanda por CD
  if (
    message.includes("alocação") ||
    message.includes("alocar") ||
    (message.includes("demanda") && message.includes("cd"))
  ) {
    return `📊 **Alocação de demanda por CD**\n\n• **CD 2** está em 99% de ocupação e SLA 81%: risco de estourar no próximo pico.\n• **CD 5** está em 28%: tem folga para receber carga.\n\n**Recomendação:** redirecionar 15 p.p. da carga do CD 2 para o CD 5. Efeito estimado: CD 2 vai a 84% (SLA 93%) e CD 5 a 49%.\n\nVocê pode aplicar na tela Estratégico, em "Aplicar recomendação", e desfazer depois.`;
  }

  // Previsão de faturamento
  if (
    message.includes("faturamento") ||
    message.includes("receita") ||
    message.includes("previsão")
  ) {
    return `💰 **Previsão de Faturamento**\n\n📈 **Projeção Q4 2024:**\n\n• **Outubro:** R$82M (realizado)\n• **Novembro:** R$85M (projeção)\n• **Dezembro:** R$90M (projeção)\n\n**Total Q4:** R$257M\n\n🎯 **Por CD:**\n• CD 1: R$100M (39%)\n• CD 2: R$80M (31%)\n• CD 3 + CD 4: R$50M (19%)\n• CD 5: R$27M (11%)\n\n✅ Atingiremos 96% da meta anual se mantivermos crescimento de 3-4% ao mês.`;
  }

  // Contratos assinados
  if (
    message.includes("contrato") ||
    message.includes("assinado") ||
    message.includes("pipeline")
  ) {
    return `📝 **Status de Contratos Assinados**\n\n✅ **Contratos Ativos:** 127 contratos\n\n🔥 **Pipeline Atual:**\n• Em negociação: 23 contratos (R$45M potencial)\n• Aguardando assinatura: 8 contratos (R$12M)\n• Renovações Q4: 15 contratos (R$28M garantido)\n\n📊 **Top 3 Clientes:**\n1. Cliente A - R$18M/ano (14% do faturamento)\n2. Cliente B - R$15M/ano (12% do faturamento)\n3. Cliente C - R$12M/ano (9% do faturamento)\n\n💡 **Insight:** 35% do faturamento concentrado em 3 clientes - Risco de concentração moderado.`;
  }

  // Divergência de estoque
  if (
    message.includes("divergência") ||
    message.includes("divergencia") ||
    message.includes("estoque") ||
    message.includes("inventário") ||
    message.includes("inventario")
  ) {
    return `📦 **Análise de Divergência de Estoque**\n\n🔍 **Status Atual por CD:**\n\n• **CD 1:** 2.3% divergência (↓0.5% vs semana passada)\n  - 145 itens em análise\n  - Principais causas: Avaria (60%), Erro contagem (40%)\n\n• **CD 2:** 1.8% divergência - DENTRO DA META\n  - 98 itens identificados\n\n• **CD 3:** 3.1% divergência - ATENÇÃO\n  - 187 itens críticos\n  - Ação recomendada: Inventário cíclico urgente\n\n**TFA Global:** 1% (meta: <2%)\n\n✅ **Ação Imediata:** Priorizar auditoria em CD 3 - Risco de R$ 280K em perdas se não corrigido em 48h.`;
  }

  // Resposta genérica inteligente
  return `Entendi sua solicitação. Posso ajudá-lo com:\n\n📊 **Alocação de Demanda** - Otimização por CD\n💰 **Previsão de Faturamento** - Análise preditiva\n📝 **Contratos Assinados** - Status e pipeline\n📦 **Divergência de Estoque** - Análise e ações\n\nPor favor, especifique qual informação você precisa!`;
};

export function ChronusAI() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      role: "assistant",
      content:
        "Olá! Sou o Chronus AI. Como posso ajudá-lo com suas operações hoje?",
      timestamp: new Date(),
    },
  ]);
  const [inputValue, setInputValue] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({
      behavior: "smooth",
    });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = () => {
    if (!inputValue.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: "user",
      content: inputValue,
      timestamp: new Date(),
    };

    setMessages([...messages, userMessage]);
    setInputValue("");

    // Simular resposta da IA
    setTimeout(() => {
      const aiResponse: Message = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: getAIResponse(inputValue),
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, aiResponse]);
    }, 1000);
  };

  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen]);

  if (!isOpen) {
    return (
      <Button
        size="icon"
        className="fixed bottom-24 lg:bottom-6 right-6 h-14 w-14 rounded-full shadow-lg bg-primary hover:bg-primary/90 z-50"
        onClick={() => setIsOpen(true)}
      >
        <MessageCircle className="h-6 w-6" />
        <span className="sr-only">Abrir Chronus AI</span>
      </Button>
    );
  }

  return (
    <div className="fixed bottom-24 lg:bottom-6 right-6 w-[400px] max-w-[calc(100vw-3rem)] h-[600px] max-h-[calc(100vh-9rem)] md:max-h-[calc(100vh-3rem)] bg-card border rounded-lg shadow-xl flex flex-col z-50">
      <div className="flex items-center justify-between p-4 border-b flex-shrink-0">
        <div>
          <h3 className="font-semibold">Chronus AI</h3>
          <p className="text-sm text-muted-foreground">
            Assistente Inteligente
          </p>
        </div>
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setIsOpen(false)}
        >
          <X className="h-5 w-5" />
        </Button>
      </div>

      <div className="flex-1 overflow-y-auto p-4">
        <div className="space-y-4">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}
            >
              <div
                className={`max-w-[80%] rounded-lg p-3 ${
                  message.role === "user"
                    ? "bg-primary text-primary-foreground"
                    : "bg-muted"
                }`}
              >
                <p className="text-sm whitespace-pre-line">
                  {message.content}
                </p>
              </div>
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>
      </div>

      <div className="p-3 md:p-4 border-t flex-shrink-0">
        <div className="flex gap-1.5 md:gap-2">
          <Button
            variant="outline"
            size="icon"
            className="hidden md:flex flex-shrink-0"
          >
            <Paperclip className="h-4 w-4" />
          </Button>
          <Input
            placeholder="Digite sua mensagem..."
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyPress={(e) =>
              e.key === "Enter" && handleSend()
            }
            className="flex-1 min-w-0"
            ref={inputRef}
          />
          <Button
            variant="outline"
            size="icon"
            className="hidden md:flex flex-shrink-0"
          >
            <Mic className="h-4 w-4" />
          </Button>
          <Button
            size="icon"
            onClick={handleSend}
            className="flex-shrink-0"
          >
            <Send className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}