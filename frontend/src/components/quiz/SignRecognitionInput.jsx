import { AlertCircle, Camera, CheckCircle2 } from "lucide-react";

import { useHandDetection } from "../../hooks/useHandDetection";
import { useWebcam } from "../../hooks/useWebcam";
import api from "../../utils/api";
import { Spinner } from "../common/PageLoader";
import { useState } from "react";

export default function SignRecognitionInput({ value, onChange }) {
  const { videoRef, status, errorMessage, start } = useWebcam();
  const { handDetected, normalizedVector } = useHandDetection(videoRef, { enabled: status === "active" });
  const [isCapturing, setIsCapturing] = useState(false);

  const handleCapture = async () => {
    if (!normalizedVector) return;
    setIsCapturing(true);
    try {
      const { data } = await api.post("/translate/predict", { landmarks: normalizedVector, face_detected: false });
      onChange(data.label);
    } catch {
      // leave value unset on failure — user can retry
    } finally {
      setIsCapturing(false);
    }
  };

  return (
    <div className="mt-4">
      <div className="relative aspect-video max-w-sm overflow-hidden rounded-xl bg-black">
        <video ref={videoRef} autoPlay muted playsInline className="h-full w-full -scale-x-100 object-cover" />

        {status === "idle" && (
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 bg-void/80 p-4 text-center">
            <Camera className="text-signal" size={24} />
            <button type="button" onClick={start} className="btn-primary !py-1 text-xs">
              Start Camera
            </button>
          </div>
        )}

        {status === "requesting" && (
          <div className="absolute inset-0 flex items-center justify-center bg-void/60">
            <Spinner size={24} className="text-ink" />
          </div>
        )}
        {(status === "denied" || status === "error") && (
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 bg-void/80 p-4 text-center">
            <AlertCircle className="text-danger" size={22} />
            <p className="text-xs font-medium text-ink">{errorMessage}</p>
            <p className="text-[11px] text-ink-muted">Click the lock icon in the address bar and set Camera to Allow.</p>
            <div className="flex flex-wrap items-center justify-center gap-2 pt-1">
              <button type="button" onClick={start} className="btn-secondary !py-1 text-xs">
                Retry Camera Access
              </button>
              <button
                type="button"
                onClick={() => onChange("B")}
                className="btn-primary !py-1 text-xs"
              >
                Simulate Sign
              </button>
            </div>
          </div>
        )}
        {status === "active" && (
          <span className="absolute bottom-2 left-2 flex items-center gap-1.5 rounded-full bg-void/70 px-2.5 py-1 text-[11px] text-ink">
            <span className={`h-1.5 w-1.5 rounded-full ${handDetected ? "bg-signal" : "bg-ink-faint"}`} />
            {handDetected ? "Hand detected" : "Show your hand"}
          </span>
        )}
      </div>

      <div className="mt-3 flex items-center gap-3">
        <button onClick={handleCapture} disabled={!handDetected || isCapturing} className="btn-secondary !py-2 text-sm">
          {isCapturing ? <Spinner size={14} /> : <Camera size={16} />}
          Capture my sign
        </button>
        {value && (
          <span className="flex items-center gap-1.5 text-sm text-signal">
            <CheckCircle2 size={16} />
            Captured: <span className="font-mono">{value}</span>
          </span>
        )}
      </div>
    </div>
  );
}
