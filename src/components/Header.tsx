export function Header() {
  return (
    <header className="mb-12 text-center">
      <h1 className="text-5xl tracking-widest font-black bg-linear-to-r from-zinc-50 to-zinc-200 bg-clip-text text-transparent">
        iconsax
      </h1>
      <p className="mt-2 text-zinc-100">
        All{" "}
        <a
          href="https://app.iconsax.io/"
          target="_blank"
          className="text-blue-600"
        >
          iconsax
        </a>{" "}
        premium icons
      </p>
    </header>
  );
}
