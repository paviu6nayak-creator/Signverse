/**
 * Maps browser getUserMedia error names to specific, actionable user messages.
 * Verified against W3C Media Capture and Streams specification.
 *
 * @param {Error|DOMException|{name?: string, message?: string}} err
 * @returns {{ status: 'denied' | 'error', title: string, message: string, fix: string }}
 */
export function mapCameraError(err) {
  const errName = err?.name || "";
  const errMsg = err?.message || "";

  switch (errName) {
    case "NotAllowedError":
    case "PermissionDeniedError":
      return {
        status: "denied",
        title: "Camera permission denied",
        message: "Camera access was denied by your browser or system.",
        fix: "Click the lock/camera icon in your address bar and set Camera to 'Allow'. On Windows, also verify Windows Settings > Privacy & security > Camera is toggled On.",
      };
    case "NotFoundError":
    case "DevicesNotFoundError":
      return {
        status: "error",
        title: "No camera found",
        message: "No video input device detected on this system.",
        fix: "Please plug in an external webcam or check that your device's integrated camera is enabled in Device Manager.",
      };
    case "NotReadableError":
    case "TrackStartError":
    case "AbortError":
      return {
        status: "error",
        title: "Camera is currently busy or unavailable",
        message: "The camera is in use by another application or covered/disabled at the hardware level.",
        fix: "Close other applications that might be using your camera (such as Zoom, Microsoft Teams, Discord, Skype, or another browser window) and click 'Retry Camera Access'.",
      };
    case "SecurityError":
      return {
        status: "error",
        title: "Secure connection required",
        message: "Camera access is restricted to secure origins.",
        fix: "Please access SignVerse over HTTPS (https://) or via http://localhost during local development.",
      };
    case "OverconstrainedError":
    case "ConstraintNotSatisfiedError":
      return {
        status: "error",
        title: "Unsupported camera resolution",
        message: "The camera does not satisfy requested constraints.",
        fix: "Click Retry to connect with standard default video constraints.",
      };
    default:
      return {
        status: "error",
        title: "Camera access failed",
        message: errMsg || "An unexpected error occurred while accessing the webcam.",
        fix: "Check your browser permissions, ensure no other app is using the camera, and click 'Retry Camera Access'.",
      };
  }
}
