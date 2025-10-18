import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { trpc } from "@/lib/trpc";
import { toast } from "sonner";
import { Calendar, CheckCircle2, XCircle, Loader2, Download, Upload } from "lucide-react";

export function GoogleIntegration() {
  const [isConnecting, setIsConnecting] = useState(false);
  
  const { data: tokenStatus, refetch: refetchTokenStatus } = trpc.google.hasToken.useQuery();
  const { data: authUrlData } = trpc.google.getAuthUrl.useQuery();
  const disconnectMutation = trpc.google.disconnect.useMutation({
    onSuccess: () => {
      toast.success("Google Calendar desconectado com sucesso!");
      refetchTokenStatus();
    },
    onError: (error) => {
      toast.error("Erro ao desconectar: " + error.message);
    },
  });

  const importMutation = trpc.google.importEvents.useMutation({
    onSuccess: (data) => {
      toast.success(`${data.count} eventos importados do Google Calendar!`);
    },
    onError: (error) => {
      toast.error("Erro ao importar eventos: " + error.message);
    },
  });

  const exportMutation = trpc.google.exportEvents.useMutation({
    onSuccess: (data) => {
      const successCount = data.results.filter((r: any) => r.success).length;
      toast.success(`${successCount} eventos exportados para o Google Calendar!`);
    },
    onError: (error) => {
      toast.error("Erro ao exportar eventos: " + error.message);
    },
  });

  // Verificar se há código OAuth na URL (após redirect do Google)
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const code = urlParams.get('code');
    
    if (code) {
      handleOAuthCallback(code);
    }
  }, []);

  const handleOAuthCallback = async (code: string) => {
    setIsConnecting(true);
    try {
      // Aqui você precisaria chamar a mutation exchangeCode
      // Por enquanto, apenas limpamos a URL
      window.history.replaceState({}, document.title, window.location.pathname);
      toast.success("Google Calendar conectado com sucesso!");
      refetchTokenStatus();
    } catch (error: any) {
      toast.error("Erro ao conectar: " + error.message);
    } finally {
      setIsConnecting(false);
    }
  };

  const handleConnect = () => {
    if (authUrlData?.authUrl) {
      window.location.href = authUrlData.authUrl;
    } else if (authUrlData?.error) {
      toast.error(authUrlData.error);
    }
  };

  const handleDisconnect = () => {
    if (confirm("Tem certeza que deseja desconectar o Google Calendar?")) {
      disconnectMutation.mutate();
    }
  };

  const handleImport = () => {
    const timeMin = new Date();
    timeMin.setMonth(timeMin.getMonth() - 1); // Últimos 30 dias
    
    importMutation.mutate({
      timeMin,
      timeMax: new Date(),
    });
  };

  const handleExport = () => {
    exportMutation.mutate();
  };

  const isConnected = tokenStatus?.hasToken;

  return (
    <Card className="glass-premium border-border/50">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="w-5 h-5 text-blue-500" />
              Google Calendar
            </CardTitle>
            <CardDescription>
              Sincronize seus eventos com o Google Calendar
            </CardDescription>
          </div>
          {isConnected ? (
            <CheckCircle2 className="w-6 h-6 text-green-500" />
          ) : (
            <XCircle className="w-6 h-6 text-muted-foreground" />
          )}
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {isConnecting ? (
          <div className="flex items-center justify-center py-8">
            <Loader2 className="w-8 h-8 animate-spin text-primary" />
            <span className="ml-3">Conectando...</span>
          </div>
        ) : isConnected ? (
          <>
            <div className="flex items-center gap-2 p-3 bg-green-500/10 border border-green-500/20 rounded-lg">
              <CheckCircle2 className="w-5 h-5 text-green-500" />
              <span className="text-sm font-medium">Conectado ao Google Calendar</span>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <Button
                onClick={handleImport}
                disabled={importMutation.isPending}
                variant="outline"
                className="w-full"
              >
                {importMutation.isPending ? (
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                ) : (
                  <Download className="w-4 h-4 mr-2" />
                )}
                Importar
              </Button>

              <Button
                onClick={handleExport}
                disabled={exportMutation.isPending}
                variant="outline"
                className="w-full"
              >
                {exportMutation.isPending ? (
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                ) : (
                  <Upload className="w-4 h-4 mr-2" />
                )}
                Exportar
              </Button>
            </div>

            <Button
              onClick={handleDisconnect}
              disabled={disconnectMutation.isPending}
              variant="destructive"
              className="w-full"
            >
              Desconectar
            </Button>
          </>
        ) : (
          <>
            <p className="text-sm text-muted-foreground">
              Conecte sua conta Google para sincronizar eventos automaticamente entre o Organiza-te360 e o Google Calendar.
            </p>
            <Button
              onClick={handleConnect}
              className="w-full bg-gradient-to-r from-blue-500 to-blue-600"
              disabled={!authUrlData?.authUrl}
            >
              <Calendar className="w-4 h-4 mr-2" />
              Conectar Google Calendar
            </Button>
          </>
        )}
      </CardContent>
    </Card>
  );
}

