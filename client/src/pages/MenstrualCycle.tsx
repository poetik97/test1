import { useState } from "react";
import { useAuth } from "@/_core/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  Calendar,
  Plus,
  TrendingUp,
  Heart,
  Droplet,
  Moon,
  Sun,
  Sparkles,
  AlertCircle,
  Activity,
  Brain,
  Zap,
  ChevronLeft,
  ChevronRight
} from "lucide-react";
import { Link } from "wouter";

type CyclePhase = "menstruation" | "follicular" | "ovulation" | "luteal";
type Flow = "light" | "medium" | "heavy";
type Mood = "very_bad" | "bad" | "neutral" | "good" | "very_good";

interface CycleDay {
  date: Date;
  phase: CyclePhase;
  isPeriod: boolean;
  isOvulation: boolean;
  isPredicted: boolean;
  flow?: Flow;
  mood?: Mood;
  symptoms?: string[];
}

interface CycleRecord {
  id: string;
  startDate: Date;
  endDate?: Date;
  cycleLength: number;
  periodLength: number;
  flow: Flow;
  symptoms: string[];
  mood: Mood;
  notes?: string;
}

export default function MenstrualCycle() {
  const { user } = useAuth();
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [selectedDay, setSelectedDay] = useState<CycleDay | null>(null);

  // Mock data - will be replaced with real data from backend
  const cycleData = generateMockCycleData(currentMonth);
  const stats = calculateStats(cycleData);

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

  const nextMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 1));
  };

  const prevMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1, 1));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-pink-50/20 dark:to-pink-950/10">
      {/* Header */}

      {/* Main Content */}
      <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Page Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-3xl font-bold flex items-center gap-3">
                <Moon className="w-8 h-8 text-pink-500" />
                Ciclo Menstrual
              </h2>
              <p className="text-muted-foreground mt-1">
                Acompanhe seu ciclo com previsões inteligentes de IA
              </p>
            </div>
            
            <Button className="bg-gradient-to-r from-pink-500 to-rose-600 hover:opacity-90 glow-premium">
              <Plus className="w-5 h-5 mr-2" />
              Registar Período
            </Button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 mb-8">
          <Card className="glass-premium border-pink-500/20 glow-premium">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Próximo Período</p>
                  <p className="text-2xl font-bold text-pink-500">{stats.nextPeriod}</p>
                </div>
                <Calendar className="w-8 h-8 text-pink-500/30" />
              </div>
            </CardContent>
          </Card>

          <Card className="glass-premium border-border/50">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Duração Média</p>
                  <p className="text-2xl font-bold gradient-text">{stats.avgCycleLength} dias</p>
                </div>
                <TrendingUp className="w-8 h-8 text-cyan-500/30" />
              </div>
            </CardContent>
          </Card>

          <Card className="glass-premium border-border/50">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Fase Atual</p>
                  <p className="text-2xl font-bold text-purple-500">{stats.currentPhase}</p>
                </div>
                <Moon className="w-8 h-8 text-purple-500/30" />
              </div>
            </CardContent>
          </Card>

          <Card className="glass-premium border-border/50">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Fertilidade</p>
                  <p className="text-2xl font-bold text-green-500">{stats.fertility}</p>
                </div>
                <Heart className="w-8 h-8 text-green-500/30" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Calendar */}
          <div className="lg:col-span-2">
            <Card className="glass-premium border-border/50">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center gap-2">
                    <Calendar className="w-5 h-5 text-pink-500" />
                    {currentMonth.toLocaleDateString('pt-PT', { month: 'long', year: 'numeric' })}
                  </CardTitle>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm" onClick={prevMonth}>
                      <ChevronLeft className="w-4 h-4" />
                    </Button>
                    <Button variant="outline" size="sm" onClick={nextMonth}>
                      <ChevronRight className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <CycleCalendar 
                  month={currentMonth} 
                  cycleData={cycleData}
                  onDayClick={setSelectedDay}
                  selectedDay={selectedDay}
                />
              </CardContent>
            </Card>

            {/* Phase Info */}
            <Card className="glass-premium border-border/50 mt-6">
              <CardHeader>
                <CardTitle className="text-base flex items-center gap-2">
                  <Activity className="w-4 h-4 text-pink-500" />
                  Fases do Ciclo
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <PhaseCard 
                    phase="menstruation"
                    icon={<Droplet className="w-5 h-5" />}
                    title="Menstruação"
                    days="Dias 1-5"
                    description="Período menstrual. Energia baixa, necessidade de descanso."
                    color="text-red-500"
                    bgColor="bg-red-500/10"
                    borderColor="border-red-500/20"
                  />
                  <PhaseCard 
                    phase="follicular"
                    icon={<Sun className="w-5 h-5" />}
                    title="Folicular"
                    days="Dias 6-13"
                    description="Energia crescente, criatividade elevada, humor positivo."
                    color="text-orange-500"
                    bgColor="bg-orange-500/10"
                    borderColor="border-orange-500/20"
                  />
                  <PhaseCard 
                    phase="ovulation"
                    icon={<Zap className="w-5 h-5" />}
                    title="Ovulação"
                    days="Dias 14-16"
                    description="Pico de energia e fertilidade. Melhor momento para atividades sociais."
                    color="text-green-500"
                    bgColor="bg-green-500/10"
                    borderColor="border-green-500/20"
                  />
                  <PhaseCard 
                    phase="luteal"
                    icon={<Moon className="w-5 h-5" />}
                    title="Lútea"
                    days="Dias 17-28"
                    description="Energia diminui gradualmente. Foco em autocuidado."
                    color="text-purple-500"
                    bgColor="bg-purple-500/10"
                    borderColor="border-purple-500/20"
                  />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* AI Insights */}
            <Card className="glass-premium border-primary/20 glow-premium">
              <CardHeader>
                <CardTitle className="text-base flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-primary" />
                  Insights de IA
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="p-3 rounded-lg bg-gradient-to-br from-pink-500/10 to-rose-600/10 border border-pink-500/20">
                    <p className="text-xs leading-relaxed">
                      📅 <strong>Previsão:</strong> Seu próximo período deve começar em 
                      <span className="font-bold text-pink-500"> 5 dias</span> (23 Jan).
                    </p>
                  </div>
                  <div className="p-3 rounded-lg bg-gradient-to-br from-green-500/10 to-emerald-600/10 border border-green-500/20">
                    <p className="text-xs leading-relaxed">
                      🌱 <strong>Fertilidade:</strong> Janela fértil prevista entre 
                      <span className="font-bold text-green-500"> 8-12 Jan</span>.
                    </p>
                  </div>
                  <div className="p-3 rounded-lg bg-gradient-to-br from-purple-500/10 to-violet-600/10 border border-purple-500/20">
                    <p className="text-xs leading-relaxed">
                      💡 <strong>Padrão:</strong> Ciclos regulares de 28 dias. 
                      Precisão de previsão: <span className="font-bold text-purple-500">95%</span>.
                    </p>
                  </div>
                  <div className="p-3 rounded-lg bg-gradient-to-br from-orange-500/10 to-amber-600/10 border border-orange-500/20">
                    <p className="text-xs leading-relaxed">
                      ⚡ <strong>Energia:</strong> Você está na fase folicular - 
                      ótimo momento para novos projetos!
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Symptoms Tracker */}
            <Card className="glass-premium border-border/50">
              <CardHeader>
                <CardTitle className="text-base flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 text-orange-500" />
                  Sintomas Comuns
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {commonSymptoms.map((symptom, index) => (
                    <div key={index} className="flex items-center justify-between p-2 rounded-lg bg-muted/30">
                      <span className="text-sm">{symptom.name}</span>
                      <span className="text-xs text-muted-foreground">{symptom.frequency}%</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Mood Tracker */}
            <Card className="glass-premium border-border/50">
              <CardHeader>
                <CardTitle className="text-base flex items-center gap-2">
                  <Brain className="w-4 h-4 text-cyan-500" />
                  Humor Este Mês
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <div className="flex-1 h-2 bg-muted rounded-full overflow-hidden">
                      <div className="h-full bg-gradient-to-r from-green-500 to-emerald-600 w-[60%]" />
                    </div>
                    <span className="text-sm font-semibold">Bom 60%</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="flex-1 h-2 bg-muted rounded-full overflow-hidden">
                      <div className="h-full bg-gradient-to-r from-cyan-500 to-blue-600 w-[25%]" />
                    </div>
                    <span className="text-sm font-semibold">Neutro 25%</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="flex-1 h-2 bg-muted rounded-full overflow-hidden">
                      <div className="h-full bg-gradient-to-r from-orange-500 to-amber-600 w-[15%]" />
                    </div>
                    <span className="text-sm font-semibold">Mau 15%</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Recommendations */}
            <Card className="glass-premium border-border/50">
              <CardHeader>
                <CardTitle className="text-base flex items-center gap-2">
                  <Heart className="w-4 h-4 text-pink-500" />
                  Recomendações
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2 text-sm">
                  <p className="flex items-start gap-2">
                    <span className="text-green-500">✓</span>
                    <span>Mantenha-se hidratada (2L água/dia)</span>
                  </p>
                  <p className="flex items-start gap-2">
                    <span className="text-green-500">✓</span>
                    <span>Exercício leve (yoga, caminhada)</span>
                  </p>
                  <p className="flex items-start gap-2">
                    <span className="text-green-500">✓</span>
                    <span>Alimentos ricos em ferro</span>
                  </p>
                  <p className="flex items-start gap-2">
                    <span className="text-green-500">✓</span>
                    <span>Durma 7-8 horas por noite</span>
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
}

