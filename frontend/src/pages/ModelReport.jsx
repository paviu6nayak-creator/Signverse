import { motion } from "framer-motion";
import {
  AlertTriangle,
  ArrowRight,
  BarChart3,
  CheckCircle2,
  Database,
  Grid,
  Info,
  Layers,
  Sparkles,
  TrendingDown,
  TrendingUp,
  Zap,
} from "lucide-react";
import { useMemo, useState } from "react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

import evaluationData from "../data/modelEvaluation.json";

export default function ModelReport() {
  const [activeTab, setActiveTab] = useState("all"); // 'all' | 'alphabet' | 'numbers' | 'words'
  const [selectedCell, setSelectedCell] = useState(null);

  const { metadata, overall, classes, per_class_metrics, confusion_matrix, top_5_confused_pairs, known_limitations } =
    evaluationData;

  // Filtered bar chart data based on active category tab
  const barChartData = useMemo(() => {
    return classes
      .filter((c) => {
        if (activeTab === "alphabet") return /^[A-Z]$/.test(c);
        if (activeTab === "numbers") return /^[0-9]+$/.test(c);
        if (activeTab === "words") return c.length > 1 && !/^[0-9]+$/.test(c);
        return true;
      })
      .map((c) => {
        const metric = per_class_metrics[c] || { accuracy: 0, precision: 0, recall: 0, f1_score: 0 };
        return {
          sign: c,
          accuracy: Math.round(metric.accuracy * 100),
          precision: Math.round(metric.precision * 100),
          recall: Math.round(metric.recall * 100),
          f1: Math.round(metric.f1_score * 100),
          support: metric.support || 50,
        };
      });
  }, [classes, per_class_metrics, activeTab]);

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      {/* Page Header */}
      <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1.5 rounded-full border border-signal/30 bg-signal/10 px-3 py-1 font-mono text-xs font-semibold text-signal uppercase tracking-wider">
              <Zap size={13} /> Evaluation Suite
            </span>
            <span className="inline-flex items-center gap-1 rounded-full border border-ink/10 bg-surface px-3 py-1 text-xs text-ink-muted">
              <Database size={13} /> Held-out Test Set ({metadata.test_sample_count} Samples)
            </span>
          </div>
          <h1 className="mt-2 font-display text-3xl font-extrabold text-ink sm:text-4xl">
            Sign Recognition Model Report
          </h1>
          <p className="mt-1 text-sm text-ink-muted max-w-2xl">
            Empirical evaluation of the MediaPipe 21-landmark 3D coordinate classifier across {metadata.evaluated_classes_count} target sign classes with synthetic physiological variance, scale noise, and camera orientation jitter.
          </p>
        </div>
      </div>

      {/* KPI Stat Cards */}
      <div className="mb-10 grid grid-cols-2 gap-4 sm:grid-cols-4">
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          className="rounded-2xl border border-signal/30 bg-gradient-to-br from-signal/[0.12] to-transparent p-5 backdrop-blur-md"
        >
          <div className="flex items-center justify-between text-signal">
            <span className="text-xs font-semibold uppercase tracking-wider">Overall Accuracy</span>
            <TrendingUp size={18} />
          </div>
          <div className="mt-2 text-3xl font-black text-ink">{overall.accuracy_percent}%</div>
          <p className="mt-1 text-xs text-ink-muted">
            {overall.total_correct} of {overall.total_samples} samples correct
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.05 }}
          className="rounded-2xl border border-ink/10 bg-surface/80 p-5 backdrop-blur-md"
        >
          <div className="flex items-center justify-between text-emerald-400">
            <span className="text-xs font-semibold uppercase tracking-wider text-ink-muted">Macro F1-Score</span>
            <CheckCircle2 size={18} />
          </div>
          <div className="mt-2 text-3xl font-black text-ink">{overall.macro_f1}</div>
          <p className="mt-1 text-xs text-ink-muted">Balanced multi-class F1 metric</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="rounded-2xl border border-ink/10 bg-surface/80 p-5 backdrop-blur-md"
        >
          <div className="flex items-center justify-between text-blue-400">
            <span className="text-xs font-semibold uppercase tracking-wider text-ink-muted">Macro Precision</span>
            <Layers size={18} />
          </div>
          <div className="mt-2 text-3xl font-black text-ink">{Math.round(overall.macro_precision * 100)}%</div>
          <p className="mt-1 text-xs text-ink-muted">Positive predictive value</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
          className="rounded-2xl border border-ink/10 bg-surface/80 p-5 backdrop-blur-md"
        >
          <div className="flex items-center justify-between text-amber-400">
            <span className="text-xs font-semibold uppercase tracking-wider text-ink-muted">Target Classes</span>
            <Sparkles size={18} />
          </div>
          <div className="mt-2 text-3xl font-black text-ink">{metadata.evaluated_classes_count}</div>
          <p className="mt-1 text-xs text-ink-muted">50 held-out samples per sign</p>
        </motion.div>
      </div>

      {/* Section 1: Per-Sign Accuracy Bar Chart */}
      <div className="mb-10 rounded-2xl border border-ink/10 bg-surface/80 p-6 backdrop-blur-md">
        <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <span className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-signal">
              <BarChart3 size={15} /> Model Performance Distribution
            </span>
            <h2 className="mt-1 font-display text-xl font-bold text-ink">
              Per-Sign Recognition Accuracy (%)
            </h2>
          </div>

          {/* Filter Tabs */}
          <div className="flex flex-wrap items-center gap-1.5 rounded-xl border border-ink/10 bg-surface-raised p-1">
            {[
              { id: "all", label: "All Signs" },
              { id: "alphabet", label: "Alphabet" },
              { id: "numbers", label: "Numbers" },
              { id: "words", label: "Words" },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`rounded-lg px-3 py-1.5 text-xs font-semibold transition-all ${
                  activeTab === tab.id
                    ? "bg-signal text-void shadow-sm"
                    : "text-ink-muted hover:text-ink hover:bg-surface"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Recharts Bar Chart */}
        <div className="h-80 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={barChartData} margin={{ top: 10, right: 10, left: -20, bottom: 25 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.06)" vertical={false} />
              <XAxis
                dataKey="sign"
                stroke="#64748b"
                tick={{ fontSize: 11, fill: "#94a3b8" }}
                interval={0}
                angle={-45}
                textAnchor="end"
              />
              <YAxis
                stroke="#64748b"
                tick={{ fontSize: 11, fill: "#94a3b8" }}
                domain={[0, 100]}
                unit="%"
              />
              <Tooltip
                content={({ active, payload }) => {
                  if (active && payload && payload.length) {
                    const data = payload[0].payload;
                    return (
                      <div className="rounded-xl border border-ink/20 bg-slate-900/95 p-3 text-xs shadow-xl backdrop-blur-md">
                        <div className="font-bold text-signal text-sm">{data.sign}</div>
                        <div className="mt-1 space-y-0.5 text-slate-300">
                          <div>Accuracy: <span className="font-mono font-bold text-white">{data.accuracy}%</span></div>
                          <div>Precision: <span className="font-mono text-white">{data.precision}%</span></div>
                          <div>Recall: <span className="font-mono text-white">{data.recall}%</span></div>
                          <div>F1-Score: <span className="font-mono text-white">{data.f1}%</span></div>
                          <div className="text-[10px] text-slate-400">Support: {data.support} test samples</div>
                        </div>
                      </div>
                    );
                  }
                  return null;
                }}
              />
              <Bar dataKey="accuracy" radius={[4, 4, 0, 0]}>
                {barChartData.map((entry, index) => {
                  let fillColor = "#10b981"; // high accuracy (>75%)
                  if (entry.accuracy < 30) fillColor = "#f43f5e"; // low accuracy (<30%)
                  else if (entry.accuracy < 75) fillColor = "#f59e0b"; // moderate (30-75%)
                  return <Cell key={`cell-${index}`} fill={fillColor} />;
                })}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Legend */}
        <div className="mt-4 flex flex-wrap items-center justify-end gap-4 text-xs text-ink-muted">
          <div className="flex items-center gap-1.5">
            <span className="h-2.5 w-2.5 rounded-full bg-emerald-500" /> High Reliability (≥ 75%)
          </div>
          <div className="flex items-center gap-1.5">
            <span className="h-2.5 w-2.5 rounded-full bg-amber-500" /> Moderate (30–74%)
          </div>
          <div className="flex items-center gap-1.5">
            <span className="h-2.5 w-2.5 rounded-full bg-rose-500" /> Low Reliability (&lt; 30%)
          </div>
        </div>
      </div>

      {/* Grid: Top 5 Confused Signs + Known Limitations */}
      <div className="mb-10 grid grid-cols-1 gap-8 lg:grid-cols-2">
        {/* Top 5 Most Confused Signs */}
        <div className="rounded-2xl border border-ink/10 bg-surface/80 p-6 backdrop-blur-md">
          <div className="flex items-center gap-2 text-rose-400">
            <TrendingDown size={18} />
            <h2 className="font-display text-lg font-bold text-ink">
              Top 5 Most Confused Sign Pairs
            </h2>
          </div>
          <p className="mt-1 text-xs text-ink-muted">
            The 5 highest frequency error pairings recorded during held-out test inference.
          </p>

          <div className="mt-5 space-y-3">
            {top_5_confused_pairs.map((pair, idx) => (
              <div
                key={idx}
                className="flex items-center justify-between rounded-xl border border-rose-500/20 bg-rose-500/[0.04] p-3.5 transition-all hover:border-rose-500/40"
              >
                <div className="flex items-center gap-3">
                  <span className="flex h-6 w-6 items-center justify-center rounded-full bg-rose-500/20 text-xs font-bold text-rose-400">
                    {idx + 1}
                  </span>
                  <div>
                    <div className="flex items-center gap-2 font-display text-sm font-bold text-ink">
                      <span className="rounded bg-surface px-2 py-0.5 font-mono text-signal">
                        {pair.actual}
                      </span>
                      <ArrowRight size={14} className="text-ink-muted" />
                      <span className="rounded bg-rose-500/20 px-2 py-0.5 font-mono text-rose-300">
                        {pair.predicted}
                      </span>
                    </div>
                    <span className="text-[11px] text-ink-muted">Actual ➔ Predicted as</span>
                  </div>
                </div>

                <div className="text-right">
                  <div className="font-mono text-sm font-bold text-rose-400">
                    {pair.count} / 50
                  </div>
                  <div className="text-[10px] font-semibold text-rose-500">
                    {pair.percentage}% confusion
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Known Limitations Section */}
        <div className="rounded-2xl border border-amber-500/20 bg-amber-500/[0.03] p-6 backdrop-blur-md">
          <div className="flex items-center gap-2 text-amber-400">
            <AlertTriangle size={18} />
            <h2 className="font-display text-lg font-bold text-ink">
              Known Model Limitations
            </h2>
          </div>
          <p className="mt-1 text-xs text-ink-muted">
            Empirically identified signs that the current single-frame 2D/3D landmark pipeline cannot reliably recognize.
          </p>

          <div className="mt-5 space-y-3.5">
            {known_limitations.map((lim, idx) => (
              <div
                key={idx}
                className="rounded-xl border border-amber-500/20 bg-surface/60 p-3.5 text-xs text-ink"
              >
                <div className="flex items-center justify-between">
                  <span className="font-display font-bold text-amber-300 text-sm">
                    {lim.sign}
                  </span>
                  <span className="rounded-full bg-rose-500/15 px-2.5 py-0.5 font-mono text-[11px] font-bold text-rose-400">
                    {lim.accuracy_percent}% accuracy
                  </span>
                </div>
                <p className="mt-1.5 leading-relaxed text-ink-muted">
                  {lim.technical_reason}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Section 2: Confusion Matrix Heatmap */}
      <div className="rounded-2xl border border-ink/10 bg-surface/80 p-6 backdrop-blur-md">
        <div className="mb-4 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <span className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-signal">
              <Grid size={15} /> Error Distribution Heatmap
            </span>
            <h2 className="mt-1 font-display text-xl font-bold text-ink">
              Multi-Class Confusion Matrix ({classes.length} × {classes.length})
            </h2>
          </div>
          <div className="text-xs text-ink-muted flex items-center gap-2">
            <Info size={14} className="text-signal" /> Rows represent Ground Truth; Columns represent Model Predictions
          </div>
        </div>

        {/* Selected Cell Preview Banner */}
        {selectedCell && (
          <div className="mb-4 flex items-center justify-between rounded-xl border border-signal/30 bg-signal/10 px-4 py-2 text-xs">
            <div>
              <span className="font-semibold text-ink-muted">Actual Sign: </span>
              <strong className="text-signal">{selectedCell.actual}</strong>
              <span className="mx-2 text-ink-muted">➔</span>
              <span className="font-semibold text-ink-muted">Predicted As: </span>
              <strong className={selectedCell.isCorrect ? "text-emerald-400" : "text-rose-400"}>
                {selectedCell.predicted}
              </strong>
            </div>
            <div className="font-mono text-ink">
              Count: <strong className="text-signal">{selectedCell.count}</strong> / 50 ({Math.round((selectedCell.count / 50) * 100)}%)
            </div>
          </div>
        )}

        {/* Interactive Matrix Grid (Horizontal Scrollable) */}
        <div className="overflow-x-auto rounded-xl border border-ink/10 bg-slate-950 p-4">
          <table className="border-collapse text-[10px]">
            <thead>
              <tr>
                <th className="sticky left-0 z-10 bg-slate-950 p-1 text-left font-mono text-[9px] text-slate-400">
                  Actual \ Pred
                </th>
                {classes.map((c) => (
                  <th
                    key={c}
                    className="w-7 max-w-7 p-1 text-center font-mono text-[9px] text-slate-400"
                    title={`Predicted: ${c}`}
                  >
                    {c.length > 3 ? c.slice(0, 3) : c}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {classes.map((actualClass, rowIdx) => (
                <tr key={actualClass} className="hover:bg-slate-900/50">
                  <td className="sticky left-0 z-10 bg-slate-950 pr-2 py-1 font-mono font-bold text-[9px] text-slate-300 whitespace-nowrap">
                    {actualClass}
                  </td>
                  {classes.map((predClass, colIdx) => {
                    const count = confusion_matrix[rowIdx][colIdx];
                    const isDiagonal = rowIdx === colIdx;
                    const maxCount = 50;
                    const intensity = count / maxCount;

                    let bg = "bg-transparent text-slate-700";
                    if (count > 0) {
                      if (isDiagonal) {
                        // Correct predictions in Emerald
                        if (intensity > 0.8) bg = "bg-emerald-500/80 text-white font-bold";
                        else if (intensity > 0.4) bg = "bg-emerald-500/40 text-emerald-200 font-semibold";
                        else bg = "bg-emerald-500/20 text-emerald-300";
                      } else {
                        // Confusion errors in Rose/Amber
                        if (intensity > 0.8) bg = "bg-rose-500/80 text-white font-bold";
                        else if (intensity > 0.4) bg = "bg-rose-500/40 text-rose-200 font-semibold";
                        else bg = "bg-rose-500/20 text-rose-300";
                      }
                    }

                    return (
                      <td
                        key={predClass}
                        onClick={() =>
                          setSelectedCell({
                            actual: actualClass,
                            predicted: predClass,
                            count,
                            isCorrect: isDiagonal,
                          })
                        }
                        onMouseEnter={() =>
                          setSelectedCell({
                            actual: actualClass,
                            predicted: predClass,
                            count,
                            isCorrect: isDiagonal,
                          })
                        }
                        className={`h-7 w-7 text-center font-mono cursor-pointer transition-colors border border-slate-900 ${bg}`}
                        title={`Actual: ${actualClass} ➔ Predicted: ${predClass} (${count}/50)`}
                      >
                        {count > 0 ? count : "·"}
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
