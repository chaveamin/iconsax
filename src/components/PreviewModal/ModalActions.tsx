interface ModalActionsProps {
  disabled: boolean;
  onCopy: () => void;
  onDownload: () => void;
}

export function ModalActions({
  disabled,
  onCopy,
  onDownload,
}: ModalActionsProps) {
  return (
    <div className="flex gap-3 justify-end border-t pt-6 border-zinc-800 bg-zinc-900 rounded-b-3xl">
      {/* Copy */}
      <button
        onClick={onCopy}
        disabled={disabled}
        className="cursor-pointer px-3 py-2.5 bg-zinc-800 text-zinc-200 rounded-xl text-sm font-medium hover:bg-zinc-700 transition-all duration-200 flex items-center gap-2 disabled:opacity-40 disabled:cursor-not-allowed"
        title="Copy code"
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

      {/* Download */}
      <button
        onClick={onDownload}
        disabled={disabled}
        className={`px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 flex items-center gap-2 cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed ${
          !disabled
            ? "bg-zinc-100 text-zinc-900 hover:bg-white"
            : "bg-zinc-700 text-zinc-500"
        }`}
        title="Download file"
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
      </button>
    </div>
  );
}
