import { useEffect, useMemo, useState } from "react";

export function useBoardColumnMeta() {
  const [screenWidth, setScreenWidth] = useState(0);

  useEffect(() => {
    let timeoutId: ReturnType<typeof setTimeout> | undefined;
    const syncScreenWidth = () => {
      setScreenWidth(window.innerWidth);
    };

    const handleResize = () => {
      if (timeoutId) clearTimeout(timeoutId);
      timeoutId = setTimeout(syncScreenWidth, 50);
    };

    const frameId = window.requestAnimationFrame(syncScreenWidth);
    window.addEventListener("resize", handleResize);

    return () => {
      window.cancelAnimationFrame(frameId);
      window.removeEventListener("resize", handleResize);
      if (timeoutId) clearTimeout(timeoutId);
    };
  }, []);

  const columnMeta = useMemo(() => {
    if (screenWidth < 576) return { count: 1, gap: 0 };
    if (screenWidth < 768) return { count: 2, gap: 2 };
    if (screenWidth < 992) return { count: 2, gap: 6 };
    if (screenWidth < 1200) return { count: 3, gap: 2 };
    return { count: Math.floor(screenWidth / 380), gap: 4 };
  }, [screenWidth]);

  return columnMeta;
}
