import { useState } from "react";
import { useAuth } from "@/_core/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { 
  Calendar as CalendarIcon, 
  Plus,
  ChevronLeft,
  ChevronRight,
  Clock,
  MapPin,
  Users,
  Sparkles,
  AlertCircle,
  Video,
  Bell
} from "lucide-react";
import { Link } from "wouter";

interface CalendarEvent {
  id: string;
  title: string;
  startTime: string;
  endTime: string;
  date: string;
  color: string;
  location?: string;
  attendees?: number;
  type?: "meeting" | "personal" | "reminder";
}

export default function Calendar() {
  const { user } = useAuth();
  const [currentDate, setCurrentDate] = useState(new Date());
  const [view, setView] = useState<"month" | "week" | "day">("week");
  const [quickAddInput, setQuickAddInput] = useState("");

  const monthNames = ["Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho",
    "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro"];
  
  const weekDays = ["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sáb"];

  const navigateMonth = (direction: number) => {
    const newDate = new Date(currentDate);
    newDate.setMonth(currentDate.getMonth() + direction);
    setCurrentDate(newDate);
  };

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
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-cyan-50/20 dark:to-cyan-950/10">
      {/* Header */}

      {/* Main Content */}
      <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Page Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-3xl font-bold flex items-center gap-3">
                <CalendarIcon className="w-8 h-8 text-cyan-500" />
                Calendário Inteligente
              </h2>
              <p className="text-muted-foreground mt-1">
                Gerencie seus eventos com IA e sincronização Google Calendar
              </p>
            </div>
            
            <Button className="bg-gradient-to-r from-cyan-500 to-blue-600 hover:opacity-90 glow-premium">
              <Plus className="w-5 h-5 mr-2" />
              Novo Evento
            </Button>
          </div>

          {/* Quick Add with AI */}
          <Card className="glass-premium border-primary/20 glow-premium">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <Sparkles className="w-5 h-5 text-primary flex-shrink-0" />
                <Input 
                  placeholder='Adicione evento com linguagem natural: "reunião amanhã às 17h"...'
                  className="border-0 bg-transparent focus-visible:ring-0 text-base"
                  value={quickAddInput}
                  onChange={(e) => setQuickAddInput(e.target.value)}
                />
                <Button size="sm" className="bg-gradient-to-r from-primary to-purple-600">
                  Criar
                </Button>
              </div>
              <p className="text-xs text-muted-foreground mt-2 ml-8">
                A IA entende: "reunião com João amanhã às 14h", "almoço sexta-feira 13h", etc.
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Calendar Controls */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm" onClick={() => navigateMonth(-1)}>
                <ChevronLeft className="w-4 h-4" />
              </Button>
              <h3 className="text-xl font-semibold min-w-[200px] text-center">
                {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
              </h3>
              <Button variant="outline" size="sm" onClick={() => navigateMonth(1)}>
                <ChevronRight className="w-4 h-4" />
              </Button>
            </div>
            
            <Button variant="outline" size="sm" onClick={() => setCurrentDate(new Date())}>
              Hoje
            </Button>
          </div>

          <div className="flex items-center gap-2">
            <Button 
              variant={view === "day" ? "default" : "outline"} 
              size="sm"
              onClick={() => setView("day")}
              className={view === "day" ? "bg-gradient-to-r from-cyan-500 to-blue-600" : ""}
            >
              Dia
            </Button>
            <Button 
              variant={view === "week" ? "default" : "outline"} 
              size="sm"
              onClick={() => setView("week")}
              className={view === "week" ? "bg-gradient-to-r from-cyan-500 to-blue-600" : ""}
            >
              Semana
            </Button>
            <Button 
              variant={view === "month" ? "default" : "outline"} 
              size="sm"
              onClick={() => setView("month")}
              className={view === "month" ? "bg-gradient-to-r from-cyan-500 to-blue-600" : ""}
            >
              Mês
            </Button>
          </div>
        </div>

        {/* Main Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Calendar View */}
          <div className="lg:col-span-3">
            <Card className="glass-premium border-border/50">
              <CardContent className="p-6">
                {/* Week View */}
                <div className="space-y-4">
                  {/* Time Grid Header */}
                  <div className="grid grid-cols-8 gap-2">
                    <div className="text-xs text-muted-foreground"></div>
                    {weekDays.map((day, index) => (
                      <div key={index} className="text-center">
                        <div className="text-xs text-muted-foreground">{day}</div>
                        <div className={`text-lg font-semibold mt-1 ${
                          index === new Date().getDay() ? 'text-primary' : ''
                        }`}>
                          {15 + index}
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Time Slots */}
                  <div className="space-y-2">
                    {timeSlots.map((time, index) => (
                      <div key={index} className="grid grid-cols-8 gap-2 min-h-[60px]">
                        <div className="text-xs text-muted-foreground text-right pr-2 pt-1">
                          {time}
                        </div>
                        {[0, 1, 2, 3, 4, 5, 6].map((day) => (
                          <div 
                            key={day} 
                            className="border border-border/30 rounded-lg hover:bg-muted/30 transition-colors cursor-pointer relative"
                          >
                            {/* Sample Events */}
                            {mockEvents
                              .filter(e => e.startTime === time && day === 1)
                              .map(event => (
                                <EventBlock key={event.id} event={event} />
                              ))}
                          </div>
                        ))}
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Today's Events */}
            <Card className="glass-premium border-border/50">
              <CardHeader>
                <CardTitle className="text-base flex items-center gap-2">
                  <Clock className="w-4 h-4 text-cyan-500" />
                  Eventos de Hoje
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {mockEvents.slice(0, 3).map(event => (
                    <div key={event.id} className="p-3 rounded-lg bg-muted/30 hover:bg-muted/50 transition-colors cursor-pointer">
                      <div className="flex items-start gap-2">
                        <div className={`w-1 h-full rounded-full ${event.color} mt-1`} />
                        <div className="flex-1">
                          <h5 className="font-medium text-sm">{event.title}</h5>
                          <div className="flex items-center gap-2 mt-1 text-xs text-muted-foreground">
                            <Clock className="w-3 h-3" />
                            {event.startTime} - {event.endTime}
                          </div>
                          {event.location && (
                            <div className="flex items-center gap-2 mt-1 text-xs text-muted-foreground">
                              <MapPin className="w-3 h-3" />
                              {event.location}
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Conflict Detection */}
            <Card className="glass-premium border-orange-500/20 bg-gradient-to-br from-orange-500/5 to-amber-500/5">
              <CardHeader>
                <CardTitle className="text-base flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 text-orange-500" />
                  Conflitos Detetados
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="p-3 rounded-lg bg-orange-500/10 border border-orange-500/20">
                  <p className="text-sm font-medium text-orange-600 dark:text-orange-400">
                    ⚠️ Sobreposição de Eventos
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">
                    "Reunião de Equipa" e "Call com Cliente" estão marcados para 14:00-15:00
                  </p>
                  <Button size="sm" variant="outline" className="mt-3 w-full text-orange-600 border-orange-500/20">
                    Resolver Conflito
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* AI Suggestions */}
            <Card className="glass-premium border-primary/20 glow-premium">
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
                      💡 Melhor horário para reunião com João: 
                      <strong> Terça 10h-11h</strong> (ambos disponíveis)
                    </p>
                  </div>
                  <div className="p-3 rounded-lg bg-gradient-to-br from-cyan-500/10 to-blue-600/10 border border-cyan-500/20">
                    <p className="text-xs leading-relaxed">
                      🎯 Bloqueie <strong>2h de foco</strong> amanhã de manhã 
                      para trabalho profundo
                    </p>
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

function EventBlock({ event }: { event: CalendarEvent }) {
  return (
    <div className={`absolute inset-0 p-1 rounded-lg ${event.color} bg-opacity-20 border-l-2 overflow-hidden`}>
      <p className="text-xs font-medium truncate">{event.title}</p>
      <p className="text-xs opacity-75 truncate">{event.startTime}</p>
    </div>
  );
}

const timeSlots = [
  "08:00", "09:00", "10:00", "11:00", "12:00", "13:00", 
  "14:00", "15:00", "16:00", "17:00", "18:00", "19:00"
];

const mockEvents: CalendarEvent[] = [
  {
    id: "1",
    title: "Reunião de Equipa",
    startTime: "09:00",
    endTime: "10:00",
    date: "2025-01-16",
    color: "border-primary bg-primary",
    location: "Sala de Reuniões",
    attendees: 5,
    type: "meeting"
  },
  {
    id: "2",
    title: "Call com Cliente",
    startTime: "14:00",
    endTime: "15:00",
    date: "2025-01-16",
    color: "border-cyan-500 bg-cyan-500",
    location: "Google Meet",
    type: "meeting"
  },
  {
    id: "3",
    title: "Revisão de Projeto",
    startTime: "16:00",
    endTime: "17:00",
    date: "2025-01-16",
    color: "border-orange-500 bg-orange-500",
    type: "meeting"
  }
];