function CycleCalendar({ 
  month, 
  cycleData, 
  onDayClick,
  selectedDay 
}: { 
  month: Date; 
  cycleData: CycleDay[];
  onDayClick: (day: CycleDay) => void;
  selectedDay: CycleDay | null;
}) {
  const daysInMonth = new Date(month.getFullYear(), month.getMonth() + 1, 0).getDate();
  const firstDayOfMonth = new Date(month.getFullYear(), month.getMonth(), 1).getDay();
  const days = Array.from({ length: daysInMonth }, (_, i) => i + 1);
  const emptyDays = Array.from({ length: firstDayOfMonth }, (_, i) => i);

  const getDayData = (day: number): CycleDay => {
    const date = new Date(month.getFullYear(), month.getMonth(), day);
    return cycleData.find(d => d.date.toDateString() === date.toDateString()) || {
      date,
      phase: "follicular",
      isPeriod: false,
      isOvulation: false,
      isPredicted: false,
    };
  };

  const getPhaseColor = (phase: CyclePhase) => {
    switch (phase) {
      case "menstruation": return "bg-red-500/20 border-red-500/40";
      case "follicular": return "bg-orange-500/20 border-orange-500/40";
      case "ovulation": return "bg-green-500/20 border-green-500/40";
      case "luteal": return "bg-purple-500/20 border-purple-500/40";
    }
  };

  return (
    <div>
      <div className="grid grid-cols-7 gap-2 mb-2">
        {["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sáb"].map(day => (
          <div key={day} className="text-center text-xs font-semibold text-muted-foreground p-2">
            {day}
          </div>
        ))}
      </div>
      <div className="grid grid-cols-7 gap-2">
        {emptyDays.map(i => (
          <div key={`empty-${i}`} className="aspect-square" />
        ))}
        {days.map(day => {
          const dayData = getDayData(day);
          const isSelected = selectedDay?.date.toDateString() === dayData.date.toDateString();
          
          return (
            <button
              key={day}
              onClick={() => onDayClick(dayData)}
              className={`
                aspect-square rounded-lg border-2 p-2 relative
                hover:scale-105 transition-all duration-200
                ${getPhaseColor(dayData.phase)}
                ${isSelected ? "ring-2 ring-primary" : ""}
                ${dayData.isPredicted ? "border-dashed" : ""}
              `}
            >
              <span className="text-sm font-semibold">{day}</span>
              {dayData.isPeriod && (
                <Droplet className="w-3 h-3 text-red-500 absolute bottom-1 right-1" />
              )}
              {dayData.isOvulation && (
                <Zap className="w-3 h-3 text-green-500 absolute bottom-1 right-1" />
              )}
            </button>
          );
        })}
      </div>
      <div className="mt-4 flex flex-wrap gap-3 text-xs">
        <div className="flex items-center gap-1">
          <div className="w-4 h-4 rounded bg-red-500/20 border-2 border-red-500/40" />
          <span>Menstruação</span>
        </div>
        <div className="flex items-center gap-1">
          <div className="w-4 h-4 rounded bg-orange-500/20 border-2 border-orange-500/40" />
          <span>Folicular</span>
        </div>
        <div className="flex items-center gap-1">
          <div className="w-4 h-4 rounded bg-green-500/20 border-2 border-green-500/40" />
          <span>Ovulação</span>
        </div>
        <div className="flex items-center gap-1">
          <div className="w-4 h-4 rounded bg-purple-500/20 border-2 border-purple-500/40" />
          <span>Lútea</span>
        </div>
        <div className="flex items-center gap-1">
          <div className="w-4 h-4 rounded border-2 border-dashed border-muted-foreground" />
          <span>Previsão</span>
        </div>
      </div>
    </div>
  );
}

