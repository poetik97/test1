import { useAuth } from "@/_core/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  Calendar, 
  CheckSquare, 
  Target, 
  Wallet, 
  TrendingUp,
  Zap,
  Award,
  Plus,
  Sparkles
} from "lucide-react";
import { Link } from "wouter";
import { useEffect, useState } from "react";
import { AddTaskDialog } from "@/components/AddTaskDialog";
import { AddEventDialog } from "@/components/AddEventDialog";
import { AddGoalDialog } from "@/components/AddGoalDialog";
import { AddTransactionDialog } from "@/components/AddTransactionDialog";
import { trpc } from "@/lib/trpc";

export default function Dashboard() {
  const { user } = useAuth();
  const [greeting, setGreeting] = useState("");
  const [taskDialogOpen, setTaskDialogOpen] = useState(false);
  const [eventDialogOpen, setEventDialogOpen] = useState(false);
  const [goalDialogOpen, setGoalDialogOpen] = useState(false);
  const [transactionDialogOpen, setTransactionDialogOpen] = useState(false);

  // Fetch real data from backend
  const { data: stats, isLoading } = trpc.dashboard.stats.useQuery();
  const { data: tasks } = trpc.tasks.list.useQuery();
  const { data: gamification } = trpc.gamification.profile.useQuery();

  useEffect(() => {
    const hour = new Date().getHours();
    if (hour < 12) setGreeting("Bom dia");
    else if (hour < 18) setGreeting("Boa tarde");
    else setGreeting("Boa noite");
  }, []);

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">Acesso Negado</h2>
          <p className="text-muted-foreground mb-6">Precisa de fazer login para aceder ao dashboard</p>
          <Link href="/">
            <Button>Voltar à Página Inicial</Button>
          </Link>
        </div>
      </div>
    );
  }

  const todayTasks = tasks?.filter(t => {
    if (!t.dueDate) return false;
    const today = new Date().toDateString();
    return new Date(t.dueDate).toDateString() === today;
  }) || [];

  return (
    <>
      <AddTaskDialog open={taskDialogOpen} onOpenChange={setTaskDialogOpen} />
      <AddEventDialog open={eventDialogOpen} onOpenChange={setEventDialogOpen} />
      <AddGoalDialog open={goalDialogOpen} onOpenChange={setGoalDialogOpen} />
      <AddTransactionDialog open={transactionDialogOpen} onOpenChange={setTransactionDialogOpen} />
      
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-purple-50/20 dark:to-purple-950/10">
      <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-2">
            <div>
              <h2 className="text-3xl font-bold">
                {greeting}, {user.name?.split(' ')[0] || 'Utilizador'}! 👋
              </h2>
              <p className="text-muted-foreground mt-1">
                Aqui está o resumo do seu dia
              </p>
            </div>
            
            {/* Level Badge */}
            <div className="glass-premium rounded-2xl px-6 py-3 border-border/50 hidden lg:flex items-center gap-3">
              <Award className="w-8 h-8 text-primary" />
              <div>
                <div className="text-xs text-muted-foreground">Nível</div>
                <div className="text-2xl font-bold gradient-text">{gamification?.level || 1}</div>
              </div>
              <div className="ml-4">
                <div className="text-xs text-muted-foreground">XP</div>
                <div className="text-sm font-semibold">{gamification?.xp || 0} / {((gamification?.level || 1) * 1000)}</div>
              </div>
            </div>
          </div>

          {/* XP Progress Bar */}
          <div className="mt-4 max-w-md">
            <div className="h-2 bg-muted rounded-full overflow-hidden">
              <div 
                className="h-full bg-gradient-to-r from-primary to-purple-600 animate-shimmer transition-all duration-500"
                style={{ width: `${((gamification?.xp || 0) / ((gamification?.level || 1) * 1000)) * 100}%` }}
              />
            </div>
          </div>
        </div>

        {/* Stats Grid - Real Data */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card className="glass-premium hover-lift border-border/50 transition-all duration-300">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Tarefas Pendentes
              </CardTitle>
              <CheckSquare className="w-4 h-4 text-primary" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold gradient-text">
                {isLoading ? "..." : stats?.tasksCount || 0}
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                {todayTasks.length} para hoje
              </p>
            </CardContent>
          </Card>

          <Card className="glass-premium hover-lift border-border/50 transition-all duration-300">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Eventos Futuros
              </CardTitle>
              <Calendar className="w-4 h-4 text-cyan-500" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold gradient-text">
                {isLoading ? "..." : stats?.eventsCount || 0}
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                Agendados
              </p>
            </CardContent>
          </Card>

          <Card className="glass-premium hover-lift border-border/50 transition-all duration-300">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Objetivos Ativos
              </CardTitle>
              <Target className="w-4 h-4 text-green-500" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold gradient-text">
                {isLoading ? "..." : stats?.goalsCount || 0}
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                Em progresso
              </p>
            </CardContent>
          </Card>

          <Card className="glass-premium hover-lift border-border/50 transition-all duration-300">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Saldo Total
              </CardTitle>
              <Wallet className="w-4 h-4 text-orange-500" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold gradient-text">
                {isLoading ? "..." : `€${stats?.balance.toFixed(2) || "0.00"}`}
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                <TrendingUp className="w-3 h-3 inline mr-1" />
                Atualizado
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions */}
        <div className="mb-8">
          <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
            <Zap className="w-5 h-5 text-primary" />
            Ações Rápidas
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <Button 
              onClick={() => setTaskDialogOpen(true)}
              className="h-auto py-4 bg-gradient-to-br from-primary/10 to-purple-600/10 hover:from-primary/20 hover:to-purple-600/20 border border-primary/20 text-foreground justify-start"
              variant="outline"
            >
              <Plus className="w-5 h-5 mr-2 text-primary" />
              <div className="text-left">
                <div className="font-semibold">Nova Tarefa</div>
                <div className="text-xs text-muted-foreground">Ctrl + N</div>
              </div>
            </Button>

            <Button 
              onClick={() => setEventDialogOpen(true)}
              className="h-auto py-4 bg-gradient-to-br from-cyan-500/10 to-blue-600/10 hover:from-cyan-500/20 hover:to-blue-600/20 border border-cyan-500/20 text-foreground justify-start"
              variant="outline"
            >
              <Calendar className="w-5 h-5 mr-2 text-cyan-500" />
              <div className="text-left">
                <div className="font-semibold">Novo Evento</div>
                <div className="text-xs text-muted-foreground">Ctrl + E</div>
              </div>
            </Button>

            <Button 
              onClick={() => setGoalDialogOpen(true)}
              className="h-auto py-4 bg-gradient-to-br from-green-500/10 to-emerald-600/10 hover:from-green-500/20 hover:to-emerald-600/20 border border-green-500/20 text-foreground justify-start"
              variant="outline"
            >
              <Target className="w-5 h-5 mr-2 text-green-500" />
              <div className="text-left">
                <div className="font-semibold">Novo Objetivo</div>
                <div className="text-xs text-muted-foreground">Ctrl + G</div>
              </div>
            </Button>

            <Button 
              onClick={() => setTransactionDialogOpen(true)}
              className="h-auto py-4 bg-gradient-to-br from-orange-500/10 to-red-600/10 hover:from-orange-500/20 hover:to-red-600/20 border border-orange-500/20 text-foreground justify-start"
              variant="outline"
            >
              <Wallet className="w-5 h-5 mr-2 text-orange-500" />
              <div className="text-left">
                <div className="font-semibold">Transação</div>
                <div className="text-xs text-muted-foreground">Ctrl + T</div>
              </div>
            </Button>
          </div>
        </div>

        {/* Today's Tasks */}
        <div className="mb-8">
          <h3 className="text-xl font-semibold mb-4">Tarefas de Hoje</h3>
          {todayTasks.length === 0 ? (
            <Card className="glass-premium border-border/50">
              <CardContent className="py-12 text-center">
                <CheckSquare className="w-12 h-12 text-muted-foreground mx-auto mb-4 opacity-50" />
                <p className="text-muted-foreground">Nenhuma tarefa para hoje</p>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-3">
              {todayTasks.slice(0, 5).map((task) => (
                <Card key={task.id} className="glass-premium border-border/50 hover-lift">
                  <CardContent className="py-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className={`w-2 h-2 rounded-full ${
                          task.priority === 'high' ? 'bg-red-500' :
                          task.priority === 'medium' ? 'bg-orange-500' :
                          'bg-green-500'
                        }`} />
                        <div>
                          <div className="font-medium">{task.title}</div>
                          {task.description && (
                            <div className="text-sm text-muted-foreground">{task.description}</div>
                          )}
                        </div>
                      </div>
                      <div className="text-xs text-muted-foreground">
                        {task.estimatedTime && `${task.estimatedTime}min`}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>

        {/* AI Insights */}
        <Card className="glass-premium border-primary/20">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-primary" />
              Insights de IA
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="p-4 rounded-lg bg-gradient-to-r from-primary/10 to-purple-600/10 border border-primary/20">
                <p className="text-sm">
                  💡 <strong>Sugestão do Dia:</strong> Baseado no seu padrão, é mais produtivo entre as 9h-11h. Agende tarefas importantes neste período!
                </p>
              </div>
              <div className="p-4 rounded-lg bg-gradient-to-r from-cyan-500/10 to-blue-600/10 border border-cyan-500/20">
                <p className="text-sm">
                  📊 <strong>Análise Financeira:</strong> Seus gastos com alimentação aumentaram 15% este mês. Considere usar o otimizador de orçamento.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
    </>
  );
}

