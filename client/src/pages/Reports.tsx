import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  BarChart3, 
  TrendingUp, 
  TrendingDown,
  Download,
  Calendar,
  CheckCircle2,
  Target,
  DollarSign,
  Clock,
  Zap,
  Brain,
  FileText
} from "lucide-react";
import { useState } from "react";
import { 
  BarChart, 
  Bar, 
  LineChart, 
  Line, 
  PieChart, 
  Pie, 
  Cell,
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer,
  Area,
  AreaChart
} from "recharts";

const COLORS = ['#8b5cf6', '#06b6d4', '#10b981', '#f59e0b', '#ef4444'];

export default function Reports() {
  const [period, setPeriod] = useState("month");

  // Mock data - substituir por dados reais do tRPC
  const productivityData = [
    { day: 'Seg', tasks: 12, hours: 6.5 },
    { day: 'Ter', tasks: 15, hours: 7.2 },
    { day: 'Qua', tasks: 10, hours: 5.8 },
    { day: 'Qui', tasks: 18, hours: 8.1 },
    { day: 'Sex', tasks: 14, hours: 6.9 },
    { day: 'Sáb', tasks: 8, hours: 4.2 },
    { day: 'Dom', tasks: 5, hours: 2.5 },
  ];

  const financialData = [
    { month: 'Jan', receitas: 3200, despesas: 2100 },
    { month: 'Fev', receitas: 3500, despesas: 2300 },
    { month: 'Mar', receitas: 3800, despesas: 2500 },
    { month: 'Abr', receitas: 3600, despesas: 2200 },
    { month: 'Mai', receitas: 4000, despesas: 2600 },
    { month: 'Jun', receitas: 4200, despesas: 2800 },
  ];

  const categoryData = [
    { name: 'Trabalho', value: 45 },
    { name: 'Pessoal', value: 25 },
    { name: 'Saúde', value: 15 },
    { name: 'Finanças', value: 10 },
    { name: 'Outros', value: 5 },
  ];

  const goalsProgress = [
    { goal: 'Poupar €5000', progress: 68, current: 3400, target: 5000 },
    { goal: 'Ler 12 livros', progress: 42, current: 5, target: 12 },
    { goal: 'Exercício 3x/semana', progress: 85, current: 34, target: 40 },
    { goal: 'Aprender Python', progress: 55, current: 55, target: 100 },
  ];

  const timeDistribution = [
    { category: 'Trabalho', hours: 120 },
    { category: 'Pessoal', hours: 45 },
    { category: 'Saúde', hours: 30 },
    { category: 'Finanças', hours: 15 },
    { category: 'Outros', hours: 10 },
  ];

  const handleExportPDF = () => {
    // Implementar exportação para PDF
    alert("Exportar para PDF - Em desenvolvimento");
  };

  return (
    <div className="space-y-6 p-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-3">
            <BarChart3 className="w-8 h-8 text-primary" />
            Relatórios & Análises
          </h1>
          <p className="text-muted-foreground mt-1">
            Insights detalhados sobre a sua produtividade e progresso
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Select value={period} onValueChange={setPeriod}>
            <SelectTrigger className="w-[180px]">
              <Calendar className="w-4 h-4 mr-2" />
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="week">Última Semana</SelectItem>
              <SelectItem value="month">Último Mês</SelectItem>
              <SelectItem value="quarter">Último Trimestre</SelectItem>
              <SelectItem value="year">Último Ano</SelectItem>
            </SelectContent>
          </Select>

          <Button onClick={handleExportPDF} className="gap-2">
            <Download className="w-4 h-4" />
            Exportar PDF
          </Button>
        </div>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="glass-premium">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Tarefas Concluídas</p>
                <p className="text-3xl font-bold mt-2">82</p>
                <p className="text-sm text-green-500 flex items-center gap-1 mt-1">
                  <TrendingUp className="w-4 h-4" />
                  +15% vs mês anterior
                </p>
              </div>
              <div className="p-3 rounded-full bg-primary/10">
                <CheckCircle2 className="w-6 h-6 text-primary" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="glass-premium">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Objetivos Atingidos</p>
                <p className="text-3xl font-bold mt-2">3/5</p>
                <p className="text-sm text-cyan-500 flex items-center gap-1 mt-1">
                  <Target className="w-4 h-4" />
                  60% de sucesso
                </p>
              </div>
              <div className="p-3 rounded-full bg-cyan-500/10">
                <Target className="w-6 h-6 text-cyan-500" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="glass-premium">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Saldo Mensal</p>
                <p className="text-3xl font-bold mt-2">+€1.450</p>
                <p className="text-sm text-green-500 flex items-center gap-1 mt-1">
                  <TrendingUp className="w-4 h-4" />
                  +12% vs mês anterior
                </p>
              </div>
              <div className="p-3 rounded-full bg-green-500/10">
                <DollarSign className="w-6 h-6 text-green-500" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="glass-premium">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Horas Produtivas</p>
                <p className="text-3xl font-bold mt-2">41.2h</p>
                <p className="text-sm text-orange-500 flex items-center gap-1 mt-1">
                  <Clock className="w-4 h-4" />
                  6.2h/dia média
                </p>
              </div>
              <div className="p-3 rounded-full bg-orange-500/10">
                <Clock className="w-6 h-6 text-orange-500" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Tabs */}
      <Tabs defaultValue="productivity" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4 lg:w-auto">
          <TabsTrigger value="productivity">
            <Zap className="w-4 h-4 mr-2" />
            Produtividade
          </TabsTrigger>
          <TabsTrigger value="financial">
            <DollarSign className="w-4 h-4 mr-2" />
            Financeiro
          </TabsTrigger>
          <TabsTrigger value="goals">
            <Target className="w-4 h-4 mr-2" />
            Objetivos
          </TabsTrigger>
          <TabsTrigger value="insights">
            <Brain className="w-4 h-4 mr-2" />
            Insights IA
          </TabsTrigger>
        </TabsList>

        {/* Produtividade */}
        <TabsContent value="productivity" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card className="glass-premium">
              <CardHeader>
                <CardTitle>Tarefas por Dia</CardTitle>
                <CardDescription>Distribuição semanal de tarefas concluídas</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={productivityData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#333" />
                    <XAxis dataKey="day" stroke="#888" />
                    <YAxis stroke="#888" />
                    <Tooltip 
                      contentStyle={{ backgroundColor: '#1a1a1a', border: '1px solid #333' }}
                    />
                    <Bar dataKey="tasks" fill="#8b5cf6" radius={[8, 8, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card className="glass-premium">
              <CardHeader>
                <CardTitle>Horas Trabalhadas</CardTitle>
                <CardDescription>Tempo dedicado por dia da semana</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <AreaChart data={productivityData}>
                    <defs>
                      <linearGradient id="colorHours" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#06b6d4" stopOpacity={0.8}/>
                        <stop offset="95%" stopColor="#06b6d4" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#333" />
                    <XAxis dataKey="day" stroke="#888" />
                    <YAxis stroke="#888" />
                    <Tooltip 
                      contentStyle={{ backgroundColor: '#1a1a1a', border: '1px solid #333' }}
                    />
                    <Area 
                      type="monotone" 
                      dataKey="hours" 
                      stroke="#06b6d4" 
                      fillOpacity={1} 
                      fill="url(#colorHours)" 
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card className="glass-premium">
              <CardHeader>
                <CardTitle>Distribuição por Categoria</CardTitle>
                <CardDescription>Tempo dedicado a cada área</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={categoryData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                      outerRadius={100}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {categoryData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card className="glass-premium">
              <CardHeader>
                <CardTitle>Horas por Categoria</CardTitle>
                <CardDescription>Total de horas dedicadas este mês</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={timeDistribution} layout="vertical">
                    <CartesianGrid strokeDasharray="3 3" stroke="#333" />
                    <XAxis type="number" stroke="#888" />
                    <YAxis dataKey="category" type="category" stroke="#888" width={80} />
                    <Tooltip 
                      contentStyle={{ backgroundColor: '#1a1a1a', border: '1px solid #333' }}
                    />
                    <Bar dataKey="hours" fill="#10b981" radius={[0, 8, 8, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Financeiro */}
        <TabsContent value="financial" className="space-y-6">
          <Card className="glass-premium">
            <CardHeader>
              <CardTitle>Receitas vs Despesas</CardTitle>
              <CardDescription>Evolução mensal do fluxo de caixa</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={400}>
                <LineChart data={financialData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#333" />
                  <XAxis dataKey="month" stroke="#888" />
                  <YAxis stroke="#888" />
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#1a1a1a', border: '1px solid #333' }}
                  />
                  <Legend />
                  <Line 
                    type="monotone" 
                    dataKey="receitas" 
                    stroke="#10b981" 
                    strokeWidth={3}
                    dot={{ r: 6 }}
                  />
                  <Line 
                    type="monotone" 
                    dataKey="despesas" 
                    stroke="#ef4444" 
                    strokeWidth={3}
                    dot={{ r: 6 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card className="glass-premium">
              <CardContent className="p-6">
                <div className="text-center">
                  <p className="text-sm text-muted-foreground">Receitas Totais</p>
                  <p className="text-3xl font-bold mt-2 text-green-500">€22.300</p>
                  <p className="text-sm text-muted-foreground mt-1">Últimos 6 meses</p>
                </div>
              </CardContent>
            </Card>

            <Card className="glass-premium">
              <CardContent className="p-6">
                <div className="text-center">
                  <p className="text-sm text-muted-foreground">Despesas Totais</p>
                  <p className="text-3xl font-bold mt-2 text-red-500">€14.500</p>
                  <p className="text-sm text-muted-foreground mt-1">Últimos 6 meses</p>
                </div>
              </CardContent>
            </Card>

            <Card className="glass-premium">
              <CardContent className="p-6">
                <div className="text-center">
                  <p className="text-sm text-muted-foreground">Poupança</p>
                  <p className="text-3xl font-bold mt-2 text-cyan-500">€7.800</p>
                  <p className="text-sm text-green-500 mt-1">+35% vs período anterior</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Objetivos */}
        <TabsContent value="goals" className="space-y-6">
          <Card className="glass-premium">
            <CardHeader>
              <CardTitle>Progresso dos Objetivos</CardTitle>
              <CardDescription>Acompanhamento detalhado dos seus objetivos SMART</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {goalsProgress.map((goal, index) => (
                <div key={index} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-semibold">{goal.goal}</p>
                      <p className="text-sm text-muted-foreground">
                        {goal.current} / {goal.target}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-2xl font-bold text-primary">{goal.progress}%</p>
                    </div>
                  </div>
                  <div className="w-full bg-secondary rounded-full h-3 overflow-hidden">
                    <div 
                      className="h-full bg-gradient-to-r from-primary to-purple-600 rounded-full transition-all duration-500"
                      style={{ width: `${goal.progress}%` }}
                    />
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Insights IA */}
        <TabsContent value="insights" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card className="glass-premium border-primary/20">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Brain className="w-5 h-5 text-primary" />
                  Padrões Identificados
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="p-4 rounded-lg bg-primary/5 border border-primary/20">
                  <p className="font-semibold text-primary mb-2">🎯 Pico de Produtividade</p>
                  <p className="text-sm text-muted-foreground">
                    Você é mais produtivo entre as <strong>9h-11h</strong> e <strong>14h-16h</strong>. 
                    Agende tarefas importantes nestes períodos.
                  </p>
                </div>

                <div className="p-4 rounded-lg bg-cyan-500/5 border border-cyan-500/20">
                  <p className="font-semibold text-cyan-500 mb-2">📊 Tendência Financeira</p>
                  <p className="text-sm text-muted-foreground">
                    Suas despesas aumentam <strong>15% aos fins de semana</strong>. 
                    Considere definir um orçamento específico para lazer.
                  </p>
                </div>

                <div className="p-4 rounded-lg bg-green-500/5 border border-green-500/20">
                  <p className="font-semibold text-green-500 mb-2">✅ Streak Impressionante</p>
                  <p className="text-sm text-muted-foreground">
                    Você completou tarefas por <strong>12 dias consecutivos</strong>! 
                    Continue assim para desbloquear o badge "Consistente".
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card className="glass-premium border-orange-500/20">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Zap className="w-5 h-5 text-orange-500" />
                  Recomendações
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="p-4 rounded-lg bg-orange-500/5 border border-orange-500/20">
                  <p className="font-semibold text-orange-500 mb-2">💡 Otimização de Tempo</p>
                  <p className="text-sm text-muted-foreground">
                    Agrupe tarefas similares para reduzir <strong>context switching</strong>. 
                    Isso pode aumentar sua produtividade em até 25%.
                  </p>
                </div>

                <div className="p-4 rounded-lg bg-purple-500/5 border border-purple-500/20">
                  <p className="font-semibold text-purple-500 mb-2">🎯 Foco em Objetivos</p>
                  <p className="text-sm text-muted-foreground">
                    O objetivo "Aprender Python" está <strong>atrasado 2 semanas</strong>. 
                    Dedique 30min/dia para recuperar o ritmo.
                  </p>
                </div>

                <div className="p-4 rounded-lg bg-red-500/5 border border-red-500/20">
                  <p className="font-semibold text-red-500 mb-2">⚠️ Alerta de Orçamento</p>
                  <p className="text-sm text-muted-foreground">
                    Gastos com "Alimentação Fora" ultrapassaram o orçamento em <strong>€120</strong>. 
                    Considere cozinhar mais em casa.
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}

