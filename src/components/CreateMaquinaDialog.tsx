import { useState } from "react";
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

interface CreateMaquinaDialogProps {
  open: boolean;
  onClose: () => void;
}

export function CreateMaquinaDialog({ open, onClose }: CreateMaquinaDialogProps) {
  const [formData, setFormData] = useState({
    nome: "",
    tag: "",
    numero_serie: "",
    fabricante: "",
    status: "ativa" as "ativa" | "manutencao" | "inoperante",
    localizacao: "",
    data_aquisicao: "",
  });
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const formDataToSend = new FormData();
      formDataToSend.append("nome", formData.nome);
      formDataToSend.append("tag", formData.tag);
      formDataToSend.append("numero_serie", formData.numero_serie);
      formDataToSend.append("fabricante", formData.fabricante);
      formDataToSend.append("status", formData.status);
      formDataToSend.append("localizacao", formData.localizacao);
      formDataToSend.append("data_aquisicao", formData.data_aquisicao);
    

      if (imageFile) {
        const extension = imageFile.name.split('.').pop();
        const renamedFile = new File([imageFile], `${formData.tag}.${extension}`, { 
          type: imageFile.type 
        });
        formDataToSend.append("main_image_path", `/home/ubuntu/dev/database_braskode/images/${renamedFile.name}`);
        
        //problema aqui
        formDataToSend.append("imagem", renamedFile);

      }
      const response = await fetch("https://sandech-chat.ddns.net/braskode/api/maquinas", {
        method: "POST",
        body: formDataToSend,
      });

      if(imageFile){
        const response2 = await fetch(`https://sandech-chat.ddns.net/braskode/api/maquinas/imagem/upload/tag/${formData.tag}`, {
            method: "POST",
            body: formDataToSend,
          })

        if (!response2.ok) {
          if (response2.status === 400) {
            const errorData = await response2.json().catch(() => ({ message: "Erro de requisição inválida" }));
            throw new Error(`Erro 400: Verifique se esta TAG já não está sendo utilizada por outra máquina`);
          } else {
            const errorData = await response2.json().catch(() => ({ message: "Erro desconhecido" }));
            throw new Error(errorData.message || "Erro ao criar máquina");
          }
        }
      }


      if (!response.ok) {
        if (response.status === 400) {
          const errorData = await response.json().catch(() => ({ message: "Erro de requisição inválida" }));
          throw new Error(`Erro 400: Verifique se esta TAG já não está sendo utilizada por outra máquina`);
        } else {
          const errorData = await response.json().catch(() => ({ message: "Erro desconhecido" }));
          throw new Error(errorData.message || "Erro ao criar máquina");
        }
      }

      toast({
        title: "Máquina criada!",
        description: `${formData.nome} foi adicionada ao sistema. Recarregando pagina...`,
      });

      setTimeout(() => {
        window.location.reload();
      }, 2000);

      onClose();
      setFormData({
        nome: "",
        tag: "",
        numero_serie: "",
        fabricante: "",
        status: "ativa",
        localizacao: "",
        data_aquisicao: "",
      });
      setImageFile(null);
    } catch (error: any) {
      toast({
        title: "Erro ao criar máquina",
        description: error.message || "Não foi possível adicionar a máquina ao sistema",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Criar Nova Máquina</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="nome">Nome *</Label>
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
              <Label htmlFor="tag">TAG *</Label>
              <Input
                id="tag"
                value={formData.tag}
                onChange={(e) =>
                  setFormData({ ...formData, tag: e.target.value })
                }
                required
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
                onValueChange={(value: any) =>
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
          <div className="space-y-2">
            <Label htmlFor="foto">Foto da Máquina</Label>
            <Input 
              id="foto"
              type="file" 
              accept="image/*" 
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) {
                  setImageFile(file);
                }
              }}
              capture="environment"
            />
            {imageFile && (
              <div className="mt-2">
                <img 
                  src={URL.createObjectURL(imageFile)} 
                  alt="Pré-visualização" 
                  className="max-w-[200px] max-h-[200px] object-cover"
                />
              </div>
            )}
          </div>
          <div className="flex gap-2 pt-4">
            <Button type="button" variant="outline" onClick={onClose} className="flex-1">
              Cancelar
            </Button>
            <Button type="submit" disabled={loading} className="flex-1">
              {loading ? "Criando..." : "Criar Máquina"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