function PhaseCard({ 
  phase, 
  icon, 
  title, 
  days, 
  description, 
  color, 
  bgColor, 
  borderColor 
}: {
  phase: string;
  icon: React.ReactNode;
  title: string;
  days: string;
  description: string;
  color: string;
  bgColor: string;
  borderColor: string;
}) {
  return (
    <div className={`p-4 rounded-lg border ${bgColor} ${borderColor}`}>
      <div className="flex items-start gap-3">
        <div className={`${color}`}>{icon}</div>
        <div className="flex-1">
          <div className="flex items-center justify-between mb-1">
            <h4 className="font-semibold">{title}</h4>
            <span className="text-xs text-muted-foreground">{days}</span>
          </div>
          <p className="text-xs text-muted-foreground leading-relaxed">{description}</p>
        </div>
      </div>
    </div>
  );
}

// Mock data generators
function generateMockCycleData(month: Date): CycleDay[] {
  const data: CycleDay[] = [];
  const daysInMonth = new Date(month.getFullYear(), month.getMonth() + 1, 0).getDate();
  
  for (let i = 1; i <= daysInMonth; i++) {
    const date = new Date(month.getFullYear(), month.getMonth(), i);
    const dayOfCycle = (i + 10) % 28; // Mock cycle day
    
    let phase: CyclePhase = "follicular";
    let isPeriod = false;
    let isOvulation = false;
    
    if (dayOfCycle <= 5) {
      phase = "menstruation";
      isPeriod = true;
    } else if (dayOfCycle <= 13) {
      phase = "follicular";
    } else if (dayOfCycle <= 16) {
      phase = "ovulation";
      isOvulation = dayOfCycle === 14;
    } else {
      phase = "luteal";
    }
    
    data.push({
      date,
      phase,
      isPeriod,
      isOvulation,
      isPredicted: i > 15, // Future days are predicted
    });
  }
  
  return data;
}

function calculateStats(cycleData: CycleDay[]) {
  return {
    nextPeriod: "5 dias",
    avgCycleLength: 28,
    currentPhase: "Folicular",
    fertility: "Baixa",
  };
}

const commonSymptoms = [
  { name: "Cólicas", frequency: 80 },
  { name: "Fadiga", frequency: 65 },
  { name: "Dor de cabeça", frequency: 45 },
  { name: "Inchaço", frequency: 70 },
  { name: "Mudanças de humor", frequency: 60 },
];

