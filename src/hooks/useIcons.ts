import { useState, useEffect, useMemo } from "react";
import { IconMeta, AnimatedIconMeta } from "../types";

export type IconType = "static" | "animated";

export function useIcons() {
  const [icons, setIcons] = useState<IconMeta[]>([]);
  const [animatedIcons, setAnimatedIcons] = useState<AnimatedIconMeta[]>([]);
  const [loading, setLoading] = useState(true);
  const [iconType, setIconType] = useState<IconType>("static");

  useEffect(() => {
    Promise.all([
      fetch("/icons-metadata.json").then((res) => res.json()),
      fetch("/icons-animated-metadata.json").then((res) => res.json()),
    ]).then(([staticData, animatedData]) => {
      setIcons(staticData);
      setAnimatedIcons(animatedData);
      setLoading(false);
    });
  }, []);

  const categories = useMemo(() => {
    const source = iconType === "static" ? icons : animatedIcons;
    const cats = new Set(source.map((i) => i.category));
    return ["all", ...Array.from(cats).sort()];
  }, [icons, animatedIcons, iconType]);

  return {
    icons,
    animatedIcons,
    loading,
    categories,
    iconType,
    setIconType,
  };
}
