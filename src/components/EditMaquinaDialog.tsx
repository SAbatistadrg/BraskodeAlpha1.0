import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";

// Definindo a interface para os dados da máquina
interface MaquinaData {
  nome: string;
  tag: string;
  numero_serie: string;
  fabricante: string;
  status: "ativa" | "manutencao" | "inoperante";
  localizacao: string;
  data_aquisicao: string; // Formato YYYY-MM-DD
}


interface EditMaquinaDialogProps {
  open: boolean;
  onClose: () => void;
  maquinaTag: string | null; // A tag da máquina a ser editada
  onMaquinaUpdated: () => void; // Callback para quando a máquina for atualizada
}

export function EditMaquinaDialog({
  open,
  onClose,
  maquinaTag,
  onMaquinaUpdated,
}: EditMaquinaDialogProps) {
  const [formData, setFormData] = useState<MaquinaData>({
    nome: "",
    tag: "",
    numero_serie: "",
    fabricante: "",
    status: "ativa",
    localizacao: "",
    data_aquisicao: "",
  });
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true); // Para carregar os dados iniciais
  const { toast } = useToast();

  // Efeito para carregar os dados da máquina quando o dialog abre ou a tag muda
  useEffect(() => {
    const fetchMaquinaData = async () => {
      if (!maquinaTag || !open) {
        setInitialLoading(false);
        return;
      }
      setInitialLoading(true);
      try {
        const response = await fetch(
          `https://sandech-chat.ddns.net/braskode/api/maquinas/tag/${maquinaTag}`
        );
        if (!response.ok) {
          throw new Error("Erro ao carregar dados da máquina");
        }
        const data: MaquinaData = await response.json();
        // Formata a data para o input type="date"
        const formattedDate = data.data_aquisicao
          ? new Date(data.data_aquisicao).toISOString().split("T")[0]
          : "";
        setFormData({ ...data, data_aquisicao: formattedDate });
      } catch (error: any) {
        toast({
          title: "Erro",
          description: error.message || "Não foi possível carregar os dados da máquina.",
          variant: "destructive",
        });
        onClose(); // Fecha o dialog se não conseguir carregar
      } finally {
        setInitialLoading(false);
      }
    };
    fetchMaquinaData();
  }, [maquinaTag, open, onClose, toast]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (!maquinaTag) {
        throw new Error("Tag da máquina não fornecida para edição.");
      }

      // Criando um objeto FormData para enviar os dados
      const dataToSend = new FormData();
      dataToSend.append("nome", formData.nome);
      // dataToSend.append("tag", formData.tag); // A tag é usada na URL, não precisa ser enviada no corpo para PUT
      dataToSend.append("numero_serie", formData.numero_serie); // Número de série é um identificador único e geralmente não é atualizado via PUT
      dataToSend.append("fabricante", formData.fabricante);
      dataToSend.append("status", formData.status);
      dataToSend.append("localizacao", formData.localizacao);
      dataToSend.append("data_aquisicao", formData.data_aquisicao);

      console.log("FormData a ser enviado:");
      // Para ver o conteúdo do FormData no console, você precisa iterar sobre ele
      for (let pair of dataToSend.entries()) {
        console.log(pair[0] + ": " + pair[1]);
      }

      const response = await fetch(
        `https://sandech-chat.ddns.net/braskode/api/maquinas/tag/${maquinaTag}`,
        {
          method: "PUT",
          // Não defina o 'Content-Type' manualmente para FormData.
          // O navegador fará isso automaticamente e incluirá o 'boundary' correto.
          body: dataToSend,
        }
      );

      if (!response.ok) {
        const errorText = await response.text(); // Pega o texto da resposta para depuração
        console.error("Erro na resposta da API:", errorText);
        // Tenta parsear como JSON se for válido, senão usa o texto puro
        try {
          const errorJson = JSON.parse(errorText);
          throw new Error(errorJson.detail || "Erro ao atualizar máquina");
        } catch {
          throw new Error(errorText || "Erro ao atualizar a máquina");
        }
      }

      toast({
        title: "Máquina atualizada!",
        description: `${formData.nome} foi atualizada no sistema. Recarregando pagina...`,
      });
      onClose();
      //atualiza a pagina ao fechar
      setTimeout(() => {
        window.location.reload();
        }, 2000);
      // Chama o callback para atualizar a lista de máquinas
      //onMaquinaUpdated(); 



    } catch (error: any) {
      toast({
        title: "Erro ao atualizar máquina",
        description: error.message || "Não foi possível atualizar a máquina.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  


  // Se o dialog estiver aberto e ainda carregando os dados iniciais, mostra um estado de carregamento
  if (open && initialLoading) {
    return (
      <Dialog open={open} onOpenChange={onClose}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Carregando Dados da Máquina...</DialogTitle>
          </DialogHeader>
          <div className="py-6 text-center text-gray-500">
            Por favor, aguarde enquanto carregamos as informações da máquina.
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Editar Máquina</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="grid gap-4 py-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="nome">Nome da Máquina *</Label>
              <Input
                id="nome"
                value={formData.nome}
                onChange={(e) =>
                  setFormData({ ...formData, nome: e.target.value })
                }
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="tag">Tag da Máquina *</Label>
              <Input
                id="tag"
                value={formData.tag}
                onChange={(e) =>
                  setFormData({ ...formData, tag: e.target.value })
                }
                required
                disabled // Campo desabilitado
              />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="numero_serie">Número de Série *</Label>
              <Input
                id="numero_serie"
                value={formData.numero_serie}
                onChange={(e) =>
                  setFormData({ ...formData, numero_serie: e.target.value })
                }
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="fabricante">Fabricante *</Label>
              <Input
                id="fabricante"
                value={formData.fabricante}
                onChange={(e) =>
                  setFormData({ ...formData, fabricante: e.target.value })
                }
                required
              />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="status">Status *</Label>
              <Select
                value={formData.status}
                onValueChange={(value: MaquinaData["status"]) =>
                  setFormData({ ...formData, status: value })
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="ativa">Ativa</SelectItem>
                  <SelectItem value="manutencao">Manutenção</SelectItem>
                  <SelectItem value="inoperante">Inoperante</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="data_aquisicao">Data de Aquisição *</Label>
              <Input
                id="data_aquisicao"
                type="date"
                value={formData.data_aquisicao}
                onChange={(e) =>
                  setFormData({ ...formData, data_aquisicao: e.target.value })
                }
                required
              />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="localizacao">Localização *</Label>
            <Input
              id="localizacao"
              value={formData.localizacao}
              onChange={(e) =>
                setFormData({ ...formData, localizacao: e.target.value })
              }
              required
            />
          </div>
          <div className="flex gap-2 pt-4">
            <Button type="button" variant="outline" onClick={onClose} className="flex-1 bg-white text-black">
              Cancelar
            </Button>
            <Button type="submit" disabled={loading} className="flex-1">
              {loading ? "Atualizando..." : "Salvar Alterações"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
