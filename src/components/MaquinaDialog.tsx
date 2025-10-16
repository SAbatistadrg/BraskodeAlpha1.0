import { useState, useEffect } from "react";
import { Maquina } from "@/types/maquina";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { FileText, Map } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface MaquinaDialogProps {
  maquina: Maquina | null;
  open: boolean;
  onClose: () => void;
}

export function MaquinaDialog({ maquina, open, onClose }: MaquinaDialogProps) {
  // Estado para armazenar a URL da imagem
  const [imagemUrl, setImagemUrl] = useState<string | null>(null);

  // Efeito para buscar a imagem quando a máquina mudar
  useEffect(() => {
    // Função para buscar a imagem
    const buscarImagem = async () => {
      // Reseta a imagem anterior
      setImagemUrl(null);

      // Verifica se há uma tag para fazer a requisição
      if (maquina?.tag) {
        try {
          const response = await fetch(
            `https://sandech-chat.ddns.net/braskode/api/maquinas/imagem/view/tag/${maquina.tag}`
          );

          if (response.ok) {
            const blob = await response.blob();
            const imageUrl = URL.createObjectURL(blob);
            setImagemUrl(imageUrl);
          }
        } catch (error) {
          console.error("Erro ao buscar imagem:", error);
        }
      }
    };

    // Chama a função se o modal estiver aberto e houver uma máquina
    if (open && maquina) {
      buscarImagem();
    }

    // Limpa a URL do objeto quando o componente desmontar
    return () => {
      if (imagemUrl) {
        URL.revokeObjectURL(imagemUrl);
      }
    };
  }, [maquina, open]);

  // Função de segurança para renderização condicional
  const renderIfExists = (value: any) => value || "Não informado";

  // Função para documentos técnicos fictícia
  const handleViewTechnicalDocuments = () => {
    alert("Funcionalidade em desenvolvimento. Em breve você poderá visualizar os documentos técnicos detalhados.");
  };

  // Função para abrir documentos com segurança
  const handleViewDocuments = () => {
    if (maquina?.documentos_urls?.length) {
      maquina.documentos_urls.forEach((url) => window.open(url, "_blank"));
    }
  };

  // Função para abrir plantas com segurança
  const handleViewPlantas = () => {
    if (maquina?.plantas_urls?.length) {
      maquina.plantas_urls.forEach((url) => window.open(url, "_blank"));
    }
  };

  // Se não há máquina, não renderize nada
  if (!maquina) return null;

  // Mapeamento de cores de status
  const statusColors = {
    ativa: "bg-green-500",
    manutencao: "bg-yellow-500",
    inoperante: "bg-red-500",
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        {/* Imagem como cabeçalho */}
        {(imagemUrl || maquina.foto_url) && (
          <div className="w-full h-48 rounded-t-lg overflow-hidden bg-muted absolute top-0 left-0 right-0 -mx-6 -mt-6 border-b-2 border-primary/20">
            <img
              src={imagemUrl || maquina.foto_url}
              alt={maquina.nome || "Foto da Máquina"}
              className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
            />
          </div>
        )}

        {/* Conteúdo com padding para compensar a imagem */}
        <div className="pt-[12rem]">
          <DialogHeader>
            <DialogTitle className="text-2xl flex items-center gap-3">
              {renderIfExists(maquina.nome)}
              <Badge 
                className={statusColors[maquina.status] || "bg-gray-500"}
              >
                {maquina.status?.toUpperCase() || "STATUS DESCONHECIDO"}
              </Badge>
            </DialogTitle>
            <p className="text-lg font-mono text-primary">
              {renderIfExists(maquina.tag)}
            </p>
          </DialogHeader>

          <div className="space-y-3">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <p className="text-sm text-muted-foreground">Número de Série</p>
                <p className="font-semibold">
                  {renderIfExists(maquina.numero_serie)}
                </p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Fabricante</p>
                <p className="font-semibold">
                  {renderIfExists(maquina.fabricante)}
                </p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <p className="text-sm text-muted-foreground">Data de Aquisição</p>
                <p className="font-semibold">
                  {maquina.data_aquisicao
                    ? new Date(maquina.data_aquisicao).toLocaleDateString("pt-BR")
                    : "Não informado"}
                </p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Localização</p>
                <p className="font-semibold">
                  {renderIfExists(maquina.localizacao)}
                </p>
              </div>
            </div>

            {maquina.data_ultima_manutencao && (
              <div>
                <p className="text-sm text-muted-foreground">Última Manutenção</p>
                <p className="font-semibold">
                  {new Date(maquina.data_ultima_manutencao).toLocaleDateString(
                    "pt-BR"
                  )}
                </p>
              </div>
            )}

            {maquina.data_proxima_manutencao && (
              <div>
                <p className="text-sm text-muted-foreground">
                  Próxima Manutenção
                </p>
                <p className="font-semibold">
                  {new Date(maquina.data_proxima_manutencao).toLocaleDateString(
                    "pt-BR"
                  )}
                </p>
              </div>
            )}
          </div>

          <div className="flex flex-wrap gap-2 pt-4">
            {maquina.documentos_urls?.length > 0 && (
              <Button variant="outline" onClick={handleViewDocuments}>
                <FileText className="mr-2 h-4 w-4" />
                Ver Documentos ({maquina.documentos_urls.length})
              </Button>
            )}

            {maquina.plantas_urls?.length > 0 && (
              <Button variant="outline" onClick={handleViewPlantas}>
                <Map className="mr-2 h-4 w-4" />
                Ver Plantas ({maquina.plantas_urls.length})
              </Button>
            )}

            <Button 
              variant="outline" 
              onClick={handleViewTechnicalDocuments}
            >
              <FileText className="mr-2 h-4 w-4" />
              Visualizar Documentos Técnicos
            </Button>
          </div>

          <Button onClick={onClose} className="w-full mt-4">
            Fechar
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
