import { CustomSelect } from "./ui/CustomSelect";
import { SelectOption } from "../types";
import { crossIcon, searchIcon } from "./ui/Icons";

function Icons({
  icon: Icon,
  ...props
}: React.ComponentPropsWithoutRef<"span"> & {
  icon: React.ComponentType<{ className?: string }>;
}) {
  return <Icon />;
}

interface FilterBarProps {
  modeOptions: SelectOption[];
  categoryOptions: SelectOption[];
  styleOptions: SelectOption[];
  selectedMode: string;
  selectedCategory: string;
  selectedStyle: string;
  onModeChange: (value: string) => void;
  onCategoryChange: (value: string) => void;
  onStyleChange: (value: string) => void;
  searchTerm: string;
  onSearchChange: (value: string) => void;
  hasActiveFilters: boolean;
  onClearFilters: () => void;
}

export function FilterBar({
  modeOptions,
  categoryOptions,
  styleOptions,
  selectedMode,
  selectedCategory,
  selectedStyle,
  onModeChange,
  onCategoryChange,
  onStyleChange,
  searchTerm,
  onSearchChange,
  hasActiveFilters,
  onClearFilters,
}: FilterBarProps) {
  return (
    <>
      <div className="flex flex-wrap gap-3 mb-8 justify-center lg:*:w-fit *:w-full">
        <CustomSelect
          options={modeOptions}
          value={selectedMode}
          onChange={onModeChange}
        />
        <CustomSelect
          options={categoryOptions}
          value={selectedCategory}
          onChange={onCategoryChange}
        />
        <CustomSelect
          options={styleOptions}
          value={selectedStyle}
          onChange={onStyleChange}
        />

        {hasActiveFilters && (
          <button
            onClick={onClearFilters}
            className="px-4 py-2.5 bg-zinc-800 text-zinc-300 rounded-xl text-sm font-medium hover:bg-zinc-700 transition-all duration-200 flex items-center gap-2 border border-zinc-700 cursor-pointer"
          >
            <Icons icon={crossIcon} />
            Clear Filters
          </button>
        )}
      </div>

      <div className="relative mb-8">
        <input
          type="text"
          placeholder="Search icons..."
          className="bg-zinc-700/15 ring ring-zinc-700 rounded-xl pl-10 pr-4 py-2.5 w-full text-sm text-zinc-200 placeholder:text-zinc-500 focus:ring-4 focus:ring-teal-400/10 focus:outline focus:outline-teal-400"
          value={searchTerm}
          onChange={(e) => onSearchChange(e.target.value)}
        />
        <Icons icon={searchIcon} />
      </div>
    </>
  );
}
