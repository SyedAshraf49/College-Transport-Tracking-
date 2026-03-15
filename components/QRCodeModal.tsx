
import React, { useEffect, useRef } from 'react';
import QRCode from 'qrcode';
import Card from './Card';

interface QRCodeModalProps {
  data: string;
  onClose: () => void;
  title: string;
}

const QRCodeModal: React.FC<QRCodeModalProps> = ({ data, onClose, title }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (canvasRef.current && data) {
      QRCode.toCanvas(canvasRef.current, data, { width: 256, margin: 2 }, (error) => {
        if (error) console.error('Error generating QR code:', error);
      });
    }
  }, [data]);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50 p-4" onClick={onClose}>
      <Card className="relative w-full max-w-sm text-center" onClick={(e) => e.stopPropagation()}>
        <h2 className="text-2xl font-bold mb-4">{title}</h2>
        <div className="bg-white p-4 rounded-lg inline-block">
            <canvas ref={canvasRef} />
        </div>
        <p className="mt-4 text-sm text-gray-700 dark:text-gray-300">Show this QR code to the driver for boarding.</p>
        <button
            onClick={onClose}
            className="mt-6 w-full bg-primary-500/70 backdrop-blur-md border border-primary-500/30 text-white font-bold py-2 px-4 rounded-lg hover:bg-primary-500 transition"
        >
            Close
        </button>
      </Card>
    </div>
  );
};

export default QRCodeModal;