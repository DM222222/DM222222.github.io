# 📋 Documentação Completa do Sistema - Torre de Controle Cliente

**Versão**: 2.0  
**Data**: Abril 2026  
**Tecnologias**: React 18+, TypeScript, Tailwind CSS v4, Recharts, Motion (Framer Motion), shadcn/ui  
**Status**: Produção

---

## 📑 Índice

1. [Visão Geral](#visão-geral)
2. [Arquitetura](#arquitetura)
3. [Estrutura de Arquivos](#estrutura-de-arquivos)
4. [Componentes Principais](#componentes-principais)
5. [Dashboards e Sessões](#dashboards-e-sessões)
6. [Sistema de Temas](#sistema-de-temas)
7. [Guia de Instalação](#guia-de-instalação)
8. [Guia de Customização](#guia-de-customização)
9. [APIs e Integrações](#apis-e-integrações)
10. [Troubleshooting](#troubleshooting)

---

## 🎯 Visão Geral

### Descrição
Dashboard de monitoramento operacional logístico mobile-first e responsivo seguindo Material 3 Design System.

### Objetivos
- Monitoramento em tempo real de KPIs operacionais
- Navegação adaptativa (sidebar desktop / bottom nav mobile)
- Sistema de alertas inteligentes
- Integração com IA conversacional (Chronus AI)
- Suporte a 3 níveis hierárquicos: C-Level, Diretoria, Gerência

### Paleta de Cores
```css
--brand-primary: #090924    /* Primary */
--brand-success: #A4F4E7    /* Success / Accent */
--brand-warning: #F4C790    /* Warning */
--brand-error: #E4626F      /* Error */
```

### Tipografia
**Fonte Principal**: Exo (Google Fonts)

---

## 🏗️ Arquitetura

### Stack Tecnológico
- **Framework**: React 18.3.1 + TypeScript
- **Estilização**: Tailwind CSS v4.0
- **Gráficos**: Recharts 2.15.0
- **Animações**: Motion (motion/react) 11.15.0
- **UI Components**: shadcn/ui
- **Ícones**: Lucide React

### Padrões de Design
- **Mobile-First**: Design responsivo prioritizando dispositivos móveis
- **Component-Based**: Componentes reutilizáveis e modulares
- **Atomic Design**: Separação clara entre UI atoms, molecules e organisms
- **Dark Mode**: Suporte nativo a tema escuro

---

## 📂 Estrutura de Arquivos

```
/
├── App.tsx                              # Componente raiz e gerenciamento de rotas
├── components/
│   ├── ChronusAI.tsx                    # Widget de IA flutuante
│   ├── DashboardHeader.tsx              # Header principal com navegação
│   ├── InsightsModal.tsx                # Modal de insights por sessão
│   ├── KPICard.tsx                      # Card reutilizável de KPI
│   ├── Login.tsx                        # Tela de login
│   ├── ResponsiveFigmaWrapper.tsx       # Wrapper para componentes Figma
│   ├── SplashScreen.tsx                 # Splash screen animada
│   ├── ThemeToggle.tsx                  # Toggle de tema claro/escuro
│   ├── figma/
│   │   └── ImageWithFallback.tsx        # Componente de imagem com fallback
│   ├── sections/
│   │   ├── AlertsDashboard.tsx          # Dashboard de alertas
│   │   ├── FinanceDashboard.tsx         # Dashboard financeiro (desktop)
│   │   ├── FinanceDashboardResponsive.tsx # Dashboard financeiro (responsive)
│   │   ├── OperationsDashboard.tsx      # Dashboard operacional (desktop)
│   │   ├── OperationsDashboardResponsive.tsx # Dashboard operacional (responsive)
│   │   ├── SalesDashboard.tsx           # Dashboard de vendas (desktop)
│   │   ├── SalesDashboardResponsive.tsx # Dashboard de vendas (responsive)
│   │   ├── StrategicDashboard.tsx       # Dashboard estratégico (desktop)
│   │   ├── StrategicDashboardResponsive.tsx # Dashboard estratégico (responsive)
│   │   ├── TacticalDashboard.tsx        # Dashboard tático (desktop)
│   │   └── TacticalDashboardResponsive.tsx # Dashboard tático (responsive)
│   └── ui/                              # Componentes shadcn/ui
│       ├── accordion.tsx
│       ├── alert.tsx
│       ├── avatar.tsx
│       ├── badge.tsx
│       ├── button.tsx
│       ├── card.tsx
│       ├── dialog.tsx
│       ├── input.tsx
│       ├── select.tsx
│       ├── tabs.tsx
│       ├── tooltip.tsx
│       └── ... (outros componentes UI)
├── imports/                             # Componentes importados do Figma
│   ├── Estrategico.tsx
│   ├── OperacionalFinanceiro.tsx
│   ├── OperacionalOperacao.tsx
│   ├── OperacionalVendas.tsx
│   ├── Tatico.tsx
│   ├── TorreDeControleFinal.tsx
│   └── svg-*.ts                         # SVGs exportados
├── styles/
│   └── globals.css                      # Estilos globais e tokens CSS
├── guidelines/
│   └── Guidelines.md                    # Guia de estilo e componentes
├── Attributions.md                      # Atribuições e licenças
├── PROMPT_SPLASH_LOGIN.md               # Documentação técnica
└── SYSTEM_CODE_DOCUMENTATION.md         # Este documento

```

---

## 🧩 Componentes Principais

### 1. App.tsx
**Responsabilidade**: Gerenciamento principal da aplicação

**Estados:**
```typescript
type UserLevel = "c-level" | "diretoria" | "gerencia";
type Section = "strategic" | "tactical" | "sales" | "finance" | "operations" | "alerts";

const [isLoggedIn, setIsLoggedIn] = useState(false);
const [showSplash, setShowSplash] = useState(false);
const [userLevel, setUserLevel] = useState<UserLevel>("gerencia");
const [currentSection, setCurrentSection] = useState<Section>("strategic");
const [sidebarOpen, setSidebarOpen] = useState(true);
const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
const [insightsModalOpen, setInsightsModalOpen] = useState(false);
```

**Fluxo de Navegação:**
```
Login → SplashScreen → Dashboard (Strategic por padrão)
```

**Navegação Desktop:**
- Sidebar colapsável à esquerda
- Toggle de colapso com ícone chevron
- Tooltips quando colapsado

**Navegação Mobile:**
- Bottom navigation fixo (5 itens principais)
- Sidebar overlay com backdrop blur

---

### 2. SplashScreen.tsx
**Duração**: 5 segundos  
**Animações**: Motion (Framer Motion)

**Recursos:**
- Background gradiente animado
- Grid de fundo em movimento
- Partículas flutuantes coloridas (success, warning, error)
- Logo com efeito pulse e glow
- Barra de progresso gradiente animada
- Texto "Torre de Controle" com gradiente deslizante
- Loading dots animados em cores diferentes

**Personalização:**
```typescript
// Ajustar duração do loading
const timer = setInterval(() => {
  setProgress((prev) => {
    if (prev >= 100) {
      clearInterval(timer);
      setTimeout(() => onFinish(), 300);
      return 100;
    }
    return prev + 2; // Alterar incremento para ajustar velocidade
  });
}, 100); // Alterar intervalo (ms)
```

---

### 3. DashboardHeader.tsx
**Props:**
```typescript
interface DashboardHeaderProps {
  onMenuClick?: () => void;        // Callback para abrir menu mobile
  showMenuButton?: boolean;        // Mostrar botão de menu
  userName?: string;               // Nome do usuário logado
  alertCount?: number;             // Contador de alertas
  onAlertClick?: () => void;       // Callback para clicar no sino de alertas
}
```

**Recursos:**
- Logo "Cliente" + "Torre de Controle"
- Toggle de tema claro/escuro
- Botão de alertas com badge contador (funcional - navega para sessão de Alertas)
- Avatar do usuário com iniciais

---

### 4. ChronusAI.tsx
**Widget de IA Conversacional**

**Características:**
- Botão flutuante no canto inferior direito
- Modal expansível com chat interface
- Input de mensagem com auto-resize
- Histórico de conversas
- Respostas automáticas mockadas
- Animações suaves de entrada/saída

**Estados:**
```typescript
const [isOpen, setIsOpen] = useState(false);
const [message, setMessage] = useState("");
const [messages, setMessages] = useState<Message[]>([]);
```

---

### 5. InsightsModal.tsx
**Modal de Insights Contextuais**

**Props:**
```typescript
interface InsightsModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  section: Section;
}
```

**Insights por Sessão:**
- **Strategic**: Receita mensal, crescimento, saturação CD
- **Tactical**: Previsão de recebimento, divergência
- **Sales**: Conversão, NPS, churn
- **Finance**: Inadimplência, tickets atrasados
- **Operations**: Taxa de ocupação, SLA, CMC

**Tipos de Alerta:**
- `warning` (amarelo)
- `success` (verde/ciano)
- `info` (azul)
- `error` (vermelho)

---

## 📊 Dashboards e Sessões

### 6 Sessões Disponíveis

#### 1. Estratégico (Strategic)
**Público**: C-Level, Diretoria  
**KPIs Principais:**
- Receita Mensal (R$ 5.2M)
- Crescimento MoM (+12%)
- Clientes Ativos (342)
- Taxa de Ocupação por CD (gauges)
- Performance de Receita (gráfico de linhas)
- Faturamento por CD (gráfico de barras)

**Componentes:**
- `/components/sections/StrategicDashboard.tsx` (desktop)
- `/components/sections/StrategicDashboardResponsive.tsx` (responsive)

---

#### 2. Tático (Tactical)
**Público**: Diretoria, Gerência  
**KPIs Principais:**
- Time-to-Cash (gráfico donut com 4 períodos)
- Previsão de Recebimento HUB (gráfico de linhas multi-CD)
- Divergência Ocupação Prevista vs Realizada (gauge)
- Performance de Faturamento por Cliente (gráfico de barras)

**Dados de CDs:**
```typescript
const previsaoRecebimentoData = [
  { mes: "JAN", cd1: 15, cd2: 10, cd3: 8, cd4: 5, cd5: 7 },
  { mes: "FEV", cd1: 18, cd2: 12, cd3: 10, cd4: 7, cd5: 9 },
  // ...
];
```

**Componentes:**
- `/components/sections/TacticalDashboard.tsx`
- `/components/sections/TacticalDashboardResponsive.tsx`

---

#### 3. Operacional - Vendas (Sales)
**Público**: Gerência  
**KPIs Principais:**
- Taxa de Conversão (74%)
- NPS (Net Promoter Score: 82)
- Churn Rate (2.3%)
- Pedidos Ativos (gráfico de área)
- Qualidade de Entrega (tabs semanal/mensal)

**Componentes:**
- `/components/sections/SalesDashboard.tsx`
- `/components/sections/SalesDashboardResponsive.tsx`

---

#### 4. Operacional - Financeiro (Finance)
**Público**: Gerência  
**KPIs Principais:**
- Inadimplência (3.2%)
- Tickets Atrasados (45)
- Fluxo de Caixa (gráfico de barras)
- Distribuição de Receita por CD (gráfico de pizza)

**Dados de Fluxo de Caixa:**
```typescript
const fluxoCaixaData = [
  { mes: "Jan", entrada: 4.2, saida: 3.8 },
  { mes: "Fev", entrada: 4.5, saida: 3.9 },
  // ...
];
```

**Componentes:**
- `/components/sections/FinanceDashboard.tsx`
- `/components/sections/FinanceDashboardResponsive.tsx`

---

#### 5. Operacional - Operação (Operations)
**Público**: Gerência  
**KPIs Principais:**
- Taxa de Ocupação por CD (5 gauges)
- CMC - Capacidade de Movimentação de Carga (25 Volumes/HH)
- SLA por CD (5 gauges)
- TFA - Termo de Faltas e Avarias (4.2%)
- Prontos para Operar (gráfico de barras empilhadas)

**Selects de Filtro:**
- Seletor de CD (CD 1, CD 2, CD 3, CD 4, CD 5)
- Seletor de Turno (Turno 1, 2, 3)

**Dados de Prontos para Operar:**
```typescript
const prontosData = [
  { periodo: "15 dias", prontos: 145, pendente: 32, naoProntos: 24 },
  { periodo: "30 dias", prontos: 98, pendente: 28, naoProntos: 57 },
  { periodo: "60 dias", prontos: 112, pendente: 45, naoProntos: 44 },
  { periodo: "90 dias", prontos: 87, pendente: 38, naoProntos: 57 },
];
```

**Componentes:**
- `/components/sections/OperationsDashboard.tsx`
- `/components/sections/OperationsDashboardResponsive.tsx`

---

#### 6. Alertas (Alerts)
**Público**: Todos os níveis  
**Categorias:**
- Críticos (error)
- Avisos (warning)
- Informativos (info)
- Positivos (success)

**Estrutura de Alerta:**
```typescript
interface Alert {
  id: string;
  type: "error" | "warning" | "info" | "success";
  title: string;
  description: string;
  timestamp: string;
  icon: LucideIcon;
  cd?: string;
}
```

**Componentes:**
- `/components/sections/AlertsDashboard.tsx`

---

## 🎨 Sistema de Temas

### CSS Variables (globals.css)

**Light Mode:**
```css
:root {
  --background: #ffffff;
  --foreground: #19213d;
  --card: #ffffff;
  --card-foreground: #19213d;
  --primary: #090924;
  --primary-foreground: #ffffff;
  --secondary: #f1f3f7;
  --secondary-foreground: #19213d;
  --muted: #f1f3f7;
  --muted-foreground: #6d758f;
  --accent: #e1e4ed;
  --accent-foreground: #19213d;
  --destructive: #E4626F;
  --destructive-foreground: #ffffff;
  --border: #e1e4ed;
  --input: #e1e4ed;
  --ring: #2388FF;
}
```

**Dark Mode:**
```css
.dark {
  --background: #0a0a0f;
  --foreground: #e4e4e7;
  --card: #18181b;
  --card-foreground: #e4e4e7;
  --primary: #A4F4E7;
  --primary-foreground: #090924;
  --secondary: #27272a;
  --secondary-foreground: #e4e4e7;
  --muted: #27272a;
  --muted-foreground: #a1a1aa;
  --accent: #3f3f46;
  --accent-foreground: #e4e4e7;
  --destructive: #E4626F;
  --destructive-foreground: #ffffff;
  --border: #27272a;
  --input: #27272a;
  --ring: #A4F4E7;
}
```

### ThemeToggle Component
```typescript
// /components/ThemeToggle.tsx
import { Moon, Sun } from "lucide-react";
import { Button } from "./ui/button";
import { useEffect, useState } from "react";

export function ThemeToggle() {
  const [theme, setTheme] = useState<"light" | "dark">("light");

  useEffect(() => {
    const root = window.document.documentElement;
    root.classList.remove("light", "dark");
    root.classList.add(theme);
  }, [theme]);

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={() => setTheme(theme === "light" ? "dark" : "light")}
    >
      {theme === "light" ? (
        <Moon className="h-5 w-5" />
      ) : (
        <Sun className="h-5 w-5" />
      )}
    </Button>
  );
}
```

---

## 🚀 Guia de Instalação

### Pré-requisitos
```bash
Node.js >= 18.0.0
npm >= 9.0.0 ou yarn >= 1.22.0
```

### Instalação

**1. Clone o repositório:**
```bash
git clone <repository-url>
cd torre-controle-cliente
```

**2. Instale as dependências:**
```bash
npm install
# ou
yarn install
```

**3. Inicie o servidor de desenvolvimento:**
```bash
npm run dev
# ou
yarn dev
```

**4. Acesse no navegador:**
```
http://localhost:5173
```

### Build para Produção
```bash
npm run build
# ou
yarn build
```

**Saída:** Arquivos estáticos na pasta `/dist`

### Deploy
```bash
# Vercel
vercel deploy

# Netlify
netlify deploy --prod

# Custom server
npm run build && serve -s dist
```

---

## 🎨 Guia de Customização

### 1. Alterar Branding

**Logo e Nome:**
```typescript
// /components/DashboardHeader.tsx
<h1 className="font-semibold">Cliente</h1> // Alterar aqui
<p className="text-xs text-muted-foreground">Torre de Controle</p>
```

**SplashScreen:**
```typescript
// /components/SplashScreen.tsx
<h1>Torre de Controle</h1> // Título principal
<p>Cliente</p> // Subtítulo
<p>Chronus Performance AI</p> // Parceria
```

---

### 2. Alterar Cores do Brand

**Método 1: CSS Variables (recomendado)**
```css
/* /styles/globals.css */
:root {
  --brand-primary: #090924;    /* Sua cor primária */
  --brand-success: #A4F4E7;    /* Cor de sucesso */
  --brand-warning: #F4C790;    /* Cor de aviso */
  --brand-error: #E4626F;      /* Cor de erro */
}
```

**Método 2: Alterar diretamente nos componentes**
```typescript
// Exemplo no SplashScreen
<div className="bg-gradient-to-br from-[#090924] to-[#0d0d3a]">
// Alterar valores hexadecimais
```

---

### 3. Adicionar Novos KPIs

**Estrutura de KPI:**
```typescript
// Exemplo em StrategicDashboardResponsive.tsx
<Card>
  <CardHeader>
    <CardTitle className="card-title">Nome do KPI</CardTitle>
    <p className="card-subtitle text-muted-foreground">Descrição</p>
  </CardHeader>
  <CardContent>
    <div className="text-4xl font-bold text-[#2388ff]">
      {valor}
    </div>
    <p className="text-sm text-muted-foreground mt-2">
      Unidade de medida
    </p>
  </CardContent>
</Card>
```

---

### 4. Adicionar Novas Sessões

**Passo 1: Criar componente do dashboard**
```typescript
// /components/sections/NovosDashboard.tsx
export function NovosDashboard({ onOpenInsights }: { onOpenInsights?: () => void }) {
  return (
    <div className="h-full flex flex-col p-4 md:p-6 lg:px-10 lg:py-4">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3 mb-4 lg:mb-5">
        <div>
          <h2 className="dashboard-title">Nova Sessão</h2>
          <p className="dashboard-subtitle text-muted-foreground">Descrição</p>
        </div>
        <Button onClick={onOpenInsights}>
          <Sparkles className="h-4 w-4" />
          Insights
        </Button>
      </div>
      {/* Seus cards aqui */}
    </div>
  );
}
```

**Passo 2: Adicionar tipo de seção**
```typescript
// /App.tsx
type Section = "strategic" | "tactical" | "sales" | "finance" | "operations" | "alerts" | "novos";
```

**Passo 3: Adicionar item de navegação**
```typescript
const navigationItems = [
  // ... itens existentes
  {
    id: "novos" as Section,
    label: "Nova Sessão",
    icon: IconeEscolhido, // Importar do lucide-react
    category: "Operacional",
  },
];
```

**Passo 4: Adicionar caso no renderContent**
```typescript
const renderContent = () => {
  switch (currentSection) {
    // ... casos existentes
    case "novos":
      return <NovosDashboard onOpenInsights={() => setInsightsModalOpen(true)} />;
    // ...
  }
};
```

---

### 5. Customizar Gráficos (Recharts)

**Gráfico de Linhas:**
```typescript
<ResponsiveContainer width="100%" height="100%">
  <LineChart data={dados}>
    <CartesianGrid strokeDasharray="3 3" />
    <XAxis dataKey="mes" />
    <YAxis />
    <Tooltip content={<CustomTooltip />} />
    <Legend />
    <Line 
      type="monotone" 
      dataKey="valor" 
      stroke="#2388FF" 
      strokeWidth={2}
      dot={{ r: 3 }}
    />
  </LineChart>
</ResponsiveContainer>
```

**Gráfico de Barras:**
```typescript
<BarChart data={dados}>
  <CartesianGrid strokeDasharray="3 3" />
  <XAxis dataKey="categoria" />
  <YAxis />
  <Tooltip />
  <Legend />
  <Bar 
    dataKey="valor" 
    fill="#2388FF" 
    radius={[8, 8, 0, 0]} 
  />
</BarChart>
```

**Gráfico de Pizza:**
```typescript
<PieChart>
  <Pie
    data={dados}
    cx="50%"
    cy="50%"
    labelLine={false}
    label={renderCustomLabel}
    outerRadius={80}
    fill="#8884d8"
    dataKey="value"
  >
    {dados.map((entry, index) => (
      <Cell key={`cell-${index}`} fill={cores[index % cores.length]} />
    ))}
  </Pie>
  <Tooltip />
</PieChart>
```

---

### 6. Adicionar Novas Animações (Motion)

**Fade In:**
```typescript
<motion.div
  initial={{ opacity: 0 }}
  animate={{ opacity: 1 }}
  transition={{ duration: 0.5 }}
>
  Conteúdo
</motion.div>
```

**Slide Up:**
```typescript
<motion.div
  initial={{ opacity: 0, y: 20 }}
  animate={{ opacity: 1, y: 0 }}
  transition={{ duration: 0.6 }}
>
  Conteúdo
</motion.div>
```

**Scale & Rotate:**
```typescript
<motion.div
  initial={{ scale: 0, rotate: -180 }}
  animate={{ scale: 1, rotate: 0 }}
  transition={{ type: "spring", stiffness: 100 }}
>
  Conteúdo
</motion.div>
```

**Loop Infinite:**
```typescript
<motion.div
  animate={{
    scale: [1, 1.1, 1],
    opacity: [0.5, 1, 0.5],
  }}
  transition={{
    duration: 2,
    repeat: Infinity,
    ease: "easeInOut",
  }}
>
  Conteúdo
</motion.div>
```

---

## 🔌 APIs e Integrações

### Estrutura de Dados Mockados

Todos os dados atualmente são mockados. Para integrar com APIs reais:

**1. Criar serviço de API:**
```typescript
// /services/api.ts
const API_BASE_URL = process.env.REACT_APP_API_URL;

export const fetchStrategicData = async () => {
  const response = await fetch(`${API_BASE_URL}/strategic`);
  return response.json();
};

export const fetchTacticalData = async () => {
  const response = await fetch(`${API_BASE_URL}/tactical`);
  return response.json();
};

// ... outros endpoints
```

**2. Usar React Query (recomendado):**
```bash
npm install @tanstack/react-query
```

```typescript
import { useQuery } from '@tanstack/react-query';

export function StrategicDashboardResponsive() {
  const { data, isLoading, error } = useQuery({
    queryKey: ['strategic'],
    queryFn: fetchStrategicData,
    refetchInterval: 30000, // Atualizar a cada 30s
  });

  if (isLoading) return <LoadingSpinner />;
  if (error) return <ErrorMessage />;

  return (
    // Render com data
  );
}
```

**3. Configurar variáveis de ambiente:**
```env
# .env
REACT_APP_API_URL=https://api.example.com
REACT_APP_API_KEY=sua-chave-api
```

---

### Integração com Chronus AI (Backend)

**Endpoint esperado:**
```
POST /api/ai/chat
Content-Type: application/json

{
  "message": "Qual a receita do mês?",
  "context": {
    "section": "strategic",
    "userLevel": "gerencia"
  }
}
```

**Resposta:**
```json
{
  "response": "A receita do mês atual é R$ 5.2M, representando um crescimento de 12% em relação ao mês anterior.",
  "suggestions": [
    "Ver detalhes por CD",
    "Comparar com mês anterior"
  ]
}
```

**Implementação no ChronusAI.tsx:**
```typescript
const handleSendMessage = async () => {
  if (!message.trim()) return;

  const userMessage: Message = {
    id: Date.now().toString(),
    text: message,
    sender: "user",
    timestamp: new Date().toLocaleTimeString(),
  };

  setMessages((prev) => [...prev, userMessage]);
  setMessage("");
  setIsTyping(true);

  try {
    const response = await fetch('/api/ai/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        message: message,
        context: { section: currentSection, userLevel }
      })
    });

    const data = await response.json();

    const aiMessage: Message = {
      id: (Date.now() + 1).toString(),
      text: data.response,
      sender: "ai",
      timestamp: new Date().toLocaleTimeString(),
    };

    setMessages((prev) => [...prev, aiMessage]);
  } catch (error) {
    console.error('AI Error:', error);
  } finally {
    setIsTyping(false);
  }
};
```

---

## 🐛 Troubleshooting

### Problema: Gráficos não renderizam

**Causa:** Recharts precisa de dimensões definidas

**Solução:**
```typescript
// Sempre usar ResponsiveContainer
<ResponsiveContainer width="100%" height={300}>
  <LineChart data={dados}>
    {/* ... */}
  </LineChart>
</ResponsiveContainer>

// Ou definir altura no container pai
<div className="h-64">
  <ResponsiveContainer width="100%" height="100%">
    {/* ... */}
  </ResponsiveContainer>
</div>
```

---

### Problema: Warnings de Duplicate Keys

**Causa:** Arrays sem IDs únicos

**Solução:**
```typescript
// ❌ Errado
const dados = [
  { mes: "Jan", valor: 10 },
  { mes: "Fev", valor: 20 },
];

// ✅ Correto
const dados = [
  { id: "jan", mes: "Jan", valor: 10 },
  { id: "fev", mes: "Fev", valor: 20 },
];

// Uso no map
{dados.map((item) => (
  <div key={item.id}>
    {item.mes}: {item.valor}
  </div>
))}
```

---

### Problema: Tema não persiste após reload

**Solução:** Usar localStorage
```typescript
export function ThemeToggle() {
  const [theme, setTheme] = useState<"light" | "dark">(() => {
    const saved = localStorage.getItem("theme");
    return (saved as "light" | "dark") || "light";
  });

  useEffect(() => {
    const root = window.document.documentElement;
    root.classList.remove("light", "dark");
    root.classList.add(theme);
    localStorage.setItem("theme", theme);
  }, [theme]);

  // ...
}
```

---

### Problema: Sidebar não fecha em mobile

**Causa:** State não sincronizado

**Solução:**
```typescript
// Garantir que onClick fecha sidebar
<Button
  onClick={() => {
    setCurrentSection(item.id);
    setSidebarOpen(false); // Adicionar esta linha
  }}
>
  {item.label}
</Button>
```

---

### Problema: Motion animations não funcionam

**Causa:** Importação incorreta

**Solução:**
```typescript
// ❌ Errado
import { motion } from "framer-motion";

// ✅ Correto (Motion 11+)
import { motion } from "motion/react";
```

---

### Problema: Imagens não carregam

**Causa:** Caminho incorreto para figma:asset

**Solução:**
```typescript
// ❌ Errado
import img from "./figma:asset/abc.png";
import img from "../figma:asset/abc.png";

// ✅ Correto
import img from "figma:asset/abc123.png";
```

---

### Problema: Build falha com erro de tipos

**Solução:**
```bash
# Limpar cache
rm -rf node_modules package-lock.json
npm install

# Verificar versões TypeScript
npm list typescript

# Reinstalar dependências de tipos
npm install --save-dev @types/react @types/react-dom
```

---

## 📦 Dependências Principais

```json
{
  "dependencies": {
    "react": "^18.3.1",
    "react-dom": "^18.3.1",
    "motion": "^11.15.0",
    "recharts": "^2.15.0",
    "lucide-react": "^0.469.0",
    "@radix-ui/react-*": "^1.0.0",
    "tailwindcss": "^4.0.0"
  },
  "devDependencies": {
    "@types/react": "^18.3.1",
    "@types/react-dom": "^18.3.1",
    "typescript": "^5.0.0",
    "vite": "^5.0.0"
  }
}
```

---

## 📝 Notas de Versão

### v2.0 (Abril 2026)
- ✅ Sistema completamente genérico (sem referências a marcas específicas)
- ✅ Nomes de CDs sintéticos (CD 1, CD 2, CD 3, CD 4, CD 5)
- ✅ Nova splash screen profissional e corporativa
- ✅ Botão de alertas funcional no header
- ✅ Correção de nomes no gráfico "Previsão de Recebimento"
- ✅ Distribuição melhorada de dados em "Prontos para Operar"
- ✅ Correção TOTAL de duplicate keys warnings em TODOS os gráficos Recharts
- ✅ Adicionados IDs únicos em todos os componentes Line e Bar do Recharts
- ✅ Adicionados IDs únicos em todos os arrays de dados (funilData, segmentosData)

### v1.0 (Março 2026)
- ✅ Implementação inicial
- ✅ 6 sessões completas (Strategic, Tactical, Sales, Finance, Operations, Alerts)
- ✅ Sistema de navegação adaptativo
- ✅ Dark mode
- ✅ Widget Chronus AI
- ✅ Sistema de insights
- ✅ Login e splash screen

---

## 🔐 Credenciais de Teste

### Login
**Níveis disponíveis:**
- C-Level (CEO)
- Diretoria (Diretor)
- Gerência (Gerente)

**Credenciais mockadas:** Qualquer combinação aceita no sistema atual

---

## 📞 Suporte e Contato

**Documentação técnica**: `/PROMPT_SPLASH_LOGIN.md`  
**Guia de componentes**: `/guidelines/Guidelines.md`  
**Atribuições**: `/Attributions.md`

---

## 📄 Licença

**Uso Interno / Adaptável**

Este sistema foi desenvolvido como template adaptável para dashboards operacionais.

---

**Última atualização**: Abril 2026  
**Versão do documento**: 2.0