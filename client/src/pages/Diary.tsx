import { useAuth } from "@/_core/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BookOpen, Plus } from "lucide-react";
import { Link } from "wouter";

export default function Diary() {
  const { user } = useAuth();

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">Acesso Negado</h2>
          <p className="text-muted-foreground mb-6">Precisa de fazer login</p>
          <Link href="/"><Button>Voltar</Button></Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-3xl font-bold flex items-center gap-3">
                <BookOpen className="w-8 h-8 text-purple-500" />
                Diário Pessoal
              </h2>
              <p className="text-muted-foreground mt-1">Registe os seus pensamentos e reflexões</p>
            </div>
            <Button className="bg-gradient-to-r from-purple-500 to-pink-600">
              <Plus className="w-5 h-5 mr-2" />Nova Entrada
            </Button>
          </div>
        </div>

        <Card className="glass-premium border-border/50">
          <CardHeader>
            <CardTitle>Entradas Recentes</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground text-center py-12">
              Ainda não tem entradas no diário. Comece a escrever!
            </p>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
