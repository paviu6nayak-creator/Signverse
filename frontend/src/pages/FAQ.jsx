import { AnimatePresence, motion } from "framer-motion";
import { ChevronDown, HelpCircle } from "lucide-react";
import { useState } from "react";
import { Link } from "react-router-dom";

const FAQ_ITEMS = [
  {
    question: "Do I need any special equipment?",
    answer: "Just a device with a webcam and a modern browser (Chrome, Edge, or Safari work best). No downloads or extra hardware required.",
  },
  {
    question: "Which sign language does SignVerse teach?",
    answer: "SignVerse currently focuses on American Sign Language (ASL) fundamentals — the manual alphabet, numbers, and common everyday signs.",
  },
  {
    question: "Is my webcam video sent to a server?",
    answer: "No. Hand tracking runs entirely in your browser via MediaPipe. Only the extracted landmark coordinates (not video) are sent for sign recognition.",
  },
  {
    question: "How accurate is the AI recognition?",
    answer: "Accuracy depends on lighting, camera angle, and how closely your hand matches the training data. We show a confidence score with every prediction so you know how sure the model is.",
  },
  {
    question: "Is SignVerse free to use?",
    answer: "Yes — creating an account, taking lessons, practicing with the AI, and tracking your progress are all free.",
  },
  {
    question: "Can I use SignVerse without creating an account?",
    answer: "You can browse lessons as a guest, but you'll need a free account to practice with your webcam and save your progress.",
  },
  {
    question: "How do streaks and XP work?",
    answer: "Completing a practice attempt or quiz on a given day counts toward your streak. XP is earned from completed lessons and quizzes, and contributes to your level.",
  },
  {
    question: "I found an issue with a lesson or the AI model. How do I report it?",
    answer: "Please reach out through the Contact page with as much detail as you can — it helps us improve the content and the model quickly.",
  },
];

function FAQItem({ item, isOpen, onToggle }) {
  return (
    <div className="glass-card overflow-hidden">
      <button onClick={onToggle} className="flex w-full items-center justify-between gap-4 p-5 text-left">
        <span className="font-medium text-ink">{item.question}</span>
        <ChevronDown size={18} className={`shrink-0 text-ink-muted transition-transform ${isOpen ? "rotate-180" : ""}`} />
      </button>
      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="overflow-hidden"
          >
            <p className="px-5 pb-5 text-sm text-ink-muted">{item.answer}</p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default function FAQ() {
  const [openIndex, setOpenIndex] = useState(0);

  return (
    <div className="mx-auto max-w-3xl px-4 py-16 sm:px-6 lg:px-8">
      <div className="text-center">
        <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-signal-gradient text-void mx-auto">
          <HelpCircle size={22} />
        </span>
        <h1 className="mt-4 font-display text-3xl font-bold text-ink sm:text-4xl">Frequently asked questions</h1>
        <p className="mt-2 text-ink-muted">Everything you need to know about learning and translating with SignVerse.</p>
      </div>

      <div className="mt-10 space-y-3">
        {FAQ_ITEMS.map((item, index) => (
          <FAQItem key={item.question} item={item} isOpen={openIndex === index} onToggle={() => setOpenIndex(openIndex === index ? -1 : index)} />
        ))}
      </div>

      <div className="mt-12 flex flex-col items-center gap-3 text-center">
        <p className="text-ink-muted">Still have questions?</p>
        <Link to="/contact" className="btn-secondary">
          Contact us
        </Link>
      </div>
    </div>
  );
}
