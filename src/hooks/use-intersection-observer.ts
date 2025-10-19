import { useEffect, useRef, useState } from "react";

export const useIntersectionObserver = (options?: IntersectionObserverInit) => {
  const [isIntersecting, setIsIntersecting] = useState(false);
  const targetRef = useRef<HTMLDivElement>(null);

  // Stringify options to create a stable dependency
  const optionsString = JSON.stringify(options);

  useEffect(() => {
    const parsedOptions = JSON.parse(optionsString) as
      | IntersectionObserverInit
      | undefined;

    const observer = new IntersectionObserver(([entry]) => {
      setIsIntersecting(entry.isIntersecting);
    }, parsedOptions);

    if (targetRef.current) {
      observer.observe(targetRef.current);
    }

    return () => observer.disconnect();
  }, [optionsString]);

  return { targetRef, isIntersecting };
};
