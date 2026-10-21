// frontend/src/hooks/useCamera.js
import { useCallback, useEffect, useRef, useState } from "react";

import { mapCameraError } from "../utils/cameraErrors.js";

export { mapCameraError };

/**
 * Production-ready, unified useCamera hook.
 * Manages getUserMedia lifecycle, permissions queries, stream attachment,
 * track cleanup on unmount/route change, device unplugging, visibility change,
 * and dark/covered frame detection.
 */
export function useCamera({ autoStart = false } = {}) {
  const videoRef = useRef(null);
  const streamRef = useRef(null);
  const isMountedRef = useRef(true);
  const darkCheckIntervalRef = useRef(null);
  const offscreenCanvasRef = useRef(null);

  const [status, setStatus] = useState("idle"); // idle | requesting | active | denied | error
  const [errorMessage, setErrorMessage] = useState(null);
  const [errorDetails, setErrorDetails] = useState(null);
  const [permissionState, setPermissionState] = useState("prompt"); // granted | prompt | denied | unknown
  const [devices, setDevices] = useState([]);
  const [isVideoMetadataLoaded, setIsVideoMetadataLoaded] = useState(false);
  const [isDarkOrCovered, setIsDarkOrCovered] = useState(false);

  /**
   * Monitor browser permissions query for camera if supported.
   */
  useEffect(() => {
    let permissionStatusObj = null;

    if (typeof navigator !== "undefined" && navigator.permissions?.query) {
      navigator.permissions
        .query({ name: "camera" })
        .then((pStatus) => {
          if (!isMountedRef.current) return;
          permissionStatusObj = pStatus;
          setPermissionState(pStatus.state);

          pStatus.onchange = () => {
            if (!isMountedRef.current) return;
            setPermissionState(pStatus.state);
            // If user changes permission to granted while we were denied, auto-clear error
            if (pStatus.state === "granted" && status === "denied") {
              setErrorMessage(null);
              setErrorDetails(null);
            }
          };
        })
        .catch(() => {
          // Some browsers (like Firefox or older WebKit) throw on { name: 'camera' }
          setPermissionState("unknown");
        });
    }

    return () => {
      if (permissionStatusObj) {
        permissionStatusObj.onchange = null;
      }
    };
  }, [status]);

  /**
   * Stop all active media tracks cleanly and reset video element.
   */
  const stop = useCallback(() => {
    if (darkCheckIntervalRef.current) {
      clearInterval(darkCheckIntervalRef.current);
      darkCheckIntervalRef.current = null;
    }

    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => {
        try {
          track.onended = null;
          track.stop();
        } catch (e) {
          console.debug("Failed to stop track:", e);
        }
      });
      streamRef.current = null;
    }

    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }

    setIsVideoMetadataLoaded(false);
    setIsDarkOrCovered(false);
    setStatus("idle");
    setErrorMessage(null);
    setErrorDetails(null);
  }, []);

  /**
   * Sample video frame to detect if the camera is dark or covered.
   */
  const startDarkFeedDetection = useCallback(() => {
    if (darkCheckIntervalRef.current) {
      clearInterval(darkCheckIntervalRef.current);
    }

    let darkFrameCount = 0;

    darkCheckIntervalRef.current = setInterval(() => {
      const video = videoRef.current;
      if (!video || video.readyState < 2 || video.videoWidth === 0) return;

      try {
        if (!offscreenCanvasRef.current) {
          offscreenCanvasRef.current = document.createElement("canvas");
          offscreenCanvasRef.current.width = 32;
          offscreenCanvasRef.current.height = 32;
        }

        const canvas = offscreenCanvasRef.current;
        const ctx = canvas.getContext("2d", { willReadFrequently: true });
        if (!ctx) return;

        ctx.drawImage(video, 0, 0, 32, 32);
        const imgData = ctx.getImageData(0, 0, 32, 32);
        const data = imgData.data;

        let totalLuminance = 0;
        const totalPixels = data.length / 4;

        for (let i = 0; i < data.length; i += 4) {
          // Standard ITU-R BT.601 perceived luminance
          const luma = 0.299 * data[i] + 0.587 * data[i + 1] + 0.114 * data[i + 2];
          totalLuminance += luma;
        }

        const avgLuma = totalLuminance / totalPixels;

        // If average luminance is extremely dark (< 10 out of 255)
        if (avgLuma < 10) {
          darkFrameCount++;
          if (darkFrameCount >= 3) {
            setIsDarkOrCovered(true);
          }
        } else {
          darkFrameCount = 0;
          setIsDarkOrCovered(false);
        }
      } catch (err) {
        console.debug("Dark feed detection frame read error:", err);
      }
    }, 1500);
  }, []);

  /**
   * Attach media stream to video element safely.
   */
  const attachStreamToVideo = useCallback(
    (stream) => {
      const video = videoRef.current;
      if (!video || !stream) return;

      try {
        video.muted = true;
        video.playsInline = true;
        video.autoplay = true;

        video.onloadedmetadata = () => {
          if (!isMountedRef.current) return;
          if (video.videoWidth > 0 && video.videoHeight > 0) {
            setIsVideoMetadataLoaded(true);
            startDarkFeedDetection();
          }
          try {
            const playPromise = video.play();
            if (playPromise && typeof playPromise.catch === "function") {
              playPromise.catch((err) => {
                console.debug("Video play error in onloadedmetadata:", err);
              });
            }
          } catch (e) {
            console.debug("Video play sync error:", e);
          }
        };

        if (video.srcObject !== stream) {
          video.srcObject = stream;
        }

        try {
          const playPromise = video.play();
          if (playPromise && typeof playPromise.catch === "function") {
            playPromise.catch((err) => {
              console.debug("Video play interrupted/prevented:", err);
            });
          }
        } catch (err) {
          console.debug("Video play exception caught:", err);
        }

        if (video.videoWidth > 0 && video.videoHeight > 0) {
          setIsVideoMetadataLoaded(true);
          startDarkFeedDetection();
        }
      } catch (e) {
        console.debug("Error assigning srcObject:", e);
      }
    },
    [startDarkFeedDetection]
  );

  /**
   * Enumerate connected video inputs.
   */
  const enumerateVideoDevices = useCallback(async () => {
    try {
      if (typeof navigator !== "undefined" && navigator.mediaDevices?.enumerateDevices) {
        const allDevices = await navigator.mediaDevices.enumerateDevices();
        const videoInputs = allDevices.filter((d) => d.kind === "videoinput");
        setDevices(videoInputs);
        return videoInputs;
      }
    } catch (e) {
      console.debug("Device enumeration error:", e);
    }
    return [];
  }, []);

  /**
   * Start camera with user-gesture explicit invocation, progressive constraints,
   * error mapping, and onended device disconnect listeners.
   */
  const start = useCallback(async () => {
    // 1. Clean up any existing stream before starting/retrying
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((t) => {
        try {
          t.onended = null;
          t.stop();
        } catch (_err) {
          // Track already stopped or released
        }
      });
      streamRef.current = null;
    }

    // 2. Validate browser support and secure origin (HTTPS/localhost)
    if (typeof window !== "undefined" && window.isSecureContext === false) {
      setStatus("error");
      setErrorMessage("Camera access requires a secure HTTPS connection.");
      setErrorDetails({
        title: "Secure HTTPS Connection Required",
        message: "Webcam access is restricted by modern web browsers to secure origins.",
        fix: "Please access SignVerse over HTTPS (https://) or via http://localhost during local testing.",
      });
      return;
    }

    if (typeof navigator === "undefined" || !navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
      setStatus("error");
      setErrorMessage("Camera API is not supported in this browser");
      setErrorDetails({
        title: "Browser unsupported",
        message: "Your browser does not support WebRTC camera access.",
        fix: "Please use a modern browser such as Google Chrome, Microsoft Edge, or Mozilla Firefox.",
      });
      return;
    }

    setStatus("requesting");
    setErrorMessage(null);
    setErrorDetails(null);
    setIsVideoMetadataLoaded(false);
    setIsDarkOrCovered(false);

    let stream = null;

    // 3. Attempt ideal constraints with fallback to relaxed video: true
    try {
      stream = await navigator.mediaDevices.getUserMedia({
        video: {
          width: { ideal: 640 },
          height: { ideal: 480 },
          facingMode: "user",
        },
        audio: false,
      });
    } catch (primaryErr) {
      console.warn("Primary camera constraints rejected, retrying with video: true", primaryErr);
      try {
        stream = await navigator.mediaDevices.getUserMedia({
          video: true,
          audio: false,
        });
      } catch (secondaryErr) {
        if (!isMountedRef.current) return;

        const effectiveErr = secondaryErr || primaryErr;
        const mapped = mapCameraError(effectiveErr);
        setStatus(mapped.status);
        setErrorMessage(mapped.message);
        setErrorDetails(mapped);
        return;
      }
    }

    if (!isMountedRef.current) {
      stream.getTracks().forEach((t) => t.stop());
      return;
    }

    // 4. Attach track onended listener for hardware disconnects
    stream.getVideoTracks().forEach((track) => {
      track.onended = () => {
        if (!isMountedRef.current) return;
        setStatus("error");
        setErrorMessage("Camera was disconnected or turned off");
        setErrorDetails({
          title: "Camera disconnected",
          message: "The video stream ended unexpectedly.",
          fix: "Check your camera connection and click 'Retry Camera Access'.",
        });
        stop();
      };
    });

    streamRef.current = stream;
    attachStreamToVideo(stream);
    setStatus("active");
    enumerateVideoDevices();
  }, [attachStreamToVideo, enumerateVideoDevices, stop]);

  // Page visibility change handler
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.visibilityState === "visible" && status === "active" && streamRef.current) {
        // Confirm stream tracks are still active
        const hasLiveTrack = streamRef.current.getVideoTracks().some((t) => t.readyState === "live");
        if (!hasLiveTrack) {
          start();
        }
      }
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);
    return () => {
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, [status, start]);

  // Sync video element if it re-renders or mounts after stream activation
  useEffect(() => {
    if (status === "active" && streamRef.current && videoRef.current) {
      attachStreamToVideo(streamRef.current);
    }
  }, [status, attachStreamToVideo]);

  // Optional auto-start on mount
  useEffect(() => {
    if (autoStart) {
      start();
    }
  }, [autoStart, start]);

  // Lifecycle unmount cleanup
  useEffect(() => {
    isMountedRef.current = true;
    return () => {
      isMountedRef.current = false;
      stop();
    };
  }, [stop]);

  return {
    videoRef,
    status,
    errorMessage,
    errorDetails,
    permissionState,
    isDarkOrCovered,
    devices,
    isVideoMetadataLoaded,
    start,
    stop,
    isActive: status === "active",
    stream: streamRef.current,
  };
}
