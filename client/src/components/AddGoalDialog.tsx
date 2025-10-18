import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { trpc } from "@/lib/trpc";
import { toast } from "sonner";

interface AddGoalDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function AddGoalDialog({ open, onOpenChange }: AddGoalDialogProps) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [targetDate, setTargetDate] = useState("");
  const [targetValue, setTargetValue] = useState("");

  const utils = trpc.useUtils();
  const createGoal = trpc.goals.create.useMutation({
    onSuccess: () => {
      toast.success("Objetivo criado com sucesso!");
      utils.goals.list.invalidate();
      resetForm();
      onOpenChange(false);
    },
    onError: (error) => {
      toast.error("Erro ao criar objetivo: " + error.message);
    },
  });

  const resetForm = () => {
    setTitle("");
    setDescription("");
    setTargetDate("");
    setTargetValue("");
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) {
      toast.error("O título é obrigatório");
      return;
    }

    createGoal.mutate({
      title: title.trim(),
      description: description.trim() || undefined,
      targetDate: targetDate ? new Date(targetDate) : undefined,
      // targetValue removed
      // currentValue removed
      // status removed
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Novo Objetivo</DialogTitle>
          <DialogDescription>Defina um novo objetivo SMART.</DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="title">Título *</Label>
              <Input id="title" value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Ex: Poupar €5000" required />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="description">Descrição</Label>
              <Textarea id="description" value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Detalhes..." rows={3} />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="targetDate">Data Alvo</Label>
                <Input id="targetDate" type="date" value={targetDate} onChange={(e) => setTargetDate(e.target.value)} />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="targetValue">Valor Alvo</Label>
                <Input id="targetValue" type="number" value={targetValue} onChange={(e) => setTargetValue(e.target.value)} placeholder="5000" />
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>Cancelar</Button>
            <Button type="submit" disabled={createGoal.isPending}>{createGoal.isPending ? "A criar..." : "Criar Objetivo"}</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
