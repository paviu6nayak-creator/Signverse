import { motion } from "framer-motion";
import { Home, SearchX } from "lucide-react";
import { Link } from "react-router-dom";

import HandSkeleton from "../components/common/HandSkeleton";

export default function NotFound() {
  return (
    <div className="mx-auto flex min-h-[75vh] max-w-lg flex-col items-center justify-center px-4 text-center">
      <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.5 }} className="h-40 w-40">
        <HandSkeleton className="h-full w-full opacity-60" />
      </motion.div>
      <span className="badge mt-4">
        <SearchX size={14} className="text-signal" />
        404
      </span>
      <h1 className="mt-4 font-display text-3xl font-bold text-ink">This sign doesn't exist</h1>
      <p className="mt-2 text-ink-muted">The page you're looking for might have been moved or never existed.</p>
      <Link to="/" className="btn-primary mt-8">
        <Home size={18} />
        Back to home
      </Link>
    </div>
  );
}
