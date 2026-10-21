import { Image as ImageIcon } from "lucide-react";
import { useState } from "react";

/**
 * Renders reference sign visuals (SVG, Image, GIF, Video) with lazy loading,
 * zero layout shift (aspect ratio maintained), and graceful fallback to text steps + icon.
 *
 * @param {Object} props
 * @param {string} [props.src]
 * @param {string} [props.alt]
 * @param {'svg' | 'image' | 'video'} [props.mediaType]
 * @param {string} [props.fallbackLabel]
 * @param {string[]} [props.steps]
 * @param {string} [props.className]
 * @param {boolean} [props.showSteps]
 */
export default function SignVisual({
  src,
  alt = "ASL Sign Visual",
  mediaType = "svg",
  fallbackLabel = "Sign",
  steps = [],
  className = "h-full w-full",
  showSteps = false,
}) {
  const [hasError, setHasError] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);

  // If no source is available or loading failed, render clear "Visual coming soon" placeholder and log it
  if (!src || hasError) {
    if (typeof window !== "undefined") {
      console.warn(`[SignVisual] Visual asset not found or failed for "${fallbackLabel}" (src: "${src}"). Displaying "Visual coming soon" placeholder.`);
    }

    return (
      <div
        className={`relative flex aspect-[4/3] flex-col items-center justify-center overflow-hidden rounded-xl border border-dashed border-amber-500/30 bg-slate-900/95 p-4 text-center ${className}`}
        role="img"
        aria-label={alt || `${fallbackLabel} reference sign`}
      >
        <span className="rounded-full bg-amber-500/15 px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider text-amber-400">
          Visual Coming Soon
        </span>
        <h4 className="mt-2 font-display text-sm font-bold text-ink">{fallbackLabel}</h4>
        <p className="mt-1 line-clamp-2 text-[11px] text-ink-muted">
          {steps[0] || "Step instructions available below."}
        </p>

        {showSteps && steps.length > 0 && (
          <div className="mt-2.5 w-full space-y-1 text-left border-t border-ink/10 pt-2">
            {steps.slice(0, 3).map((step, i) => (
              <div key={i} className="flex items-start gap-1.5 text-[10px] text-ink-muted">
                <span className="flex h-3.5 w-3.5 shrink-0 items-center justify-center rounded-full bg-signal/20 text-[9px] font-bold text-signal">
                  {i + 1}
                </span>
                <span className="line-clamp-1">{step}</span>
              </div>
            ))}
          </div>
        )}
      </div>
    );
  }

  return (
    <div className={`relative aspect-[4/3] w-full overflow-hidden rounded-xl bg-slate-950 ${className}`}>
      {/* Zero layout shift shimmer placeholder while loading */}
      {!isLoaded && (
        <div className="absolute inset-0 flex items-center justify-center bg-slate-900/60 animate-pulse">
          <ImageIcon className="text-slate-600" size={28} />
        </div>
      )}

      {mediaType === "video" ? (
        <video
          src={src}
          autoPlay
          loop
          muted
          playsInline
          className={`h-full w-full object-contain transition-opacity duration-300 ${
            isLoaded ? "opacity-100" : "opacity-0"
          }`}
          onLoadedData={() => setIsLoaded(true)}
          onError={() => setHasError(true)}
          aria-label={alt}
        />
      ) : (
        <img
          src={src}
          alt={alt}
          loading="lazy"
          decoding="async"
          className={`h-full w-full object-contain p-2 transition-all duration-300 ${
            isLoaded ? "opacity-100 scale-100" : "opacity-0 scale-95"
          }`}
          onLoad={() => setIsLoaded(true)}
          onError={() => setHasError(true)}
        />
      )}

      {/* Subtle bottom label badge */}
      {isLoaded && fallbackLabel && (
        <div className="pointer-events-none absolute bottom-2 left-2 right-2 flex items-center justify-between rounded-lg bg-slate-900/80 px-2.5 py-1 backdrop-blur-md">
          <span className="font-mono text-[11px] font-semibold text-signal uppercase tracking-wider">
            {fallbackLabel}
          </span>
          <span className="text-[10px] text-slate-400">Reference Visual</span>
        </div>
      )}
    </div>
  );
}
