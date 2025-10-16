import { useEffect, useState } from "react"
import { Moon, Sun } from "lucide-react"
import { Card } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"

export default function Configuracoes() {
  // Inicializa com base no localStorage ou sistema
  const [darkMode, setDarkMode] = useState(() => {
    const savedTheme = localStorage.getItem("darkMode");
    
    // Se já tiver salvo, usa o valor salvo
    if (savedTheme) return savedTheme === "true";
    
    // Senão, verifica o tema do sistema
    return window.matchMedia('(prefers-color-scheme: dark)').matches;
  });

  // Aplica o tema quando o componente monta
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [darkMode]);

  const toggleDarkMode = (checked: boolean) => {
    setDarkMode(checked);
    localStorage.setItem("darkMode", checked.toString());
  };

  return (
    <div className="min-h-screen bg-background p-4">
      <div className="max-w-4xl mx-auto space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Configurações</h1>
          <p className="text-muted-foreground">
            Personalize seu aplicativo
          </p>
        </div>
        <Card className="p-6 space-y-6">
          <div>
            <h2 className="text-xl font-semibold mb-4">Aparência</h2>
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <Label htmlFor="dark-mode" className="text-base">Modo Escuro</Label>
                <p className="text-sm text-muted-foreground">
                  Ative o modo escuro para reduzir o brilho da tela
                </p>
              </div>
              <div className="flex items-center gap-3">
                {darkMode ? (
                  <Moon className="h-5 w-5 text-primary" />
                ) : (
                  <Sun className="h-5 w-5 text-primary" />
                )}
                <Switch
                  id="dark-mode"
                  checked={darkMode}
                  onCheckedChange={toggleDarkMode}
                />
              </div>
            </div>
          </div>
          <div className="pt-6 border-t">
            <h2 className="text-xl font-semibold mb-4">Sobre</h2>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Versão:</span>
                <span className="font-semibold">1.0.0</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Sistema:</span>
                <span className="font-semibold">Gerenciamento de Máquinas</span>
              </div>
            </div>
          </div>
        </Card>
        <Card className="p-6">
          <h2 className="text-xl font-semibold mb-4">Notificações</h2>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <Label className="text-base">Manutenções Programadas</Label>
                <p className="text-sm text-muted-foreground">
                  Receba alertas sobre manutenções agendadas
                </p>
              </div>
              <Switch defaultChecked />
            </div>
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <Label className="text-base">Máquinas Inoperantes</Label>
                <p className="text-sm text-muted-foreground">
                  Alertas quando uma máquina ficar inoperante
                </p>
              </div>
              <Switch defaultChecked />
            </div>
          </div>
        </Card>
        <Card className="p-6">
          <h2 className="text-xl font-semibold mb-4">Dados</h2>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <Label className="text-base">Limpar Histórico</Label>
                <p className="text-sm text-muted-foreground">
                  Remove todas as máquinas do histórico recente
                </p>
              </div>
              <button
                onClick={() => {
                  if (confirm("Tem certeza que deseja limpar o histórico?")) {
                    localStorage.removeItem("recentMaquinas");
                    window.location.reload();
                  }
                }}
                className="px-4 py-2 text-sm font-medium text-destructive-foreground bg-destructive rounded-md hover:bg-destructive/90"
              >
                Limpar
              </button>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
