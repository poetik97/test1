import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { APP_LOGO, APP_TITLE } from "@/const";
import { trpc } from "@/lib/trpc";
import { 
  Sparkles, 
  CheckCircle2, 
  Shield, 
  Zap,
  ArrowRight,
  Loader2
} from "lucide-react";
import { useState } from "react";
import { Link, useLocation } from "wouter";
import { toast } from "sonner";

export default function Login() {
  const [, setLocation] = useLocation();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const loginMutation = trpc.auth.login.useMutation({
    onSuccess: () => {
      toast.success("Login realizado com sucesso!");
      setLocation("/dashboard");
    },
    onError: (error) => {
      toast.error(error.message || "Erro ao fazer login");
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    loginMutation.mutate({ email, password });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-purple-950/20 flex items-center justify-center p-4">
      <div className="w-full max-w-6xl grid lg:grid-cols-2 gap-8 items-center">
        {/* Left Side - Branding */}
        <div className="hidden lg:block">
          <div className="space-y-6">
            <div className="flex items-center gap-3">
              <img src={APP_LOGO} alt={APP_TITLE} className="w-12 h-12" />
              <h1 className="text-4xl font-bold gradient-text">{APP_TITLE}</h1>
            </div>
            
            <h2 className="text-3xl font-bold">
              Organize a sua vida com{" "}
              <span className="gradient-text">Inteligência Artificial</span>
            </h2>
            
            <p className="text-lg text-muted-foreground">
              A plataforma premium que transforma a forma como gere o seu tempo, 
              finanças e objetivos.
            </p>

            <div className="space-y-4 mt-8">
              <div className="flex items-start gap-3">
                <div className="mt-1 p-2 rounded-lg bg-primary/10">
                  <Sparkles className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <h3 className="font-semibold">IA Avançada</h3>
                  <p className="text-sm text-muted-foreground">
                    Sugestões inteligentes e automações personalizadas
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="mt-1 p-2 rounded-lg bg-cyan-500/10">
                  <Zap className="w-5 h-5 text-cyan-500" />
                </div>
                <div>
                  <h3 className="font-semibold">Produtividade Máxima</h3>
                  <p className="text-sm text-muted-foreground">
                    Aumente 3x sua produtividade com automações inteligentes
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="mt-1 p-2 rounded-lg bg-green-500/10">
                  <Shield className="w-5 h-5 text-green-500" />
                </div>
                <div>
                  <h3 className="font-semibold">Segurança Total</h3>
                  <p className="text-sm text-muted-foreground">
                    Seus dados protegidos com encriptação de ponta a ponta
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="mt-1 p-2 rounded-lg bg-orange-500/10">
                  <CheckCircle2 className="w-5 h-5 text-orange-500" />
                </div>
                <div>
                  <h3 className="font-semibold">Tudo num Só Lugar</h3>
                  <p className="text-sm text-muted-foreground">
                    Tarefas, calendário, finanças, objetivos e muito mais
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Side - Login Form */}
        <div className="w-full">
          <Card className="glass-premium border-border/50 shadow-2xl">
            <CardHeader className="text-center space-y-2 pb-6">
              <div className="mx-auto mb-4 lg:hidden">
                <img src={APP_LOGO} alt={APP_TITLE} className="w-16 h-16 mx-auto" />
              </div>
              <CardTitle className="text-3xl font-bold">Bem-vindo de volta!</CardTitle>
              <CardDescription className="text-base">
                Faça login para aceder à sua conta
              </CardDescription>
            </CardHeader>

            <CardContent className="space-y-6">
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="seu@email.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="h-12"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="password">Password</Label>
                  <Input
                    id="password"
                    type="password"
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    className="h-12"
                  />
                </div>

                <Button
                  type="submit"
                  className="w-full h-12 text-lg bg-gradient-to-r from-primary to-purple-600 hover:from-primary/90 hover:to-purple-600/90 shadow-lg hover:shadow-xl transition-all duration-300"
                  disabled={loginMutation.isPending}
                >
                  {loginMutation.isPending ? (
                    <>
                      <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                      A entrar...
                    </>
                  ) : (
                    <>
                      <span className="mr-2">Entrar</span>
                      <ArrowRight className="w-5 h-5" />
                    </>
                  )}
                </Button>
              </form>

              {/* Divider */}
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-border/50"></div>
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="bg-card px-2 text-muted-foreground">
                    Ainda não tem conta?
                  </span>
                </div>
              </div>

              {/* Register Link */}
              <Link href="/register">
                <Button variant="outline" className="w-full h-12">
                  Criar Conta Grátis
                </Button>
              </Link>

              {/* Features */}
              <div className="grid grid-cols-3 gap-4 pt-4">
                <div className="text-center">
                  <div className="text-2xl font-bold gradient-text">10k+</div>
                  <div className="text-xs text-muted-foreground">Utilizadores</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold gradient-text">98%</div>
                  <div className="text-xs text-muted-foreground">Satisfação</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold gradient-text">50h</div>
                  <div className="text-xs text-muted-foreground">Poupadas/mês</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

