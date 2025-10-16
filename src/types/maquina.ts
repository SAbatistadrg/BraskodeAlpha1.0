export interface Maquina {
  id: number;
  nome: string;
  numero_serie: string;
  fabricante: string;
  tag: string;
  data_aquisicao: string;
  status: "ativa" | "manutencao" | "inoperante";
  data_ultima_manutencao: string | null;
  data_proxima_manutencao: string | null;
  localizacao: string;
  foto_url: string;
  documentos_urls: string[];
  plantas_urls: string[];
  criado_em: string;
  atualizado_em: string;
}
