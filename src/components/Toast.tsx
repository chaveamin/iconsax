import { toastIcon } from "./ui/Icons";

function Icons({
  icon: Icon,
  ...props
}: React.ComponentPropsWithoutRef<"span"> & {
  icon: React.ComponentType<{ className?: string }>;
}) {
  return <Icon />;
}

interface ToastProps {
  visible: boolean;
  message: string;
}

export function Toast({ visible, message }: ToastProps) {
  return (
    <div
      className={`fixed bottom-6 left-1/2 -translate-x-1/2 z-100 transition-all duration-300 ease-out
        ${visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4 pointer-events-none"}`}
    >
      <div className="bg-zinc-800 border border-zinc-700 rounded-xl px-5 py-2.5 shadow-xl flex items-center gap-2">
        <Icons icon={toastIcon} />
        <span className="text-sm text-zinc-200">{message}</span>
      </div>
    </div>
  );
}
