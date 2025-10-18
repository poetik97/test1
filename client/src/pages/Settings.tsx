import { useAuth } from "@/_core/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Settings as SettingsIcon, User, Bell, Shield, Palette } from "lucide-react";
import { Link } from "wouter";
import { GoogleIntegration } from "@/components/GoogleIntegration";

export default function Settings() {
  const { user } = useAuth();

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">Acesso Negado</h2>
          <p className="text-muted-foreground mb-6">Precisa de fazer login</p>
          <Link href="/"><Button>Voltar</Button></Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h2 className="text-3xl font-bold flex items-center gap-3">
            <SettingsIcon className="w-8 h-8 text-purple-500" />
            Definições
          </h2>
          <p className="text-muted-foreground mt-1">Personalize a sua experiência</p>
        </div>

        <div className="grid gap-6">
          <GoogleIntegration />

          <Card className="glass-premium border-border/50">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="w-5 h-5" />
                Perfil
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">Gerir informações do perfil</p>
            </CardContent>
          </Card>

          <Card className="glass-premium border-border/50">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Bell className="w-5 h-5" />
                Notificações
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">Configurar preferências de notificações</p>
            </CardContent>
          </Card>

          <Card className="glass-premium border-border/50">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="w-5 h-5" />
                Privacidade & Segurança
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">Gerir dados e privacidade</p>
            </CardContent>
          </Card>

          <Card className="glass-premium border-border/50">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Palette className="w-5 h-5" />
                Aparência
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">Personalizar tema e interface</p>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}
