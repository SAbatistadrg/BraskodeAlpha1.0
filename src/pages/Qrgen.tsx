import React, { useState } from 'react';
import { QRCodeSVG } from 'qrcode.react'; // Importe QRCodeSVG para renderizar como SVG

// Se você estiver usando um sistema de design como Radix UI ou Chakra UI,
// você pode substituir os estilos inline por componentes deles.
// Por exemplo, se você tem um TooltipProvider, ele provavelmente envolve seu App.
// Não é necessário para este componente funcionar, mas é bom saber.

const Qrgen: React.FC = () => {
  const [textToEncode, setTextToEncode] = useState('');
  const [size, setSize] = useState(256); // Tamanho do QR code em pixels

  const handleTextChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setTextToEncode(event.target.value);
  };

  const handleSizeChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSize(Number(event.target.value));
  };

  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      padding: '40px',
      fontFamily: 'Arial, sans-serif',
      backgroundColor: '#f0f2f5',
      minHeight: '100vh',
      boxSizing: 'border-box'
    }}>
      <h1 style={{ color: '#333', marginBottom: '30px' }}>Gerador de QR Code</h1>

      <div style={{
        backgroundColor: '#fff',
        padding: '30px',
        borderRadius: '8px',
        boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
        width: '100%',
        maxWidth: '500px',
        marginBottom: '30px',
        textAlign: 'center'
      }}>
        <div style={{ marginBottom: '20px' }}>
          <label htmlFor="qrText" style={{ display: 'block', marginBottom: '8px', fontSize: '1.1em', fontWeight: 'bold', color: '#555' }}>
            Texto ou URL para o QR Code:
          </label>
          <input
            id="qrText"
            type="text"
            value={textToEncode}
            onChange={handleTextChange}
            style={{
              width: 'calc(100% - 20px)', // Ajusta para padding
              padding: '10px',
              fontSize: '16px',
              borderRadius: '6px',
              border: '1px solid #ddd',
              boxSizing: 'border-box'
            }}
            placeholder="Digite o texto ou URL aqui"
          />
        </div>

        <div style={{ marginBottom: '30px' }}>
          <label htmlFor="qrSize" style={{ display: 'block', marginBottom: '8px', fontSize: '1.1em', fontWeight: 'bold', color: '#555' }}>
            Tamanho do QR Code (px):
          </label>
          <input
            id="qrSize"
            type="number"
            value={size}
            onChange={handleSizeChange}
            min="64"
            max="512"
            step="32"
            style={{
              width: '120px',
              padding: '10px',
              fontSize: '16px',
              borderRadius: '6px',
              border: '1px solid #ddd',
              boxSizing: 'border-box',
              textAlign: 'center'
            }}
          />
        </div>

        {textToEncode ? (
          <div style={{
            border: '1px solid #eee',
            padding: '15px',
            display: 'inline-block',
            backgroundColor: '#fff',
            borderRadius: '8px',
            boxShadow: '0 2px 8px rgba(0,0,0,0.05)'
          }}>
            <QRCodeSVG
              value={textToEncode}
              size={size}
              level="H" // Nível de correção de erro (L, M, Q, H)
              bgColor="#ffffff" // Cor de fundo
              fgColor="#000000" // Cor do QR code
              includeMargin={true} // Inclui margem branca ao redor
            />
          </div>
        ) : (
          <p style={{ color: '#e74c3c', fontSize: '1.1em', fontWeight: 'bold' }}>
            Por favor, digite um texto ou URL para gerar o QR Code.
          </p>
        )}
      </div>
    </div>
  );
};

export default Qrgen;
