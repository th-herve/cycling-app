import { useEffect, useState } from "react";

const MOBILE_BREAKPOINT = 768; // px

export function useIsMobile(): boolean {
  function checkIsMobile() {
    const width = window.innerWidth;

    return width < MOBILE_BREAKPOINT;
  }
  const [isMobile, setIsMobile] = useState<boolean>(() => {
    if (typeof window === "undefined") return false;
    return checkIsMobile();
  });

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(checkIsMobile());
    };

    handleResize();

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  return isMobile;
}
