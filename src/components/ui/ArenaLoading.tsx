interface ArenaLoadingProps {
  title: string;
  message: string;
  label?: string;
  mode?: "panel" | "modal";
}

function ArenaLoadingContent({ title, message, label = "Arena loading" }: Omit<ArenaLoadingProps, "mode">) {
  return (
    <div role="status" aria-live="polite" className="text-center">
      <div
        aria-hidden="true"
        className="arena-loading-spinner mx-auto h-14 w-14 rounded-full border-2 border-[#3A151B] border-r-[#FFB000] border-t-[#FF1E3C]"
      />
      <div className="mt-5 text-sm font-semibold text-[#FFB000]">{label}</div>
      <h2 className="mt-2 text-2xl font-semibold text-white">{title}</h2>
      <p className="mt-3 text-sm leading-6 text-[#D9A7AF]">{message}</p>
    </div>
  );
}

export function ArenaLoading({ title, message, label, mode = "panel" }: ArenaLoadingProps) {
  if (mode === "modal") {
    return (
      <div className="fixed inset-0 z-[60] grid place-items-center bg-[#0B0506]/88 px-4 py-6">
        <section className="max-h-[calc(100vh-2rem)] w-full max-w-md overflow-y-auto rounded-lg border border-[#3A151B] bg-[#18090B] p-6">
          <ArenaLoadingContent title={title} message={message} label={label} />
        </section>
      </div>
    );
  }

  return (
    <section className="mx-auto max-w-2xl rounded-lg border border-[#3A151B] bg-[#18090B] p-6">
      <ArenaLoadingContent title={title} message={message} label={label} />
    </section>
  );
}
