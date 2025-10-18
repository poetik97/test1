import { useState } from "react";
import { useAuth } from "@/_core/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  CheckSquare, 
  Plus,
  Calendar,
  Clock,
  Flag,
  Sparkles,
  GripVertical,
  ChevronLeft,
  ChevronRight
} from "lucide-react";
import { Link } from "wouter";

type TaskStatus = "todo" | "in_progress" | "done" | "archived";
type TaskPriority = "low" | "medium" | "high" | "urgent";

interface Task {
  id: string;
  title: string;
  description?: string;
  status: TaskStatus;
  priority: TaskPriority;
  category?: string;
  dueDate?: Date;
  estimatedTime?: number;
  completedAt?: Date;
  position: number;
}

export default function Tasks() {
  const { user } = useAuth();
  const [view, setView] = useState<"kanban" | "timeline">("timeline");
  const [currentDate, setCurrentDate] = useState(new Date());
  const [tasks, setTasks] = useState<Task[]>(mockTasks);
  const [draggedTask, setDraggedTask] = useState<Task | null>(null);

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

  const stats = {
    total: tasks.length,
    today: tasks.filter(t => {
      if (!t.dueDate) return false;
      return t.dueDate.toDateString() === currentDate.toDateString();
    }).length,
    completed: tasks.filter(t => t.status === "done").length,
    inProgress: tasks.filter(t => t.status === "in_progress").length,
  };

  const nextDay = () => {
    const next = new Date(currentDate);
    next.setDate(next.getDate() + 1);
    setCurrentDate(next);
  };

  const prevDay = () => {
    const prev = new Date(currentDate);
    prev.setDate(prev.getDate() - 1);
    setCurrentDate(prev);
  };

  const todayTasks = tasks.filter(t => {
    if (!t.dueDate) return false;
    return t.dueDate.toDateString() === currentDate.toDateString();
  }).sort((a, b) => a.position - b.position);

  const handleDragStart = (task: Task) => {
    setDraggedTask(task);
  };

  const handleDrop = (hour: number) => {
    if (!draggedTask) return;
    
    setTasks((prev: Task[]) => {
      return prev.map(t => {
        if (t.id === draggedTask.id) {
          return { ...t, position: hour * 60, dueDate: currentDate };
        }
        return t;
      });
    });
    
    setDraggedTask(null);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-purple-50/20 dark:to-purple-950/10">

      <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-3xl font-bold flex items-center gap-3">
                <CheckSquare className="w-8 h-8 text-purple-500" />
                Gestão de Tarefas
              </h2>
              <p className="text-muted-foreground mt-1">Timeline móvel com drag & drop</p>
            </div>
            
            <Button className="bg-gradient-to-r from-purple-500 to-pink-600 hover:opacity-90 glow-premium">
              <Plus className="w-5 h-5 mr-2" />Nova Tarefa
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 mb-8">
          <Card className="glass-premium border-border/50">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div><p className="text-sm text-muted-foreground">Total</p><p className="text-2xl font-bold gradient-text">{stats.total}</p></div>
                <CheckSquare className="w-8 h-8 text-purple-500/30" />
              </div>
            </CardContent>
          </Card>
          <Card className="glass-premium border-border/50">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div><p className="text-sm text-muted-foreground">Hoje</p><p className="text-2xl font-bold text-cyan-500">{stats.today}</p></div>
                <Calendar className="w-8 h-8 text-cyan-500/30" />
              </div>
            </CardContent>
          </Card>
          <Card className="glass-premium border-border/50">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div><p className="text-sm text-muted-foreground">Em Progresso</p><p className="text-2xl font-bold text-orange-500">{stats.inProgress}</p></div>
                <Clock className="w-8 h-8 text-orange-500/30" />
              </div>
            </CardContent>
          </Card>
          <Card className="glass-premium border-border/50">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div><p className="text-sm text-muted-foreground">Concluídas</p><p className="text-2xl font-bold text-green-500">{stats.completed}</p></div>
                <CheckSquare className="w-8 h-8 text-green-500/30" />
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <Card className="glass-premium border-border/50">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center gap-2">
                    <Clock className="w-5 h-5 text-purple-500" />
                    {currentDate.toLocaleDateString('pt-PT', { weekday: 'long', day: 'numeric', month: 'long' })}
                  </CardTitle>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm" onClick={prevDay}><ChevronLeft className="w-4 h-4" /></Button>
                    <Button variant="outline" size="sm" onClick={nextDay}><ChevronRight className="w-4 h-4" /></Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-1 max-h-[600px] overflow-y-auto pr-2">
                  {Array.from({ length: 24 }, (_, i) => i).map(hour => {
                    const hourTasks = todayTasks.filter(t => Math.floor(t.position / 60) === hour);
                    const timeString = hour.toString().padStart(2, '0') + ':00';
                    
                    return (
                      <div key={hour} className="flex gap-3 group" onDragOver={(e) => e.preventDefault()} onDrop={() => handleDrop(hour)}>
                        <div className="w-16 text-sm text-muted-foreground font-medium pt-2">{timeString}</div>
                        <div className="flex-1 min-h-[60px] border-l-2 border-border/30 pl-3 pb-2 relative">
                          <div className="absolute left-[-5px] top-2 w-2 h-2 rounded-full bg-border/50 group-hover:bg-primary transition-colors" />
                          {hourTasks.length > 0 ? (
                            <div className="space-y-2">
                              {hourTasks.map(task => (
                                <div key={task.id} draggable onDragStart={() => handleDragStart(task)} className="p-3 rounded-lg border-2 cursor-move hover:scale-105 transition-all duration-200 border-purple-500/40 bg-purple-500/10">
                                  <div className="flex items-start gap-2">
                                    <GripVertical className="w-4 h-4 text-muted-foreground flex-shrink-0 mt-0.5" />
                                    <div className="flex-1 min-w-0">
                                      <h4 className="font-semibold text-sm truncate">{task.title}</h4>
                                      {task.description && <p className="text-xs text-muted-foreground mt-1 line-clamp-2">{task.description}</p>}
                                      <div className="flex items-center gap-2 mt-2">
                                        {task.category && <span className="text-xs px-2 py-0.5 rounded-full bg-muted/50">{task.category}</span>}
                                        {task.estimatedTime && <span className="text-xs text-muted-foreground flex items-center gap-1"><Clock className="w-3 h-3" />{task.estimatedTime}m</span>}
                                      </div>
                                    </div>
                                    <Flag className="w-4 h-4 flex-shrink-0 text-purple-500" />
                                  </div>
                                </div>
                              ))}
                            </div>
                          ) : (
                            <div className="h-full flex items-center opacity-0 group-hover:opacity-100 transition-opacity">
                              <span className="text-xs text-muted-foreground">Arraste uma tarefa aqui</span>
                            </div>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="space-y-6">
            <Card className="glass-premium border-border/50">
              <CardHeader>
                <CardTitle className="text-base flex items-center gap-2">
                  <CheckSquare className="w-4 h-4 text-purple-500" />Tarefas Não Agendadas
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {mockUnscheduledTasks.map(task => (
                    <div key={task.id} draggable onDragStart={() => handleDragStart(task)} className="p-3 rounded-lg border border-border/50 bg-muted/20 cursor-move hover:bg-muted/40 transition-colors">
                      <div className="flex items-start gap-2">
                        <GripVertical className="w-4 h-4 text-muted-foreground flex-shrink-0 mt-0.5" />
                        <div className="flex-1 min-w-0">
                          <h4 className="font-semibold text-sm truncate">{task.title}</h4>
                          {task.estimatedTime && <span className="text-xs text-muted-foreground flex items-center gap-1 mt-1"><Clock className="w-3 h-3" />{task.estimatedTime}m</span>}
                        </div>
                        <Flag className="w-4 h-4 flex-shrink-0 text-cyan-500" />
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card className="glass-premium border-primary/20 glow-premium">
              <CardHeader>
                <CardTitle className="text-base flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-primary" />Sugestões de IA
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="p-3 rounded-lg bg-gradient-to-br from-primary/10 to-purple-600/10 border border-primary/20">
                    <p className="text-xs leading-relaxed">⏰ <strong>Melhor Horário:</strong> Agende tarefas complexas entre 9h-11h - pico de produtividade.</p>
                  </div>
                  <div className="p-3 rounded-lg bg-gradient-to-br from-green-500/10 to-emerald-600/10 border border-green-500/20">
                    <p className="text-xs leading-relaxed">💡 <strong>Otimização:</strong> Agrupe tarefas similares para aumentar eficiência em 25%.</p>
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

const mockTasks: Task[] = [
  { id: "1", title: "Reunião de Equipa", description: "Discutir progresso do projeto Q1", status: "in_progress", priority: "high", category: "Trabalho", dueDate: new Date(), estimatedTime: 60, position: 9 * 60 },
  { id: "2", title: "Revisar Código", description: "Pull request #234", status: "todo", priority: "medium", category: "Desenvolvimento", dueDate: new Date(), estimatedTime: 90, position: 11 * 60 },
  { id: "3", title: "Almoço com Cliente", status: "todo", priority: "high", category: "Negócios", dueDate: new Date(), estimatedTime: 90, position: 13 * 60 },
  { id: "4", title: "Apresentação Trimestral", description: "Preparar slides e dados", status: "in_progress", priority: "urgent", category: "Trabalho", dueDate: new Date(), estimatedTime: 120, position: 15 * 60 },
  { id: "5", title: "Exercício Físico", status: "todo", priority: "medium", category: "Saúde", dueDate: new Date(), estimatedTime: 45, position: 18 * 60 },
];

const mockUnscheduledTasks: Task[] = [
  { id: "u1", title: "Responder Emails", status: "todo", priority: "medium", category: "Trabalho", estimatedTime: 30, position: 0 },
  { id: "u2", title: "Ler Artigo Técnico", status: "todo", priority: "low", category: "Aprendizagem", estimatedTime: 45, position: 0 },
  { id: "u3", title: "Atualizar Documentação", status: "todo", priority: "high", category: "Desenvolvimento", estimatedTime: 60, position: 0 },
];
