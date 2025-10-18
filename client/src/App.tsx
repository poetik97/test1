import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/NotFound";
import { Route, Switch } from "wouter";
import ErrorBoundary from "./components/ErrorBoundary";
import { ThemeProvider } from "./contexts/ThemeContext";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import Tasks from "./pages/Tasks";
import Calendar from "./pages/Calendar";
import Finances from "./pages/Finances";
import Goals from "./pages/Goals";
import MenstrualCycle from "./pages/MenstrualCycle";
import Diary from "./pages/Diary";
import Chat from "./pages/Chat";
import Settings from "./pages/Settings";
import Reports from "./pages/Reports";
import DashboardLayout from "./components/DashboardLayout";

function Router() {
  return (
    <Switch>
      <Route path={"/"} component={Home} />
      <Route path={"/login"} component={Login} />
      <Route path={"/register"} component={Register} />
      <Route path={"/dashboard"}>
        <DashboardLayout><Dashboard /></DashboardLayout>
      </Route>
      <Route path={"/tasks"}>
        <DashboardLayout><Tasks /></DashboardLayout>
      </Route>
      <Route path={"/calendar"}>
        <DashboardLayout><Calendar /></DashboardLayout>
      </Route>
      <Route path={"/finances"}>
        <DashboardLayout><Finances /></DashboardLayout>
      </Route>
      <Route path={"/goals"}>
        <DashboardLayout><Goals /></DashboardLayout>
      </Route>
      <Route path={"/menstrual-cycle"}>
        <DashboardLayout><MenstrualCycle /></DashboardLayout>
      </Route>
      <Route path={"/diary"}>
        <DashboardLayout><Diary /></DashboardLayout>
      </Route>
      <Route path={"/chat"}>
        <DashboardLayout><Chat /></DashboardLayout>
      </Route>
      <Route path={"/settings"}>
        <DashboardLayout><Settings /></DashboardLayout>
      </Route>
      <Route path={"/reports"}>
        <DashboardLayout><Reports /></DashboardLayout>
      </Route>
      <Route path={"/404"} component={NotFound} />
      <Route component={NotFound} />
    </Switch>
  );
}

// NOTE: About Theme
// - First choose a default theme according to your design style (dark or light bg), than change color palette in index.css
//   to keep consistent foreground/background color across components
// - If you want to make theme switchable, pass `switchable` ThemeProvider and use `useTheme` hook

function App() {
  return (
    <ErrorBoundary>
      <ThemeProvider
        defaultTheme="light"
        // switchable
      >
        <TooltipProvider>
          <Toaster />
          <Router />
        </TooltipProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}

export default App;
