import { svgbgIcon } from "../ui/Icons";
import { IconMeta } from "../../types";

function SvgBg() {
  const Icon = svgbgIcon;
  return (
    <span className="svg-bg size-24 sm:size-53.5" aria-label="svgbg">
      <Icon />
    </span>
  );
}

interface IconPreviewProps {
  icon: IconMeta;
  activeIconPath: string;
  activeSvg: string;
  loading: boolean;
}

export function IconPreview({
  icon,
  activeIconPath,
  activeSvg,
  loading,
}: IconPreviewProps) {
  return (
    <div className="p-4 flex justify-center items-center bg-zinc-950/50 rounded-xl border border-zinc-800 relative">
      <SvgBg />
      {loading ? (
        <div className="absolute lg:w-38 w-30 aspect-square flex items-center justify-center">
          <div className="size-6 rounded-full border-2 border-zinc-600 border-t-teal-400 animate-spin" />
        </div>
      ) : activeSvg ? (
        <img
          src={activeIconPath ? activeIconPath : undefined}
          alt={icon.name}
          className="sm:w-38 w-18 absolute"
        />
      ) : (
        <div className="lg:w-38 w-30 aspect-square flex items-center justify-center text-zinc-600 text-xs absolute">
          Not available
        </div>
      )}
    </div>
  );
}
