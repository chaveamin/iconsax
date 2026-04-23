import { useState, useEffect, useMemo } from "react";
import { IconMeta } from "../types";

export function useIcons() {
  const [icons, setIcons] = useState<IconMeta[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/icons-metadata.json")
      .then((res) => res.json())
      .then((data) => {
        setIcons(data);
        setLoading(false);
      });
  }, []);

  const categories = useMemo(() => {
    const cats = new Set(icons.map((i) => i.category));
    return ["all", ...Array.from(cats).sort()];
  }, [icons]);

  return { icons, loading, categories };
}
