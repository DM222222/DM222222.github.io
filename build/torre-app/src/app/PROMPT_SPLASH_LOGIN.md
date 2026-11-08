# PROMPT - Páginas de Abertura e Login - Torre de Controle

## 📋 OBJETIVO
Criar páginas de Splash Screen (abertura) e Login para dashboard operacional seguindo Material 3 Design System com identidade visual corporativa.

---

## 🎨 DESIGN SYSTEM

### Paleta de Cores Corporativa
```css
--brand-primary: #090924;    /* Azul escuro profundo */
--brand-success: #A4F4E7;    /* Verde água */
--brand-warning: #F4C790;    /* Laranja suave */
--brand-error: #E4626F;      /* Vermelho coral */
```

### Tipografia
- **Fonte**: Exo (Google Fonts)
- **Pesos**: 300, 400, 500, 600, 700, 800
- **Importação**: 
```css
@import url('https://fonts.googleapis.com/css2?family=Exo:wght@300;400;500;600;700;800&display=swap');
```

### Sistema de Cores (Modo Claro e Escuro)

**Light Mode:**
```css
--background: #ffffff;
--foreground: oklch(0.145 0 0);
--card: #ffffff;
--primary: #090924;
--primary-foreground: #ffffff;
--border: rgba(0, 0, 0, 0.1);
```

**Dark Mode:**
```css
--background: #090924;
--foreground: #ffffff;
--card: #1a1a3e;
--primary: #ffffff;
--primary-foreground: #090924;
--border: rgba(255, 255, 255, 0.15);
```

---

## 🖼️ COMPONENTE 1: SPLASH SCREEN

### Especificações Técnicas

**Arquivo**: `/components/SplashScreen.tsx`

**Props Interface**:
```typescript
interface SplashScreenProps {
  onFinish: () => void;
}
```

### Layout e Estrutura

**Container Principal**:
- Fullscreen fixo (`fixed inset-0`)
- Background: `#090924` (mesmo em dark mode)
- Z-index: 50
- Flex centralizado (items-center justify-center)

**Grid de Fundo Sutil**:
- Opacidade: 0.02
- Grid com linhas de cor `#A4F4E7`
- Tamanho do grid: 60px x 60px
- Implementação com `linear-gradient`

**Elementos Visuais (em ordem vertical)**:

1. **Texto Principal**
   - Título: "Torre de Controle"
   - Tamanho Mobile: text-3xl
   - Tamanho Desktop (md:): text-4xl
   - Peso: font-bold
   - Cor: white
   - Animação: fade-in + slide-up (y: 10 → 0)
   - Delay: 0.2s

2. **Subtítulo**
   - Texto: "Cliente"
   - Tamanho Mobile: text-base
   - Tamanho Desktop (md:): text-lg
   - Cor: `#A4F4E7`
   - Spacing: space-y-2 entre título e subtítulo

3. **Parceria**
   - Label: "em parceria com"
   - Tamanho: text-sm
   - Cor: gray-400
   - Nome: "Chronus Performance AI"
   - Tamanho Nome Mobile: text-base
   - Tamanho Nome Desktop (md:): text-lg
   - Cor Nome: white/90
   - Peso Nome: font-semibold
   - Animação: fade-in
   - Delay: 0.4s

4. **Barra de Progresso**
   - Largura Mobile: w-64
   - Largura Desktop (md:): w-80
   - Max-width: max-w-sm
   - Altura da barra: h-1
   - Background: white/10
   - Barra ativa: `#A4F4E7`
   - Rounded: rounded-full
   - Animação: fade-in
   - Delay: 0.6s
   - Texto abaixo: "Carregando sistema..."
   - Cor texto: gray-500
   - Tamanho texto: text-xs
   - Margin-top texto: mt-3

### Comportamento do Progresso

**Lógica de Incremento**:
```typescript
- Duração total: ~5 segundos
- Intervalo: 100ms
- Incremento: +2% por tick
- Total de ticks: 50 (para atingir 100%)
- Callback onFinish: executado após 100% + delay de 300ms
```

**useEffect Implementation**:
```typescript
useEffect(() => {
  const timer = setInterval(() => {
    setProgress((prev) => {
      if (prev >= 100) {
        clearInterval(timer);
        setTimeout(() => onFinish(), 300);
        return 100;
      }
      return prev + 2;
    });
  }, 100);

  return () => clearInterval(timer);
}, [onFinish]);
```

