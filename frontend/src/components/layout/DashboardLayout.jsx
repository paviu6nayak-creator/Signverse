import Sidebar from "./Sidebar";

export default function DashboardLayout({ title, subtitle, actions, children }) {
  return (
    <div className="mx-auto flex max-w-7xl gap-8 px-4 py-8 sm:px-6 lg:px-8">
      <Sidebar />
      <main className="min-w-0 flex-1">
        {(title || actions) && (
          <div className="mb-8 flex flex-wrap items-center justify-between gap-4">
            <div>
              {title && <h1 className="font-display text-2xl font-bold text-ink sm:text-3xl">{title}</h1>}
              {subtitle && <p className="mt-1 text-sm text-ink-muted">{subtitle}</p>}
            </div>
            {actions}
          </div>
        )}
        {children}
      </main>
    </div>
  );
}
