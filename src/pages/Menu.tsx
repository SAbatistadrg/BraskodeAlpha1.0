import { useState, useEffect } from "react";
import { QrCode } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { QRScanner } from "@/components/QRScanner";
import { MaquinaDialog } from "@/components/MaquinaDialog";
import { Maquina } from "@/types/maquina";
import { useToast } from "@/hooks/use-toast";

export default function Menu() {
  const [showScanner, setShowScanner] = useState(false);
  const [selectedMaquina, setSelectedMaquina] = useState<Maquina | null>(null);
  const [recentMaquinas, setRecentMaquinas] = useState<Maquina[]>([]);
  const { toast } = useToast();

  useEffect(() => {
    const stored = localStorage.getItem("recentMaquinas");
    if (stored) {
      setRecentMaquinas(JSON.parse(stored));
    }
  }, []);

  const handleScan = async (data: string) => {
    setShowScanner(false);
    
    // Use the entire scanned data as the tag
    const tag = data.trim();

    try {
      const response = await fetch(`https://sandech-chat.ddns.net/braskode/api/maquinas/tag/${tag}`);
      if (!response.ok) {
        throw new Error("Máquina não encontrada");
      }
      
      const maquina: Maquina = await response.json();
      
      // Add to recent machines
      const updated = [maquina, ...recentMaquinas.filter((m) => m.id !== maquina.id)].slice(0, 5);
      setRecentMaquinas(updated);
      localStorage.setItem("recentMaquinas", JSON.stringify(updated));
      
      setSelectedMaquina(maquina);
      toast({
        title: "Máquina encontrada!",
        description: `${maquina.nome} - ${maquina.tag}`,
      });
    } catch (error) {
      toast({
        title: "Erro ao buscar máquina",
        description: "Não foi possível encontrar a máquina no sistema",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="min-h-screen bg-background p-4 pb-24">
      <div className="max-w-4xl mx-auto space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Menu Principal</h1>
          <p className="text-muted-foreground">Sistema de Consulta de Máquinas</p>
        </div>
        <Card className="p-6">
          <h2 className="text-xl font-semibold mb-4">Máquinas Recentes</h2>
          {recentMaquinas.length === 0 ? (
            <p className="text-muted-foreground text-center py-8">
              Nenhuma máquina escaneada recentemente
            </p>
          ) : (
            <div className="space-y-3">
              {recentMaquinas.map((maquina) => (
                <div
                  key={maquina.id}
                  onClick={() => setSelectedMaquina(maquina)}
                  className="flex items-center gap-4 p-3 rounded-lg border hover:bg-accent cursor-pointer transition-colors"
                >
                  {maquina.foto_url && (
                    <img
                      src={maquina.foto_url}
                      alt={maquina.nome}
                      className="w-16 h-16 object-cover rounded"
                    />
                  )}
                  <div className="flex-1">
                    <h3 className="font-semibold">{maquina.nome}</h3>
                    <p className="text-sm text-muted-foreground">{maquina.tag}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-muted-foreground">{maquina.localizacao}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </Card>
      </div>
      <Button
        size="lg"
        className="fixed bottom-6 right-6 h-16 w-16 rounded-full shadow-lg"
        onClick={() => setShowScanner(true)}
      >
        <QrCode className="h-8 w-8" />
      </Button>
      {showScanner && (
        <QRScanner onScan={handleScan} onClose={() => setShowScanner(false)} />
      )}
      <MaquinaDialog
        maquina={selectedMaquina}
        open={!!selectedMaquina}
        onClose={() => setSelectedMaquina(null)}
      />
    </div>
  );
}