### Bibliotecas Necessárias
```typescript
import { motion } from "motion/react";
```

### Animações Motion

**Texto Principal**:
```typescript
initial={{ opacity: 0, y: 10 }}
animate={{ opacity: 1, y: 0 }}
transition={{ duration: 0.6, delay: 0.2 }}
```

**Parceria**:
```typescript
initial={{ opacity: 0 }}
animate={{ opacity: 1 }}
transition={{ duration: 0.6, delay: 0.4 }}
```

**Barra de Progresso**:
```typescript
initial={{ opacity: 0 }}
animate={{ opacity: 1 }}
transition={{ duration: 0.4, delay: 0.6 }}
```

**Progresso da Barra**:
```typescript
style={{ width: `${progress}%` }}
transition={{ duration: 0.1 }}
```

**NOTA IMPORTANTE**: O logo foi removido da splash screen. Apenas texto e animações são exibidos.

---

## 🔐 COMPONENTE 2: LOGIN

### Especificações Técnicas

**Arquivo**: `/components/Login.tsx`

**Props Interface**:
```typescript
interface LoginProps {
  onLogin: (userLevel: "c-level" | "diretoria" | "gerencia") => void;
}
```

### Layout e Estrutura

**Container Principal**:
- Fullscreen: `min-h-screen`
- Flex centralizado: `flex items-center justify-center`
- Background: `bg-gradient-to-br from-primary via-primary/90 to-primary/80`
- Padding: p-4 (para responsividade)

**Card de Login**:
- Largura: `w-full max-w-md`
- Componente: shadcn/ui Card
- Background: Automático conforme tema
- Border-radius: Padrão do sistema (0.5rem)

### Header do Card

**Estrutura**:
- Espaçamento: `space-y-4`
- Layout do ícone + título: `flex items-center justify-center gap-3`

**Ícone**:
- Componente: `Building2` (lucide-react)
- Tamanho: `h-10 w-10`
- Cor: `text-primary`

**Título**:
- CardTitle: "Cliente"
- Tamanho: text-2xl
- CardDescription: "Torre de Controle"

### Formulário - Estados

**Estado 1: Login Inicial**

Campos:
1. **Usuário**
   - Label: "Usuário"
   - Input type: text
   - Placeholder: "Digite seu usuário"
   - Required: true
   - ID: "username"

2. **Senha**
   - Label: "Senha"
   - Input type: password
   - Placeholder: "Digite sua senha"
   - Required: true
   - ID: "password"

Botão:
- Texto: "Continuar"
- Type: submit
- Variant: default
- Width: w-full

**Estado 2: Two-Factor Authentication (2FA)**

Campo:
- Label: "Código de Autenticação"
- Input type: text
- Placeholder: "Digite o código enviado"
- Required: true
- maxLength: 6
- ID: "2fa"

Texto auxiliar:
- "Código enviado para seu dispositivo"
- Tamanho: text-sm
- Cor: text-muted-foreground

Botões:
1. **Verificar**
   - Texto: "Verificar e Entrar"
   - Type: submit
   - Width: w-full

2. **Voltar**
   - Texto: "Voltar"
   - Type: button
   - Variant: ghost
   - Width: w-full
   - onClick: volta para estado 1

### Lógica de Autenticação

**handleSubmit Function**:
```typescript
const handleSubmit = (e: React.FormEvent) => {
  e.preventDefault();
  
  if (!showTwoFactor) {
    // Primeira etapa: ativa 2FA
    setShowTwoFactor(true);
  } else {
    // Segunda etapa: determina nível do usuário
    let userLevel: "c-level" | "diretoria" | "gerencia" = "gerencia";
    
    if (username.toLowerCase().includes("ceo") || 
        username.toLowerCase().includes("diretor")) {
      userLevel = "c-level";
    } else if (username.toLowerCase().includes("gerente")) {
      userLevel = "diretoria";
    }
    
    onLogin(userLevel);
  }
};
```

**Estados do Componente**:
```typescript
const [username, setUsername] = useState("");
const [password, setPassword] = useState("");
const [twoFactorCode, setTwoFactorCode] = useState("");
const [showTwoFactor, setShowTwoFactor] = useState(false);
```

