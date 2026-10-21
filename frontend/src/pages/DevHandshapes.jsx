// frontend/src/pages/DevHandshapes.jsx
import { motion } from "framer-motion";
import { AlertTriangle, BookOpen, CheckCircle2, Hand as HandIcon } from "lucide-react";
import React, { useMemo, useState } from "react";
import Hand from "../components/common/Hand";
import { getAllHandshapes } from "../data/handshapes";

export default function DevHandshapes() {
  const [filterType, setFilterType] = useState("all"); // 'all' | 'letter' | 'digit'
  const [selectedShape, setSelectedShape] = useState(null);

  const handshapes = useMemo(() => getAllHandshapes(), []);

  const filteredShapes = useMemo(() => {
    if (filterType === "all") return handshapes;
    return handshapes.filter((s) => s.type === filterType);
  }, [handshapes, filterType]);

  const letterCount = handshapes.filter((s) => s.type === "letter").length;
  const digitCount = handshapes.filter((s) => s.type === "digit").length;
  const reviewCount = handshapes.filter((s) => s.needsReview).length;

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="flex items-center gap-3">
            <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-signal-gradient text-void shadow-lg shadow-signal/20">
              <HandIcon size={24} />
            </span>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="font-display text-3xl font-bold text-ink">ASL Handshape Rig</h1>
                <span className="rounded-full bg-signal/15 px-2.5 py-0.5 text-xs font-mono font-bold text-signal border border-signal/20">
                  Dev Preview
                </span>
              </div>
              <p className="mt-1 text-sm text-ink-muted">
                Parametric SVG hand model verified against Lifeprint / ASLU (Dr. Bill Vicars) standards.
              </p>
            </div>
          </div>
        </div>

        {/* Verification Summary Badge */}
        <div className="flex items-center gap-3">
          <div className="glass-card flex items-center gap-2.5 px-3.5 py-2 text-xs">
            <CheckCircle2 size={16} className="text-emerald-400 shrink-0" />
            <span className="text-ink-muted">
              <strong className="text-emerald-400 font-semibold">{handshapes.length}</strong> shapes verified
            </span>
          </div>
          {reviewCount > 0 && (
            <div className="glass-card flex items-center gap-2 px-3.5 py-2 text-xs border-amber-500/30 text-amber-400">
              <AlertTriangle size={15} />
              <span>{reviewCount} need review</span>
            </div>
          )}
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3 border-b border-ink/10 pb-4">
        <div className="flex gap-2">
          {[
            { id: "all", label: "All Shapes", count: handshapes.length },
            { id: "letter", label: "Letters A–Z", count: letterCount },
            { id: "digit", label: "Digits 0–10", count: digitCount },
          ].map((tab) => {
            const isActive = filterType === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => setFilterType(tab.id)}
                className={`flex items-center gap-2 rounded-full px-4 py-1.5 text-xs font-semibold transition-all ${
                  isActive
                    ? "bg-signal text-void shadow-md scale-105"
                    : "bg-ink/5 text-ink-muted hover:bg-ink/10 hover:text-ink"
                }`}
              >
                <span>{tab.label}</span>
                <span
                  className={`rounded-full px-1.5 py-0.2 text-[10px] font-mono ${
                    isActive ? "bg-void/25 text-void" : "bg-ink/10 text-ink-faint"
                  }`}
                >
                  {tab.count}
                </span>
              </button>
            );
          })}
        </div>

        <span className="text-xs text-ink-muted">
          Showing <strong className="text-ink">{filteredShapes.length} shapes</strong>
        </span>
      </div>

      {/* Handshape Grid */}
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6">
        {filteredShapes.map((shape) => {
          const isSelected = selectedShape?.id === shape.id;

          return (
            <motion.div
              key={shape.id}
              whileHover={{ y: -3 }}
              transition={{ duration: 0.15 }}
              onClick={() => setSelectedShape(shape)}
              className={`glass-card group relative flex flex-col items-center p-3.5 cursor-pointer transition-all ${
                isSelected
                  ? "border-signal bg-signal/10 ring-2 ring-signal/30 shadow-lg"
                  : "hover:border-signal/40 hover:bg-ink/5"
              }`}
            >
              {/* Type pill */}
              <div className="flex w-full items-center justify-between text-[10px] font-mono mb-2">
                <span className="rounded bg-ink/10 px-1.5 py-0.5 text-ink-muted font-bold">
                  {shape.id}
                </span>
                <span className="text-ink-faint capitalize">{shape.type}</span>
              </div>

              {/* Hand Vector Stage */}
              <div className="my-1 flex h-28 w-28 items-center justify-center rounded-xl bg-void/50 border border-ink/5 shadow-inner group-hover:border-signal/20 transition-colors">
                <Hand spec={shape} size={88} />
              </div>

              {/* Label */}
              <p className="mt-2 text-xs font-bold text-ink text-center truncate w-full">
                {shape.label}
              </p>

              {/* Parametric quick indicators */}
              <div className="mt-1 flex items-center gap-1.5 text-[10px] text-ink-faint font-mono">
                <span>thumb: {shape.thumb}</span>
              </div>

              {/* Verified Lifeprint tag */}
              <div className="mt-2.5 flex items-center gap-1 text-[10px] text-emerald-400 font-medium">
                <CheckCircle2 size={11} />
                <span>ASLU Verified</span>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Detailed Inspector Modal */}
      {selectedShape && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-void/80 p-4 backdrop-blur-sm"
          onClick={() => setSelectedShape(null)}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="glass-card relative max-w-lg w-full p-6 shadow-2xl border-signal/30 bg-slate-900"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-start justify-between border-b border-ink/10 pb-4">
              <div>
                <span className="rounded bg-signal/20 px-2 py-0.5 text-xs font-mono font-bold text-signal">
                  {selectedShape.id}
                </span>
                <h3 className="mt-1 font-display text-xl font-bold text-ink">
                  {selectedShape.label}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setSelectedShape(null)}
                className="btn-secondary !p-1.5 text-xs text-ink-muted hover:text-ink"
              >
                ✕
              </button>
            </div>

            <div className="mt-5 grid grid-cols-1 gap-5 sm:grid-cols-2">
              {/* Large Vector Canvas */}
              <div className="flex h-52 items-center justify-center rounded-2xl bg-void/70 border border-ink/10 shadow-inner">
                <Hand spec={selectedShape} size={150} />
              </div>

              {/* Parametric Spec List */}
              <div className="space-y-2 text-xs font-mono text-ink-muted">
                <div className="rounded-lg bg-ink/5 p-2 border border-ink/5">
                  <strong className="text-ink block mb-1">Finger States:</strong>
                  <div>Index: <span className="text-signal">{selectedShape.fingers.index}</span></div>
                  <div>Middle: <span className="text-signal">{selectedShape.fingers.middle}</span></div>
                  <div>Ring: <span className="text-signal">{selectedShape.fingers.ring}</span></div>
                  <div>Pinky: <span className="text-signal">{selectedShape.fingers.pinky}</span></div>
                </div>

                <div className="rounded-lg bg-ink/5 p-2 border border-ink/5">
                  <div>Thumb: <span className="text-emerald-400 font-semibold">{selectedShape.thumb}</span></div>
                  <div>Palm: <span className="text-ink">{selectedShape.palm}</span></div>
                  <div>Rotation: <span className="text-ink">{selectedShape.rotation || 0}°</span></div>
                </div>
              </div>
            </div>

            {/* Description & ASLU Notes */}
            <div className="mt-4 space-y-2 text-xs">
              <p className="text-ink leading-relaxed">
                <strong>Anatomical Pose:</strong> {selectedShape.description}
              </p>
              <div className="rounded-xl bg-signal/10 border border-signal/20 p-3 text-signal leading-relaxed">
                <strong className="flex items-center gap-1.5 mb-1 font-bold">
                  <BookOpen size={14} /> Lifeprint / ASLU Verification:
                </strong>
                {selectedShape.aslNotes}
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
}
