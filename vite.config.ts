import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  server: {
    host: true, // Alterado de "::" para 'true' para garantir que o servidor seja acessível externamente
    port: 8080,
    allowedHosts: [
      'localhost',
      '192.168.86.55',
      '127.0.0.1',
      '0.0.0.0',
      '08a32ba794af.ngrok-free.app',// <--- Adicionado o domínio do ngrok aqui
    ],
  },
  plugins: [react(), mode === "development" && componentTagger()].filter(Boolean),
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
}));
