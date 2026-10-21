import { FilesetResolver, HandLandmarker } from "@mediapipe/tasks-vision";
import { useEffect, useRef, useState } from "react";

const MEDIAPIPE_WASM_URL = "https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@0.10.14/wasm";
const HAND_LANDMARKER_MODEL_URL =
  "https://storage.googleapis.com/mediapipe-models/hand_landmarker/hand_landmarker/float16/1/hand_landmarker.task";

/**
 * Same normalization used server-side in ai-model/utils.py:
 * translate so the wrist (landmark 0) is the origin, then scale so the
 * largest absolute coordinate is 1.0. Keeping this identical on both
 * sides is what makes the trained model's predictions valid here.
 */
function normalizeLandmarks(rawLandmarks) {
  const wrist = rawLandmarks[0];
  const shifted = rawLandmarks.map((p) => [p.x - wrist.x, p.y - wrist.y, p.z - wrist.z]);
  const maxAbs = Math.max(...shifted.flat().map(Math.abs), 1e-6);
  return shifted.flatMap(([x, y, z]) => [x / maxAbs, y / maxAbs, z / maxAbs]);
}

/**
 * Runs MediaPipe HandLandmarker against a live <video> element on every
 * animation frame and reports the detected hand's raw + normalized
 * landmarks. Prediction (calling the backend model) is left to the
 * caller so this hook stays reusable across pages that need different
 * capture cadences (live translation vs. one-shot practice checks).
 */
export function useHandDetection(videoRef, { enabled = true } = {}) {
  const landmarkerRef = useRef(null);
  const [isReady, setIsReady] = useState(false);
  const [handLandmarks, setHandLandmarks] = useState(null); // raw 21-point array for drawing
  const [normalizedVector, setNormalizedVector] = useState(null); // flattened 63-value model input
  const [handDetected, setHandDetected] = useState(false);

  const [isMediaPipeAvailable, setIsMediaPipeAvailable] = useState(true);

  useEffect(() => {
    let cancelled = false;

    const setup = async () => {
      try {
        const vision = await FilesetResolver.forVisionTasks(MEDIAPIPE_WASM_URL);
        let landmarker;
        try {
          landmarker = await HandLandmarker.createFromOptions(vision, {
            baseOptions: { modelAssetPath: HAND_LANDMARKER_MODEL_URL, delegate: "GPU" },
            runningMode: "VIDEO",
            numHands: 1,
            minHandDetectionConfidence: 0.5,
            minTrackingConfidence: 0.5,
          });
        } catch (gpuErr) {
          console.warn("MediaPipe GPU delegate failed; falling back to CPU delegate:", gpuErr);
          landmarker = await HandLandmarker.createFromOptions(vision, {
            baseOptions: { modelAssetPath: HAND_LANDMARKER_MODEL_URL, delegate: "CPU" },
            runningMode: "VIDEO",
            numHands: 1,
            minHandDetectionConfidence: 0.5,
            minTrackingConfidence: 0.5,
          });
        }
        if (!cancelled) {
          landmarkerRef.current = landmarker;
          setIsReady(true);
        }
      } catch (err) {
        console.warn("MediaPipe HandLandmarker initialization failed (simulation mode available):", err);
        if (!cancelled) {
          setIsReady(true);
          setIsMediaPipeAvailable(false);
        }
      }
    };

    setup();
    return () => {
      cancelled = true;
      try {
        landmarkerRef.current?.close();
      } catch (_err) {
        // Landmarker already closed
      }
    };
  }, []);

  const [isOutOfFrame, setIsOutOfFrame] = useState(false);
  const [fps, setFps] = useState(0);

  useEffect(() => {
    if (!enabled || !isReady) return;

    let animId = null;
    let isCancelled = false;
    let lastDetectionTime = 0;
    let frameCount = 0;
    let lastFpsCalcTime = performance.now();

    // Throttle to 12-15 FPS (~70ms interval) to keep CPU low and UI responsive
    const MIN_FRAME_INTERVAL_MS = 66;

    const startDetectionLoop = () => {
      const detectFrame = (timestamp) => {
        if (isCancelled) return;

        const timeSinceLastDetection = timestamp - lastDetectionTime;

        if (timeSinceLastDetection >= MIN_FRAME_INTERVAL_MS) {
          lastDetectionTime = timestamp;
          frameCount++;

          // Update FPS every 1 second
          if (timestamp - lastFpsCalcTime >= 1000) {
            setFps(Math.round((frameCount * 1000) / (timestamp - lastFpsCalcTime)));
            frameCount = 0;
            lastFpsCalcTime = timestamp;
          }

          const video = videoRef.current;
          const landmarker = landmarkerRef.current;

          if (
            video &&
            landmarker &&
            video.readyState >= 2 &&
            video.videoWidth > 0 &&
            video.videoHeight > 0
          ) {
            try {
              const result = landmarker.detectForVideo(video, timestamp);
              if (result.landmarks && result.landmarks.length > 0) {
                const points = result.landmarks[0];
                setHandLandmarks(points);
                setNormalizedVector(normalizeLandmarks(points));
                setHandDetected(true);

                // Boundary out-of-frame check
                const outOfBounds = points.some(
                  (pt) => pt.x < 0.05 || pt.x > 0.95 || pt.y < 0.05 || pt.y > 0.95
                );
                setIsOutOfFrame(outOfBounds);
              } else {
                setHandDetected(false);
                setHandLandmarks(null);
                setNormalizedVector(null);
                setIsOutOfFrame(false);
              }
            } catch (frameErr) {
              console.debug("detectForVideo frame dropped:", frameErr);
            }
          }
        }

        animId = requestAnimationFrame(detectFrame);
      };

      animId = requestAnimationFrame(detectFrame);
    };

    const video = videoRef.current;
    if (video) {
      if (video.videoWidth > 0 && video.videoHeight > 0) {
        startDetectionLoop();
      } else {
        const handleLoadedMetadata = () => {
          if (!isCancelled && video.videoWidth > 0 && video.videoHeight > 0) {
            startDetectionLoop();
          }
        };
        video.addEventListener("loadedmetadata", handleLoadedMetadata, { once: true });
        return () => {
          isCancelled = true;
          video.removeEventListener("loadedmetadata", handleLoadedMetadata);
          if (animId) cancelAnimationFrame(animId);
        };
      }
    }

    return () => {
      isCancelled = true;
      if (animId) cancelAnimationFrame(animId);
    };
  }, [enabled, isReady, videoRef]);

  return {
    isReady,
    isMediaPipeAvailable,
    handDetected,
    handLandmarks,
    normalizedVector,
    isOutOfFrame,
    fps,
  };
}
