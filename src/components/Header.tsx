export function Header({ count }: { count: number }) {
  return (
    <header className="mb-12 text-center">
      <h1 className="text-5xl tracking-widest font-black bg-linear-to-r from-zinc-50 to-zinc-200 bg-clip-text text-transparent">
        iconsax
      </h1>
      <p className="mt-2 text-zinc-100">
        <a
          href="https://app.iconsax.io/"
          target="_blank"
          className="text-blue-600"
        >
          iconsax
        </a>{" "}
        premium icons
        {count > 0 && (
          <span className="ml-2">
            <span className="text-zinc-600">&bull;</span>{" "}
            {count.toLocaleString()}
          </span>
        )}
      </p>
    </header>
  );
}
