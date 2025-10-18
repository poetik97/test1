import { useAuth } from "@/_core/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { APP_LOGO, APP_TITLE, getLoginUrl } from "@/const";
import { 
  Calendar, 
  CheckSquare, 
  Target, 
  Wallet, 
  BookOpen, 
  Sparkles,
  ArrowRight,
  BarChart3,
  Zap,
  Shield,
  Star
} from "lucide-react";
import { Link } from "wouter";

export default function Home() {
  const { user, isAuthenticated, logout } = useAuth();

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-purple-50/30 dark:to-purple-950/10">
      {/* Header Premium */}
      <header className="border-b border-border/40 backdrop-blur-xl bg-background/80 sticky top-0 z-50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-3">
              {APP_LOGO && (
                <img src={APP_LOGO} alt={APP_TITLE} className="h-8 w-8" />
              )}
              <h1 className="text-xl font-bold gradient-text">{APP_TITLE}</h1>
            </div>
            
            <nav className="hidden md:flex items-center gap-6">
              <a href="#funcionalidades" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
                Funcionalidades
              </a>
              <a href="#beneficios" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
                Benefícios
              </a>
              <a href="#pricing" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
                Preços
              </a>
            </nav>

            <div className="flex items-center gap-3">
              {isAuthenticated && user ? (
                <>
                  <Link href="/dashboard">
                    <Button variant="ghost" size="sm">
                      Dashboard
                    </Button>
                  </Link>
                  <Button variant="outline" size="sm" onClick={() => logout()}>
                    Sair
                  </Button>
                </>
              ) : (
                <>
                  <Link href="/login">
                    <Button variant="ghost" size="sm">
                      Entrar
                    </Button>
                  </Link>
                  <Link href="/login">
                    <Button size="sm" className="bg-gradient-to-r from-primary to-purple-600 hover:opacity-90 transition-opacity">
                      Começar Grátis
                    </Button>
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section - Ultra Premium */}
      <section className="relative overflow-hidden py-20 sm:py-32">
        {/* Background Effects */}
        <div className="absolute inset-0 -z-10">
          <div className="absolute top-0 left-1/4 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl animate-float" />
          <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-cyan-500/20 rounded-full blur-3xl animate-float" style={{ animationDelay: '1s' }} />
        </div>

        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-4xl mx-auto">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 mb-8 animate-pulse-glow">
              <Sparkles className="w-4 h-4 text-primary" />
              <span className="text-sm font-medium text-primary">Plataforma de Organização Inteligente</span>
            </div>

            <h2 className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-6 leading-tight">
              Organize a sua vida com{" "}
              <span className="gradient-text">Inteligência Artificial</span>
            </h2>

            <p className="text-lg sm:text-xl text-muted-foreground mb-10 max-w-2xl mx-auto leading-relaxed">
              Gerencie tarefas, calendário, finanças e objetivos numa única plataforma premium. 
              Potencializado por IA para maximizar a sua produtividade.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <a href={getLoginUrl()}>
                <Button size="lg" className="bg-gradient-to-r from-primary to-purple-600 hover:opacity-90 transition-opacity text-base px-8 h-12 glow-premium">
                  Começar Gratuitamente
                  <ArrowRight className="ml-2 w-5 h-5" />
                </Button>
              </a>
              <Button size="lg" variant="outline" className="text-base px-8 h-12">
                Ver Demonstração
              </Button>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-8 mt-16 max-w-2xl mx-auto">
              <div className="text-center">
                <div className="text-3xl font-bold gradient-text">10k+</div>
                <div className="text-sm text-muted-foreground mt-1">Utilizadores</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold gradient-text">98%</div>
                <div className="text-sm text-muted-foreground mt-1">Satisfação</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold gradient-text">50h</div>
                <div className="text-sm text-muted-foreground mt-1">Poupadas/mês</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="funcionalidades" className="py-20 bg-gradient-to-b from-transparent to-muted/30">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h3 className="text-3xl sm:text-4xl font-bold mb-4">
              Tudo o que precisa, <span className="gradient-text">num só lugar</span>
            </h3>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Funcionalidades premium para organizar todos os aspectos da sua vida
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature, index) => (
              <Card 
                key={index} 
                className="p-6 glass-premium hover-lift border-border/50 transition-all duration-300 hover:border-primary/50"
              >
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary/20 to-purple-600/20 flex items-center justify-center mb-4">
                  <feature.icon className="w-6 h-6 text-primary" />
                </div>
                <h4 className="text-xl font-semibold mb-2">{feature.title}</h4>
                <p className="text-muted-foreground leading-relaxed">{feature.description}</p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section id="beneficios" className="py-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h3 className="text-3xl sm:text-4xl font-bold mb-6">
                Porque escolher o <span className="gradient-text">Organiza-te360</span>?
              </h3>
              <div className="space-y-6">
                {benefits.map((benefit, index) => (
                  <div key={index} className="flex items-start gap-4">
                    <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                      <benefit.icon className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                      <h5 className="font-semibold mb-1">{benefit.title}</h5>
                      <p className="text-muted-foreground text-sm leading-relaxed">{benefit.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="relative">
              <div className="glass-premium rounded-2xl p-8 border-border/50">
                <div className="space-y-4">
                  <div className="h-4 bg-gradient-to-r from-primary/20 to-transparent rounded animate-shimmer" />
                  <div className="h-4 bg-gradient-to-r from-primary/20 to-transparent rounded animate-shimmer" style={{ animationDelay: '0.2s' }} />
                  <div className="h-4 bg-gradient-to-r from-primary/20 to-transparent rounded w-3/4 animate-shimmer" style={{ animationDelay: '0.4s' }} />
                  <div className="mt-8 grid grid-cols-2 gap-4">
                    <div className="glass-subtle rounded-lg p-4 border border-border/30">
                      <div className="text-2xl font-bold gradient-text">85%</div>
                      <div className="text-xs text-muted-foreground mt-1">Mais Produtivo</div>
                    </div>
                    <div className="glass-subtle rounded-lg p-4 border border-border/30">
                      <div className="text-2xl font-bold gradient-text">3h</div>
                      <div className="text-xs text-muted-foreground mt-1">Poupadas/Dia</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-primary/10 via-purple-500/10 to-cyan-500/10 -z-10" />
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="glass-premium rounded-3xl p-12 text-center border-border/50 max-w-4xl mx-auto">
            <Star className="w-12 h-12 text-primary mx-auto mb-6 animate-pulse-glow" />
            <h3 className="text-3xl sm:text-4xl font-bold mb-4">
              Pronto para transformar a sua vida?
            </h3>
            <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
              Junte-se a milhares de utilizadores que já organizaram as suas vidas com o Organiza-te360
            </p>
            <a href={getLoginUrl()}>
              <Button size="lg" className="bg-gradient-to-r from-primary to-purple-600 hover:opacity-90 transition-opacity text-base px-8 h-12 glow-premium">
                Começar Agora - É Grátis
                <ArrowRight className="ml-2 w-5 h-5" />
              </Button>
            </a>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border/40 py-12 bg-muted/30">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center gap-2 mb-4">
                {APP_LOGO && <img src={APP_LOGO} alt={APP_TITLE} className="h-6 w-6" />}
                <span className="font-bold">{APP_TITLE}</span>
              </div>
              <p className="text-sm text-muted-foreground">
                Organize a sua vida com inteligência artificial
              </p>
            </div>
            
            <div>
              <h6 className="font-semibold mb-3">Produto</h6>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><a href="#funcionalidades" className="hover:text-foreground transition-colors">Funcionalidades</a></li>
                <li><a href="#pricing" className="hover:text-foreground transition-colors">Preços</a></li>
                <li><a href="#" className="hover:text-foreground transition-colors">Roadmap</a></li>
              </ul>
            </div>
            
            <div>
              <h6 className="font-semibold mb-3">Empresa</h6>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><a href="#" className="hover:text-foreground transition-colors">Sobre</a></li>
                <li><a href="#" className="hover:text-foreground transition-colors">Blog</a></li>
                <li><a href="#" className="hover:text-foreground transition-colors">Contacto</a></li>
              </ul>
            </div>
            
            <div>
              <h6 className="font-semibold mb-3">Legal</h6>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><a href="#" className="hover:text-foreground transition-colors">Privacidade</a></li>
                <li><a href="#" className="hover:text-foreground transition-colors">Termos</a></li>
                <li><a href="#" className="hover:text-foreground transition-colors">Cookies</a></li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-border/40 mt-8 pt-8 text-center text-sm text-muted-foreground">
            <p>&copy; 2025 {APP_TITLE}. Todos os direitos reservados.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}

const features = [
  {
    icon: CheckSquare,
    title: "Gestão de Tarefas",
    description: "Organize e priorize as suas tarefas com inteligência artificial. Sistema drag-and-drop intuitivo."
  },
  {
    icon: Calendar,
    title: "Calendário Inteligente",
    description: "Sincronize com Google Calendar. Sugestões automáticas de agendamento e deteção de conflitos."
  },
  {
    icon: Wallet,
    title: "Controlo Financeiro",
    description: "Gerencie receitas e despesas. Análise financeira com IA e previsões de fluxo de caixa."
  },
  {
    icon: Target,
    title: "Objetivos SMART",
    description: "Defina e acompanhe objetivos. Otimização de prazos e insights de progresso com IA."
  },
  {
    icon: BookOpen,
    title: "Diário Inteligente",
    description: "Registe o seu dia e analise padrões emocionais. Insights personalizados de bem-estar."
  },
  {
    icon: Sparkles,
    title: "Assistente IA",
    description: "Sugestões proativas e automações personalizadas. Chat inteligente disponível 24/7."
  }
];

const benefits = [
  {
    icon: Zap,
    title: "Produtividade Máxima",
    description: "Poupe até 3 horas por dia com automações inteligentes e sugestões da IA."
  },
  {
    icon: Shield,
    title: "Segurança Total",
    description: "Os seus dados estão protegidos com encriptação de ponta a ponta e conformidade RGPD."
  },
  {
    icon: BarChart3,
    title: "Insights Poderosos",
    description: "Relatórios detalhados e análises que ajudam a tomar melhores decisões."
  },
  {
    icon: Star,
    title: "Design Premium",
    description: "Interface elegante e intuitiva que torna a organização um prazer."
  }
];

