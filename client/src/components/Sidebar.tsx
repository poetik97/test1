import { useState } from "react";
import { Link, useLocation } from "wouter";
import { useAuth } from "@/_core/hooks/useAuth";
import { Button } from "./ui/button";
import {
  LayoutDashboard,
  CheckSquare,
  Calendar,
  Wallet,
  Target,
  Moon,
  BookOpen,
  MessageSquare,
  BarChart3,
  Settings,
  LogOut,
  Menu,
  X,
  Sparkles,
  User,
  Bell,
  ChevronLeft,
  ChevronRight
} from "lucide-react";
import { APP_LOGO, APP_TITLE } from "@/const";

interface NavItem {
  icon: React.ReactNode;
  label: string;
  href: string;
  badge?: string;
}

interface SidebarProps {
  isCollapsed: boolean;
  setIsCollapsed: (value: boolean) => void;
}

export function Sidebar({ isCollapsed, setIsCollapsed }: SidebarProps) {
  const [location] = useLocation();
  const { user, logout } = useAuth();
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  const navItems: NavItem[] = [
    { icon: <LayoutDashboard className="w-5 h-5" />, label: "Dashboard", href: "/dashboard" },
    { icon: <CheckSquare className="w-5 h-5" />, label: "Tarefas", href: "/tasks", badge: "8" },
    { icon: <Calendar className="w-5 h-5" />, label: "Calendário", href: "/calendar", badge: "3" },
    { icon: <Wallet className="w-5 h-5" />, label: "Finanças", href: "/finances" },
    { icon: <Target className="w-5 h-5" />, label: "Objetivos", href: "/goals" },
    { icon: <Moon className="w-5 h-5" />, label: "Ciclo Menstrual", href: "/menstrual-cycle" },
    { icon: <BookOpen className="w-5 h-5" />, label: "Diário", href: "/diary" },
    { icon: <MessageSquare className="w-5 h-5" />, label: "Assistente IA", href: "/chat" },
    { icon: <BarChart3 className="w-5 h-5" />, label: "Relatórios", href: "/reports" },
  ];

  const isActive = (href: string) => location === href;

  const handleLogout = async () => {
    await logout();
    window.location.href = "/";
  };

  return (
    <>
      {/* Mobile Menu Button */}
      <button
        onClick={() => setIsMobileOpen(!isMobileOpen)}
        className="lg:hidden fixed top-4 left-4 z-50 p-2 rounded-lg glass-premium border border-border/50 hover:bg-muted/50 transition-colors"
      >
        {isMobileOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
      </button>

      {/* Mobile Overlay */}
      {isMobileOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-background/80 backdrop-blur-sm z-40"
          onClick={() => setIsMobileOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`
          fixed top-0 left-0 h-screen z-40
          glass-premium border-r border-border/40
          transition-all duration-300 ease-in-out
          ${isCollapsed ? "w-20" : "w-72"}
          ${isMobileOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}
        `}
      >
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="p-6 border-b border-border/40">
            <div className="flex items-center justify-between">
              {!isCollapsed && (
                <Link href="/dashboard">
                  <h1 className="text-xl font-bold gradient-text cursor-pointer">
                    {APP_TITLE}
                  </h1>
                </Link>
              )}
              <button
                onClick={() => setIsCollapsed(!isCollapsed)}
                className="hidden lg:flex p-2 rounded-lg hover:bg-muted/50 transition-colors ml-auto"
              >
                {isCollapsed ? (
                  <ChevronRight className="w-5 h-5" />
                ) : (
                  <ChevronLeft className="w-5 h-5" />
                )}
              </button>
            </div>
          </div>

          {/* User Profile */}
          {user && (
            <div className="p-4 border-b border-border/40">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-500 to-pink-600 flex items-center justify-center flex-shrink-0">
                  {user.avatar ? (
                    <img src={user.avatar} alt={user.name || "User"} className="w-full h-full rounded-full object-cover" />
                  ) : (
                    <User className="w-5 h-5 text-white" />
                  )}
                </div>
                {!isCollapsed && (
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-sm truncate">{user.name || "Utilizador"}</p>
                    <p className="text-xs text-muted-foreground truncate">{user.email}</p>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Navigation */}
          <nav className="flex-1 overflow-y-auto p-4">
            <div className="space-y-1">
              {navItems.map((item) => (
                <Link key={item.href} href={item.href}>
                  <a
                    onClick={() => setIsMobileOpen(false)}
                    className={`
                      flex items-center gap-3 px-4 py-3 rounded-lg
                      transition-all duration-200
                      ${isActive(item.href)
                        ? "bg-gradient-to-r from-purple-500/20 to-pink-600/20 border border-purple-500/30 text-foreground shadow-lg"
                        : "hover:bg-muted/50 text-muted-foreground hover:text-foreground"
                      }
                      ${isCollapsed ? "justify-center" : ""}
                    `}
                  >
                    <div className={isActive(item.href) ? "text-purple-500" : ""}>
                      {item.icon}
                    </div>
                    {!isCollapsed && (
                      <>
                        <span className="flex-1 font-medium">{item.label}</span>
                        {item.badge && (
                          <span className="px-2 py-0.5 text-xs font-semibold rounded-full bg-primary text-primary-foreground">
                            {item.badge}
                          </span>
                        )}
                      </>
                    )}
                  </a>
                </Link>
              ))}
            </div>

            {/* AI Assistant Highlight */}
            {!isCollapsed && (
              <div className="mt-6 p-4 rounded-lg bg-gradient-to-br from-primary/10 to-purple-600/10 border border-primary/20">
                <div className="flex items-center gap-2 mb-2">
                  <Sparkles className="w-4 h-4 text-primary" />
                  <span className="text-sm font-semibold">IA Premium</span>
                </div>
                <p className="text-xs text-muted-foreground mb-3">
                  Seu assistente inteligente está sempre disponível para ajudar!
                </p>
                <Link href="/chat">
                  <Button size="sm" className="w-full bg-gradient-to-r from-purple-500 to-pink-600">
                    Conversar Agora
                  </Button>
                </Link>
              </div>
            )}
          </nav>

          {/* Footer Actions */}
          <div className="p-4 border-t border-border/40 space-y-2">
            <Link href="/settings">
              <a
                className={`
                  flex items-center gap-3 px-4 py-3 rounded-lg
                  hover:bg-muted/50 text-muted-foreground hover:text-foreground
                  transition-colors
                  ${isCollapsed ? "justify-center" : ""}
                `}
              >
                <Settings className="w-5 h-5" />
                {!isCollapsed && <span className="font-medium">Definições</span>}
              </a>
            </Link>
            
            <button
              onClick={handleLogout}
              className={`
                w-full flex items-center gap-3 px-4 py-3 rounded-lg
                hover:bg-red-500/10 text-muted-foreground hover:text-red-500
                transition-colors
                ${isCollapsed ? "justify-center" : ""}
              `}
            >
              <LogOut className="w-5 h-5" />
              {!isCollapsed && <span className="font-medium">Sair</span>}
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content Spacer */}
      <div className={`${isCollapsed ? "lg:ml-20" : "lg:ml-72"} transition-all duration-300`} />
    </>
  );
}

