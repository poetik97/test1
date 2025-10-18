import { useState } from "react";
import { useAuth } from "@/_core/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  Target, 
  Plus,
  TrendingUp,
  Calendar,
  CheckCircle2,
  Circle,
  Sparkles,
  Award,
  Flag,
  Clock,
  BarChart3
} from "lucide-react";
import { Link } from "wouter";

type GoalStatus = "active" | "completed" | "abandoned";
type GoalCategory = "personal" | "professional" | "health" | "financial" | "learning";

interface Goal {
  id: string;
  title: string;
  description: string;
  category: GoalCategory;
  status: GoalStatus;
  progress: number;
  targetDate: string;
  smart: {
    specific: boolean;
    measurable: boolean;
    achievable: boolean;
    relevant: boolean;
    timeBound: boolean;
  };
  milestones?: { title: string; completed: boolean }[];
  aiSuggestion?: string;
}

export default function Goals() {
  const { user } = useAuth();
  const [filterStatus, setFilterStatus] = useState<GoalStatus | "all">("all");
  const [goals, setGoals] = useState<Goal[]>(mockGoals);

  const filteredGoals = goals.filter(goal => 
    filterStatus === "all" || goal.status === filterStatus
  );

  const activeGoals = goals.filter(g => g.status === "active");
  const completedGoals = goals.filter(g => g.status === "completed");
  const averageProgress = activeGoals.length > 0 
    ? Math.round(activeGoals.reduce((sum, g) => sum + g.progress, 0) / activeGoals.length)
    : 0;

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">Acesso Negado</h2>
          <p className="text-muted-foreground mb-6">Precisa de fazer login</p>
          <Link href="/">
            <Button>Voltar à Página Inicial</Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-green-50/20 dark:to-green-950/10">
      {/* Header */}

      {/* Main Content */}
      <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Page Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-3xl font-bold flex items-center gap-3">
                <Target className="w-8 h-8 text-green-500" />
                Objetivos SMART
              </h2>
              <p className="text-muted-foreground mt-1">
                Defina e acompanhe objetivos específicos, mensuráveis e alcançáveis
              </p>
            </div>
            
            <Button className="bg-gradient-to-r from-green-500 to-emerald-600 hover:opacity-90 glow-premium">
              <Plus className="w-5 h-5 mr-2" />
              Novo Objetivo
            </Button>
          </div>

          {/* Filters */}
          <div className="flex gap-2">
            <Button 
              variant={filterStatus === "all" ? "default" : "outline"}
              size="sm"
              onClick={() => setFilterStatus("all")}
              className={filterStatus === "all" ? "bg-gradient-to-r from-green-500 to-emerald-600" : ""}
            >
              Todos
            </Button>
            <Button 
              variant={filterStatus === "active" ? "default" : "outline"}
              size="sm"
              onClick={() => setFilterStatus("active")}
              className={filterStatus === "active" ? "bg-gradient-to-r from-green-500 to-emerald-600" : ""}
            >
              Ativos
            </Button>
            <Button 
              variant={filterStatus === "completed" ? "default" : "outline"}
              size="sm"
              onClick={() => setFilterStatus("completed")}
              className={filterStatus === "completed" ? "bg-gradient-to-r from-green-500 to-emerald-600" : ""}
            >
              Concluídos
            </Button>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 mb-8">
          <Card className="glass-premium border-border/50">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Objetivos Ativos</p>
                  <p className="text-2xl font-bold gradient-text">{activeGoals.length}</p>
                </div>
                <Target className="w-8 h-8 text-green-500/30" />
              </div>
            </CardContent>
          </Card>

          <Card className="glass-premium border-border/50">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Progresso Médio</p>
                  <p className="text-2xl font-bold text-cyan-500">{averageProgress}%</p>
                </div>
                <TrendingUp className="w-8 h-8 text-cyan-500/30" />
              </div>
            </CardContent>
          </Card>

          <Card className="glass-premium border-border/50">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Concluídos</p>
                  <p className="text-2xl font-bold text-green-500">{completedGoals.length}</p>
                </div>
                <CheckCircle2 className="w-8 h-8 text-green-500/30" />
              </div>
            </CardContent>
          </Card>

          <Card className="glass-premium border-border/50">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Taxa de Sucesso</p>
                  <p className="text-2xl font-bold text-orange-500">78%</p>
                </div>
                <Award className="w-8 h-8 text-orange-500/30" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Goals List */}
          <div className="lg:col-span-2 space-y-4">
            {filteredGoals.map(goal => (
              <GoalCard key={goal.id} goal={goal} />
            ))}
            {filteredGoals.length === 0 && (
              <Card className="glass-premium border-border/50">
                <CardContent className="py-12 text-center">
                  <Target className="w-12 h-12 text-muted-foreground/30 mx-auto mb-4" />
                  <p className="text-muted-foreground">Nenhum objetivo encontrado</p>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* SMART Criteria Guide */}
            <Card className="glass-premium border-primary/20 glow-premium">
              <CardHeader>
                <CardTitle className="text-base flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-primary" />
                  Critérios SMART
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {smartCriteria.map((criteria, index) => (
                    <div key={index} className="flex items-start gap-2">
                      <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                        <span className="text-xs font-bold text-primary">{criteria.letter}</span>
                      </div>
                      <div>
                        <h5 className="text-sm font-semibold">{criteria.title}</h5>
                        <p className="text-xs text-muted-foreground leading-relaxed">
                          {criteria.description}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* AI Suggestions */}
            <Card className="glass-premium border-primary/20">
              <CardHeader>
                <CardTitle className="text-base flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-primary" />
                  Sugestões de IA
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="p-3 rounded-lg bg-gradient-to-br from-primary/10 to-purple-600/10 border border-primary/20">
                    <p className="text-xs leading-relaxed">
                      💡 <strong>Otimização de Prazos:</strong> "Aprender Espanhol" 
                      pode ser concluído 2 semanas antes se dedicar 30min/dia.
                    </p>
                  </div>
                  <div className="p-3 rounded-lg bg-gradient-to-br from-green-500/10 to-emerald-600/10 border border-green-500/20">
                    <p className="text-xs leading-relaxed">
                      🎯 <strong>Próximo Marco:</strong> Está a 85% de "Ler 12 Livros". 
                      Faltam apenas 2 livros!
                    </p>
                  </div>
                  <div className="p-3 rounded-lg bg-gradient-to-br from-orange-500/10 to-amber-600/10 border border-orange-500/20">
                    <p className="text-xs leading-relaxed">
                      ⚠️ <strong>Atenção:</strong> "Perder 5kg" está atrasado. 
                      Ajuste o prazo ou aumente o ritmo.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Progress Overview */}
            <Card className="glass-premium border-border/50">
              <CardHeader>
                <CardTitle className="text-base flex items-center gap-2">
                  <BarChart3 className="w-4 h-4 text-green-500" />
                  Visão Geral
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm">Pessoal</span>
                      <span className="text-sm font-semibold">75%</span>
                    </div>
                    <div className="h-2 bg-muted rounded-full overflow-hidden">
                      <div className="h-full bg-gradient-to-r from-purple-500 to-pink-600 w-[75%]" />
                    </div>
                  </div>
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm">Profissional</span>
                      <span className="text-sm font-semibold">60%</span>
                    </div>
                    <div className="h-2 bg-muted rounded-full overflow-hidden">
                      <div className="h-full bg-gradient-to-r from-cyan-500 to-blue-600 w-[60%]" />
                    </div>
                  </div>
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm">Saúde</span>
                      <span className="text-sm font-semibold">45%</span>
                    </div>
                    <div className="h-2 bg-muted rounded-full overflow-hidden">
                      <div className="h-full bg-gradient-to-r from-green-500 to-emerald-600 w-[45%]" />
                    </div>
                  </div>
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm">Financeiro</span>
                      <span className="text-sm font-semibold">90%</span>
                    </div>
                    <div className="h-2 bg-muted rounded-full overflow-hidden">
                      <div className="h-full bg-gradient-to-r from-orange-500 to-amber-600 w-[90%]" />
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
}

function GoalCard({ goal }: { goal: Goal }) {
  const categoryColors: Record<GoalCategory, string> = {
    personal: "bg-purple-500/10 text-purple-500 border-purple-500/20",
    professional: "bg-cyan-500/10 text-cyan-500 border-cyan-500/20",
    health: "bg-green-500/10 text-green-500 border-green-500/20",
    financial: "bg-orange-500/10 text-orange-500 border-orange-500/20",
    learning: "bg-pink-500/10 text-pink-500 border-pink-500/20",
  };

  const categoryLabels: Record<GoalCategory, string> = {
    personal: "Pessoal",
    professional: "Profissional",
    health: "Saúde",
    financial: "Financeiro",
    learning: "Aprendizagem",
  };

  const smartCount = Object.values(goal.smart).filter(Boolean).length;

  return (
    <Card className="glass-premium hover-lift border-border/50 group">
      <CardContent className="p-6">
        <div className="flex items-start justify-between mb-4">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
              <h4 className="font-semibold text-lg group-hover:text-primary transition-colors">
                {goal.title}
              </h4>
              {goal.status === "completed" && (
                <CheckCircle2 className="w-5 h-5 text-green-500" />
              )}
            </div>
            <p className="text-sm text-muted-foreground mb-3">{goal.description}</p>
            
            <div className="flex items-center gap-2 flex-wrap">
              <span className={`text-xs px-2 py-1 rounded-full border ${categoryColors[goal.category]}`}>
                {categoryLabels[goal.category]}
              </span>
              <span className="text-xs px-2 py-1 rounded-full bg-muted/50 text-muted-foreground flex items-center gap-1">
                <Calendar className="w-3 h-3" />
                {goal.targetDate}
              </span>
              <span className={`text-xs px-2 py-1 rounded-full border ${
                smartCount === 5 
                  ? "bg-green-500/10 text-green-500 border-green-500/20"
                  : "bg-orange-500/10 text-orange-500 border-orange-500/20"
              }`}>
                SMART: {smartCount}/5
              </span>
            </div>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="mb-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium">Progresso</span>
            <span className="text-sm font-semibold text-primary">{goal.progress}%</span>
          </div>
          <div className="h-3 bg-muted rounded-full overflow-hidden">
            <div 
              className="h-full bg-gradient-to-r from-green-500 to-emerald-600 animate-shimmer transition-all duration-500"
              style={{ width: `${goal.progress}%` }}
            />
          </div>
        </div>

        {/* Milestones */}
        {goal.milestones && goal.milestones.length > 0 && (
          <div className="mb-4">
            <h5 className="text-sm font-medium mb-2">Marcos</h5>
            <div className="space-y-2">
              {goal.milestones.map((milestone, index) => (
                <div key={index} className="flex items-center gap-2 text-sm">
                  {milestone.completed ? (
                    <CheckCircle2 className="w-4 h-4 text-green-500 flex-shrink-0" />
                  ) : (
                    <Circle className="w-4 h-4 text-muted-foreground flex-shrink-0" />
                  )}
                  <span className={milestone.completed ? "line-through text-muted-foreground" : ""}>
                    {milestone.title}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* AI Suggestion */}
        {goal.aiSuggestion && (
          <div className="p-3 rounded-lg bg-primary/5 border border-primary/10">
            <p className="text-xs text-primary flex items-start gap-1">
              <Sparkles className="w-3 h-3 mt-0.5 flex-shrink-0" />
              <span>{goal.aiSuggestion}</span>
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

const smartCriteria = [
  { letter: "S", title: "Específico", description: "Objetivo claro e bem definido" },
  { letter: "M", title: "Mensurável", description: "Progresso pode ser medido" },
  { letter: "A", title: "Alcançável", description: "Realista e possível de atingir" },
  { letter: "R", title: "Relevante", description: "Alinhado com seus valores" },
  { letter: "T", title: "Temporal", description: "Prazo definido para conclusão" },
];

const mockGoals: Goal[] = [
  {
    id: "1",
    title: "Ler 12 Livros em 2025",
    description: "Desenvolver hábito de leitura regular para crescimento pessoal",
    category: "learning",
    status: "active",
    progress: 85,
    targetDate: "31 Dez 2025",
    smart: {
      specific: true,
      measurable: true,
      achievable: true,
      relevant: true,
      timeBound: true,
    },
    milestones: [
      { title: "Ler 3 livros (Q1)", completed: true },
      { title: "Ler 6 livros (Q2)", completed: true },
      { title: "Ler 9 livros (Q3)", completed: true },
      { title: "Ler 12 livros (Q4)", completed: false },
    ],
    aiSuggestion: "Está quase lá! Faltam apenas 2 livros. Mantenha o ritmo de 1 livro/mês."
  },
  {
    id: "2",
    title: "Aprender Espanhol Básico",
    description: "Alcançar nível A2 em espanhol para viagem",
    category: "learning",
    status: "active",
    progress: 60,
    targetDate: "30 Jun 2025",
    smart: {
      specific: true,
      measurable: true,
      achievable: true,
      relevant: true,
      timeBound: true,
    },
    milestones: [
      { title: "Completar curso A1", completed: true },
      { title: "Praticar conversação 20h", completed: false },
      { title: "Fazer exame A2", completed: false },
    ],
    aiSuggestion: "Dedicando 30min/dia, pode concluir 2 semanas antes do prazo!"
  },
  {
    id: "3",
    title: "Poupar €5000",
    description: "Criar fundo de emergência para segurança financeira",
    category: "financial",
    status: "active",
    progress: 70,
    targetDate: "31 Dez 2025",
    smart: {
      specific: true,
      measurable: true,
      achievable: true,
      relevant: true,
      timeBound: true,
    },
    milestones: [
      { title: "Poupar €1000", completed: true },
      { title: "Poupar €2500", completed: true },
      { title: "Poupar €5000", completed: false },
    ],
  },
  {
    id: "4",
    title: "Correr 5km sem parar",
    description: "Melhorar condição física e resistência cardiovascular",
    category: "health",
    status: "active",
    progress: 45,
    targetDate: "31 Mar 2025",
    smart: {
      specific: true,
      measurable: true,
      achievable: true,
      relevant: true,
      timeBound: true,
    },
    aiSuggestion: "Aumente gradualmente: 3km esta semana, 4km na próxima."
  },
  {
    id: "5",
    title: "Lançar Projeto Pessoal",
    description: "Desenvolver e publicar aplicação web",
    category: "professional",
    status: "completed",
    progress: 100,
    targetDate: "15 Jan 2025",
    smart: {
      specific: true,
      measurable: true,
      achievable: true,
      relevant: true,
      timeBound: true,
    },
    milestones: [
      { title: "Planeamento", completed: true },
      { title: "Desenvolvimento", completed: true },
      { title: "Testes", completed: true },
      { title: "Lançamento", completed: true },
    ],
  },
];

