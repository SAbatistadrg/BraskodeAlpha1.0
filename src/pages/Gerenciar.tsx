import { useState, useEffect, useCallback } from "react";
import { Plus, Edit, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CreateMaquinaDialog } from "@/components/CreateMaquinaDialog";
import { EditMaquinaDialog } from "@/components/EditMaquinaDialog"; // Importação do novo diálogo de edição
import { Maquina } from "@/types/maquina"; // Assumindo que esta interface já está definida corretamente
import { useToast } from "@/hooks/use-toast";

export default function Gerenciar() {
  const [maquinas, setMaquinas] = useState<Maquina[]>([]);
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [showEditDialog, setShowEditDialog] = useState(false); // Novo estado para controlar o diálogo de edição
  const [maquinaToEdit, setMaquinaToEdit] = useState<Maquina | null>(null); // Novo estado para armazenar a máquina a ser editada
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  // Extracted fetchMaquinas into a useCallback for reusability and stability
  const fetchMaquinas = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await fetch('https://sandech-chat.ddns.net/braskode/api/maquinas');
      console.log(response);
      if (!response.ok) {
        throw new Error(`Erro HTTP! Status: ${response.status}`);
      }
      const data = await response.json();
      if (data && Array.isArray(data.maquinas)) {
        setMaquinas(data.maquinas);
      } else {
        console.warn("A resposta da API não contém um array 'maquinas' válido na propriedade 'maquinas':", data);
        setMaquinas([]);
        toast({
          title: "Aviso",
          description: "A estrutura da resposta da API não é a esperada. Verifique o console para mais detalhes.",
          variant: "default",
        });
      }
    } catch (err) {
      console.error("Erro ao buscar máquinas:", err);
      setError(`Não foi possível carregar as máquinas. Tente novamente mais tarde. Erro: ${err.toString()}`);
      toast({
        title: "Erro ao carregar máquinas",
        description: "Não foi possível carregar as máquinas do servidor. Tente novamente mais tarde.",
        variant: "destructive",
      });
      setMaquinas([]);
    } finally {
      setLoading(false);
    }
  }, [toast]); // 'toast' is a dependency

  useEffect(() => {
    fetchMaquinas();
  }, [fetchMaquinas]); // 'fetchMaquinas' is a dependency now

  // Function to handle successful creation of a new machine
  const handleMaquinaCreated = () => {
    setShowCreateDialog(false); // Close the dialog
    fetchMaquinas(); // Refresh the list of machines
    toast({
      title: "Máquina criada",
      description: "A nova máquina foi adicionada com sucesso.",
      variant: "default",
    });
  };

  // Nova função para lidar com a edição bem-sucedida de uma máquina
  const handleMaquinaEdited = () => {
    setShowEditDialog(false); // Fecha o diálogo de edição
    setMaquinaToEdit(null); // Limpa a máquina que estava sendo editada
    fetchMaquinas(); // Atualiza a lista de máquinas
    toast({
      title: "Máquina atualizada",
      description: "As informações da máquina foram atualizadas com sucesso.",
      variant: "default",
    });
  };

  const handleDelete = async (tag: string) => {
    if (confirm("Tem certeza que deseja excluir esta máquina?")) {
      try {
        const response = await fetch(`https://sandech-chat.ddns.net/braskode/api/maquinas/tag/${tag}`, {
          method: 'DELETE',
        });
        if (!response.ok) {
          const errorData = await response.json().catch(() => ({ message: 'Erro desconhecido ao excluir.' }));
          throw new Error(errorData.message || `Erro HTTP! Status: ${response.status}`);
        }
        fetchMaquinas();
        toast({
          title: "Máquina excluída",
          description: "A máquina foi removida com sucesso.",
          variant: "default",
        });
      } catch (err: any) {
        console.error("Erro ao excluir máquina:", err);
        toast({
          title: "Erro ao excluir máquina",
          description: `Não foi possível excluir a máquina: ${err.message}`,
          variant: "destructive",
        });
      }
    }
  };
  // Lógica atualizada para a função handleEdit
  const handleEdit = (maquina: Maquina, maquinaAtual: string) => {
    setMaquinaToEdit(maquina); // Define a máquina a ser editada
    setShowEditDialog(true); // Abre o diálogo de edição
  };

  const statusColors: { [key: string]: string } = {
    ativa: "bg-green-500",
    manutencao: "bg-yellow-500",
    inoperante: "bg-red-500", // Adicionado com base no contexto do texto
  };

  return (
    <div className="container mx-auto p-4">
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <h1 className="text-3xl font-bold">Gerenciar Máquinas</h1>
            <p className="text-muted-foreground">
              Gerenciar Máquinas
            </p>
          </div>
          <Button onClick={() => setShowCreateDialog(true)}>
            <Plus className="mr-2 h-4 w-4" />
            Criar Máquina
          </Button>
        </div>
        {loading && (
          <div className="text-center text-muted-foreground">Carregando máquinas...</div>
        )}
        {error && (
          <div className="text-center text-red-500">{error}</div>
        )}
        {!loading && !error && (
          <div className="grid gap-4">
            {maquinas.length === 0 ? (
              <Card className="p-12 text-center">
                <p className="text-muted-foreground">
                  Nenhuma máquina em manutenção ou inoperante
                </p>
              </Card>
            ) : (
              maquinas.map((maquina) => (
                <Card key={maquina.id} className="p-6">
                  <div className="flex items-center justify-between">
                    <div className="space-y-1">
                      <h2 className="text-xl font-semibold">{maquina.nome}</h2>
                      <Badge className={`${statusColors[maquina.status.toLowerCase()] || "bg-gray-500"} text-white`}>
                        {maquina.status.toUpperCase()}
                      </Badge>
                      <p className="font-mono text-primary">{maquina.tag}</p>
                      <div className="grid grid-cols-2 gap-2 text-sm">
                        <div>
                          <span className="text-muted-foreground">Série: </span>
                          {maquina.numero_serie}
                        </div>
                        <div>
                          <span className="text-muted-foreground">Fabricante: </span>
                          {maquina.fabricante}
                        </div>
                        <div>
                          <span className="text-muted-foreground">Localização: </span>
                          {maquina.localizacao}
                        </div>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button variant="outline" size="icon" onClick={() => handleEdit(maquina, maquina.tag)}>
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="destructive"
                        size="icon"
                        onClick={() => handleDelete(maquina.tag)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </Card>
              ))
            )}
          </div>
        )}
      </div>
      <CreateMaquinaDialog
        open={showCreateDialog}
        onClose={() => setShowCreateDialog(false)}
        onSuccess={handleMaquinaCreated}
      />
      {/* Novo componente de diálogo para edição */}
      <EditMaquinaDialog
        open={showEditDialog}
        onClose={() => {
          setShowEditDialog(false);
          setMaquinaToEdit(null); // Limpa a máquina editada ao fechar o diálogo
        }}
        maquinaTag={maquinaToEdit?.tag} // Passa a máquina a ser editada para o diálogo
        onSuccess={handleMaquinaEdited} // Callback para quando a edição for bem-sucedida
      />
    </div>
  );
}
