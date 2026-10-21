// frontend/src/hooks/useWebcam.js
/**
 * Shared single implementation for all camera usages across SignVerse:
 * Live Translation, PracticeModal, PracticeSession, and Quiz.
 */
export { useCamera, useCamera as useWebcam, mapCameraError } from "./useCamera.js";
