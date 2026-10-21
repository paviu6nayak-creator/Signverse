import { motion } from "framer-motion";
import { AlertTriangle, Home, RefreshCw } from "lucide-react";
import { Link } from "react-router-dom";

export default function ServerError({ onRetry, onReload, error }) {
  const handleReload = () => {
    if (onReload) {
      onReload();
    } else {
      window.location.reload();
    }
  };

  const handleRetry = () => {
    if (onRetry) {
      onRetry();
    } else {
      window.location.reload();
    }
  };

  return (
    <div className="mx-auto flex min-h-[75vh] max-w-lg flex-col items-center justify-center px-4 text-center">
      <motion.span
        initial={{ opacity: 0, y: -8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="flex h-16 w-16 items-center justify-center rounded-2xl bg-danger/10 text-danger"
      >
        <AlertTriangle size={28} />
      </motion.span>
      <span className="badge mt-4">500</span>
      <h1 className="mt-4 font-display text-3xl font-bold text-ink">Something went wrong</h1>
      <p className="mt-2 text-ink-muted">
        Our side, not yours. Try reloading the page or return home. If this persists, let us know through the contact page.
      </p>

      {error?.message && (
        <div className="mt-4 max-h-32 w-full overflow-auto rounded-xl border border-danger/20 bg-danger/5 p-3 text-left font-mono text-xs text-danger">
          <p className="font-bold">Error:</p>
          <p className="break-words">{error.message}</p>
        </div>
      )}

      <div className="mt-8 flex flex-wrap justify-center gap-3">
        <button onClick={handleReload} className="btn-primary" id="error-reload-btn">
          <RefreshCw size={18} />
          Reload
        </button>
        {onRetry && (
          <button onClick={handleRetry} className="btn-secondary" id="error-retry-btn">
            Try again
          </button>
        )}
        <Link to="/" className="btn-secondary">
          <Home size={18} />
          Back to home
        </Link>
      </div>
    </div>
  );
}
