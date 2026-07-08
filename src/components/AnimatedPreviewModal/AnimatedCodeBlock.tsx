"use client";

import { useState } from "react";

interface AnimatedCodeBlockProps {
  code: string;
}

export function AnimatedCodeBlock({ code }: AnimatedCodeBlockProps) {
  const displayCode = code;

  return (
    <div className="mb-5">
      <span className="text-xs text-zinc-500 font-medium">JSON</span>
      <pre className="h-30 text-pretty scrollbar-none bg-zinc-950 rounded-xl p-4 text-xs text-blue-300 overflow-auto max-h-52 font-jet border border-zinc-800">
        {displayCode}
      </pre>
    </div>
  );
}
