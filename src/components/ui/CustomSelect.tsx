import {
  ListboxOption,
  ListboxOptions,
  ListboxButton,
  Listbox,
  Transition,
} from "@headlessui/react";
import { SelectOption } from "@/src/types";

interface CustomSelectProps {
  options: SelectOption[];
  value: string;
  onChange: (value: string) => void;
}

export function CustomSelect({ options, value, onChange }: CustomSelectProps) {
  const selectedOption =
    options.find((opt) => opt.value === value) || options[0];

  return (
    <Listbox value={value} onChange={onChange}>
      <div className="relative">
        <ListboxButton className="bg-zinc-900 border border-zinc-700 rounded-xl px-4 py-2.5 text-sm text-zinc-200 w-full min-w-64 text-left focus:outline-none focus:ring-2 focus:ring-zinc-500 transition-all flex items-center justify-between">
          <span>{selectedOption.label}</span>
          <svg
            className="size-4 text-zinc-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M19 9l-7 7-7-7"
            />
          </svg>
        </ListboxButton>
        <Transition
          enter="transition duration-100 ease-out"
          enterFrom="transform scale-95 opacity-0"
          enterTo="transform scale-100 opacity-100"
          leave="transition duration-75 ease-out"
          leaveFrom="transform scale-100 opacity-100"
          leaveTo="transform scale-95 opacity-0"
        >
          <ListboxOptions className="absolute z-10 mt-1 w-full bg-zinc-900 border border-zinc-700 rounded-xl py-1 shadow-lg focus:outline-none max-h-60 overflow-auto">
            {options.map((option) => (
              <ListboxOption
                key={option.value}
                value={option.value}
                className={({ active }) =>
                  `cursor-pointer select-none px-4 py-2 text-sm ${active ? "bg-zinc-800 text-zinc-100" : "text-zinc-300"}`
                }
              >
                {option.label}
              </ListboxOption>
            ))}
          </ListboxOptions>
        </Transition>
      </div>
    </Listbox>
  );
}
