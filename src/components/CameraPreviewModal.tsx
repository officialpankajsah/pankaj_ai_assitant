import React, { useEffect, useRef, useState } from 'react';
import { Camera, X, RefreshCw, Zap, Circle, Check } from 'lucide-react';

interface CameraPreviewModalProps {
  onClose: () => void;
}

export const CameraPreviewModal: React.FC<CameraPreviewModalProps> = ({ onClose }) => {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [capturedPhoto, setCapturedPhoto] = useState<string | null>(null);
  const [cameraError, setCameraError] = useState<string | null>(null);

  useEffect(() => {
    let localStream: MediaStream | null = null;
    const startCamera = async () => {
      try {
        if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
          localStream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'user' } });
          setStream(localStream);
          if (videoRef.current) {
            videoRef.current.srcObject = localStream;
          }
        }
      } catch (err: any) {
        setCameraError('Camera access simulated / restricted in this browser frame.');
      }
    };

    startCamera();

    return () => {
      if (localStream) {
        localStream.getTracks().forEach((t) => t.stop());
      }
    };
  }, []);

  const takePhoto = () => {
    if (!videoRef.current) return;
    const canvas = document.createElement('canvas');
    canvas.width = videoRef.current.videoWidth || 640;
    canvas.height = videoRef.current.videoHeight || 480;
    const ctx = canvas.getContext('2d');
    if (ctx) {
      ctx.drawImage(videoRef.current, 0, 0, canvas.width, canvas.height);
      setCapturedPhoto(canvas.toDataURL('image/png'));
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-md animate-fade-in">
      <div className="w-full max-w-md bg-slate-950 border border-slate-800 rounded-3xl overflow-hidden shadow-2xl flex flex-col">
        {/* Top bar */}
        <div className="p-3.5 bg-black/60 flex items-center justify-between z-10">
          <div className="flex items-center space-x-2 text-slate-200">
            <Camera className="w-4 h-4 text-amber-400" />
            <span className="text-xs font-semibold">Pankaj Ji Camera Viewfinder</span>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-full text-slate-400 hover:text-white hover:bg-slate-800"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Viewfinder area */}
        <div className="relative aspect-[3/4] bg-slate-900 flex items-center justify-center overflow-hidden">
          {capturedPhoto ? (
            <img src={capturedPhoto} alt="Captured" className="w-full h-full object-cover" />
          ) : stream ? (
            <video
              ref={videoRef}
              autoPlay
              playsInline
              muted
              className="w-full h-full object-cover -scale-x-100"
            />
          ) : (
            <div className="text-center p-6 space-y-3">
              <Camera className="w-12 h-12 text-amber-400/40 mx-auto animate-pulse" />
              <div className="text-xs text-slate-300 font-medium">
                {cameraError || 'Initializing Camera Sensor...'}
              </div>
              <p className="text-[11px] text-slate-500">Android CameraX 1.4 API Intent Active</p>
            </div>
          )}

          {/* Grid lines */}
          <div className="absolute inset-0 pointer-events-none grid grid-cols-3 grid-rows-3 opacity-20 border border-white/20">
            <div className="border-r border-b border-white" />
            <div className="border-r border-b border-white" />
            <div className="border-b border-white" />
            <div className="border-r border-b border-white" />
            <div className="border-r border-b border-white" />
            <div className="border-b border-white" />
            <div className="border-r border-white" />
            <div className="border-r border-white" />
            <div />
          </div>
        </div>

        {/* Bottom Shutter Controls */}
        <div className="p-4 bg-black/80 flex items-center justify-around">
          {capturedPhoto ? (
            <>
              <button
                onClick={() => setCapturedPhoto(null)}
                className="px-4 py-2 rounded-xl bg-slate-800 text-slate-200 text-xs font-semibold"
              >
                Retake
              </button>
              <button
                onClick={onClose}
                className="flex items-center space-x-1 px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold shadow-lg"
              >
                <Check className="w-4 h-4" />
                <span>Save Photo</span>
              </button>
            </>
          ) : (
            <>
              <button className="p-2.5 rounded-full text-slate-400 hover:text-amber-400">
                <Zap className="w-5 h-5" />
              </button>
              <button
                onClick={takePhoto}
                className="w-16 h-16 rounded-full border-4 border-white flex items-center justify-center p-1 active:scale-90 transition-transform"
              >
                <div className="w-full h-full rounded-full bg-white hover:bg-amber-400 transition-colors" />
              </button>
              <button className="p-2.5 rounded-full text-slate-400 hover:text-amber-400">
                <RefreshCw className="w-5 h-5" />
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
};
