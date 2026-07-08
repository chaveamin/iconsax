"use client";

import { useEffect, useRef } from "react";
import lottie, { type AnimationItem } from "lottie-web";

interface AnimatedIconProps {
  path: string;
  size?: number;
  className?: string;
}

export function AnimatedIcon({
  path,
  size = 24,
  className = "",
}: AnimatedIconProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const animRef = useRef<AnimationItem | null>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    let cancelled = false;

    fetch(path)
      .then((res) => res.json())
      .then((data) => {
        if (cancelled || !containerRef.current) return;

        if (animRef.current) {
          animRef.current.destroy();
        }

        animRef.current = lottie.loadAnimation({
          container: containerRef.current,
          renderer: "svg",
          loop: true,
          autoplay: true,
          animationData: data,
        });
      });

    return () => {
      cancelled = true;
      if (animRef.current) {
        animRef.current.destroy();
        animRef.current = null;
      }
    };
  }, [path]);

  return (
    <div
      ref={containerRef}
      className={className}
      style={{ width: size, height: size }}
    />
  );
}
