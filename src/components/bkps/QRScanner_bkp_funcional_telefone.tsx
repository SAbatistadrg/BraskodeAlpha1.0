// src/components/QRScanner.tsx

import React, { useEffect, useRef, useState } from 'react';
// Você provavelmente precisará de uma biblioteca para escanear QR codes,
// como 'html5-qrcode' ou 'react-qr-reader'.
// Por exemplo: import { Html5QrcodeScanner } from 'html5-qrcode';

export function QRScanner() { // O nome do componente é QRScanner (Q e R maiúsculos)
  const videoRef = useRef<HTMLVideoElement>(null);
  const [scanResult, setScanResult] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Esta é uma implementação simplificada.
    // Em um cenário real, você integraria uma biblioteca de QR code aqui.
    // Por exemplo, usando html5-qrcode:
    /*
    const scanner = new Html5QrcodeScanner(
      "reader", { fps: 10, qrbox: { width: 250, height: 250 } }, false
    );

    const onScanSuccess = (decodedText: string, decodedResult: any) => {
      setScanResult(decodedText);
      scanner.clear(); // Para parar o scanner após o primeiro sucesso
    };

    const onScanError = (errorMessage: string) => {
      setError(errorMessage);
    };

    scanner.render(onScanSuccess, onScanError);

    return () => {
      scanner.clear(); // Limpa o scanner ao desmontar o componente
    };
    */

    // Exemplo básico de acesso à câmera (sem lógica de QR code real)
    if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
      navigator.mediaDevices.getUserMedia({ video: { facingMode: "environment" } })
        .then(stream => {
          if (videoRef.current) {
            videoRef.current.srcObject = stream;
            videoRef.current.play();
          }
        })
        .catch(err => {
          console.error("Erro ao acessar a câmera:", err);
          setError("Não foi possível acessar a câmera. Verifique as permissões.");
        });
    } else {
      setError("Seu navegador não suporta acesso à câmera.");
    }

    // Limpeza ao desmontar o componente
    return () => {
      if (videoRef.current && videoRef.current.srcObject) {
        const stream = videoRef.current.srcObject as MediaStream;
        stream.getTracks().forEach(track => track.stop());
      }
    };
  }, []);

  return (
    <div className="qr-scanner-container" style={{ textAlign: 'center', padding: '20px' }}>
      <h2>Leitor de QR Code</h2>
      {error && <p style={{ color: 'red' }}>Erro: {error}</p>}
      {!scanResult ? (
        <>
          <video
            ref={videoRef}
            id="reader" // ID para bibliotecas como html5-qrcode
            width="100%"
            height="auto"
            style={{ maxWidth: '400px', border: '1px solid #ccc', borderRadius: '8px' }}
            playsInline
          ></video>
          <p>Aguardando leitura do QR Code...</p>
        </>
      ) : (
        <div>
          <h3>QR Code Escaneado:</h3>
          <p style={{ fontWeight: 'bold', wordBreak: 'break-all' }}>{scanResult}</p>
          {/* Você pode adicionar um botão para escanear novamente aqui */}
        </div>
      )}
    </div>
  );
}