### Espaçamento e Layout

**Form**:
- Espaçamento entre elementos: `space-y-4`

**Campos individuais**:
- Container: `div className="space-y-2"`
- Label + Input

**Componentes UI Utilizados**:
```typescript
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Building2 } from "lucide-react";
```

---

## 🔄 INTEGRAÇÃO NO APP PRINCIPAL

### Fluxo de Estados no App.tsx

**Estados necessários**:
```typescript
const [isLoggedIn, setIsLoggedIn] = useState(false);
const [showSplash, setShowSplash] = useState(false);
const [userLevel, setUserLevel] = useState<UserLevel>("gerencia");
```

**Tipos**:
```typescript
type UserLevel = "c-level" | "diretoria" | "gerencia";
```

### Funções de Controle

**handleLogin**:
```typescript
const handleLogin = (level: UserLevel) => {
  setUserLevel(level);
  setShowSplash(true);
  // Opcional: setCurrentSection("strategic");
};
```

**handleSplashFinish**:
```typescript
const handleSplashFinish = () => {
  setShowSplash(false);
  setIsLoggedIn(true);
  // Opcional: setSidebarOpen(true);
};
```

### Renderização Condicional

```typescript
if (!isLoggedIn && !showSplash) {
  return <Login onLogin={handleLogin} />;
}

if (showSplash) {
  return <SplashScreen onFinish={handleSplashFinish} />;
}

// ... resto do dashboard
```

---

## 📦 DEPENDÊNCIAS

### Bibliotecas Necessárias
```json
{
  "motion": "^latest",
  "lucide-react": "^latest",
  "@radix-ui/react-*": "shadcn/ui components"
}
```

### Componentes shadcn/ui
- Button
- Input
- Label
- Card (CardContent, CardDescription, CardHeader, CardTitle)

### Importações
```typescript
import { motion } from "motion/react";
import { Building2 } from "lucide-react";
```

---

## 🎯 RESPONSIVIDADE

### Breakpoints Utilizados

**Mobile-first approach**:
- Base: Mobile (< 768px)
- md: Desktop (≥ 768px)

### Classes Responsivas por Componente

**SplashScreen**:
- Título: `text-3xl md:text-4xl`
- Subtítulo: `text-base md:text-lg`
- Parceria nome: `text-base md:text-lg`
- Barra progresso: `w-64 md:w-80`

**Login**:
- Card: `w-full max-w-md` (responsivo por padrão)
- Padding externo: p-4 (garante espaço em mobile)

---

## ✅ CHECKLIST DE IMPLEMENTAÇÃO

### SplashScreen
- [ ] Criar componente com interface TypeScript
- [ ] Configurar fullscreen com background #090924
- [ ] Implementar grid sutil de fundo (opacity 0.02)
- [ ] Adicionar título "Torre de Controle" com animação
- [ ] Adicionar subtítulo "Cliente" em #A4F4E7
- [ ] Adicionar texto de parceria "Chronus Performance AI"
- [ ] Implementar barra de progresso funcional
- [ ] Configurar lógica de incremento (100ms, +2%)
- [ ] Adicionar callback onFinish após 100% + 300ms delay
- [ ] Testar todas as animações e timings
- [ ] Validar responsividade mobile/desktop

### Login
- [ ] Criar componente com interface TypeScript
- [ ] Configurar background gradient com primary
- [ ] Criar card centralizado (max-w-md)
- [ ] Adicionar header com ícone Building2 + título
- [ ] Implementar formulário com campos usuário/senha
- [ ] Adicionar estado de 2FA
- [ ] Implementar lógica de dois passos (login → 2FA)
- [ ] Configurar detecção de nível de usuário (keyword-based)
- [ ] Adicionar botão "Voltar" no estado 2FA
- [ ] Testar fluxo completo de login
- [ ] Validar responsividade e acessibilidade
- [ ] Garantir todos os campos com labels apropriados

### Integração
- [ ] Criar estados no App.tsx (isLoggedIn, showSplash, userLevel)
- [ ] Implementar handleLogin function
- [ ] Implementar handleSplashFinish function
- [ ] Configurar renderização condicional
- [ ] Testar fluxo completo: Login → Splash → Dashboard
- [ ] Validar transições entre estados

---

## 🎨 ASSETS NECESSÁRIOS

