import {
  ListboxOption,
  ListboxOptions,
  ListboxButton,
  Listbox,
} from "@headlessui/react";
import { SelectOption } from "@/src/types";
import { selectArrowIcon, selectCheckedIcon } from "../ui/Icons";

interface CustomSelectProps {
  options: SelectOption[];
  value: string;
  onChange: (value: string) => void;
}

function Icons({
  icon: Icon,
  ...props
}: React.ComponentPropsWithoutRef<"span"> & {
  icon: React.ComponentType<{ className?: string }>;
}) {
  return <Icon />;
}

export function CustomSelect({ options, value, onChange }: CustomSelectProps) {
  const selectedOption =
    options.find((opt) => opt.value === value) || options[0];

  return (
    <Listbox value={value} onChange={onChange}>
      <div className="relative">
        <ListboxButton className="bg-zinc-800/90 ring ring-white/10 rounded-xl px-4 py-2.5 text-sm text-zinc-200 w-full min-w-64 text-left focus:outline-none transition-all flex items-center justify-between">
          <span>{selectedOption.label}</span>
          <Icons icon={selectArrowIcon} />
        </ListboxButton>

        <ListboxOptions
          transition
          className="list-box-options absolute z-10 mt-2 w-full bg-zinc-900 ring ring-white/10 rounded-xl py-1 shadow-lg focus:outline-none max-h-60 overflow-auto origin-top transition duration-200 ease-out data-closed:scale-95 data-closed:opacity-0"
        >
          {options.map((option) => (
            <ListboxOption
              key={option.value}
              value={option.value}
              className="group cursor-pointer rounded-lg flex items-center gap-x-2 select-none mx-1.5 px-1.5 py-2 text-sm data-selected:bg-zinc-800 data-selected:text-zinc-100"
            >
              <Icons icon={selectCheckedIcon} />
              {option.label}
            </ListboxOption>
          ))}
        </ListboxOptions>
      </div>
    </Listbox>
  );
}
