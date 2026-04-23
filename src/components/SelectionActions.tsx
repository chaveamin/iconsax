interface SelectionActionsProps {
  selectedCount: number;
  onSelectAll: () => void;
  onClear: () => void;
  onDownload: () => void;
}

export function SelectionActions({
  selectedCount,
  onSelectAll,
  onClear,
  onDownload,
}: SelectionActionsProps) {
  return (
    <div className="flex lg:flex-row flex-col gap-3 my-8 justify-start">
      <button
        onClick={onSelectAll}
        className="px-5 py-2.5 bg-zinc-800 text-zinc-200 rounded-xl text-sm font-medium hover:bg-zinc-700 transition-all duration-200 cursor-pointer"
      >
        Select All
      </button>
      <button
        onClick={onClear}
        className="px-5 py-2.5 bg-zinc-800 text-zinc-200 rounded-xl text-sm font-medium hover:bg-zinc-700 transition-all duration-200 cursor-pointer"
      >
        Clear
      </button>
      <button
        onClick={onDownload}
        disabled={selectedCount === 0}
        className="px-5 py-2.5 bg-zinc-100 text-zinc-900 rounded-xl text-sm font-medium hover:bg-white disabled:opacity-40 disabled:cursor-not-allowed transition-all duration-200 cursor-pointer"
      >
        Download Selected ({selectedCount})
      </button>
    </div>
  );
}
