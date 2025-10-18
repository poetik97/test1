import { useState } from "react";
import { useAuth } from "@/_core/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  Wallet, 
  TrendingUp, 
  TrendingDown,
  Plus,
  ArrowUpRight,
  ArrowDownRight,
  Sparkles,
  PieChart,
  BarChart3,
  AlertTriangle,
  Target,
  Award
} from "lucide-react";
import { Link } from "wouter";

export default function Finances() {
  const { user } = useAuth();
  const [period, setPeriod] = useState<"week" | "month" | "year">("month");

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
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-orange-50/20 dark:to-orange-950/10">
      {/* Header */}

      {/* Main Content */}
      <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Page Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-3xl font-bold flex items-center gap-3">
                <Wallet className="w-8 h-8 text-orange-500" />
                Controlo Financeiro
              </h2>
              <p className="text-muted-foreground mt-1">
                Gerencie suas finanças com análise inteligente de IA
              </p>
            </div>
            
            <Button className="bg-gradient-to-r from-orange-500 to-amber-600 hover:opacity-90 glow-premium">
              <Plus className="w-5 h-5 mr-2" />
              Nova Transação
            </Button>
          </div>

          {/* Period Selector */}
          <div className="flex gap-2">
            <Button 
              variant={period === "week" ? "default" : "outline"}
              size="sm"
              onClick={() => setPeriod("week")}
              className={period === "week" ? "bg-gradient-to-r from-orange-500 to-amber-600" : ""}
            >
              Semana
            </Button>
            <Button 
              variant={period === "month" ? "default" : "outline"}
              size="sm"
              onClick={() => setPeriod("month")}
              className={period === "month" ? "bg-gradient-to-r from-orange-500 to-amber-600" : ""}
            >
              Mês
            </Button>
            <Button 
              variant={period === "year" ? "default" : "outline"}
              size="sm"
              onClick={() => setPeriod("year")}
              className={period === "year" ? "bg-gradient-to-r from-orange-500 to-amber-600" : ""}
            >
              Ano
            </Button>
          </div>
        </div>

        {/* Financial Overview */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card className="glass-premium border-border/50 hover-lift">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground flex items-center justify-between">
                Saldo Total
                <Wallet className="w-4 h-4" />
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold gradient-text">€2.450,00</div>
              <p className="text-xs text-muted-foreground mt-1 flex items-center gap-1">
                <TrendingUp className="w-3 h-3 text-green-500" />
                <span className="text-green-500">+12%</span> vs mês passado
              </p>
            </CardContent>
          </Card>

          <Card className="glass-premium border-green-500/20 bg-gradient-to-br from-green-500/5 to-emerald-500/5">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground flex items-center justify-between">
                Receitas
                <ArrowUpRight className="w-4 h-4 text-green-500" />
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-green-600 dark:text-green-400">€3.200,00</div>
              <p className="text-xs text-muted-foreground mt-1">
                Este mês
              </p>
            </CardContent>
          </Card>

          <Card className="glass-premium border-red-500/20 bg-gradient-to-br from-red-500/5 to-orange-500/5">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground flex items-center justify-between">
                Despesas
                <ArrowDownRight className="w-4 h-4 text-red-500" />
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-red-600 dark:text-red-400">€750,00</div>
              <p className="text-xs text-muted-foreground mt-1">
                Este mês
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Main Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column */}
          <div className="lg:col-span-2 space-y-6">
            {/* Financial Health Score */}
            <Card className="glass-premium border-primary/20 glow-premium">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Award className="w-5 h-5 text-primary" />
                  Score de Saúde Financeira
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-6">
                  <div className="relative w-32 h-32">
                    <svg className="w-32 h-32 transform -rotate-90">
                      <circle
                        cx="64"
                        cy="64"
                        r="56"
                        stroke="currentColor"
                        strokeWidth="8"
                        fill="none"
                        className="text-muted/20"
                      />
                      <circle
                        cx="64"
                        cy="64"
                        r="56"
                        stroke="url(#gradient)"
                        strokeWidth="8"
                        fill="none"
                        strokeDasharray={`${2 * Math.PI * 56}`}
                        strokeDashoffset={`${2 * Math.PI * 56 * (1 - 0.85)}`}
                        strokeLinecap="round"
                      />
                      <defs>
                        <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                          <stop offset="0%" stopColor="oklch(0.68 0.24 290)" />
                          <stop offset="100%" stopColor="oklch(0.70 0.18 200)" />
                        </linearGradient>
                      </defs>
                    </svg>
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="text-center">
                        <div className="text-3xl font-bold gradient-text">85</div>
                        <div className="text-xs text-muted-foreground">Excelente</div>
                      </div>
                    </div>
                  </div>

                  <div className="flex-1 space-y-3">
                    <div>
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-sm">Poupança</span>
                        <span className="text-sm font-semibold text-green-500">90%</span>
                      </div>
                      <div className="h-2 bg-muted rounded-full overflow-hidden">
                        <div className="h-full bg-gradient-to-r from-green-500 to-emerald-600 w-[90%]" />
                      </div>
                    </div>
                    <div>
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-sm">Orçamento</span>
                        <span className="text-sm font-semibold text-cyan-500">80%</span>
                      </div>
                      <div className="h-2 bg-muted rounded-full overflow-hidden">
                        <div className="h-full bg-gradient-to-r from-cyan-500 to-blue-600 w-[80%]" />
                      </div>
                    </div>
                    <div>
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-sm">Investimentos</span>
                        <span className="text-sm font-semibold text-orange-500">75%</span>
                      </div>
                      <div className="h-2 bg-muted rounded-full overflow-hidden">
                        <div className="h-full bg-gradient-to-r from-orange-500 to-amber-600 w-[75%]" />
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Recent Transactions */}
            <Card className="glass-premium border-border/50">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center gap-2">
                    <BarChart3 className="w-5 h-5 text-orange-500" />
                    Transações Recentes
                  </CardTitle>
                  <Button variant="ghost" size="sm">Ver Todas</Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {mockTransactions.map((transaction, index) => (
                    <div 
                      key={index}
                      className="flex items-center justify-between p-3 rounded-lg bg-muted/30 hover:bg-muted/50 transition-colors"
                    >
                      <div className="flex items-center gap-3">
                        <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                          transaction.type === "income" 
                            ? "bg-green-500/10 text-green-500" 
                            : "bg-red-500/10 text-red-500"
                        }`}>
                          {transaction.type === "income" ? (
                            <ArrowUpRight className="w-5 h-5" />
                          ) : (
                            <ArrowDownRight className="w-5 h-5" />
                          )}
                        </div>
                        <div>
                          <h5 className="font-medium">{transaction.description}</h5>
                          <p className="text-xs text-muted-foreground flex items-center gap-2">
                            {transaction.category}
                            {transaction.aiCategorized && (
                              <span className="flex items-center gap-1 text-primary">
                                <Sparkles className="w-3 h-3" />
                                IA
                              </span>
                            )}
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className={`font-semibold ${
                          transaction.type === "income" 
                            ? "text-green-600 dark:text-green-400" 
                            : "text-red-600 dark:text-red-400"
                        }`}>
                          {transaction.type === "income" ? "+" : "-"}€{transaction.amount}
                        </div>
                        <div className="text-xs text-muted-foreground">{transaction.date}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Spending by Category */}
            <Card className="glass-premium border-border/50">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <PieChart className="w-5 h-5 text-orange-500" />
                  Gastos por Categoria
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {mockCategories.map((category, index) => (
                    <div key={index}>
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <div className={`w-3 h-3 rounded-full ${category.color}`} />
                          <span className="text-sm font-medium">{category.name}</span>
                        </div>
                        <div className="text-sm">
                          <span className="font-semibold">€{category.spent}</span>
                          <span className="text-muted-foreground"> / €{category.budget}</span>
                        </div>
                      </div>
                      <div className="h-2 bg-muted rounded-full overflow-hidden">
                        <div 
                          className={`h-full ${category.color}`}
                          style={{ width: `${(category.spent / category.budget) * 100}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Right Column - AI Insights */}
          <div className="space-y-6">
            {/* AI Financial Insights */}
            <Card className="glass-premium border-primary/20 glow-premium">
              <CardHeader>
                <CardTitle className="text-base flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-primary" />
                  Insights de IA
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="p-3 rounded-lg bg-gradient-to-br from-primary/10 to-purple-600/10 border border-primary/20">
                    <p className="text-xs font-medium mb-1">💰 Previsão de Fluxo de Caixa</p>
                    <p className="text-xs text-muted-foreground leading-relaxed">
                      Baseado no seu padrão, prevemos um saldo de <strong>€2.850</strong> no fim do mês.
                    </p>
                  </div>

                  <div className="p-3 rounded-lg bg-gradient-to-br from-green-500/10 to-emerald-600/10 border border-green-500/20">
                    <p className="text-xs font-medium mb-1 text-green-600 dark:text-green-400">
                      ✅ Oportunidade de Poupança
                    </p>
                    <p className="text-xs text-muted-foreground leading-relaxed">
                      Pode poupar <strong>€150/mês</strong> reduzindo gastos em "Entretenimento".
                    </p>
                  </div>

                  <div className="p-3 rounded-lg bg-gradient-to-br from-orange-500/10 to-amber-600/10 border border-orange-500/20">
                    <p className="text-xs font-medium mb-1 text-orange-600 dark:text-orange-400">
                      📊 Análise de Padrões
                    </p>
                    <p className="text-xs text-muted-foreground leading-relaxed">
                      Gastos aumentam 30% às sextas-feiras. Considere planear melhor.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Anomaly Detection */}
            <Card className="glass-premium border-red-500/20 bg-gradient-to-br from-red-500/5 to-orange-500/5">
              <CardHeader>
                <CardTitle className="text-base flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4 text-red-500" />
                  Detetor de Anomalias
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/20">
                  <p className="text-xs font-medium text-red-600 dark:text-red-400 mb-1">
                    ⚠️ Gasto Incomum Detetado
                  </p>
                  <p className="text-xs text-muted-foreground leading-relaxed">
                    Transação de <strong>€250</strong> em "Compras Online" - 
                    200% acima da média semanal.
                  </p>
                  <Button size="sm" variant="outline" className="mt-2 w-full text-red-600 border-red-500/20">
                    Rever Transação
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Savings Goals */}
            <Card className="glass-premium border-border/50">
              <CardHeader>
                <CardTitle className="text-base flex items-center gap-2">
                  <Target className="w-4 h-4 text-green-500" />
                  Objetivos de Poupança
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {mockSavingsGoals.map((goal, index) => (
                    <div key={index}>
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-medium">{goal.name}</span>
                        <span className="text-xs text-muted-foreground">
                          {goal.progress}%
                        </span>
                      </div>
                      <div className="h-2 bg-muted rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-gradient-to-r from-green-500 to-emerald-600 animate-shimmer"
                          style={{ width: `${goal.progress}%` }}
                        />
                      </div>
                      <div className="flex items-center justify-between mt-1">
                        <span className="text-xs text-muted-foreground">
                          €{goal.current} / €{goal.target}
                        </span>
                        <span className="text-xs text-green-600 dark:text-green-400">
                          +€{goal.monthly}/mês
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Budget Optimizer */}
            <Card className="glass-premium border-primary/20">
              <CardHeader>
                <CardTitle className="text-base flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-primary" />
                  Otimizador de Orçamento
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground mb-3">
                  A IA sugere redistribuir o seu orçamento:
                </p>
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-xs">
                    <span>Alimentação</span>
                    <span className="text-green-500">-€50</span>
                  </div>
                  <div className="flex items-center justify-between text-xs">
                    <span>Poupança</span>
                    <span className="text-green-500">+€100</span>
                  </div>
                  <div className="flex items-center justify-between text-xs">
                    <span>Entretenimento</span>
                    <span className="text-red-500">-€50</span>
                  </div>
                </div>
                <Button size="sm" className="w-full mt-3 bg-gradient-to-r from-primary to-purple-600">
                  Aplicar Sugestões
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
}

const mockTransactions = [
  { description: "Salário", category: "Receita", amount: "3200.00", type: "income", date: "01 Jan", aiCategorized: false },
  { description: "Supermercado", category: "Alimentação", amount: "85.50", type: "expense", date: "15 Jan", aiCategorized: true },
  { description: "Netflix", category: "Entretenimento", amount: "15.99", type: "expense", date: "14 Jan", aiCategorized: true },
  { description: "Ginásio", category: "Saúde", amount: "45.00", type: "expense", date: "13 Jan", aiCategorized: false },
  { description: "Restaurante", category: "Alimentação", amount: "32.50", type: "expense", date: "12 Jan", aiCategorized: true },
];

const mockCategories = [
  { name: "Alimentação", spent: 320, budget: 400, color: "bg-green-500" },
  { name: "Transporte", spent: 80, budget: 100, color: "bg-cyan-500" },
  { name: "Entretenimento", spent: 150, budget: 120, color: "bg-orange-500" },
  { name: "Saúde", spent: 90, budget: 150, color: "bg-purple-500" },
];

const mockSavingsGoals = [
  { name: "Férias 2025", current: 1200, target: 2000, progress: 60, monthly: 200 },
  { name: "Fundo de Emergência", current: 3500, target: 5000, progress: 70, monthly: 300 },
];

