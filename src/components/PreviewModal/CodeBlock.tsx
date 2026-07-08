interface CodeBlockProps {
  code: string;
  loading: boolean;
}

export function CodeBlock({ code, loading }: CodeBlockProps) {
  return (
    <pre className="icon-svg-code scrollbar-none h-24 sm:h-30 bg-zinc-950 rounded-xl p-3 sm:p-4 text-xs text-blue-300 overflow-auto max-h-40 sm:max-h-52 font-jet border border-zinc-800">
      {loading ? (
        <div className="flex items-center justify-center py-4">
          <div className="size-6 rounded-full border-2 border-zinc-600 border-t-teal-400 animate-spin" />
        </div>
      ) : code ? (
        code
      ) : (
        <>Not available for this combination</>
      )}
    </pre>
  );
}