### Imagem do Logo
- **Formato**: PNG com transparência
- **Dimensões sugeridas**: 400x400px (mínimo)
- **Importação**: Via `figma:asset` scheme
```typescript
import logo from "figma:asset/[hash].png";
```

**Observação**: Se você não tiver o logo no projeto, use o componente `Building2` do lucide-react temporariamente:
```typescript
import { Building2 } from "lucide-react";

// No render:
<Building2 className="w-[160px] h-[160px] md:w-[200px] md:h-[200px] text-[#A4F4E7]" />
```

---

## 💡 NOTAS IMPORTANTES

### Acessibilidade
- Todos os inputs devem ter labels associados
- Usar htmlFor no Label com id correspondente no Input
- Botões devem ter type definido (submit/button)
- Formulário deve ter onSubmit com preventDefault

### Performance
- useEffect deve incluir dependências corretas
- clearInterval no cleanup do useEffect
- Animações com CSS transform (performático)
- Motion.div para animações complexas

### UX
- Auto-focus não é necessário (pode causar problemas em mobile)
- Feedback visual claro em cada estado
- Transições suaves entre estados
- Loading state visível (barra de progresso)

### Segurança
- Simulação de 2FA (não é real security)
- Detecção de nível por keyword (apenas demo)
- Em produção: integrar com API real

---

## 🚀 EXEMPLO DE USO

```typescript
// App.tsx
import { useState } from "react";
import { Login } from "./components/Login";
import { SplashScreen } from "./components/SplashScreen";

type UserLevel = "c-level" | "diretoria" | "gerencia";

export default function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [showSplash, setShowSplash] = useState(false);
  const [userLevel, setUserLevel] = useState<UserLevel>("gerencia");

  const handleLogin = (level: UserLevel) => {
    setUserLevel(level);
    setShowSplash(true);
  };

  const handleSplashFinish = () => {
    setShowSplash(false);
    setIsLoggedIn(true);
  };

  if (!isLoggedIn && !showSplash) {
    return <Login onLogin={handleLogin} />;
  }

  if (showSplash) {
    return <SplashScreen onFinish={handleSplashFinish} />;
  }

  return (
    <div className="min-h-screen bg-background">
      <h1>Dashboard Principal - Nível: {userLevel}</h1>
      {/* Resto do conteúdo do dashboard */}
    </div>
  );
}
```

---

## 🎯 RESULTADO ESPERADO

### Fluxo Completo
1. **Usuário acessa aplicação** → Vê tela de Login
2. **Preenche credenciais** → Clica em "Continuar"
3. **Sistema simula envio 2FA** → Mostra campo de código
4. **Usuário "preenche" código** → Clica em "Verificar e Entrar"
5. **Sistema determina nível** → Inicia Splash Screen
6. **Splash Screen anima** → Barra progride por ~5 segundos
7. **Progresso completa 100%** → Fade out + callback
8. **Dashboard carrega** → Usuário vê interface principal

### Timing Total
- Login (variável, usuário controla)
- Splash: ~5.3 segundos (5s progresso + 0.3s delay)
- Total até dashboard: ~5-10 segundos

### Experiência Visual
- Animações suaves e profissionais
- Cores corporativas consistentes
- Responsividade perfeita
- Feedback visual claro
- Transições fluidas entre estados

---

## 📝 CUSTOMIZAÇÃO

### Para Adaptar a Outro Projeto

**Alterar branding**:
1. Trocar logo (import + src) - se aplicável
2. Modificar títulos ("Torre de Controle", "Cliente")
3. Atualizar parceria ("Chronus Performance AI")
4. Ajustar cores no CSS (--brand-*)

**Alterar comportamento**:
1. Duração do splash (ajustar intervalo/incremento)
2. Lógica de níveis de usuário
3. Campos do formulário (adicionar/remover)
4. Validações de login

**Adicionar features**:
1. Integração com API real
2. Esqueci minha senha
3. Registro de novo usuário
4. Lembretes de login
5. Captcha
6. OAuth / Social login

---

**VERSÃO**: 1.0  
**DATA**: Compatível com React 18+, Tailwind CSS v4, shadcn/ui  
**AUTOR**: Torre de Controle - Cliente  
**LICENÇA**: Uso interno / Adaptável para projetos similares