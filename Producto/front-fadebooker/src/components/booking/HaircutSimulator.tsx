import React, { useRef, useState, useEffect } from 'react';
import { 
  Camera, 
  Upload, 
  Scissors, 
  RefreshCw, 
  Check, 
  AlertTriangle, 
  Sparkles, 
  Image as ImageIcon,
  Chrome,
  X
} from 'lucide-react';
import { hairstyleService } from '@/lib/api/hairstyleService';

interface HaircutSimulatorProps {
  onSimulationComplete: (simulatedUrl: string | null, styleId: string | null) => void;
}

const HAIRCUT_STYLES = [
  { id: 'degradado', name: 'Degradado (Low Fade)', description: 'Laterales desvanecidos con cabello más largo arriba.' },
  { id: 'clasico', name: 'Clásico (Pompadour)', description: 'Estilo clásico elegante peinado hacia atrás con volumen.' },
  { id: 'moderno', name: 'Moderno (Textured Crop)', description: 'Corte moderno con textura arriba y flequillo corto.' },
  { id: 'mohicano', name: 'Mohicano (Mohawk)', description: 'Cresta central llamativa con laterales rapados.' },
  { id: 'buzzcut', name: 'Pelo Rapado (Buzz Cut)', description: 'Corte ultra corto homogéneo e higiénico.' }
];

