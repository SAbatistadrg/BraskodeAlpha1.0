import { useEffect, useRef, useState } from "react";
import { BrowserMultiFormatReader } from "@zxing/library";
import Webcam from "react-webcam";
import { X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { Camera, CameraSource, CameraResultType } from '@capacitor/camera';
import { Capacitor } from '@capacitor/core';

interface QRScannerProps {
  onScan: (data: string) => void;
  onClose: () => void;
}

export function QRScanner({ onScan, onClose }: QRScannerProps) {
  const webcamRef = useRef<Webcam>(null);
  const [scanning, setScanning] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    const codeReader = new BrowserMultiFormatReader();
    let intervalId: NodeJS.Timeout;

    const scan = async () => {
      // Lógica para Web
      if (Capacitor.getPlatform() === 'web' && webcamRef.current && scanning) {
        const imageSrc = webcamRef.current.getScreenshot();
        if (imageSrc) {
          try {
            const result = await codeReader.decodeFromImageUrl(imageSrc);
            if (result) {
              setScanning(false);
              onScan(result.getText());
            }
          } catch (err) {
            // Continue scanning
          }
        }
      }
    };

    // Para plataformas móveis
    const scanMobile = async () => {
      if (Capacitor.getPlatform() !== 'web') {
        try {
          const image = await Camera.getPhoto({
            quality: 90,
            allowEditing: false,
            resultType: CameraResultType.Base64,
            source: CameraSource.Camera
          });

          if (image.base64String) {
            // Aqui você precisará converter base64 para imagem e usar ZXing
            // Código de conversão e decodificação
          }
        } catch (error) {
          console.error('Erro ao capturar imagem', error);
        }
      }
    };

    if (scanning) {
      intervalId = setInterval(() => {
        Capacitor.getPlatform() === 'web' ? scan() : scanMobile();
      }, 500);
    }

    return () => {
      if (intervalId) clearInterval(intervalId);
      codeReader.reset();
    };
  }, [scanning, onScan]);

  return (
    <div className="fixed inset-0 bg-background/95 z-50 flex flex-col">
      <div className="flex justify-between items-center p-4 border-b">
        <h2 className="text-xl font-semibold">Escanear QR Code</h2>
        <Button variant="ghost" size="icon" onClick={onClose}>
          <X className="h-5 w-5" />
        </Button>
      </div>
      {Capacitor.getPlatform() === 'web' ? (
        <div className="flex-1 flex items-center justify-center p-4">
          <div className="relative max-w-md w-full aspect-square">
            <Webcam
              ref={webcamRef}
              screenshotFormat="image/jpeg"
              videoConstraints={{
                facingMode: "environment",
              }}
              className="w-full h-full object-cover rounded-lg"
            />
            <div className="absolute inset-0 border-4 border-primary rounded-lg pointer-events-none">
              {/* Marcadores QR */}
            </div>
          </div>
        </div>
      ) : null}
      <div className="p-4 text-center text-muted-foreground">
        Posicione o QR Code dentro da área marcada
      </div>
    </div>
  );
}
