import { useState } from "react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Building2 } from "lucide-react";

interface LoginProps {
  onLogin: (userLevel: "c-level" | "diretoria" | "gerencia", demo?: boolean) => void;
}

export function Login({ onLogin }: LoginProps) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [twoFactorCode, setTwoFactorCode] = useState("");
  const [showTwoFactor, setShowTwoFactor] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!showTwoFactor) {
      // Simular envio de código 2FA
      setShowTwoFactor(true);
    } else {
      // Simular login com níveis diferentes baseado no usuário
      let userLevel: "c-level" | "diretoria" | "gerencia" = "gerencia";
      
      if (username.toLowerCase().includes("ceo") || username.toLowerCase().includes("diretor")) {
        userLevel = "c-level";
      } else if (username.toLowerCase().includes("gerente")) {
        userLevel = "diretoria";
      }
      
      onLogin(userLevel);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary via-primary/90 to-primary/80 p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-4">
          <div className="flex items-center justify-center gap-3">
            <Building2 className="h-10 w-10 text-primary" />
            <div className="text-center">
              <CardTitle className="text-2xl">Cliente</CardTitle>
              <CardDescription>Torre de Controle</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            {!showTwoFactor ? (
              <>
                <div className="space-y-2">
                  <Label htmlFor="username">Usuário</Label>
                  <Input
                    id="username"
                    type="text"
                    placeholder="Digite seu usuário"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="password">Senha</Label>
                  <Input
                    id="password"
                    type="password"
                    placeholder="Digite sua senha"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                </div>
              </>
            ) : (
              <div className="space-y-2">
                <Label htmlFor="2fa">Código de Autenticação</Label>
                <Input
                  id="2fa"
                  type="text"
                  placeholder="Digite o código enviado"
                  value={twoFactorCode}
                  onChange={(e) => setTwoFactorCode(e.target.value)}
                  required
                  maxLength={6}
                />
                <p className="text-sm text-muted-foreground">
                  Código enviado para seu dispositivo
                </p>
              </div>
            )}
            
            <Button type="submit" className="w-full">
              {showTwoFactor ? "Verificar e Entrar" : "Continuar"}
            </Button>
            
            {showTwoFactor && (
              <Button
                type="button"
                variant="ghost"
                className="w-full"
                onClick={() => setShowTwoFactor(false)}
              >
                Voltar
              </Button>
            )}
          </form>

          <div className="mt-6 border-t pt-4">
            <p className="text-sm font-semibold mb-1">Explorar a demonstração</p>
            <p className="text-xs text-muted-foreground mb-3">
              Sem senha. Cada perfil abre na tela que importa para ele.
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
              <Button type="button" variant="outline" size="sm" onClick={() => onLogin("c-level", true)}>
                C-Level
              </Button>
              <Button type="button" variant="outline" size="sm" onClick={() => onLogin("diretoria", true)}>
                Diretoria
              </Button>
              <Button type="button" variant="outline" size="sm" onClick={() => onLogin("gerencia", true)}>
                Gerência
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}