export const HaircutSimulator: React.FC<HaircutSimulatorProps> = ({ onSimulationComplete }) => {
  const [sourceMode, setSourceSourceMode] = useState<'upload' | 'camera'>('upload');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [photoPreviewUrl, setPhotoPreviewUrl] = useState<string | null>(null);
  const [cameraStream, setCameraStream] = useState<MediaStream | null>(null);
  const [isCameraActive, setIsCameraActive] = useState(false);
  const [cameraError, setCameraError] = useState<string | null>(null);
  const [selectedStyle, setSelectedStyle] = useState<string>('degradado');
  const [useAI, setUseAI] = useState<boolean>(true);
  
  // Simulation Flow States
  const [loading, setLoading] = useState<boolean>(false);
  const [loadingStep, setLoadingStep] = useState<string>('');
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  
  // Results
  const [uploadedPublicId, setUploadedPublicId] = useState<string | null>(null);
  const [simulationResult, setSimulationResult] = useState<string | null>(null);
  const [wantToAttach, setWantToAttach] = useState<boolean>(false);

  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Stop camera stream on unmount
  useEffect(() => {
    return () => {
      if (cameraStream) {
        cameraStream.getTracks().forEach(track => track.stop());
      }
    };
  }, [cameraStream]);

  // Start Camera Function
  const startCamera = async () => {
    setCameraError(null);
    setIsCameraActive(true);
    try {
      if (cameraStream) {
        cameraStream.getTracks().forEach(track => track.stop());
      }
      
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'user', width: { ideal: 640 }, height: { ideal: 480 } },
        audio: false
      });
      
      setCameraStream(stream);
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
    } catch (err: any) {
      console.error('Error abriendo la cámara:', err);
      setCameraError('No se pudo acceder a la cámara. Por favor verifica los permisos o selecciona una archivo de imagen.');
      setIsCameraActive(false);
    }
  };

  // Stop Camera Function
  const stopCamera = () => {
    if (cameraStream) {
      cameraStream.getTracks().forEach(track => track.stop());
      setCameraStream(null);
    }
    setIsCameraActive(false);
  };

  // Capture frame from webcam
  const capturePhoto = () => {
    if (videoRef.current && canvasRef.current) {
      const video = videoRef.current;
      const canvas = canvasRef.current;
      const ctx = canvas.getContext('2d');
      if (ctx) {
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
        // Flip horizontally for a mirror effect matching selfie preview
        ctx.translate(canvas.width, 0);
        ctx.scale(-1, 1);
        ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
        
        canvas.toBlob((blob) => {
          if (blob) {
            const capturedFile = new File([blob], `selfie_${Date.now()}.jpg`, { type: 'image/jpeg' });
            setSelectedFile(capturedFile);
            setPhotoPreviewUrl(URL.createObjectURL(blob));
            // Reset results since image changed
            setSimulationResult(null);
            setUploadedPublicId(null);
            setWantToAttach(false);
            onSimulationComplete(null, null);
            stopCamera();
          }
        }, 'image/jpeg', 0.95);
      }
    }
  };

  // Handle local file selection
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setSelectedFile(file);
      setPhotoPreviewUrl(URL.createObjectURL(file));
      // Reset results
      setSimulationResult(null);
      setUploadedPublicId(null);
      setWantToAttach(false);
      onSimulationComplete(null, null);
    }
  };

  // Drag and Drop files
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0];
      if (file.type.startsWith('image/')) {
        setSelectedFile(file);
        setPhotoPreviewUrl(URL.createObjectURL(file));
        setSimulationResult(null);
        setUploadedPublicId(null);
        setWantToAttach(false);
        onSimulationComplete(null, null);
      } else {
        alert('Por favor, arrastra únicamente archivos de imagen (.jpg, .png, etc.).');
      }
    }
  };

  // Execute simulation flow
  const generateSimulation = async () => {
    if (!selectedFile) {
      setErrorMsg('Primero captura o selecciona una foto de tu rostro.');
      return;
    }

    setLoading(true);
    setErrorMsg(null);

    try {
      let currentPublicId = uploadedPublicId;

      if (!currentPublicId) {
        setLoadingStep('Generando credenciales seguras de Cloudinary...');
        const signatureData = await hairstyleService.getUploadSignature('user_photos');

        if (!signatureData.success) {
          throw new Error(signatureData.error || 'No se pudo generar la firma de subida.');
        }

        setLoadingStep('Subiendo tu foto a Cloudinary en un canal seguro...');
        const uploadResult = await hairstyleService.uploadPhoto(selectedFile, signatureData);
        currentPublicId = uploadResult.public_id;
        setUploadedPublicId(currentPublicId);
      }

      setLoadingStep(useAI ? 'Procesando simulación inteligente con IA de Cloudinary (esto puede tardar unos segundos)...' : 'Generando filtro de visualización de corte...');
      const simResult = await hairstyleService.simulateHairstyle(currentPublicId, selectedStyle, useAI);

      if (!simResult.success) {
        throw new Error(simResult.error || 'No se pudo generar la simulación del peinado.');
      }

      setSimulationResult(simResult.simulatedImageUrl);
      setWantToAttach(true); // default to attaching it to booking
      onSimulationComplete(simResult.simulatedImageUrl, selectedStyle);

    } catch (err: any) {
      console.error(err);
      setErrorMsg(err?.message || 'Error en la conexión con el servidor. Inténtalo de nuevo.');
    } finally {
      setLoading(false);
      setLoadingStep('');
    }
  };

  const handleAttachmentChange = (checked: boolean) => {
    setWantToAttach(checked);
    if (checked && simulationResult) {
      onSimulationComplete(simulationResult, selectedStyle);
    } else {
      onSimulationComplete(null, null);
    }
  };

  const clearSelection = () => {
    setSelectedFile(null);
    setPhotoPreviewUrl(null);
    setSimulationResult(null);
    setUploadedPublicId(null);
    setWantToAttach(false);
    onSimulationComplete(null, null);
  };

  return (
    <div className="bg-white rounded-xl shadow-lg border border-slate-100 p-6 max-w-full space-y-6">
      <div className="flex items-center space-x-3 pb-2 border-b border-slate-100">
        <Sparkles className="h-6 w-6 text-amber-500 animate-pulse" />
        <div>
          <h3 className="font-bold text-lg text-slate-800">Simulador de Peinados Inteligente</h3>
          <p className="text-xs text-slate-500">Pruébate los mejores looks antes de reservar</p>
        </div>
      </div>

      {/* Tabs selectors for Upload vs Camera */}
      {!photoPreviewUrl && !isCameraActive && (
        <div className="flex space-x-2 bg-slate-100 p-1 rounded-lg">
          <button
            type="button"
            className={`flex-1 flex items-center justify-center space-x-2 py-2 text-sm font-medium rounded-md transition-all ${
              sourceMode === 'upload' 
                ? 'bg-white shadow text-slate-800' 
                : 'text-slate-600 hover:text-slate-800'
            }`}
            onClick={() => setSourceSourceMode('upload')}
          >
            <Upload className="h-4 w-4" />
            <span>Subir Foto</span>
          </button>
          <button
            type="button"
            className={`flex-1 flex items-center justify-center space-x-2 py-2 text-sm font-medium rounded-md transition-all ${
              sourceMode === 'camera' 
                ? 'bg-white shadow text-slate-800' 
                : 'text-slate-600 hover:text-slate-800'
            }`}
            onClick={() => {
              setSourceSourceMode('camera');
              startCamera();
            }}
          >
            <Camera className="h-4 w-4" />
            <span>Usar Cámara</span>
          </button>
        </div>
      )}

      {/* Content Areas */}
      {!photoPreviewUrl && (
        <>
          {sourceMode === 'upload' ? (
            <div 
              onDragOver={handleDragOver}
              onDrop={handleDrop}
              onClick={() => fileInputRef.current?.click()}
              className="border-2 border-dashed border-slate-300 hover:border-blue-500 rounded-xl p-8 text-center cursor-pointer transition bg-slate-50 hover:bg-slate-50/50 flex flex-col items-center justify-center space-y-3"
            >
              <ImageIcon className="h-10 w-10 text-slate-400 group-hover:text-blue-500" />
              <div>
                <p className="text-sm font-medium text-slate-700">Arrastra una foto aquí o haz clic para subir</p>
                <p className="text-xs text-slate-400 mt-1">Soporta JPG, JPEG, PNG y WEBP (Mín. 500x500px para mejores resultados)</p>
              </div>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleFileChange}
              />
            </div>
          ) : (
            <div className="relative overflow-hidden rounded-xl bg-slate-900 border border-slate-200 aspect-[4/3] flex flex-col items-center justify-center">
              {isCameraActive ? (
                <>
                  <video
                    ref={videoRef}
                    autoPlay
                    playsInline
                    className="w-full h-full object-cover scale-x-[-1]"
                  />
                  <div className="absolute bottom-4 left-0 right-0 flex justify-center space-x-4">
                    <button
                      type="button"
                      onClick={capturePhoto}
                      className="p-3 bg-red-600 hover:bg-red-700 text-white rounded-full shadow-lg transition transform hover:scale-105"
                      title="Capturar foto"
                    >
                      <Camera className="h-6 w-6" />
                    </button>
                    <button
                      type="button"
                      onClick={stopCamera}
                      className="p-3 bg-slate-800 hover:bg-slate-700 text-white rounded-full shadow-lg transition"
                      title="Cancelar"
                    >
                      <X className="h-6 w-6" />
                    </button>
                  </div>
                </>
              ) : (
                <div className="p-6 text-center space-y-4">
                  {cameraError ? (
                    <div className="text-sm text-red-500 bg-red-50 p-3 rounded-lg border border-red-100">
                      {cameraError}
                    </div>
                  ) : (
                    <p className="text-sm text-slate-400">Iniciando cámara de tu dispositivo...</p>
                  )}
                  <button
                    type="button"
                    onClick={startCamera}
                    className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg text-sm transition"
                  >
                    Activar Cámara
                  </button>
                </div>
              )}
            </div>
          )}
        </>
      )}

      {/* Selected Photo Preview and Selection of Styles */}
      {photoPreviewUrl && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Left side: original image preview or comparison */}
            <div className="space-y-2">
              <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider block">Foto Base</span>
              <div className="relative rounded-lg aspect-square border overflow-hidden bg-slate-50">
                <img 
                  src={photoPreviewUrl} 
                  alt="Tu Foto" 
                  className="w-full h-full object-cover" 
                />
                {!loading && (
                  <button
                    type="button"
                    onClick={clearSelection}
                    className="absolute top-2 right-2 bg-white/90 hover:bg-white text-slate-700 p-1.5 rounded-full shadow-md transition"
                    title="Cambiar foto"
                  >
                    <X className="h-4 w-4" />
                  </button>
                )}
              </div>
            </div>

            {/* Right side: Simulation Result */}
            <div className="space-y-2">
              <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider flex items-center justify-between">
                <span>Resultado</span>
                {simulationResult && (
                  <span className="text-[10px] bg-emerald-100 text-emerald-800 font-bold px-1.5 py-0.5 rounded flex items-center">
                    <Check className="h-3 w-3 mr-0.5" /> PROCESADO
                  </span>
                )}
              </span>
              <div className="relative rounded-lg aspect-square border overflow-hidden bg-slate-100 flex items-center justify-center">
                {simulationResult ? (
                  <img
                    src={simulationResult}
                    alt="Simulación de Corte"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="text-center p-6 space-y-2">
                    <ImageIcon className="h-10 w-10 text-slate-300 mx-auto" />
                    <p className="text-xs text-slate-400">Selecciona un peinado y haz clic en "Generar simulación" abajo.</p>
                  </div>
                )}

                {loading && (
                  <div className="absolute inset-0 bg-slate-900/70 backdrop-blur-sm flex flex-col items-center justify-center p-6 text-center space-y-4 text-white">
                    <RefreshCw className="h-8 w-8 animate-spin text-amber-400" />
                    <div className="space-y-1">
                      <p className="text-sm font-semibold">Generando tu nuevo look</p>
                      <p className="text-xs text-slate-300 animate-pulse">{loadingStep}</p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* AI vs traditional toggle */}
          <div className="bg-slate-50 p-3 rounded-lg border border-slate-100 flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Sparkles className={`h-5 w-5 ${useAI ? 'text-amber-500' : 'text-slate-400'}`} />
              <div>
                <p className="text-xs font-semibold text-slate-800">IA Generativa (Cloudinary Replace)</p>
                <p className="text-[10px] text-slate-500">Reemplaza el cabello de la foto mediante redes neuronales en tiempo real.</p>
              </div>
            </div>
            <button
              type="button"
              onClick={() => setUseAI(!useAI)}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none ${
                useAI ? 'bg-blue-600' : 'bg-slate-300'
              }`}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                  useAI ? 'translate-x-6' : 'translate-x-1'
                }`}
              />
            </button>
          </div>

          {/* Haircuts Selection */}
          <div className="space-y-2">
            <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider block">Elige un estilo de Corte</label>
            <div className="grid grid-cols-2 lg:grid-cols-5 gap-2">
              {HAIRCUT_STYLES.map((style) => (
                <button
                  key={style.id}
                  type="button"
                  onClick={() => {
                    setSelectedStyle(style.id);
                    // Reset single simulation view so user is encouraged to run it again on the new style
                    if (simulationResult) {
                      setSimulationResult(null);
                      setWantToAttach(false);
                      onSimulationComplete(null, null);
                    }
                  }}
                  className={`p-2.5 rounded-lg border text-left transition ${
                    selectedStyle === style.id
                      ? 'border-blue-500 bg-blue-50/50 shadow-sm'
                      : 'border-slate-200 hover:border-slate-300'
                  }`}
                >
                  <p className="text-xs font-bold text-slate-800 block truncate">{style.name.split(' (')[0]}</p>
                  <p className="text-[10px] text-slate-500 block truncate leading-tight mt-0.5">{style.name.match(/\(([^)]+)\)/)?.[1] || style.id}</p>
                </button>
              ))}
            </div>
            <p className="text-xs text-slate-400 italic mt-1 bg-slate-50 p-2 rounded">
              👉 {HAIRCUT_STYLES.find(x => x.id === selectedStyle)?.description}
            </p>
          </div>

          {/* Action Button and Warnings */}
          <div className="space-y-3">
            {errorMsg && (
              <div className="p-3 bg-red-50 text-red-700 text-xs rounded-lg border border-red-100 flex items-start space-x-2">
                <AlertTriangle className="h-4 w-4 text-red-500 shrink-0 mt-0.5" />
                <span>{errorMsg}</span>
              </div>
            )}

            <button
              type="button"
              onClick={generateSimulation}
              disabled={loading}
              className="w-full py-3 px-4 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-semibold rounded-lg text-sm shadow-md transition transform hover:scale-[1.01] active:scale-[0.99] disabled:opacity-50 flex items-center justify-center space-x-2"
            >
              {loading ? (
                <>
                  <RefreshCw className="h-4 w-4 animate-spin" />
                  <span>Procesando simulación...</span>
                </>
              ) : (
                <>
                  <Scissors className="h-4 w-4" />
                  <span>Generar Simulación de Corte</span>
                </>
              )}
            </button>

            {/* Disclaimer info (Required warning box) */}
            <div className="bg-amber-50 rounded-lg p-3 border border-amber-200/50 flex space-x-2.5">
              <AlertTriangle className="h-5 w-5 text-amber-600 shrink-0 mt-0.5" />
              <p className="text-[11px] text-amber-800 leading-relaxed font-medium">
                <strong>Advertencia de Inteligencia Artificial:</strong> Esta simulación está generada con Inteligencia Artificial utilizando los servicios generativos de Cloudinary. Los resultados mostrados representan estimaciones visuales automatizadas; el peinado final en su cita variará en función de su tipo de cabello, grosor, volumen y morfología facial de la vida real.
              </p>
            </div>

            {/* Checkbox to send resulting simulation to the barber */}
            {simulationResult && (
              <div className="bg-emerald-50 border border-emerald-200/50 rounded-lg p-4 flex items-start space-x-3 mt-4">
                <input
                  id="wantToAttachCheckbox"
                  type="checkbox"
                  checked={wantToAttach}
                  onChange={(e) => handleAttachmentChange(e.target.checked)}
                  className="mt-1 h-4 w-4 text-emerald-600 border-slate-300 rounded focus:ring-emerald-500"
                />
                <div className="text-xs">
                  <label htmlFor="wantToAttachCheckbox" className="font-bold text-slate-800 cursor-pointer block select-none">
                    ✨ ¡Quiero enviar este corte a mi barbero!
                  </label>
                  <p className="text-slate-600 mt-1">
                    Al marcar esta casilla, el enlace de la imagen generada de <strong className="text-slate-800">{HAIRCUT_STYLES.find(x => x.id === selectedStyle)?.name}</strong> se integrará automáticamente en las observaciones para que el barbero asignado pueda visualizar el objetivo visual solicitado.
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Hidden layout canvas */}
      <canvas ref={canvasRef} className="hidden" />
    </div>
  );
};

export default HaircutSimulator;
