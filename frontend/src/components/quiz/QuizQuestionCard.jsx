import { motion } from "framer-motion";
import { CheckCircle2, XCircle } from "lucide-react";
import GestureAnimation from "../lessons/GestureAnimation";

/**
 * QuizQuestionCard Component
 * Handles 5 distinct question types:
 * a) sign_to_word: Displays MotionGuide animation, 4 text options
 * b) word_to_sign: Displays word title, 4 MotionGuide animation choices
 * c) true_false: True/False on anatomical location/handshape
 * d) order_steps: Order the steps for motion signs
 * e) build_sentence: Assemble tokens in grammatical order
 */
export default function QuizQuestionCard({
  question,
  selectedAnswer,
  onSelectAnswer,
  isChecked,
  isCorrect,
}) {
  return (
    <div className="glass-card flex flex-col p-6 transition-all duration-300">
      {/* Question Header & Type Badge */}
      <div className="mb-4 flex items-center justify-between">
        <span className="badge text-[11px] font-semibold uppercase tracking-wider text-signal">
          {question.type === "sign_to_word" && "Visual Sign Recognition"}
          {question.type === "word_to_sign" && "Motion Guide Selection"}
          {question.type === "true_false" && "True or False"}
          {question.type === "order_steps" && "Step Sequencing"}
          {question.type === "build_sentence" && "Sentence Building"}
        </span>
        <span className="text-xs font-mono text-ink-faint">
          +10 XP
        </span>
      </div>

      {/* Question Prompt */}
      <h3 className="font-display text-lg font-bold text-ink sm:text-xl leading-snug">
        {question.prompt}
      </h3>

      {/* TYPE A: Sign to Word - Visual animation stage */}
      {question.type === "sign_to_word" && question.animationSpec && (
        <div className="my-5 mx-auto w-full max-w-sm overflow-hidden rounded-2xl bg-void/60 shadow-inner">
          <GestureAnimation
            spec={question.animationSpec}
            label="Target Sign"
            motionTag={question.motionTag}
            compact={true}
            className="h-56 w-full border-0"
          />
        </div>
      )}

      {/* TYPE C: True/False with reference animation */}
      {question.type === "true_false" && question.animationSpec && (
        <div className="my-4 mx-auto w-full max-w-xs overflow-hidden rounded-xl bg-void/50">
          <GestureAnimation
            spec={question.animationSpec}
            label={question.lessonLabel}
            motionTag={question.motionTag}
            compact={true}
            className="h-44 w-full border-0"
          />
        </div>
      )}

      {/* TYPE B: Word to Sign (Pick the correct animation among 4) */}
      {question.type === "word_to_sign" && question.optionLessons ? (
        <div className="mt-5 grid grid-cols-1 gap-3.5 sm:grid-cols-2">
          {question.optionLessons.map((optLesson, optIdx) => {
            const isSelected = selectedAnswer === optLesson.label;
            const isTargetCorrect = optLesson.label === question.correctAnswer;

            let btnStyle = "border-ink/10 bg-ink/5 hover:border-signal/30 hover:bg-ink/10 text-ink-muted";
            if (isChecked) {
              if (isTargetCorrect) {
                btnStyle = "border-emerald-500 bg-emerald-500/20 text-emerald-300 ring-2 ring-emerald-500/40";
              } else if (isSelected && !isTargetCorrect) {
                btnStyle = "border-rose-500 bg-rose-500/20 text-rose-300 ring-2 ring-rose-500/40";
              }
            } else if (isSelected) {
              btnStyle = "border-signal bg-signal/15 text-signal ring-2 ring-signal/40 shadow-lg";
            }

            return (
              <button
                key={optLesson.id || optIdx}
                type="button"
                disabled={isChecked}
                onClick={() => onSelectAnswer(optLesson.label)}
                className={`flex flex-col items-center rounded-2xl border p-3 transition-all ${btnStyle}`}
              >
                <div className="h-40 w-full overflow-hidden rounded-xl bg-void/50 pointer-events-none">
                  <GestureAnimation
                    spec={optLesson.spec}
                    label={isChecked ? optLesson.label : `Option ${optIdx + 1}`}
                    motionTag={optLesson.motionTag}
                    compact={true}
                    className="h-full w-full border-0"
                  />
                </div>
                <div className="mt-2.5 flex w-full items-center justify-between text-xs font-semibold">
                  <span className="flex h-5 w-5 items-center justify-center rounded-md bg-ink/10 font-mono text-[11px]">
                    {optIdx + 1}
                  </span>
                  <span>{isChecked ? optLesson.label : `Animation ${optIdx + 1}`}</span>
                  {isChecked && isTargetCorrect && <CheckCircle2 size={16} className="text-emerald-400" />}
                  {isChecked && isSelected && !isTargetCorrect && <XCircle size={16} className="text-rose-400" />}
                </div>
              </button>
            );
          })}
        </div>
      ) : (
        /* STANDARD 4-OPTION GRID (For sign_to_word, true_false, order_steps, build_sentence) */
        <div className={`mt-5 grid gap-3 ${question.options.length === 2 ? "grid-cols-2" : "grid-cols-1 sm:grid-cols-2"}`}>
          {question.options.map((option, idx) => {
            const isSelected = selectedAnswer === option;
            const isTargetCorrect = option === question.correctAnswer;

            let btnStyle = "border-ink/10 bg-ink/5 hover:border-signal/30 hover:bg-ink/10 text-ink";
            if (isChecked) {
              if (isTargetCorrect) {
                btnStyle = "border-emerald-500 bg-emerald-500/20 text-emerald-300 font-bold ring-2 ring-emerald-500/40";
              } else if (isSelected && !isTargetCorrect) {
                btnStyle = "border-rose-500 bg-rose-500/20 text-rose-300 ring-2 ring-rose-500/40";
              }
            } else if (isSelected) {
              btnStyle = "border-signal bg-signal/15 text-signal font-semibold ring-2 ring-signal/40 shadow-md";
            }

            return (
              <button
                key={option}
                type="button"
                disabled={isChecked}
                onClick={() => onSelectAnswer(option)}
                className={`flex items-center justify-between rounded-xl border p-4 text-left transition-all ${btnStyle}`}
              >
                <div className="flex items-center gap-3">
                  <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-md bg-ink/10 text-xs font-mono font-bold text-ink-muted">
                    {idx + 1}
                  </span>
                  <span className="text-sm font-medium leading-snug">{option}</span>
                </div>
                {isChecked && isTargetCorrect && <CheckCircle2 size={18} className="shrink-0 text-emerald-400" />}
                {isChecked && isSelected && !isTargetCorrect && <XCircle size={18} className="shrink-0 text-rose-400" />}
              </button>
            );
          })}
        </div>
      )}

      {/* FEEDBACK BANNER ONCE CHECKED */}
      {isChecked && (
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          className={`mt-6 rounded-2xl border p-4 ${
            isCorrect
              ? "border-emerald-500/30 bg-emerald-500/10 text-emerald-200"
              : "border-rose-500/30 bg-rose-500/10 text-rose-200"
          }`}
        >
          <div className="flex items-start gap-3">
            <span className={`mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full ${
              isCorrect ? "bg-emerald-500 text-void" : "bg-rose-500 text-void"
            }`}>
              {isCorrect ? <CheckCircle2 size={16} /> : <XCircle size={16} />}
            </span>
            <div className="space-y-1">
              <p className="font-display text-sm font-bold">
                {isCorrect ? "Correct! Excellent sign recognition." : "Incorrect"}
              </p>
              <p className="text-xs text-ink-muted leading-relaxed whitespace-pre-line">
                {question.explanation}
              </p>
            </div>
          </div>
        </motion.div>
      )}
    </div>
  );
}
