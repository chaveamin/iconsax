import { IconMeta } from "../types";
import { getDisplayName } from "../lib/utils";
import { useState, useEffect } from "react";

interface PreviewModalProps {
  icon: IconMeta | null;
  isOpen: boolean;
  svgContent: string;
  onClose: () => void;
  onCopy: () => void;
  allIcons: IconMeta[];
}

const MODES = ["straight", "rounded"] as const;
const STYLES = [
  "bold",
  "broken",
  "bulk",
  "linear",
  "outline",
  "twotone",
] as const;

type Mode = (typeof MODES)[number];
type Style = (typeof STYLES)[number];

export function PreviewModal({
  icon,
  isOpen,
  svgContent,
  onClose,
  onCopy,
  allIcons,
}: PreviewModalProps) {
  const [selectedMode, setSelectedMode] = useState<Mode>("straight");
  const [selectedStyle, setSelectedStyle] = useState<Style>("bold");
  const [activeSvg, setActiveSvg] = useState(svgContent);
  const [loadingVariant, setLoadingVariant] = useState(false);
  const getVariantPath = (mode: string, style: string): string => {
    if (!icon) return "";
    const baseName = icon.name.split("_")[0];
    const match = allIcons.find(
      (i) =>
        i.name.split("_")[0] === baseName &&
        i.category === icon.category &&
        i.mode === mode &&
        i.style === style,
    );
    return match ? match.path : "";
  };

  // Sync initial mode/style from the icon that was clicked
  useEffect(() => {
    if (icon) {
      setSelectedMode(icon.mode as Mode);
      setSelectedStyle(icon.style as Style);
    }
  }, [icon]);

  // Fetch SVG whenever mode/style/icon changes
  useEffect(() => {
    if (!icon) return;
    const baseName = icon.name.split("_")[0];
    const match = allIcons.find(
      (i) =>
        i.name.split("_")[0] === baseName &&
        i.category === icon.category &&
        i.mode === selectedMode &&
        i.style === selectedStyle,
    );
    const path = match?.path;
    if (!path) {
      setActiveSvg("");
      return;
    }
    setLoadingVariant(true);
    fetch(path)
      .then((res) => (res.ok ? res.text() : Promise.reject()))
      .then(setActiveSvg)
      .catch(() => setActiveSvg(""))
      .finally(() => setLoadingVariant(false));
  }, [icon, selectedMode, selectedStyle, allIcons]);

  // Keep activeSvg in sync when parent loads initial svgContent
  useEffect(() => {
    if (svgContent) setActiveSvg(svgContent);
  }, [svgContent]);

  const handleCopy = () => {
    navigator.clipboard.writeText(activeSvg);
    onCopy();
  };

  const activeIconPath = getVariantPath(selectedMode, selectedStyle);

  if (!icon) return null;

  return (
    <div
      className={`fixed inset-0 z-50 flex items-center justify-center p-4 transition-all duration-200 ${
        isOpen
          ? "bg-black/70 backdrop-blur-sm"
          : "bg-transparent pointer-events-none"
      }`}
      onClick={onClose}
    >
      <div
        className={`prev-modal flex items-start justify-center bg-zinc-900 p-8 border border-zinc-700 rounded-3xl w-full max-w-4xl max-h-[90vh] overflow-y-auto shadow-2xl transition-all duration-200 ${
          isOpen ? "scale-100 opacity-100" : "scale-95 opacity-0"
        }`}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex flex-col items-center gap-4 pr-5 w-[10%]">
          {/* Mode picker */}
          <div className="flex flex-col gap-y-2">
            {MODES.map((mode) => (
              <button
                key={mode}
                onClick={() => setSelectedMode(mode)}
                className={`px-4 py-2 rounded-xl text-sm font-medium transition-all duration-150 capitalize ${
                  selectedMode === mode
                    ? "bg-teal-500/20 text-teal-300 ring-1 ring-teal-500/50"
                    : "bg-zinc-800 text-zinc-400 hover:text-zinc-200 hover:bg-zinc-700"
                }`}
              >
                {mode}
              </button>
            ))}
          </div>

          {/* Style picker with mini previews */}
          <div className="flex flex-col gap-y-6">
            {STYLES.map((style) => {
              const variantPath = getVariantPath(selectedMode, style);
              return (
                <button
                  key={style}
                  onClick={() => setSelectedStyle(style)}
                  className={`flex flex-col items-center gap-2 p-3 rounded-xl border transition-all duration-150 cursor-pointer ${
                    selectedStyle === style
                      ? "border-teal-400 bg-teal-500/10 ring-1 ring-teal-500/30"
                      : "border-zinc-100/15 bg-zinc-800/40 hover:border-zinc-600 hover:bg-zinc-800/80"
                  }`}
                >
                  <img
                    src={variantPath ? variantPath : undefined}
                    alt={`${style} style`}
                    className="size-6 object-contain"
                    onError={(e) => {
                      (e.target as HTMLImageElement).style.opacity = "0.2";
                    }}
                  />
                  {/* <span
                      className={`text-[10px] font-medium capitalize ${
                        selectedStyle === style
                          ? "text-teal-300"
                          : "text-zinc-500"
                      }`}
                    >
                      {style}
                    </span> */}
                </button>
              );
            })}
          </div>
        </div>

        <div className="w-[90%] flex flex-col items-start gap-y-5 pl-5 *:w-full">
          {/* Header */}
          <div className="flex items-center justify-between border-b border-zinc-800 sticky top-0 bg-zinc-900 z-10 rounded-t-3xl">
            <h3 className="text-lg font-semibold text-zinc-100">
              {getDisplayName(icon.name)}
              <span className="ml-2 text-xs font-normal text-zinc-500">
                {selectedMode} &bull; {icon.category} &bull; {selectedStyle}
              </span>
            </h3>
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg hover:bg-zinc-800 text-zinc-400 hover:text-zinc-200 transition-colors cursor-pointer"
            >
              <svg
                className="size-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>

          {/* Large preview */}
          <div className="p-4 flex justify-center items-center bg-zinc-950/50 rounded-xl border border-zinc-800 relative">
            {loadingVariant ? (
              <div className="lg:w-38 w-30 aspect-square flex items-center justify-center">
                <div className="size-6 rounded-full border-2 border-zinc-600 border-t-teal-400 animate-spin" />
              </div>
            ) : activeSvg ? (
              <>
                <img
                  src={activeIconPath ? activeIconPath : undefined}
                  alt={icon.name}
                  className="lg:w-38 w-30 absolute"
                />
                <svg
                  className="svg-bg size-53.5"
                  viewBox="0 0 214 214"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    fill="oklch(27.4% 0.006 286.033)"
                    fillRule="evenodd"
                    clipRule="evenodd"
                    d="M77.1987 0C63.8049 0 53.7595 -1.01328e-06 45.7483 0.652846C37.7371 1.30569 31.7183 2.61977 26.4947 5.28974C17.3663 9.94263 9.94418 17.3636 5.29056 26.4905C2.62854 31.7217 1.31427 37.7312 0.652954 45.7412C-0.00836706 53.7511 5.10548e-06 63.82 5.10548e-06 77.1866V136.797C5.10548e-06 150.188 4.11272e-06 160.232 0.652954 168.25C1.3059 176.269 2.62854 182.278 5.29056 187.501C9.94276 196.631 17.3651 204.055 26.4947 208.71C31.7266 211.372 37.7371 212.686 45.7483 213.339C53.7595 213.992 63.83 214 77.2071 214H136.818C150.212 214 160.257 214 168.277 213.339C176.296 212.678 182.307 211.372 187.53 208.71C196.646 204.06 204.058 196.648 208.709 187.535C211.371 182.312 212.686 176.302 213.347 168.284C214.008 160.266 214 150.205 214 136.83V77.195C214 63.8033 214 53.7595 213.347 45.7495C212.694 37.7396 211.371 31.7217 208.709 26.4989C204.054 17.3707 196.628 9.94957 187.497 5.2981C182.273 2.62812 176.263 1.31406 168.243 0.661212C160.224 0.00836426 150.162 0.00836524 136.785 0.00836524H77.1987V0ZM27.0639 6.48662C32.0866 3.93382 37.8878 2.64487 45.8237 1.99203C51.6835 1.51494 58.6734 1.38939 67.3124 1.35591V14.1785H16.1396C19.3964 11.1079 23.075 8.51778 27.0639 6.48662ZM16.4409 15.526L41.8055 40.8867C49.248 33.5541 57.8704 27.5247 67.3124 23.0505V15.5177L16.4409 15.526ZM68.6602 15.526V22.4312C75.823 19.1772 83.3742 16.8566 91.1283 15.526H68.6602ZM122.821 15.526C130.579 16.8553 138.133 19.176 145.298 22.4312V15.526H122.821ZM145.298 14.1785H107.628V1.34754H145.298V14.1785ZM146.646 15.526V23.0589C156.086 27.5352 164.709 33.5644 172.153 40.895L197.517 15.5344L146.646 15.526ZM197.81 14.1785H146.646V1.35591C155.285 1.35591 162.275 1.51494 168.134 1.99203C176.07 2.64487 181.88 3.93382 186.886 6.48662C190.877 8.51362 194.556 11.1041 197.81 14.1785ZM106.305 14.1785H68.635V1.35591H106.305V14.1785ZM67.3124 24.5487C58.2328 28.9235 49.9373 34.766 42.7598 41.8408L66.8771 65.9543C67.0194 65.812 67.1617 65.6697 67.3124 65.5358V24.5487ZM68.6602 64.2803V23.9126C80.4751 18.4652 93.3199 15.6113 106.33 15.5428V49.6415C92.4102 49.7747 79.0165 54.9795 68.6602 64.2803ZM67.3124 68.6829H66.0818C56.4852 78.8925 51.0796 92.3371 50.9384 106.347H63.7714C63.8509 100.668 65.0543 95.0615 67.3124 89.8502V68.6829ZM65.9228 66.9001C65.7805 67.0424 65.6382 67.1847 65.5042 67.3354H24.4856C28.859 58.2559 34.7026 49.9613 41.7804 42.7866L65.9228 66.9001ZM89.814 67.3354H68.6602V66.105C78.8713 56.5099 92.3181 51.1051 106.33 50.9639V63.7949C100.644 63.8737 95.0304 65.0799 89.814 67.3437V67.3354ZM76.9057 75.973C79.8858 73.0722 83.2691 70.6168 86.9511 68.6829H69.6145L76.9057 75.973ZM106.305 68.6829H90.0903C85.5539 70.6833 81.4098 73.4749 77.8517 76.9272L106.314 105.385L106.305 68.6829ZM93.5559 67.3354H106.305V65.1424C101.967 65.2085 97.6653 65.9512 93.5559 67.3437V67.3354ZM107.653 105.368V68.6829H123.868C128.403 70.6814 132.545 73.4733 136.098 76.9272L107.653 105.368ZM107.653 67.3354H120.402C116.292 65.9457 111.991 65.2058 107.653 65.1424V67.3354ZM137.052 75.973C134.074 73.0708 130.69 70.6153 127.007 68.6829H144.386L137.052 75.973ZM124.144 67.3437H145.298V66.1133C135.087 56.5182 121.64 51.1135 107.628 50.9723V63.8033C113.313 63.8794 118.927 65.0828 124.144 67.3437ZM147.876 68.6829H146.646V89.8251C148.903 95.0455 150.106 100.66 150.187 106.347H163.02C162.874 92.3379 157.469 78.8947 147.876 68.6829ZM190.084 68.6829H149.701C159.015 79.0323 164.23 92.4253 164.367 106.347H198.472C198.398 93.3375 195.538 80.4947 190.084 68.6829ZM148.454 67.3354H189.473C185.099 58.2559 179.256 49.9613 172.178 42.7866L148.06 66.9001L148.454 67.3354ZM198.472 91.1475C197.138 83.3952 194.817 75.8456 191.565 68.6829H198.472V91.1475ZM190.937 67.3354H198.472V16.4718L173.099 41.8408C180.438 49.2796 186.471 57.9012 190.946 67.3437L190.937 67.3354ZM199.819 106.347V68.6829H212.644C212.644 71.3696 212.644 74.207 212.644 77.2201V106.347H199.819ZM199.819 67.3605H212.636C212.636 58.7144 212.476 51.734 211.999 45.8751C211.355 37.9405 210.057 32.1318 207.512 27.1183C205.475 23.1334 202.885 19.4563 199.819 16.1956V67.3605ZM40.8596 41.8408C33.5266 49.2809 27.4988 57.9024 23.029 67.3437H15.495V16.4718L40.8596 41.8408ZM14.1389 16.1789V67.3437H1.31427C1.31427 58.6977 1.47332 51.7172 1.95885 45.8583C2.60343 37.9237 3.90096 32.1151 6.44579 27.1015C8.48308 23.1167 11.073 19.4395 14.1389 16.1789ZM23.8661 68.6829H64.2486C54.9345 79.0323 49.7193 92.4253 49.5823 106.347H15.495C15.5635 93.3388 18.4179 80.496 23.8661 68.6829ZM15.495 68.6829H22.4012C19.1487 75.8483 16.8277 83.4007 15.495 91.1559V68.6829ZM1.32265 68.6829H14.1472V106.347H1.3059V77.2285C1.3059 74.2153 1.3059 71.378 1.31427 68.6829H1.32265ZM63.7798 107.67H50.9384C51.0813 121.679 56.4866 135.123 66.0818 145.334H67.3124V124.167C65.0544 118.958 63.8509 113.354 63.7714 107.678L63.7798 107.67ZM15.495 107.67H49.5991C49.7376 121.591 54.9526 134.984 64.2653 145.334H23.8661C18.4198 133.523 15.5655 120.683 15.495 107.678V107.67ZM1.31427 107.67H14.1472V145.334H1.31427C1.31427 142.65 1.31427 139.801 1.31427 136.788V107.67ZM65.1275 107.67H67.3208V120.417C65.9297 116.311 65.1869 112.013 65.1192 107.678L65.1275 107.67ZM67.3124 106.347H65.1192C65.1825 102.01 65.9225 97.709 67.3124 93.5999V106.347ZM68.6602 107.695V123.924C70.6598 128.46 73.452 132.604 76.9057 136.161L105.368 107.703L68.6602 107.695ZM105.351 106.347H68.6602V90.118C70.6647 85.587 73.4564 81.4469 76.9057 77.8897L105.351 106.347ZM108.607 107.695L137.069 136.152C140.514 132.595 143.3 128.455 145.298 123.924V107.678L108.607 107.695ZM145.298 106.347H108.607L137.069 77.8897C140.517 81.4516 143.308 85.5941 145.315 90.1264L145.298 106.347ZM146.646 107.695V120.442C148.031 116.332 148.771 112.032 148.839 107.695H146.646ZM148.839 106.347H146.646V93.5832C148.033 97.6987 148.773 102.005 148.839 106.347ZM150.187 107.695C150.103 113.37 148.9 118.974 146.646 124.183V145.334H147.876C157.469 135.122 162.874 121.679 163.02 107.67L150.187 107.695ZM164.367 107.695C164.229 121.616 159.014 135.009 149.701 145.359H190.084C195.531 133.546 198.385 120.703 198.455 107.695H164.367ZM199.819 107.695V145.359H212.644C212.644 142.675 212.644 139.826 212.644 136.813V107.678L199.819 107.695ZM24.5107 146.665H65.5293L65.9479 147.1L41.8055 171.213C34.7315 164.036 28.8883 155.742 24.5107 146.665ZM15.495 122.844C16.8283 130.599 19.1493 138.152 22.4012 145.317H15.495V122.844ZM23.029 146.665H15.495V197.528L40.8679 172.159C33.5321 164.723 27.5015 156.104 23.029 146.665ZM14.1556 146.665H1.31427C1.31427 155.302 1.47332 162.291 1.95885 168.15C2.60343 176.085 3.90096 181.893 6.44579 186.898C8.48106 190.885 11.0712 194.562 14.1389 197.821L14.1556 146.665ZM68.6769 147.895V146.665H89.8308C95.0413 148.918 100.645 150.121 106.322 150.205V163.036C92.3134 162.889 78.8715 157.485 68.6602 147.895H68.6769ZM69.6312 145.317H86.9846C83.3044 143.38 79.9214 140.925 76.9392 138.027L69.6312 145.317ZM106.322 148.858C101.984 148.79 97.6835 148.05 93.5727 146.665H106.322V148.858ZM90.107 145.317H106.322V108.632L77.86 137.09C81.4213 140.53 85.5615 143.315 90.0903 145.317H90.107ZM107.686 148.858V146.665H120.436C116.314 148.054 112.002 148.793 107.653 148.858H107.686ZM107.686 145.317H123.901C128.433 143.313 132.574 140.521 136.132 137.073L107.67 108.615L107.686 145.317ZM107.686 150.205C113.363 150.121 118.967 148.918 124.178 146.665H145.331V147.895C135.118 157.487 121.673 162.891 107.661 163.036L107.686 150.205ZM126.999 145.317H144.377L137.086 138.027C134.082 140.932 130.673 143.388 126.965 145.317H126.999ZM148.069 147.1L148.487 146.665H189.506C185.128 155.742 179.285 164.036 172.211 171.213L148.069 147.1ZM173.132 172.159C180.471 164.723 186.504 156.105 190.979 146.665H198.513V197.528L173.132 172.159ZM191.599 145.317H198.505V122.844C197.161 130.601 194.829 138.153 191.565 145.317H191.599ZM199.853 197.821V146.665H212.636C212.636 155.302 212.476 162.291 211.999 168.15C211.355 176.085 210.057 181.893 207.512 186.898C205.477 190.885 202.887 194.562 199.819 197.821H199.853ZM68.6602 87.0128V69.6371L75.9514 76.9272C73.0504 79.9225 70.5948 83.3191 68.6602 87.0128ZM68.6602 126.987V144.363L75.9514 137.073C73.0481 134.079 70.5924 130.682 68.6602 126.987ZM67.3124 148.473L66.8771 148.054L42.7598 172.159C49.9369 179.237 58.2324 185.082 67.3124 189.46V148.473ZM68.6602 190.096V149.72C79.0112 159.032 92.4063 164.247 106.33 164.384V198.482C93.3192 198.404 80.4752 195.545 68.6602 190.096ZM67.3124 190.933C57.8688 186.462 49.2458 180.432 41.8055 173.097L16.4409 198.466H67.3124V190.933ZM67.3124 199.813H16.1396C19.386 202.875 23.0499 205.462 27.0221 207.497C32.0448 210.049 37.846 211.347 45.7818 211.991C51.6416 212.468 58.6315 212.594 67.2705 212.627L67.3124 199.813ZM68.6602 199.813H106.33V212.644H68.6602V199.813ZM91.1283 198.466H68.6602V191.56C75.8236 194.816 83.3743 197.143 91.1283 198.482V198.466ZM107.653 199.813V212.644H145.323V199.83L107.653 199.813ZM145.323 198.466H122.821C130.578 197.132 138.131 194.812 145.298 191.56L145.323 198.466ZM146.671 199.813V212.644C155.31 212.644 162.3 212.485 168.16 212.008C176.095 211.363 181.905 210.066 186.911 207.513C190.901 205.487 194.579 202.899 197.835 199.83L146.671 199.813ZM197.542 198.466H146.646V190.933C156.088 186.459 164.711 180.43 172.153 173.097L197.542 198.466ZM107.653 15.526V49.6248C121.575 49.7625 134.969 54.9734 145.323 64.2803V23.9126C133.509 18.4602 120.664 15.6006 107.653 15.526ZM107.653 164.384V198.482C120.663 198.409 133.507 195.556 145.323 190.112V149.72C134.972 159.032 121.577 164.247 107.653 164.384ZM146.646 65.5358V24.5236C155.726 28.9082 164.021 34.759 171.198 41.8408L147.081 65.9543L146.646 65.5358ZM145.298 69.6371V87.0128C143.363 83.3319 140.907 79.9492 138.007 76.969L145.298 69.6371ZM145.298 126.987C143.362 130.668 140.907 134.05 138.007 137.031L145.298 144.321V126.987ZM146.646 189.46V148.447L147.081 148.029L171.198 172.159C164.02 179.235 155.724 185.08 146.646 189.46Z"
                  ></path>
                </svg>
              </>
            ) : (
              <div className="lg:w-38 w-30 aspect-square flex items-center justify-center text-zinc-600 text-xs">
                Not available
              </div>
            )}
          </div>

          <div className="space-y-5">
            {/* SVG Code */}
            <div>
              <pre className="icon-svg-code bg-zinc-950 rounded-xl p-4 text-xs text-blue-300 overflow-auto max-h-40 font-jet border border-zinc-800">
                {loadingVariant ? (
                  <div className="lg:w-38 w-30 aspect-square flex items-center justify-center">
                    <div className="size-6 rounded-full border-2 border-zinc-600 border-t-teal-400 animate-spin" />
                  </div>
                ) : activeSvg ? (
                  activeSvg
                ) : (
                  <>Not available for this combination</>
                )}
              </pre>
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-3 justify-end border-t pt-6 border-zinc-800 sticky bottom-0 bg-zinc-900 rounded-b-3xl">
            <button
              onClick={handleCopy}
              disabled={!activeSvg}
              className="cursor-pointer px-3 py-2.5 bg-zinc-800 text-zinc-200 rounded-xl text-sm font-medium hover:bg-zinc-700 transition-all duration-200 flex items-center gap-2 disabled:opacity-40 disabled:cursor-not-allowed"
              title="Copy SVG code"
            >
              <svg
                className="size-6"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <g clipPath="url(#clip0_4482_14841)">
                  <path
                    d="M14.4501 2H9.56006C8.45549 2 7.56006 2.89543 7.56006 4V4.44C7.56006 5.54457 8.45549 6.44 9.56006 6.44H14.4501C15.5546 6.44 16.4501 5.54457 16.4501 4.44V4C16.4501 2.89543 15.5546 2 14.4501 2Z"
                    stroke="currentColor"
                    strokeWidth={2}
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <path
                    d="M16.4399 4.21973H16.8799C19.0899 4.21973 20.8799 6.00973 20.8799 8.21973V17.9997C20.8799 20.2097 19.0899 21.9997 16.8799 21.9997H7.10986C4.89986 21.9997 3.10986 20.2097 3.10986 17.9997V8.21973C3.10986 6.00973 4.89986 4.21973 7.10986 4.21973H7.54986"
                    stroke="currentColor"
                    strokeWidth={2}
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <path
                    d="M13.1099 17H15.3299"
                    stroke="currentColor"
                    strokeWidth={2}
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <path
                    d="M8.66992 11.4404L10.8899 13.6604L8.66992 15.8804"
                    stroke="currentColor"
                    strokeWidth={2}
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </g>
                <defs>
                  <clipPath id="clip0_4482_14841">
                    <rect width="24" height="24" fill="white" />
                  </clipPath>
                </defs>
              </svg>
            </button>
            <a
              href={activeSvg ? activeIconPath : undefined}
              download={
                activeSvg
                  ? `${getDisplayName(icon.name)}-${selectedMode}-${selectedStyle}.svg`
                  : undefined
              }
              aria-disabled={!activeSvg}
              className={`px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 flex items-center gap-2 ${
                activeSvg
                  ? "bg-zinc-100 text-zinc-900 hover:bg-white"
                  : "bg-zinc-700 text-zinc-500 pointer-events-none opacity-40"
              }`}
              title="Download SVG"
            >
              <svg
                className="size-6"
                viewBox="0 0 24 25"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <g clipPath="url(#clip0_3247_9481)">
                  <path
                    d="M12 4.67969V16.1697"
                    stroke="currentColor"
                    strokeWidth={2}
                    strokeMiterlimit="10"
                    strokeLinecap="round"
                  />
                  <path
                    d="M8.73999 12.9102L12 16.1702L15.26 12.9102"
                    stroke="currentColor"
                    strokeWidth={2}
                    strokeMiterlimit="10"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <path
                    d="M2.75 15.9902L3.90002 18.8702C4.40002 20.1102 5.89999 21.1302 7.23999 21.1302H16.76C18.1 21.1302 19.6 20.1102 20.1 18.8702L21.25 15.9902"
                    stroke="currentColor"
                    strokeWidth={2}
                    strokeMiterlimit="10"
                    strokeLinecap="round"
                  />
                </g>
                <defs>
                  <clipPath id="clip0_3247_9481">
                    <rect
                      width="24"
                      height="24"
                      fill="currentColor"
                      transform="translate(0 0.910156)"
                    />
                  </clipPath>
                </defs>
              </svg>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
