import { Hand } from "lucide-react";
import { Link } from "react-router-dom";

const FOOTER_SECTIONS = [
  {
    title: "Learn",
    links: [
      { label: "Alphabet", to: "/learn/alphabet" },
      { label: "Numbers", to: "/learn/numbers" },
      { label: "Common Words", to: "/learn/common-words" },
      { label: "Daily Practice", to: "/daily-practice" },
    ],
  },
  {
    title: "Translate",
    links: [
      { label: "Live Camera Translation", to: "/live-translation" },
      { label: "Sign to Text", to: "/sign-to-text" },
      { label: "Text to Speech", to: "/text-to-speech" },
      { label: "Quiz", to: "/quiz" },
    ],
  },
  {
    title: "Company",
    links: [
      { label: "About", to: "/about" },
      { label: "Model Evaluation", to: "/model-report" },
      { label: "Contact", to: "/contact" },
      { label: "FAQ", to: "/faq" },
    ],
  },
];

export default function Footer() {
  return (
    <footer className="border-t border-ink/[0.06] bg-surface/40">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 gap-8 md:grid-cols-5">
          <div className="col-span-2">
            <Link to="/" className="flex items-center gap-2 font-display text-lg font-bold">
              <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-signal-gradient text-void">
                <Hand size={20} strokeWidth={2.5} />
              </span>
              SignVerse
            </Link>
            <p className="mt-3 max-w-xs text-sm text-ink-muted">
              Learn sign language and translate it live with AI — right in your browser, at your own pace.
            </p>
          </div>

          {FOOTER_SECTIONS.map((section) => (
            <div key={section.title}>
              <h4 className="font-display text-sm font-semibold text-ink">{section.title}</h4>
              <ul className="mt-3 space-y-2">
                {section.links.map((link) => (
                  <li key={link.to}>
                    <Link to={link.to} className="text-sm text-ink-muted transition-colors hover:text-signal">
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-10 flex flex-col items-center justify-between gap-4 border-t border-ink/[0.06] pt-6 sm:flex-row">
          <p className="text-xs text-ink-faint">© {new Date().getFullYear()} SignVerse. All rights reserved.</p>
          <p className="text-xs text-ink-faint">Built to make sign language learning accessible to everyone.</p>
        </div>
      </div>
    </footer>
  );
}
